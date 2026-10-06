#!/usr/bin/env python3
"""prove_drift.py - prove that verify_all.py's drift checks FAIL on bad input (not just pass on good input).

For each injection: copy design-repo/ to a fresh temp dir, corrupt one thing, run verify_all.py there
(--no-adversarial) and require (a) a non-zero exit and (b) a FAIL line for the specific check.
Finally the untouched copy must pass. Source-dependent injections (citations, copy leak) run only when
the clone's source tree is reachable (DESIGN_REPO_SOURCE_ROOT or the folder containing design-repo/).

Usage: python3 extraction/prove_drift.py
"""
import json, os, re, shutil, subprocess, sys, tempfile

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.environ.get("DESIGN_REPO_SOURCE_ROOT") or os.path.dirname(REPO)
HAVE_SRC = os.path.exists(os.path.join(SRC, "src", "routes.jsx"))


def jedit(root, rel, fn):
    p = os.path.join(root, rel)
    d = json.load(open(p, encoding="utf-8"))
    fn(d)
    json.dump(d, open(p, "w", encoding="utf-8"), indent=2)


def tedit(root, rel, fn):
    p = os.path.join(root, rel)
    open(p, "w", encoding="utf-8").write(fn(open(p, encoding="utf-8").read()))


def first_ref_file(root):
    return "sections/content.hero.json"


def bump_ref(root, delta=None, absolute=None):
    def fn(d):
        ev = d["evidence"][0]
        path, ln = ev["ref"].split(":")[0], int(ev["ref"].split(":")[1].split("-")[0])
        ev["ref"] = f"{path}:{absolute if absolute else ln + delta}"
    jedit(root, first_ref_file(root), fn)


def leak(root):
    q = None
    for line in open(os.path.join(SRC, "CLONE_SPEC.md"), encoding="utf-8"):
        for m in re.findall(r'"([^"]{20,})"', line):
            if len(m.replace("**", "").split()) >= 6:
                q = m.replace("**", "")
                break
        if q:
            break
    jedit(root, "sections/home.hero.json", lambda d: d.update(notes=q))


INJECTIONS = [
    ("phantom allowlist entry", "allowlist parity", lambda r: jedit(r, "tokens/llm/component-allowlist.json", lambda d: d["sections"].append("pricing.table"))),
    ("orphan contract without allowlist entry", "allowlist parity", lambda r: (shutil.copy(os.path.join(r, "sections/info.cards.json"), os.path.join(r, "sections/info.extra.json")),
                                                                              jedit(r, "sections/info.extra.json", lambda d: d.update(id="info.extra")))),
    ("manifest count drift", "manifest counts recomputed", lambda r: jedit(r, "registry.manifest.json", lambda d: d["counts"].update(templates=d["counts"]["templates"] + 1))),
    ("allowlistVersion drift", "version fields", lambda r: jedit(r, "registry.manifest.json", lambda d: d.update(allowlistVersion="0.0.1"))),
    ("entryPoint outside the package", "manifest entryPoints inside design-repo/", lambda r: jedit(r, "registry.manifest.json", lambda d: d["entryPoints"].update(routesSource="../src/routes.jsx"))),
    ("pinned asset policy -> other valid value", "asset roles + pinned policies", lambda r: jedit(r, "assets/asset-roles.json", lambda d: d["roles"]["photo.person"].update(generationPolicy="may-generate-new"))),
    ("graph rule without validator", "graph rules == validator rules", lambda r: jedit(r, "compatibility/graph.json", lambda d: d["rules"].append({"id": "NO_ORPHAN_WIDGETS", "severity": "error", "description": "x", "evidence": []}))),
    ("contract edited, schema not rebuilt", "schema == generated from contracts", lambda r: jedit(r, "sections/content.hero.json", lambda d: d["content"]["schema"]["properties"]["stats"].update(maxItems=4))),
    ("absolute path in README", "no absolute paths", lambda r: tedit(r, "README.md", lambda t: t + "\nsee " + "/" + "Users/someone/project\n")),
    ("README count drift", "README counts block", lambda r: tedit(r, "README.md", lambda t: re.sub(r"\| sections \| (\d+) \|", lambda m: f"| sections | {int(m.group(1)) + 1} |", t))),
    ("phantom token in catalog", "token catalog/refs/policy", lambda r: jedit(r, "tokens/llm/token-catalog.json", lambda d: d["tokens"].update({"color.neonPink": {"file": "x", "type": "color"}}))),
    ("token-policy category not a catalog key", "token catalog/refs/policy", lambda r: jedit(r, "tokens/llm/token-policy.json", lambda d: d["categoriesMustMatchCatalogPrefixes"].append("shadow"))),
]
SOURCE_INJECTIONS = [
    ("citation out of range", "citations", lambda r: bump_ref(r, absolute=999999)),
    ("citation in range but wrong content", "citations", lambda r: bump_ref(r, delta=-1)),
    ("verbatim homepage copy pasted into a contract", "no verbatim page copy", leak),
]


def run_verify(root):
    env = dict(os.environ, DESIGN_REPO_SOURCE_ROOT=SRC) if HAVE_SRC else dict(os.environ, DESIGN_REPO_SOURCE_ROOT=os.path.join(root, "__no_source__"))
    return subprocess.run([sys.executable, os.path.join(root, "extraction", "verify_all.py"), "--no-adversarial"], capture_output=True, text=True, env=env)


def fresh():
    d = tempfile.mkdtemp(prefix="drift-")
    dst = os.path.join(d, "design-repo")
    shutil.copytree(REPO, dst, ignore=shutil.ignore_patterns("__pycache__", ".DS_Store"))
    return d, dst


def main():
    fails = 0
    cases = INJECTIONS + (SOURCE_INJECTIONS if HAVE_SRC else [])
    for name, check, inject in cases:
        tmp, root = fresh()
        try:
            inject(root)
            res = run_verify(root)
            caught = res.returncode != 0 and re.search(r"\[FAIL\] " + re.escape(check), res.stdout)
            print(f"[{'PASS' if caught else 'FAIL'}] injected '{name}' -> verify_all {'FAILED as required on: ' + check if caught else 'did NOT catch it'}")
            fails += not caught
        finally:
            shutil.rmtree(tmp, ignore_errors=True)
    if not HAVE_SRC:
        print("[SKIP] citation / copy-leak injections (no source tree reachable)")
    tmp, root = fresh()
    try:
        res = run_verify(root)
        ok = res.returncode == 0
        print(f"[{'PASS' if ok else 'FAIL'}] untouched copy passes verify_all")
        if not ok:
            print(res.stdout[-2000:])
        fails += not ok
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print(f"prove_drift: {len(cases) + 1 - fails}/{len(cases) + 1} passed")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
