
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
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in-view', 'active', 'visible');
            obs.unobserve(e.target);
          }
        });
      }, { rootMargin: '100px 0px 40px 0px', threshold: 0.01 });

      document.querySelectorAll('.scroll-reveal, .dl-card, .feat, .tl-item, .terminal-wrap').forEach(function (el) {
        obs.observe(el);
      });
    } else {
      document.querySelectorAll('.scroll-reveal, .dl-card, .feat, .tl-item, .terminal-wrap').forEach(function (el) {
        el.classList.add('in-view', 'active', 'visible');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markInView);
  } else {
    markInView();
  }
})();
