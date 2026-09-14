/**
 * Subtle constellation background for the Brittany-style homepage.
 * Tuned for lower CPU: fewer stars, capped DPR, ~30fps, cheaper lines.
 */
(function () {
  const canvas = document.getElementById('bc-stars');
  if (!canvas || !canvas.getContext) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    canvas.remove();
    return;
  }

  const mobile = window.matchMedia('(max-width: 980px)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
  /* Cap DPR — full 2–3x retina is costly for a soft background */
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);

  const config = {
    length: mobile ? 28 : 48,
    velocity: 0.22,
    distance: 95,
    distanceSq: 95 * 95,
    radius: 150,
    radiusSq: 150 * 150,
    lineWidth: 0.65,
    starWidth: 1.45,
  };

  const stars = [];
  const meteors = [];
  const mouse = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.35,
    active: false,
  };

  let width = 0;
  let height = 0;
  let raf = 0;
  let running = false;
  let lastMeteor = 0;
  let lastFrame = 0;
  let mouseIdleTimer = 0;
  const FRAME_MS = 33; /* ~30fps */

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createStar() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: config.velocity - Math.random() * 0.45,
      vy: config.velocity - Math.random() * 0.45,
      r: Math.random() * config.starWidth + 0.35,
      phase: Math.random() * Math.PI * 2,
      twinkle: 0.6 + Math.random() * 1.2,
    };
  }

  function seed() {
    stars.length = 0;
    for (let i = 0; i < config.length; i += 1) {
      stars.push(createStar());
    }
  }

  function bounce(star) {
    if (star.x < 0 || star.x > width) star.vx *= -1;
    if (star.y < 0 || star.y > height) star.vy *= -1;
    star.x = Math.max(0, Math.min(width, star.x));
    star.y = Math.max(0, Math.min(height, star.y));
  }

  function spawnMeteor(now) {
    if (now - lastMeteor < 7000 + Math.random() * 8000) return;
    if (meteors.length > 0) return;
    lastMeteor = now;
    const fromLeft = Math.random() > 0.45;
    meteors.push({
      x: fromLeft ? -40 : Math.random() * width * 0.55,
      y: Math.random() * height * 0.35,
      vx: fromLeft ? 7 + Math.random() * 3.5 : 5 + Math.random() * 2.5,
      vy: 2.2 + Math.random() * 2,
      life: 1,
      decay: 0.014 + Math.random() * 0.008,
      len: 50 + Math.random() * 40,
    });
  }

  function drawMeteors() {
    for (let i = meteors.length - 1; i >= 0; i -= 1) {
      const m = meteors[i];
      m.x += m.vx;
      m.y += m.vy;
      m.life -= m.decay;

      if (m.life <= 0 || m.x > width + 80 || m.y > height + 80) {
        meteors.splice(i, 1);
        continue;
      }

      const tx = m.x - m.vx * (m.len / 8);
      const ty = m.y - m.vy * (m.len / 8);
      /* Solid stroke instead of per-frame gradient */
      ctx.strokeStyle = `rgba(180, 230, 255, ${0.55 * m.life})`;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(m.x, m.y);
      ctx.stroke();

      ctx.fillStyle = `rgba(230, 241, 255, ${0.85 * m.life})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function draw(now) {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = config.lineWidth;
    const drawLinks = finePointer && mouse.active;
    const mx = mouse.x;
    const my = mouse.y;

    for (let i = 0; i < stars.length; i += 1) {
      const a = stars[i];
      a.x += a.vx;
      a.y += a.vy;
      bounce(a);

      const flicker = 0.6 + 0.4 * Math.sin(now * 0.0018 * a.twinkle + a.phase);
      ctx.fillStyle = `rgba(204, 214, 246, ${0.4 + flicker * 0.45})`;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();

      if (!drawLinks) continue;

      const amx = a.x - mx;
      const amy = a.y - my;
      if (amx * amx + amy * amy > config.radiusSq) continue;

      /* Only link to a few later neighbors to cut O(n²) */
      const jMax = Math.min(stars.length, i + 12);
      for (let j = i + 1; j < jMax; j += 1) {
        const b = stars[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        if (dx * dx + dy * dy > config.distanceSq) continue;

        const alpha = 1 - Math.sqrt(dx * dx + dy * dy) / config.distance;
        ctx.strokeStyle = `rgba(100, 255, 218, ${0.08 + alpha * 0.22})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    spawnMeteor(now);
    if (meteors.length) drawMeteors();
  }

  function loop(now) {
    if (!running) return;
    if (now - lastFrame >= FRAME_MS) {
      lastFrame = now;
      draw(now);
    }
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    lastFrame = 0;
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  resize();
  seed();
  start();

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const nextLength = window.matchMedia('(max-width: 980px)').matches ? 28 : 48;
      resize();
      if (nextLength !== config.length) {
        config.length = nextLength;
        seed();
      }
    }, 150);
  }, { passive: true });

  if (finePointer) {
    window.addEventListener('pointermove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      window.clearTimeout(mouseIdleTimer);
      mouseIdleTimer = window.setTimeout(() => {
        mouse.active = false;
      }, 1200);
    }, { passive: true });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
  }, true);
})();
