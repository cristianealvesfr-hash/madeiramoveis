/* ============================================================
   MADEIRARTE — script.js
   ============================================================ */

(function () {
  'use strict';

  /* --------- LGPD — COOKIE CONSENT --------- */
  const cookieBanner  = document.getElementById('cookie-banner');
  const btnAceitar    = document.getElementById('cookie-aceitar');
  const btnRecusar    = document.getElementById('cookie-recusar');

  function hideCookieBanner() {
    cookieBanner.classList.add('hiding');
    setTimeout(() => { cookieBanner.style.display = 'none'; }, 500);
  }

  function showCookieBanner() {
    // Pequeno delay para garantir que a animação de entrada seja visível
    setTimeout(() => { cookieBanner.classList.add('visible'); }, 800);
  }

  function initCookieConsent() {
    if (!cookieBanner) return;
    const choice = localStorage.getItem('madeirarte_cookie_consent');
    if (!choice) {
      showCookieBanner();
    } else {
      cookieBanner.style.display = 'none';
    }
  }

  if (btnAceitar) {
    btnAceitar.addEventListener('click', () => {
      localStorage.setItem('madeirarte_cookie_consent', 'all');
      hideCookieBanner();
    });
  }
  if (btnRecusar) {
    btnRecusar.addEventListener('click', () => {
      localStorage.setItem('madeirarte_cookie_consent', 'essential');
      hideCookieBanner();
    });
  }

  initCookieConsent();

  /* --------- HEADER SCROLL --------- */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 60);
    backToTop.classList.toggle('visible', y > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --------- HAMBURGER --------- */
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('nav-mobile');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMobile.classList.toggle('open');
    document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
  });

  // Fechar ao clicar em link
  document.querySelectorAll('.nav-link-mobile').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMobile.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* --------- SCROLL REVEAL --------- */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => revealObserver.observe(el));

  /* --------- FILTROS DE PRODUTO --------- */
  const filtros = document.querySelectorAll('.filtro-btn');
  const cards   = document.querySelectorAll('.produto-card');

  filtros.forEach(btn => {
    btn.addEventListener('click', () => {
      // Ativo
      filtros.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          card.style.display = '';
          // Re-trigger reveal animation
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* --------- BACK TO TOP --------- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* --------- FORMULÁRIO --------- */
  const form = document.getElementById('contato-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nome      = form.nome.value.trim();
      const telefone  = form.telefone.value.trim();
      const email     = form.email.value.trim();
      const interesse = form.interesse.value;
      const mensagem  = form.mensagem.value.trim();

      if (!nome || !telefone || !email) {
        showNotification('Por favor, preencha os campos obrigatórios.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showNotification('Por favor, insira um e-mail válido.', 'error');
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Redirecionando...';
      btn.disabled = true;

      // Montar mensagem para o WhatsApp
      let texto = `Olá! Gostaria de um orçamento.\n\n*Nome:* ${nome}\n*Telefone:* ${telefone}\n*E-mail:* ${email}`;
      if (interesse) texto += `\n*Interesse:* ${interesse}`;
      if (mensagem)  texto += `\n*Mensagem:* ${mensagem}`;

      const whatsappLink = 'https://wa.me/5513996192291?text=' + encodeURIComponent(texto);

      setTimeout(() => {
        window.open(whatsappLink, '_blank');
        showNotification('Você está sendo redirecionado para o WhatsApp!', 'success');
        form.reset();
        btn.textContent = 'Enviar Mensagem';
        btn.disabled = false;
      }, 800);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showNotification(message, type) {
    // Remove existing
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = 'notification notification--' + type;
    el.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()" aria-label="Fechar">✕</button>
    `;
    document.body.appendChild(el);

    // Auto remove
    setTimeout(() => { if (el.parentNode) el.remove(); }, 5000);
  }

  // Notification styles (injetado via JS para não depender de arquivo extra)
  const notifStyle = document.createElement('style');
  notifStyle.textContent = `
    .notification {
      position: fixed;
      top: 100px; right: 24px; left: 24px;
      max-width: 480px;
      margin: 0 auto;
      padding: 16px 20px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      z-index: 9999;
      font-family: 'Open Sans', sans-serif;
      font-size: .88rem;
      font-weight: 600;
      animation: notifSlide .4s ease forwards;
      box-shadow: 0 8px 32px rgba(0,0,0,.15);
    }
    .notification--success { background: #1a5c35; color: #fff; }
    .notification--error   { background: #7a1f1f; color: #fff; }
    .notification button {
      background: none; border: none; color: inherit;
      cursor: pointer; font-size: 1rem; opacity: .7;
      flex-shrink: 0;
    }
    .notification button:hover { opacity: 1; }
    @keyframes notifSlide {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @media (min-width: 480px) {
      .notification { left: auto; right: 24px; }
    }
  `;
  document.head.appendChild(notifStyle);

  /* --------- SMOOTH ANCHOR --------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* --------- PARALLAX LEVE NO HERO --------- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `translateY(${y * 0.25}px) scale(1.04)`;
    }, { passive: true });
  }

  /* --------- CAROUSEL DE DEPOIMENTOS --------- */
  const track    = document.getElementById('dep-track');
  const dotsWrap = document.getElementById('dep-dots');
  const btnPrev  = document.getElementById('dep-prev');
  const btnNext  = document.getElementById('dep-next');

  if (track) {
    const cards = track.querySelectorAll('.dep-card');
    const total = cards.length;
    let current = 0;
    let autoTimer = null;

    // Criar dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dep-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(calc(-${current * 100}% - ${current * 28}px))`;
      dotsWrap.querySelectorAll('.dep-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function startAuto() {
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    }
    function stopAuto() {
      clearInterval(autoTimer);
    }

    btnNext.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
    btnPrev.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });

    // Swipe touch
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { stopAuto(); goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
    });

    // Pausar ao passar o mouse
    track.closest('.dep-carousel-wrap').addEventListener('mouseenter', stopAuto);
    track.closest('.dep-carousel-wrap').addEventListener('mouseleave', startAuto);

    startAuto();
  }

  /* --------- CAROUSEL NOSSOS TRABALHOS (INSTAGRAM) --------- */
  const trabGrid = document.getElementById('trabalhos-grid');
  const trabPrev = document.getElementById('trabalhos-prev');
  const trabNext = document.getElementById('trabalhos-next');

  if (trabGrid) {
    const scrollAmount = 340;
    let trabTimer = null;

    if (trabPrev) {
      trabPrev.addEventListener('click', () => {
        trabGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
    }

    if (trabNext) {
      trabNext.addEventListener('click', () => {
        trabGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }

    function autoScrollTrab() {
      // Se chegou ao fim, volta ao início
      if (trabGrid.scrollLeft + trabGrid.clientWidth >= trabGrid.scrollWidth - 10) {
        trabGrid.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        trabGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }

    function startTrabAuto() {
      trabTimer = setInterval(autoScrollTrab, 4500);
    }
    function stopTrabAuto() {
      clearInterval(trabTimer);
    }

    trabGrid.parentElement.addEventListener('mouseenter', stopTrabAuto);
    trabGrid.parentElement.addEventListener('mouseleave', startTrabAuto);

    startTrabAuto();
  }

  /* --------- FAQ ACORDEÃO --------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer   = btn.nextElementSibling;
      const isOpen   = btn.getAttribute('aria-expanded') === 'true';

      // Fecha todos
      document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });

      // Abre o clicado (se estava fechado)
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });

  /* --------- NÚMERO CONTADOR --------- */
  // (Sem números externos neste layout — mantemos estático)

})();
