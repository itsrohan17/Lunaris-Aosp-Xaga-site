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

      var positions = pts.map(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.a += p.ts * p.td;
        if (p.a > 0.75 || p.a < 0.12) p.td *= -1;
        if (p.x > W) p.x = 0;
        if (p.x < 0) p.x = W;
        if (p.y > H) p.y = 0;
        if (p.y < 0) p.y = H;
        return {
          x: p.x + (currentX * p.depth),
          y: p.y + (currentY * p.depth),
          a: p.a,
          hue: p.hue,
          s: p.s
        };
      });

      if (linked && !isMobile) {
        for (var i = 0; i < positions.length; i++) {
          for (var j = i + 1; j < positions.length; j++) {
            var dx = positions[i].x - positions[j].x;
            var dy = positions[i].y - positions[j].y;
            var dist = Math.hypot(dx, dy);
            if (dist < LINK_DIST) {
              var alpha = (1 - dist / LINK_DIST) * 0.12;
              ctx.beginPath();
              ctx.moveTo(positions[i].x, positions[i].y);
              ctx.lineTo(positions[j].x, positions[j].y);
              ctx.strokeStyle = 'rgba(139, 92, 246, ' + alpha + ')';
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      positions.forEach(function (pos, i) {
        var p = pts[i];
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.s, 0, Math.PI * 2);
        if (pos.hue) {
          ctx.fillStyle = 'rgba(167, 139, 250, ' + pos.a + ')';
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, ' + pos.a + ')';
        }
        ctx.fill();
      });

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
