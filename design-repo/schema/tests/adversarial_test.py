#!/usr/bin/env python3
"""Adversarial suite: every rule must REJECT a mutated instance, and every real template/route
plus the bundled example must PASS (a validator that rejects everything is as broken as one that
rejects nothing).

Controls are synthesized generically: one minimal valid PageSpec per route in templates/routes.json,
built from that route's template node list and each section's own content schema - so a new template
or route is covered automatically. Mutations assert that a SPECIFIC rule id fires.

Usage: python3 schema/tests/adversarial_test.py [--quiet]
"""
import copy, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(REPO, "schema"))
sys.path.insert(0, os.path.join(REPO, "extraction"))
import semantic_validate as sv  # noqa: E402
import verify_all as va  # noqa: E402

C = sv.ctx()
DEFS = C.schema["definitions"]
REG = {}
for f in C.registry:
    if f.get("url"):
        REG.setdefault(f["assetRole"], f["url"])


def res(s):
    while isinstance(s, dict) and "$ref" in s:
        s = DEFS[s["$ref"].split("/")[-1]]
    return s


def media(roles, section):
    role = next((r for r in roles if r in C.sections[section]["assets"]), roles[0])
    pol = C.roles[role]["generationPolicy"]
    m = {"assetRole": role, "alt": "Placeholder"}
    if pol == "placeholder-only":
        m["placeholder"] = True
    elif pol in ("must-reuse-exact", "must-not-fabricate"):
        m["asset"] = REG[role]
    return m


def synth(schema, section, key=""):
    s = res(schema)
    if "allOf" in s and any(x.get("$ref", "").endswith("/media") for x in s["allOf"]):
        return media(s["allOf"][1]["properties"]["assetRole"]["enum"], section)
    if "oneOf" in s:
        return synth(s["oneOf"][0], section, key)
    if "const" in s:
        return copy.deepcopy(s["const"])
    if "enum" in s:
        return s["enum"][0]
    t = s.get("type")
    if t == "object":
        return {k: synth(v, section, k) for k, v in s.get("properties", {}).items() if k in s.get("required", [])}
    if t == "array":
        return [synth(s["items"], section, key) for _ in range(s.get("minItems", 1))]
    if t == "boolean":
        return False
    if t == "string":
        if "pattern" in s and s["pattern"].startswith("^(?:/"):
            return "/"
        if key == "date":
            return "January 1st, 2026"
        return "Placeholder"
    if key == "href":
        return "/"
    raise ValueError(f"cannot synthesize {s}")


def node(section, template, route, variant=None, idx=0):
    sc = C.sections[section]
    n = {"section": section, "content": synth(sc["content"]["schema"], section),
         "motion": {"patterns": [sc["motion"]["allowedPatterns"][0]], "reducedMotionFallback": sc["motion"]["reducedMotionFallback"]}}
    if sc["variants"]:
        n["variant"] = variant or sc["variants"][0]
    ct = n["content"]
    if section == "shell.header":
        ct["cta"] = "hidden" if template == "request-demo" else "shown"
    if section == "home.how-it-works":
        for i, st in enumerate(ct["steps"]):
            st["accent"] = ["blue", "green"][i % 2]
    if section == "legal.document":
        ct["page"] = sv.route_entry(route)["legalPage"]
    if section == "blog.index":
        ct.update(featuredPost=C.blog["order"][0], listedPosts=C.blog["order"][1:], categories=list(C.blog["categories"]))
    if section == "blog.post":
        ct["slug"] = route.split("/")[2]
    if section == "blog.related":
        p = C.posts[route.split("/")[2]]
        ct.update(heading="Related Articles", posts=p["relatedArticles"]) if p["relatedArticles"] else ct.update(heading="Recent Articles", posts=[s for s in C.blog["order"] if s != p["slug"]][:2])
    return n


def concrete(route):
    if route == "/blog/:slug/":
        return f"/blog/{C.blog['order'][0]}/"
    if route == "*":
        return "/missing-page/"
    return route


def spec_for(route):
    r = next(x for x in C.routes if x["path"] == route)
    path = concrete(route)
    t = C.templates[r["template"]]
    nodes = []
    for tn in t["nodes"]:
        if tn["repeatable"]:
            for k in range(tn.get("min", 1)):
                nodes.append(node(tn["section"], r["template"], path, variant=["light", "dark"][k % 2], idx=k))
        elif tn["required"]:
            nodes.append(node(tn["section"], r["template"], path))
    return {"pageSpecVersion": C.schema["properties"]["pageSpecVersion"]["const"], "template": r["template"], "route": path, "meta": {"title": "Placeholder"}, "nodes": nodes}


EXAMPLE = json.load(open(os.path.join(REPO, "schema", "example.pagespec.json"), encoding="utf-8"))


def ex():
    return copy.deepcopy(EXAMPLE)


def by_route(route):
    return spec_for(route)


def idx(spec, section, k=0):
    return [i for i, n in enumerate(spec["nodes"]) if n["section"] == section][k]


def m(fn, base=ex):
    def run():
        s = base()
        fn(s)
        return s
    return run


LONG = " ".join(["word"] * 40)
EXTRA_SECTION = lambda s: s["nodes"].insert(3, copy.deepcopy(s["nodes"][2]))

# (name, builder, expected rule ids - at least one must be among the ERROR rule ids)
MUTATIONS = [
    # ---- schema layer
    ("wrong_template_enum", m(lambda s: s.update(template="landing-page")), {"SCHEMA"}),
    ("wrong_pagespec_version", m(lambda s: s.update(pageSpecVersion="9.9.9")), {"SCHEMA"}),
    ("invented_section_alias", m(lambda s: s["nodes"][1].update(section="content.heroBanner")), {"SCHEMA"}),
    ("missing_motion", m(lambda s: s["nodes"][1].pop("motion")), {"SCHEMA"}),
    ("missing_reducedMotionFallback", m(lambda s: s["nodes"][1]["motion"].pop("reducedMotionFallback")), {"SCHEMA", "REDUCED_MOTION_FALLBACK"}),
    ("wrong_fallback_for_section", m(lambda s: s["nodes"][1]["motion"].update(reducedMotionFallback="static-paused")), {"SCHEMA", "REDUCED_MOTION_FALLBACK"}),
    ("invented_motion_field", m(lambda s: s["nodes"][1]["motion"].update(inventedAnimation="spin")), {"SCHEMA"}),
    ("disallowed_motion_pattern", m(lambda s: s["nodes"][1]["motion"].update(patterns=["hero-zoom-pin"])), {"SCHEMA", "REDUCED_MOTION_FALLBACK"}),
    ("extra_content_field", m(lambda s: s["nodes"][1]["content"].update(backgroundVideo="x")), {"SCHEMA"}),
    ("missing_required_content", m(lambda s: s["nodes"][1]["content"].pop("cta")), {"SCHEMA"}),
    ("invented_block_type", m(lambda s: s["nodes"][2]["content"]["blocks"][0].update(type="videoGrid")), {"SCHEMA"}),
    ("polymorphic_block_field_leak", m(lambda s: s["nodes"][3]["content"]["blocks"][0].update(items=[{"title": "a", "text": "b"}])), {"SCHEMA"}),
    ("variant_missing", m(lambda s: s["nodes"][2].pop("variant")), {"SCHEMA"}),
    ("variant_on_non_variant_section", m(lambda s: s["nodes"][1].update(variant="dark")), {"SCHEMA"}),
    ("external_href_https", m(lambda s: s["nodes"][2]["content"]["blocks"][1].update(href="https://example.com/")), {"SCHEMA", "NO_OUTBOUND_LINKS"}),
    ("external_href_protocol_relative", m(lambda s: s["nodes"][1]["content"]["cta"].update(href="//example.com/demo")), {"SCHEMA", "NO_OUTBOUND_LINKS"}),
    ("external_href_javascript", m(lambda s: s["nodes"][1]["content"]["cta"].update(href="javascript:alert(1)")), {"SCHEMA", "NO_OUTBOUND_LINKS"}),
    ("invented_asset_role", m(lambda s: s["nodes"][idx(s, "home.hero")]["content"]["illustration"].update(assetRole="stock.photo"), lambda: by_route("/")), {"SCHEMA"}),
    ("form_network_submission", m(lambda s: s["nodes"][1]["content"]["form"].update(submission="hubspot"), lambda: by_route("/request-demo/")), {"SCHEMA", "FORMS_LOCAL_ONLY"}),
    ("newsletter_network_submission", m(lambda s: s["nodes"][1]["content"]["newsletter"].update(submission="fetch"), lambda: by_route("/blog/")), {"SCHEMA", "FORMS_LOCAL_ONLY"}),
    ("share_buttons_navigate", m(lambda s: s["nodes"][1]["content"]["share"].update(navigates=True), lambda: by_route("/blog/:slug/")), {"SCHEMA"}),
    ("unknown_blog_slug", m(lambda s: s["nodes"][2]["content"].update(posts=["not-a-post"]), lambda: by_route("/blog/:slug/")), {"SCHEMA"}),
    ("partner_logo_outside_trusted", m(lambda s: s["nodes"][idx(s, "home.integrations")]["content"]["cards"][0].update(illustration={"assetRole": "partner.logo", "asset": REG["partner.logo"], "alt": "x"}), lambda: by_route("/")), {"SCHEMA", "ASSET_ROLE_POLICY"}),
    # ---- structural layer
    ("duplicate_hero", m(lambda s: s["nodes"].insert(2, copy.deepcopy(s["nodes"][1]))), {"TEMPLATE_NODE_SEQUENCE", "ONE_HERO"}),
    ("removed_mandatory_hero", m(lambda s: s["nodes"].pop(1)), {"TEMPLATE_NODE_SEQUENCE", "ONE_HERO"}),
    ("footer_moved_up", m(lambda s: s["nodes"].insert(1, s["nodes"].pop())), {"SHELL_FOOTER_LAST"}),
    ("header_not_first", m(lambda s: s["nodes"].insert(0, s["nodes"].pop(1))), {"SHELL_HEADER_FIRST"}),
    ("declared_template_mismatch", m(lambda s: s.update(template="about", route="/about/")), {"TEMPLATE_NODE_SEQUENCE", "SECTION_TEMPLATE_LOCK"}),
    ("route_bound_to_other_template", m(lambda s: s.update(route="/about/")), {"ROUTE_TEMPLATE_BINDING"}),
    ("unknown_route", m(lambda s: s.update(route="/pricing/")), {"ROUTE_TEMPLATE_BINDING"}),
    ("too_many_content_sections", m(lambda s: s["nodes"].insert(6, copy.deepcopy(s["nodes"][2]))), {"TEMPLATE_NODE_SEQUENCE"}),
    ("too_few_content_sections", m(lambda s: [s["nodes"].pop(4), s["nodes"].pop(4)]), {"TEMPLATE_NODE_SEQUENCE"}),
    ("foreign_template_section", m(lambda s: s["nodes"].insert(2, node("home.trusted", "home", "/"))), {"SECTION_TEMPLATE_LOCK", "HOME_ROUTE_ONLY", "TEMPLATE_NODE_SEQUENCE"}),
    ("unresolved_internal_href", m(lambda s: s["nodes"][2]["content"]["blocks"][1].update(href="/pricing/")), {"NO_OUTBOUND_LINKS"}),
    ("carousel_in_light_section", m(lambda s: s["nodes"][3].update(variant="light")), {"CAROUSEL_DARK_ONLY"}),
    ("outcomes_in_dark_section", m(lambda s: s["nodes"][4].update(variant="dark")), {"OUTCOMES_LIGHT_ONLY"}),
    ("two_column_in_light_section", m(lambda s: s["nodes"][2]["content"].update(blocks=[{"type": "twoColumn", "columns": [{"headline": "a", "items": [{"title": "a", "text": "b"}] * 2}] * 2}])), {"TWO_COLUMN_DARK_ONLY"}),
    ("call_to_action_not_last", m(lambda s: s["nodes"][2]["content"].update(blocks=[{"type": "callToAction", "label": "See how", "href": "/request-demo/"}])), {"CALL_TO_ACTION_LAST"}),
    ("call_to_action_text_on_dark_without_light", m(lambda s: s["nodes"][5]["content"].update(blocks=[{"type": "callToAction", "text": "A short closing invitation.", "label": "See how", "href": "/request-demo/"}])), {"CALL_TO_ACTION_TEXT_ON_DARK"}),
    ("carousel_last_card_with_text", m(lambda s: s["nodes"][3]["content"]["blocks"][0]["cards"][-1].update(text="Extra text")), {"CAROUSEL_LAST_CARD_TITLE_ONLY"}),
    ("header_cta_hidden_on_content_page", m(lambda s: s["nodes"][0]["content"].update(cta="hidden")), {"HEADER_CTA_VARIANT"}),
    ("header_cta_shown_on_request_demo", m(lambda s: s["nodes"][0]["content"].update(cta="shown"), lambda: by_route("/request-demo/")), {"HEADER_CTA_VARIANT"}),
    ("max_words_overflow_hero_title", m(lambda s: s["nodes"][1]["content"].update(title=" ".join(["Word"] * 13))), {"MAX_WORDS"}),
    ("max_words_overflow_polymorphic_card", m(lambda s: s["nodes"][3]["content"]["blocks"][0]["cards"][0].update(text=LONG)), {"MAX_WORDS"}),
    ("step_accents_not_alternating", m(lambda s: [st.update(accent="blue") for st in s["nodes"][idx(s, "home.how-it-works")]["content"]["steps"]], lambda: by_route("/")), {"STEP_ACCENT_ALTERNATION"}),
    ("real_person_photo_reused", m(lambda s: s["nodes"][idx(s, "about.leadership")]["content"]["people"][0].update(photo={"assetRole": "photo.person", "asset": REG["photo.person"], "alt": "x"}), lambda: by_route("/about/")), {"ASSET_ROLE_POLICY"}),
    ("editorial_cover_reused", m(lambda s: s["nodes"][1]["content"].update(cover={"assetRole": "photo.editorial-cover", "asset": REG["photo.editorial-cover"], "alt": "x"}), lambda: by_route("/blog/:slug/")), {"ASSET_ROLE_POLICY"}),
    ("fabricated_compliance_badge", m(lambda s: s["nodes"][idx(s, "home.white-glove")]["content"]["badges"][0].update(asset="/assets/images/iso-27001.webp"), lambda: by_route("/")), {"ASSET_ROLE_POLICY"}),
    ("badge_slot_pointing_at_partner_logo_file", m(lambda s: s["nodes"][idx(s, "home.white-glove")]["content"]["badges"][0].update(asset=REG["partner.logo"]), lambda: by_route("/")), {"ASSET_ROLE_POLICY"}),
    ("related_heading_inconsistent", m(lambda s: s["nodes"][2]["content"].update(heading="Recent Articles"), lambda: by_route("/blog/:slug/")), {"BLOG_REFERENCES"}),
    ("blog_index_wrong_featured", m(lambda s: s["nodes"][1]["content"].update(featuredPost=C.blog["order"][-1]), lambda: by_route("/blog/")), {"BLOG_REFERENCES"}),
    ("legal_page_mismatch", m(lambda s: s["nodes"][1]["content"].update(page="terms"), lambda: by_route("/privacy/")), {"LEGAL_PAGE_ROUTE"}),
    ("home_sections_on_other_route", m(lambda s: s.update(route="/about/"), lambda: by_route("/")), {"ROUTE_TEMPLATE_BINDING", "HOME_ROUTE_ONLY"}),
    ("hero_added_to_no_hero_template", m(lambda s: s["nodes"].insert(1, node("content.hero", "content-page", "/terms/")), lambda: by_route("/terms/")), {"TEMPLATE_NODE_SEQUENCE", "ONE_HERO"}),
]

# Warning-only cases: must produce the warning and NO error.
def _sections(new):
    def fn(s):
        n = s["nodes"]
        s["nodes"] = n[:2] + [copy.deepcopy(n[k]) if isinstance(k, int) else k for k in new] + n[6:]
    return fn


DARK_TEXT = {"section": "content.section", "variant": "dark", "content": {"title": "Placeholder", "blocks": [{"type": "textItems", "columns": 2, "items": [{"title": "a", "text": "b"}] * 2}]},
             "motion": {"patterns": ["text-reveal"], "reducedMotionFallback": "static-visible"}}
WARN_CASES = [
    ("alternation_two_light_sections_warns", m(_sections([2, 2, 3])), "CONTENT_SURFACE_ALTERNATION"),
    ("dark_carousel_then_dark_textitems_warns", m(_sections([2, 3, DARK_TEXT])), "CONTENT_SURFACE_ALTERNATION"),
]


def oems_shape():
    """Real /use-cases/oems/ shape: L outcomes+cta, D carousel, D cta -> the named alternation exception."""
    s = ex()
    s["route"] = "/use-cases/oems/"
    _sections([4, 3, 5])(s)
    return s


EXTRA_CONTROLS = [("oems_dark_dark_exception_passes_clean", oems_shape)]


def pin_budget_case():
    s = by_route("/solutions/")
    for k in ("solutions.hero", "solutions.explore", "solutions.support"):
        s["nodes"][idx(s, k)]["motion"]["patterns"] = ["stacked-pin-slide-up"] if k != "solutions.support" else ["card-stack-pin"]
    extra = copy.deepcopy(s["nodes"][idx(s, "solutions.hero")])
    s["nodes"].insert(2, extra)
    return s


# Catalog/contract-layer cases (no PageSpec field exists for these; mutate the loaded repo in memory).
def repo_case(fn, check):
    def run():
        r = copy.deepcopy(BASE_REPO)
        fn(r)
        return check(r)
    return run


BASE_REPO = va.Repo()
REPO_CASES = [
    ("pinned_policy_changed_to_other_valid_value", repo_case(lambda r: r.roles["roles"]["photo.person"].update(generationPolicy="may-generate-new"), va.check_asset_roles)),
    ("partner_logo_restriction_removed", repo_case(lambda r: r.roles["roles"]["partner.logo"].pop("restrictedTo"), va.check_asset_roles)),
    ("phantom_allowlist_section", repo_case(lambda r: r.allow["sections"].append("pricing.table"), va.check_allowlist_parity)),
    ("phantom_token_in_catalog", repo_case(lambda r: r.catalog["tokens"].update({"color.neonPink": {"file": "x", "type": "color"}}), va.check_tokens)),
    ("section_token_ref_unresolved", repo_case(lambda r: r.parts["sections"]["content.hero"]["tokens"].append("color.neonPink"), va.check_tokens)),
    ("maxwords_path_typo", repo_case(lambda r: r.parts["sections"]["content.hero"]["content"]["maxWords"].update({"subtitel": {"maxWords": 3}}), va.check_contracts)),
    ("manifest_count_drift", repo_case(lambda r: r.manifest["counts"].update(sections=r.manifest["counts"]["sections"] + 1), va.check_manifest_counts)),
    ("allowlist_version_drift", repo_case(lambda r: r.manifest.update(allowlistVersion="0.9.0"), va.check_versions)),
    ("entrypoint_outside_repo", repo_case(lambda r: r.manifest["entryPoints"].update(routesSource="../src/routes.jsx"), va.check_entrypoints)),
    ("schema_drift_from_contracts", repo_case(lambda r: r.schema["definitions"]["content_content__hero"]["properties"].update(videoUrl={"type": "string"}), va.check_schema_drift)),
]


def main(quiet=False):
    fails = 0
    say = (lambda *a: None) if quiet else print
    # controls
    controls = [("example.pagespec.json", ex)] + [(f"route {r['path']} ({r['template']})", (lambda p=r["path"]: by_route(p))) for r in C.routes] + EXTRA_CONTROLS
    for name, b in controls:
        errs, warns = sv.validate(b())
        ok = not errs and not warns
        fails += not ok
        say(f"[{'PASS' if ok else 'FAIL'}] control  {name}: {len(errs)} errors, {len(warns)} warnings")
        if not ok:
            for e in (errs + warns)[:8]:
                print("        ", e)
    for name, b, expect in MUTATIONS:
        errs, _ = sv.validate(b())
        rids = {r for r, _ in errs}
        ok = bool(errs) and bool(rids & expect)
        fails += not ok
        say(f"[{'PASS' if ok else 'FAIL'}] mutation {name}: rejected by {sorted(rids) or 'NOTHING'}")
    for name, b, rule in WARN_CASES:
        errs, warns = sv.validate(b())
        ok = not errs and any(r == rule for r, _ in warns)
        fails += not ok
        say(f"[{'PASS' if ok else 'FAIL'}] warn     {name}: errors={len(errs)} warnings={sorted({r for r, _ in warns})}")
        if not ok:
            for e in errs[:5]:
                print("        ", e)
    errs, warns = sv.validate(pin_budget_case())
    ok = any(r == "SCROLL_PIN_BUDGET" for r, _ in warns)
    fails += not ok
    say(f"[{'PASS' if ok else 'FAIL'}] warn     pin_budget_exceeded: SCROLL_PIN_BUDGET {'raised' if ok else 'NOT raised'}")
    for name, run in REPO_CASES:
        errs = run()
        ok = bool(errs)
        fails += not ok
        say(f"[{'PASS' if ok else 'FAIL'}] repo     {name}: {errs[0] if errs else 'NOT DETECTED'}")
    total = len(controls) + len(MUTATIONS) + len(WARN_CASES) + 1 + len(REPO_CASES)
    print(f"adversarial: {total - fails}/{total} passed ({len(controls)} controls, {len(MUTATIONS)} PageSpec mutations, {len(WARN_CASES) + 1} warn-only cases, {len(REPO_CASES)} repo-layer drift cases)")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main("--quiet" in sys.argv))
