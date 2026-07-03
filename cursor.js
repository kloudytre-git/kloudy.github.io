/* ═══ CUSTOM CURSOR — shared across every page ═══
   Include with: <script src="cursor.js"></script> right before </body>.
   Requires style.css to already be loaded on the page (uses its
   --white-pure / --cyan-soft / --cyan-glow variables). Does nothing on
   touch devices — real cursor stays untouched there. */
(function() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const style = document.createElement('style');
  style.textContent = `
    html, body, a, button, input, select, textarea, label, [role="button"] {
      cursor: none !important;
    }
    .cursor-dot, .cursor-ring {
      position: fixed;
      top: 0;
      left: 0;
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transform: translate3d(-100px, -100px, 0) translate(-50%, -50%);
      opacity: 0;
      transition: opacity 0.2s ease, width 0.18s ease, height 0.18s ease, border-color 0.18s ease, background 0.18s ease;
    }
    .cursor-dot {
      width: 7px;
      height: 7px;
      background: var(--white-pure);
      box-shadow: 0 0 8px rgba(15, 240, 252, 0.9);
    }
    .cursor-ring {
      width: 34px;
      height: 34px;
      border: 1.5px solid var(--cyan-soft);
      background: rgba(15, 240, 252, 0.04);
    }
    .cursor-dot.is-visible, .cursor-ring.is-visible { opacity: 1; }
    .cursor-ring.is-hovering {
      width: 52px;
      height: 52px;
      border-color: var(--cyan-glow);
      background: rgba(15, 240, 252, 0.09);
    }
    .cursor-dot.is-hovering { opacity: 0; }
  `;
  document.head.appendChild(style);

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let hasMoved = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    if (!hasMoved) {
      hasMoved = true;
      dot.classList.add('is-visible');
      ring.classList.add('is-visible');
      ringX = mouseX;
      ringY = mouseY;
    }
  });

  document.documentElement.addEventListener('mouseleave', () => {
    dot.classList.remove('is-visible');
    ring.classList.remove('is-visible');
  });
  document.documentElement.addEventListener('mouseenter', () => {
    if (hasMoved) {
      dot.classList.add('is-visible');
      ring.classList.add('is-visible');
    }
  });

  // Small, quick-catching-up lag on the ring only -- the dot tracks instantly.
  const EASE = 0.2;
  function tick() {
    ringX += (mouseX - ringX) * EASE;
    ringY += (mouseY - ringY) * EASE;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  const HOVER_SELECTOR = 'a, button, input, select, textarea, label, [role="button"], [onclick]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(HOVER_SELECTOR)) {
      ring.classList.add('is-hovering');
      dot.classList.add('is-hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(HOVER_SELECTOR) && !e.relatedTarget?.closest(HOVER_SELECTOR)) {
      ring.classList.remove('is-hovering');
      dot.classList.remove('is-hovering');
    }
  });
})();
