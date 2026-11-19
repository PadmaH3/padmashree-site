# Homepage: handoff plan

The homepage is `index.html` at the site root (padmashree.xyz). It is plain HTML, CSS and JS with no build step: `css/site.css`, `js/site.js`, and art in `assets/icons/`.
Preview it with the `site` config in `.claude/launch.json` and open `http://localhost:<port>/`.
The old kanban board ("Padma Playground") was retired on 18 Nov 2026. A screenshot is kept at `archive/kanban-board.png`, and the code is in git history.

## Mood (applies to every task)
Soft, friendly, gentle, like a feather. Mostly white, with colour only in measured amounts.
- Nothing pops, jumps or snaps. Easing is `--ease` (cubic-bezier(.25,.8,.25,1)) and movements take 1.6–3s.
- Every line of text uses one font (Figtree 400). No bold display headers.
- **Everything sits on an 8px grid.** Use the `--s-*` tokens at the top of `css/site.css` (8, 16, 24, 32, 40, 48, 64, 96, 128, 160). All text uses a 32px line height, so lines share one rhythm. Sizes step at breakpoints (720px, 1200px) instead of fluid `clamp()`, so every value a designer inspects is a clean number: icons are 136 or 168, radii 32 or 40, icon gaps 96 or 160.
- Colours meet WCAG AA: secondary text `--soft` is 4.7:1 and resting icons `--mute` are 3.1:1. Focus rings follow the icon curve at an 8px offset.
- Keep the big gaps between icons. Empty space is fine.
- Icons stay straight: no tilt and no hover lift of the whole card.
- Don't bring back: the "coming soon" slot, the hover "hello", the hello replay, or card swapping.

## What's done
- Copy: "Hi, I'm Padmashree. / From Bangalore [raintree, gulmohar and coffee] living in Karkala [ghats, palms and paddy] / Making everyday apps for visual thinkers and my 2 year old."
- "my 2 year old" links to `little-one/`, a games page in the same style. It lists the four games copied from `Home Schooling /monster truck era/games-site/`: truck stack, letter stickers, akshara jodi (with its printable cards PDF) and truck match. Each game folder is a byte-for-byte copy, so to update one, copy its folder over again. Thumbnails are 800×500 WebP in `little-one/thumbs/`.
- Three main icons in a row. They're cropped from the source art to a clean square and served as 512px WebP (`assets/icons/*.webp`), so they look sharp at 168px on 2x screens. `tools/crop_app_icons.py assets/icons` uses measured crop boxes that sit inside each coloured square, so no pale rim, frame or antialiased edge reaches the card. Earlier crops left the blue window's white frame and a 2px rim on yellow. Each pair shares a box so the deck lines up.
- A 1px hairline (8% ink) sits inside every card's curve, so white art (the blue cloud and sill) still reads as an edge on the white page.
- When you scroll, each counterpart icon slides out from under its main icon like a deck of cards. This is in `js/site.js` and uses a lerp to stay smooth.
- Hover v2, built from **layers**. `tools/build_icon_layers.py assets/icons` splits each main icon into a clean background plate (`layers/<app>-plate.webp`) plus transparent cut-outs on the same 512px canvas (`layers/<app>-<part>.webp`). Every layer sits at `inset: 0`, and the stack matches the original at rest. The script prints the worst edge-pixel error for each part. Holes are filled by diffusion: pink fills only from pink neighbours, so the torn edge stays crisp, and edge pixels that belong to the paper stay on the plate. This replaced the old window and flat-patch trick, which couldn't match pink's gradient and hid the yellow glow behind a rectangle.
  - Blue: the cloud drifts out of the window (to the right, since the art is cut off at the edge). A slow blink uses white lids with a curved closed-eye stroke at the art's line weight.
  - Yellow: the bulb swells 5% from its screw and glows. The rays stay on the plate because they sit right at the rounded corner, and any motion clips their tips.
  - Pink: the butterfly flutters down and right, away from the corner curve.
- The scroll range is clamped to the page's real scroll room. Before, on a 1440×900 screen the third deck stopped about 78% open.
- X (`PadmashreeSatya`), Instagram (`artlotusnet`) and YouTube (`@Padmashreesatyanarayana`) sit fixed at the bottom right, and at the end of the page on phones.

## Remaining tasks (each can go to its own agent)

### 1. Layered art for the character animations (largest task)
The art is flat raster, so a head tilt, eyebrow raise or "duck behind the tear" can't be done well with the window trick. The window trick leaves ghost lines.
For each main icon, produce **layers** in `assets/icons/layers/<app>/` as transparent PNG or WebP at 512px:
- **Blue:** `bg+clouds`, `head` (face and hair, pivoting at the neck), `arms`. Hover: the clouds drift, the head tilts about 3° toward the shoulder, there's one slow blink, and the head sinks about 2% into the crossed arms. 2.5s, ease-out, then hold.
- **Yellow:** `bg`, `sunflower` (pivoting at the bottom of the stem), `bulb`, `face`, `eyebrow`. Hover: the sunflower sways ±2° in a loop, the bulb floats and glows, and after about 0.8s the brow lifts 1.5% ("it clicked").
- **Pink:** `bg`, `tear-flap` (animate the curl slightly with a skew/rotate about the tear edge), `girl`, `butterfly`, plus a new `girl-with-camera` drawing in the same ink style. Hover: the butterfly flutters, the flap breathes, the girl slides behind the tear edge (use the flap as the mask), and she comes back holding a camera. About 3.5s in total. This one can be a little more dramatic.

Start from `tools/build_icon_layers.py`: it already does the plate, cut-out and edge un-mixing for the cloud, bulb and butterfly. Add more parts the same way. Parts that touch other art (head, arms) will need a hand-painted polygon mask on the 1254px source images in `~/02. Oranges (projects)/Projects/Build in public/app family /`. Fill the hole the part leaves with the flat background colour (the backgrounds are solid). Another option is to redraw the simple line art as inline SVG, which is sharper and easier to animate. Ask Padmashree before using a different source.
Done when every layer stacks to look pixel-identical to the original at rest, with no seams at 2x zoom.

### 2. ~~Check the v1 hover coordinates~~ Done
Replaced by the layer system above. Eye positions are measured from the art: (37.9%, 56.2%) and (57.8%, 56.6%).

### 3. ~~Social links~~ Done

### 4. ~~Where the page lives~~ Done
The landing page is now the homepage, and the kanban board is retired (see above).

### 5. ~~"My 2 year old" page~~ Done
To add a game, copy its folder into `little-one/`, add a 800×500 WebP thumb, and copy one `<article class="game">` block. Every card keeps three lines: title, what you do, and how to play (Keyboard or Tap).

### 6. Final pass
Checked at 1440, 768 and 375 wide: no horizontal scroll, every measured offset on the grid, keyboard focus shows the ring and runs the hover, console clean. On phones the social links move from fixed to the end of the page so they never cover an icon. Still worth a look on a real phone, and with reduced motion turned on in system settings. Note that a hidden preview pane pauses `requestAnimationFrame` and scroll events, so the deck won't move there.
