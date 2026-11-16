(() => {
  const welcome = document.getElementById('welcomeScreen');
  const openButton = document.getElementById('openInvite');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const progress = document.getElementById('scrollProgress');

  // Keep the invitation gate accessible and remember it for this tab.
  const enterInvitation = () => {
    welcome.classList.add('is-hidden');
    document.body.classList.remove('locked');
    window.setTimeout(() => welcome.setAttribute('aria-hidden', 'true'), 950);
    window.sessionStorage.setItem('weddingInviteOpened', 'yes');
  };
  if (window.sessionStorage.getItem('weddingInviteOpened') === 'yes') {
    welcome.classList.add('is-hidden');
    welcome.setAttribute('aria-hidden', 'true');
  } else {
    document.body.classList.add('locked');
  }
  openButton.addEventListener('click', enterInvitation);

  // Mobile navigation.
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  // Scroll progress bar.
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, amount))}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Reveal elements as they enter the viewport.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Countdown to the first listed celebration (local Indian time).
  const weddingStart = new Date('2026-12-03T10:00:00+05:30').getTime();
  const pad = number => String(number).padStart(2, '0');
  const tick = () => {
    const distance = weddingStart - Date.now();
    if (distance <= 0) {
      ['days', 'hours', 'minutes', 'seconds'].forEach(id => document.getElementById(id).textContent = '00');
      document.querySelector('.count-note').textContent = 'मंगलमय समारोह का समय आ गया है!';
      return;
    }
    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);
    document.getElementById('days').textContent = pad(days);
    document.getElementById('hours').textContent = pad(hours);
    document.getElementById('minutes').textContent = pad(minutes);
    document.getElementById('seconds').textContent = pad(seconds);
  };
  tick();
  window.setInterval(tick, 1000);

  // A subtle, light petal fall; fewer petals on small screens.
  const petalField = document.getElementById('petalField');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) {
    const spawnPetal = () => {
      if (document.hidden) return;
      const petal = document.createElement('span');
      petal.className = 'petal';
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.setProperty('--drift', `${Math.round(Math.random() * 150 - 75)}px`);
      petal.style.animationDuration = `${8 + Math.random() * 8}s`;
      petal.style.transform = `scale(${0.55 + Math.random() * 0.75})`;
      petalField.appendChild(petal);
      window.setTimeout(() => petal.remove(), 17000);
    };
    const petalTimer = window.setInterval(spawnPetal, window.innerWidth < 680 ? 1900 : 1300);
    window.addEventListener('pagehide', () => window.clearInterval(petalTimer), { once: true });
  }
})();
