/**
 * Formation Universe LTD — 3D Dimensional Globe & Orbital Ring
 * Inspired by the FU brand logo: Dimensional Globe, Emerald Orbital Swoosh, Sparkle Nodes.
 * Uses lightweight HTML5 Canvas WebGL / 2D rendering with high performance and zero external bundle lock.
 */

(function initHero3D() {
  const container = document.getElementById('hero-canvas-container');
  if (!container) return;

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width, height, dpr;
  let rotationY = 0;
  let rotationX = 0.28; // tilted perspective
  let mouseX = 0, mouseY = 0;
  let targetRotationY = 0;
  let targetRotationX = 0.28;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resize);
  resize();

  // Mouse interaction
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    targetRotationY = x * 0.8;
    targetRotationX = 0.28 + y * 0.4;
  });

  container.addEventListener('mouseleave', () => {
    targetRotationY = 0;
    targetRotationX = 0.28;
  });

  // Generate globe points (Fibonacci Sphere for smooth distribution)
  const numPoints = 280;
  const globePoints = [];
  const globeRadius = Math.min(width, height) * 0.27;

  for (let i = 0; i < numPoints; i++) {
    const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;

    globePoints.push({
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.cos(phi),
      z: Math.sin(phi) * Math.sin(theta),
      isEmerald: Math.random() > 0.65,
      size: Math.random() * 2 + 1.2
    });
  }

  // Generate Orbital Ring points
  const ringPoints = [];
  const numRingPoints = 120;
  const ringRadiusX = globeRadius * 1.55;
  const ringRadiusZ = globeRadius * 1.55;

  for (let i = 0; i < numRingPoints; i++) {
    const angle = (i / numRingPoints) * Math.PI * 2;
    ringPoints.push({
      x: Math.cos(angle) * ringRadiusX,
      y: Math.sin(angle) * 12, // slight wave
      z: Math.sin(angle) * ringRadiusZ
    });
  }

  // Floating sparkle nodes
  const sparkleStars = [
    { angle: 0.8, dist: 1.45, speed: 0.005, size: 7 },
    { angle: 2.4, dist: 1.6, speed: -0.003, size: 5 },
    { angle: 4.2, dist: 1.5, speed: 0.004, size: 6 }
  ];

  let frameId;
  let tick = 0;

  function render() {
    tick += 0.016;

    if (!prefersReducedMotion) {
      rotationY += 0.004;
      rotationY += (targetRotationY - (rotationY % (Math.PI * 2))) * 0.05;
      rotationX += (targetRotationX - rotationX) * 0.05;
    }

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // Background radial ambient glow
    const bgGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, globeRadius * 1.8);
    bgGrad.addColorStop(0, 'rgba(0, 200, 83, 0.14)');
    bgGrad.addColorStop(0.5, 'rgba(0, 200, 83, 0.04)');
    bgGrad.addColorStop(1, 'rgba(10, 14, 12, 0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Inner core globe shadow circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, globeRadius * 0.96, 0, Math.PI * 2);
    const coreGrad = ctx.createRadialGradient(centerX - 30, centerY - 30, 20, centerX, centerY, globeRadius);
    coreGrad.addColorStop(0, '#15241d');
    coreGrad.addColorStop(0.7, '#0d1612');
    coreGrad.addColorStop(1, '#080d0a');
    ctx.fillStyle = coreGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 200, 83, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Project 3D Point to 2D
    function project(x, y, z, rotX, rotY) {
      // Rotate around Y
      let cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      let x1 = x * cosY - z * sinY;
      let z1 = z * cosY + x * sinY;

      // Rotate around X (inclination)
      let cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      let y2 = y * cosX - z1 * sinX;
      let z2 = z1 * cosX + y * sinX;

      // Perspective projection
      const cameraDist = 800;
      const scale = cameraDist / (cameraDist + z2);
      return {
        px: centerX + x1 * scale,
        py: centerY + y2 * scale,
        depth: z2,
        scale: scale
      };
    }

    // 1. Draw back half of orbital ring
    drawRing(true);

    // 2. Draw globe nodes
    const projectedPoints = globePoints.map(p => {
      const proj = project(p.x * globeRadius, p.y * globeRadius, p.z * globeRadius, rotationX, rotationY);
      return { ...p, ...proj };
    });

    // Sort by depth (back to front)
    projectedPoints.sort((a, b) => b.depth - a.depth);

    projectedPoints.forEach(p => {
      if (p.depth > globeRadius * 0.95) return; // behind horizon

      const alpha = Math.max(0.15, (globeRadius - p.depth) / (globeRadius * 2));
      ctx.beginPath();
      ctx.arc(p.px, p.py, p.size * p.scale, 0, Math.PI * 2);

      if (p.isEmerald) {
        ctx.fillStyle = `rgba(0, 200, 83, ${alpha * 0.95})`;
        ctx.shadowColor = '#00c853';
        ctx.shadowBlur = 8;
      } else {
        ctx.fillStyle = `rgba(240, 245, 242, ${alpha * 0.6})`;
        ctx.shadowBlur = 0;
      }
      ctx.fill();
    });
    ctx.shadowBlur = 0; // reset

    // 3. Draw front half of orbital ring (green swoosh)
    drawRing(false);

    // 4. Sparkle Star (Logo Icon Motif)
    sparkleStars.forEach((star, index) => {
      star.angle += star.speed;
      const sx = Math.cos(star.angle) * ringRadiusX * star.dist;
      const sy = Math.sin(star.angle) * 35 - 30;
      const sz = Math.sin(star.angle) * ringRadiusZ * star.dist;
      const sp = project(sx, sy, sz, rotationX, rotationY * 0.8);

      if (sp.depth < 100) {
        drawStarShape(ctx, sp.px, sp.py, star.size * sp.scale, '#00c853', '#34d399');
      }
    });

    // Helper: Draw orbital ring with gradient swoosh
    function drawRing(isBack) {
      ctx.save();
      ctx.lineWidth = 3.5;

      for (let i = 0; i < ringPoints.length - 1; i++) {
        const ptA = project(ringPoints[i].x, ringPoints[i].y, ringPoints[i].z, rotationX + 0.35, rotationY * 0.3);
        const ptB = project(ringPoints[i+1].x, ringPoints[i+1].y, ringPoints[i+1].z, rotationX + 0.35, rotationY * 0.3);

        const avgDepth = (ptA.depth + ptB.depth) / 2;
        if (isBack && avgDepth < 0) continue;
        if (!isBack && avgDepth >= 0) continue;

        const progress = i / ringPoints.length;
        const swooshAlpha = Math.sin(progress * Math.PI);

        ctx.beginPath();
        ctx.moveTo(ptA.px, ptA.py);
        ctx.lineTo(ptB.px, ptB.py);

        ctx.strokeStyle = `rgba(0, 200, 83, ${swooshAlpha * 0.85 + 0.1})`;
        ctx.shadowColor = '#00c853';
        ctx.shadowBlur = isBack ? 4 : 12;
        ctx.stroke();
      }
      ctx.restore();
    }

    if (!prefersReducedMotion) {
      frameId = requestAnimationFrame(render);
    }
  }

  // Draw 4-point sparkle star matching the Formation Universe logo
  function drawStarShape(ctx, cx, cy, size, color, glowColor) {
    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 16;
    ctx.fillStyle = color;

    ctx.beginPath();
    // 4-point star path
    ctx.moveTo(cx, cy - size * 2.2);
    ctx.quadraticCurveTo(cx, cy, cx + size * 2.2, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy + size * 2.2);
    ctx.quadraticCurveTo(cx, cy, cx - size * 2.2, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy - size * 2.2);
    ctx.closePath();
    ctx.fill();

    // Inner bright diamond
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  render();
})();
