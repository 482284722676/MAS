(function() {
  var canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  document.body.prepend(canvas);

  var ctx = canvas.getContext('2d');
  var particles = [];
  var particleCount = 80;
  var maxDistance = 150;
  var mouseX = -1000;
  var mouseY = -1000;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function createParticles() {
    particles = [];
    var count = window.innerWidth < 768 ? 40 : (window.innerWidth < 1200 ? 60 : 80);
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
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

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(196, 30, 58, 0.4)';
      ctx.fill();

      var dxM = mouseX - p.x;
      var dyM = mouseY - p.y;
      var distM = Math.sqrt(dxM * dxM + dyM * dyM);
      if (distM < maxDistance) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = 'rgba(196, 30, 58, ' + (1 - distM / maxDistance) * 0.15 + ')';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var dx = p.x - p2.x;
        var dy = p.y - p2.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(196, 30, 58, ' + (1 - dist / maxDistance) * 0.08 + ')';
          ctx.lineWidth = 0.3;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
})();
