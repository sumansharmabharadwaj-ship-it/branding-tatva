from __future__ import annotations

import hashlib
import math
import re
import subprocess
from functools import lru_cache
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SEED = 48271


def loop_phase(t: float) -> float:
    return 2.0 * math.pi * (t % 1.0)


def smoothstep(start: float, end: float, value: float) -> float:
    if start == end:
        return 1.0 if value >= end else 0.0
    progress = max(0.0, min(1.0, (value - start) / (end - start)))
    return progress * progress * (3.0 - 2.0 * progress)


def static_noise(width: int, height: int, seed: int = SEED) -> np.ndarray:
    rng = np.random.default_rng(seed + width * 3 + height * 7)
    small = rng.random((max(2, height // 24), max(2, width // 24))).astype(np.float32)
    image = Image.fromarray(np.uint8(small * 255), "L").resize(
        (width, height), Image.Resampling.BICUBIC
    )
    return np.asarray(image, dtype=np.float32) / 255


def base_gradient(
    width: int,
    height: int,
    top_color: tuple[int, int, int],
    bottom_color: tuple[int, int, int],
) -> np.ndarray:
    y = np.linspace(0, 1, height, dtype=np.float32)[:, None, None]
    top = np.array(top_color, dtype=np.float32)[None, None, :]
    bottom = np.array(bottom_color, dtype=np.float32)[None, None, :]
    row = top * (1 - y) + bottom * y
    return np.broadcast_to(row, (height, width, 3)).copy()


@lru_cache(maxsize=16)
def hero_paths(width: int, height: int):
    rng = np.random.default_rng(771)
    paths = []

    def branch(
        start: tuple[float, float],
        angle: float,
        length: float,
        level: int,
        start_threshold: float,
    ) -> None:
        if level > 4 or length < 0.055:
            return

        start_x, start_y = start
        end_x = max(-0.05, min(1.05, start_x + math.cos(angle) * length))
        end_y = max(-0.02, min(1.04, start_y + math.sin(angle) * length))
        perpendicular = (-math.sin(angle), math.cos(angle))
        bend = rng.normal(0, 0.045) * (0.9 - level * 0.12)
        midpoint = (
            (start_x + end_x) / 2 + perpendicular[0] * bend,
            (start_y + end_y) / 2 + perpendicular[1] * bend,
        )

        points = []
        for index in range(34):
            u = index / 33
            point_x = (
                (1 - u) ** 2 * start_x
                + 2 * (1 - u) * u * midpoint[0]
                + u * u * end_x
            )
            point_y = (
                (1 - u) ** 2 * start_y
                + 2 * (1 - u) * u * midpoint[1]
                + u * u * end_y
            )
            wobble = math.sin(u * math.pi * 3 + rng.uniform(-0.2, 0.2)) * 0.006 * (1 - u)
            points.append(
                (
                    (point_x + perpendicular[0] * wobble) * width,
                    (point_y + perpendicular[1] * wobble) * height,
                )
            )

        end_threshold = min(1.0, start_threshold + 0.15 + 0.045 * level)
        line_width = max(1, int((5.4 - level * 0.88) * width / 1280))
        paths.append((points, start_threshold, end_threshold, line_width))

        child_count = 2 if level < 3 else (2 if rng.random() < 0.65 else 1)
        for child_index in range(child_count):
            spread = (0.30 + 0.10 * level) * (1 if child_index % 2 == 0 else -1)
            child_angle = angle + spread + rng.normal(0, 0.13)
            child_length = length * (0.66 + rng.uniform(-0.08, 0.05))
            branch(
                (end_x, end_y),
                child_angle,
                child_length,
                level + 1,
                end_threshold - 0.025,
            )

    origins = [
        (0.50, -0.02, 1.48, 0.33),
        (0.46, 0.04, 1.78, 0.29),
        (0.54, 0.04, 1.36, 0.29),
    ]
    for origin_x, origin_y, angle, length in origins:
        branch((origin_x, origin_y), angle, length, 0, 0.0)

    for angle in (2.25, 2.65, 0.48, 0.88):
        branch((0.50, 0.16), angle, 0.24, 1, 0.12)

    return paths


def partial_points(points, progress: float):
    progress = max(0.0, min(1.0, progress))
    if progress <= 0:
        return []
    if progress >= 1:
        return points
    count = max(2, int(round((len(points) - 1) * progress)) + 1)
    return points[:count]


@lru_cache(maxsize=8)
def hero_static_frame(width: int, height: int) -> Image.Image:
    frame = base_gradient(width, height, (7, 12, 11), (24, 19, 14))
    y, x = np.mgrid[0:height, 0:width]
    normalized_x = x / width
    normalized_y = y / height

    soil = 0.5 + 0.5 * np.sin(2 * np.pi * (normalized_x * 1.15 + normalized_y * 1.7))
    soil += 0.4 * np.sin(2 * np.pi * (-normalized_x * 2.2 + normalized_y * 2.7) + 0.8)
    soil = (soil - soil.min()) / (soil.max() - soil.min() + 1e-6)
    frame += soil[..., None] * np.array([7, 5, 3], dtype=np.float32)
    frame += (static_noise(width, height, 91)[..., None] - 0.5) * 3.2

    image = Image.fromarray(np.uint8(np.clip(frame, 0, 255)), "RGB").convert("RGBA")
    roots = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    root_draw = ImageDraw.Draw(roots)
    for points, _, _, line_width in hero_paths(width, height):
        root_draw.line(
            points,
            fill=(154, 143, 116, 48),
            width=max(1, line_width),
            joint="curve",
        )
    image = Image.alpha_composite(image, roots)

    shade = np.zeros((height, width, 4), dtype=np.uint8)
    shade[..., 3] = np.uint8(np.clip((1 - normalized_x) * 50 + normalized_y * 15, 0, 75))
    shade[..., :3] = np.array([5, 9, 8], dtype=np.uint8)
    return Image.alpha_composite(image, Image.fromarray(shade, "RGBA"))


def hero_root_frame(t: float, width: int, height: int) -> Image.Image:
    phase = loop_phase(t)
    progress = 0.86 * (0.5 - 0.5 * math.cos(phase))
    image = hero_static_frame(width, height).copy()

    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    active = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    active_draw = ImageDraw.Draw(active)

    for points, start_threshold, end_threshold, line_width in hero_paths(width, height):
        if progress <= start_threshold:
            continue
        active_progress = smoothstep(start_threshold, end_threshold, progress)
        active_points = partial_points(points, active_progress)
        if len(active_points) <= 1:
            continue
        glow_draw.line(
            active_points,
            fill=(210, 182, 119, 66),
            width=max(3, line_width * 5),
            joint="curve",
        )
        active_draw.line(
            active_points,
            fill=(232, 218, 177, 165),
            width=max(1, line_width + 1),
            joint="curve",
        )

    glow = glow.filter(ImageFilter.GaussianBlur(radius=max(3, width / 230)))
    image = Image.alpha_composite(image, glow)
    image = Image.alpha_composite(image, active)

    pulse = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    pulse_draw = ImageDraw.Draw(pulse)
    radius = (7 + 13 * progress) * width / 1280
    center_x, center_y = 0.5 * width, 0.15 * height
    pulse_draw.ellipse(
        (
            center_x - radius,
            center_y - radius,
            center_x + radius,
            center_y + radius,
        ),
        outline=(230, 204, 145, int(85 * progress)),
        width=max(1, int(1.3 * width / 1280)),
    )
    pulse = pulse.filter(ImageFilter.GaussianBlur(radius=max(1, width / 520)))
    image = Image.alpha_composite(image, pulse)
    return image.convert("RGB")


def topography_field(width: int, height: int) -> np.ndarray:
    y, x = np.mgrid[0:height, 0:width]
    normalized_x = x / width
    normalized_y = y / height
    field = (
        0.75 * np.sin(2 * np.pi * (0.75 * normalized_x + 0.18 * normalized_y))
        + 0.43 * np.sin(2 * np.pi * (-0.45 * normalized_x + 0.88 * normalized_y) + 1.3)
        + 0.27 * np.cos(2 * np.pi * (1.45 * normalized_x + 0.55 * normalized_y) + 0.6)
    )
    hills = (
        1.65 * np.exp(-(((normalized_x - 0.72) / 0.25) ** 2 + ((normalized_y - 0.33) / 0.26) ** 2))
        + 1.10 * np.exp(-(((normalized_x - 0.35) / 0.22) ** 2 + ((normalized_y - 0.72) / 0.30) ** 2))
        - 0.65 * np.exp(-(((normalized_x - 0.53) / 0.18) ** 2 + ((normalized_y - 0.54) / 0.21) ** 2))
    )
    return field + hills


@lru_cache(maxsize=16)
def route_points(width: int, height: int):
    points = []
    for index in range(120):
        progress = index / 119
        x = 0.12 + 0.78 * progress + 0.035 * math.sin(progress * math.pi * 2.5)
        y = 0.83 - 0.61 * progress + 0.055 * math.sin(progress * math.pi * 3.2 + 0.7)
        points.append((x * width, y * height))
    return points


@lru_cache(maxsize=8)
def strategy_static_array(width: int, height: int) -> np.ndarray:
    frame = base_gradient(width, height, (8, 14, 15), (19, 24, 20))
    field = topography_field(width, height)
    contour = np.power(
        np.clip(1 - np.abs(np.sin(field * math.pi * 3.4)) * 8.5, 0, 1),
        1.4,
    )
    frame += contour[..., None] * np.array([36, 39, 32], dtype=np.float32)
    relief = np.clip((field - field.min()) / (field.max() - field.min() + 1e-6), 0, 1)
    frame += relief[..., None] * np.array([6, 9, 7], dtype=np.float32)
    frame += (static_noise(width, height, 191)[..., None] - 0.5) * 2.5
    return frame


def strategy_frame(t: float, width: int, height: int) -> Image.Image:
    phase = loop_phase(t)
    clarity = 0.5 - 0.5 * math.cos(phase)
    y, x = np.mgrid[0:height, 0:width]
    normalized_x = x / width
    normalized_y = y / height
    frame = strategy_static_array(width, height).copy()

    fog = 0.5 + 0.5 * np.sin(
        2 * np.pi * (normalized_x * 0.62 + normalized_y * 0.42) + 0.18 * math.sin(phase)
    )
    fog *= 0.5 + 0.5 * np.sin(
        2 * np.pi * (-normalized_x * 0.35 + normalized_y * 0.77)
        + 1.2
        + 0.15 * math.sin(phase + 1.0)
    )
    fog = np.clip(fog, 0, 1)
    corridor = np.exp(
        -((normalized_y - (0.91 - 0.72 * normalized_x + 0.04 * np.sin(normalized_x * 10))) / 0.12) ** 2
    )
    fog_alpha = 0.22 * fog * (1 - 0.72 * clarity * corridor)
    fog_color = np.array([95, 105, 99], dtype=np.float32)
    frame = frame * (1 - fog_alpha[..., None]) + fog_color * fog_alpha[..., None]

    image = Image.fromarray(np.uint8(np.clip(frame, 0, 255)), "RGB").convert("RGBA")
    points = route_points(width, height)
    route_base = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    route_base_draw = ImageDraw.Draw(route_base)
    route_base_draw.line(
        points,
        fill=(199, 187, 153, 58),
        width=max(1, int(2 * width / 1280)),
        joint="curve",
    )
    image = Image.alpha_composite(image, route_base)

    active_points = partial_points(points, clarity)
    if len(active_points) > 1:
        glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        glow_draw = ImageDraw.Draw(glow)
        glow_draw.line(
            active_points,
            fill=(221, 190, 116, 125),
            width=max(5, int(12 * width / 1280)),
            joint="curve",
        )
        glow = glow.filter(ImageFilter.GaussianBlur(radius=max(3, width / 240)))
        image = Image.alpha_composite(image, glow)

        active = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        active_draw = ImageDraw.Draw(active)
        active_draw.line(
            active_points,
            fill=(240, 228, 191, 220),
            width=max(2, int(3 * width / 1280)),
            joint="curve",
        )
        image = Image.alpha_composite(image, active)

    shade = np.zeros((height, width, 4), dtype=np.uint8)
    shade[..., :3] = [4, 9, 9]
    shade[..., 3] = np.uint8(np.clip((1 - normalized_x) * 65, 0, 70))
    image = Image.alpha_composite(image, Image.fromarray(shade, "RGBA"))
    return image.convert("RGB")


@lru_cache(maxsize=16)
def canopy_paths(width: int, height: int):
    rng = np.random.default_rng(122)
    paths = []
    starts = [
        (0.10, -0.03, 1.20, 0.42),
        (0.88, -0.02, 1.95, 0.40),
        (0.52, -0.04, 1.50, 0.28),
    ]

    def branch(start: tuple[float, float], angle: float, length: float, level: int) -> None:
        if level > 3 or length < 0.055:
            return
        start_x, start_y = start
        end_x = start_x + math.cos(angle) * length
        end_y = start_y + math.sin(angle) * length
        perpendicular = (-math.sin(angle), math.cos(angle))
        bend = rng.normal(0, 0.035)
        midpoint = (
            (start_x + end_x) / 2 + perpendicular[0] * bend,
            (start_y + end_y) / 2 + perpendicular[1] * bend,
        )
        points = []
        for index in range(26):
            progress = index / 25
            points.append(
                (
                    (
                        (1 - progress) ** 2 * start_x
                        + 2 * (1 - progress) * progress * midpoint[0]
                        + progress * progress * end_x
                    )
                    * width,
                    (
                        (1 - progress) ** 2 * start_y
                        + 2 * (1 - progress) * progress * midpoint[1]
                        + progress * progress * end_y
                    )
                    * height,
                )
            )
        paths.append((points, max(1, int((5 - level) * width / 1280))))
        for direction in (-1, 1):
            if level == 3 and rng.random() < 0.5:
                continue
            branch(
                (end_x, end_y),
                angle + direction * (0.42 + rng.normal(0, 0.1)),
                length * (0.62 + rng.uniform(-0.06, 0.05)),
                level + 1,
            )

    for start_x, start_y, angle, length in starts:
        branch((start_x, start_y), angle, length, 0)
    return paths


@lru_cache(maxsize=8)
def health_static_frame(width: int, height: int) -> Image.Image:
    y, x = np.mgrid[0:height, 0:width]
    normalized_x = x / width
    normalized_y = y / height
    frame = base_gradient(width, height, (8, 15, 13), (18, 29, 22))
    ripples = 0.5 + 0.5 * np.sin(2 * np.pi * (normalized_x * 3.1 + normalized_y * 6.3))
    ripples += 0.45 * (
        0.5 + 0.5 * np.sin(2 * np.pi * (-normalized_x * 5.0 + normalized_y * 8.7) + 1.4)
    )
    frame += ripples[..., None] * np.array([5, 9, 7], dtype=np.float32)
    frame += (static_noise(width, height, 331)[..., None] - 0.5) * 2.2

    image = Image.fromarray(np.uint8(np.clip(frame, 0, 255)), "RGB").convert("RGBA")
    canopy = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    canopy_draw = ImageDraw.Draw(canopy)
    for points, line_width in canopy_paths(width, height):
        canopy_draw.line(
            points,
            fill=(98, 113, 90, 100),
            width=line_width,
            joint="curve",
        )
    canopy = canopy.filter(ImageFilter.GaussianBlur(radius=max(0.4, width / 2300)))
    image = Image.alpha_composite(image, canopy)

    moon = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    moon_draw = ImageDraw.Draw(moon)
    moon_x, moon_y = 0.68 * width, 0.255 * height
    moon_radius = 34 * width / 1280
    moon_draw.ellipse(
        (
            moon_x - moon_radius,
            moon_y - moon_radius,
            moon_x + moon_radius,
            moon_y + moon_radius,
        ),
        fill=(212, 211, 188, 110),
    )
    moon = moon.filter(ImageFilter.GaussianBlur(radius=max(5, width / 140)))
    return Image.alpha_composite(image, moon)


def health_frame(t: float, width: int, height: int) -> Image.Image:
    phase = loop_phase(t)
    reveal = 0.5 - 0.5 * math.cos(phase)
    y, x = np.mgrid[0:height, 0:width]
    normalized_x = x / width
    normalized_y = y / height
    waterline = 0.43
    image = health_static_frame(width, height).copy()
    moon_x = 0.68 * width

    reflection = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    reflection_draw = ImageDraw.Draw(reflection)
    shift = 0.025 * width * reveal
    for path_index, (points, line_width) in enumerate(canopy_paths(width, height)):
        mirrored = []
        for point_x, point_y in points:
            mirrored_y = 2 * waterline * height - point_y
            wave = (
                math.sin((mirrored_y / height) * 32 + path_index * 0.7 + 0.14 * math.sin(phase))
                * 3.5
                * width
                / 1280
            )
            local_shift = shift * (
                0.35
                + 0.65
                * min(1, max(0, (mirrored_y / height - waterline) / 0.5))
            )
            mirrored.append((point_x + wave + local_shift, mirrored_y))
        reflection_draw.line(
            mirrored,
            fill=(83, 104, 86, int(58 + 24 * reveal)),
            width=max(1, line_width),
            joint="curve",
        )
    reflection = reflection.filter(ImageFilter.GaussianBlur(radius=max(1.2, width / 650)))
    image = Image.alpha_composite(image, reflection)

    shimmer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    shimmer_draw = ImageDraw.Draw(shimmer)
    for index in range(26):
        shimmer_y = (waterline + 0.03 + index * 0.018) * height
        band = math.exp(-index / 18)
        shimmer_width = (
            18 + 44 * band + 7 * math.sin(index * 0.9 + phase * 0.08)
        ) * width / 1280
        offset = shift * 0.65 * band + math.sin(
            index * 0.74 + 0.12 * math.sin(phase)
        ) * 4 * width / 1280
        alpha = int((18 + 38 * band) * (0.55 + 0.45 * reveal))
        shimmer_draw.line(
            [
                (moon_x - shimmer_width + offset, shimmer_y),
                (moon_x + shimmer_width + offset, shimmer_y),
            ],
            fill=(205, 198, 164, alpha),
            width=max(1, int(1.6 * width / 1280)),
        )
    shimmer = shimmer.filter(ImageFilter.GaussianBlur(radius=max(0.8, width / 950)))
    image = Image.alpha_composite(image, shimmer)

    diagnostic = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    diagnostic_draw = ImageDraw.Draw(diagnostic)
    diagnostic_draw.line(
        [(0, waterline * height), (width, waterline * height)],
        fill=(196, 192, 167, 34),
        width=max(1, int(width / 900)),
    )
    center_x, center_y = 0.62 * width, 0.58 * height
    for index in range(4):
        radius = (20 + index * 28 + reveal * 18) * width / 1280
        alpha = int((65 - index * 11) * reveal)
        diagnostic_draw.ellipse(
            (
                center_x - radius * 1.8,
                center_y - radius * 0.55,
                center_x + radius * 1.8,
                center_y + radius * 0.55,
            ),
            outline=(222, 195, 132, alpha),
            width=max(1, int(1.4 * width / 1280)),
        )
    diagnostic = diagnostic.filter(ImageFilter.GaussianBlur(radius=max(0.6, width / 1200)))
    image = Image.alpha_composite(image, diagnostic)

    glow = np.exp(
        -(((normalized_x - 0.62) / 0.09) ** 2 + ((normalized_y - 0.58) / 0.15) ** 2)
        * 2.2
    ) * reveal
    glow_array = np.zeros((height, width, 4), dtype=np.uint8)
    glow_array[..., :3] = [210, 181, 116]
    glow_array[..., 3] = np.uint8(np.clip(glow * 42, 0, 55))
    image = Image.alpha_composite(image, Image.fromarray(glow_array, "RGBA"))

    shade = np.zeros((height, width, 4), dtype=np.uint8)
    shade[..., :3] = [5, 10, 8]
    shade[..., 3] = np.uint8(np.clip((1 - normalized_x) * 55, 0, 58))
    image = Image.alpha_composite(image, Image.fromarray(shade, "RGBA"))
    return image.convert("RGB")


FPS = 20
SECONDS = 5
SOURCE_WIDTH = 960
SOURCE_HEIGHT = 540
OUTPUT_WIDTH = 1280
OUTPUT_HEIGHT = 720
VIDEO_DIR = Path("public/videos/generated")
IMAGE_DIR = Path("public/images/generated")
MANIFEST_PATH = Path("src/app/services/generatedMediaManifest.ts")
README_PATH = VIDEO_DIR / "README.txt"

FAMILIES = {
    "bt-services-hero-root-system": hero_root_frame,
    "bt-services-strategy-topography": strategy_frame,
    "bt-services-health-reflection": health_frame,
}


def render_video(name: str, frame_function) -> Path:
    output = VIDEO_DIR / f"{name}.mp4"
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
        f"{SOURCE_WIDTH}x{SOURCE_HEIGHT}",
        "-r",
        str(FPS),
        "-i",
        "-",
        "-an",
        "-vf",
        f"scale={OUTPUT_WIDTH}:{OUTPUT_HEIGHT}:flags=lanczos",
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
        frame = frame_function(index / frame_count, SOURCE_WIDTH, SOURCE_HEIGHT)
        process.stdin.write(np.asarray(frame, dtype=np.uint8).tobytes())
    process.stdin.close()
    if process.wait() != 0:
        raise SystemExit(f"ffmpeg failed while rendering {name}")
    return output


def make_mobile_and_poster(name: str, desktop: Path) -> tuple[Path, Path]:
    mobile = VIDEO_DIR / f"{name}-mobile.mp4"
    poster = IMAGE_DIR / f"{name}-poster.jpg"
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
            "2.2",
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


def update_manifest() -> None:
    text = MANIFEST_PATH.read_text()
    if "coreMediaRevision:" in text:
        text = re.sub(
            r'coreMediaRevision: "[^"]+"',
            'coreMediaRevision: "clean-procedural-v2"',
            text,
            count=1,
        )
    else:
        marker = '  auditHarness: "locked-seven-loop-original-media-set",\n'
        if marker not in text:
            raise SystemExit("Could not locate the generated-media revision block")
        text = text.replace(
            marker,
            marker + '  coreMediaRevision: "clean-procedural-v2",\n',
            1,
        )
    MANIFEST_PATH.write_text(text)


def update_readme() -> None:
    text = README_PATH.read_text()
    note = """Clean core media revision
- hero root system, strategy topography, and health reflection are rendered procedurally from NumPy and Pillow geometry
- no imported raster footage, third-party title card, logo, or watermark is used in these three families
- the public file paths remain unchanged, so page wiring and responsive fallbacks continue without migration

"""
    if "Clean core media revision" not in text:
        marker = "Implementation rules\n"
        if marker not in text:
            raise SystemExit("Could not locate the generated-media README rules")
        text = text.replace(marker, note + marker, 1)
    README_PATH.write_text(text)


def write_checksums() -> None:
    rows = []
    for path in sorted(VIDEO_DIR.glob("*.mp4")):
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        rows.append(f"{digest}  {path.name}")
    (VIDEO_DIR / "SHA256SUMS.txt").write_text("\n".join(rows) + "\n")


def validate_loop_endpoints() -> None:
    for name, frame_function in FAMILIES.items():
        opening = np.asarray(frame_function(0.0, 320, 180))
        closing = np.asarray(frame_function(1.0, 320, 180))
        if not np.array_equal(opening, closing):
            difference = np.abs(opening.astype(np.int16) - closing.astype(np.int16)).max()
            raise SystemExit(f"{name} loop endpoints differ by {difference}")


def main() -> None:
    VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    validate_loop_endpoints()

    outputs = []
    for name, frame_function in FAMILIES.items():
        desktop = render_video(name, frame_function)
        mobile, poster = make_mobile_and_poster(name, desktop)
        outputs.extend([desktop, mobile, poster])

    update_manifest()
    update_readme()
    write_checksums()

    for path in outputs:
        print(path, path.stat().st_size)


if __name__ == "__main__":
    main()
