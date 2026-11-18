// Menu toggle, FAQ (one answer open at a time) and the WhatsApp enquiry. No tracking, nothing is sent anywhere by this script.
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Tap or click anywhere outside the open menu closes it.
    function closeMenu() {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    document.addEventListener('click', function (ev) {
      if (!nav.classList.contains('open')) return;
      if (nav.contains(ev.target) || toggle.contains(ev.target)) return;
      closeMenu();
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // Header stays at the top; a thin shadow shows once the page has scrolled.
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 4); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // FAQ: the name="faq" attribute already makes browsers keep one answer open; this does the same
  // for older browsers that ignore it.
  var faqs = document.querySelectorAll('.faq details');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  // Services: open the service a link points to (links from other pages). If the filter is hiding it, clear the filter first.
  var resetServiceFilter = function () {};
  function openFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var sec = document.getElementById(id);
    if (sec && sec.hidden) { resetServiceFilter(); }
    var d = sec && sec.querySelector('details.svc-more');
    if (d) d.open = true;
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);


  // Home: "What do you need help with?" shows the services that fit. All the text is in the page already.
  var finder = document.querySelector('.finder');
  if (finder) {
    var fChips = finder.querySelectorAll('.chip');
    var fPanels = finder.querySelectorAll('.need-panel');
    var fHint = finder.querySelector('.finder-hint');
    var fBar = finder.querySelector('.chips');
    var showNeed = function (id) {
      fChips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-need') === id ? 'true' : 'false'); });
      fPanels.forEach(function (p) { p.hidden = p.getAttribute('data-need') !== id; });
      if (fHint) fHint.hidden = !!id;
    };
    fChips.forEach(function (c) { c.addEventListener('click', function () { showNeed(c.getAttribute('data-need')); }); });
    if (fBar) fBar.hidden = false;
    showNeed('');
  }

  // Services: filter by group and search. Hidden services stay in the page HTML.
  var svcTools = document.querySelector('.svc-tools');
  if (svcTools) {
    var secs = Array.prototype.slice.call(document.querySelectorAll('.service'));
    var sChips = svcTools.querySelectorAll('.chip');
    var sQ = svcTools.querySelector('input');
    var sCount = svcTools.querySelector('.svc-count');
    var sNone = document.querySelector('.svc-none');
    var sCat = 'all';
    var applySvc = function () {
      var term = sQ.value.trim().toLowerCase(), n = 0;
      secs.forEach(function (s) {
        var ok = (sCat === 'all' || s.getAttribute('data-cat') === sCat) && (!term || s.textContent.toLowerCase().indexOf(term) > -1);
        s.hidden = !ok;
        if (ok) n++;
      });
      sCount.textContent = n === secs.length ? 'Showing all ' + n + ' services' : 'Showing ' + n + ' of ' + secs.length + ' services';
      if (sNone) sNone.hidden = n > 0;
    };
    sChips.forEach(function (c) {
      c.addEventListener('click', function () {
        sCat = c.getAttribute('data-cat');
        sChips.forEach(function (o) { o.setAttribute('aria-pressed', o === c ? 'true' : 'false'); });
        applySvc();
      });
    });
    sQ.addEventListener('input', applySvc);
    resetServiceFilter = function () {
      sCat = 'all'; sQ.value = '';
      sChips.forEach(function (o) { o.setAttribute('aria-pressed', o.getAttribute('data-cat') === 'all' ? 'true' : 'false'); });
      applySvc();
    };
    svcTools.hidden = false;
    applySvc();
  }

  // FAQs: search the questions.
  var faqTools = document.querySelector('.faq-tools');
  if (faqTools) {
    var fqIn = faqTools.querySelector('input');
    var fqCount = faqTools.querySelector('.svc-count');
    var fqNone = document.querySelector('.svc-none');
    var applyFaq = function () {
      var term = fqIn.value.trim().toLowerCase(), n = 0;
      faqs.forEach(function (d) {
        var ok = !term || d.textContent.toLowerCase().indexOf(term) > -1;
        d.hidden = !ok;
        if (ok) n++;
      });
      fqCount.textContent = term ? 'Showing ' + n + ' of ' + faqs.length + ' questions' : '';
      if (fqNone) fqNone.hidden = n > 0;
    };
    fqIn.addEventListener('input', applyFaq);
    faqTools.hidden = false;
  }

  // How we work: each step lights up as you reach it.
  var steps = document.querySelectorAll('.process li');
  if (steps.length && 'IntersectionObserver' in window) {
    var stepObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-on'); stepObs.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -25% 0px', threshold: 0.3 });
    steps.forEach(function (s) { stepObs.observe(s); });
  } else {
    steps.forEach(function (s) { s.classList.add('is-on'); });
  }

  var form = document.getElementById('enquiry');
  if (!form) return;
  function check(id, errId) {
    var field = document.getElementById(id);
    var err = document.getElementById(errId);
    var bad = !field.value.trim();
    field.setAttribute('aria-invalid', bad ? 'true' : 'false');
    err.hidden = !bad;
    return bad ? field : null;
  }
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var first = check('f-name', 'e-name') || null;
    var second = check('f-msg', 'e-msg');
    var bad = first || second;
    if (bad) { bad.focus(); return; }
    var name = form.elements.name.value.trim();
    var phone = form.elements.phone.value.trim();
    var service = form.elements.service.value;
    var msg = form.elements.message.value.trim();
    var lines = ['Hello, this is ' + name + '.'];
    if (service) lines.push('Service: ' + service);
    lines.push(msg);
    if (phone) lines.push('Phone: ' + phone);
    var url = form.getAttribute('data-wa') + '?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');
  });
})();
