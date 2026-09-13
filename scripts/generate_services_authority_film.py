#!/usr/bin/env python3
"""Render the original Services Authority film from its generated keyframe.

The background is a natural five-layer material cross-section. A quiet
signal rises through every layer, briefly illuminating each material
before converging into a wider atmospheric output. The signal begins and
ends fully transparent, so the first and final frames match without a
reverse-motion loop.
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


def smoothstep(edge0: float, edge1: float, value: float) -> float:
    if edge0 == edge1:
        return 0.0
    x = max(0.0, min(1.0, (value - edge0) / (edge1 - edge0)))
    return x * x * (3.0 - 2.0 * x)


def gaussian(value: float, center: float, width: float) -> float:
    return math.exp(-0.5 * ((value - center) / width) ** 2)


def main() -> None:
    args = parse_args()
    args.desktop_dir.mkdir(parents=True, exist_ok=True)
    args.mobile_dir.mkdir(parents=True, exist_ok=True)

    base = Image.open(args.source).convert("RGB")
    base = ImageEnhance.Color(base).enhance(0.82)
    base = ImageEnhance.Contrast(base).enhance(1.06)
    base = ImageEnhance.Brightness(base).enhance(0.82)
    base_width, base_height = base.size

    yy, xx = np.ogrid[:base_height, :base_width]

    def elliptical_mask(
        center_x: float,
        center_y: float,
        radius_x: float,
        radius_y: float,
        blur: float = 24,
        power: float = 1.7,
    ) -> Image.Image:
        distance = ((xx - center_x) / radius_x) ** 2 + ((yy - center_y) / radius_y) ** 2
        mask = np.clip(1.0 - distance, 0.0, 1.0) ** power
        return Image.fromarray(np.uint8(mask * 255), mode="L").filter(ImageFilter.GaussianBlur(blur))

    layer_centers = [1380, 1170, 1010, 850, 635]
    layer_masks = [
        elliptical_mask(base_width * 0.58, center_y, base_width * 0.72, 125, 30, 2.0)
        for center_y in layer_centers
    ]
    layer_colours = [
        (174, 151, 111),  # earth
        (157, 173, 178),  # water
        (176, 104, 84),   # fire
        (225, 221, 208),  # air
        (176, 165, 195),  # space
    ]

    output_mask = elliptical_mask(base_width * 0.79, 500, 660, 245, 34, 1.8)

    def add_glow(
        image: Image.Image,
        mask: Image.Image,
        colour: tuple[int, int, int],
        opacity: float,
    ) -> Image.Image:
        if opacity <= 0.001:
            return image
        rgba = image.convert("RGBA")
        alpha = mask.point(lambda value: int(value * max(0.0, min(1.0, opacity))))
        layer = Image.new("RGBA", image.size, (*colour, 0))
        layer.putalpha(alpha)
        return Image.alpha_composite(rgba, layer).convert("RGB")

    def signal_position(progress: float) -> tuple[float, float]:
        y = 1430 - 1010 * progress
        normalized = (1430 - y) / 1010
        x = base_width * 0.49 + 58 * math.sin(normalized * math.pi * 1.35)
        return x, y

    def camera_frame(image: Image.Image, phase: float, target: tuple[int, int]) -> Image.Image:
        target_ratio = target[0] / target[1]
        zoom = 1.025 + 0.014 * (0.5 - 0.5 * math.cos(phase))
        crop_width = base_width / zoom
        crop_height = crop_width / target_ratio
        if crop_height > base_height:
            crop_height = base_height / zoom
            crop_width = crop_height * target_ratio

        center_x = base_width / 2 + 14 * math.sin(phase)
        center_y = base_height / 2 + 5 * (math.cos(phase) - 1)
        box = (
            int(center_x - crop_width / 2),
            int(center_y - crop_height / 2),
            int(center_x + crop_width / 2),
            int(center_y + crop_height / 2),
        )
        return image.crop(box).resize(target, Image.Resampling.LANCZOS)

    for index in range(FRAME_COUNT):
        t = index / (FRAME_COUNT - 1)
        phase = 2 * math.pi * t

        # The signal is invisible at both ends of the film. It travels
        # upward only once, avoiding a conspicuous reversed-action loop.
        signal_envelope = math.sin(math.pi * t) ** 1.7
        signal_x, signal_y = signal_position(t)
        signal_mask = elliptical_mask(signal_x, signal_y, 220, 165, 30, 1.6)

        lit = base
        for layer_index, (mask, colour) in enumerate(zip(layer_masks, layer_colours)):
            trigger = 0.12 + layer_index * 0.16
            layer_opacity = 0.025 + 0.13 * gaussian(t, trigger, 0.105) * signal_envelope
            lit = add_glow(lit, mask, colour, layer_opacity)

        lit = add_glow(lit, signal_mask, (238, 226, 198), 0.24 * signal_envelope)

        output_bloom = (
            smoothstep(0.56, 0.74, t)
            * (1.0 - smoothstep(0.86, 1.0, t))
            * 0.18
        )
        lit = add_glow(lit, output_mask, (224, 219, 232), output_bloom)

        desktop = camera_frame(lit, phase, DESKTOP_SIZE)
        desktop.save(
            args.desktop_dir / f"frame-{index:04d}.jpg",
            quality=89,
            subsampling=1,
            optimize=True,
        )

        # A portrait crop around the central seam preserves all five
        # strata on phones and remains materially richer than a generic
        # static poster.
        mobile = ImageOps.fit(
            lit,
            MOBILE_SIZE,
            method=Image.Resampling.LANCZOS,
            centering=(0.5 + 0.006 * math.sin(phase), 0.5),
        )
        mobile = ImageEnhance.Brightness(mobile).enhance(0.9)
        mobile.save(
            args.mobile_dir / f"frame-{index:04d}.jpg",
            quality=87,
            subsampling=1,
            optimize=True,
        )


if __name__ == "__main__":
    main()
