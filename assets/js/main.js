const root = document.documentElement;
const themeToggle = document.querySelector('[data-theme-toggle]');
const themePreference = window.matchMedia('(prefers-color-scheme: dark)');
const themeKey = 'madpindev-theme';

const storedTheme = () => {
  try {
    return localStorage.getItem(themeKey);
  } catch {
    return null;
  }
};

const applyTheme = (theme, persist = false) => {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  if (persist) {
    try {
      localStorage.setItem(themeKey, theme);
    } catch {}
  }
  if (!themeToggle) return;
  const dark = theme === 'dark';
  const label = dark ? themeToggle.dataset.lightLabel : themeToggle.dataset.darkLabel;
  themeToggle.setAttribute('aria-label', label);
  themeToggle.setAttribute('title', label);
  themeToggle.setAttribute('aria-pressed', String(dark));
  themeToggle.querySelector('[data-theme-label]').textContent = label;
  themeToggle.querySelector('[data-theme-icon]').textContent = dark ? '☀' : '◐';
};

applyTheme(root.dataset.theme || (themePreference.matches ? 'dark' : 'light'));

themeToggle?.addEventListener('click', () => {
  applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
});

themePreference.addEventListener('change', event => {
  if (!storedTheme()) applyTheme(event.matches ? 'dark' : 'light');
});

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
