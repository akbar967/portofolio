/**
 * 3D Immersive Three.js Background & Parallax Experience
 * Akbar Barokah Portfolio
 * Features:
 * - 3D Cyber Particle Constellation System (1,400+ nodes)
 * - Floating 3D Geometric Polyhedra (Icosahedrons, Torus, Octahedrons)
 * - Interactive Mouse 3D Camera Orbit with Smooth Dampening
 * - Scroll-based 3D Camera Flight Depth
 * - Dynamic Multi-Theme Color Reactive Materials (Dark, Light, Galaxy, Rainbow)
 * - Performance optimized (BufferGeometry, tab visibility pause, DPR capped)
 */

(function () {
  'use strict';

  // Wait until Three.js is ready
  function initWhenReady() {
    if (typeof THREE === 'undefined') {
      window.addEventListener('load', initThreeScene);
    } else {
      initThreeScene();
    }
  }

  function initThreeScene() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js library is not available.');
      return;
    }

    // Get or create canvas
    let canvas = document.getElementById('three-bg-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'three-bg-canvas';
      canvas.className = 'pointer-events-none fixed inset-0 -z-10 w-full h-full';
      document.body.prepend(canvas);
    }

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      3000
    );
    camera.position.set(0, 0, 1000);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 2. Dynamic Theme Palette
    const themePalettes = {
      dark: {
        p1: 0x6c63ff, // Cyber purple
        p2: 0x00e5ff, // Neon cyan
        p3: 0xff4d9d, // Cyber pink
        ambient: 0x334155,
        light1: 0x6c63ff,
        light2: 0x00e5ff,
        wireframeOpacity: 0.28,
        particleOpacity: 0.75
      },
      light: {
        p1: 0x6366f1,
        p2: 0x0ea5e9,
        p3: 0xec4899,
        ambient: 0x94a3b8,
        light1: 0x818cf8,
        light2: 0x38bdf8,
        wireframeOpacity: 0.18,
        particleOpacity: 0.45
      },
      galaxy: {
        p1: 0xa855f7, // Deep purple
        p2: 0x38bdf8, // Sky blue
        p3: 0xf43f5e, // Rose
        ambient: 0x475569,
        light1: 0xc084fc,
        light2: 0x38bdf8,
        wireframeOpacity: 0.35,
        particleOpacity: 0.85
      },
      rainbow: {
        p1: 0x00e5ff,
        p2: 0xff007f,
        p3: 0x00ff88,
        ambient: 0x64748b,
        light1: 0xff007f,
        light2: 0x00e5ff,
        wireframeOpacity: 0.4,
        particleOpacity: 0.9
      }
    };

    function getCurrentTheme() {
      const t = document.documentElement.getAttribute('data-theme');
      return themePalettes[t] || themePalettes.dark;
    }

    let activeTheme = getCurrentTheme();

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(activeTheme.ambient, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(activeTheme.light1, 2.5, 1800);
    pointLight1.position.set(300, 400, 500);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(activeTheme.light2, 2.2, 1800);
    pointLight2.position.set(-400, -300, 300);
    scene.add(pointLight2);

    // 4. Particle Constellation System
    const particleCount = 1200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = [];

    const col1 = new THREE.Color(activeTheme.p1);
    const col2 = new THREE.Color(activeTheme.p2);
    const col3 = new THREE.Color(activeTheme.p3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2400;
      positions[i3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i3 + 2] = (Math.random() - 0.5) * 1600;

      // Random particle colors from palette
      const r = Math.random();
      const chosenColor = r < 0.45 ? col1 : (r < 0.8 ? col2 : col3);
      colors[i3] = chosenColor.r;
      colors[i3 + 1] = chosenColor.g;
      colors[i3 + 2] = chosenColor.b;

      velocities.push({
        x: (Math.random() - 0.5) * 0.45,
        y: (Math.random() - 0.5) * 0.45,
        z: (Math.random() - 0.5) * 0.35
      });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circular soft particle texture
    function createCircleTexture() {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.8)');
      grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }

    const particleMaterial = new THREE.PointsMaterial({
      size: 7.5,
      map: createCircleTexture(),
      transparent: true,
      opacity: activeTheme.particleOpacity,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 5. Floating 3D Wireframe Cyber Polyhedra (Hero & Ambience)
    const shapesGroup = new THREE.Group();
    scene.add(shapesGroup);

    const wireframeMaterials = [
      new THREE.MeshStandardMaterial({
        color: activeTheme.p1,
        emissive: activeTheme.p1,
        emissiveIntensity: 0.4,
        wireframe: true,
        transparent: true,
        opacity: activeTheme.wireframeOpacity
      }),
      new THREE.MeshStandardMaterial({
        color: activeTheme.p2,
        emissive: activeTheme.p2,
        emissiveIntensity: 0.4,
        wireframe: true,
        transparent: true,
        opacity: activeTheme.wireframeOpacity
      }),
      new THREE.MeshStandardMaterial({
        color: activeTheme.p3,
        emissive: activeTheme.p3,
        emissiveIntensity: 0.35,
        wireframe: true,
        transparent: true,
        opacity: activeTheme.wireframeOpacity
      })
    ];

    const geometries = [
      new THREE.IcosahedronGeometry(75, 1),
      new THREE.TorusGeometry(85, 18, 16, 50),
      new THREE.OctahedronGeometry(65, 0),
      new THREE.DodecahedronGeometry(70, 0),
      new THREE.IcosahedronGeometry(60, 0),
      new THREE.TorusKnotGeometry(55, 14, 64, 8)
    ];

    const floatingObjects = [];
    const shapePositions = [
      { x: -550, y: 320, z: -150, rotX: 0.006, rotY: 0.008 },
      { x: 580, y: 380, z: -250, rotX: 0.007, rotY: 0.005 },
      { x: -620, y: -250, z: -100, rotX: 0.005, rotY: 0.009 },
      { x: 620, y: -320, z: -180, rotX: 0.008, rotY: 0.006 },
      { x: -280, y: -550, z: -350, rotX: 0.006, rotY: 0.007 },
      { x: 380, y: -650, z: -300, rotX: 0.007, rotY: 0.006 }
    ];

    shapePositions.forEach((pos, idx) => {
      const geo = geometries[idx % geometries.length];
      const mat = wireframeMaterials[idx % wireframeMaterials.length];
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.userData = {
        baseY: pos.y,
        speedX: pos.rotX,
        speedY: pos.rotY,
        floatSpeed: 0.0015 + (idx * 0.0004),
        floatOffset: idx * 1.2
      };
      shapesGroup.add(mesh);
      floatingObjects.push(mesh);
    });

    // 6. Interactive Mouse & Scroll 3D Orbiting
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let scrollProgress = 0;

    window.addEventListener('mousemove', function (e) {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX = normX;
      mouseY = normY;
      targetCameraX = normX * 160;
      targetCameraY = -normY * 130;

      // Shift point light 1 slightly toward cursor
      pointLight1.position.x = normX * 450;
      pointLight1.position.y = -normY * 350 + 200;
    }, { passive: true });

    // Touch support for mobile devices
    window.addEventListener('touchmove', function (e) {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const normX = (touch.clientX / window.innerWidth - 0.5) * 2;
        const normY = (touch.clientY / window.innerHeight - 0.5) * 2;
        targetCameraX = normX * 100;
        targetCameraY = -normY * 90;
      }
    }, { passive: true });

    function updateScroll() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = maxScroll > 0 ? (window.scrollY / maxScroll) : 0;
    }
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    // 7. Theme Observer (Live Palette Switcher)
    function updateThemeColors() {
      activeTheme = getCurrentTheme();
      const cA = new THREE.Color(activeTheme.p1);
      const cB = new THREE.Color(activeTheme.p2);
      const cC = new THREE.Color(activeTheme.p3);

      ambientLight.color.setHex(activeTheme.ambient);
      pointLight1.color.setHex(activeTheme.light1);
      pointLight2.color.setHex(activeTheme.light2);

      wireframeMaterials[0].color = cA;
      wireframeMaterials[0].emissive = cA;
      wireframeMaterials[0].opacity = activeTheme.wireframeOpacity;

      wireframeMaterials[1].color = cB;
      wireframeMaterials[1].emissive = cB;
      wireframeMaterials[1].opacity = activeTheme.wireframeOpacity;

      wireframeMaterials[2].color = cC;
      wireframeMaterials[2].emissive = cC;
      wireframeMaterials[2].opacity = activeTheme.wireframeOpacity;

      particleMaterial.opacity = activeTheme.particleOpacity;

      // Update particle colors
      const colorAttr = particleGeometry.attributes.color;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const r = Math.random();
        const pick = r < 0.45 ? cA : (r < 0.8 ? cB : cC);
        colorAttr.array[i3] = pick.r;
        colorAttr.array[i3 + 1] = pick.g;
        colorAttr.array[i3 + 2] = pick.b;
      }
      colorAttr.needsUpdate = true;
    }

    const themeObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          updateThemeColors();
        }
      });
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    // 8. Window Resize Handler
    let resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 100);
    });

    // 9. Animation Render Loop
    let clock = new THREE.Clock();
    let isRunning = true;

    document.addEventListener('visibilitychange', function () {
      isRunning = !document.hidden;
      if (isRunning) clock.getDelta(); // reset delta
    });

    function animate() {
      requestAnimationFrame(animate);
      if (!isRunning) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // 1. Smooth Camera Interpolation (Damping)
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;

      // 2. Flight depth as user scrolls through page (3D Camera travel)
      const targetZ = 1000 - (scrollProgress * 550);
      const targetScrollY = - (scrollProgress * 400);
      camera.position.z += (targetZ - camera.position.z) * 0.06;
      shapesGroup.position.y += (targetScrollY - shapesGroup.position.y) * 0.05;

      camera.lookAt(0, 0, 0);

      // 3. Animate Particles
      const posAttr = particleGeometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const vel = velocities[i];
        posAttr.array[i3] += vel.x;
        posAttr.array[i3 + 1] += vel.y;
        posAttr.array[i3 + 2] += vel.z;

        // Wrap boundaries
        if (posAttr.array[i3] > 1200) posAttr.array[i3] = -1200;
        if (posAttr.array[i3] < -1200) posAttr.array[i3] = 1200;
        if (posAttr.array[i3 + 1] > 1000) posAttr.array[i3 + 1] = -1000;
        if (posAttr.array[i3 + 1] < -1000) posAttr.array[i3 + 1] = 1000;
        if (posAttr.array[i3 + 2] > 800) posAttr.array[i3 + 2] = -800;
        if (posAttr.array[i3 + 2] < -800) posAttr.array[i3 + 2] = 800;
      }
      posAttr.needsUpdate = true;

      // Slow overall particle system tumbling
      particleSystem.rotation.y = elapsed * 0.02;
      particleSystem.rotation.x = elapsed * 0.01;

      // 4. Animate Floating 3D Polyhedra
      floatingObjects.forEach((obj) => {
        obj.rotation.x += obj.userData.speedX;
        obj.rotation.y += obj.userData.speedY;
        // Bobbing vertical sine wave
        obj.position.y = obj.userData.baseY + Math.sin(elapsed * 1.5 + obj.userData.floatOffset) * 22;
      });

      // Point light 2 slow orbit
      pointLight2.position.x = Math.sin(elapsed * 0.5) * 550;
      pointLight2.position.z = Math.cos(elapsed * 0.5) * 350;

      renderer.render(scene, camera);
    }

    animate();
  }

  // Start initialization
  initWhenReady();
})();
