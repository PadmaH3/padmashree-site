# Landing page: handoff plan for Sonnet agents

The page lives at `landing/` (served at `/landing/`). It is plain HTML, CSS and JS with no build step.
Preview it with the `site` config in `.claude/launch.json` and open `http://localhost:<port>/landing/`.

## Mood (applies to every task)
Soft, friendly, gentle, like a feather. Mostly white, with colour only in measured amounts.
- Nothing pops, jumps or snaps. Easing is `--ease` (cubic-bezier(.25,.8,.25,1)) and movements take 1.6–3s.
- Every line of text uses one font (Figtree 400/500). No bold display headers.
- Keep the big gaps between icons. Empty space is fine.
- Icons stay straight: no tilt and no hover lift of the whole card.
- Don't bring back: the "coming soon" slot, the hover "hello", the hello replay, or card swapping.

## What's done
- Copy: "Hi, I'm Padmashree. / From Bangalore [raintree, gulmohar and coffee] living in Karkala [ghats, palms and paddy] / Making everyday apps for visual thinkers and my 2 year old."
- "my 2 year old" links to a stub at `little-one/index.html`.
- Three main icons in a row. They're cropped from the source art to a clean square and served as 512px WebP (`landing/icons/*.webp`), so they look sharp at about 168px on 2x screens. The crop script is `tools/crop_app_icons.py landing/icons`. It also writes PNGs; delete those and keep the WebP files.
- When you scroll, each counterpart icon slides out from under its main icon like a deck of cards. This is in `landing.js` and uses a lerp to stay smooth.
- Hover v1, built from cut-out windows of the same artwork (`.part` plus a flat-colour `.patch` hiding the original spot):
  - Blue: the cloud drifts left, and a slow blink uses white lids with a line (`.lid`).
  - Yellow: the bulb lifts, grows by 8% and glows.
  - Pink: the butterfly flutters along a path.
- X, Instagram and YouTube icons sit fixed at the bottom right.

## Remaining tasks (each can go to its own agent)

### 1. Layered art for the character animations (largest task)
The art is flat raster, so a head tilt, eyebrow raise or "duck behind the tear" can't be done well with the window trick. The window trick leaves ghost lines.
For each main icon, produce **layers** in `landing/icons/layers/<app>/` as transparent PNG or WebP at 512px:
- **Blue:** `bg+clouds`, `head` (face and hair, pivoting at the neck), `arms`. Hover: the clouds drift, the head tilts about 3° toward the shoulder, there's one slow blink, and the head sinks about 2% into the crossed arms. 2.5s, ease-out, then hold.
- **Yellow:** `bg`, `sunflower` (pivoting at the bottom of the stem), `bulb`, `face`, `eyebrow`. Hover: the sunflower sways ±2° in a loop, the bulb floats and glows, and after about 0.8s the brow lifts 1.5% ("it clicked").
- **Pink:** `bg`, `tear-flap` (animate the curl slightly with a skew/rotate about the tear edge), `girl`, `butterfly`, plus a new `girl-with-camera` drawing in the same ink style. Hover: the butterfly flutters, the flap breathes, the girl slides behind the tear edge (use the flap as the mask), and she comes back holding a camera. About 3.5s in total. This one can be a little more dramatic.

Suggested method: in Python/PIL, build each part with a hand-painted polygon mask on the 1254px source images in `~/02. Oranges (projects)/Projects/Build in public/app family /`. Fill the hole the part leaves with the flat background colour (the backgrounds are solid). Another option is to redraw the simple line art as inline SVG, which is sharper and easier to animate. Ask Padmashree before using a different source.
Done when every layer stacks to look pixel-identical to the original at rest, with no seams at 2x zoom.

### 2. Check the v1 hover coordinates
The `--l/--t/--w/--h` boxes and the `.lid` eye positions were estimated from previews. Zoom to 400% in the preview and adjust them so the patches leave no visible edge. This goes away if task 1 replaces the system.

### 3. Social links
The Instagram and YouTube `href="#"` are placeholders. Ask Padmashree for her handles. X is set to `x.com/PadmashreeSatya`, taken from `data/board.js`.

### 4. Where the page lives
It's at `/landing/` for now, and the root `index.html` is still the kanban and poster site. Ask whether it should become the homepage. If so, move it to the root and move the kanban page to something like `/playground/`.

### 5. "My 2 year old" page
It's a stub at `little-one/`. Build it once Padmashree says what it should hold. There may be a link to `for-anish/`.

### 6. Final pass
Test at 375px wide (the icons stack vertically and the decks still work), with reduced motion, and with keyboard focus (hover effects also trigger on focus). Check that the console is clean.
