/**
 * Formation Universe LTD — Hero 3D Central Globe & 8 Orbiting Service Cards
 * - Semi-cartoon styled continuous rotating 3D Earth globe in exact center
 * - Eight individual 3D floating service cards revolving around the globe
 * - Natural 3D depth, front/back occlusion, and clickable routing
 * - Full responsive desktop/tablet/mobile scaling
 */

(function initHeroUniverse() {
  const stage = document.getElementById('hero-universe-stage');
  if (!stage) return;

  // 1. Service Cards Configuration (Exact names & existing website routes)
  const SERVICES = [
    {
      name: 'UK Company Formation',
      shortName: 'UK Formation',
      url: 'uk-company-formation.html',
      icon: `<svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`
    },
    {
      name: 'USA Company Formation',
      shortName: 'USA Formation',
      url: 'usa-llc-formation.html',
      icon: `<svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/></svg>`
    },
    {
      name: 'UK ID Verification',
      shortName: 'UK ID Verify',
      url: 'compliance.html',
      icon: `<svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`
    },
    {
      name: 'USA Annual Tax Filing',
      shortName: 'USA Tax Filing',
      url: 'usa-llc-formation.html#ein-service',
      icon: `<svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"/></svg>`
    },
    {
      name: 'UK Confirmation Statement',
      shortName: 'Confirmation Stmt',
      url: 'compliance.html#confirmation-statement',
      icon: `<svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`
    },
    {
      name: 'Business Bank Accounts (PayPal, Wise, Payoneer)',
      shortName: 'Bank Accounts',
      url: 'banking-payment-solutions.html',
      icon: `<svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>`
    },
    {
      name: 'Web & Software Development',
      shortName: 'Web & Software',
      url: 'web-development-ai.html',
      icon: `<svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`
    },
    {
      name: 'AI Automation',
      shortName: 'AI Automation',
      url: 'web-development-ai.html#ai-agents',
      icon: `<svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`
    }
  ];

  // 2. Setup Elements inside Stage
  stage.innerHTML = '';
  stage.style.position = 'relative';
  stage.style.userSelect = 'none';

  // Ground shadow underneath central globe
  const globeShadow = document.createElement('div');
  globeShadow.className = 'hero-globe-shadow';
  stage.appendChild(globeShadow);

  // Central 3D Canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'hero-globe-canvas';
  canvas.className = 'hero-globe-canvas';
  stage.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Orbiting DOM Cards
  const cardElements = SERVICES.map((service, index) => {
    const card = document.createElement('a');
    card.href = service.url;
    card.className = 'hero-orbit-card';
    card.setAttribute('data-index', index);
    card.setAttribute('aria-label', service.name);
    card.title = service.name;

    card.innerHTML = `
      <div class="hero-orbit-icon-wrap">
        ${service.icon}
      </div>
      <div class="hero-orbit-content">
        <span class="hero-orbit-title desktop-title">${service.name}</span>
        <span class="hero-orbit-title mobile-title">${service.shortName}</span>
      </div>
    `;

    stage.appendChild(card);
    return card;
  });

  // 3. State & Sizing
  let stageW = stage.clientWidth || 900;
  let stageH = stage.clientHeight || 500;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let globeRadius = 92;
  let orbitRadiusX = 350;
  let orbitRadiusY = 110;
  let orbitAngle = 0;
  let globeRotationY = 0;
  let targetSpeed = 0.0022; // Smooth gentle cruising speed
  let currentSpeed = 0.0022;
  let isHovered = false;

  // Responsive geometry calculations
  function updateDimensions() {
    stageW = stage.clientWidth;
    const isMobile = stageW < 640;
    const isTablet = stageW >= 640 && stageW < 1024;

    if (isMobile) {
      stageH = 340;
      stage.style.height = '340px';
      globeRadius = 42;
      // Fits safely within 360px-390px mobile screens without overflow
      orbitRadiusX = Math.min(stageW * 0.35, 122);
      orbitRadiusY = 50;
    } else if (isTablet) {
      stageH = 430;
      stage.style.height = '430px';
      globeRadius = 70;
      orbitRadiusX = Math.min(stageW * 0.38, 240);
      orbitRadiusY = 82;
    } else {
      stageH = 480;
      stage.style.height = '480px';
      globeRadius = 92;
      orbitRadiusX = Math.min(stageW * 0.39, 360);
      orbitRadiusY = 112;
    }

    // Set canvas dimensions
    const canvasDiameter = Math.ceil((globeRadius * 2 + 50) * dpr);
    canvas.width = canvasDiameter;
    canvas.height = canvasDiameter;
    canvas.style.width = `${globeRadius * 2 + 50}px`;
    canvas.style.height = `${globeRadius * 2 + 50}px`;

    // Center canvas in stage
    canvas.style.position = 'absolute';
    canvas.style.left = '50%';
    canvas.style.top = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
    canvas.style.zIndex = '20';

    // Position globe ground shadow
    globeShadow.style.position = 'absolute';
    globeShadow.style.left = '50%';
    globeShadow.style.top = `calc(50% + ${globeRadius * 0.90}px)`;
    globeShadow.style.transform = 'translate(-50%, -50%)';
    globeShadow.style.width = `${globeRadius * 1.55}px`;
    globeShadow.style.height = `${globeRadius * 0.40}px`;
    globeShadow.style.zIndex = '15';
  }

  window.addEventListener('resize', () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    updateDimensions();
  });
  updateDimensions();

  // 4. Hover Interactions (Gently slow down orbit on hover for easy clicking)
  stage.addEventListener('mouseenter', () => {
    isHovered = true;
    targetSpeed = 0.0003;
  });

  stage.addEventListener('mouseleave', () => {
    isHovered = false;
    targetSpeed = 0.0022;
  });

  // Touch support for mobile
  stage.addEventListener('touchstart', () => {
    targetSpeed = 0.0003;
  }, { passive: true });

  stage.addEventListener('touchend', () => {
    setTimeout(() => { targetSpeed = 0.0022; }, 1200);
  });

  // 5. Stylized Semi-Cartoon Continents (Spherical Coordinates in Degrees [lat, lon])
  const CONTINENTS = [
    // North America
    [
      [70, -160], [72, -130], [60, -125], [50, -125], [38, -122], [30, -115],
      [22, -105], [16, -92], [14, -85], [9, -80], [10, -75], [18, -88],
      [25, -80], [30, -82], [35, -75], [42, -70], [48, -65], [52, -55],
      [58, -62], [62, -75], [68, -85], [74, -95], [72, -120], [70, -160]
    ],
    // Greenland
    [
      [60, -45], [65, -52], [75, -58], [82, -40], [80, -20], [70, -22],
      [64, -36], [60, -45]
    ],
    // South America
    [
      [12, -72], [8, -60], [4, -50], [-2, -44], [-6, -35], [-12, -37],
      [-22, -41], [-32, -52], [-42, -64], [-54, -68], [-52, -74], [-40, -73],
      [-28, -71], [-18, -75], [-6, -80], [2, -78], [10, -75], [12, -72]
    ],
    // Europe & British Isles
    [
      [36, -6], [43, -9], [48, -4], [52, 2], [54, 8], [58, 6],
      [62, 5], [70, 20], [71, 28], [68, 30], [60, 28], [55, 22],
      [50, 15], [45, 14], [40, 18], [38, 24], [36, 28], [36, -6]
    ],
    // UK & Ireland (Prominent British Isles)
    [
      [50, -5], [54, -3], [58, -4], [58, -2], [54, 0], [51, 1], [50, -5]
    ],
    // Africa
    [
      [36, -6], [36, 12], [32, 25], [31, 32], [22, 38], [12, 44],
      [11, 51], [4, 48], [-4, 40], [-12, 40], [-24, 32], [-34, 26],
      [-34, 18], [-26, 14], [-16, 12], [-6, 12], [4, 9], [6, 2],
      [5, -2], [4, -8], [12, -16], [22, -17], [32, -10], [36, -6]
    ],
    // Madagascar
    [
      [-12, 49], [-16, 50], [-25, 47], [-25, 43], [-18, 44], [-12, 49]
    ],
    // Asia
    [
      [36, 36], [42, 36], [42, 46], [40, 50], [30, 48], [24, 58],
      [22, 68], [10, 76], [8, 78], [14, 82], [22, 88], [22, 92],
      [14, 100], [8, 102], [2, 104], [6, 108], [14, 108], [22, 114],
      [30, 122], [38, 120], [42, 130], [50, 140], [60, 160], [68, 175],
      [72, 150], [74, 110], [74, 75], [68, 60], [58, 52], [50, 48],
      [44, 44], [38, 42], [36, 36]
    ],
    // Japan
    [
      [31, 131], [35, 136], [40, 140], [45, 142], [43, 144], [35, 140], [31, 131]
    ],
    // Australia
    [
      [-12, 132], [-14, 136], [-12, 142], [-18, 146], [-28, 153], [-34, 151],
      [-38, 145], [-37, 138], [-32, 132], [-34, 122], [-32, 116], [-22, 114],
      [-16, 122], [-12, 132]
    ],
    // New Zealand
    [
      [-35, 174], [-40, 176], [-46, 168], [-44, 168], [-38, 175], [-35, 174]
    ],
    // Antarctica (Ice cap at bottom)
    [
      [-65, -180], [-66, -120], [-64, -60], [-68, 0], [-65, 60], [-66, 120],
      [-65, 180], [-90, 180], [-90, -180], [-65, -180]
    ]
  ];

  // Stylized Semi-Cartoon Clouds drifting across the globe
  const CLOUDS = [
    { lat: 24, lon: -140, r: 0.16 },
    { lat: 15, lon: -40, r: 0.18 },
    { lat: -20, lon: 85, r: 0.15 },
    { lat: 48, lon: 160, r: 0.20 }
  ];

  // 6. 3D Spherical Projection Function
  const AXIAL_TILT = 0.22; // ~12.6 degrees tilt
  function projectPoint(latDeg, lonDeg, rotY, R) {
    const lat = (latDeg * Math.PI) / 180;
    const lon = (lonDeg * Math.PI) / 180;

    const x0 = R * Math.cos(lat) * Math.sin(lon + rotY);
    const y0 = -R * Math.sin(lat);
    const z0 = R * Math.cos(lat) * Math.cos(lon + rotY);

    const x = x0;
    const y = y0 * Math.cos(AXIAL_TILT) - z0 * Math.sin(AXIAL_TILT);
    const z = y0 * Math.sin(AXIAL_TILT) + z0 * Math.cos(AXIAL_TILT);

    return { x, y, z };
  }

  // 7. Render 3D Semi-Cartoon Earth Globe on Canvas
  function drawGlobe() {
    const cw = canvas.width;
    const ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);

    const cx = cw / 2;
    const cy = ch / 2;
    const R = globeRadius * dpr;

    ctx.save();

    // Subtle atmospheric outer halo
    const haloGrad = ctx.createRadialGradient(cx, cy, R * 0.95, cx, cy, R * 1.15);
    haloGrad.addColorStop(0, 'rgba(0, 168, 68, 0.16)');
    haloGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.06)');
    haloGrad.addColorStop(1, 'rgba(0, 168, 68, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2);
    ctx.fill();

    // Clip to globe circle for all internal sphere rendering
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();

    // A. Base Ocean (Smooth sky-marine blue gradient with soft cel-lighting)
    const oceanGrad = ctx.createRadialGradient(
      cx - R * 0.32,
      cy - R * 0.32,
      R * 0.05,
      cx,
      cy,
      R
    );
    oceanGrad.addColorStop(0, '#42a5f5');
    oceanGrad.addColorStop(0.45, '#1e88e5');
    oceanGrad.addColorStop(0.82, '#1565c0');
    oceanGrad.addColorStop(1, '#0d47a1');

    ctx.fillStyle = oceanGrad;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

    // B. Continents Drawing
    ctx.strokeStyle = 'rgba(0, 110, 45, 0.45)';
    ctx.lineWidth = 1.2 * dpr;
    ctx.lineJoin = 'round';

    CONTINENTS.forEach((poly) => {
      let isAntarctica = poly[0][0] <= -65;
      let hasVisible = false;
      const pts = [];

      for (let i = 0; i < poly.length; i++) {
        const pt = projectPoint(poly[i][0], poly[i][1], globeRotationY, R);
        pts.push(pt);
        if (pt.z > -R * 0.1) hasVisible = true;
      }

      if (!hasVisible) return;

      ctx.beginPath();
      let started = false;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (p.z > 0) {
          if (!started) {
            ctx.moveTo(cx + p.x, cy + p.y);
            started = true;
          } else {
            ctx.lineTo(cx + p.x, cy + p.y);
          }
        }
      }

      if (started) {
        ctx.closePath();
        if (isAntarctica || poly[0][0] >= 75) {
          ctx.fillStyle = '#f8fafc';
        } else {
          ctx.fillStyle = '#00a844'; // Formation Universe Emerald
        }
        ctx.fill();
        ctx.stroke();
      }
    });

    // C. Soft Cartoon Clouds Drifting across the Globe
    CLOUDS.forEach((c) => {
      const p = projectPoint(c.lat, c.lon, globeRotationY * 1.15, R);
      if (p.z > R * 0.1) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
        ctx.beginPath();
        const cr = R * c.r;
        ctx.arc(cx + p.x, cy + p.y, cr, 0, Math.PI * 2);
        ctx.arc(cx + p.x + cr * 0.7, cy + p.y - cr * 0.2, cr * 0.75, 0, Math.PI * 2);
        ctx.arc(cx + p.x - cr * 0.6, cy + p.y + cr * 0.1, cr * 0.65, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    // D. Soft 3D Cel-Shading Overlay on Sphere (Shadow on bottom-right)
    const shadowGrad = ctx.createRadialGradient(
      cx - R * 0.28,
      cy - R * 0.28,
      R * 0.35,
      cx + R * 0.2,
      cy + R * 0.2,
      R
    );
    shadowGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    shadowGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.04)');
    shadowGrad.addColorStop(0.88, 'rgba(5, 25, 15, 0.26)');
    shadowGrad.addColorStop(1, 'rgba(5, 25, 15, 0.52)');

    ctx.fillStyle = shadowGrad;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

    // E. Semi-Cartoon Glossy Specular Highlight (The friendly bubble shine at upper-left)
    ctx.save();
    ctx.translate(cx - R * 0.38, cy - R * 0.38);
    ctx.rotate(-Math.PI / 4);

    const glossGrad = ctx.createLinearGradient(0, -R * 0.2, 0, R * 0.2);
    glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
    glossGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = glossGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 0.35, R * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // F. Inner Atmosphere Rim Glow
    const rimGrad = ctx.createRadialGradient(cx, cy, R * 0.88, cx, cy, R);
    rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    rimGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.12)');
    rimGrad.addColorStop(1, 'rgba(16, 185, 129, 0.40)');

    ctx.fillStyle = rimGrad;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

    ctx.restore();
  }

  // 8. Update 8 Orbiting Service Cards Positions & 3D Layering
  function updateCards() {
    const cx = stageW / 2;
    const cy = stageH / 2;
    const isMobile = stageW < 640;

    SERVICES.forEach((_, index) => {
      const card = cardElements[index];
      // 8 cards arranged equally around 360 degrees (45 deg = PI/4)
      const baseAngle = index * (Math.PI / 4);
      const angle = orbitAngle + baseAngle;

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      const x = cx + orbitRadiusX * cosA;
      const y = cy + orbitRadiusY * sinA;
      const z = sinA; // -1 (back behind globe) to +1 (front in front of globe)

      const cardW = card.offsetWidth || (isMobile ? 120 : 180);
      const cardH = card.offsetHeight || (isMobile ? 32 : 44);

      const posX = Math.round(x - cardW / 2);
      const posY = Math.round(y - cardH / 2);

      let scale, opacity, zIndex;

      if (z >= -0.05) {
        // Front half of orbit (z-index 30, in front of globe canvas z-index 20)
        zIndex = 30;
        scale = 1.0 + 0.08 * z;
        opacity = 1.0;
        card.classList.remove('orbit-card-back');
        card.classList.add('orbit-card-front');
      } else {
        // Back half of orbit (z-index 10, behind globe canvas z-index 20)
        zIndex = 10;
        scale = 1.0 + 0.15 * z; // down to 0.85
        opacity = 0.80 + 0.20 * (z + 1); // down to 0.80
        card.classList.remove('orbit-card-front');
        card.classList.add('orbit-card-back');
      }

      card.style.transform = `translate3d(${posX}px, ${posY}px, 0) scale(${scale.toFixed(3)})`;
      card.style.opacity = opacity.toFixed(2);
      card.style.zIndex = zIndex;
    });
  }

  // 9. Animation Loop (Smooth 60FPS)
  function animate() {
    currentSpeed += (targetSpeed - currentSpeed) * 0.08;

    orbitAngle += currentSpeed;
    if (orbitAngle > Math.PI * 2) orbitAngle -= Math.PI * 2;

    globeRotationY += 0.0035;
    if (globeRotationY > Math.PI * 2) globeRotationY -= Math.PI * 2;

    drawGlobe();
    updateCards();

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
