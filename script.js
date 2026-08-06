/* =============================================
   LUNARIS AOSP — CORE WEBSITE JAVASCRIPT
   script.js
   ============================================= */

(function () {
  'use strict';

  const isMobile = window.LUNARIS_IS_MOBILE ?? matchMedia('(max-width: 767px)').matches;

  /* ── POPUPS & CHECKSUM ── */
  window.toggleCommunity = function (e) {
    if (e) e.stopPropagation();
    const popup = document.getElementById('community-popup');
    const btn = document.getElementById('comm-btn');
    if (!popup || !btn) return;
    const rect = btn.getBoundingClientRect();
    const W = 240;
    let left = rect.left + rect.width / 2 - W / 2;
    if (left < 8) left = 8;
    if (left + W > window.innerWidth - 8) left = window.innerWidth - W - 8;
    popup.style.top = (rect.bottom + 8) + 'px';
    popup.style.left = left + 'px';
    popup.classList.toggle('open');
  };

  window.toggleDl38 = function (e) {
    if (e) e.stopPropagation();
    const popup = document.getElementById('dl38-popup');
    const btn = document.getElementById('dl38-btn');
    if (!popup || !btn) return;
    const rect = btn.getBoundingClientRect();
    const W = 240;
    const pH = 190;
    let left = rect.left + rect.width / 2 - W / 2;
    if (left < 8) left = 8;
    if (left + W > window.innerWidth - 8) left = window.innerWidth - W - 8;
    popup.style.top = (rect.top - pH - 8) + 'px';
    popup.style.left = left + 'px';
    popup.classList.toggle('open');
  };

  window.copyChecksum = function () {
    const hash = 'f1253703c02c9a8f29ef2aacdf60cc3288ffd45cfa2c4b4987b6bb7b59f8f82b';
    const btn = document.querySelector('.dl-checksum-copy');
    const done = () => {
      if (btn) {
        btn.textContent = 'Copied!';
        btn.style.color = '#34d399';
        setTimeout(() => { btn.textContent = 'Copy'; btn.style.color = ''; }, 2000);
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(hash).then(done).catch(() => fallbackCopy(hash, done));
    } else {
      fallbackCopy(hash, done);
    }
  };

  document.addEventListener('click', function (e) {
    const btnComm = document.getElementById('comm-btn');
    const popComm = document.getElementById('community-popup');
    if (popComm && btnComm && !btnComm.contains(e.target) && !popComm.contains(e.target)) {
      popComm.classList.remove('open');
    }
    const btn38 = document.getElementById('dl38-btn');
    const pop38 = document.getElementById('dl38-popup');
    if (pop38 && btn38 && !btn38.contains(e.target) && !pop38.contains(e.target)) {
      pop38.classList.remove('open');
    }
  });

  /* ── TAB SWITCHER & COPY COMMAND ── */
  window.showTab = function (id, btn) {
    ['win', 'linux', 'termux', 'ota'].forEach(t => {
      const el = document.getElementById('tab-' + t);
      if (el) el.style.display = (t === id) ? 'block' : 'none';
    });
    document.querySelectorAll('.mtab').forEach(b => b.classList.remove('active'));
    if (btn && btn.classList) btn.classList.add('active');
  };

  window.copyCmd = function (btn, text) {
    const done = () => {
      if (btn) {
        btn.textContent = 'Copied!';
        btn.style.color = '#34d399';
        setTimeout(() => { btn.textContent = 'Copy'; btn.style.color = ''; }, 2000);
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  };

  function fallbackCopy(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    if (cb) cb();
  }

  /* ── SCREENSHOT GALLERY LOGIC ── */
  window.filterGallery = function (category, btnTarget) {
    const target = btnTarget || (window.event ? window.event.target : null);
    if (target && target.classList) {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      target.classList.add('active');
    }

    const items = document.querySelectorAll('.ss-carousel .pw');
    items.forEach(item => {
      const itemCat = item.getAttribute('data-cat');
      if (category === 'all' || itemCat === category) {
        item.style.display = 'block';
        requestAnimationFrame(() => { item.style.opacity = '1'; });
      } else {
        item.style.opacity = '0';
        setTimeout(() => { item.style.display = 'none'; }, 250);
      }
    });
  };

  /* ── LIGHTBOX MODAL ── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  let currentImages = [];
  let currentIdx = 0;

  window.openModal = function (src) {
    if (!lightbox || !lightboxImg) return;
    const visibleCards = Array.from(document.querySelectorAll('.ss-carousel .pw')).filter(el => el.style.display !== 'none');
    currentImages = visibleCards.map(el => {
      const img = el.querySelector('img');
      return img ? img.src : '';
    }).filter(Boolean);

    currentIdx = currentImages.indexOf(src);
    if (currentIdx === -1) currentIdx = 0;

    lightboxImg.src = src;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function () {
    if (!lightbox) return;
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
  };

  window.prevImage = function (e) {
    if (e && e.stopPropagation) e.stopPropagation();
    if (currentImages.length === 0) return;
    currentIdx = (currentIdx - 1 + currentImages.length) % currentImages.length;
    if (lightboxImg) lightboxImg.src = currentImages[currentIdx];
  };

  window.nextImage = function (e) {
    if (e && e.stopPropagation) e.stopPropagation();
    if (currentImages.length === 0) return;
    currentIdx = (currentIdx + 1) % currentImages.length;
    if (lightboxImg) lightboxImg.src = currentImages[currentIdx];
  };

  if (lightbox) {
    let touchstartX = 0;
    let touchendX = 0;
    lightbox.addEventListener('touchstart', e => {
      if (e.changedTouches && e.changedTouches[0]) {
        touchstartX = e.changedTouches[0].screenX;
      }
    }, { passive: true });

    lightbox.addEventListener('touchend', e => {
      if (e.changedTouches && e.changedTouches[0]) {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX - 40) nextImage();
        if (touchendX > touchstartX + 40) prevImage();
      }
    }, { passive: true });
  }

  document.addEventListener('keydown', function (event) {
    if (!lightbox || !lightbox.classList.contains('show')) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'ArrowLeft') prevImage();
    if (event.key === 'ArrowRight') nextImage();
  });

  /* ── SCROLL & OBSERVERS ── */
  window.smoothScrollTo = function (id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: isMobile ? 'auto' : 'smooth', block: 'start' });
  };

  const revealOpts = window.lunarisRevealOpts ? lunarisRevealOpts({ threshold: 0.08 }) : { threshold: 0.08 };
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        revealObs.unobserve(e.target);
      }
    });
  }, revealOpts);
  document.querySelectorAll('.scroll-reveal').forEach(el => revealObs.observe(el));

  const tlObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        tlObs.unobserve(e.target);
      }
    });
  }, window.lunarisRevealOpts ? lunarisRevealOpts({ threshold: 0.15 }) : { threshold: 0.15 });
  document.querySelectorAll('.tl-item').forEach(el => tlObs.observe(el));

  /* ── GITHUB RELEASE DATA FETCH ── */
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = val;
  };
  const loadGh = () => {
    fetch('https://api.github.com/repos/itsrohan17/android_device_xiaomi_xaga/releases/latest')
      .then(r => r.json())
      .then(d => {
        setVal('gh-ver', d.tag_name || 'v3.12');
        if (d.published_at) {
          const dt = new Date(d.published_at);
          setVal('gh-date', dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
        } else {
          setVal('gh-date', 'Aug 2026');
        }
        if (d.assets) {
          const total = d.assets.reduce((s, a) => s + a.download_count, 0);
          setVal('gh-dl', total > 0 ? total.toLocaleString() : '—');
        } else {
          setVal('gh-dl', '—');
        }
      })
      .catch(() => {
        setVal('gh-ver', 'v3.12');
        setVal('gh-date', 'Aug 2026');
        setVal('gh-dl', '—');
      });
  };
  if (window.lunarisWhenIdle) lunarisWhenIdle(loadGh);
  else loadGh();
})();