const params = new URLSearchParams(window.location.search);
const product = PRODUCTS.find(p => p.id === Number(params.get('id')));

if (product) {
  document.title = `Elied - ${product.name}`;
  document.getElementById('product-thumbnail').dataset.tone = product.tone;
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-price').textContent = formatPrice(product.price);
  document.getElementById('product-desc').textContent = product.description;
} else {
  document.getElementById('product-detail').innerHTML =
    '<p class="page-subtitle">Producto no encontrado.</p>';
}