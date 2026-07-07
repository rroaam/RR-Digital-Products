#!/usr/bin/env python3
"""Clean a pasted/uploaded caption file (.vtt, .srt, or raw .txt) into readable text.

Use this when YouTube itself is unreachable but the user can supply captions —
e.g. from YouTube's "Show transcript" panel or a downloaded subtitle file.

    python3 format_captions.py captions.vtt              # -> plaintext to stdout
    python3 format_captions.py captions.srt --timestamps # keep [mm:ss] markers
    python3 format_captions.py captions.txt --out out.txt
"""
import argparse
import re
import sys
import textwrap

TS = r"(\d{1,2}):(\d{2}):(\d{2})[.,](\d{3})"
CUE_RE = re.compile(rf"{TS}\s*-->\s*{TS}")


def fmt_ts(seconds: float) -> str:
    seconds = int(seconds)
    h, rem = divmod(seconds, 3600)
    m, s = divmod(rem, 60)
    return f"{h:d}:{m:02d}:{s:02d}" if h else f"{m:d}:{s:02d}"


def parse_cued(text: str):
    """Handle VTT/SRT: blocks of timestamp lines followed by caption text."""
    cues, last = [], None
    lines = text.splitlines()
    i = 0
    while i < len(lines):
        m = CUE_RE.search(lines[i])
        if not m:
            i += 1
            continue
        h, mn, s, ms = map(int, m.group(1, 2, 3, 4))
        start = h * 3600 + mn * 60 + s + ms / 1000.0
        i += 1
        buf = []
        while i < len(lines) and lines[i].strip() and not CUE_RE.search(lines[i]):
            clean = re.sub(r"<[^>]+>", "", lines[i]).strip()
            # skip pure SRT index numbers
            if clean and not clean.isdigit():
                buf.append(clean)
            i += 1
        t = " ".join(buf).strip()
        if t and t != last:
            cues.append((start, t))
            last = t
    return cues


def parse_pasted_panel(text: str):
    """Handle YouTube 'Show transcript' paste: lines alternating 'm:ss' then text,
    or 'm:ss  text' on one line."""
    cues = []
    inline = re.compile(r"^\s*(\d{1,2}:\d{2}(?::\d{2})?)\s+(.*\S)\s*$")
    ts_only = re.compile(r"^\s*(\d{1,2}:\d{2}(?::\d{2})?)\s*$")

    def to_sec(ts):
        parts = [int(p) for p in ts.split(":")]
        while len(parts) < 3:
            parts.insert(0, 0)
        h, m, s = parts
        return h * 3600 + m * 60 + s

    lines = text.splitlines()
    i = 0
    while i < len(lines):
        mi = inline.match(lines[i])
        if mi:
            cues.append((to_sec(mi.group(1)), mi.group(2).strip()))
            i += 1
            continue
        mo = ts_only.match(lines[i])
        if mo and i + 1 < len(lines) and lines[i + 1].strip():
            cues.append((to_sec(mo.group(1)), lines[i + 1].strip()))
            i += 2
            continue
        i += 1
    return cues


def to_plaintext(cues) -> str:
    joined = re.sub(r"\s+", " ", " ".join(t for _, t in cues)).strip()
    paras = re.split(r"(?<=[.!?])\s+(?=[A-Z])", joined)
    return "\n\n".join(textwrap.fill(p, width=100) for p in paras if p.strip())


def main():
    ap = argparse.ArgumentParser(description="Clean captions into readable text.")
    ap.add_argument("file", help="Path to .vtt/.srt/.txt caption file (or - for stdin)")
    ap.add_argument("--timestamps", action="store_true")
    ap.add_argument("--out")
    args = ap.parse_args()

    raw = sys.stdin.read() if args.file == "-" else open(args.file, encoding="utf-8").read()

    cues = parse_cued(raw)
    if not cues:
        cues = parse_pasted_panel(raw)
    if not cues:
        # Last resort: treat the whole thing as prose.
        body = to_plaintext([(0, raw)])
        cues = [(0, raw)]
    else:
        body = to_timestamped(cues) if args.timestamps else to_plaintext(cues)

    if args.out:
        open(args.out, "w", encoding="utf-8").write(body + "\n")
        print(f"# {len(cues)} cues cleaned · saved to {args.out}")
    else:
        print(body)


def to_timestamped(cues) -> str:
    return "\n".join(f"[{fmt_ts(s)}] {t}" for s, t in cues if t.strip())


if __name__ == "__main__":
    main()
