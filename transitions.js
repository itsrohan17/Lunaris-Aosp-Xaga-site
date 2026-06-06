/* Lunaris — page enter/exit transitions between site pages */
(function () {
  'use strict';

  var SITE_PAGES = {
    'index.html': true,
    'downloads.html': true,
    'guide.html': true,
    'changelog.html': true
  };

  var EXIT_MS = 200;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var leaving = false;

  document.documentElement.classList.add('page-enter');

  function pageFromHref(href) {
    try {
      var url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return null;
      var part = url.pathname.split('/').filter(Boolean).pop();
      if (!part || part.indexOf('.') === -1) return 'index.html';
      return part;
    } catch (e) {
      return null;
    }
  }

  function isSiteLink(a) {
    if (!a || !a.href) return false;
    if (a.target === '_blank' || a.hasAttribute('download')) return false;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#') return false;
    var page = pageFromHref(a.href);
    return page && SITE_PAGES[page];
  }

  function ensureCurtain() {
    if (document.querySelector('.page-curtain')) return;
    var el = document.createElement('div');
    el.className = 'page-curtain';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
  }

  function wrapPageRoot() {
    if (document.getElementById('page-root')) return;
    var wrap = document.createElement('div');
    wrap.id = 'page-root';
    while (document.body.firstChild) {
      wrap.appendChild(document.body.firstChild);
    }
    document.body.appendChild(wrap);
    ensureCurtain();
  }

  function startEnter() {
    if (reduced) {
      document.documentElement.classList.add('page-enter-active');
      staggerPageContent();
      return;
    }
    requestAnimationFrame(function () {
      document.documentElement.classList.add('page-enter-active');
      staggerPageContent();
    });
  }

  function staggerPageContent() {
    var page = pageFromHref(window.location.href);
    var delay = reduced ? 0 : 40;

    if (page === 'downloads.html') {
      document.querySelectorAll('.dl-card').forEach(function (el, i) {
        window.setTimeout(function () {
          el.classList.add('visible');
        }, delay + i * 25);
      });
    }

    if (page === 'changelog.html') {
      document.querySelectorAll('.tl-item').forEach(function (el, i) {
        window.setTimeout(function () {
          el.classList.add('visible');
        }, delay + Math.min(i * 20, 120));
      });
    }

    if (page === 'guide.html') {
      document.querySelectorAll('.terminal-wrap').forEach(function (el, i) {
        window.setTimeout(function () {
          el.classList.add('visible');
        }, delay + i * 35);
      });
    }
  }

  function navigateWithExit(url) {
    if (leaving || reduced) {
      window.location.href = url;
      return;
    }
    leaving = true;
    document.documentElement.classList.remove('page-enter-active');
    document.documentElement.classList.add('page-leave');
    window.setTimeout(function () {
      window.location.href = url;
    }, EXIT_MS);
  }

  function markPageLinks() {
    document.querySelectorAll('a[href]').forEach(function (a) {
      if (isSiteLink(a)) a.classList.add('page-link');
    });
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var a = e.target.closest('a[href]');
    if (!isSiteLink(a)) return;

    var dest = pageFromHref(a.href);
    var current = pageFromHref(window.location.href);
    if (dest === current) return;

    e.preventDefault();
    navigateWithExit(a.href);
  }, true);

  window.addEventListener('pageshow', function (e) {
    leaving = false;
    document.documentElement.classList.remove('page-leave');
    if (e.persisted) {
      document.documentElement.classList.add('page-enter');
      startEnter();
    }
  });

  function boot() {
    wrapPageRoot();
    markPageLinks();
    startEnter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
