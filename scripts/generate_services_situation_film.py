#!/usr/bin/env python3
"""Render the original Services Situation film from its generated keyframe.

The three material states represent the page's three starting points:
- a mineral seed beginning
- shifted strata ready to realign
- repeating rings carrying consistency forward

The motion is deliberately restrained and mathematically periodic. The
first and last frames match, desktop and mobile are directed separately,
and all visible animation is camera movement plus changing light.
"""

from __future__ import annotations

import argparse
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

FRAME_COUNT = 150
DESKTOP_SIZE = (1600, 900)
MOBILE_SIZE = (720, 1280)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--desktop-dir", type=Path, required=True)
    parser.add_argument("--mobile-dir", type=Path, required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    args.desktop_dir.mkdir(parents=True, exist_ok=True)
    args.mobile_dir.mkdir(parents=True, exist_ok=True)

    base = Image.open(args.source).convert("RGB")
    base = ImageEnhance.Color(base).enhance(0.86)
    base = ImageEnhance.Contrast(base).enhance(1.05)
    base = ImageEnhance.Brightness(base).enhance(0.94)
    base_width, base_height = base.size

    yy, xx = np.ogrid[:base_height, :base_width]

    def radial_mask(
        center_x: float,
        center_y: float,
        radius_x: float,
        radius_y: float,
        power: float = 1.7,
    ) -> Image.Image:
        distance = ((xx - center_x) / radius_x) ** 2 + ((yy - center_y) / radius_y) ** 2
        mask = np.clip(1.0 - distance, 0.0, 1.0) ** power
        return Image.fromarray(np.uint8(mask * 255), mode="L").filter(ImageFilter.GaussianBlur(18))

    masks = [
        radial_mask(360, 1125, 260, 250, 1.9),
        radial_mask(1360, 1070, 610, 390, 1.8),
        radial_mask(2290, 1080, 620, 470, 1.7),
    ]
    glow_colours = [
        (238, 232, 215),
        (211, 190, 148),
        (222, 196, 142),
    ]

    def add_glow(
        image: Image.Image,
        mask: Image.Image,
        colour: tuple[int, int, int],
        opacity: float,
    ) -> Image.Image:
        rgba = image.convert("RGBA")
        alpha = mask.point(lambda value: int(value * opacity))
        layer = Image.new("RGBA", image.size, (*colour, 0))
        layer.putalpha(alpha)
        return Image.alpha_composite(rgba, layer).convert("RGB")

    def camera_frame(image: Image.Image, phase: float, target: tuple[int, int]) -> Image.Image:
        target_ratio = target[0] / target[1]
        zoom = 1.03 + 0.018 * (0.5 - 0.5 * math.cos(phase))
        crop_width = base_width / zoom
        crop_height = crop_width / target_ratio
        if crop_height > base_height:
            crop_height = base_height / zoom
            crop_width = crop_height * target_ratio

        drift_x = 22 * math.sin(phase)
        drift_y = 8 * (math.cos(phase) - 1)
        center_x = base_width / 2 + drift_x
        center_y = base_height / 2 + drift_y
        box = (
            int(center_x - crop_width / 2),
            int(center_y - crop_height / 2),
            int(center_x + crop_width / 2),
            int(center_y + crop_height / 2),
        )
        return image.crop(box).resize(target, Image.Resampling.LANCZOS)

    for index in range(FRAME_COUNT):
        phase = 2 * math.pi * index / (FRAME_COUNT - 1)
        pulses = [
            0.08 + 0.12 * (0.5 + 0.5 * math.sin(phase - math.pi / 2)),
            0.07 + 0.10 * (0.5 + 0.5 * math.sin(phase - math.pi / 2 + 2.0)),
            0.06 + 0.11 * (0.5 + 0.5 * math.sin(phase - math.pi / 2 + 4.0)),
        ]

        lit = base
        for mask, colour, opacity in zip(masks, glow_colours, pulses):
            lit = add_glow(lit, mask, colour, opacity)

        desktop = camera_frame(lit, phase, DESKTOP_SIZE)
        desktop.save(
            args.desktop_dir / f"frame-{index:04d}.jpg",
            quality=89,
            subsampling=1,
            optimize=True,
        )

        # Preserve all three states on phones in a lower material band,
        # leaving a low-detail field for the heading and selectable rows.
        background = ImageOps.fit(
            lit,
            MOBILE_SIZE,
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.48),
        )
        background = background.filter(ImageFilter.GaussianBlur(22))
        background = ImageEnhance.Brightness(background).enhance(0.26)

        strip_width = 760
        strip_height = round(strip_width * base_height / base_width)
        strip = lit.resize((strip_width, strip_height), Image.Resampling.LANCZOS)
        strip_x = -20 + round(8 * math.sin(phase))
        strip_y = 760 + round(5 * (math.cos(phase) - 1))

        alpha_array = np.full((strip_height, strip_width), 255, dtype=np.uint8)
        fade_top = min(100, strip_height // 3)
        fade_bottom = min(70, strip_height // 4)
        alpha_array[:fade_top] = np.linspace(0, 255, fade_top, dtype=np.uint8)[:, None]
        alpha_array[-fade_bottom:] = np.linspace(255, 0, fade_bottom, dtype=np.uint8)[:, None]
        alpha = Image.fromarray(alpha_array, mode="L")

        mobile = background.convert("RGBA")
        strip_rgba = strip.convert("RGBA")
        strip_rgba.putalpha(alpha)
        mobile.alpha_composite(strip_rgba, (strip_x, strip_y))
        mobile.convert("RGB").save(
            args.mobile_dir / f"frame-{index:04d}.jpg",
            quality=87,
            subsampling=1,
            optimize=True,
        )


if __name__ == "__main__":
    main()
