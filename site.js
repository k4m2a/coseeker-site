// CoSeeker — shared interactions
(function () {
  // Mobile menu
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-menu]');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.hasAttribute('data-open');
      if (open) { nav.removeAttribute('data-open'); toggle.setAttribute('aria-expanded', 'false'); }
      else { nav.setAttribute('data-open', ''); toggle.setAttribute('aria-expanded', 'true'); }
    });
  }

  // FAQ accordion
  document.querySelectorAll('[data-faq-item]').forEach(function (item) {
    var q = item.querySelector('[data-faq-q]');
    var a = item.querySelector('[data-faq-a]');
    if (!q || !a) return;
    function setOpen(open) {
      item.classList.toggle('is-open', open);
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      a.style.maxHeight = open ? (a.scrollHeight + 'px') : '0px';
    }
    if (item.classList.contains('is-open')) { requestAnimationFrame(function () { setOpen(true); }); }
    q.addEventListener('click', function () { setOpen(!item.classList.contains('is-open')); });
  });

  // Invite / contact form
  document.querySelectorAll('[data-form]').forEach(function (form) {
    var errEl = form.querySelector('[data-form-error]');
    var endpoint = form.getAttribute('data-endpoint');
    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.textContent : '';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {};
      form.querySelectorAll('input, textarea').forEach(function (el) { data[el.name] = (el.value || '').trim(); });
      var required = form.getAttribute('data-required') ? form.getAttribute('data-required').split(',') : [];
      for (var i = 0; i < required.length; i++) {
        var key = required[i];
        if (!data[key]) { return showErr('Please complete every required field.'); }
      }
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { return showErr('That email doesn\u2019t look quite right.'); }
      if (errEl) errEl.hidden = true;
      if (!endpoint) { return showErr('This form isn\u2019t wired up yet.'); }
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending\u2026'; }
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (json) {
          if (!res.ok || !json.ok) { throw new Error(json.error || 'Something went wrong. Please try again.'); }
        });
      }).then(function () {
        var scope = form.closest('[data-form-scope]');
        var conf = scope || document;
        var fc = conf.querySelector('[data-form-confirm]');
        var first = (data.name || '').split(/\s+/)[0];
        var nm = conf.querySelector('[data-confirm-name]');
        if (nm && first) nm.textContent = first;
        form.hidden = true;
        if (fc) fc.hidden = false;
        // Collapse to a clean, centred completion screen: drop the intro/aside
        // column and any sticky offset that would overlap the confirmation.
        var grid = scope ? scope.closest('.contact-grid') : null;
        if (grid) {
          grid.classList.add('is-confirmed');
          grid.querySelectorAll('[data-confirm-hide]').forEach(function (el) { el.hidden = true; });
        }
        if (scope && typeof scope.scrollIntoView === 'function') {
          scope.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }).catch(function (err) {
        showErr(err.message || 'Something went wrong. Please try again.');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitLabel; }
      });
    });
    function showErr(msg) { if (errEl) { errEl.textContent = msg; errEl.hidden = false; } }
  });
})();
