#!/usr/bin/env python3
"""Semantic validator for Impilo-clone PageSpecs: everything JSON Schema cannot express.

Layer 1: Draft-07 validation against schema/pagespec.schema.json (all errors reported as rule SCHEMA).
Layer 2: the rules of compatibility/graph.json. Every rule id there has exactly one function in RULES
         below (verify_all.py fails if the two sets differ); severity is READ from graph.json.

Usage: python3 schema/semantic_validate.py path/to/pagespec.json [...]
Exit code 1 if any error-severity finding.
"""
import json, os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as f:
        return json.load(f)


class Ctx:
    def __init__(self):
        self.schema = load("schema/pagespec.schema.json")
        self.graph = load("compatibility/graph.json")
        self.rules = {r["id"]: r for r in self.graph["rules"]}
        self.templates = load("templates/templates.json")["templates"]
        self.routes = load("templates/routes.json")["routes"]
        self.sections = {}
        for f in sorted(os.listdir(os.path.join(REPO, "sections"))):
            if f.endswith(".json"):
                s = load("sections/" + f)
                self.sections[s["id"]] = s
        self.mp = load("tokens/00-foundation/motion-patterns.json")
        self.roles = load("assets/asset-roles.json")["roles"]
        self.registry = load("assets/asset-registry.json")["files"]
        self.blog = load("data/blog-posts.json")
        self.posts = {p["slug"]: p for p in self.blog["posts"]}


_CTX = None


def ctx():
    global _CTX
    if _CTX is None:
        _CTX = Ctx()
    return _CTX


def words(s):
    return len(s.split())


# ---------------------------------------------------------------- helpers
def walk_path(value, path):
    """Yield (concrete_path, string) for a maxWords path like 'blocks[type=textItems].items[].title'."""
    tokens = path.split(".") if path else []

    def rec(v, i, where):
        if i == len(tokens):
            if isinstance(v, str):
                yield where, v
            return
        m = re.fullmatch(r"([A-Za-z0-9_-]+)(\[\]|\[type=([A-Za-z0-9_-]+)\])?", tokens[i])
        name, br, typ = m.group(1), m.group(2), m.group(3)
        if not isinstance(v, dict) or name not in v:
            return
        nxt = v[name]
        if br is None:
            yield from rec(nxt, i + 1, f"{where}.{name}")
        elif isinstance(nxt, list):
            for j, item in enumerate(nxt):
                if typ is None or (isinstance(item, dict) and item.get("type") == typ):
                    yield from rec(item, i + 1, f"{where}.{name}[{j}]")

    yield from rec(value, 0, "content")


def all_hrefs(obj, where="content"):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == "href" and isinstance(v, str):
                yield where + ".href", v
            else:
                yield from all_hrefs(v, f"{where}.{k}")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from all_hrefs(v, f"{where}[{i}]")


def all_media(obj, where="content"):
    if isinstance(obj, dict):
        if "assetRole" in obj and "alt" in obj:
            yield where, obj
        for k, v in obj.items():
            yield from all_media(v, f"{where}.{k}")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from all_media(v, f"{where}[{i}]")


def route_entry(path):
    c = ctx()
    for r in c.routes:
        if r["path"] == path:
            return r
    m = re.fullmatch(r"/blog/([a-z0-9-]+)/", path or "")
    if m and m.group(1) in c.posts:
        return next(r for r in c.routes if r["path"] == "/blog/:slug/")
    return None


def internal_route_ok(href):
    path = href.split("?")[0]
    if not path.endswith("/"):
        path += "/"
    return route_entry(path) is not None


def content_sections(spec):
    return [(i, n) for i, n in enumerate(spec.get("nodes", [])) if n.get("section") == "content.section"]


# ---------------------------------------------------------------- rules (id -> fn(spec) -> [messages])
def r_header_first(spec):
    n = spec.get("nodes", [])
    return [] if n and n[0].get("section") == "shell.header" else ["first node must be shell.header"]


def r_footer_last(spec):
    n = spec.get("nodes", [])
    return [] if n and n[-1].get("section") == "shell.footer" else ["last node must be shell.footer"]


def r_template_sequence(spec):
    c = ctx()
    t = c.templates.get(spec.get("template"))
    if not t:
        return [f"unknown template {spec.get('template')!r}"]
    got = [n.get("section") for n in spec.get("nodes", [])]
    errs, i = [], 0
    for tn in t["nodes"]:
        lo = tn.get("min", 1 if tn["required"] else 0) if tn["repeatable"] else (1 if tn["required"] else 0)
        hi = tn.get("max", 99) if tn["repeatable"] else 1
        cnt = 0
        while i < len(got) and got[i] == tn["section"] and cnt < hi:
            cnt += 1
            i += 1
        if cnt < lo:
            errs.append(f"template {spec['template']!r} requires {lo}x {tn['section']} at this position, found {cnt}" + (f" (next node: {got[i]!r})" if i < len(got) else ""))
        if tn["repeatable"] and i < len(got) and got[i] == tn["section"]:
            errs.append(f"{tn['section']} repeated more than max {hi}")
            while i < len(got) and got[i] == tn["section"]:
                i += 1
    if i < len(got):
        errs.append(f"nodes not in template {spec['template']!r} sequence: {got[i:]}")
    return errs


def r_route_binding(spec):
    c = ctx()
    route, tpl = spec.get("route"), spec.get("template")
    e = route_entry(route)
    if e is None:
        return [] if tpl == "not-found" else [f"route {route!r} is not a known route (only template not-found may use an unknown path)"]
    if e["template"] != tpl:
        return [f"route {route!r} is bound to template {e['template']!r}, PageSpec declares {tpl!r}"]
    return []


def r_one_hero(spec):
    c = ctx()
    heroes = [n["section"] for n in spec.get("nodes", []) if c.sections.get(n.get("section"), {}).get("category") == "hero"]
    nohero = set(c.rules["ONE_HERO"]["exceptions"]["noHeroTemplates"])
    if len(heroes) > 1:
        return [f"{len(heroes)} hero nodes ({heroes}); max 1"]
    if not heroes and spec.get("template") not in nohero:
        return [f"template {spec.get('template')!r} needs exactly one hero"]
    if heroes and spec.get("template") in nohero:
        return [f"template {spec.get('template')!r} is a no-hero template but has {heroes}"]
    return []


def r_template_lock(spec):
    c = ctx()
    out = []
    for i, n in enumerate(spec.get("nodes", [])):
        s = c.sections.get(n.get("section"))
        if s and s["templates"] != "*" and spec.get("template") not in s["templates"]:
            out.append(f"nodes[{i}] {s['id']} is locked to templates {s['templates']}")
    return out


def r_home_only(spec):
    c = ctx()
    return [f"nodes[{i}] {n['section']} is homeRouteOnly but route is {spec.get('route')!r}" for i, n in enumerate(spec.get("nodes", []))
            if c.sections.get(n.get("section"), {}).get("constraints", {}).get("homeRouteOnly") and spec.get("route") != "/"]


def r_no_outbound(spec):
    out = []
    for i, n in enumerate(spec.get("nodes", [])):
        for where, href in all_hrefs(n.get("content", {})):
            if href.startswith(("mailto:", "tel:")):
                continue
            if not href.startswith("/") or href.startswith("//"):
                out.append(f"nodes[{i}].{where} {href!r} is not internal/mailto/tel")
            elif not internal_route_ok(href):
                out.append(f"nodes[{i}].{where} {href!r} does not resolve to a known route")
    return out


def r_forms_local(spec):
    out = []

    def rec(o, where):
        if isinstance(o, dict):
            if "submission" in o and o["submission"] != "local-fake":
                out.append(f"{where}.submission = {o['submission']!r} (must be 'local-fake')")
            for k, v in o.items():
                rec(v, f"{where}.{k}")
        elif isinstance(o, list):
            for j, v in enumerate(o):
                rec(v, f"{where}[{j}]")
    for i, n in enumerate(spec.get("nodes", [])):
        rec(n.get("content", {}), f"nodes[{i}].content")
    req = {"request-demo.panel": ("form", "submission"), "blog.index": ("newsletter", "submission")}
    for i, n in enumerate(spec.get("nodes", [])):
        if n.get("section") in req:
            a, b = req[n["section"]]
            if n.get("content", {}).get(a, {}).get(b) != "local-fake":
                out.append(f"nodes[{i}] {n['section']} must declare {a}.{b} = 'local-fake'")
    return out


def r_header_cta(spec):
    want = "hidden" if spec.get("template") == "request-demo" else "shown"
    return [f"shell.header.cta must be {want!r} on template {spec.get('template')!r}" for n in spec.get("nodes", [])
            if n.get("section") == "shell.header" and n.get("content", {}).get("cta") != want]


def _blocks(n):
    return [b.get("type") for b in n.get("content", {}).get("blocks", [])]


def r_alternation(spec):
    cs = content_sections(spec)
    out = []
    for (i, a), (j, b) in zip(cs, cs[1:]):
        if a.get("variant") == b.get("variant"):
            exc = a.get("variant") == "dark" and _blocks(a) == ["carousel"] and len(_blocks(b)) == 1 and _blocks(b)[0] in ("cta", "callToAction")
            if not exc:
                out.append(f"nodes[{i}] and nodes[{j}] are both {a.get('variant')!r}")
    return out


def r_first_light(spec):
    cs = content_sections(spec)
    return [f"first content.section (nodes[{cs[0][0]}]) is {cs[0][1].get('variant')!r}"] if cs and cs[0][1].get("variant") != "light" else []


def _block_rule(btype, variant):
    def fn(spec):
        return [f"nodes[{i}] {btype} block inside a {n.get('variant')!r} section" for i, n in content_sections(spec) if btype in _blocks(n) and n.get("variant") != variant]
    return fn


def r_cta_last(spec):
    cs = content_sections(spec)
    out = []
    for k, (i, n) in enumerate(cs):
        if "callToAction" in _blocks(n) and (k != len(cs) - 1 or _blocks(n) != ["callToAction"]):
            out.append(f"nodes[{i}] callToAction must be the only block of the last content.section")
    return out


def r_cta_text_dark(spec):
    out = []
    for i, n in content_sections(spec):
        for b in n.get("content", {}).get("blocks", []):
            if b.get("type") == "callToAction" and b.get("text") and n.get("variant") == "dark" and not b.get("light"):
                out.append(f"nodes[{i}] callToAction with text in a dark section must set light:true")
    return out


def r_carousel_last(spec):
    out = []
    for i, n in content_sections(spec):
        for b in n.get("content", {}).get("blocks", []):
            if b.get("type") == "carousel":
                cards = b.get("cards", [])
                if cards and (cards[-1].get("text") or cards[-1].get("subtitle") != "And Much More"):
                    out.append(f"nodes[{i}] last carousel card must be the title-only 'And Much More' card")
                for k, cd in enumerate(cards[:-1]):
                    if not cd.get("text"):
                        out.append(f"nodes[{i}] carousel card {k} needs text")
    return out


def r_subtitle_two_col(spec):
    return [f"nodes[{i}] subtitle without a twoColumn block" for i, n in content_sections(spec) if n.get("content", {}).get("subtitle") and "twoColumn" not in _blocks(n)]


def r_step_accent(spec):
    out = []
    for i, n in enumerate(spec.get("nodes", [])):
        if n.get("section") == "home.how-it-works":
            steps = n.get("content", {}).get("steps", [])
            if [s.get("accent") for s in steps] != ["blue", "green", "blue", "green"][: len(steps)]:
                out.append(f"nodes[{i}] step accents must alternate blue/green")
            if [k for k, s in enumerate(steps) if "link" in s] not in ([], [1]):
                out.append(f"nodes[{i}] only step 2 may carry a link")
    return out


def r_asset_policy(spec):
    c = ctx()
    files = {f["url"]: f["assetRole"] for f in c.registry if f.get("url")}
    out = []
    for i, n in enumerate(spec.get("nodes", [])):
        s = c.sections.get(n.get("section"))
        if not s:
            continue
        for where, m in all_media(n.get("content", {})):
            role, asset = m.get("assetRole"), m.get("asset")
            r = c.roles.get(role)
            if r is None:
                out.append(f"nodes[{i}].{where} unknown assetRole {role!r}")
                continue
            if role not in s["assets"]:
                out.append(f"nodes[{i}].{where} assetRole {role!r} not allowed in {s['id']} (allowed {s['assets']})")
            if r.get("restrictedTo") and s["id"] not in r["restrictedTo"]:
                out.append(f"nodes[{i}].{where} {role} is restricted to {r['restrictedTo']}")
            pol = r["generationPolicy"]
            if pol == "placeholder-only" and (asset or not m.get("placeholder")):
                out.append(f"nodes[{i}].{where} {role} is placeholder-only: set placeholder:true and no asset")
            if pol in ("must-reuse-exact", "must-not-fabricate"):
                if not asset:
                    out.append(f"nodes[{i}].{where} {role} ({pol}) must reference a registered file")
                elif files.get(asset) != role:
                    out.append(f"nodes[{i}].{where} asset {asset!r} is not a registered {role} file")
            if pol == "may-generate-new" and asset and files.get(asset) != role:
                out.append(f"nodes[{i}].{where} asset {asset!r} is not a registered {role} file")
    return out


def r_blog_refs(spec):
    c = ctx()
    out = []
    post = None
    for i, n in enumerate(spec.get("nodes", [])):
        ct = n.get("content", {})
        if n.get("section") == "blog.post":
            post = c.posts.get(ct.get("slug"))
            if spec.get("route") != f"/blog/{ct.get('slug')}/":
                out.append(f"nodes[{i}] blog.post slug {ct.get('slug')!r} does not match route {spec.get('route')!r}")
        if n.get("section") == "blog.index":
            order = c.blog["order"]
            if ct.get("featuredPost") != order[0]:
                out.append(f"nodes[{i}] featuredPost must be the newest post {order[0]!r}")
            if ct.get("listedPosts") != order[1:]:
                out.append(f"nodes[{i}] listedPosts must be the remaining posts newest-first")
            if sorted(ct.get("categories", [])) != sorted(c.blog["categories"]):
                out.append(f"nodes[{i}] categories must be the registry categories")
    for i, n in enumerate(spec.get("nodes", [])):
        if n.get("section") == "blog.related" and post:
            ct = n.get("content", {})
            if post["relatedArticles"]:
                want_h, want_p = "Related Articles", post["relatedArticles"]
            else:
                want_h, want_p = "Recent Articles", [s for s in c.blog["order"] if s != post["slug"]][:2]
            if ct.get("heading") != want_h or ct.get("posts") != want_p:
                out.append(f"nodes[{i}] blog.related must be {want_h!r} {want_p}")
    return out


def r_legal_page(spec):
    e = route_entry(spec.get("route"))
    want = e.get("legalPage") if e else None
    return [f"nodes[{i}] legal.document.page {n['content'].get('page')!r} != route legalPage {want!r}" for i, n in enumerate(spec.get("nodes", []))
            if n.get("section") == "legal.document" and n.get("content", {}).get("page") != want]


def r_pin_budget(spec):
    c = ctx()
    pins = [n["section"] for n in spec.get("nodes", []) if any(c.mp["patterns"].get(p, {}).get("pinsScroll") for p in n.get("motion", {}).get("patterns", []))]
    return [f"{len(pins)} scroll-pinned nodes {pins} (budget 3)"] if len(pins) > 3 else []


def r_reduced_motion(spec):
    c = ctx()
    out = []
    for i, n in enumerate(spec.get("nodes", [])):
        s = c.sections.get(n.get("section"))
        m = n.get("motion")
        if not s:
            continue
        if not isinstance(m, dict) or "reducedMotionFallback" not in m:
            out.append(f"nodes[{i}] missing motion.reducedMotionFallback")
            continue
        if m["reducedMotionFallback"] != s["motion"]["reducedMotionFallback"]:
            out.append(f"nodes[{i}] reducedMotionFallback {m['reducedMotionFallback']!r} != contract {s['motion']['reducedMotionFallback']!r}")
        bad = [p for p in m.get("patterns", []) if p not in s["motion"]["allowedPatterns"]]
        if bad:
            out.append(f"nodes[{i}] motion patterns {bad} not allowed for {s['id']}")
    return out


def r_max_words(spec):
    c = ctx()
    out = []
    for i, n in enumerate(spec.get("nodes", [])):
        s = c.sections.get(n.get("section"))
        if not s:
            continue
        for path, b in s["content"]["maxWords"].items():
            for where, text in walk_path(n.get("content", {}), path):
                if words(text) > b["maxWords"]:
                    out.append(f"nodes[{i}].{where}: {words(text)} words > maxWords {b['maxWords']}")
    return out


RULES = {
    "SHELL_HEADER_FIRST": r_header_first, "SHELL_FOOTER_LAST": r_footer_last, "TEMPLATE_NODE_SEQUENCE": r_template_sequence,
    "ROUTE_TEMPLATE_BINDING": r_route_binding, "ONE_HERO": r_one_hero, "SECTION_TEMPLATE_LOCK": r_template_lock, "HOME_ROUTE_ONLY": r_home_only,
    "NO_OUTBOUND_LINKS": r_no_outbound, "FORMS_LOCAL_ONLY": r_forms_local, "HEADER_CTA_VARIANT": r_header_cta,
    "CONTENT_SURFACE_ALTERNATION": r_alternation, "FIRST_CONTENT_SECTION_LIGHT": r_first_light,
    "CAROUSEL_DARK_ONLY": _block_rule("carousel", "dark"), "OUTCOMES_LIGHT_ONLY": _block_rule("outcomes", "light"), "TWO_COLUMN_DARK_ONLY": _block_rule("twoColumn", "dark"),
    "CALL_TO_ACTION_LAST": r_cta_last, "CALL_TO_ACTION_TEXT_ON_DARK": r_cta_text_dark, "CAROUSEL_LAST_CARD_TITLE_ONLY": r_carousel_last,
    "SUBTITLE_WITH_TWO_COLUMN": r_subtitle_two_col, "STEP_ACCENT_ALTERNATION": r_step_accent, "ASSET_ROLE_POLICY": r_asset_policy,
    "BLOG_REFERENCES": r_blog_refs, "LEGAL_PAGE_ROUTE": r_legal_page, "SCROLL_PIN_BUDGET": r_pin_budget,
    "REDUCED_MOTION_FALLBACK": r_reduced_motion, "MAX_WORDS": r_max_words,
}


def schema_errors(spec):
    from jsonschema import Draft7Validator
    v = Draft7Validator(ctx().schema)
    return [f"{'/'.join(map(str, e.absolute_path)) or '<root>'}: {e.message[:200]}" for e in sorted(v.iter_errors(spec), key=lambda e: list(map(str, e.absolute_path)))]


def validate(spec):
    """Return (errors, warnings) as lists of (rule_id, message)."""
    errors = [("SCHEMA", m) for m in schema_errors(spec)]
    warnings = []
    for rid, fn in RULES.items():
        try:
            msgs = fn(spec)
        except Exception as exc:  # malformed spec already reported by SCHEMA; never crash
            msgs = [f"rule crashed on malformed input: {type(exc).__name__}: {exc}"] if not errors else []
        sev = ctx().rules[rid]["severity"]
        (errors if sev == "error" else warnings).extend((rid, m) for m in msgs)
    return errors, warnings


def main(paths):
    bad = 0
    for p in paths:
        spec = json.load(open(p, encoding="utf-8"))
        errs, warns = validate(spec)
        print(f"{os.path.basename(p)}: {len(errs)} error(s), {len(warns)} warning(s)")
        for rid, m in errs:
            print(f"  ERROR [{rid}] {m}")
        for rid, m in warns:
            print(f"  WARN  [{rid}] {m}")
        bad += bool(errs)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:] or [os.path.join(REPO, "schema", "example.pagespec.json")]))
