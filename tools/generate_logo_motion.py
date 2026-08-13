"""Build the Boondock Labs Oil Motion alpha atlas from the supplied brand mark."""

from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageChops, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "boondock-mark.png"
OUTPUT_DIR = ROOT / "public" / "motion"
ATLAS_PATH = OUTPUT_DIR / "boondock-logo-atlas.webp"
MANIFEST_PATH = OUTPUT_DIR / "boondock-logo-motion.json"

FRAME_SIZE = 448
FRAME_COUNT = 36
COLUMNS = 6
ROWS = 6
REST_FRAME = FRAME_COUNT // 2


def tint_alpha(alpha: Image.Image, colour: tuple[int, int, int], opacity: float) -> Image.Image:
    layer = Image.new("RGBA", alpha.size, (*colour, 0))
    layer.putalpha(alpha.point(lambda value: round(value * opacity)))
    return layer


def make_frame(source: Image.Image, frame: int) -> Image.Image:
    phase = (frame - REST_FRAME) / REST_FRAME
    eased = math.sin(phase * math.pi / 2)
    angle = eased * 2.4
    scale = 0.94 + 0.035 * (1 - abs(eased))
    y_shift = round(math.sin(phase * math.pi) * 5)

    subject_size = round(FRAME_SIZE * scale)
    subject = source.resize((subject_size, subject_size), Image.Resampling.LANCZOS)
    subject = subject.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)

    frame_image = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
    x = (FRAME_SIZE - subject.width) // 2
    y = (FRAME_SIZE - subject.height) // 2 + y_shift

    if frame != REST_FRAME:
        alpha = subject.getchannel("A")
        edge = ImageChops.subtract(
            alpha.filter(ImageFilter.MaxFilter(7)),
            alpha.filter(ImageFilter.MinFilter(5)),
        ).filter(ImageFilter.GaussianBlur(1.2))
        intensity = min(0.28, abs(eased) * 0.22 + 0.04)
        echo = tint_alpha(edge, (201, 100, 66), intensity)
        echo_offset = round(eased * 10)
        frame_image.alpha_composite(echo, (x - echo_offset, y))

    frame_image.alpha_composite(subject, (x, y))
    return frame_image


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("RGBA")
    source = ImageEnhance.Contrast(source).enhance(1.04)

    atlas = Image.new(
        "RGBA",
        (FRAME_SIZE * COLUMNS, FRAME_SIZE * ROWS),
        (0, 0, 0, 0),
    )
    for frame_index in range(FRAME_COUNT):
        frame = make_frame(source, frame_index)
        column = frame_index % COLUMNS
        row = frame_index // COLUMNS
        atlas.alpha_composite(frame, (column * FRAME_SIZE, row * FRAME_SIZE))

    atlas.save(ATLAS_PATH, "WEBP", quality=84, method=6, alpha_quality=92)
    manifest = {
        "name": "boondock-logo-signal",
        "source": "/boondock-mark.png",
        "delivery": "alpha-atlas",
        "driver": "pointer-horizontal",
        "parameterSpace": "linear",
        "frameCount": FRAME_COUNT,
        "columns": COLUMNS,
        "rows": ROWS,
        "frameWidth": FRAME_SIZE,
        "frameHeight": FRAME_SIZE,
        "restFrame": REST_FRAME,
        "loop": "none",
        "backgroundOwner": "page",
        "reducedMotion": "/boondock-mark.png",
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {ATLAS_PATH} ({ATLAS_PATH.stat().st_size / 1024:.1f} KB)")
    print(f"Wrote {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
