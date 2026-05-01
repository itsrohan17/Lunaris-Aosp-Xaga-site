/* =============================================
   LUNARIS AOSP — XAGA (REFINED & COMPLETE)
   script.js
============================================= */

(function () {
  const isMobile = window.innerWidth < 768 || navigator.maxTouchPoints > 0;

  /* ── ELEGANT STARFIELD CANVAS ── */
  const canvas = document.getElementById('pc');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = innerWidth;
    H = canvas.height = innerHeight;
  }
  addEventListener('resize', resize, { passive: true });
  resize();

  const COUNT = isMobile ? 50 : 150;
  const pts = Array.from({ length: COUNT }, () => ({
    x:   Math.random() * W,
    y:   Math.random() * H,
    vx:  (Math.random() - 0.5) * 0.1,
    vy:  (Math.random() - 0.5) * 0.1 - 0.05, 
    s:   Math.random() * 1.5 + 0.5,
    a:   Math.random() * 0.5 + 0.1,
    td:  1,
    ts:  Math.random() * 0.005 + 0.001
  }));

  function loop() {
    ctx.clearRect(0, 0, W, H);
    
    pts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.a += p.ts * p.td;
      
      if (p.a > 0.8 || p.a < 0.1) p.td *= -1;
      
      if (p.x > W) p.x = 0;
      if (p.x < 0) p.x = W;
      if (p.y > H) p.y = 0;
      if (p.y < 0) p.y = H;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.a})`;
      ctx.fill();
    });

    requestAnimationFrame(loop);
  }
  loop();

  /* ── COMMUNITY POPUP ── */
  window.toggleCommunity = function (e) {
    e.stopPropagation();
    const popup = document.getElementById('community-popup');
    const btn   = document.getElementById('comm-btn');
    const rect  = btn.getBoundingClientRect();
    const W     = 240;
    let left    = rect.left + rect.width / 2 - W / 2;
    if (left < 8) left = 8;
    if (left + W > window.innerWidth - 8) left = window.innerWidth - W - 8;
    popup.style.top  = (rect.bottom + 8) + 'px';
    popup.style.left = left + 'px';
    popup.classList.toggle('open');
  };
  document.addEventListener('click', function (e) {
    const btn   = document.getElementById('comm-btn');
    const popup = document.getElementById('community-popup');
    if (popup && btn && !btn.contains(e.target) && !popup.contains(e.target)) {
      popup.classList.remove('open');
    }
  });

  /* ── DL38 POPUP ── */
  window.toggleDl38 = function (e) {
    e.stopPropagation();
    const popup = document.getElementById('dl38-popup');
    const btn   = document.getElementById('dl38-btn');
    const rect  = btn.getBoundingClientRect();
    const W     = 240;
    const pH    = 190;
    let left    = rect.left + rect.width / 2 - W / 2;
    if (left < 8) left = 8;
    if (left + W > window.innerWidth - 8) left = window.innerWidth - W - 8;
    popup.style.top  = (rect.top - pH - 8) + 'px';
    popup.style.left = left + 'px';
    popup.classList.toggle('open');
  };

  window.copyChecksum = function () {
    const hash = 'f1253703c02c9a8f29ef2aacdf60cc3288ffd45cfa2c4b4987b6bb7b59f8f82b';
    const btn  = document.querySelector('.dl-checksum-copy');
    navigator.clipboard.writeText(hash).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = hash; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    });
    if (btn) {
      btn.textContent = 'Copied!';
      btn.style.color = '#34d399';
      setTimeout(() => { btn.textContent = 'Copy'; btn.style.color = ''; }, 2000);
    }
  };
  
  document.addEventListener('click', function (e) {
    const btn38 = document.getElementById('dl38-btn');
    const pop38 = document.getElementById('dl38-popup');
    if (pop38 && btn38 && !btn38.contains(e.target) && !pop38.contains(e.target)) {
      pop38.classList.remove('open');
    }
  });

  /* ── TAB SWITCHER ── */
  window.showTab = function (id, btn) {
    ['win', 'linux', 'termux'].forEach(t => {
      const el = document.getElementById('tab-' + t);
      if (el) el.style.display = t === id ? 'block' : 'none';
    });
    document.querySelectorAll('.mtab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };

  /* ── COPY COMMAND ── */
  window.copyCmd = function (btn, text) {
    const done = () => {
      btn.textContent = 'Copied!';
      btn.style.color = '#34d399';
      setTimeout(() => { btn.textContent = 'Copy'; btn.style.color = ''; }, 2000);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  };
  function fallbackCopy(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); cb();
  }

  /* ── SCROLL REVEAL ── */
  window.smoothScrollTo = function (id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.scroll-reveal').forEach(el => revealObs.observe(el));

  const tlObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.tl-item').forEach(el => tlObs.observe(el));

  /* ── GITHUB API ── */
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = val;
  };
  fetch('https://api.github.com/repos/itsrohan17/android_device_xiaomi_xaga/releases/latest')
    .then(r => r.json())
    .then(d => {
      setVal('gh-ver',  d.tag_name || 'v3.9');
      if (d.published_at) {
        const dt = new Date(d.published_at);
        setVal('gh-date', dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
      } else { setVal('gh-date', 'Apr 2026'); }
      if (d.assets) {
        const total = d.assets.reduce((s, a) => s + a.download_count, 0);
        setVal('gh-dl', total > 0 ? total.toLocaleString() : '—');
      } else { setVal('gh-dl', '—'); }
    })
    .catch(() => {
      setVal('gh-ver',  'v3.8'); setVal('gh-date', 'Apr 2026'); setVal('gh-dl',   '—');
    });

  /* ── CUSTOM CURSOR ── */
  if (!isMobile) {
    const dot  = document.getElementById('cur-dot');
    const ring = document.getElementById('cur-ring');
    if (dot && ring) {
      document.addEventListener('mousemove', e => {
        dot.style.left = e.clientX + 'px';
        dot.style.top  = e.clientY + 'px';
        setTimeout(() => {
          ring.style.left = e.clientX + 'px';
          ring.style.top  = e.clientY + 'px';
        }, 40);
      }, { passive: true });
      document.querySelectorAll('a, button, .btn, .feat, .pf, .mtab').forEach(el => {
        el.addEventListener('mouseenter', () => { ring.style.width = '48px'; ring.style.height = '48px'; ring.style.borderColor = 'rgba(139, 92, 246, 0.8)'; dot.style.background = '#8b5cf6'; });
        el.addEventListener('mouseleave', () => { ring.style.width = '32px'; ring.style.height = '32px'; ring.style.borderColor = 'rgba(255,255,255,0.4)'; dot.style.background = '#fff'; });
      });
      document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
      document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
    }
  }
})();