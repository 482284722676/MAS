(function() {
  var canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  document.body.prepend(canvas);

  var ctx = canvas.getContext('2d');
  var particles = [];
  var maxDistance = 150;
  var mouseX = -1000;
  var mouseY = -1000;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  var COLORS = ['rgba(196, 30, 58,', 'rgba(33, 150, 243,', 'rgba(255, 255, 255,'];

  function createParticles() {
    particles = [];
    var count = window.innerWidth < 768 ? 45 : (window.innerWidth < 1200 ? 70 : 100);
    for (var i = 0; i < count; i++) {
      var r = Math.random() * 2 + 0.6;
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: r,
        baseRadius: r,
        alpha: Math.random() * 0.5 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.3,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.6 + Math.random() * 1.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }
  }
  createParticles();
  window.addEventListener('resize', createParticles);

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  document.addEventListener('mouseleave', function() {
    mouseX = -1000;
    mouseY = -1000;
  });

  document.addEventListener('touchmove', function(e) {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
  });
  document.addEventListener('touchend', function() {
    mouseX = -1000;
    mouseY = -1000;
  });

  var time = 0;

  function animate() {
    time += 0.016;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = window.innerWidth;
      if (p.x > window.innerWidth) p.x = 0;
      if (p.y < 0) p.y = window.innerHeight;
      if (p.y > window.innerHeight) p.y = 0;

      var twinkle = (Math.sin(time * p.twinkleSpeed + p.phase) + 1) / 2;
      var a = p.baseAlpha * (0.35 + 0.65 * twinkle);
      var glow = 1 + twinkle * 1.2;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.baseRadius * glow, 0, Math.PI * 2);
      ctx.fillStyle = p.color + ' ' + a + ')';
      ctx.fill();

      if (twinkle > 0.75) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseRadius * glow * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = p.color + ' ' + (a * 0.15) + ')';
        ctx.fill();
      }

      var dxM = mouseX - p.x;
      var dyM = mouseY - p.y;
      var distM = Math.sqrt(dxM * dxM + dyM * dyM);
      if (distM < maxDistance) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = 'rgba(196, 30, 58, ' + (1 - distM / maxDistance) * 0.16 + ')';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var dx = p.x - p2.x;
        var dy = p.y - p2.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          var alpha = (1 - dist / maxDistance) * 0.09;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(150, 150, 170, ' + alpha + ')';
          ctx.lineWidth = 0.3;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
})();
