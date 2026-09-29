const params = new URLSearchParams(window.location.search);
const product = PRODUCTS.find(p => p.id === Number(params.get('id')));

if (product) {
  document.title = `Elied - ${product.name}`;
  document.getElementById('product-thumbnail').dataset.tone = product.tone;
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-price').textContent = formatPrice(product.price);
  document.getElementById('product-category').textContent = CATEGORY_LABELS[product.category];
  document.getElementById('product-desc').textContent = product.description || DESCRIPTIONS[product.category];
  document.getElementById('add-to-cart').href = `../cart/cart.html?add=${product.id}`;

  const related = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  if (related.length > 0) {
    document.getElementById('related-grid').innerHTML = related
      .map(p => ProductCard(p, '../../', 3))
      .join('');
    document.getElementById('product-related').hidden = false;
  }
} else {
  document.getElementById('product-detail').innerHTML =
    '<p class="page-subtitle">Producto no encontrado.</p>';
}