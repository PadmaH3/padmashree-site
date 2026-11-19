// Counterpart icons slide out from beneath the main ones as you scroll.
// Progress is eased toward its target every frame so the motion stays feather-soft.
(function () {
  const unders = Array.from(document.querySelectorAll('.under'));
  if (!unders.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let target = 0;
  let raf = 0;

  function readTarget() {
    // Open over ~45% of a screen, but never more than the page can scroll,
    // so every deck finishes opening even on short pages.
    const room = document.documentElement.scrollHeight - window.innerHeight;
    const range = Math.max(1, Math.min(Math.max(240, window.innerHeight * 0.45), room));
    target = Math.min(1, Math.max(0, window.scrollY / range));
  }

  function frame() {
    current += (target - current) * (reduce ? 1 : 0.06);
    if (Math.abs(target - current) < 0.0005) current = target;
    unders.forEach((el, i) => {
      // each card follows a beat behind the one before it
      const p = Math.min(1, Math.max(0, current * 1.25 - i * 0.12));
      const eased = 1 - Math.pow(1 - p, 3);
      el.style.setProperty('--p', eased.toFixed(4));
    });
    raf = current === target ? 0 : requestAnimationFrame(frame);
  }

  function onScroll() {
    readTarget();
    if (!raf) raf = requestAnimationFrame(frame);
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
})();
