"""Crop the app-family source art to clean 512px WebP squares.

Each pair (main + counterpart) shares one crop box so the two cards line up
exactly when the deck slides apart. Boxes were measured on the sources and sit
a few pixels inside the coloured square, so no pale rim, frame or antialiased
edge reaches the card edge. The CSS radius (23%) then gives every icon the
same corner.

Usage: python3 tools/crop_app_icons.py assets/icons
"""
import sys
from PIL import Image

SRC = "/Users/padmashreesatyanarayana/02. Oranges (projects)/Projects/Build in public/app family /"

# name: (source file, crop box l, t, r, b). Every box is square.
ICONS = {
    # blue art is a framed window: crop inside the grey frame, keep the sill
    "blue":     ("resting-window copy.png", (154, 160, 870, 876)),
    "blue-b":   ("active-window copy.png", (154, 160, 870, 876)),
    "yellow":   ("ChatGPT Image Nov 3, 2026, 07_26_42 PM.png", (190, 192, 1056, 1058)),
    "yellow-b": ("ChatGPT Image Nov 3, 2026, 07_27_07 PM.png", (190, 192, 1056, 1058)),
    "pink":     ("ChatGPT Image Nov 10, 2026, 03_53_53 PM.png", (191, 191, 1055, 1055)),
    "pink-b":   ("ChatGPT Image Nov 10, 2026, 03_54_13 PM.png", (191, 191, 1055, 1055)),
}

out = sys.argv[1]
for name, (file, box) in ICONS.items():
    l, t, r, b = box
    assert r - l == b - t, f"{name}: crop box is not square"
    im = Image.open(SRC + file).convert("RGB")
    im.crop(box).resize((512, 512), Image.LANCZOS).save(f"{out}/{name}.webp", quality=90, method=6)
    print(name, box)
