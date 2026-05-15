document.addEventListener('DOMContentLoaded', () => {

  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  let preloaderDismissed = false;

  function dismissPreloader() {
    if (preloaderDismissed) return;
    preloaderDismissed = true;
    preloader.classList.add('hidden');
    document.body.classList.remove('loading');
    animateHero();
  }

  if (preloader) {
    window.addEventListener('load', () => setTimeout(dismissPreloader, 800));
    setTimeout(dismissPreloader, 3000);
  } else {
    document.body.classList.remove('loading');
    animateHero();
  }

  // --- Hero entrance animation ---
  function animateHero() {
    const titleWords = document.querySelectorAll('.title-word');
    const heroBadge = document.querySelector('.hero-badge');
    const heroBottom = document.querySelector('.hero-bottom');
    const heroScroll = document.querySelector('.hero-scroll-indicator');

    titleWords.forEach((word, i) => {
      word.style.opacity = '0';
      word.style.transform = 'translateY(80px) rotateX(15deg)';
      word.style.transition = `opacity 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.15}s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.15}s`;

      requestAnimationFrame(() => requestAnimationFrame(() => {
        word.style.opacity = '1';
        word.style.transform = 'translateY(0) rotateX(0)';
      }));
    });

    [heroBadge, heroBottom, heroScroll].forEach((el, i) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.8s ease ${0.1 + i * 0.2}s, transform 0.8s ease ${0.1 + i * 0.2}s`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }));
    });
  }

  // --- Header scroll ---
  const header = document.getElementById('header');

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // --- Parallax orbs on mouse move ---
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      const orbs = heroBg.querySelectorAll('.hero-gradient-orb');
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 15;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    }, { passive: true });
  }

  // --- Menu toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const menuOverlay = document.getElementById('menuOverlay');

  if (menuToggle && menuOverlay) {
    function closeMenu() {
      menuToggle.classList.remove('active');
      menuOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
      const active = document.activeElement;
      if (active && menuOverlay.contains(active)) active.blur();
    }

    menuToggle.addEventListener('click', () => {
      if (menuOverlay.classList.contains('active')) {
        closeMenu();
      } else {
        menuToggle.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.classList.add('menu-open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // --- Scroll reveal ---
  const revealTargets = document.querySelectorAll(
    '.section-header, .stats-section-header, .service-card, .stat-item, .about-left, .about-right, ' +
    '.process-step, .testimonial, .cta-content, .service-detail, .value-card, ' +
    '.contact-info, .contact-form, .team-intro, .page-header'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('reveal', 'visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // --- Counter animation ---
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.target));
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    (function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round((1 - Math.pow(1 - progress, 3)) * target);
      if (progress < 1) requestAnimationFrame(update);
    })(start);
  }

  // --- Service card glow follow cursor ---
  document.querySelectorAll('.service-card').forEach(card => {
    const glow = card.querySelector('.service-card-glow');
    if (!glow) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
      glow.style.transform = 'translate(-50%, -50%)';
    });
  });

  // --- Contact form: Web3Forms (JSON fetch), FormSubmit (native POST), or demo ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const action = (contactForm.getAttribute('action') || '').toLowerCase();
    const usesFormSubmit = action.includes('formsubmit.co');
    const usesWeb3Forms = action.includes('api.web3forms.com') || action.includes('web3forms.com');

    function setSubmitBusy(btn, busy, labelBusy, labelIdle) {
      if (!btn) return;
      const span = btn.querySelector('span');
      if (busy) {
        if (span && labelBusy) span.textContent = labelBusy;
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.85';
      } else {
        if (span && labelIdle) span.textContent = labelIdle;
        btn.style.pointerEvents = '';
        btn.style.opacity = '';
      }
    }

    if (usesWeb3Forms) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn-submit');
        const span = btn && btn.querySelector('span');
        const idleLabel = span ? span.textContent : '';
        setSubmitBusy(btn, true, 'Sending…', null);

        const data = Object.fromEntries(new FormData(contactForm).entries());
        if (!data.access_key || data.access_key === 'YOUR_ACCESS_KEY_HERE') {
          setSubmitBusy(btn, false, null, idleLabel);
          window.alert('Add your Web3Forms access key in contact.html (replace YOUR_ACCESS_KEY_HERE). Get a free key at https://web3forms.com');
          return;
        }

        try {
          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data)
          });
          const json = await res.json().catch(() => ({}));
          if (json.success) {
            contactForm.reset();
            const thanks = document.getElementById('contactThanks');
            if (thanks) thanks.classList.add('visible');
            try { thanks && thanks.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (_) {}
          } else {
            window.alert((json && json.message) || 'Something went wrong sending your message. Please try again or email us directly.');
          }
        } catch (_) {
          window.alert('Could not reach the form service. Check your connection or try again in a moment.');
        }
        setSubmitBusy(btn, false, null, idleLabel);
      });
    } else if (usesFormSubmit) {
      contactForm.addEventListener('submit', () => {
        const btn = contactForm.querySelector('.btn-submit');
        setSubmitBusy(btn, true, 'Sending…', null);
      });
    } else {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn-submit');
        const span = btn && btn.querySelector('span');
        const original = span ? span.textContent : '';

        if (span) span.textContent = 'Sending...';
        if (btn) {
          btn.style.pointerEvents = 'none';
          btn.style.opacity = '0.7';
        }

        setTimeout(() => {
          if (span) span.textContent = 'Message sent!';
          if (btn) {
            btn.style.opacity = '1';
            btn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
          }
          setTimeout(() => {
            if (span) span.textContent = original;
            if (btn) {
              btn.style.background = '';
              btn.style.pointerEvents = '';
            }
            contactForm.reset();
          }, 2500);
        }, 1500);
      });
    }
  }

  // --- Tilt effect on hover for cards ---
  document.querySelectorAll('.stat-item, .process-step, .value-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => card.style.transition = '', 500);
    });
  });

});
