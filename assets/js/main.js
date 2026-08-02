const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-menu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('is-open', !expanded);
  });

  menu.addEventListener('click', event => {
    if (event.target.closest('a') && window.matchMedia('(max-width: 52rem)').matches) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      toggle.focus();
    }
  });
}
