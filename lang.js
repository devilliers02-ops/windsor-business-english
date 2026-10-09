/* Bilingual engine. English lives in the markup; French sits beside it in data-fr attributes.
   data-fr="..."            replaces textContent
   data-fr="..." data-h     replaces innerHTML (author-controlled strings only)
   data-fr-aria / -ph / -title   replace aria-label / placeholder / title */
(function () {
  var KEY = 'wbe_lang';
  var ATTRS = { 'data-fr-aria': 'aria-label', 'data-fr-ph': 'placeholder', 'data-fr-title': 'title' };
  var current = 'en';

  function load() {
    try { var s = localStorage.getItem(KEY); if (s === 'fr' || s === 'en') return s; } catch (e) {}
    return /^fr/i.test(navigator.language || '') ? 'fr' : 'en';
  }

  function apply(lang) {
    current = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-fr]').forEach(function (el) {
      var html = el.hasAttribute('data-h');
      if (!('en0' in el.dataset)) el.dataset.en0 = html ? el.innerHTML : el.textContent;
      var v = lang === 'fr' ? el.getAttribute('data-fr') : el.dataset.en0;
      if (html) el.innerHTML = v; else el.textContent = v;
    });
    Object.keys(ATTRS).forEach(function (a) {
      document.querySelectorAll('[' + a + ']').forEach(function (el) {
        var t = ATTRS[a], k = 'data-en0-' + t;
        if (!el.hasAttribute(k)) el.setAttribute(k, el.getAttribute(t) || '');
        el.setAttribute(t, lang === 'fr' ? el.getAttribute(a) : el.getAttribute(k));
      });
    });
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    document.dispatchEvent(new CustomEvent('wbe:lang', { detail: lang }));
  }

  function set(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply(lang);
  }

  window.WBE = {
    lang: function () { return current; },
    t: function (o) { return o && (o[current] || o.en) || ''; },
    set: set
  };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { set(b.dataset.lang); });
    });
    apply(load());
  });
})();
