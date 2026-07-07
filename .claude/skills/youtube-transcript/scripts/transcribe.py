#!/usr/bin/env python3
"""Fetch a YouTube video's transcript from a URL or video ID.

Strategy:
  1. Try youtube-transcript-api (fast, no download) for manual/auto captions.
  2. Fall back to yt-dlp, which downloads the .vtt subtitle track and parses it.

Prints plaintext by default; --timestamps for [mm:ss] cue lines; --out to save.
Exit code 2 means "network/host blocked" so a caller can distinguish policy
denials from genuine "no captions" cases.
"""
import argparse
import re
import sys
import textwrap


VIDEO_ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")


def extract_video_id(s: str) -> str:
    s = s.strip()
    if VIDEO_ID_RE.match(s):
        return s
    # youtu.be/ID, youtube.com/watch?v=ID, /shorts/ID, /embed/ID, /live/ID
    m = re.search(r"(?:v=|/shorts/|/embed/|/live/|youtu\.be/)([A-Za-z0-9_-]{11})", s)
    if m:
        return m.group(1)
    raise SystemExit(f"Could not find an 11-character video ID in: {s!r}")


def fmt_ts(seconds: float) -> str:
    seconds = int(seconds)
    h, rem = divmod(seconds, 3600)
    m, sec = divmod(rem, 60)
    return f"{h:d}:{m:02d}:{sec:02d}" if h else f"{m:d}:{sec:02d}"


def looks_blocked(err: Exception) -> bool:
    text = str(err).lower()
    return any(
        marker in text
        for marker in ("403", "tunnel", "proxy", "forbidden", "connection", "timed out", "getaddrinfo")
    )


def via_transcript_api(video_id: str, lang: str):
    """Return list of {'text','start','duration'} cues or None if unavailable."""
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        from youtube_transcript_api._errors import (
            TranscriptsDisabled,
            NoTranscriptFound,
        )
    except ImportError:
        return None

    prefs = [lang, f"{lang}-US", f"{lang}-GB", "en", "en-US"]
    try:
        try:
            cues = YouTubeTranscriptApi.get_transcript(video_id, languages=prefs)
        except NoTranscriptFound:
            # Any available language, including auto-generated.
            listing = YouTubeTranscriptApi.list_transcripts(video_id)
            cues = next(iter(listing)).fetch()
        return [
            {"text": c["text"], "start": c["start"], "duration": c.get("duration", 0.0)}
            for c in cues
        ]
    except (TranscriptsDisabled, NoTranscriptFound):
        return None
    except Exception as e:  # network/blocked etc.
        if looks_blocked(e):
            raise SystemExit2_blocked(e)
        return None


class SystemExit2_blocked(SystemExit):
    def __init__(self, e):
        super().__init__(2)
        self.err = e


def parse_vtt(vtt_text: str):
    """Parse WebVTT into cues, de-duplicating rolling auto-caption lines."""
    cues = []
    ts_re = re.compile(
        r"(\d{2}):(\d{2}):(\d{2})[.,](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[.,](\d{3})"
    )
    lines = vtt_text.splitlines()
    i = 0
    last = None
    while i < len(lines):
        m = ts_re.search(lines[i])
        if not m:
            i += 1
            continue
        h1, m1, s1, ms1 = map(int, m.group(1, 2, 3, 4))
        start = h1 * 3600 + m1 * 60 + s1 + ms1 / 1000.0
        i += 1
        buf = []
        while i < len(lines) and lines[i].strip() and not ts_re.search(lines[i]):
            # strip inline timing tags like <00:00:01.000> and <c> tags
            clean = re.sub(r"<[^>]+>", "", lines[i]).strip()
            if clean:
                buf.append(clean)
            i += 1
        text = " ".join(buf).strip()
        if text and text != last:
            cues.append({"text": text, "start": start, "duration": 0.0})
            last = text
    return cues


def via_ytdlp(video_id: str, lang: str):
    try:
        import tempfile
        import os
        import glob
        import yt_dlp
    except ImportError:
        return None

    url = f"https://www.youtube.com/watch?v={video_id}"
    with tempfile.TemporaryDirectory() as tmp:
        outtmpl = os.path.join(tmp, "%(id)s")
        opts = {
            "skip_download": True,
            "writesubtitles": True,
            "writeautomaticsub": True,
            "subtitleslangs": [lang, f"{lang}.*", "en", "en.*"],
            "subtitlesformat": "vtt",
            "outtmpl": outtmpl,
            "quiet": True,
            "no_warnings": True,
        }
        title = None
        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(url, download=True)
                title = info.get("title")
        except Exception as e:
            if looks_blocked(e):
                raise SystemExit2_blocked(e)
            return None
        vtts = sorted(glob.glob(os.path.join(tmp, "*.vtt")))
        if not vtts:
            return None
        # Prefer requested lang; else first.
        chosen = next((p for p in vtts if f".{lang}" in os.path.basename(p)), vtts[0])
        with open(chosen, encoding="utf-8") as fh:
            cues = parse_vtt(fh.read())
        return {"cues": cues, "title": title}


def to_plaintext(cues) -> str:
    text = " ".join(c["text"].replace("\n", " ") for c in cues)
    text = re.sub(r"\s+", " ", text).strip()
    return "\n\n".join(textwrap.fill(p, width=100) for p in re.split(r"(?<=[.!?])\s+(?=[A-Z])", text))


def to_timestamped(cues) -> str:
    return "\n".join(f"[{fmt_ts(c['start'])}] {c['text'].strip()}" for c in cues if c["text"].strip())


def main():
    ap = argparse.ArgumentParser(description="Fetch a YouTube transcript.")
    ap.add_argument("url", help="YouTube URL or 11-char video ID")
    ap.add_argument("--lang", default="en", help="Preferred caption language (default: en)")
    ap.add_argument("--timestamps", action="store_true", help="Prefix each cue with [mm:ss]")
    ap.add_argument("--out", help="Also write the transcript to this file")
    args = ap.parse_args()

    video_id = extract_video_id(args.url)
    title = None

    try:
        cues = via_transcript_api(video_id, args.lang)
        if not cues:
            res = via_ytdlp(video_id, args.lang)
            if isinstance(res, dict):
                cues, title = res["cues"], res.get("title")
            else:
                cues = res
    except SystemExit2_blocked as b:
        sys.stderr.write(
            "ERROR: Could not reach YouTube — the network appears to block it "
            f"(policy/egress denial).\nDetail: {b.err}\n"
            "Run this skill in an environment with open network access, or paste "
            "the captions manually.\n"
        )
        sys.exit(2)

    if not cues:
        sys.stderr.write(
            f"No transcript/captions available for video {video_id} "
            "(captions may be disabled, or none exist in the requested language).\n"
        )
        sys.exit(1)

    body = to_timestamped(cues) if args.timestamps else to_plaintext(cues)
    words = sum(len(c["text"].split()) for c in cues)
    duration = max((c["start"] + c.get("duration", 0.0)) for c in cues)

    if args.out:
        with open(args.out, "w", encoding="utf-8") as fh:
            fh.write(body + "\n")

    header = f"# Transcript: {title}" if title else f"# Transcript: {video_id}"
    summary = f"{header}\n# {len(cues)} cues · {words} words · ~{fmt_ts(duration)} long"
    if args.out:
        print(summary)
        print(f"# saved to {args.out}")
    else:
        print(summary + "\n")
        print(body)


if __name__ == "__main__":
    main()
