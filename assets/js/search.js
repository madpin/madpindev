const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const status = document.querySelector('#search-status');
const results = document.querySelector('#search-results');
let pagefind;

const textFromHTML = value => {
  const documentFragment = new DOMParser().parseFromString(value || '', 'text/html');
  return documentFragment.body.textContent || '';
};

const resultCard = data => {
  const article = document.createElement('article');
  article.className = 'search-result';
  const heading = document.createElement('h2');
  const link = document.createElement('a');
  link.href = data.url;
  link.textContent = data.meta.title || data.url;
  heading.append(link);
  const excerpt = document.createElement('p');
  excerpt.textContent = textFromHTML(data.excerpt);
  article.append(heading, excerpt);
  return article;
};

const search = async query => {
  status.textContent = document.documentElement.lang.startsWith('pt') ? 'Pesquisando…' : 'Searching…';
  results.replaceChildren();
  try {
    pagefind ||= await import('/pagefind/pagefind.js');
    const response = await pagefind.search(query);
    const data = await Promise.all(response.results.slice(0, 20).map(result => result.data()));
    data.forEach(item => results.append(resultCard(item)));
    status.textContent = document.documentElement.lang.startsWith('pt')
      ? `${response.results.length} resultado(s)`
      : `${response.results.length} result(s)`;
  } catch {
    status.textContent = document.documentElement.lang.startsWith('pt')
      ? 'A pesquisa não está disponível neste momento.'
      : 'Search is unavailable right now.';
  }
};

form?.addEventListener('submit', event => {
  event.preventDefault();
  const query = input.value.trim();
  if (query.length >= 2) {
    const url = new URL(window.location.href);
    url.searchParams.set('q', query);
    history.replaceState({}, '', url);
    search(query);
  }
});

const initialQuery = new URL(window.location.href).searchParams.get('q');
if (initialQuery) {
  input.value = initialQuery;
  search(initialQuery);
}
