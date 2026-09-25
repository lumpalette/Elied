const catalogGrid = document.getElementById('catalog-grid');

catalogGrid.innerHTML = PRODUCTS
  .map(product => ProductCard(product, '../../'))
  .join('');