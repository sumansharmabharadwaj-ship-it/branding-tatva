#!/usr/bin/env python3
"""Audit the Services page's continuous live-action media contract.

The validator intentionally reads the repository's own manifest instead
of maintaining a second hard-coded inventory. It checks that every film
and fallback exists, that every background film is silent, and that the
live Services sources no longer reference the still-derived generated-loop
library rejected during the cinematic review.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "src/app/services/generatedMediaManifest.ts"
PAGE = ROOT / "src/app/services/page.tsx"
AUTHORITY = ROOT / "src/sections/Services/PinnedBrandBuild.tsx"
REPORT = ROOT / "docs/SERVICES_ORIGINAL_MEDIA_AUDIT.md"


@dataclass(frozen=True)
class Film:
    key: str
    desktop: str
    mobile: str
    poster: str
    purpose: str


@dataclass(frozen=True)
class Still:
    key: str
    image: str
    purpose: str
    motion: str


@dataclass(frozen=True)
class Probe:
    duration: float
    width: int
    height: int
    bytes: int
    codec: str

    @property
    def pixels(self) -> int:
        return self.width * self.height


def fail(message: str) -> None:
    raise SystemExit(message)


def extract_object(text: str, export_name: str) -> str:
    pattern = re.compile(
        rf"export const {re.escape(export_name)} = \{{(.*?)\n\}} as const;",
        re.S,
    )
    match = pattern.search(text)
    if not match:
        fail(f"Could not locate {export_name} in {MANIFEST}")
    return match.group(1)


def parse_entries(block: str) -> dict[str, dict[str, str]]:
    entry_pattern = re.compile(r"^  (\w+): \{\n(.*?)^  \},", re.S | re.M)
    property_pattern = re.compile(r'^    (\w+): "([^"]*)",$', re.M)
    entries: dict[str, dict[str, str]] = {}
    for key, body in entry_pattern.findall(block):
        entries[key] = dict(property_pattern.findall(body))
    return entries


def public_path(url_path: str) -> Path:
    if not url_path.startswith("/"):
        fail(f"Manifest path must be site-root relative: {url_path}")
    return ROOT / "public" / url_path.lstrip("/")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def probe_video(path: Path) -> Probe:
    output = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_streams",
            "-show_format",
            "-of",
            "json",
            str(path),
        ],
        text=True,
    )
    payload = json.loads(output)
    video_streams = [stream for stream in payload["streams"] if stream.get("codec_type") == "video"]
    audio_streams = [stream for stream in payload["streams"] if stream.get("codec_type") == "audio"]
    if len(video_streams) != 1:
        fail(f"{path}: expected exactly one video stream, found {len(video_streams)}")
    if audio_streams:
        fail(f"{path}: background film contains an audio stream")
    stream = video_streams[0]
    duration = float(payload["format"]["duration"])
    return Probe(
        duration=duration,
        width=int(stream["width"]),
        height=int(stream["height"]),
        bytes=path.stat().st_size,
        codec=str(stream.get("codec_name", "unknown")),
    )


def human_bytes(value: int) -> str:
    units = ["B", "KB", "MB", "GB"]
    size = float(value)
    for unit in units:
        if size < 1024 or unit == units[-1]:
            return f"{size:.1f} {unit}"
        size /= 1024
    return f"{value} B"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--write-report", action="store_true")
    args = parser.parse_args()

    manifest_text = MANIFEST.read_text()
    page_text = PAGE.read_text()
    authority_text = AUTHORITY.read_text()
    live_source = page_text + "\n" + authority_text

    revision_match = re.search(
        r"desktopLoops: (\d+),\n  mobileLoops: (\d+),\n  stillScenes: (\d+),",
        manifest_text,
    )
    if not revision_match:
        fail("Could not read generated-media revision counts")
    declared_desktop, declared_mobile, declared_stills = map(int, revision_match.groups())

    media_entries = parse_entries(extract_object(manifest_text, "GENERATED_SERVICES_MEDIA"))
    still_entries = parse_entries(extract_object(manifest_text, "GENERATED_SERVICES_STILLS"))

    films: list[Film] = []
    for key, entry in media_entries.items():
        missing = {"desktop", "mobile", "poster", "purpose"} - entry.keys()
        if missing:
            fail(f"Manifest film {key} is missing: {', '.join(sorted(missing))}")
        films.append(Film(key, entry["desktop"], entry["mobile"], entry["poster"], entry["purpose"]))

    stills: list[Still] = []
    for key, entry in still_entries.items():
        missing = {"image", "purpose", "motion"} - entry.keys()
        if missing:
            fail(f"Manifest still {key} is missing: {', '.join(sorted(missing))}")
        stills.append(Still(key, entry["image"], entry["purpose"], entry["motion"]))

    if declared_desktop != len(films) or declared_mobile != len(films):
        fail(
            "Manifest loop counts do not match its entries: "
            f"declared {declared_desktop}/{declared_mobile}, parsed {len(films)}"
        )
    if declared_stills != len(stills):
        fail(f"Manifest still count declares {declared_stills}, parsed {len(stills)}")

    forbidden = [
        "/videos/generated/",
        "/images/generated/bt-services-",
    ]
    for token in forbidden:
        if token.lower() in live_source.lower():
            fail(f"Still-derived generated media remains in live Services sources: {token}")

    media_literals = re.findall(r'"(/(?:videos|images)/[^"]+)"', live_source)
    generated = [path for path in media_literals if path.startswith(("/videos/generated/", "/images/generated/"))]
    if generated:
        fail("Generated-loop media remains in live Services sources: " + ", ".join(sorted(set(generated))))

    if "useHydratedReducedMotion" not in authority_text:
        fail("Authority lost its hydrated reduced-motion guard")

    film_rows: list[tuple[Film, Probe, Probe, str, str]] = []
    manifest_paths: set[str] = set()
    for film in films:
        for path_value in (film.desktop, film.mobile, film.poster):
            path = public_path(path_value)
            if not path.is_file() or path.stat().st_size == 0:
                fail(f"{film.key}: missing or empty media file {path_value}")
            manifest_paths.add(path_value)
            occurrences = live_source.count(path_value)
            if occurrences < 1:
                fail(
                    f"{film.key}: {path_value} should appear in live sources"
                )

        desktop_probe = probe_video(public_path(film.desktop))
        mobile_probe = probe_video(public_path(film.mobile))

        for label, probe in (("desktop", desktop_probe), ("mobile", mobile_probe)):
            if not 4.5 <= probe.duration <= 30:
                fail(f"{film.key} {label}: duration {probe.duration:.2f}s falls outside the continuous-shot budget")
        if desktop_probe.width <= desktop_probe.height:
            fail(f"{film.key}: desktop film is not landscape ({desktop_probe.width}×{desktop_probe.height})")
        same_asset = film.mobile == film.desktop
        if not same_asset and mobile_probe.pixels >= desktop_probe.pixels:
            fail(
                f"{film.key}: mobile encode does not reduce the pixel budget "
                f"({mobile_probe.width}×{mobile_probe.height} vs {desktop_probe.width}×{desktop_probe.height})"
            )
        if not same_asset and mobile_probe.bytes >= desktop_probe.bytes:
            fail(f"{film.key}: mobile encode is not lighter than desktop")
        if desktop_probe.bytes > 6 * 1024 * 1024:
            fail(f"{film.key}: desktop film exceeds 6 MB")
        if not same_asset and mobile_probe.bytes > 3 * 1024 * 1024:
            fail(f"{film.key}: mobile film exceeds 3 MB")

        film_rows.append(
            (
                film,
                desktop_probe,
                mobile_probe,
                sha256(public_path(film.desktop)),
                sha256(public_path(film.mobile)),
            )
        )

    still_rows: list[tuple[Still, int, str]] = []
    for still in stills:
        path = public_path(still.image)
        if not path.is_file() or path.stat().st_size == 0:
            fail(f"{still.key}: missing or empty still {still.image}")
        manifest_paths.add(still.image)
        occurrences = live_source.count(still.image)
        if occurrences < 1:
            fail(f"{still.key}: {still.image} should appear in live sources")
        still_rows.append((still, path.stat().st_size, sha256(path)))

    report_lines = [
        "# Services Live-Action Media Audit",
        "",
        "Generated automatically from `src/app/services/generatedMediaManifest.ts`.",
        "",
        "## Result",
        "",
        f"- {len(films)} responsive silent films",
        f"- {len(stills)} photographic reduced-motion fallbacks",
        "- zero still-derived generated-loop paths in the live Services page or Authority chapter",
        "- every manifest path is wired to at least one intended live scene",
        "- responsive entries use either a lighter mobile encode or the same continuous master",
        "- hydrated reduced-motion handling remains active in the pinned Authority chapter",
        "",
        "## Responsive films",
        "",
        "| Scene | Desktop | Mobile | Duration | Desktop size | Mobile size | Purpose |",
        "|---|---:|---:|---:|---:|---:|---|",
    ]
    for film, desktop, mobile, _, _ in film_rows:
        report_lines.append(
            f"| {film.key} | {desktop.width}×{desktop.height} | {mobile.width}×{mobile.height} | "
            f"{desktop.duration:.2f}s | {human_bytes(desktop.bytes)} | {human_bytes(mobile.bytes)} | {film.purpose} |"
        )

    report_lines.extend(
        [
            "",
            "## Photographic fallback scenes",
            "",
            "| Scene | File size | Motion | Purpose |",
            "|---|---:|---|---|",
        ]
    )
    for still, size, _ in still_rows:
        report_lines.append(f"| {still.key} | {human_bytes(size)} | {still.motion} | {still.purpose} |")

    report_lines.extend(["", "## Integrity", ""])
    for film, _, _, desktop_hash, mobile_hash in film_rows:
        report_lines.append(f"- `{film.key}` desktop SHA-256: `{desktop_hash}`")
        report_lines.append(f"- `{film.key}` mobile SHA-256: `{mobile_hash}`")
    for still, _, digest in still_rows:
        report_lines.append(f"- `{still.key}` still SHA-256: `{digest}`")

    report = "\n".join(report_lines) + "\n"
    if args.write_report:
        REPORT.parent.mkdir(parents=True, exist_ok=True)
        REPORT.write_text(report)
    print(report)


if __name__ == "__main__":
    main()
