/**
 * 3D Lanyard & ID Card Physics Simulation
 * Built for Akbar Barokah's Portfolio
 * Powered by Three.js & Verlet Physics
 */

(function () {
  const container = document.getElementById('lanyard-container');
  if (!container) return;

  // Check if THREE is loaded
  if (typeof THREE === 'undefined') {
    console.warn('Three.js is not loaded. Lanyard 3D cannot initialize.');
    return;
  }

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    38,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 7.8);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.id = 'lanyard-canvas';
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight1.position.set(5, 8, 6);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x6c63ff, 1.5);
  dirLight2.position.set(-6, -2, 4);
  scene.add(dirLight2);

  const cyanLight = new THREE.PointLight(0x00e5ff, 2, 12);
  cyanLight.position.set(0, 1, 3);
  scene.add(cyanLight);

  // --- PROCEDURAL TEXTURES ---

  // 1. Lanyard Strap Texture (Woven ribbon with text)
  function createStrapTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Dark woven base
    ctx.fillStyle = '#0a0d18';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle fabric weave texture
    ctx.fillStyle = '#151b2e';
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.fillRect(0, y, canvas.width, 2);
    }

    // Border glowing neon stripes
    ctx.fillStyle = '#6c63ff';
    ctx.fillRect(0, 0, 4, canvas.height);
    ctx.fillRect(canvas.width - 4, 0, 4, canvas.height);

    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(6, 0, 2, canvas.height);
    ctx.fillRect(canvas.width - 8, 0, 2, canvas.height);

    // Repeated Text: "POLITEKNIK IDN • AKBAR BAROKAH • 3D CARD"
    ctx.save();
    ctx.translate(canvas.width / 2, 0);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#6c63ff';
    ctx.shadowBlur = 8;

    const text = 'POLITEKNIK IDN  ✦  AKBAR BAROKAH  ✦  3D CARD  ✦  ';
    for (let x = -200; x < canvas.height + 600; x += 540) {
      ctx.fillText(text, x, 0);
    }
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 2);
    return texture;
  }

  // 2. ID Card Front Texture (Focused Clean on User's Photo)
  let cardFrontTex;
  function createCardFrontTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');

    function drawCard(loadedImg) {
      // Base dark card background
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Card outer frame with rounded corners
      const pad = 24;
      const cardW = canvas.width - pad * 2; // 976
      const cardH = canvas.height - pad * 2; // 1392
      const radius = 36;

      ctx.save();
      // Clip everything to the rounded card shape
      ctx.beginPath();
      ctx.roundRect(pad, pad, cardW, cardH, radius);
      ctx.clip();

      if (loadedImg && loadedImg.complete && loadedImg.naturalWidth !== 0) {
        // FULL CARD PHOTO COVER
        const imgW = loadedImg.naturalWidth;
        const imgH = loadedImg.naturalHeight;
        let sWidth = imgW;
        let sHeight = imgW * (cardH / cardW);
        let sx = 0;
        let sy = 0;

        if (sHeight > imgH) {
          sHeight = imgH;
          sWidth = imgH * (cardW / cardH);
          sx = (imgW - sWidth) / 2;
        } else {
          // Center crop slightly focused on head & blazer
          sy = Math.max(0, (imgH - sHeight) * 0.08);
        }

        ctx.drawImage(loadedImg, sx, sy, sWidth, sHeight, pad, pad, cardW, cardH);
      } else {
        // Fallback placeholder
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(pad, pad, cardW, cardH);
        ctx.fillStyle = '#94A3B8';
        ctx.font = 'bold 36px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Akbar Barokah', canvas.width / 2, canvas.height / 2);
      }

      // Smooth dark gradient overlay at the bottom for readability
      const fadeGrad = ctx.createLinearGradient(0, canvas.height - 520, 0, canvas.height - pad);
      fadeGrad.addColorStop(0, 'rgba(6, 9, 19, 0)');
      fadeGrad.addColorStop(0.4, 'rgba(6, 9, 19, 0.6)');
      fadeGrad.addColorStop(0.75, 'rgba(6, 9, 19, 0.92)');
      fadeGrad.addColorStop(1, '#060913');
      ctx.fillStyle = fadeGrad;
      ctx.fillRect(pad, canvas.height - 530, cardW, 530);

      // Subtle cyan/purple glow line across lower card
      const glowBar = ctx.createLinearGradient(pad + 80, 0, canvas.width - pad - 80, 0);
      glowBar.addColorStop(0, 'rgba(108, 99, 255, 0)');
      glowBar.addColorStop(0.5, 'rgba(0, 229, 255, 0.7)');
      glowBar.addColorStop(1, 'rgba(255, 77, 157, 0)');
      ctx.fillStyle = glowBar;
      ctx.fillRect(pad + 80, canvas.height - 210, cardW - 160, 2);

      // ELEGANT CURSIVE SIGNATURE: "Akbar"
      ctx.save();
      ctx.shadowColor = 'rgba(0, 229, 255, 0.85)';
      ctx.shadowBlur = 24;
      ctx.fillStyle = '#ffffff';
      ctx.font = '130px "Alex Brush", "Dancing Script", "Caveat", cursive, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Akbar', canvas.width / 2, canvas.height - 260);

      // Flourish curve under signature
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 130, canvas.height - 200);
      ctx.bezierCurveTo(
        canvas.width / 2 - 50, canvas.height - 185,
        canvas.width / 2 + 50, canvas.height - 215,
        canvas.width / 2 + 140, canvas.height - 195
      );
      ctx.stroke();
      ctx.restore();

      // Full Name
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 40px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(108, 99, 255, 0.6)';
      ctx.shadowBlur = 12;
      ctx.fillText('Akbar Barokah', canvas.width / 2, canvas.height - 140);
      ctx.shadowBlur = 0;

      // Campus info
      ctx.fillStyle = '#00E5FF';
      ctx.font = 'bold 24px "Inter", sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('POLITEKNIK IDN BOGOR', canvas.width / 2, canvas.height - 95);

      // Specialty
      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 18px "Inter", sans-serif';
      ctx.fillText('Web Development & Software Engineering', canvas.width / 2, canvas.height - 60);

      ctx.restore(); // end clip

      // Outer Card Border with subtle glow
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(pad, pad, cardW, cardH, radius);
      ctx.stroke();

      // Top subtle neon accent bar
      const neonTop = ctx.createLinearGradient(pad, 0, canvas.width - pad, 0);
      neonTop.addColorStop(0, '#6C63FF');
      neonTop.addColorStop(0.5, '#00E5FF');
      neonTop.addColorStop(1, '#FF4D9D');
      ctx.fillStyle = neonTop;
      ctx.fillRect(pad + 60, pad, cardW - 120, 6);
      ctx.restore();
    }

    drawCard(null);

    const texture = new THREE.CanvasTexture(canvas);

    // Auto-load photo
    const userImg = new Image();
    userImg.onload = function () {
      drawCard(userImg);
      texture.needsUpdate = true;
    };
    userImg.src = 'assets/images/foto-profil.jpg';

    // Also re-render after fonts load
    if (document.fonts) {
      document.fonts.ready.then(function () {
        if (userImg.complete && userImg.naturalWidth !== 0) {
          drawCard(userImg);
        } else {
          drawCard(null);
        }
        texture.needsUpdate = true;
      });
    }

    return texture;
  }

  // 3. ID Card Back Texture
  function createCardBackTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');

    // Deep Dark Matte finish
    ctx.fillStyle = '#080c16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Black Magnetic Stripe
    ctx.fillStyle = '#020307';
    ctx.fillRect(0, 150, canvas.width, 220);

    // Signature Stripe
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(100, 430, canvas.width - 320, 100);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 28px "Inter", sans-serif';
    ctx.fillText('Authorized Signature - Akbar Barokah', 130, 490);

    // Hologram Seal
    const holoGrad = ctx.createLinearGradient(canvas.width - 200, 430, canvas.width - 100, 530);
    holoGrad.addColorStop(0, '#ff4d9d');
    holoGrad.addColorStop(0.3, '#00e5ff');
    holoGrad.addColorStop(0.7, '#6c63ff');
    holoGrad.addColorStop(1, '#10b981');
    ctx.fillStyle = holoGrad;
    ctx.beginPath();
    ctx.arc(canvas.width - 160, 480, 45, 0, Math.PI * 2);
    ctx.fill();

    // Big Monogram Logo in center
    ctx.fillStyle = 'rgba(108, 99, 255, 0.08)';
    ctx.font = 'bold 320px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AB', canvas.width / 2, 850);

    // Terms text & Contact details
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 22px "Inter", sans-serif';
    ctx.fillText('Mahasiswa Politeknik IDN Bogor • Software Engineering & Web Dev', canvas.width / 2, 1140);
    
    ctx.fillStyle = '#00E5FF';
    ctx.font = '600 20px "Inter", sans-serif';
    ctx.fillText('Email: b4r0k4h2007@gmail.com  •  WA: +62 895-7110-61800', canvas.width / 2, 1185);

    ctx.fillStyle = '#64748B';
    ctx.font = '500 18px "Inter", sans-serif';
    ctx.fillText('Official ID: #AB-2026-IDN • Interactive 3D Web Experience', canvas.width / 2, 1230);

    // Bottom decorative bar
    const neonGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    neonGrad.addColorStop(0, '#6C63FF');
    neonGrad.addColorStop(0.5, '#00E5FF');
    neonGrad.addColorStop(1, '#FF4D9D');
    ctx.fillStyle = neonGrad;
    ctx.fillRect(0, canvas.height - 16, canvas.width, 16);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // --- MESH CREATION ---

  // Card Group
  const cardGroup = new THREE.Group();
  scene.add(cardGroup);

  // Card Dimensions (Realistic standard ID badge aspect ratio)
  const cardWidth = 2.4;
  const cardHeight = 3.38;
  const cardThickness = 0.035;

  // Front & Back materials
  const cardFrontTex = createCardFrontTexture();
  const cardBackTex = createCardBackTexture();

  // Create Card Body with rounded corners or box
  const cardGeo = new THREE.BoxGeometry(cardWidth, cardHeight, cardThickness);
  const cardMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x111625, roughness: 0.4 }), // right
    new THREE.MeshStandardMaterial({ color: 0x111625, roughness: 0.4 }), // left
    new THREE.MeshStandardMaterial({ color: 0x111625, roughness: 0.4 }), // top
    new THREE.MeshStandardMaterial({ color: 0x111625, roughness: 0.4 }), // bottom
    new THREE.MeshStandardMaterial({
      map: cardFrontTex,
      roughness: 0.25,
      metalness: 0.15,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1
    }), // front
    new THREE.MeshStandardMaterial({
      map: cardBackTex,
      roughness: 0.35,
      metalness: 0.1
    }) // back
  ];

  const cardMesh = new THREE.Mesh(cardGeo, cardMaterials);
  cardMesh.castShadow = true;
  cardMesh.receiveShadow = true;
  cardGroup.add(cardMesh);

  // Metallic Clip & Ring
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0xd4d8e2,
    metalness: 0.95,
    roughness: 0.2
  });

  // Top clip bracket on card
  const clipGeo = new THREE.BoxGeometry(0.5, 0.22, 0.08);
  const clipMesh = new THREE.Mesh(clipGeo, metalMat);
  clipMesh.position.set(0, cardHeight / 2 + 0.06, 0);
  cardGroup.add(clipMesh);

  // Keyring loop
  const ringGeo = new THREE.TorusGeometry(0.18, 0.035, 16, 32);
  const ringMesh = new THREE.Mesh(ringGeo, metalMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.set(0, cardHeight / 2 + 0.22, 0);
  cardGroup.add(ringMesh);

  // --- LANYARD STRAP PHYSICS (VERLET CHAIN) ---
  const numJoints = 14;
  const joints = [];
  const strapLength = 3.6;
  const segmentLength = strapLength / (numJoints - 1);
  const anchorY = 3.9;

  // Initialize joint positions hanging down
  for (let i = 0; i < numJoints; i++) {
    const t = i / (numJoints - 1);
    const y = anchorY - (t * strapLength);
    joints.push({
      pos: new THREE.Vector3(0, y, 0),
      oldPos: new THREE.Vector3(0, y, 0)
    });
  }

  // Lanyard Strap Ribbon Geometry
  const strapTex = createStrapTexture();
  const strapWidth = 0.26;

  // We build a ribbon mesh using dynamic buffer geometry
  const ribbonSegments = numJoints - 1;
  const ribbonGeo = new THREE.PlaneGeometry(strapWidth, strapLength, 1, ribbonSegments);
  const strapMat = new THREE.MeshStandardMaterial({
    map: strapTex,
    roughness: 0.6,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  const strapMesh = new THREE.Mesh(ribbonGeo, strapMat);
  scene.add(strapMesh);

  // Update Ribbon Geometry based on joints
  function updateRibbonGeometry() {
    const posAttr = ribbonGeo.attributes.position;
    const normalAttr = ribbonGeo.attributes.normal;

    for (let i = 0; i < numJoints; i++) {
      const p = joints[i].pos;
      const vIndex1 = i * 2;
      const vIndex2 = i * 2 + 1;

      // Ribbon width oriented along camera / normal
      const halfW = strapWidth / 2;
      posAttr.setXYZ(vIndex1, p.x - halfW, p.y, p.z);
      posAttr.setXYZ(vIndex2, p.x + halfW, p.y, p.z);
    }
    posAttr.needsUpdate = true;
    ribbonGeo.computeVertexNormals();
  }

  // --- CARD PHYSICS (Rigid Body with Spring & Inertia) ---
  const cardPhysics = {
    pos: new THREE.Vector3(0, anchorY - strapLength - cardHeight / 2, 0),
    vel: new THREE.Vector3(0, 0, 0),
    rot: new THREE.Euler(0, 0, 0),
    rotVel: new THREE.Euler(0, 0, 0)
  };

  // --- INTERACTION (DRAG & TILT) ---
  let isDragging = false;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const dragIntersection = new THREE.Vector3();
  const dragOffset = new THREE.Vector3();

  function getPointerPos(e) {
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * 2 - 1,
      y: -((clientY - rect.top) / rect.height) * 2 + 1
    };
  }

  function onPointerDown(e) {
    const p = getPointerPos(e);
    pointer.x = p.x;
    pointer.y = p.y;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(cardMesh);

    if (intersects.length > 0) {
      isDragging = true;
      dragPlane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()).negate(), cardGroup.position);
      raycaster.ray.intersectPlane(dragPlane, dragIntersection);
      dragOffset.copy(cardGroup.position).sub(dragIntersection);
      container.style.cursor = 'grabbing';
    }
  }

  function onPointerMove(e) {
    const p = getPointerPos(e);
    pointer.x = p.x;
    pointer.y = p.y;

    // Point light moves with pointer for dynamic sheen
    cyanLight.position.x = pointer.x * 3;
    cyanLight.position.y = pointer.y * 3 + 1;

    if (isDragging) {
      raycaster.setFromCamera(pointer, camera);
      if (raycaster.ray.intersectPlane(dragPlane, dragIntersection)) {
        const targetPos = dragIntersection.clone().add(dragOffset);
        // Constrain movement so it stays on screen
        targetPos.x = THREE.MathUtils.clamp(targetPos.x, -2.5, 2.5);
        targetPos.y = THREE.MathUtils.clamp(targetPos.y, -3.5, 1.5);

        // Apply impulse to card velocity
        const force = targetPos.clone().sub(cardPhysics.pos).multiplyScalar(22);
        cardPhysics.vel.copy(force);

        // Card tilt follows drag direction
        cardPhysics.rotVel.y += (force.x * 0.08 - cardPhysics.rot.y) * 0.2;
        cardPhysics.rotVel.x += (-force.y * 0.05 - cardPhysics.rot.x) * 0.2;
      }
    } else {
      // Gentle card tilt on hover
      const hoverTiltX = -pointer.y * 0.25;
      const hoverTiltY = pointer.x * 0.35;
      cardPhysics.rotVel.x += (hoverTiltX - cardPhysics.rot.x) * 0.05;
      cardPhysics.rotVel.y += (hoverTiltY - cardPhysics.rot.y) * 0.05;
    }
  }

  function onPointerUp() {
    if (isDragging) {
      isDragging = false;
      container.style.cursor = 'grab';
    }
  }

  container.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  // Device orientation tilt for mobile devices
  window.addEventListener('deviceorientation', function (e) {
    if (e.gamma !== null && !isDragging) {
      const tiltX = THREE.MathUtils.clamp(e.beta / 90, -0.4, 0.4);
      const tiltY = THREE.MathUtils.clamp(e.gamma / 90, -0.4, 0.4);
      cardPhysics.rotVel.x += (tiltX - cardPhysics.rot.x) * 0.05;
      cardPhysics.rotVel.y += (tiltY - cardPhysics.rot.y) * 0.05;
    }
  });

  // --- PHYSICS SIMULATION STEP ---
  const gravity = new THREE.Vector3(0, -9.8, 0);
  const timeStep = 1 / 60;
  const damping = 0.985;

  function stepPhysics() {
    const cardTopAttach = new THREE.Vector3(0, cardHeight / 2 + 0.25, 0).applyEuler(cardPhysics.rot).add(cardPhysics.pos);

    // 1. Verlet Integration on Lanyard joints
    joints[0].pos.set(0, anchorY, 0); // Anchor fixed at ceiling

    for (let i = 1; i < numJoints - 1; i++) {
      const j = joints[i];
      const temp = j.pos.clone();
      const vel = j.pos.clone().sub(j.oldPos).multiplyScalar(damping);
      j.pos.add(vel).addScaledVector(gravity, timeStep * timeStep);
      j.oldPos.copy(temp);
    }

    // Last joint is pinned to top of the card
    joints[numJoints - 1].pos.copy(cardTopAttach);

    // 2. Relaxation Constraints on Ribbon (Distance Constraints)
    for (let iter = 0; iter < 12; iter++) {
      joints[0].pos.set(0, anchorY, 0);
      joints[numJoints - 1].pos.copy(cardTopAttach);

      for (let i = 0; i < numJoints - 1; i++) {
        const j1 = joints[i];
        const j2 = joints[i + 1];
        const delta = j2.pos.clone().sub(j1.pos);
        const dist = delta.length();
        if (dist > 0.0001) {
          const diff = (dist - segmentLength) / dist;
          if (i === 0) {
            j2.pos.sub(delta.multiplyScalar(diff));
          } else if (i === numJoints - 2) {
            j1.pos.add(delta.multiplyScalar(diff));
          } else {
            j1.pos.add(delta.clone().multiplyScalar(0.5 * diff));
            j2.pos.sub(delta.multiplyScalar(0.5 * diff));
          }
        }
      }
    }

    // 3. Card Dynamics (Spring-damper to rest position + pendulum swing)
    const restY = anchorY - strapLength - cardHeight / 2;
    const restPos = new THREE.Vector3(0, restY, 0);

    // Restoring spring pulling card back to hanging point
    const springForce = restPos.clone().sub(cardPhysics.pos).multiplyScalar(14.0);
    cardPhysics.vel.addScaledVector(springForce, timeStep);
    cardPhysics.vel.addScaledVector(gravity, timeStep * 0.4);
    cardPhysics.vel.multiplyScalar(damping);

    // Update position
    cardPhysics.pos.addScaledVector(cardPhysics.vel, timeStep);

    // Update rotation physics with spring return to face camera
    const rotSpringY = -cardPhysics.rot.y * 8.0;
    const rotSpringX = -cardPhysics.rot.x * 8.0;
    const rotSpringZ = (-cardPhysics.rot.z - (cardPhysics.vel.x * 0.2)) * 10.0;

    cardPhysics.rotVel.y += rotSpringY * timeStep;
    cardPhysics.rotVel.x += rotSpringX * timeStep;
    cardPhysics.rotVel.z += rotSpringZ * timeStep;

    cardPhysics.rotVel.y *= 0.94;
    cardPhysics.rotVel.x *= 0.94;
    cardPhysics.rotVel.z *= 0.94;

    cardPhysics.rot.x += cardPhysics.rotVel.x * timeStep;
    cardPhysics.rot.y += cardPhysics.rotVel.y * timeStep;
    cardPhysics.rot.z += cardPhysics.rotVel.z * timeStep;

    // Apply to Three.js Object3D
    cardGroup.position.copy(cardPhysics.pos);
    cardGroup.rotation.copy(cardPhysics.rot);

    // Update the ribbon mesh vertices
    updateRibbonGeometry();
  }

  // --- ANIMATION LOOP ---
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Gentle ambient floating sway when not dragged
    if (!isDragging) {
      cardPhysics.vel.x += Math.sin(elapsed * 1.5) * 0.008;
      cardPhysics.rotVel.y += Math.cos(elapsed * 1.2) * 0.006;
    }

    stepPhysics();
    renderer.render(scene, camera);
  }

  animate();

  // --- WINDOW RESIZE ---
  function onWindowResize() {
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;

    // Responsive camera zoom
    if (width < 640) {
      camera.position.z = 8.8; // mobile view
    } else if (width < 1024) {
      camera.position.z = 8.0; // tablet view
    } else {
      camera.position.z = 7.4; // desktop view
    }

    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', onWindowResize);
  onWindowResize();
})();
