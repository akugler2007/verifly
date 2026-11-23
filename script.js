// Verifly · interacciones
(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');

  // Sombra de cabecera al hacer scroll
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menú móvil
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );

  // Enlace activo según la sección visible
  const links = [...nav.querySelectorAll('a:not(.btn)')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));

    // Animación de entrada
    const items = document.querySelectorAll('.card, .level, .section-head, .faq details, .highlights-grid > div');
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => { el.classList.add('reveal'); reveal.observe(el); });
  }

  // "Quiero información" rellena el mensaje con el plan elegido
  const msg = document.getElementById('c-msg');
  document.querySelectorAll('[data-plan]').forEach((btn) =>
    btn.addEventListener('click', () => {
      msg.value = `Hola, me interesa el plan ${btn.dataset.plan}. ¿Podéis darme más información?`;
    })
  );

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const say = (el, text, ok) => { el.textContent = text; el.className = 'form-msg ' + (ok ? 'ok' : 'err'); };

  // Newsletter (sin backend: solo validación y confirmación visual)
  const nl = document.querySelector('.nl-form');
  nl.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = nl.querySelector('input');
    const out = nl.querySelector('.form-msg');
    if (!isEmail(input.value)) {
      input.classList.add('invalid');
      return say(out, 'Introduce un correo electrónico válido.', false);
    }
    input.classList.remove('invalid');
    say(out, '¡Gracias! Te has suscrito a la newsletter de Verifly.', true);
    nl.reset();
  });

  // Contacto (sin backend: solo validación y confirmación visual)
  const cf = document.querySelector('.contact-form');
  cf.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = cf.querySelector('#c-name');
    const email = cf.querySelector('#c-email');
    const out = cf.querySelector('.form-msg');
    name.classList.toggle('invalid', !name.value.trim());
    email.classList.toggle('invalid', !isEmail(email.value));
    if (!name.value.trim() || !isEmail(email.value)) {
      return say(out, 'Revisa tu nombre y tu correo electrónico.', false);
    }
    say(out, `Gracias, ${name.value.trim().split(' ')[0]}. Te responderemos muy pronto.`, true);
    cf.reset();
  });
})();
