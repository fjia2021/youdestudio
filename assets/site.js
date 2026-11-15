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
  });
})();
