// Builds mailto links at runtime so the address is not present as plain text in the HTML source.
(function () {
  var user = 'feng.jia';
  var host = 'youdestudio.com';
  var addr = user + '@' + host;
  document.querySelectorAll('[data-mail]').forEach(function (el) {
    var subject = el.getAttribute('data-subject');
    el.href = 'mailto:' + addr + (subject ? '?subject=' + encodeURIComponent(subject) : '');
    if (el.hasAttribute('data-show')) {
      el.textContent = addr;
    }
    el.addEventListener('click', function () {
      if (window.gtmLoaded) window.dataLayer.push({ event: 'contact_email_click' });
    });
  });
})();

(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = form.querySelector('.form-status');
  var button = form.querySelector('button');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    button.disabled = true;
    status.className = 'form-status';
    status.textContent = form.getAttribute('data-msg-sending');
    fetch(form.action, { method: 'POST', body: new FormData(form) })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        form.reset();
        if (window.gtmLoaded) window.dataLayer.push({ event: 'contact_form_submit' });
        status.classList.add('ok');
        status.textContent = form.getAttribute('data-msg-ok');
      })
      .catch(function () {
        status.classList.add('err');
        status.textContent = form.getAttribute('data-msg-error');
      })
      .then(function () { button.disabled = false; });
  });
})();
