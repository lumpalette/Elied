const params = new URLSearchParams(window.location.search);
const product = PRODUCTS.find(p => p.id === Number(params.get('id')));

if (product) {
  document.title = `Elied - ${product.name}`;

  const thumbnail = document.getElementById('product-thumbnail');
  thumbnail.dataset.tone = product.tone;
  thumbnail.innerHTML = ProductBadge(product);

  document.getElementById('product-category').textContent = CATEGORY_LABELS[product.category];
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-price').innerHTML = ProductPrice(product);
  document.getElementById('product-desc').textContent =
    product.description || DESCRIPTIONS[product.category];

  // Quantity selector: the chosen amount travels to the cart in the URL.
  let qty = 1;
  const qtyValue = document.getElementById('qty-value');
  const addToCart = document.getElementById('add-to-cart');

  function updateQty(next) {
    qty = Math.min(Math.max(next, 1), MAX_QTY);
    qtyValue.textContent = qty;
    addToCart.href = `../cart/cart.html?add=${product.id}&qty=${qty}`;
  }

  document.getElementById('qty-decrease').addEventListener('click', () => updateQty(qty - 1));
  document.getElementById('qty-increase').addEventListener('click', () => updateQty(qty + 1));

  updateQty(qty);

  // Related products: same category, excluding the current one.
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