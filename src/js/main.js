/* ── MOBILE NAV TOGGLE ─────────────────────────────────── */
(function () {
  var btn = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    nav.classList.toggle('nav-open');
  });
})();

/* ── SCROLL-REVEAL: Fallback ──────────────────────────────
   Der Normalfall läuft rein in CSS über animation-timeline: view().
   Dieser IntersectionObserver springt nur ein, wo der Browser das
   nicht kann. Wo er es kann, wird hier kein Listener registriert. */
(function () {
  if (CSS.supports('animation-timeline', 'view()')) return;
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .15, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

/* ── SOFT-SLIDER: ruhiger Crossfade, Punktnavigation, Pause bei Hover ── */
(function () {
  var sliders = document.querySelectorAll('.soft-slider');
  sliders.forEach(function (slider) {
    var slides = slider.querySelectorAll('.soft-slider-slide');
    var dots = slider.querySelectorAll('.soft-slider-dot');
    if (slides.length < 2) return;
    var i = 0, timer;
    function show(n) {
      slides[i].classList.remove('is-active');
      if (dots[i]) dots[i].classList.remove('is-active');
      i = n;
      slides[i].classList.add('is-active');
      if (dots[i]) dots[i].classList.add('is-active');
    }
    function next() { show((i + 1) % slides.length); }
    function start() { timer = setInterval(next, 4200); }
    function stop() { clearInterval(timer); }
    dots.forEach(function (dot, n) {
      dot.addEventListener('click', function () { stop(); show(n); start(); });
    });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    start();
  });
})();

/* ── PARALLAX: JS-gesteuert, kein background-attachment:fixed ── */
(function () {
  var layers = document.querySelectorAll('[data-parallax]');
  if (!layers.length) return;
  var ticking = false;
  function update() {
    var vh = window.innerHeight;
    layers.forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax')) || .3;
      var rect = el.parentElement.getBoundingClientRect();
      var offset = (rect.top - vh) * speed * -1;
      el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

/* ── SEITENWECHSEL: Bild-Morph über View Transitions ──────
   Beim Klick auf eine Case-Study-Kachel bekommt genau deren Bild den
   Namen, den auf der Zielseite das Hero-Bild trägt. Der Browser
   erkennt beide als dasselbe Element und bewegt es über den
   Seitenwechsel hinweg, statt es neu aufzubauen.

   Der Name wird nur für die Dauer der Navigation gesetzt: Zwei
   Elemente mit gleichem view-transition-name auf einer Seite machen
   die Transition ungültig, und der Browser fällt still auf einen
   harten Wechsel zurück. */
(function () {
  if (!document.startViewTransition) return;

  var current = null;
  var heroMedia = document.querySelector('.hero > picture, .hero > img');

  function clear() {
    if (current) { current.style.viewTransitionName = ''; current = null; }
    if (heroMedia) heroMedia.style.viewTransitionName = '';
  }

  document.addEventListener('click', function (ev) {
    var link = ev.target.closest('a[href]');
    if (!link) return;
    if (link.origin !== location.origin) return;
    if (link.hasAttribute('download') || link.target === '_blank') return;

    var media = link.querySelector('.case-card-img img, .case-card-img picture');
    if (!media) return;

    clear();
    /* Auf einer Übersichtsseite trägt auch das eigene Hero-Bild diesen
       Namen (aus dem Stylesheet). Zwei gleiche Namen auf einer Seite
       machen die Transition ungültig — deshalb wird er dort für die
       Dauer der Navigation unterdrückt. */
    if (heroMedia) heroMedia.style.viewTransitionName = 'none';
    media.style.viewTransitionName = 'hero-media';
    current = media;
  }, true);

  /* Bei Rückkehr über den Zurück-Button liefert der bfcache die alte
     Seite samt gesetztem Namen aus — der muss wieder weg. Nicht bei
     pagehide/pageswap aufräumen: die feuern noch während der
     laufenden Navigation und würden die Transition abbrechen. */
  window.addEventListener('pageshow', clear);
})();

/* ── VORRENDERN: Speculation Rules ────────────────────────
   Interne Links werden vorgerendert, sobald der Zeiger länger auf
   ihnen ruht ("moderate"). Der Klick lädt dann nichts mehr nach —
   die Seite steht bereits. Browser ohne Unterstützung ignorieren
   das Script-Tag, es entsteht kein Fallback-Aufwand. */
(function () {
  if (!HTMLScriptElement.supports || !HTMLScriptElement.supports('speculationrules')) return;
  var rules = {
    prerender: [{
      where: {
        and: [
          { href_matches: '/*' },
          { not: { href_matches: '/*\\?*' } },
          { not: { selector_matches: '[download]' } },
          { not: { selector_matches: '[target="_blank"]' } },
          { not: { href_matches: '/kontakt/*' } }
        ]
      },
      eagerness: 'moderate'
    }]
  };
  var s = document.createElement('script');
  s.type = 'speculationrules';
  s.textContent = JSON.stringify(rules);
  document.body.appendChild(s);
})();
