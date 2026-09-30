"""Regenerate web assets from the raw files in V1/.

Run from the project root:  python3 tools/build_assets.py
Needs Pillow (pip3 install pillow).

- assets/posters/full/NN.jpg  original-colour posters (shown in the popup)
- assets/posters/neon/NN.jpg  gradient-mapped backdrop versions
- assets/cards/*.jpg          card images (crops from the Figma mockup are
                              placeholders: replace with originals, same filename)
"""
from PIL import Image, ImageOps

POSTERS = {6: "01", 7: "02", 8: "03", 9: "04", 10: "05", 11: "06", 12: "07",
           13: "08", 14: "09", 15: "10", 16: "11", 17: "12", 18: "13"}

# dark -> mid -> light stops of the neon gradient map
STOPS = [(58, 40, 215), (255, 30, 235), (20, 255, 50)]


def gradient_map(im):
    g = ImageOps.autocontrast(im.convert("L"), cutoff=1)
    lut = []
    for c in range(3):
        for v in range(256):
            t = v / 255 * 2
            i = min(int(t), 1)
            f = t - i
            lut.append(round(STOPS[i][c] * (1 - f) + STOPS[i + 1][c] * f))
    r, gch, b = (g.point(lut[c * 256:(c + 1) * 256]) for c in range(3))
    return Image.merge("RGB", (r, gch, b))


for src, out in POSTERS.items():
    im = Image.open(f"V1/image {src}.png").convert("RGB")
    im.save(f"assets/posters/full/{out}.jpg", quality=88, optimize=True)
    small = im.copy()
    small.thumbnail((480, 900))
    gradient_map(small).save(f"assets/posters/neon/{out}.jpg", quality=82, optimize=True)

# card images
Image.open("V1/image 50.png").convert("RGB").save("assets/cards/rafiki.jpg", quality=88)
mock = Image.open("V1/Desktop - 4.png").convert("RGB")
for name, box in {
    "hear-me-out": (129, 262, 275, 430),
    "bed-soon": (734, 288, 924, 527),
    "not-easy": (940, 233, 1130, 370),
    "this-is-fine": (943, 381, 1126, 559),
}.items():
    mock.crop(box).save(f"assets/cards/{name}.jpg", quality=92)
print("done")
