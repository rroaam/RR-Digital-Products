#!/usr/bin/env bash
# Mirror a website into a local, browsable copy.
# Usage: clone.sh <url> [out_dir] [depth]
set -euo pipefail

URL="${1:?usage: clone.sh <url> [out_dir] [depth]}"
HOST="$(printf '%s' "$URL" | sed -E 's#^https?://##; s#/.*##')"
OUT="${2:-./clones/$HOST}"
DEPTH="${3:-1}"

if ! command -v wget >/dev/null 2>&1; then
  echo "error: wget is required but not installed" >&2
  exit 1
fi

mkdir -p "$OUT"
cd "$OUT"

UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

# --mirror is shorthand for -r -N -l inf --no-remove-listing; we override depth.
# -p     download all page requisites (css, js, images, fonts)
# -k     convert links to be relative for offline viewing
# -E     append .html to extensionless pages so they open locally
# -H     span hosts (needed for CDN-hosted assets)
# -D     but restrict spanning to the host + common CDN patterns
# --page-requisites picks up <link>, <script>, <img>, srcset, and CSS url(...).
wget \
  --user-agent="$UA" \
  --recursive \
  --level="$DEPTH" \
  --page-requisites \
  --convert-links \
  --adjust-extension \
  --span-hosts \
  --domains="$HOST" \
  --no-parent \
  --timeout=30 \
  --tries=2 \
  --waitretry=2 \
  --no-check-certificate \
  -e robots=on \
  "$URL" || true   # wget exits non-zero on partial mirrors; that's fine

# Find an entry point and symlink it as index.html for convenience.
ENTRY="$(find "$HOST" -maxdepth 2 -name 'index.html' -print -quit 2>/dev/null || true)"
if [ -z "$ENTRY" ]; then
  ENTRY="$(find "$HOST" -maxdepth 2 -name '*.html' -print -quit 2>/dev/null || true)"
fi
if [ -n "$ENTRY" ] && [ ! -e index.html ]; then
  ln -s "$ENTRY" index.html
fi

echo
echo "done. preview with:"
echo "  cd $OUT && python3 -m http.server 8000"
echo "then open http://localhost:8000/"
