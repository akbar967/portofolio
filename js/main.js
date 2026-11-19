/**
 * Main Application Logic
 * Akbar Barokah's Portfolio
 */

document.addEventListener('DOMContentLoaded', function () {
  // 0. 3D Immersive Intro Welcome Screen ("Hello guys welcome to portofolio akbar")
  const welcomeScreen = document.getElementById('welcome-screen');
  const welcomeCard = document.querySelector('.welcome-card');
  const progressFill = document.getElementById('welcome-progress-fill');
  const progressPercent = document.getElementById('welcome-progress-percent');
  const enterBtn = document.getElementById('welcome-enter-btn');
  const welcome3dCanvas = document.getElementById('welcome-3d-canvas');

  if (welcomeScreen) {
    document.body.style.overflow = 'hidden';

    // A. 3D Card Parallax Tilt on Cursor Move
    if (welcomeCard) {
      window.addEventListener('mousemove', function (e) {
        if (welcomeScreen.classList.contains('welcome-warp-out') || welcomeScreen.style.display === 'none') return;
        const normX = (e.clientX / window.innerWidth - 0.5) * 2;
        const normY = (e.clientY / window.innerHeight - 0.5) * 2;
        const rotX = -normY * 12;
        const rotY = normX * 14;
        welcomeCard.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(25px)`;
      }, { passive: true });
    }

    // B. Three.js 3D Hyperspace Warp & Holographic Core
    let welcomeAnimId = null;
    let isWarpingOut = false;

    if (welcome3dCanvas && typeof THREE !== 'undefined') {
      const wScene = new THREE.Scene();
      const wCamera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 2500);
      wCamera.position.z = 600;

      const wRenderer = new THREE.WebGLRenderer({
        canvas: welcome3dCanvas,
        alpha: true,
        antialias: true
      });
      wRenderer.setSize(window.innerWidth, window.innerHeight);
      wRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // 1. Floating 3D Holographic Wireframe Core
      const coreGeo = new THREE.IcosahedronGeometry(75, 1);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        wireframe: true,
        transparent: true,
        opacity: 0.45
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.set(0, 90, -80);
      wScene.add(coreMesh);

      // Inner glowing nucleus
      const nucleusGeo = new THREE.OctahedronGeometry(38, 0);
      const nucleusMat = new THREE.MeshBasicMaterial({
        color: 0x6c63ff,
        wireframe: true,
        transparent: true,
        opacity: 0.7
      });
      const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
      coreMesh.add(nucleusMesh);

      // 2. Hyperspace Warp Stars
      const starCount = 650;
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(starCount * 3);
      const starVel = [];

      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        starPos[i3] = (Math.random() - 0.5) * 1600;
        starPos[i3 + 1] = (Math.random() - 0.5) * 1200;
        starPos[i3 + 2] = Math.random() * -1800;
        starVel.push(1.8 + Math.random() * 2.5);
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));

      const starMat = new THREE.PointsMaterial({
        size: 4.8,
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      const starField = new THREE.Points(starGeo, starMat);
      wScene.add(starField);

      // Mouse Parallax for Three.js camera
      let targetCamX = 0;
      let targetCamY = 0;
      window.addEventListener('mousemove', function (e) {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        targetCamX = nx * 80;
        targetCamY = -ny * 60;
      }, { passive: true });

      function animateWelcome3D() {
        welcomeAnimId = requestAnimationFrame(animateWelcome3D);

        // Core rotation
        coreMesh.rotation.x += 0.008;
        coreMesh.rotation.y += 0.012;
        nucleusMesh.rotation.x -= 0.015;
        nucleusMesh.rotation.y -= 0.018;

        // Camera smooth ease
        wCamera.position.x += (targetCamX - wCamera.position.x) * 0.06;
        wCamera.position.y += (targetCamY - wCamera.position.y) * 0.06;

        // Star travel (Hyperspace forward stream)
        const pArr = starGeo.attributes.position.array;
        const speedMultiplier = isWarpingOut ? 14 : 1;
        for (let i = 0; i < starCount; i++) {
          const i3 = i * 3;
          pArr[i3 + 2] += starVel[i] * speedMultiplier;
          if (pArr[i3 + 2] > 700) {
            pArr[i3 + 2] = -1600;
            pArr[i3] = (Math.random() - 0.5) * 1600;
            pArr[i3 + 1] = (Math.random() - 0.5) * 1200;
          }
        }
        starGeo.attributes.position.needsUpdate = true;

        wRenderer.render(wScene, wCamera);
      }
      animateWelcome3D();

      window.addEventListener('resize', function () {
        if (!welcomeScreen || welcomeScreen.style.display === 'none') return;
        wCamera.aspect = window.innerWidth / window.innerHeight;
        wCamera.updateProjectionMatrix();
        wRenderer.setSize(window.innerWidth, window.innerHeight);
      });
    }

    // C. Loading Progress & Dismissal
    let currentProgress = 0;
    const totalDuration = 2600; // 2.6 detik durasi perkenalan 3D
    const intervalRate = 30;
    const increment = (intervalRate / totalDuration) * 100;
    let isDismissed = false;

    const progressTimer = setInterval(function () {
      if (isDismissed) return;
      currentProgress += increment;
      const clamped = Math.min(Math.round(currentProgress), 100);

      if (progressFill) progressFill.style.width = clamped + '%';
      if (progressPercent) progressPercent.textContent = clamped + '%';

      if (currentProgress >= 100) {
        clearInterval(progressTimer);
        setTimeout(dismissWelcome, 250);
      }
    }, intervalRate);

    function dismissWelcome() {
      if (isDismissed) return;
      isDismissed = true;
      isWarpingOut = true;
      clearInterval(progressTimer);

      if (progressFill) progressFill.style.width = '100%';
      if (progressPercent) progressPercent.textContent = '100%';

      // Cinematic 3D Hyperspace Warp Out
      welcomeScreen.classList.add('welcome-warp-out');
      document.body.style.overflow = '';

      setTimeout(function () {
        welcomeScreen.style.display = 'none';
        if (welcomeAnimId) cancelAnimationFrame(welcomeAnimId);
      }, 850);
    }

    if (enterBtn) {
      enterBtn.addEventListener('click', dismissWelcome);
    }
  }

  // 1. Reading Progress Bar
  const progressBar = document.querySelector('.scroll-progress-bar');
  window.addEventListener('scroll', function () {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll > 0) {
      const progress = window.scrollY / totalScroll;
      if (progressBar) {
        progressBar.style.transform = `scaleX(${progress})`;
      }
    }
  });

  // 2. Navbar Scroll Effects
  const header = document.querySelector('header');
  const nav = header ? header.querySelector('nav') : null;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      if (nav) {
        nav.classList.add('bg-base/80', 'backdrop-blur-md', 'border-white/10', 'shadow-lg');
        nav.classList.remove('bg-transparent', 'border-transparent');
      }
    } else {
      if (nav) {
        nav.classList.remove('bg-base/80', 'backdrop-blur-md', 'border-white/10', 'shadow-lg');
        nav.classList.add('bg-transparent', 'border-transparent');
      }
    }
  });

  // 3. Mobile Hamburger Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.contains('menu-open');
      if (isOpen) {
        mobileMenu.classList.remove('menu-open');
        mobileMenu.classList.add('pointer-events-none', 'opacity-0', '-translate-y-4');
        if (menuIconOpen) menuIconOpen.classList.remove('hidden');
        if (menuIconClose) menuIconClose.classList.add('hidden');
      } else {
        mobileMenu.classList.add('menu-open');
        mobileMenu.classList.remove('pointer-events-none', 'opacity-0', '-translate-y-4');
        if (menuIconOpen) menuIconOpen.classList.add('hidden');
        if (menuIconClose) menuIconClose.classList.remove('hidden');
      }
    });

    // Close mobile menu when clicking any nav link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('menu-open');
        mobileMenu.classList.add('pointer-events-none', 'opacity-0', '-translate-y-4');
        if (menuIconOpen) menuIconOpen.classList.remove('hidden');
        if (menuIconClose) menuIconClose.classList.add('hidden');
      });
    });
  }

  // 4. Active Nav Link on Scroll (Scroll Spy)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('header nav ul a[href^="#"]');

  window.addEventListener('scroll', function () {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-primary', 'font-bold');
      link.classList.add('text-text-secondary');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('text-primary', 'font-bold');
        link.classList.remove('text-text-secondary');
      }
    });
  });

  // 5. Projects Category Filter
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => {
        b.classList.remove('bg-primary', 'text-white', 'shadow-glow');
        b.classList.add('text-text-secondary', 'hover:text-white');
      });
      this.classList.add('bg-primary', 'text-white', 'shadow-glow');
      this.classList.remove('text-text-secondary', 'hover:text-white');

      const filter = this.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });

      // Notify 3D Tilt system of layout updates
      window.dispatchEvent(new CustomEvent('project-filter-changed'));
    });
  });

  // 6. Certificate Lightbox Modal
  const certModal = document.getElementById('cert-modal');
  const certModalImg = document.getElementById('cert-modal-img');
  const certModalTitle = document.getElementById('cert-modal-title');
  const certModalIssuer = document.getElementById('cert-modal-issuer');
  const certModalClose = document.getElementById('cert-modal-close');
  const certCards = document.querySelectorAll('.cert-card');

  certCards.forEach(card => {
    card.addEventListener('click', function () {
      const img = this.querySelector('img');
      const title = this.querySelector('.cert-title')?.textContent || 'Sertifikat';
      const issuer = this.querySelector('.cert-issuer')?.textContent || '';

      if (certModal && img) {
        certModalImg.src = img.src;
        if (certModalTitle) certModalTitle.textContent = title;
        if (certModalIssuer) certModalIssuer.textContent = issuer;
        certModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (certModalClose && certModal) {
    certModalClose.addEventListener('click', function () {
      certModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    certModal.addEventListener('click', function (e) {
      if (e.target === certModal) {
        certModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && certModal.classList.contains('active')) {
        certModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // 7. Contact Form Handling
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const messageInput = document.getElementById('form-message');

      if (!nameInput.value || !emailInput.value || !messageInput.value) {
        showStatus('Harap isi semua kolom formulir!', 'error');
        return;
      }

      // Simulation of submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Mengirim Pesan...`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        showStatus('Pesan berhasil diproses! Membuka aplikasi email Anda...', 'success');
        
        const subject = document.getElementById('form-subject')?.value || 'Pesan dari Portfolio Website';
        const body = `Halo Akbar Barokah,\n\nNama: ${nameInput.value}\nEmail: ${emailInput.value}\n\nPesan:\n${messageInput.value}`;
        
        // Direct to b4r0k4h2007@gmail.com
        setTimeout(() => {
          window.location.href = `mailto:b4r0k4h2007@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }, 500);

        contactForm.reset();
      }, 1000);
    });
  }

  function showStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = `text-sm font-medium py-3 px-4 rounded-xl transition-all ${
      type === 'success'
        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
    }`;
    formStatus.classList.remove('hidden');

    setTimeout(() => {
      formStatus.classList.add('hidden');
    }, 5000);
  }

  // 8. Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100');
      }
    });

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 9. Interactive 3D Card Tilt Engine
  // Powered globally across all sections by js/tilt-3d.js (Hero, Projects, Skills, Certificates, Contact)

  // 10. Multi-Theme System (Gelap, Terang, Galaxy)
  const themeBtns = document.querySelectorAll('.theme-btn');
  const mobileThemeBtn = document.getElementById('mobile-theme-cycle-btn');
  const starfieldCanvas = document.getElementById('galaxy-starfield-canvas');

  let starfieldAnimationId = null;
  let stars = [];

  function initStarfield() {
    if (!starfieldCanvas) return;
    const ctx = starfieldCanvas.getContext('2d');
    if (!ctx) return;

    function resizeCanvas() {
      starfieldCanvas.width = window.innerWidth;
      starfieldCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create 160 stars with cosmic tints
    stars = [];
    const colors = ['#ffffff', '#c084fc', '#38bdf8', '#f43f5e', '#e0e7ff', '#a855f7'];
    for (let i = 0; i < 160; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.6 + 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.006,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        vy: Math.random() * 0.25 + 0.05
      });
    }

    function renderStars() {
      ctx.clearRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Twinkle effect
        star.alpha += star.twinkleSpeed * star.twinkleDir;
        if (star.alpha >= 1) {
          star.alpha = 1;
          star.twinkleDir = -1;
        } else if (star.alpha <= 0.15) {
          star.alpha = 0.15;
          star.twinkleDir = 1;
        }

        // Slow upward drift
        star.y -= star.vy;
        if (star.y < 0) {
          star.y = starfieldCanvas.height;
          star.x = Math.random() * starfieldCanvas.width;
        }

        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Extra soft glow on prominent stars
        if (star.radius > 1.2) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = star.color;
          ctx.fill();
        }
        ctx.restore();
      }

      starfieldAnimationId = requestAnimationFrame(renderStars);
    }

    renderStars();
  }

  function stopStarfield() {
    if (starfieldAnimationId) {
      cancelAnimationFrame(starfieldAnimationId);
      starfieldAnimationId = null;
    }
    if (starfieldCanvas) {
      const ctx = starfieldCanvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);
    }
  }

  function applyTheme(themeName) {
    if (!['dark', 'light', 'galaxy', 'rainbow'].includes(themeName)) {
      themeName = 'dark';
    }

    document.documentElement.setAttribute('data-theme', themeName);
    try {
      localStorage.setItem('portfolio-theme', themeName);
    } catch (e) {}

    // Update active class on all matching theme buttons (desktop & mobile)
    themeBtns.forEach(btn => {
      if (btn.getAttribute('data-theme') === themeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update quick cycle icon on mobile header
    const darkIcon = document.getElementById('mobile-theme-icon-dark');
    const lightIcon = document.getElementById('mobile-theme-icon-light');
    const galaxyIcon = document.getElementById('mobile-theme-icon-galaxy');
    const rainbowIcon = document.getElementById('mobile-theme-icon-rainbow');
    if (darkIcon && lightIcon && galaxyIcon) {
      darkIcon.classList.toggle('hidden', themeName !== 'dark');
      lightIcon.classList.toggle('hidden', themeName !== 'light');
      galaxyIcon.classList.toggle('hidden', themeName !== 'galaxy');
      if (rainbowIcon) rainbowIcon.classList.toggle('hidden', themeName !== 'rainbow');
    }

    // Handle Galaxy starfield canvas animation
    if (themeName === 'galaxy') {
      if (!starfieldAnimationId) {
        initStarfield();
      }
    } else {
      stopStarfield();
    }
  }

  // Bind click events on all theme buttons
  themeBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const targetTheme = this.getAttribute('data-theme');
      applyTheme(targetTheme);
    });
  });

  // Mobile quick cycle button click event
  if (mobileThemeBtn) {
    mobileThemeBtn.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const order = ['dark', 'light', 'galaxy', 'rainbow'];
      const nextIdx = (order.indexOf(current) + 1) % order.length;
      applyTheme(order[nextIdx]);
    });
  }

  // Initialize theme on initial load
  const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(initialTheme);
});
