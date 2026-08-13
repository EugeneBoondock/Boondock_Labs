"""Build a scroll-driven Oil Motion atlas for the lab workbench scene."""

from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageEnhance


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "lab" / "lab-workbench.png"
OUTPUT_DIR = ROOT / "public" / "motion"
ATLAS_PATH = OUTPUT_DIR / "lab-workbench-atlas.webp"
MANIFEST_PATH = OUTPUT_DIR / "lab-workbench-motion.json"

FRAME_WIDTH = 640
FRAME_HEIGHT = 400
FRAME_COUNT = 24
COLUMNS = 6
ROWS = 4


def make_frame(source: Image.Image, frame_index: int) -> Image.Image:
    progress = frame_index / (FRAME_COUNT - 1)
    ease = progress * progress * (3 - 2 * progress)
    zoom = 1.0 + ease * 0.075
    drift_x = math.sin(progress * math.pi) * 24
    drift_y = math.sin(progress * math.pi * 2) * 7

    source_ratio = source.width / source.height
    frame_ratio = FRAME_WIDTH / FRAME_HEIGHT
    if source_ratio > frame_ratio:
        crop_height = source.height / zoom
        crop_width = crop_height * frame_ratio
    else:
        crop_width = source.width / zoom
        crop_height = crop_width / frame_ratio

    center_x = source.width * (0.5 + (ease - 0.5) * 0.035) + drift_x
    center_y = source.height * 0.5 + drift_y
    left = max(0, min(source.width - crop_width, center_x - crop_width / 2))
    top = max(0, min(source.height - crop_height, center_y - crop_height / 2))
    frame = source.crop((left, top, left + crop_width, top + crop_height))
    frame = frame.resize((FRAME_WIDTH, FRAME_HEIGHT), Image.Resampling.LANCZOS)

    signal = 1.0 + math.sin(progress * math.pi * 3) * 0.045
    return ImageEnhance.Color(ImageEnhance.Brightness(frame).enhance(signal)).enhance(
        0.98 + ease * 0.08
    )


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("RGB")
    atlas = Image.new("RGB", (FRAME_WIDTH * COLUMNS, FRAME_HEIGHT * ROWS))

    for frame_index in range(FRAME_COUNT):
        frame = make_frame(source, frame_index)
        column = frame_index % COLUMNS
        row = frame_index // COLUMNS
        atlas.paste(frame, (column * FRAME_WIDTH, row * FRAME_HEIGHT))

    atlas.save(ATLAS_PATH, "WEBP", quality=82, method=6)
    manifest = {
        "name": "boondock-lab-workbench",
        "source": "/lab/lab-workbench.png",
        "delivery": "atlas",
        "driver": "scroll",
        "parameterSpace": "linear",
        "frameCount": FRAME_COUNT,
        "columns": COLUMNS,
        "rows": ROWS,
        "frameWidth": FRAME_WIDTH,
        "frameHeight": FRAME_HEIGHT,
        "loop": "none",
        "reducedMotion": "/lab/lab-workbench.png",
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {ATLAS_PATH} ({ATLAS_PATH.stat().st_size / 1024:.1f} KB)")
    print(f"Wrote {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
