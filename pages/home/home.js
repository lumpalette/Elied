const featuredGrid = document.getElementById('featured-grid');

featuredGrid.innerHTML = PRODUCTS
  .slice(0, 4)
  .map(product => ProductCard(product, '', 3))
  .join('');