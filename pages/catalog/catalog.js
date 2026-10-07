const catalogGrid = document.getElementById('catalog-grid');
const catalogCount = document.getElementById('catalog-count');
const catalogEmpty = document.getElementById('catalog-empty');
const chips = document.querySelectorAll('.chip');
const sortSelect = document.getElementById('sort');
const searchBar = document.querySelector('search-bar');

const state = {
  category: 'all',
  sort: 'default',
  query: '',
};

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getVisibleProducts() {
  const query = normalize(state.query.trim());

  const products = PRODUCTS.filter(p => {
    const matchesCategory = state.category === 'all' || p.category === state.category;
    const matchesQuery =
      query === '' ||
      normalize(p.name).includes(query) ||
      normalize(CATEGORY_LABELS[p.category]).includes(query);

    return matchesCategory && matchesQuery;
  });

  switch (state.sort) {
    case 'price-asc':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      products.sort((a, b) =>
        a.name.localeCompare(b.name, 'es', { numeric: true })
      );
      break;
  }

  return products;
}

function render() {
  const products = getVisibleProducts();

  catalogGrid.innerHTML = products
    .map(product => ProductCard(product, '../../'))
    .join('');

  catalogCount.textContent =
    `Mostrando ${products.length} de ${PRODUCTS.length} productos`;
  catalogEmpty.hidden = products.length > 0;
}

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    state.category = chip.dataset.category;

    chips.forEach(c => {
      const isActive = c === chip;
      c.classList.toggle('is-active', isActive);
      c.setAttribute('aria-pressed', isActive);
    });

    render();
  });
});

sortSelect.addEventListener('change', () => {
  state.sort = sortSelect.value;
  render();
});

searchBar.addEventListener('search-input', e => {
  state.query = e.detail;
  render();
});

render();