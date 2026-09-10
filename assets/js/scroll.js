// Scroll-driven behavior for the home page:
//  1. generic fade-in reveal (.fx-reveal) — landscape image, 3-column items
//  2. the story hook — fades in and drifts up as it's scrolled past
//  3. the character-intro pin — fixed content fades out over its spacer,
//     while the blood column (never fixed) keeps scrolling normally
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. generic reveal ------------------------------------------------------
  var revealEls = document.querySelectorAll('.fx-reveal');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  // 2. story hook — fade in + drift up, tied to scroll position -----------
  var hook = document.querySelector('.ap-hook');
  if (hook && !reduceMotion) {
    function updateHook() {
      var rect = hook.getBoundingClientRect();
      var vh = window.innerHeight;
      // progress: 0 when the hook enters the bottom of the viewport,
      // 1 once it's reached the vertical center
      var raw = (vh - rect.top) / (vh * 0.6);
      var t = Math.max(0, Math.min(1, raw));
      hook.style.opacity = String(t);
      hook.style.transform = 'translateY(' + (18 * (1 - t)) + 'px)';
    }
    window.addEventListener('scroll', updateHook, { passive: true });
    updateHook();
  } else if (hook) {
    hook.style.opacity = '1';
    hook.style.transform = 'none';
  }

  // 3. character-intro pin -------------------------------------------------
  var charIntro = document.querySelector('.ap-charintro');
  var spacer = charIntro ? charIntro.querySelector('.ap-charintro__spacer') : null;
  var fixedContent = charIntro ? charIntro.querySelector('.ap-charintro__fixed') : null;

  if (charIntro && spacer && fixedContent) {
    function updateCharIntro() {
      // .ap-charintro__fixed stays visible the whole time — while the hero
      // and transition strip are still on screen, they paint over it
      // (see .ap-hero/.ap-transition z-index in style.css), and scrolling
      // them out of the way is what naturally reveals it. Only the
      // fade-out over the spacer is handled here.
      var rect = spacer.getBoundingClientRect();
      var total = rect.height;
      if (total <= 0) return;
      var scrolled = Math.min(Math.max(-rect.top, 0), total);
      var t = scrolled / total;
      var opacity = 1 - t;
      fixedContent.style.opacity = String(opacity);
      fixedContent.style.pointerEvents = opacity < 0.05 ? 'none' : 'auto';
    }
    window.addEventListener('scroll', updateCharIntro, { passive: true });
    window.addEventListener('resize', updateCharIntro, { passive: true });
    updateCharIntro();
  }
})();
