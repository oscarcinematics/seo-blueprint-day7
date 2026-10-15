"""Shared setup for every script in code/. Import it, never run it.

The engine lives in one place (~/seo-engine). Each site folder links to it,
so `code/` in a site is a symlink back here. That means a script cannot use
its own location to find the site. Instead:

  ROOT    the site folder = wherever you run the script from
          (always run from the site root: python3 code/status.py)
  ENGINE  the engine folder (where this file really lives)
  SITE    ROOT / "website"

Env is loaded once, on import: ENGINE/.env first (keys shared by every
client, such as Apify), then ROOT/.env (this site's keys and DEV_PORT). The
site's value wins over the engine's, and a variable already set in the shell
wins over both.

  PORT    DEV_PORT from the env, else 3000
  BASE    http://localhost:PORT, where the checkers look for the dev server

Scripts that already take --port or --base keep them as overrides; see
base_url().
"""
import os
import sys
from pathlib import Path

ROOT = Path.cwd()
ENGINE = Path(__file__).resolve().parent.parent
SITE = ROOT / "website"


def read_env(path):
    """KEY=value lines from one .env file, as a dict. No dependency."""
    out = {}
    if not path.is_file():
        return out
    for line in path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        if line.startswith("export "):
            line = line[len("export "):]
        key, _, value = line.partition("=")
        out[key.strip()] = value.strip().strip('"').strip("'")
    return out


def load_env():
    merged = read_env(ENGINE / ".env")
    if ROOT.resolve() != ENGINE:
        merged.update(read_env(ROOT / ".env"))
    for key, value in merged.items():
        os.environ.setdefault(key, value)


load_env()

PORT = os.environ.get("DEV_PORT", "").strip() or "3000"
BASE = f"http://localhost:{PORT}"


def base_url(argv=None):
    """BASE, unless the command line overrides it.

    --port N     http://localhost:N
    --base URL   that URL exactly (a live site, staging, anything)
    """
    argv = sys.argv if argv is None else argv
    base = BASE
    if "--port" in argv:
        base = f"http://localhost:{argv[argv.index('--port') + 1]}"
    if "--base" in argv:
        base = argv[argv.index("--base") + 1].rstrip("/")
    return base
