// Content-warning + load-bar gate. Runs once ever per browser (localStorage),
// per the spec: "only happen on the first time going on the website".
(function () {
  var STORAGE_KEY = 'antiphonus_entered';

  var gate = document.getElementById('apGate');
  if (!gate) return;

  if (localStorage.getItem(STORAGE_KEY)) {
    gate.hidden = true;
    return;
  }

  gate.hidden = false;
  document.body.classList.add('ap-locked');

  var warningPanel = gate.querySelector('[data-gate-step="warning"]');
  var loadPanel = gate.querySelector('[data-gate-step="load"]');
  var glitch = document.getElementById('apGateGlitch');
  var enterBtn = document.getElementById('apGateEnter');
  var fill = document.getElementById('apLoadFill');
  var pct = document.getElementById('apLoadPct');

  enterBtn.addEventListener('click', startLoad);

  function startLoad() {
    warningPanel.hidden = true;
    loadPanel.hidden = false;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      fill.style.width = '100%';
      pct.textContent = '100%';
      finish();
      return;
    }

    var start = Date.now();
    var DURATION = 1400;

    function tick() {
      var t = Math.min((Date.now() - start) / DURATION, 1);
      var p = Math.floor(t * 100);
      fill.style.width = p + '%';
      pct.textContent = p + '%';
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        finish();
      }
    }
    requestAnimationFrame(tick);
  }

  function finish() {
    loadPanel.hidden = true;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      close();
      return;
    }

    glitch.hidden = false;
    glitch.classList.add('is-active');
    glitch.addEventListener('animationend', close, { once: true });
  }

  function close() {
    gate.hidden = true;
    document.body.classList.remove('ap-locked');
    localStorage.setItem(STORAGE_KEY, '1');
  }
})();
