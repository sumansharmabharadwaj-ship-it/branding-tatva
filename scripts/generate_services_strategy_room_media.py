from __future__ import annotations

import hashlib
import math
import re
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image

FPS = 24
SECONDS = 5
WIDTH = 1280
HEIGHT = 720
VIDEO_NAME = "bt-services-strategy-room"
VIDEO_DIR = Path("public/videos/generated")
IMAGE_DIR = Path("public/images/generated")
PAGE_PATH = Path("src/app/services/page.tsx")
MANIFEST_PATH = Path("src/app/services/generatedMediaManifest.ts")
README_PATH = VIDEO_DIR / "README.txt"


def strategy_room_frame(t: float, width: int, height: int) -> Image.Image:
    """Render a seamless dark-water arrival scene.

    Surface noise breathes into a narrow mineral-gold reflection at the
    midpoint of the loop, then returns to its opening state. The film is
    a natural metaphor for the final Services decision: scattered signals
    becoming calm enough to read before a real conversation begins.
    """

    y, x = np.mgrid[0:height, 0:width]
    X = x / width
    Y = y / height
    phase = 2.0 * np.pi * t

    drift_a = 0.24 * np.sin(phase)
    drift_b = 0.18 * np.sin(phase + 1.7)
    drift_c = 0.12 * np.sin(2.0 * phase + 0.6)

    top = np.array([7, 13, 14], dtype=np.float32) / 255
    middle = np.array([13, 21, 21], dtype=np.float32) / 255
    bottom = np.array([23, 19, 15], dtype=np.float32) / 255

    sky_mix = np.clip(Y / 0.55, 0.0, 1.0)[..., None]
    frame = top * (1.0 - sky_mix) + middle * sky_mix
    lower_mix = np.clip((Y - 0.45) / 0.55, 0.0, 1.0)[..., None]
    frame = frame * (1.0 - lower_mix) + bottom * lower_mix

    water = (
        np.sin(2 * np.pi * (0.85 * X + 1.25 * Y) + drift_a)
        + 0.65 * np.sin(2 * np.pi * (-1.4 * X + 2.2 * Y) + drift_b)
        + 0.35 * np.sin(2 * np.pi * (3.8 * X + 5.1 * Y) + drift_c)
        + 0.18 * np.sin(2 * np.pi * (-7.0 * X + 8.2 * Y) - 0.10 * np.sin(phase + 2.3))
    ) / 2.18
    frame += ((water + 1.0) / 2.0)[..., None] * np.array([0.018, 0.026, 0.025], dtype=np.float32)

    caustic_a = np.abs(np.sin(2 * np.pi * (3.2 * X + 5.8 * Y) + 0.20 * np.sin(phase + 0.4)))
    caustic_b = np.abs(np.sin(2 * np.pi * (-4.5 * X + 3.7 * Y) + 0.16 * np.sin(phase + 2.1)))
    caustic = np.power(caustic_a * caustic_b, 9)
    frame += caustic[..., None] * np.array([0.022, 0.030, 0.028], dtype=np.float32)

    clarity = (1.0 - math.cos(phase)) / 2.0
    center_x = 0.53 + 0.012 * np.sin(phase)

    halo = np.exp(-(((X - center_x) / 0.34) ** 2 + ((Y - 0.43) / 0.36) ** 2) * 2.0)
    frame += halo[..., None] * (0.14 + 0.20 * clarity) * np.array([0.28, 0.18, 0.08], dtype=np.float32)

    column_width = 0.28 - 0.15 * clarity
    column = np.exp(-np.square((X - center_x) / column_width))
    vertical_falloff = np.exp(-np.square((Y - 0.50) / 0.36))
    glints = (
        np.power(
            np.clip(np.sin(2 * np.pi * (Y * 13.0 + X * 0.8) + 0.22 * np.sin(phase + 0.5)), 0.0, 1.0),
            10,
        )
        + 0.55
        * np.power(
            np.clip(
                np.sin(2 * np.pi * (Y * 21.0 - X * 1.1) + 0.17 * np.sin(phase + 2.0) + 1.4),
                0.0,
                1.0,
            ),
            12,
        )
        + 0.28
        * np.power(
            np.clip(
                np.sin(2 * np.pi * (Y * 34.0 + X * 1.7) + 0.11 * np.sin(2 * phase + 1.2) + 2.2),
                0.0,
                1.0,
            ),
            14,
        )
    )
    breakup = 0.38 + 0.62 * (
        np.sin(2 * np.pi * (X * 4.2 + Y * 2.0) + 0.12 * np.sin(phase + 0.9)) ** 2
    )
    glitter = column * vertical_falloff * glints * breakup * (0.38 + 0.48 * clarity)
    frame += glitter[..., None] * np.array([0.78, 0.55, 0.26], dtype=np.float32)

    core = np.exp(-(((X - center_x) / 0.10) ** 2 + ((Y - 0.36) / 0.065) ** 2) * 2.6)
    core *= 0.14 + 0.18 * clarity
    frame += core[..., None] * np.array([0.46, 0.34, 0.20], dtype=np.float32)

    radius = np.sqrt(((X - center_x) / 1.0) ** 2 + ((Y - 0.50) / 0.72) ** 2)
    ripples = np.zeros_like(radius)
    for index, base_radius in enumerate((0.10, 0.18, 0.27)):
        moving_radius = base_radius + 0.006 * np.sin(phase + index)
        ripples += np.exp(-np.square((radius - moving_radius) / 0.0035)) * (0.45 - 0.08 * index)
    frame += (ripples * (0.02 + 0.045 * clarity))[..., None] * np.array(
        [0.38, 0.30, 0.21], dtype=np.float32
    )

    mist_band = np.exp(-np.square((Y - (0.15 + 0.008 * np.sin(phase + 0.3))) / 0.12))
    mist_wave = 0.55 + 0.45 * (
        np.sin(2 * np.pi * (X * 1.3) + 0.10 * np.sin(phase + 1.1)) ** 2
    )
    mist = np.clip(mist_band * mist_wave * 0.08, 0.0, 0.12)
    mist_color = np.array([0.20, 0.23, 0.22], dtype=np.float32)
    frame = frame * (1.0 - mist[..., None]) + mist_color * mist[..., None]

    vignette = 1.0 - 0.36 * np.clip(
        ((X - 0.52) ** 2 / 0.55 + (Y - 0.48) ** 2 / 0.48),
        0.0,
        1.0,
    )
    frame *= vignette[..., None]

    grain = np.random.default_rng(171).normal(0.0, 0.0032, (height, width, 1)).astype(np.float32)
    frame += grain
    return Image.fromarray(np.clip(frame * 255, 0, 255).astype(np.uint8), mode="RGB")


def render_video() -> Path:
    output = VIDEO_DIR / f"{VIDEO_NAME}.mp4"
    command = [
        "ffmpeg",
        "-y",
        "-loglevel",
        "error",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{WIDTH}x{HEIGHT}",
        "-r",
        str(FPS),
        "-i",
        "-",
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "19",
        "-pix_fmt",
        "yuv420p",
        "-g",
        str(FPS * 2),
        "-keyint_min",
        str(FPS * 2),
        "-sc_threshold",
        "0",
        "-movflags",
        "+faststart",
        str(output),
    ]
    process = subprocess.Popen(command, stdin=subprocess.PIPE)
    assert process.stdin is not None
    frame_count = FPS * SECONDS
    for index in range(frame_count):
        frame = strategy_room_frame(index / frame_count, WIDTH, HEIGHT)
        process.stdin.write(np.asarray(frame, dtype=np.uint8).tobytes())
    process.stdin.close()
    if process.wait() != 0:
        raise SystemExit("ffmpeg failed while rendering the Strategy Room film")
    return output


def make_mobile_and_poster(desktop: Path) -> tuple[Path, Path]:
    mobile = VIDEO_DIR / f"{VIDEO_NAME}-mobile.mp4"
    poster = IMAGE_DIR / f"{VIDEO_NAME}-poster.jpg"
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(desktop),
            "-an",
            "-vf",
            "scale=960:540:force_original_aspect_ratio=decrease,pad=960:540:(ow-iw)/2:(oh-ih)/2",
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "23",
            "-pix_fmt",
            "yuv420p",
            "-g",
            str(FPS * 2),
            "-keyint_min",
            str(FPS * 2),
            "-sc_threshold",
            "0",
            "-movflags",
            "+faststart",
            str(mobile),
        ],
        check=True,
    )
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-ss",
            "2.5",
            "-i",
            str(desktop),
            "-frames:v",
            "1",
            "-q:v",
            "2",
            str(poster),
        ],
        check=True,
    )
    return mobile, poster


def update_services_page() -> None:
    text = PAGE_PATH.read_text()

    comment_pattern = re.compile(r'''        \{/\* Book call.*?(?=        <TexturedDark)''', re.DOTALL)
    new_comment = '''        {/* Book call becomes the film's arrival rather than a
            stock-location ending. Surface movement gradually settles
            into one mineral-gold reflection, mirroring the visitor's
            shift from scattered questions to a focused conversation.
            The source is original, silent, mathematically seamless,
            responsive, and preserved as a still under reduced motion. */}\n'''
    text, comment_count = comment_pattern.subn(new_comment, text, count=1)
    if comment_count != 1:
        print("Warning: the previous Book call art-direction comment was not found.")

    block_pattern = re.compile(
        r'''        <TexturedDark\n'''
        r'''          id="book"\n'''
        r'''          image="[^"]+"\n'''
        r'''          video="[^"]+"\n'''
        r'''(?:          videoMobile="[^"]+"\n)?'''
        r'''(?:          videoWebm="[^"]+"\n)?'''
        r'''(?:          overlayGradient="[^"]+"\n)?'''
        r'''          className="scroll-mt-24 pb-16 pt-24 sm:pb-20 sm:pt-32"\n'''
        r'''        >'''
    )
    new_block = '''        <TexturedDark
          id="book"
          image="/images/generated/bt-services-strategy-room-poster.jpg"
          video="/videos/generated/bt-services-strategy-room.mp4"
          videoMobile="/videos/generated/bt-services-strategy-room-mobile.mp4"
          overlayGradient="linear-gradient(180deg, rgba(10,15,16,0.42) 0%, rgba(14,18,18,0.52) 52%, rgba(20,17,14,0.74) 100%)"
          className="scroll-mt-24 pb-16 pt-24 sm:pb-20 sm:pt-32"
        >'''
    text, block_count = block_pattern.subn(new_block, text, count=1)
    if block_count != 1:
        raise SystemExit("Could not locate the Strategy Room TexturedDark block exactly once")

    PAGE_PATH.write_text(text)


def update_manifest() -> None:
    text = MANIFEST_PATH.read_text()
    text = re.sub(r"desktopLoops: \d+", "desktopLoops: 6", text, count=1)
    text = re.sub(r"mobileLoops: \d+", "mobileLoops: 6", text, count=1)

    if "strategyRoom:" not in text:
        entry = '''  strategyRoom: {
    desktop: "/videos/generated/bt-services-strategy-room.mp4",
    mobile: "/videos/generated/bt-services-strategy-room-mobile.mp4",
    poster: "/images/generated/bt-services-strategy-room-poster.jpg",
    purpose: "Let surface noise settle into one calm, legible reflection before the conversation begins.",
  },
'''
        marker = "  health: {"
        if marker not in text:
            raise SystemExit("Could not locate the health entry in the generated-media manifest")
        text = text.replace(marker, entry + marker, 1)

    MANIFEST_PATH.write_text(text)


def update_readme() -> None:
    text = README_PATH.read_text()
    if "Strategy Room / booking" not in text:
        section = '''Strategy Room / booking
- bt-services-strategy-room.mp4
- bt-services-strategy-room-mobile.mp4
- poster: /images/generated/bt-services-strategy-room-poster.jpg
- role: lets surface noise settle into one calm reflection before a focused conversation begins

'''
        marker = "Implementation rules\n"
        if marker not in text:
            raise SystemExit("Could not locate the README implementation rules")
        text = text.replace(marker, section + marker, 1)
    README_PATH.write_text(text)


def write_checksums() -> None:
    rows = []
    for path in sorted(VIDEO_DIR.glob("*.mp4")):
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        rows.append(f"{digest}  {path.name}")
    (VIDEO_DIR / "SHA256SUMS.txt").write_text("\n".join(rows) + "\n")


def main() -> None:
    VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)

    desktop = render_video()
    mobile, poster = make_mobile_and_poster(desktop)
    update_services_page()
    update_manifest()
    update_readme()
    write_checksums()

    for path in (desktop, mobile, poster):
        print(path, path.stat().st_size)


if __name__ == "__main__":
    main()
