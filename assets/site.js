// Menu toggle and the WhatsApp enquiry. No tracking, nothing is sent anywhere by this script.
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
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
