/* =============================================
   LUNARIS AOSP — XAGA
   script.js
============================================= */

(function () {

  /* ── DETECT MOBILE ── */
  const isMobile = window.innerWidth < 768 || navigator.maxTouchPoints > 0;

  /* =============================================
     PARTICLE SYSTEM
  ============================================= */
  const canvas = document.getElementById('pc');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = innerWidth;
    H = canvas.height = innerHeight;
  }
  addEventListener('resize', resize, { passive: true });
  resize();

  const COUNT = isMobile ? 40 : 90;
  const COLS  = ['rgba(167,139,250,', 'rgba(56,189,248,', 'rgba(255,255,255,'];

  const pts = Array.from({ length: COUNT }, () => ({
    x:   Math.random() * W,
    y:   Math.random() * H,
    vx:  (Math.random() - .5) * .12,
    vy:  -(Math.random() * .25 + .05),
    s:   Math.random() * 1.3 + .2,
    a:   Math.random() * .5 + .08,
    td:  1,
    ts:  Math.random() * .012 + .003,
    col: COLS[Math.floor(Math.random() * COLS.length)]
  }));

  /* Shooting star trails */
  let sf = [], fr = 0;

  function loop() {
    ctx.clearRect(0, 0, W, H);
    fr++;

    /* Add a new shooting star trail every 280 frames on desktop */
    if (fr % 280 === 0 && !isMobile) {
      sf.push({
        x:    Math.random() * W,
        y:    Math.random() * H * .4,
        len:  70 + Math.random() * 80,
        spd:  6  + Math.random() * 7,
        ang:  Math.PI / 5 + (Math.random() - .5) * .3,
        life: 0,
        max:  50 + Math.random() * 40,
        a:    0
      });
    }

    sf = sf.filter(s => {
      s.life++;
      s.a = s.life < 8
        ? s.life / 8
        : s.life > s.max - 8
          ? (s.max - s.life) / 8
          : 1;
      s.x += Math.cos(s.ang) * s.spd;
      s.y += Math.sin(s.ang) * s.spd;
      if (s.life >= s.max) return false;

      const tx = s.x - Math.cos(s.ang) * s.len;
      const ty = s.y - Math.sin(s.ang) * s.len;
      const g  = ctx.createLinearGradient(tx, ty, s.x, s.y);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, `rgba(200,180,255,${s.a * .8})`);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = g;
      ctx.lineWidth   = 1.4;
      ctx.stroke();
      return true;
    });

    pts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.a += p.ts * p.td;
      if (p.a > .6 || p.a < .04) p.td *= -1;
      if (p.y < -8) { p.x = Math.random() * W; p.y = H + 8; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
      ctx.fillStyle = p.col + p.a + ')';
      ctx.fill();
    });

    requestAnimationFrame(loop);
  }
  loop();

  /* =============================================
     COMMUNITY POPUP
  ============================================= */
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

  /* =============================================
     DL38 POPUP — v3.8 download mirrors
     Opens ABOVE the button since it's near bottom of page
  ============================================= */
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
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
    }
  };
  document.addEventListener('click', function (e) {
    const btn38 = document.getElementById('dl38-btn');
    const pop38 = document.getElementById('dl38-popup');
    if (pop38 && btn38 && !btn38.contains(e.target) && !pop38.contains(e.target)) {
      pop38.classList.remove('open');
    }
  });

  /* =============================================
     SMOOTH SCROLL TO SECTION
  ============================================= */
  window.smoothScrollTo = function (id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* =============================================
     ROCKET SCROLL FIX
     Prevent animation skip during scroll
  ============================================= */
  let scrollTimer;
  const rockets = document.querySelectorAll('.r');

  window.addEventListener('scroll', () => {
    rockets.forEach(r => { r.style.willChange = 'transform, opacity'; });
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      rockets.forEach(r => { r.style.willChange = 'transform, opacity'; });
    }, 150);
  }, { passive: true });

  /* =============================================
     TAB SWITCHER — Flash Guide methods
  ============================================= */
  window.showTab = function (id, btn) {
    ['win', 'linux', 'termux'].forEach(t => {
      const el = document.getElementById('tab-' + t);
      if (el) el.style.display = t === id ? 'block' : 'none';
    });
    document.querySelectorAll('.mtab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };

  /* =============================================
     COPY COMMAND — Terminal copy buttons
  ============================================= */
  window.copyCmd = function (btn, text) {
    const done = () => {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  };

  function fallbackCopy(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    cb();
  }

  /* =============================================
     SCROLL REVEAL — sections slide up on enter
  ============================================= */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.scroll-reveal').forEach(el => revealObs.observe(el));

  /* =============================================
     TIMELINE SCROLL REVEAL
  ============================================= */
  const tlObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: .15 });

  document.querySelectorAll('.tl-item').forEach(el => tlObs.observe(el));

  /* =============================================
     GITHUB API — live release stats
     Replaces skeleton loaders with real data
  ============================================= */
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = val;
  };

  fetch('https://api.github.com/repos/itsrohan17/android_device_xiaomi_xaga/releases/latest')
    .then(r => r.json())
    .then(d => {
      setVal('gh-ver',  d.tag_name || 'v3.8 Hotfix');

      if (d.published_at) {
        const dt = new Date(d.published_at);
        setVal('gh-date', dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
      } else {
        setVal('gh-date', '23 Mar 2026');
      }

      if (d.assets) {
        const total = d.assets.reduce((s, a) => s + a.download_count, 0);
        setVal('gh-dl', total > 0 ? total.toLocaleString() : '—');
      } else {
        setVal('gh-dl', '—');
      }
    })
    .catch(() => {
      /* Fallback static values if API fails */
      setVal('gh-ver',  'v3.8');
      setVal('gh-date', '23 Mar 2026');
      setVal('gh-dl',   '—');
    });

  /* =============================================
     DESKTOP EXTRAS
  ============================================= */
  if (!isMobile) {

    /* Custom cursor */
    const dot  = document.getElementById('cur-dot');
    const ring = document.getElementById('cur-ring');

    if (dot && ring) {
      document.addEventListener('mousemove', e => {
        dot.style.left  = e.clientX + 'px';
        dot.style.top   = e.clientY + 'px';
        ring.style.left = e.clientX + 'px';
        ring.style.top  = e.clientY + 'px';
      }, { passive: true });

      /* Expand ring on interactive elements */
      document.querySelectorAll('a, button, .btn, .feat, .pf, .cmd-copy, .mtab').forEach(el => {
        el.addEventListener('mouseenter', () => { ring.classList.add('hover'); dot.classList.add('hover'); });
        el.addEventListener('mouseleave', () => { ring.classList.remove('hover'); dot.classList.remove('hover'); });
      });

      document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
      document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
    }

    /* Magnetic buttons */
    document.querySelectorAll('.btn').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r  = b.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) * .1;
        const dy = (e.clientY - r.top  - r.height / 2) * .1;
        b.style.transform = `translateY(-3px) scale(1.02) translate(${dx}px,${dy}px)`;
      });
      b.addEventListener('mouseleave', () => { b.style.transform = ''; });
    });

    /* 3D phone tilt */
    document.querySelectorAll('.pf').forEach(f => {
      f.addEventListener('mousemove', e => {
        const r = f.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - .5;
        const y = (e.clientY - r.top)  / r.height - .5;
        f.style.transform = `translateY(-10px) scale(1.03) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
      });
      f.addEventListener('mouseleave', () => { f.style.transform = ''; });
    });

    /* Cursor glow */
    const g = document.createElement('div');
    Object.assign(g.style, {
      position:     'fixed',
      pointerEvents:'none',
      zIndex:       '9997',
      width:        '260px',
      height:       '260px',
      borderRadius: '50%',
      background:   'radial-gradient(circle, rgba(124,106,255,.055) 0%, transparent 70%)',
      transform:    'translate(-50%,-50%)',
      opacity:      '0',
      transition:   'opacity .3s',
      top:          '0',
      left:         '0'
    });
    document.body.appendChild(g);
    document.addEventListener('mousemove', e => {
      g.style.left    = e.clientX + 'px';
      g.style.top     = e.clientY + 'px';
      g.style.opacity = '1';
    }, { passive: true });
    document.addEventListener('mouseleave', () => { g.style.opacity = '0'; });
  }

  /* =============================================
     MOBILE — touch press feedback on buttons
  ============================================= */
  if (isMobile) {
    document.querySelectorAll('.btn').forEach(b => {
      b.addEventListener('touchstart', () => { b.style.transform = 'scale(.96)'; }, { passive: true });
      b.addEventListener('touchend',   () => { b.style.transform = ''; },          { passive: true });
    });
  }

})();