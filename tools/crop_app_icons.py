import sys, colorsys
from PIL import Image
src = "/Users/padmashreesatyanarayana/02. Oranges (projects)/Projects/Build in public/app family /"
out = sys.argv[1]
m = {"blue": "resting-window copy.png", "blue-b": "active-window copy.png",
     "yellow": "ChatGPT Image Nov 3, 2026, 07_26_42 PM.png", "yellow-b": "ChatGPT Image Nov 3, 2026, 07_27_07 PM.png",
     "pink": "ChatGPT Image Nov 10, 2026, 03_53_53 PM.png", "pink-b": "ChatGPT Image Nov 10, 2026, 03_54_13 PM.png"}
for k, f in m.items():
    im = Image.open(src + f).convert("RGB")
    w, h = im.size
    sm = im.resize((w//4, h//4))
    px = sm.load(); xs=[]; ys=[]
    for y in range(sm.size[1]):
        for x in range(sm.size[0]):
            r,g,b = px[x,y]; hh,s,v = colorsys.rgb_to_hsv(r/255,g/255,b/255)
            if s > 0.45 and v > 0.5: xs.append(x); ys.append(y)
    # use percentile bounds to ignore stray pixels
    xs.sort(); ys.sort(); n=len(xs)
    x0,x1 = xs[int(n*0.002)]*4, xs[int(n*0.998)]*4+4
    y0,y1 = ys[int(n*0.002)]*4, ys[int(n*0.998)]*4+4
    side = max(x1-x0, y1-y0); cx=(x0+x1)//2; cy=(y0+y1)//2
    pad = 4
    box = (cx-side//2+pad, cy-side//2+pad, cx+side//2-pad, cy+side//2-pad)
    c = im.crop(box).resize((512,512), Image.LANCZOS)
    c.save(f"{out}/{k}.png", optimize=True)
    c.save(f"{out}/{k}.webp", quality=90, method=6)
    print(k, box, side)
