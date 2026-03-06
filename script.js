// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');

toggle.addEventListener('click', () => {
  links.classList.toggle('open');
  toggle.classList.toggle('active');
});

document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.classList.remove('active');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (links.classList.contains('open') && !links.contains(e.target) && !toggle.contains(e.target)) {
    links.classList.remove('open');
    toggle.classList.remove('active');
  }
});

// Navbar shadow on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 10);
});

// Hero photo parallax
const photoLeft  = document.querySelector('.hero__photo--left');
const photoRight = document.querySelector('.hero__photo--right');

if (photoLeft && photoRight) {
  // Wait for entrance animations to finish before taking JS control
  // delay(0.25s) + duration(1s) + small buffer = 1.4s
  let animDone = false;
  setTimeout(() => {
    // CSS animations sit above inline style.transform in the cascade, so the
    // frozen fill-mode state was overriding every JS transform update.
    // Cancelling the animations here hands full control to JS.
    photoLeft.style.animation  = 'none';
    photoRight.style.animation = 'none';
    animDone = true;
    updateParallax(); // sync to wherever the user already scrolled
  }, 1400);

  let ticking = false;

  function updateParallax() {
    const scrollY   = window.scrollY;
    const heroH     = window.innerHeight;
    if (scrollY > heroH) { ticking = false; return; }

    // progress: 0 at top → 1 when scrolled one full viewport height
    const p = scrollY / heroH;

    // diverging Y (left goes down, right goes up)
    const yL =  20 + scrollY * 0.22;
    const yR = -20 - scrollY * 0.22;

    // horizontal drift outward
    const xDrift = p * 55;

    // extra rotation as they drift apart
    const rotExtra = p * 7;

    // fade out — gone by ~65% scroll
    const opacity = Math.max(0, 1 - p * 1.55);

    photoLeft.style.transform  = `rotate(${-6 - rotExtra}deg) translateY(${yL}px) translateX(${-xDrift}px)`;
    photoLeft.style.opacity    = opacity;

    photoRight.style.transform = `rotate(${6 + rotExtra}deg) translateY(${yR}px) translateX(${xDrift}px)`;
    photoRight.style.opacity   = opacity;

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!animDone || ticking) return;
    ticking = true;
    requestAnimationFrame(updateParallax);
  }, { passive: true });
}
