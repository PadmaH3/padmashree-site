"""Regenerate web assets from the raw files in V1/.

Run from the project root:  python3 tools/build_assets.py
Needs Pillow (pip3 install pillow).

- assets/wall/wall.jpg         the tinted poster wall (V1/Frame 9.png), the backdrop
- assets/wall/wall-color.jpg   the same crop of the original-colour board (V1/Group 7.png),
                               revealed on hover. Frame 9 = Group 7 cropped at (33, 250).
- assets/posters/full/NN.jpg   original-colour posters (shown in the popup)
- assets/cards/*.jpg           card images (crops from the Figma mockup are placeholders:
                               replace with originals, same filename)
"""
from PIL import Image

POSTERS = {6: "01", 7: "02", 8: "03", 9: "04", 10: "05", 11: "06", 12: "07",
           13: "08", 14: "09", 15: "10", 16: "11", 17: "12", 18: "13"}

for src, out in POSTERS.items():
    Image.open(f"V1/image {src}.png").convert("RGB").save(f"assets/posters/full/{out}.jpg", quality=88, optimize=True)

board = Image.open("V1/Group 7.png").convert("RGBA")
Image.open("V1/Frame 9.png").convert("RGB").save("assets/wall/wall.jpg", quality=88, optimize=True)
canvas = Image.new("RGB", (1615, 1134), "white")
crop = board.crop((33, 250, 33 + 1615, 250 + 1134))
canvas.paste(crop, (0, 0), crop)
canvas.save("assets/wall/wall-color.jpg", quality=88, optimize=True)

# the Vasudev poster only exists inside the board composite
vas = Image.new("RGB", (278, 368), "white")
piece = board.crop((818, 372, 1096, 740))
vas.paste(piece, (0, 0), piece)
vas.save("assets/posters/full/14.jpg", quality=92)

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
