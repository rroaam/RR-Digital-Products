---
name: youtube-transcript
description: >-
  Fetch and format the transcript of a YouTube video from its URL or video ID.
  Use whenever the user pastes a YouTube link (youtube.com/watch, youtu.be, or a
  bare 11-character video ID) and asks to transcribe it, get its captions, pull
  the transcript, summarize the spoken content, or turn a video into text.
  Produces clean plaintext (optionally timestamped) and can save it to a file.
---

# YouTube Transcript

Turn a YouTube URL or video ID into clean transcript text.

## When to use

Trigger on requests like "transcribe this video", "get the transcript/captions",
"what does this video say", or "turn this YouTube link into text" — whenever a
YouTube URL or 11-char video ID is present.

## Network requirement (read first)

This skill fetches captions directly from YouTube. It only works in an
environment with **open outbound network access to `youtube.com` /
`googlevideo.com`**.

Some managed/sandboxed environments (e.g. Claude Code on the web with a
restrictive network policy) allowlist only a few hosts and **block YouTube at
the egress proxy** — you'll see `403 Forbidden` / `CONNECT tunnel failed` on
every attempt. That is a policy denial, not a bug: do not try to route around
it. In that case, tell the user the environment blocks YouTube and offer the
fallbacks in "If the network is blocked" below.

## How to run

The script tries the lightweight caption API first (`youtube-transcript-api`),
then falls back to `yt-dlp` for auto-generated / uploaded subtitles.

```bash
# Install deps once (either works; both is safest):
pip install --quiet youtube-transcript-api yt-dlp

# Plain text (default):
python3 .claude/skills/youtube-transcript/scripts/transcribe.py "<url-or-id>"

# With timestamps, and save to a file:
python3 .claude/skills/youtube-transcript/scripts/transcribe.py "<url-or-id>" --timestamps --out transcript.txt

# Pick a language (default: en, then any available):
python3 .claude/skills/youtube-transcript/scripts/transcribe.py "<url-or-id>" --lang es
```

Accepts any of: `https://www.youtube.com/watch?v=ID`, `https://youtu.be/ID`
(with or without `?si=...` tracking params), `https://youtube.com/shorts/ID`, or
a bare 11-character `ID`.

## Output

- Default: paragraph-wrapped plaintext with no timestamps — good for reading,
  summarizing, or pasting.
- `--timestamps`: one line per caption cue prefixed with `[mm:ss]`.
- `--out FILE`: also writes the result to `FILE` (still prints a short summary).

After running, briefly report the video title (if available), language, and
length (word count / duration), then present or save the transcript per the
user's request.

## If the network is blocked

If YouTube is unreachable from the current environment, do not fabricate a
transcript. Offer these instead:

1. Ask the user to run this skill locally (or in a session with open network)
   and share the output.
2. Ask the user to paste the transcript from YouTube's own "Show transcript"
   panel, or upload a `.vtt` / `.srt` / `.txt` caption file — then use
   `scripts/format_captions.py` to clean it into readable text.
