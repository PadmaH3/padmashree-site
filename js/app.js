(() => {
  "use strict";

  const B = window.BOARD, POSTERS = window.POSTERS, J = window.JOKES;
  const $ = (s, el = document) => el.querySelector(s);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const mobileQuery = window.matchMedia("(max-width: 820px)");
  const OWNER_KEY = "padma-owner";
  const OWNER_PHRASE = "orange"; // type this anywhere to unlock real dragging (a joke lock, not security)

  let isOwner = false;
  try { isOwner = localStorage.getItem(OWNER_KEY) === "1"; } catch (e) {}

  /* ---------- header + corner links ---------- */
  $("#board-title").textContent = B.title;
  $("#board-subtitle").textContent = B.subtitle;
  for (const [id, key] of [["#link-tools", "tools"], ["#link-twitter", "twitter"]]) {
    const a = $(id);
    a.textContent = B.links[key].label;
    a.href = B.links[key].href;
  }

  /* ---------- board ---------- */
  const columns = [...B.columns, B.blog]; // blog is rendered in its own shell but shares drag/drop
  let dragged = null;

  function renderCard(card, col) {
    const node = card.link ? el("a", "card") : el("div", "card");
    if (card.link) { node.href = card.link; node.target = "_blank"; node.rel = "noopener"; }
    if (card.bare) node.classList.add("bare");
    node.draggable = !mobileQuery.matches;
    if (card.badge) node.append(el("span", "card-badge", card.badge));
    if (card.image) {
      const img = el("img", "card-img");
      img.src = card.image; img.alt = card.imageAlt || ""; img.loading = "lazy"; img.draggable = false;
      node.append(img);
    }
    if (card.title) node.append(el("div", "card-title", card.title));
    if (card.text) node.append(el("p", "card-text", card.text));
    if (card.checklist) {
      const ul = el("ul", "checks");
      for (const item of card.checklist) ul.append(el("li", item.done ? "done" : "", item.text));
      node.append(ul);
    }
    if (card.tag) node.append(el("span", `card-tag tone-${card.tag.tone || "pink"}`, card.tag.label));

    node.addEventListener("dragstart", (e) => {
      dragged = { card, from: col };
      node.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", card.title || "card");
    });
    node.addEventListener("dragend", () => {
      node.classList.remove("dragging");
      document.querySelectorAll(".drop-ok").forEach((c) => c.classList.remove("drop-ok"));
    });
    return node;
  }

  function renderColumn(col) {
    const wrap = el("div", "column");
    wrap.dataset.id = col.id;
    const head = el("button", `col-head tone-${col.tone}`);
    head.type = "button";
    head.append(el("span", "col-emoji", col.emoji), el("span", "col-label", col.label), el("span", "chev", "▾"));
    head.addEventListener("click", () => {
      if (!mobileQuery.matches) return;
      const collapsed = wrap.classList.toggle("collapsed");
      head.setAttribute("aria-expanded", String(!collapsed));
    });
    const body = el("div", "col-body");
    col.cards.forEach((c) => body.append(renderCard(c, col)));
    wrap.append(head, body);

    wrap.addEventListener("dragover", (e) => {
      if (!dragged) return;
      e.preventDefault();
      wrap.classList.add("drop-ok");
    });
    wrap.addEventListener("dragleave", (e) => {
      if (!wrap.contains(e.relatedTarget)) wrap.classList.remove("drop-ok");
    });
    wrap.addEventListener("drop", (e) => {
      e.preventDefault();
      wrap.classList.remove("drop-ok");
      if (!dragged || dragged.from === col) { dragged = null; return; }
      const move = dragged; dragged = null;
      if (!isOwner) { openGate(); return; }
      move.from.cards.splice(move.from.cards.indexOf(move.card), 1);
      col.cards.push(move.card);
      renderBoard();
      copyBoard();
    });
    return wrap;
  }

  function renderBoard() {
    const openState = {};
    document.querySelectorAll(".column").forEach((c) => { openState[c.dataset.id] = c.classList.contains("collapsed"); });

    const host = $("#columns");
    host.replaceChildren(...B.columns.map(renderColumn));
    $("#blog").replaceChildren(renderColumn(B.blog));

    document.querySelectorAll(".column").forEach((c) => {
      const collapsed = c.dataset.id in openState
        ? openState[c.dataset.id]
        : mobileQuery.matches && c.dataset.id !== "v1" && c.dataset.id !== "blog";
      c.classList.toggle("collapsed", collapsed);
      $(".col-head", c).setAttribute("aria-expanded", String(!collapsed));
    });
  }

  mobileQuery.addEventListener("change", () => {
    document.querySelectorAll(".column").forEach((c) => {
      const collapsed = mobileQuery.matches && c.dataset.id !== "v1" && c.dataset.id !== "blog";
      c.classList.toggle("collapsed", collapsed);
    });
    document.querySelectorAll(".card").forEach((c) => { c.draggable = !mobileQuery.matches; });
  });

  /* ---------- owner mode ---------- */
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast.id);
    toast.id = setTimeout(() => (t.hidden = true), 3200);
  }
  function copyBoard() {
    const out = "window.BOARD = " + JSON.stringify(B, null, 2) + ";\n";
    (navigator.clipboard ? navigator.clipboard.writeText(out) : Promise.reject())
      .then(() => toast("Moved. Updated board.js copied to your clipboard: paste it into data/board.js"))
      .catch(() => { console.log(out); toast("Moved. Couldn't reach the clipboard, so board.js is in the console."); });
  }
  let typed = "";
  addEventListener("keydown", (e) => {
    if (e.target.closest && e.target.closest("input, textarea")) return;
    typed = (typed + e.key.toLowerCase()).slice(-OWNER_PHRASE.length);
    if (typed === OWNER_PHRASE) {
      isOwner = !isOwner;
      try { localStorage.setItem(OWNER_KEY, isOwner ? "1" : "0"); } catch (err) {}
      toast(isOwner ? "Welcome back, Padmashree. Dragging unlocked." : "Owner mode off.");
    }
  });

  /* ---------- joke gate ---------- */
  function showError(msg) {
    const box = $("#error-pop");
    box.hidden = true;
    void box.offsetWidth; // restart the wobble if it's already showing
    box.textContent = msg;
    box.hidden = false;
    clearTimeout(showError.id);
    showError.id = setTimeout(() => (box.hidden = true), 1300);
  }
  const gate = $("#gate-modal");
  let lastQ = -1;
  function openGate() {
    let i;
    do { i = Math.floor(Math.random() * J.questions.length); } while (i === lastQ && J.questions.length > 1);
    lastQ = i;
    const q = J.questions[i];
    $("#gate-title").textContent = J.title;
    $("#gate-intro").textContent = J.intro;
    $("#gate-q").textContent = q.q;
    const opts = $("#gate-options");
    opts.replaceChildren(...q.a.map((label) => {
      const b = el("button", "", label);
      b.type = "button";
      b.addEventListener("click", () => {
        gate.close();
        showError(J.rejections[Math.floor(Math.random() * J.rejections.length)]);
      });
      return b;
    }));
    gate.showModal();
  }
  gate.addEventListener("click", (e) => { if (e.target === gate) gate.close(); });

  /* ---------- poster wall + lightbox ---------- */
  const modal = $("#poster-modal");
  function openPoster(p) {
    $("#poster-img").src = `assets/posters/full/${p.id}.jpg`;
    $("#poster-img").alt = p.title;
    $("#poster-title").textContent = p.title;
    const credit = $("#poster-artist");
    credit.replaceChildren();
    credit.append("Artwork by ");
    if (p.url) {
      const a = el("a", "", p.artist); a.href = p.url; a.target = "_blank"; a.rel = "noopener";
      credit.append(a);
    } else credit.append(p.artist);
    modal.showModal();
  }
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest("[data-close]")) modal.close(); });

  /* The wall is one tinted image with an invisible button over each poster.
     Hovering a poster reveals its original colours from the matching crop. */
  function buildWall() {
    const { width: W, height: H, slots } = window.WALL;
    const byId = Object.fromEntries(POSTERS.map((p) => [p.id, p]));
    const stage = el("div", "wall-stage");
    for (const [id, x, y, w, h] of slots) {
      const p = byId[id];
      const btn = el("button", "poster");
      btn.type = "button";
      btn.setAttribute("aria-label", `View poster: ${p.title}`);
      Object.assign(btn.style, { left: `${x / W * 100}%`, top: `${y / H * 100}%`, width: `${w / W * 100}%`, height: `${h / H * 100}%` });
      const rev = el("img", "reveal");
      rev.src = "assets/wall/wall-color.jpg"; rev.alt = ""; rev.draggable = false; rev.loading = "lazy";
      Object.assign(rev.style, { width: `${W / w * 100}%`, height: `${H / h * 100}%`, left: `${-x / w * 100}%`, top: `${-y / h * 100}%` });
      btn.append(rev);
      btn.addEventListener("click", () => openPoster(p));
      stage.append(btn);
    }
    $("#wall").replaceChildren(stage);
  }

  renderBoard();
  buildWall();
})();
