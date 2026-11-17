// Uso: <order-confirmation root="../../"></order-confirmation>
// Muestra el resultado del pago simulado con los datos que llegan en la URL.
const PAYMENT_LABELS = {
  card: 'Tarjeta de crédito/débito',
  transfer: 'Transferencia',
  cash: 'Efectivo',
  wallet: 'Monedero electrónico',
};

class OrderConfirmation extends HTMLElement {
  connectedCallback() {
    const root = this.getAttribute('root') || '../../';
    const params = new URLSearchParams(window.location.search);

    const order = params.get('order') || 'ELD-000000';
    const method = params.get('method') || 'card';
    const total = Number(params.get('total')) || 0;
    const promo = params.get('promo');
    const isCash = method === 'cash';

    const items = (params.get('items') || '')
      .split(',')
      .map(pair => {
        const [id, qty] = pair.split(':').map(Number);
        return { product: PRODUCTS.find(p => p.id === id), qty: qty || 1 };
      })
      .filter(item => item.product);

    const date = new Date().toLocaleDateString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    this.innerHTML = `
      <article class="confirmation-card card">
        <header class="confirmation-header">
          <span class="confirmation-icon" aria-hidden="true">✓</span>
          <h1 class="confirmation-title">${isCash ? 'Pedido registrado' : 'Pago aprobado'}</h1>
          <p class="confirmation-text">
            ${isCash
              ? 'Tu pedido se confirmará cuando pagues en tienda con tu referencia.'
              : 'Gracias por tu compra. Te enviamos un correo con los detalles.'}
          </p>
        </header>

        <dl class="data-list confirmation-data">
          <div class="info"><dt>Número de pedido</dt><dd>${order}</dd></div>
          <div class="info"><dt>Fecha</dt><dd>${date}</dd></div>
          <div class="info"><dt>Método de pago</dt><dd>${PAYMENT_LABELS[method] || method}</dd></div>
          ${promo ? `<div class="info"><dt>Código aplicado</dt><dd>${promo}</dd></div>` : ''}
        </dl>

        <h2 class="confirmation-subtitle">Resumen de compra</h2>
        <ul class="summary-items">
          ${items.map(({ product, qty }) => `
            <li class="summary-item">
              <span class="summary-item-name">${product.name}
                <span class="summary-item-qty">Cantidad: ${qty}</span>
              </span>
              <span class="summary-item-price">${formatPrice(product.price * qty)}</span>
            </li>`).join('')}
        </ul>
        <p class="confirmation-total"><span>Total</span><strong>${formatPrice(total)}</strong></p>

        <div class="confirmation-actions">
          <a href="${root}pages/ticket/ticket.html?${params}" class="btn btn-primary">Ver ticket</a>
          <a href="${root}pages/catalog/catalog.html" class="btn btn-sm">Seguir comprando</a>
        </div>
      </article>`;
  }
}

customElements.define('order-confirmation', OrderConfirmation);