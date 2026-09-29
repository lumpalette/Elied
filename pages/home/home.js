const featuredGrid = document.getElementById('featured-grid');

featuredGrid.innerHTML = [...PRODUCTS]
  .sort(() => 0.5 - Math.random())
  .slice(0, 4)
  .map(product => ProductCard(product, '', 3))
  .join('');