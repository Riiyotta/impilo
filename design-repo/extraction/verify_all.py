#!/usr/bin/env python3
"""verify_all.py - every structural, drift and citation check for this design-repo, in one run.

Self-contained: the repo root is derived from this file's location. External evidence (the clone's
source tree) is looked up at $DESIGN_REPO_SOURCE_ROOT or, by default, the folder that contains
design-repo/. When it is absent (design-repo shipped standalone) the source-dependent checks
(citation resolution, asset coverage, copy-leak scan) degrade to WARNINGS, never failures.

Usage: python3 extraction/verify_all.py [--no-adversarial]
Exit 1 on any failure. extraction/prove_drift.py proves each drift check actually fails on bad input.
"""
import copy, json, os, re, subprocess, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, "schema"))

# Pinned values: compliance-critical asset roles must keep exactly these policies (membership in the
# closed policy enum is NOT enough - a different-but-valid value must fail).
EXPECTED_PINNED_POLICIES = {
    "partner.logo": "must-reuse-exact", "photo.person": "placeholder-only", "photo.editorial-cover": "placeholder-only",
    "compliance.badge": "must-not-fabricate", "product.ui-mock": "must-reuse-exact", "icon.social-mark": "must-reuse-exact", "font.typeface": "must-reuse-exact",
}
EXPECTED_RESTRICTIONS = {"partner.logo": ["home.trusted"]}
REF_RE = re.compile(r"^([A-Za-z0-9_./-]+):(\d+)(?:-(\d+))?$")
TEXT_EXT = (".json", ".md", ".py", ".txt")


def source_root():
    return os.environ.get("DESIGN_REPO_SOURCE_ROOT") or os.path.dirname(REPO)


def source_present():
    return os.path.exists(os.path.join(source_root(), "src", "routes.jsx"))


class Repo:
    """All repo data loaded once; checks take a Repo so tests can mutate a deep copy in memory."""

    def __init__(self, root=REPO):
        self.root = root
        L = lambda rel: json.load(open(os.path.join(root, rel), encoding="utf-8"))
        self.L = L
        self.manifest = L("registry.manifest.json")
        self.allow = L("tokens/llm/component-allowlist.json")
        self.catalog = L("tokens/llm/token-catalog.json")
        self.policy = L("tokens/llm/token-policy.json")
        self.graph = L("compatibility/graph.json")
        self.templates = L("templates/templates.json")["templates"]
        self.routes = L("templates/routes.json")
        self.roles = L("assets/asset-roles.json")
        self.registry = L("assets/asset-registry.json")
        self.mp = L("tokens/00-foundation/motion-patterns.json")
        self.schema = L("schema/pagespec.schema.json")
        self.example = L("schema/example.pagespec.json")
        self.parts = {}
        for d in ("sections", "primitives", "components"):
            self.parts[d] = {}
            for f in sorted(os.listdir(os.path.join(root, d))):
                if f.endswith(".json"):
                    obj = L(f"{d}/{f}")
                    self.parts[d][f[:-5]] = obj
        self.token_files = {}
        for base, _, fs in os.walk(os.path.join(root, "tokens")):
            for f in fs:
                rel = os.path.relpath(os.path.join(base, f), root)
                if f.endswith(".json") and "/llm" not in rel and "/themes" not in rel and f != "motion-patterns.json":
                    self.token_files[rel] = L(rel)

    @property
    def sections(self):
        return {s["id"]: s for s in self.parts["sections"].values()}


def flatten(obj, prefix=""):
    out = {}
    for k, v in obj.items():
        if k.startswith("$"):
            continue
        if isinstance(v, dict) and "$value" in v:
            out[prefix + k] = v
        elif isinstance(v, dict):
            out.update(flatten(v, prefix + k + "."))
    return out


def computed_counts(r):
    return {"tokens": len(r.catalog["tokens"]), "primitives": len(r.parts["primitives"]), "components": len(r.parts["components"]), "sections": len(r.parts["sections"]),
            "templates": len(r.templates), "routes": len(r.routes["routes"]), "assetRoles": len(r.roles["roles"]), "assetFiles": len(r.registry["files"]),
            "motionPatterns": len(r.mp["patterns"]), "graphRules": len(r.graph["rules"])}


# ------------------------------------------------------------------------------------------ checks
def check_schema_meta(r):
    from jsonschema import Draft7Validator
    try:
        Draft7Validator.check_schema(r.schema)
        return []
    except Exception as e:
        return [f"pagespec.schema.json is not valid draft-07: {e}"]


def check_schema_drift(r):
    import build_schema
    return [] if build_schema.build() == r.schema else ["schema/pagespec.schema.json drifted from the contracts (run schema/build_schema.py)"]


def check_example(r):
    from jsonschema import Draft7Validator
    errs = [f"schema: {e.message[:160]}" for e in Draft7Validator(r.schema).iter_errors(r.example)]
    import semantic_validate
    se, _ = semantic_validate.validate(r.example)
    return errs + [f"semantic [{rid}] {m}" for rid, m in se if rid != "SCHEMA"]


def check_allowlist_parity(r):
    out = []
    for kind in ("sections", "primitives", "components"):
        files = set(r.parts[kind]) if kind != "sections" else set(r.sections)
        listed = set(r.allow.get(kind, []))
        for x in sorted(listed - files):
            out.append(f"allowlist {kind}: phantom entry {x!r} (no contract file)")
        for x in sorted(files - listed):
            out.append(f"allowlist {kind}: contract {x!r} has no allowlist entry")
        for key, obj in r.parts[kind].items():
            if obj.get("id") != (key if kind != "sections" else obj.get("id")):
                out.append(f"{kind}/{key}.json id field {obj.get('id')!r} != filename")
    node_props = set(r.schema["definitions"]["node"]["properties"])
    if set(r.allow["nodeProperties"]) != node_props:
        out.append(f"allowlist nodeProperties {r.allow['nodeProperties']} != schema node properties {sorted(node_props)}")
    if set(r.allow["motionProperties"]) != set(r.schema["definitions"]["motion"]["properties"]):
        out.append("allowlist motionProperties != schema motion properties")
    if set(r.allow["mediaProperties"]) != set(r.schema["definitions"]["media"]["properties"]):
        out.append("allowlist mediaProperties != schema media properties")
    if set(r.allow["assetRoles"]) != set(r.roles["roles"]) or set(r.schema["definitions"]["media"]["properties"]["assetRole"]["enum"]) != set(r.roles["roles"]):
        out.append("assetRole enum differs between allowlist / schema / assets/asset-roles.json")
    return out


def check_versions(r):
    out = []
    if r.manifest.get("allowlistVersion") != r.allow.get("version"):
        out.append(f"manifest.allowlistVersion {r.manifest.get('allowlistVersion')!r} != allowlist.version {r.allow.get('version')!r}")
    if r.manifest.get("pageSpecVersion") != r.schema["properties"]["pageSpecVersion"]["const"]:
        out.append("manifest.pageSpecVersion != schema pageSpecVersion const")
    return out


def check_manifest_counts(r):
    want = computed_counts(r)
    got = r.manifest.get("counts", {})
    return [f"manifest.counts.{k} = {got.get(k)!r}, recomputed {v}" for k, v in want.items() if got.get(k) != v] + \
           [f"manifest.counts has unknown key {k!r}" for k in got if k not in want]


def check_entrypoints(r):
    out = []
    for name, rel in r.manifest.get("entryPoints", {}).items():
        if os.path.isabs(rel) or ".." in rel.split("/"):
            out.append(f"entryPoint {name} -> {rel!r} points outside design-repo/")
        elif not os.path.exists(os.path.join(r.root, rel)):
            out.append(f"entryPoint {name} -> {rel!r} does not exist")
    return out


def check_graph_validator_parity(r):
    import semantic_validate
    g = {x["id"] for x in r.graph["rules"]}
    v = set(semantic_validate.RULES)
    out = [f"graph rule {x} has no validator implementation" for x in sorted(g - v)]
    out += [f"validator rule {x} is not declared in compatibility/graph.json" for x in sorted(v - g)]
    out += [f"graph rule {x['id']} severity {x.get('severity')!r} not error|warn" for x in r.graph["rules"] if x.get("severity") not in ("error", "warn")]
    return out


def check_tokens(r):
    out = []
    flat = {}
    for rel, obj in sorted(r.token_files.items()):
        for k, v in flatten(obj).items():
            flat[k] = {"file": rel, "type": v["$type"]}
    cat = r.catalog["tokens"]
    for k in sorted(set(flat) - set(cat)):
        out.append(f"token {k} missing from token-catalog.json")
    for k in sorted(set(cat) - set(flat)):
        out.append(f"token-catalog.json lists phantom token {k}")
    if r.catalog.get("count") != len(cat):
        out.append("token-catalog count field != number of tokens")
    for kind in ("sections", "primitives", "components"):
        for key, obj in r.parts[kind].items():
            for t in obj.get("tokens", []):
                if t not in cat:
                    out.append(f"{kind}/{key}: token ref {t!r} not in catalog")
    prefixes = {k.split(".")[0] for k in cat}
    for c in r.policy["categoriesMustMatchCatalogPrefixes"]:
        if c not in prefixes:
            out.append(f"token-policy category {c!r} is not a real catalog prefix")
    for rel, obj in r.token_files.items():
        for ref in re.findall(r"\{([A-Za-z0-9_.-]+)\}", json.dumps([v["$value"] for v in flatten(obj).values()])):
            if ref not in cat:
                out.append(f"alias {{{ref}}} in {rel} does not resolve")
    return sorted(set(out))


def _schema_has_path(schema, defs, path):
    def res(s):
        while isinstance(s, dict) and "$ref" in s:
            s = defs[s["$ref"].split("/")[-1]]
        return s

    def rec(s, toks):
        s = res(s)
        if not toks:
            return s.get("type") == "string" or "const" in s and isinstance(s["const"], str) or "enum" in s
        m = re.fullmatch(r"([A-Za-z0-9_-]+)(\[\]|\[type=([A-Za-z0-9_-]+)\])?", toks[0])
        if not m:
            return False
        name, br, typ = m.groups()
        props = s.get("properties", {})
        if name not in props:
            return False
        nxt = res(props[name])
        if br is None:
            return rec(nxt, toks[1:])
        if nxt.get("type") != "array":
            return False
        item = res(nxt["items"])
        options = [res(o) for o in item.get("oneOf", [item])]
        if typ:
            options = [o for o in options if o.get("properties", {}).get("type", {}).get("const") == typ]
        return bool(options) and any(rec(o, toks[1:]) for o in options)
    return rec(schema, path.split(".") if path else [])


def check_contracts(r):
    out = []
    defs = r.schema["definitions"]
    tids = set(r.templates)
    for sid, s in r.sections.items():
        if s["templates"] != "*":
            for t in s["templates"]:
                if t not in tids:
                    out.append(f"section {sid}: unknown template {t}")
        for p in s["motion"]["allowedPatterns"]:
            if p not in r.mp["patterns"]:
                out.append(f"section {sid}: motion pattern {p!r} not in motion-patterns.json")
        if s["motion"]["reducedMotionFallback"] not in r.mp["reducedMotionFallbacks"]:
            out.append(f"section {sid}: unknown reducedMotionFallback")
        for role in s["assets"]:
            if role not in r.roles["roles"]:
                out.append(f"section {sid}: unknown assetRole {role!r}")
        for path in s["content"]["maxWords"]:
            if not _schema_has_path(s["content"]["schema"], defs, path):
                out.append(f"section {sid}: maxWords path {path!r} does not resolve to a string field in its content schema")
        for key in ("evidence",):
            if not s.get(key):
                out.append(f"section {sid}: no evidence")
    for p in r.mp["patterns"].values():
        if not p.get("evidence"):
            out.append("motion pattern without evidence")
    rpaths = [x["path"] for x in r.routes["routes"]]
    if len(rpaths) != len(set(rpaths)):
        out.append("duplicate route paths")
    if r.routes.get("count") != len(rpaths):
        out.append("templates/routes.json count field drifted")
    for x in r.routes["routes"]:
        if x["template"] not in tids:
            out.append(f"route {x['path']} -> unknown template {x['template']}")
        rc = x.get("renderCheck", {})
        if rc.get("externalHrefs") or rc.get("externalRequests") or rc.get("pageErrors"):
            out.append(f"route {x['path']} render check reports external links/requests or errors")
    for tid, t in r.templates.items():
        bound = [x["path"] for x in r.routes["routes"] if x["template"] == tid]
        if sorted(bound) != sorted(t["routes"]):
            out.append(f"template {tid}: routes list {t['routes']} != routes.json binding {bound}")
        if not bound:
            out.append(f"template {tid} has no route")
        for n in t["nodes"]:
            if n["section"] not in r.sections:
                out.append(f"template {tid}: node section {n['section']!r} has no contract")
            if not isinstance(n.get("required"), bool) or not isinstance(n.get("repeatable"), bool):
                out.append(f"template {tid}: node {n['section']} lacks boolean required/repeatable")
    return out


def check_asset_roles(r):
    out = []
    roles = r.roles["roles"]
    for role, pol in EXPECTED_PINNED_POLICIES.items():
        if roles.get(role, {}).get("generationPolicy") != pol:
            out.append(f"PINNED asset policy drift: {role} must be {pol!r}, found {roles.get(role, {}).get('generationPolicy')!r}")
        if r.roles.get("pinnedPolicies", {}).get(role) != pol:
            out.append(f"asset-roles.json pinnedPolicies.{role} != {pol!r}")
    for role, sec in EXPECTED_RESTRICTIONS.items():
        if roles.get(role, {}).get("restrictedTo") != sec:
            out.append(f"PINNED restriction drift: {role}.restrictedTo must be {sec}")
    for role, d in roles.items():
        if d.get("generationPolicy") not in r.roles["generationPolicies"]:
            out.append(f"role {role}: unknown generationPolicy")
        if not d.get("aiGuidance") or not d.get("licensing"):
            out.append(f"role {role}: missing aiGuidance/licensing")
    for f in r.registry["files"]:
        if f["assetRole"] not in roles:
            out.append(f"registry {f['file']}: unknown role {f['assetRole']}")
        elif f["generationPolicy"] != roles[f["assetRole"]]["generationPolicy"]:
            out.append(f"registry {f['file']}: policy differs from its role")
    if r.registry.get("count") != len(r.registry["files"]):
        out.append("asset-registry count field drifted")
    return out


def iter_refs(obj, where):
    if isinstance(obj, dict):
        if "ref" in obj and isinstance(obj["ref"], str):
            yield where, obj["ref"], obj.get("anchor")
        for k, v in obj.items():
            yield from iter_refs(v, f"{where}.{k}")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from iter_refs(v, f"{where}[{i}]")


def json_files(root):
    for base, dirs, fs in os.walk(root):
        dirs[:] = [d for d in dirs if not d.startswith(".") and d != "__pycache__"]
        for f in fs:
            if f.endswith(".json"):
                yield os.path.join(base, f)


def check_citations(r, warns):
    out, n, cache = [], 0, {}
    present = source_present()
    for p in json_files(r.root):
        rel = os.path.relpath(p, r.root)
        for where, ref, anchor in iter_refs(json.load(open(p, encoding="utf-8")), rel):
            n += 1
            m = REF_RE.match(ref)
            if not m:
                out.append(f"{where}: malformed citation {ref!r}")
                continue
            path, a, b = m.group(1), int(m.group(2)), int(m.group(3) or m.group(2))
            if path.startswith("/") or ".." in path.split("/"):
                out.append(f"{where}: citation {ref!r} must be relative to the project root")
                continue
            if b < a:
                out.append(f"{where}: inverted range {ref!r}")
                continue
            if not present:
                continue
            full = os.path.join(source_root(), path)
            if not os.path.exists(full):
                out.append(f"{where}: cited file {path!r} does not exist")
                continue
            if full not in cache:
                cache[full] = open(full, encoding="utf-8", errors="replace").read().split("\n")
            ls = cache[full]
            if b > len(ls):
                out.append(f"{where}: citation {ref!r} out of range (file has {len(ls)} lines)")
                continue
            if anchor and not any(anchor in ls[i - 1] for i in range(a, b + 1)):
                out.append(f"{where}: citation {ref!r} in range but anchor {anchor!r} not on the cited line(s) - wrong content")
    if not present:
        warns.append(f"source tree not found at {os.path.basename(source_root()) or source_root()!r}: {n} citations format-checked only (standalone mode)")
    return out, n


def check_no_abs_paths(r):
    out = []
    pat = re.compile("/" + "Users/|/" + "home/[a-z]|[A-Z]:" + r"\\\\")
    for base, dirs, fs in os.walk(r.root):
        dirs[:] = [d for d in dirs if d != "__pycache__"]
        for f in fs:
            if f.endswith(TEXT_EXT):
                p = os.path.join(base, f)
                for i, line in enumerate(open(p, encoding="utf-8", errors="replace"), 1):
                    if pat.search(line):
                        out.append(f"absolute path in {os.path.relpath(p, r.root)}:{i}")
    return out


def check_asset_coverage(r, warns):
    if not source_present():
        warns.append("asset coverage skipped (standalone mode)")
        return []
    on_disk = set()
    for base in ("public", "src/assets"):
        for b, _, fs in os.walk(os.path.join(source_root(), base)):
            for f in fs:
                if f.endswith((".svg", ".png", ".webp", ".woff", ".woff2", ".jpg")):
                    on_disk.add(os.path.relpath(os.path.join(b, f), source_root()))
    reg = {f["file"] for f in r.registry["files"]}
    return [f"asset {x} on disk has no assetRole entry" for x in sorted(on_disk - reg)] + [f"registry lists missing file {x}" for x in sorted(reg - on_disk)]


def check_copy_leak(r, warns):
    """CONTENT RULE: no page copy (quoted strings of >= 6 words in the specs) may appear verbatim in the repo."""
    if not source_present():
        warns.append("copy-leak scan skipped (standalone mode)")
        return []
    quotes = set()
    for spec in ("CLONE_SPEC.md",):
        for line in open(os.path.join(source_root(), spec), encoding="utf-8"):
            for q in re.findall(r'"([^"]{20,})"', line):
                q = q.replace("**", "")
                if len(q.split()) >= 6:
                    quotes.add(q)
    out = []
    for p in json_files(r.root):
        txt = open(p, encoding="utf-8").read()
        for q in quotes:
            if q in txt:
                out.append(f"verbatim page copy found in {os.path.relpath(p, r.root)}: {q[:50]!r}...")
    return out


def check_readme_counts(r):
    txt = open(os.path.join(r.root, "README.md"), encoding="utf-8").read()
    m = re.search(r"<!-- counts:start -->(.*?)<!-- counts:end -->", txt, re.S)
    if not m:
        return ["README.md has no counts block"]
    got = dict(re.findall(r"\|\s*(\w+)\s*\|\s*(\d+)\s*\|", m.group(1)))
    want = computed_counts(r)
    return [f"README count {k} = {got.get(k)}, recomputed {v}" for k, v in want.items() if got.get(k) != str(v)]


CHECKS = [
    ("schema is valid draft-07", check_schema_meta), ("schema == generated from contracts", check_schema_drift), ("example PageSpec: 0 schema + 0 semantic errors", check_example),
    ("allowlist parity", check_allowlist_parity), ("version fields (allowlistVersion, pageSpecVersion)", check_versions), ("manifest counts recomputed", check_manifest_counts),
    ("manifest entryPoints inside design-repo/", check_entrypoints), ("graph rules == validator rules", check_graph_validator_parity), ("token catalog/refs/policy", check_tokens),
    ("contracts/templates/routes integrity", check_contracts), ("asset roles + pinned policies", check_asset_roles), ("no absolute paths", check_no_abs_paths),
    ("README counts block", check_readme_counts),
]


def run(r, adversarial=True):
    fails, warns = 0, []
    for name, fn in CHECKS:
        errs = fn(r)
        print(f"[{'FAIL' if errs else 'PASS'}] {name}" + (f" ({len(errs)})" if errs else ""))
        for e in errs[:25]:
            print("       -", e)
        fails += bool(errs)
    errs, n = check_citations(r, warns)
    print(f"[{'FAIL' if errs else 'PASS'}] citations ({n} refs{', resolved against source' if source_present() else ', format only'})")
    for e in errs[:25]:
        print("       -", e)
    fails += bool(errs)
    for name, fn in (("asset registry coverage", check_asset_coverage), ("no verbatim page copy", check_copy_leak)):
        errs = fn(r, warns)
        print(f"[{'FAIL' if errs else ('PASS' if source_present() else 'SKIP')}] {name}")
        for e in errs[:25]:
            print("       -", e)
        fails += bool(errs)
    if adversarial:
        res = subprocess.run([sys.executable, os.path.join(r.root, "schema", "tests", "adversarial_test.py"), "--quiet"], capture_output=True, text=True)
        tail = (res.stdout.strip().splitlines() or ["(no output)"])[-1]
        print(f"[{'PASS' if res.returncode == 0 else 'FAIL'}] adversarial suite: {tail}")
        if res.returncode:
            print(res.stdout[-3000:], res.stderr[-2000:])
        fails += res.returncode != 0
    for w in warns:
        print("[WARN]", w)
    print(f"\nverify_all: {'OK' if not fails else f'{fails} CHECK(S) FAILED'}  (source tree {'present' if source_present() else 'ABSENT - standalone mode'})")
    return fails


if __name__ == "__main__":
    sys.exit(1 if run(Repo(), adversarial="--no-adversarial" not in sys.argv) else 0)
