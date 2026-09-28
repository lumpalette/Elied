const catalogGrid = document.getElementById('catalog-grid');
const catalogCount = document.getElementById('catalog-count');
const catalogEmpty = document.getElementById('catalog-empty');
const chips = document.querySelectorAll('.chip');
const sortSelect = document.getElementById('sort');

const state = {
  category: 'all',
  sort: 'default',
};

function getVisibleProducts() {
  const products = PRODUCTS.filter(
    p => state.category === 'all' || p.category === state.category
  );

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

render();