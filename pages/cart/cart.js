const SAMPLE_ITEMS = [
  { id: 1, qty: 1 },
  { id: 8, qty: 2 },
];
const FREE_SHIPPING_FROM = 999;
const SHIPPING_COST = 99;
const MAX_QTY = 10;
const MAX_SUGGESTIONS = 4;

const cartSubtitle = document.getElementById('cart-subtitle');
const cartList = document.getElementById('cart-list');
const cartEmpty = document.getElementById('cart-empty');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryShipping = document.getElementById('summary-shipping');
const summaryTotal = document.getElementById('summary-total');
const summaryNote = document.getElementById('summary-note');
const suggestionsSection = document.getElementById('cart-suggestions');
const suggestionsGrid = document.getElementById('suggestions-grid');

// The cart lives only in memory: it is rebuilt every time the page loads.
const params = new URLSearchParams(window.location.search);
const addedProduct = PRODUCTS.find(p => p.id === Number(params.get('add')));

let cart = addedProduct
  ? [{ id: addedProduct.id, qty: 1 }]
  : SAMPLE_ITEMS.map(item => ({ ...item }));

function findProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function CartItem(item) {
  const product = findProduct(item.id);
  const href = `../product/product.html?id=${product.id}`;

  return `
    <li class="cart-item" data-id="${product.id}">
      <a href="${href}" class="cart-item-thumb">
        <div class="thumbnail" data-tone="${product.tone}"></div>
      </a>
      <div class="cart-item-info">
        <p class="cart-item-category">${CATEGORY_LABELS[product.category]}</p>
        <h2 class="cart-item-name"><a href="${href}">${product.name}</a></h2>
        <p class="cart-item-price">${formatPrice(product.price)}</p>
      </div>
      <div class="cart-item-side">
        <div class="cart-item-qty" role="group" aria-label="Cantidad de ${product.name}">
          <button class="qty-btn" data-action="decrease" aria-label="Quitar una unidad">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" data-action="increase" aria-label="Agregar una unidad">+</button>
        </div>
        <p class="cart-item-total">${formatPrice(product.price * item.qty)}</p>
        <button class="cart-item-remove" data-action="remove" aria-label="Eliminar ${product.name}">Eliminar</button>
      </div>
    </li>`;
}

function SuggestionCard(product) {
  return `
    <li class="product-card" data-id="${product.id}">
      <div class="product-link">
        <div class="thumbnail" data-tone="${product.tone}"></div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
      </div>
      <button class="btn btn-sm" data-action="add">Agregar al carrito</button>
    </li>`;
}

function render() {
  const units = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + findProduct(item.id).price * item.qty,
    0
  );
  const shipping = subtotal >= FREE_SHIPPING_FROM || subtotal === 0 ? 0 : SHIPPING_COST;

  cartList.innerHTML = cart.map(CartItem).join('');
  cartEmpty.hidden = cart.length > 0;

  cartSubtitle.textContent =
    units === 0 ? '' : `${units} ${units === 1 ? 'producto' : 'productos'} en tu carrito`;

  summarySubtotal.textContent = formatPrice(subtotal);
  summaryShipping.textContent =
    subtotal === 0 ? '—' : shipping === 0 ? 'Gratis' : formatPrice(shipping);
  summaryTotal.textContent = formatPrice(subtotal + shipping);
  summaryNote.textContent =
    shipping > 0 ? `Te faltan ${formatPrice(FREE_SHIPPING_FROM - subtotal)} para envío gratis.` : '';

  const suggestions = PRODUCTS
    .filter(p => !cart.some(item => item.id === p.id))
    .slice(0, MAX_SUGGESTIONS);

  suggestionsGrid.innerHTML = suggestions.map(SuggestionCard).join('');
  suggestionsSection.hidden = suggestions.length === 0;
}

cartList.addEventListener('click', e => {
  const button = e.target.closest('button[data-action]');
  if (!button) return;

  const id = Number(button.closest('.cart-item').dataset.id);
  const item = cart.find(i => i.id === id);

  switch (button.dataset.action) {
    case 'increase':
      item.qty = Math.min(item.qty + 1, MAX_QTY);
      break;
    case 'decrease':
      item.qty = Math.max(item.qty - 1, 1);
      break;
    case 'remove':
      cart = cart.filter(i => i.id !== id);
      break;
  }

  render();
});

suggestionsGrid.addEventListener('click', e => {
  const button = e.target.closest('button[data-action="add"]');
  if (!button) return;

  const id = Number(button.closest('.product-card').dataset.id);
  cart.push({ id, qty: 1 });

  render();
});

render();