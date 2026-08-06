/* Lunaris — starfield (lightweight on mobile, full on desktop) */
(function () {
  'use strict';

  window.lunarisInitStars = function () {
    var canvas = document.getElementById('pc');
    if (!canvas) return null;

    var isMobile = window.LUNARIS_IS_MOBILE ?? window.matchMedia('(max-width:767px)').matches;
    var linked = canvas.hasAttribute('data-linked');
    var ctx = canvas.getContext('2d');
    var W = 0;
    var H = 0;
    var targetX = 0;
    var targetY = 0;
    var currentX = 0;
    var currentY = 0;
    var running = true;
    var rafId = 0;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    if (!isMobile) {
      document.addEventListener('mousemove', function (e) {
        targetX = (e.clientX - W / 2) * 0.05;
        targetY = (e.clientY - H / 2) * 0.05;
      });
    }

    var count = isMobile ? 55 : 100;
    var pts = Array.from({ length: count }, function () {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * (isMobile ? 0.06 : 0.08),
        vy: (Math.random() - 0.5) * (isMobile ? 0.06 : 0.08) - (isMobile ? 0.02 : 0.04),
        s: Math.random() * (isMobile ? 1.2 : 1.5) + 0.5,
        a: Math.random() * 0.4 + 0.15,
        td: 1,
        ts: Math.random() * 0.004 + 0.001,
        depth: Math.random() * 0.8 + 0.2,
        hue: !isMobile && Math.random() > 0.7
      };
    });

    var LINK_DIST = 90;

    function loop() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);

      if (!isMobile) {
        currentX += (targetX - currentX) * 0.04;
        currentY += (targetY - currentY) * 0.04;
      }

      var len = pts.length;
      for (var i = 0; i < len; i++) {
        var p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.a += p.ts * p.td;
        if (p.a > 0.75 || p.a < 0.12) p.td *= -1;
        if (p.x > W) p.x = 0;
        if (p.x < 0) p.x = W;
        if (p.y > H) p.y = 0;
        if (p.y < 0) p.y = H;
        p.renderX = p.x + (currentX * p.depth);
        p.renderY = p.y + (currentY * p.depth);
      }

      if (linked && !isMobile) {
        for (var i = 0; i < len; i++) {
          var p1 = pts[i];
          for (var j = i + 1; j < len; j++) {
            var p2 = pts[j];
            var dx = p1.renderX - p2.renderX;
            var dy = p1.renderY - p2.renderY;
            var dist = Math.hypot(dx, dy);
            if (dist < LINK_DIST) {
              var alpha = (1 - dist / LINK_DIST) * 0.12;
              ctx.beginPath();
              ctx.moveTo(p1.renderX, p1.renderY);
              ctx.lineTo(p2.renderX, p2.renderY);
              ctx.strokeStyle = 'rgba(139, 92, 246, ' + alpha + ')';
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      for (var i = 0; i < len; i++) {
        var p = pts[i];
        ctx.beginPath();
        ctx.arc(p.renderX, p.renderY, p.s, 0, Math.PI * 2);
        ctx.fillStyle = p.hue
          ? 'rgba(167, 139, 250, ' + p.a + ')'
          : 'rgba(255, 255, 255, ' + p.a + ')';
        ctx.fill();
      }

      rafId = requestAnimationFrame(loop);
    }

    canvas.hidden = false;
    canvas.style.display = '';
    canvas.style.opacity = isMobile ? '0.55' : '0.7';
    loop();

    return {
      destroy: function () {
        running = false;
        cancelAnimationFrame(rafId);
      }
    };
  };

  function boot() {
    lunarisInitStars();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
