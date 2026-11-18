"""Split each main icon into a clean background plate plus cut-out moving parts.

Run after crop_app_icons.py:  python3 tools/build_icon_layers.py assets/icons

For each part we
  1. find its core pixels (a colour key on a flat background, or the black
     outline plus everything it encloses when the part touches other art),
  2. grow that by a 2px ring to catch antialiased edges,
  3. fill the hole on the plate by diffusing the surrounding pixels inwards,
  4. un-mix the ring pixels against the filled plate to recover a soft alpha
     edge (line art is black or white over a background, so each edge pixel is
     a blend of one ink and the plate).
Part layers are full 512px canvases, so the CSS needs no offsets: every layer
sits at inset 0 and the stack matches the original at rest.

Pure PIL, no numpy.
"""
import sys
from collections import deque
from PIL import Image

out = sys.argv[1]
N = 512


def load(name):
    return Image.open(f"{out}/{name}.webp").convert("RGB")


def dist2(a, b):
    return sum((x - y) ** 2 for x, y in zip(a, b))


def flood(seeds, ok, box):
    l, t, r, b = box
    seen = set(s for s in seeds if ok(*s))
    q = deque(seen)
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if l <= nx < r and t <= ny < b and (nx, ny) not in seen and ok(nx, ny):
                seen.add((nx, ny))
                q.append((nx, ny))
    return seen


def fill_enclosed(core, box):
    """Add every pixel in box that can't reach the box border without crossing core."""
    l, t, r, b = box
    border = [(x, y) for x in range(l, r) for y in (t, b - 1)] + [(x, y) for y in range(t, b) for x in (l, r - 1)]
    outside = flood(border, lambda x, y: (x, y) not in core, box)
    return core | {(x, y) for x in range(l, r) for y in range(t, b) if (x, y) not in outside}


def dilate(mask, k):
    m = set(mask)
    for _ in range(k):
        m |= {(x + dx, y + dy) for x, y in m for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))
              if 0 <= x + dx < N and 0 <= y + dy < N}
    return m


def diffuse(img, hole, source=None, iters=600):
    """Laplace fill of the hole from its surroundings (Jacobi iterations).

    `source(rgb)` limits which known neighbours may feed the fill, so a hole
    next to other art (the torn paper) fills with background, not a smear.
    """
    source = source or (lambda rgb: True)
    px = img.load()
    hole = list(hole)
    hs = set(hole)
    # start from the mean of the known pixels around the hole
    edge = {(x + dx, y + dy) for x, y in hole for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))} - hs
    edge = [p for p in edge if 0 <= p[0] < N and 0 <= p[1] < N and source(px[p])]
    mean = tuple(sum(px[p][c] for p in edge) / len(edge) for c in range(3))
    val = {p: list(mean) for p in hole}
    for _ in range(iters):
        nv = {}
        for (x, y) in hole:
            acc = [0.0, 0.0, 0.0]
            n = 0
            for q in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if not (0 <= q[0] < N and 0 <= q[1] < N):
                    continue
                if q in hs:
                    v = val[q]
                elif source(px[q]):
                    v = px[q]
                else:
                    continue
                acc[0] += v[0]; acc[1] += v[1]; acc[2] += v[2]
                n += 1
            nv[(x, y)] = [a / n for a in acc] if n else val[(x, y)]
        val = nv
    for p, v in val.items():
        px[p] = tuple(round(c) for c in v)


def unmix(p, bg):
    """Best alpha for p = a*ink + (1-a)*bg, ink black or white. Returns (alpha, ink colour)."""
    best = None
    for ink in ((0, 0, 0), (255, 255, 255)):
        d = [i - b for i, b in zip(ink, bg)]
        dd = sum(v * v for v in d) or 1
        a = max(0.0, min(1.0, sum((pc - bc) * v for pc, bc, v in zip(p, bg, d)) / dd))
        res = dist2(p, [bc + a * v for bc, v in zip(bg, d)])
        if best is None or res < best[0]:
            best = (res, a)
    a = best[1]
    if a < 0.04:
        return 0, (0, 0, 0)
    fg = tuple(max(0, min(255, round((pc - (1 - a) * bc) / a))) for pc, bc in zip(p, bg))
    return a, fg


def build(icon, parts, source=None, keep=None):
    """`keep(rgb)`: edge-ring pixels that belong to neighbouring art stay on the plate."""
    src = load(icon)
    plate = src.copy()
    spx = src.load()
    masks = []
    for part_name, core in parts:
        hole = {p for p in dilate(core, 2) if p in core or not (keep and keep(spx[p]))}
        masks.append((part_name, core, hole))
    diffuse(plate, set().union(*(h for _, _, h in masks)), source)
    ppx = plate.load()
    for part_name, core, hole in masks:
        layer = Image.new("RGBA", (N, N), (0, 0, 0, 0))
        lpx = layer.load()
        for p in hole:
            if p in core:
                lpx[p] = spx[p] + (255,)
            else:
                a, fg = unmix(spx[p], ppx[p])
                lpx[p] = fg + (round(a * 255),)
        layer.save(f"{out}/layers/{icon}-{part_name}.webp", lossless=True, method=6)
        # check: part over plate should reproduce the original
        comp = Image.alpha_composite(plate.convert("RGBA"), layer).convert("RGB").load()
        worst = max(max(abs(a - b) for a, b in zip(comp[p], spx[p])) for p in hole)
        print(f"{icon}-{part_name}: {len(core)} core px, worst rest-state error {worst}/255")
    plate.save(f"{out}/layers/{icon}-plate.webp", quality=92, method=6)


import os
os.makedirs(f"{out}/layers", exist_ok=True)

# Blue: the cloud is white on flat sky. Key out everything that isn't sky.
blue = load("blue").load()
not_sky = lambda x, y: not (blue[x, y][2] > 200 and blue[x, y][0] < 60)
cloud = flood([(461, 94)], not_sky, (370, 16, N, 170))
build("blue", [("cloud", cloud)])

# Yellow: just the bulb, keyed off the flat yellow. Its three rays stay on the
# plate: they sit right at the rounded corner, so moving them would clip their tips.
yel = load("yellow").load()
not_yellow = lambda x, y: not (yel[x, y][0] > 230 and 190 < yel[x, y][1] < 230 and yel[x, y][2] < 110)
bulb = flood([(414, 107)], not_yellow, (360, 46, 480, 190))
build("yellow", [("bulb", bulb)])

# Pink: the butterfly touches the torn paper, so take its black outline and what it encloses.
pink = load("pink").load()
fly_box = (20, 4, 142, 112)
ink = lambda x, y: sum(pink[x, y]) < 150
seed = next((x, y) for y in range(13, 60) for x in range(29, 131) if ink(x, y))
outline = flood([seed], ink, fly_box)
fly = fill_enclosed(outline, fly_box)
is_pink = lambda c: c[0] > 200 and c[1] < 150
is_paper = lambda c: min(c) > 170  # the cream torn edge the lower wing rests on
build("pink", [("butterfly", fly)], source=is_pink, keep=is_paper)
