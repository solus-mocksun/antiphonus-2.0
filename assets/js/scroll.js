// Scroll-driven behavior for the home page:
//  the character-intro pin — fixed content fades out over its spacer,
//  while the blood column (never fixed) keeps scrolling normally.
// (The story hook and the landscape/icon .fx-reveal items used to fade
// in on scroll — removed on request; they're static at full opacity now,
// see .fx-reveal and .ap-hook in style.css.)
(function () {
  // character-intro pin -----------------------------------------------------
  var charIntro = document.querySelector('.ap-charintro');
  var spacer = charIntro ? charIntro.querySelector('.ap-charintro__spacer') : null;
  var fixedContent = charIntro ? charIntro.querySelector('.ap-charintro__fixed') : null;

  if (charIntro && spacer && fixedContent) {
    // Held at full opacity until FADE_START_FRACTION of the spacer's
    // scroll distance (time to actually look at the characters), then
    // fades out quickly, finishing by FADE_END_FRACTION — a short
    // window — so the overlap with the story section below it stays
    // brief, even though the overall spacer is generous.
    var FADE_START_FRACTION = 0.5;
    var FADE_END_FRACTION = 0.75;

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
      var fadeT = (t - FADE_START_FRACTION) / (FADE_END_FRACTION - FADE_START_FRACTION);
      var opacity = 1 - Math.min(Math.max(fadeT, 0), 1);
      fixedContent.style.opacity = String(opacity);
      fixedContent.style.pointerEvents = opacity < 0.05 ? 'none' : 'auto';
    }
    window.addEventListener('scroll', updateCharIntro, { passive: true });
    window.addEventListener('resize', updateCharIntro, { passive: true });
    updateCharIntro();
  }
})();
