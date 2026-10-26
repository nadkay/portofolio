/* Efek interaksi: suara "happy" hasil sintesis (tanpa file audio, bebas copyright),
   animasi putar saat klik tombol, dan transisi berputar saat pindah halaman. */
(function () {
  var SOUND_KEY = 'nadia-fx-sound';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var soundOn = true;
  try { soundOn = localStorage.getItem(SOUND_KEY) !== 'off'; } catch (e) {}

  /* ---------- CSS ---------- */
  var css = [
    '.fx-overlay{position:fixed;inset:0;z-index:999;display:grid;place-items:center;background:var(--paper,#fbfdff);opacity:0;visibility:hidden;transition:opacity .35s ease,visibility .35s ease;pointer-events:none}',
    '.fx-overlay.is-on{opacity:1;visibility:visible;pointer-events:auto}',
    '.fx-spinner{position:relative;width:86px;height:86px;border-radius:50%;animation:fx-spin .9s linear infinite}',
    '.fx-spinner::before{content:"";position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,#73b5ef,#b8e1ff,#4e8fcb,#73b5ef);-webkit-mask:radial-gradient(circle,transparent 58%,#000 60%);mask:radial-gradient(circle,transparent 58%,#000 60%)}',
    '.fx-spinner::after{content:"";position:absolute;top:-4px;left:50%;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:#4e8fcb;box-shadow:0 0 16px #73b5ef}',
    '.fx-overlay.is-on .fx-spinner{animation-duration:.55s}',
    '@keyframes fx-spin{to{transform:rotate(360deg)}}',
    '.fx-spin{animation:fx-whirl .6s cubic-bezier(.2,.8,.2,1)}',
    '@keyframes fx-whirl{from{transform:rotate(0)}to{transform:rotate(360deg)}}',
    '.fx-sound-toggle{display:inline-grid;place-items:center;width:40px;height:40px;padding:0;border:1px solid var(--line,#dfebf5);border-radius:50%;color:var(--ink,#213957);background:var(--card,var(--white,#fff));cursor:pointer;font-size:1.05rem;line-height:1;transition:transform .2s ease,border-color .2s ease}',
    '.fx-sound-toggle:hover{transform:translateY(-2px);border-color:var(--blue,#73b5ef)}',
    '@media (prefers-reduced-motion:reduce){.fx-spin{animation:none}.fx-spinner{animation-duration:2.5s}}'
  ].join('');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- Suara ---------- */
  var ctx = null;
  function audio() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(ac, freq, start, dur, vol, type) {
    var osc = ac.createOscillator(), g = ac.createGain();
    osc.type = type || 'triangle';
    osc.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g).connect(ac.destination);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }
  // Arpeggio mayor naik (C5 E5 G5 C6) + kilau kecil: terdengar ceria
  function happy() {
    if (!soundOn) return;
    var ac = audio();
    if (!ac) return;
    var t = ac.currentTime;
    var notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach(function (f, i) { tone(ac, f, t + i * 0.085, 0.28, 0.12, 'triangle'); });
    tone(ac, 1568, t + 0.34, 0.22, 0.05, 'sine');
    tone(ac, 2093, t + 0.4, 0.18, 0.03, 'sine');
  }

  /* ---------- Overlay transisi ---------- */
  var overlay = document.createElement('div');
  overlay.className = 'fx-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = '<div class="fx-spinner"></div>';
  function mount() { document.body.appendChild(overlay); }

  /* ---------- Tombol suara ---------- */
  function paintToggle(btn) {
    btn.textContent = soundOn ? '🔊' : '🔇';
    btn.setAttribute('aria-label', soundOn ? 'Matikan suara' : 'Nyalakan suara');
    btn.setAttribute('title', soundOn ? 'Suara: on' : 'Suara: off');
    btn.setAttribute('aria-pressed', String(soundOn));
  }
  function addToggle() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fx-sound-toggle';
    paintToggle(btn);
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      soundOn = !soundOn;
      try { localStorage.setItem(SOUND_KEY, soundOn ? 'on' : 'off'); } catch (err) {}
      paintToggle(btn);
      if (soundOn) happy();
    });
    var theme = document.querySelector('.theme-toggle');
    var top = document.querySelector('.top-actions');
    if (theme && theme.parentNode) theme.parentNode.insertBefore(btn, theme);
    else if (top) top.appendChild(btn);
  }

  /* ---------- Klik ---------- */
  var last = 0;
  document.addEventListener('click', function (e) {
    var el = e.target.closest('a[href], button');
    if (!el) return;
    // Tombol mini-game dan slider tidak perlu bunyi/putar di setiap tekan
    if (el.closest('.game-pad, .carousel-ui, .credential-controls, .project-evidence-controls, .intro-sound, .lang-toggle, .fx-sound-toggle')) return;
    var now = Date.now();
    if (now - last > 120) { happy(); last = now; }
    if (!reduce && (el.tagName === 'BUTTON' || el.classList.contains('button'))) {
      el.classList.remove('fx-spin');
      void el.offsetWidth;
      el.classList.add('fx-spin');
      setTimeout(function () { el.classList.remove('fx-spin'); }, 650);
    }
    // Pindah ke halaman lain di tab yang sama: putar dulu, lalu navigasi
    if (el.tagName === 'A' && !reduce) {
      var href = el.getAttribute('href') || '';
      var sameTab = el.target !== '_blank';
      var isPage = /\.html(\?|#|$)/.test(href);
      var isAnchorOnly = href.charAt(0) === '#';
      var isExternal = /^(https?:|mailto:|tel:)/.test(href);
      if (sameTab && isPage && !isAnchorOnly && !isExternal && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
        e.preventDefault();
        try { sessionStorage.setItem('fx-arrive', '1'); } catch (err) {}
        overlay.classList.add('is-on');
        setTimeout(function () { window.location.href = href; }, 650);
      }
    }
  }, true);

  /* ---------- Kedatangan di halaman baru ---------- */
  function arrive() {
    var flag = null;
    try { flag = sessionStorage.getItem('fx-arrive'); sessionStorage.removeItem('fx-arrive'); } catch (e) {}
    if (!flag || reduce) return;
    overlay.classList.add('is-on');
    setTimeout(function () { overlay.classList.remove('is-on'); }, 450);
  }

  function init() {
    mount();
    addToggle();
    arrive();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
