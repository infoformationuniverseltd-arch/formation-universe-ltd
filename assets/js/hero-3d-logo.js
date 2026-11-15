/**
 * Formation Universe LTD — Premium 3D Logo Presentation
 * Features a dimensional 3D brand sculpture of the official Formation Universe logo:
 * - 3D Beveled FU Monogram (Satin obsidian 'F' + Metallic emerald 'U')
 * - 3D Dimensional Globe nestled inside the U
 * - 3D Emerald Orbital Swoosh looping around the emblem in real depth
 * - 4-Point Emerald Sparkle Star at apex
 * - Interactive mouse tilt & gentle floating levitation
 */

(function init3DLogoSculpture() {
  const container = document.getElementById('hero-3d-logo-container');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'hero-3d-canvas';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  canvas.style.cursor = 'grab';
  container.innerHTML = '';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width, height, dpr;
  let mouseX = 0, mouseY = 0;
  let targetRotX = 0.05, targetRotY = 0;
  let currentRotX = 0.05, currentRotY = 0;
  let isHovered = false;
  let tick = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resize);
  resize();

  // Mouse interaction for 3D tilt
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    targetRotY = x * 0.45;
    targetRotX = -y * 0.35 + 0.05;
    isHovered = true;
  });

  container.addEventListener('mouseleave', () => {
    targetRotY = 0;
    targetRotX = 0.05;
    isHovered = false;
  });

  // Touch support for mobile 3D tilt
  container.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = container.getBoundingClientRect();
      const x = (e.touches[0].clientX - rect.left) / width - 0.5;
      const y = (e.touches[0].clientY - rect.top) / height - 0.5;
      targetRotY = x * 0.35;
      targetRotX = -y * 0.25 + 0.05;
    }
  }, { passive: true });

  container.addEventListener('touchend', () => {
    targetRotY = 0;
    targetRotX = 0.05;
  });

  // Orbital ring 3D points
  const ringPoints = [];
  const numRingPts = 90;
  for (let i = 0; i < numRingPts; i++) {
    const angle = (i / numRingPts) * Math.PI * 2;
    ringPoints.push({
      x: Math.cos(angle) * 170,
      y: Math.sin(angle) * 38,
      z: Math.sin(angle) * 140
    });
  }

  // Pre-load official logo image as high-res reference / texture
  const logoImg = new Image();
  logoImg.src = 'assets/images/logo.jpg';
  let logoLoaded = false;
  logoImg.onload = () => { logoLoaded = true; };

  function render() {
    tick += 0.02;

    // Smooth lerp to target rotation
    currentRotX += (targetRotX - currentRotX) * 0.08;
    currentRotY += (targetRotY - currentRotY) * 0.08;

    // Gentle hovering floating motion
    const floatY = Math.sin(tick * 1.4) * 8;
    const floatRot = Math.sin(tick * 0.8) * 0.03;

    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + floatY;
    const scale = Math.min(width / 460, height / 440, 1.15);

    ctx.save();
    ctx.translate(cx, cy);

    // 1. Draw 3D Base Shadow on the plinth
    ctx.save();
    ctx.translate(0, 160 * scale);
    ctx.scale(1, 0.28);
    const shadowGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 170 * scale);
    shadowGrad.addColorStop(0, 'rgba(30, 20, 10, 0.25)');
    shadowGrad.addColorStop(0.5, 'rgba(0, 168, 68, 0.12)');
    shadowGrad.addColorStop(1, 'rgba(247, 239, 228, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 170 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. 3D Glass Pedestal Backdrop
    ctx.save();
    const pedestalW = 320 * scale;
    const pedestalH = 340 * scale;
    const tiltX = currentRotX + floatRot;
    const tiltY = currentRotY;

    // Perspective transform
    ctx.transform(
      Math.cos(tiltY),
      Math.sin(tiltX) * 0.3,
      -Math.sin(tiltY) * 0.2,
      Math.cos(tiltX),
      0, 0
    );

    // Frosted luxury plinth card
    const cardGrad = ctx.createLinearGradient(-pedestalW/2, -pedestalH/2, pedestalW/2, pedestalH/2);
    cardGrad.addColorStop(0, '#ffffff');
    cardGrad.addColorStop(0.6, '#fbf6ee');
    cardGrad.addColorStop(1, '#f4e6d3');

    ctx.fillStyle = cardGrad;
    ctx.strokeStyle = '#e2d0ba';
    ctx.lineWidth = 2 * scale;
    ctx.shadowColor = 'rgba(120, 90, 60, 0.18)';
    ctx.shadowBlur = 28 * scale;
    ctx.shadowOffsetY = 12 * scale;

    roundRect(ctx, -pedestalW/2, -pedestalH/2, pedestalW, pedestalH, 24 * scale);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.stroke();

    // Subtle inner glowing border
    ctx.strokeStyle = 'rgba(0, 168, 68, 0.35)';
    ctx.lineWidth = 1 * scale;
    roundRect(ctx, -pedestalW/2 + 6*scale, -pedestalH/2 + 6*scale, pedestalW - 12*scale, pedestalH - 12*scale, 20 * scale);
    ctx.stroke();

    // 3. Draw Back Half of 3D Orbital Swoosh
    drawOrbitalRing(ctx, scale, tiltX, tiltY, true);

    // 4. Draw Official 3D Dimensional FU Monogram / Emblem
    if (logoLoaded) {
      const emblemSize = 250 * scale;
      
      // Multi-layer extrusion for realistic 3D depth
      const depthLayers = 8;
      for (let d = depthLayers; d >= 1; d--) {
        const offX = Math.sin(tiltY) * d * 2.2 * scale;
        const offY = -Math.sin(tiltX) * d * 2.2 * scale + d * 0.8 * scale;
        const depthAlpha = (1 - (d / depthLayers)) * 0.25 + 0.1;

        ctx.save();
        ctx.translate(offX, offY);
        ctx.filter = `brightness(40%) opacity(${depthAlpha})`;
        ctx.drawImage(logoImg, -emblemSize/2, -emblemSize/2 - 10*scale, emblemSize, emblemSize);
        ctx.restore();
      }

      // Front Face with Specular Reflection
      ctx.save();
      ctx.shadowColor = 'rgba(0, 168, 68, 0.35)';
      ctx.shadowBlur = 18 * scale;
      ctx.shadowOffsetY = 6 * scale;
      ctx.drawImage(logoImg, -emblemSize/2, -emblemSize/2 - 10*scale, emblemSize, emblemSize);
      ctx.restore();

      // Gleam overlay across emblem
      const gleamPos = ((tick * 0.6) % 3) - 1.5;
      const gleamGrad = ctx.createLinearGradient(
        -emblemSize/2 + gleamPos * emblemSize,
        -emblemSize/2,
        -emblemSize/2 + (gleamPos + 0.3) * emblemSize,
        emblemSize/2
      );
      gleamGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gleamGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.32)');
      gleamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.save();
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = gleamGrad;
      ctx.fillRect(-emblemSize/2, -emblemSize/2 - 10*scale, emblemSize, emblemSize);
      ctx.restore();
    }

    // 5. Draw Front Half of 3D Orbital Swoosh
    drawOrbitalRing(ctx, scale, tiltX, tiltY, false);

    // 6. Draw 4-point Sparkle Star (Logo Motif) with Pulsing Glow
    const starAngle = (tick * 0.7) % (Math.PI * 2);
    const starX = Math.cos(starAngle) * 135 * scale;
    const starY = Math.sin(starAngle) * 32 * scale - 50 * scale;
    drawSparkleStar(ctx, starX, starY, 9 * scale, '#00c853', '#34d399');

    ctx.restore(); // end pedestal
    ctx.restore(); // end main center

    requestAnimationFrame(render);
  }

  // Draw 3D Orbital Swoosh Loop
  function drawOrbitalRing(ctx, scale, rotX, rotY, isBack) {
    ctx.save();
    ctx.lineWidth = 3.5 * scale;

    for (let i = 0; i < ringPoints.length - 1; i++) {
      const p1 = ringPoints[i];
      const p2 = ringPoints[i + 1];

      // 3D rotation
      const cosY = Math.cos(rotY + 0.3), sinY = Math.sin(rotY + 0.3);
      const cosX = Math.cos(rotX - 0.25), sinX = Math.sin(rotX - 0.25);

      const z1 = p1.z * cosX - p1.y * sinX;
      const z2 = p2.z * cosX - p2.y * sinX;

      const avgZ = (z1 + z2) / 2;
      if (isBack && avgZ > 0) continue;
      if (!isBack && avgZ <= 0) continue;

      const x1 = (p1.x * cosY - p1.z * sinY) * scale;
      const y1 = (p1.y * cosX + p1.z * sinX) * scale - 10 * scale;
      const x2 = (p2.x * cosY - p2.z * sinY) * scale;
      const y2 = (p2.y * cosX + p2.z * sinX) * scale - 10 * scale;

      const progress = i / ringPoints.length;
      const alpha = Math.sin(progress * Math.PI);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(0, 168, 68, ${alpha * 0.9 + 0.15})`;
      ctx.shadowColor = '#00c853';
      ctx.shadowBlur = isBack ? 2 : 10 * scale;
      ctx.stroke();
    }
    ctx.restore();
  }

  // Draw 4-point Sparkle Star
  function drawSparkleStar(ctx, cx, cy, size, color, glow) {
    ctx.save();
    ctx.shadowColor = glow;
    ctx.shadowBlur = 16;
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(cx, cy - size * 2.2);
    ctx.quadraticCurveTo(cx, cy, cx + size * 2.2, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy + size * 2.2);
    ctx.quadraticCurveTo(cx, cy, cx - size * 2.2, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy - size * 2.2);
    ctx.closePath();
    ctx.fill();

    // Inner bright core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  render();
})();
