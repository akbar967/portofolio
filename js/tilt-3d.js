/**
 * Universal 3D Parallax Tilt & Specular Glare Engine
 * Akbar Barokah Portfolio
 * Features:
 * - Dynamic 3D perspective rotation tracking mouse cursor
 * - Multi-layer 3D depth pop-out for text, badges, images & buttons (Z-axis translation)
 * - Real-time specular glare reflection tracking cursor coordinate
 * - Smooth spring reset on mouse leave
 * - Mobile touch & performance optimized
 */

(function () {
  'use strict';

  function init3DTiltCards() {
    // Select showcase cards (Hero, About, Skills, Projects, Journey, Certificates)
    // EXCLUDING form inputs / contact section so users can easily type and click!
    const cards = document.querySelectorAll(
      '.glass-card, .project-card, .certificate-card, #hero-tilt-card'
    );

    cards.forEach((card) => {
      // Never apply 3D tilt to contact form or containers with inputs/textareas
      if (
        card.closest('#contact') ||
        card.querySelector('form, input, textarea') ||
        card.id === 'contact-form'
      ) {
        card.style.transform = 'none';
        card.style.perspective = 'none';
        return;
      }

      // Avoid duplicate init
      if (card.dataset.tilt3dInit === 'true') return;
      card.dataset.tilt3dInit = 'true';

      // 1. Ensure 3D transform style on parent
      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';

      // 2. Add Specular 3D Glare overlay
      let glare = card.querySelector('.card-3d-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'card-3d-glare';
        card.appendChild(glare);
      }

      // 3. Mark internal elements for 3D Pop-out
      const popElements = card.querySelectorAll(
        'h3, .eyebrow, .project-tech-badge, a, button, img, svg, .rounded-xl, .project-badge'
      );
      popElements.forEach((el) => {
        if (!el.classList.contains('card-3d-glare')) {
          el.style.transformStyle = 'preserve-3d';
        }
      });

      // 4. Mouse Move Event (Calculate 3D Tilt)
      let animationFrameId = null;

      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;

        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        animationFrameId = requestAnimationFrame(function () {
          const x = clientX - rect.left;
          const y = clientY - rect.top;

          // Normalized coordinates (-1 to 1)
          const normX = (x / rect.width - 0.5) * 2;
          const normY = (y / rect.height - 0.5) * 2;

          // Subtle, ultra-smooth tilt angles (max ~10-12 deg)
          const maxTilt = 10;
          const rotX = (-normY * maxTilt).toFixed(2);
          const rotY = (normX * maxTilt).toFixed(2);

          // Apply 3D Perspective Transformation
          card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02) translateZ(10px)`;
          card.style.transition = 'transform 0.08s ease-out, box-shadow 0.25s ease';

          // Move 3D Glare reflection to cursor coordinates
          const glareX = ((x / rect.width) * 100).toFixed(1);
          const glareY = ((y / rect.height) * 100).toFixed(1);
          glare.style.opacity = '1';
          glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.05) 35%, transparent 65%)`;

          // Apply elevated Z-axis to pop elements
          popElements.forEach((el) => {
            if (el.tagName === 'H3' || el.tagName === 'A' || el.tagName === 'BUTTON') {
              el.style.transform = 'translateZ(26px)';
              el.style.transition = 'transform 0.15s ease-out';
            } else if (el.tagName === 'IMG') {
              el.style.transform = 'translateZ(18px) scale(1.03)';
              el.style.transition = 'transform 0.2s ease-out';
            }
          });
        });
      });

      // 5. Mouse Leave Event (Smooth Spring Reset)
      card.addEventListener('mouseleave', function () {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)';

        glare.style.opacity = '0';
        glare.style.transition = 'opacity 0.5s ease';

        // Reset child pop elements
        popElements.forEach((el) => {
          el.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
          el.style.transform = 'translateZ(0px)';
        });
      });

      // 6. Touch Support for Mobile
      card.addEventListener('touchstart', function () {
        card.style.transform = 'scale(0.98) translateZ(0px)';
        card.style.transition = 'transform 0.2s ease';
      }, { passive: true });

      card.addEventListener('touchend', function () {
        card.style.transform = 'scale(1) translateZ(0px)';
        card.style.transition = 'transform 0.3s ease';
      }, { passive: true });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DTiltCards);
  } else {
    init3DTiltCards();
  }

  // Re-run for dynamically filtered projects or tab switches
  window.addEventListener('project-filter-changed', function () {
    setTimeout(init3DTiltCards, 150);
  });
})();
