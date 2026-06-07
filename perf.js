
(function () {
  'use strict';

  var mq = window.matchMedia('(max-width: 767px)');
  var isMobile = mq.matches;

  window.LUNARIS_IS_MOBILE = isMobile;

  if (isMobile) {
    document.documentElement.classList.add('is-mobile');
  }

  window.lunarisWhenIdle = function (fn) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fn, { timeout: 2000 });
    } else {
      setTimeout(fn, 120);
    }
  };

  window.lunarisRevealOpts = function (desktop) {
    return isMobile
      ? { threshold: 0.04, rootMargin: '80px 0px 40px 0px' }
      : desktop;
  };

  function markInView() {
    if (!isMobile) return;
    var vh = window.innerHeight;
    document.querySelectorAll('.scroll-reveal').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.92) {
        el.classList.add('in-view', 'active');
      }
    });
    document.querySelectorAll('.dl-card').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.95) {
        el.classList.add('visible');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markInView);
  } else {
    markInView();
  }
})();
