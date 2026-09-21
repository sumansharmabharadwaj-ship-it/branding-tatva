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
VIDEO_DIR = Path("public/videos/generated")
IMAGE_DIR = Path("public/images/generated")
PAGE_PATH = Path("src/app/services/page.tsx")


def smoothstep(value: np.ndarray) -> np.ndarray:
    value = np.clip(value, 0.0, 1.0)
    return value * value * (3.0 - 2.0 * value)


def package_current_frame(t: float, width: int, height: int) -> Image.Image:
    y, x = np.mgrid[0:height, 0:width]
    X = x / width
    Y = y / height
    phase = 2.0 * np.pi * t

    frame = np.zeros((height, width, 3), dtype=np.float32)
    frame[..., 0] = 10 / 255
    frame[..., 1] = 20 / 255
    frame[..., 2] = 25 / 255

    water = (
        np.sin(2 * np.pi * (2.2 * X + 1.1 * Y) + phase)
        + 0.5 * np.sin(2 * np.pi * (-3.7 * X + 2.4 * Y) - phase * 1.3)
        + 0.35 * np.sin(2 * np.pi * (7.1 * X + 4.2 * Y) + phase * 2.0)
    ) / 1.85
    water = (water + 1.0) / 2.0
    frame += water[..., None] * np.array([0.025, 0.055, 0.075], dtype=np.float32)

    caustic = np.abs(np.sin(2 * np.pi * (8.5 * X + 3.2 * Y) + phase * 1.2))
    caustic *= np.abs(np.sin(2 * np.pi * (-5.2 * X + 7.1 * Y) - phase * 0.8))
    caustic = np.power(caustic, 8)
    frame += caustic[..., None] * np.array([0.035, 0.06, 0.07], dtype=np.float32)

    progress = (1.0 - math.cos(phase)) / 2.0
    currents = np.zeros_like(frame)
    centers = (
        0.28 + 0.06 * np.sin(2 * np.pi * (X * 0.8) + phase * 0.35),
        0.50 + 0.05 * np.sin(2 * np.pi * (X * 0.9) - phase * 0.30),
        0.72 + 0.055 * np.sin(2 * np.pi * (X * 0.7) + phase * 0.22),
    )
    target = 0.52 + 0.03 * np.sin(2 * np.pi * X + phase * 0.25)
    masks: list[np.ndarray] = []

    for center in centers:
        blend = smoothstep((X - 0.45) / 0.45) * progress
        curve = center * (1.0 - blend) + target * blend
        distance = np.abs(Y - curve)
        mask = np.exp(-np.square(distance / (0.018 + 0.008 * np.sin(np.pi * X) ** 2)))
        mask *= smoothstep((X - 0.25) / 0.15)
        masks.append(mask)
        currents += mask[..., None] * np.array([0.025, 0.065, 0.085], dtype=np.float32)

    selected = masks[1] * smoothstep((X - 0.58) / 0.25) * progress
    selected *= 0.55 + 0.45 * np.sin(2 * np.pi * (X * 2.2) - phase * 0.8) ** 2
    currents += selected[..., None] * np.array([0.36, 0.25, 0.09], dtype=np.float32)
    frame += currents

    radius = np.sqrt((X - 0.78) ** 2 + ((Y - 0.52) * 1.6) ** 2)
    ripple = np.exp(-np.square((radius - (0.08 + 0.02 * np.sin(phase))) / 0.008))
    frame += (ripple * progress)[..., None] * np.array([0.08, 0.11, 0.11], dtype=np.float32)

    left_scrim = 1.0 - 0.45 * (1.0 - smoothstep((X - 0.15) / 0.45))
    vignette = 1.0 - 0.35 * np.clip(((X - 0.5) ** 2 + (Y - 0.5) ** 2) / 0.5, 0.0, 1.0)
    frame *= left_scrim[..., None] * vignette[..., None]

    grain = np.random.default_rng(123).normal(0.0, 0.0045, (height, width, 1)).astype(np.float32)
    frame += grain
    return Image.fromarray(np.clip(frame * 255, 0, 255).astype(np.uint8), mode="RGB")


def ridge_curve(X: np.ndarray, base_y: float, seed: int, amplitude: float) -> np.ndarray:
    rng = np.random.default_rng(seed)
    curve = np.full_like(X, base_y, dtype=np.float32)
    for harmonic in range(1, 6):
        frequency = rng.uniform(0.5, 2.2) * harmonic / 1.5
        phase = rng.uniform(0.0, 2.0 * np.pi)
        strength = amplitude / (harmonic**1.25) * rng.uniform(0.6, 1.1)
        curve += strength * np.sin(2.0 * np.pi * frequency * X + phase)
    return curve


def perception_ascent_frame(t: float, width: int, height: int) -> Image.Image:
    y, x = np.mgrid[0:height, 0:width]
    X = x / width
    Y = y / height
    phase = 2.0 * np.pi * t

    top = np.array([21, 31, 37], dtype=np.float32) / 255
    middle = np.array([31, 44, 50], dtype=np.float32) / 255
    bottom = np.array([8, 15, 18], dtype=np.float32) / 255
    sky_mix = np.clip(Y / 0.7, 0.0, 1.0)[..., None]
    frame = top * (1.0 - sky_mix) + middle * sky_mix
    ground_mix = np.clip((Y - 0.45) / 0.55, 0.0, 1.0)[..., None]
    frame = frame * (1.0 - ground_mix) + bottom * ground_mix

    sky_glow = np.exp(-(((X - 0.80) / 0.22) ** 2 + ((Y - 0.34) / 0.18) ** 2))
    frame += sky_glow[..., None] * np.array([0.035, 0.05, 0.055], dtype=np.float32)

    ridge_specs = (
        (0.48, 11, 0.035, np.array([42, 56, 59], dtype=np.float32) / 255, 0.65),
        (0.58, 22, 0.055, np.array([28, 42, 45], dtype=np.float32) / 255, 0.78),
        (0.68, 33, 0.070, np.array([18, 31, 34], dtype=np.float32) / 255, 0.88),
        (0.80, 44, 0.090, np.array([9, 19, 22], dtype=np.float32) / 255, 1.00),
    )
    curves: list[np.ndarray] = []
    for index, (base_y, seed, amplitude, color, opacity) in enumerate(ridge_specs):
        curve = ridge_curve(X, base_y, seed, amplitude)
        curve += 0.006 * np.sin(phase * (0.22 + index * 0.03) + index)
        curves.append(curve)
        mask = (Y > curve)[..., None].astype(np.float32)
        frame = frame * (1.0 - mask * opacity) + color * (mask * opacity)
        edge = np.exp(-np.square((Y - curve) / 0.006))
        frame += edge[..., None] * np.array([0.012, 0.018, 0.020], dtype=np.float32) * (1 - index * 0.12)

    fog = np.zeros((height, width), dtype=np.float32)
    fog_specs = (
        (0.44, 0.060, 0.62, 0.17),
        (0.57, 0.075, 0.48, -0.13),
        (0.69, 0.065, 0.32, 0.11),
    )
    for index, (center_y, sigma, strength, speed) in enumerate(fog_specs):
        center = center_y + 0.012 * np.sin(phase * (0.8 + index * 0.1) + index)
        band = np.exp(-np.square((Y - center) / sigma))
        wave = 0.58 + 0.42 * (
            np.sin(2 * np.pi * (X * (1.0 + index * 0.45)) + phase * speed + index * 1.7) * 0.5 + 0.5
        )
        detail = 0.8 + 0.2 * np.sin(2 * np.pi * (X * 4.0 + Y * 2.0) - phase * 0.23 + index)
        fog += band * wave * detail * strength
    fog = np.clip(fog, 0.0, 0.75)
    mist = np.array([122, 140, 147], dtype=np.float32) / 255
    frame = frame * (1.0 - fog[..., None]) + mist * fog[..., None]

    clarity = (1.0 - math.cos(phase)) / 2.0
    light_x = 0.79
    light_column = int(light_x * (width - 1))
    light_y = float(curves[1][0, light_column]) - 0.012
    distance = ((X - light_x) / 0.85) ** 2 + (Y - light_y) ** 2
    glow = np.exp(-distance / (0.010 + 0.012 * (1.0 - clarity)) ** 2) * (0.12 + 0.55 * clarity)
    core = np.exp(-distance / 0.0038**2) * (0.6 + 0.4 * clarity)
    frame += glow[..., None] * np.array([0.26, 0.31, 0.30], dtype=np.float32)
    frame += core[..., None] * np.array([0.55, 0.56, 0.48], dtype=np.float32)

    reflection = np.exp(-np.square((X - light_x) / 0.008))
    reflection *= np.exp(-np.square((Y - (light_y + 0.11)) / 0.12))
    reflection *= (0.4 + 0.6 * np.sin(2 * np.pi * (Y * 18) - phase * 0.45) ** 2) * clarity * 0.5
    frame += reflection[..., None] * np.array([0.08, 0.10, 0.10], dtype=np.float32)

    reveal = smoothstep((X - 0.42) / 0.45) * clarity
    frame += reveal[..., None] * np.array([0.018, 0.023, 0.024], dtype=np.float32)
    left_scrim = 0.48 + 0.52 * smoothstep((X - 0.08) / 0.52)
    vignette = 1.0 - 0.28 * np.clip(((X - 0.55) ** 2 + (Y - 0.48) ** 2) / 0.65, 0.0, 1.0)
    frame *= left_scrim[..., None] * vignette[..., None]

    grain = np.random.default_rng(872).normal(0.0, 0.004, (height, width, 1)).astype(np.float32)
    frame += grain
    return Image.fromarray(np.clip(frame * 255, 0, 255).astype(np.uint8), mode="RGB")


def render_video(name: str, frame_factory) -> Path:
    output = VIDEO_DIR / f"{name}.mp4"
    command = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24",
        "-s", f"{WIDTH}x{HEIGHT}", "-r", str(FPS), "-i", "-",
        "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "19",
        "-pix_fmt", "yuv420p", "-g", str(FPS * 2),
        "-keyint_min", str(FPS * 2), "-sc_threshold", "0",
        "-movflags", "+faststart", str(output),
    ]
    process = subprocess.Popen(command, stdin=subprocess.PIPE)
    assert process.stdin is not None
    frame_count = FPS * SECONDS
    for index in range(frame_count):
        frame = frame_factory(index / frame_count, WIDTH, HEIGHT)
        process.stdin.write(np.asarray(frame, dtype=np.uint8).tobytes())
    process.stdin.close()
    if process.wait() != 0:
        raise SystemExit(f"ffmpeg failed while rendering {name}")
    return output


def make_mobile_and_poster(desktop: Path) -> None:
    stem = desktop.stem
    mobile = VIDEO_DIR / f"{stem}-mobile.mp4"
    poster = IMAGE_DIR / f"{stem}-poster.jpg"
    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error", "-i", str(desktop), "-an",
            "-vf", "scale=960:540:force_original_aspect_ratio=decrease,pad=960:540:(ow-iw)/2:(oh-ih)/2",
            "-c:v", "libx264", "-preset", "medium", "-crf", "23",
            "-pix_fmt", "yuv420p", "-g", str(FPS * 2), "-keyint_min", str(FPS * 2),
            "-sc_threshold", "0", "-movflags", "+faststart", str(mobile),
        ],
        check=True,
    )
    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error", "-ss", "2.5", "-i", str(desktop),
            "-frames:v", "1", "-q:v", "2", str(poster),
        ],
        check=True,
    )


def update_services_page() -> None:
    text = PAGE_PATH.read_text()

    old_desire = '''          <BackgroundVideo parallax
            push
            video="/videos/pexels-forest-floor-fungi.mp4"
            videoWebm="/videos/pexels-forest-floor-fungi.webm"
            poster="/images/pexels-forest-floor-fungi-poster.jpg"
          />'''
    new_desire = '''          {/* Original procedural package-choice loop: three
              legitimate currents remain visible, then settle into one
              legible channel. The restrained mineral-gold trace marks
              choice without turning the section into a prize animation. */}
          <BackgroundVideo
            parallax
            push
            video="/videos/generated/bt-services-package-current.mp4"
            videoMobile="/videos/generated/bt-services-package-current-mobile.mp4"
            poster="/images/generated/bt-services-package-current-poster.jpg"
          />'''
    if text.count(old_desire) != 1:
        raise SystemExit("Could not locate the current Desire media block exactly once")
    text = text.replace(old_desire, new_desire, 1)

    old_education = '''          <BackgroundVideo
            parallax
            video="/videos/pexels-redwood-ferns.mp4"
            videoWebm="/videos/pexels-redwood-ferns.webm"
            poster="/images/pexels-redwood-ferns-poster.jpg"
          />'''
    new_education = '''          {/* Original procedural perception-ascent loop:
              layered terrain and mist clarify around one distant signal.
              The landscape becomes more legible as the signal becomes
              easier to locate, so the animation teaches recognition
              rather than merely showing generic upward growth. */}
          <BackgroundVideo
            parallax
            video="/videos/generated/bt-services-perception-ascent.mp4"
            videoMobile="/videos/generated/bt-services-perception-ascent-mobile.mp4"
            poster="/images/generated/bt-services-perception-ascent-poster.jpg"
          />'''
    if text.count(old_education) != 1:
        raise SystemExit("Could not locate the current Education media block exactly once")
    text = text.replace(old_education, new_education, 1)

    education_comment = re.compile(
        r'''          \{/\* Approved Education footage \(Pexels 8522207, David Roberts,.*?loop\)\. \*/\}\n''',
        re.DOTALL,
    )
    text, count = education_comment.subn("", text, count=1)
    if count != 1:
        print("Warning: the legacy Education footage comment was not removed; media wiring is still valid.")

    PAGE_PATH.write_text(text)


def write_checksums() -> None:
    rows = []
    for path in sorted(VIDEO_DIR.glob("*.mp4")):
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        rows.append(f"{digest}  {path.name}")
    (VIDEO_DIR / "SHA256SUMS.txt").write_text("\n".join(rows) + "\n")


def main() -> None:
    VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    package = render_video("bt-services-package-current", package_current_frame)
    perception = render_video("bt-services-perception-ascent", perception_ascent_frame)
    make_mobile_and_poster(package)
    make_mobile_and_poster(perception)
    update_services_page()
    write_checksums()
    for path in (package, perception):
        print(path, path.stat().st_size)


if __name__ == "__main__":
    main()
