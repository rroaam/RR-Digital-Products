---
name: website-cloner
description: Clone any public website into a local, working static copy. Use when the user provides a URL and asks to clone, mirror, copy, replicate, save offline, or reproduce a site — including its HTML, CSS, JavaScript, images, and fonts. Examples - "clone https://stripe.com", "copy this landing page", "make a local copy of this site", "mirror this website".
---

# Website Cloner

Given a URL, produce a self-contained local copy of the site that opens in a browser and looks like the original.

## Inputs

- `url` (required): the page to clone, e.g. `https://stripe.com`
- `out` (optional): output directory. Default: `./clones/<hostname>`
- `depth` (optional): link depth to follow on the same host. Default: `1` (just the given page + its assets)

If the user invokes the skill without arguments, ask for the URL once, then proceed.

## Procedure

1. **Validate the URL.** It must include a scheme (`http://` or `https://`). Reject `file://`, `javascript:`, and non-public hosts (localhost, 127.0.0.1, 169.254.x.x, .local) unless the user explicitly confirms.

2. **Pick the output directory.** Default to `./clones/<hostname>`. If it exists and is non-empty, ask before overwriting.

3. **Mirror the site.** Run the helper:

   ```bash
   bash .claude/skills/website-cloner/scripts/clone.sh <url> <out> <depth>
   ```

   The helper wraps `wget` with the right flags to:
   - download HTML, CSS, JS, images, and fonts
   - rewrite links and asset URLs to be relative
   - preserve the directory structure under `<hostname>/`
   - follow `<link>`, `<script src>`, `<img>`, `srcset`, and CSS `url(...)` references
   - stay on the original host (no crawling third-party domains, except for fetched assets)

4. **Patch up what wget misses.** Many modern sites load assets via JS or use CSS `@font-face` with cross-origin URLs. After the mirror finishes:
   - Grep the output for absolute `https://` URLs still present in HTML/CSS.
   - For each external font/image/stylesheet the page actually needs, download it into `./assets/` and rewrite the reference.
   - Skip analytics, tracking pixels, and third-party widget scripts — they won't run offline anyway and will spam the console.

5. **Verify.** Start a local server and confirm the page renders:

   ```bash
   cd <out> && python3 -m http.server 8000
   ```

   Open the index file (usually `<hostname>/index.html`) and check that:
   - fonts load (no fallback serif where the original had a custom face)
   - hero images appear
   - layout matches the original at desktop width

6. **Report back.** Tell the user:
   - the output path
   - how to preview it (the `python3 -m http.server` command)
   - anything that didn't clone cleanly (auth-walled pages, JS-rendered routes, dynamic content)

## Limits

- **SPAs / JS-rendered sites** (React, Vue, Next.js client-rendered) won't fully clone with wget — the initial HTML is a shell. If `curl <url>` returns mostly empty `<div id="root">`, warn the user and offer to render with a headless browser instead (requires `playwright` or `puppeteer`).
- **Auth-gated content** is out of scope. Don't try to bypass login walls.
- **Respect robots.txt and ToS.** The helper sends a normal User-Agent and does not disable robots checks. If a site blocks mirroring, stop and tell the user.
- **No credentials, no rate-limit evasion.** Don't add cookies, don't rotate IPs, don't hammer the origin.

## Output structure

```
clones/<hostname>/
├── index.html              # entry point
├── <hostname>/             # mirrored tree (wget convention)
│   ├── *.html
│   ├── css/
│   ├── js/
│   └── images/
└── assets/                 # extra files patched in after wget
    └── fonts/
```
