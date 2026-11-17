// Uso: <order-history root="../../"></order-history>
// Historial de pedidos simulado. "Ver detalle" abre el ticket con los datos del pedido.
const CUSTOMER = { name: 'Betabel', email: 'poeoquito.bb@ejemplo.com' };

const STATUS_LABELS = {
  delivered: 'Entregado',
  shipped: 'En camino',
  pending: 'Pendiente de pago',
};

// Pedidos "anteriores" (falsos). items usa el mismo formato que el checkout: id:cantidad
const ORDERS = [
  { order: 'ELD-482913', date: '2026-11-10', method: 'card',     status: 'shipped',   items: '5:1,16:2' },
  { order: 'ELD-317560', date: '2026-10-22', method: 'wallet',   status: 'delivered', items: '2:2,8:1' },
  { order: 'ELD-205847', date: '2026-09-30', method: 'transfer', status: 'delivered', items: '4:1' },
  { order: 'ELD-118402', date: '2026-09-02', method: 'cash',     status: 'pending',   items: '11:1,3:1' },
];

// Mismas reglas de envío que el checkout.
const FREE_SHIPPING_FROM = 999;
const SHIPPING_COST = 99;

function orderTotal(items) {
  const subtotal = items
    .split(',')
    .map(pair => pair.split(':').map(Number))
    .reduce((sum, [id, qty]) => sum + PRODUCTS.find(p => p.id === id).price * qty, 0);
  return subtotal >= FREE_SHIPPING_FROM ? subtotal : subtotal + SHIPPING_COST;
}

function itemCount(items) {
  return items.split(',').reduce((sum, pair) => sum + Number(pair.split(':')[1]), 0);
}

class OrderHistory extends HTMLElement {
  connectedCallback() {
    const root = this.getAttribute('root') || '../../';

    this.innerHTML = `
      <ul class="order-list">
        ${ORDERS.map(o => {
          const total = orderTotal(o.items);
          const params = new URLSearchParams({ ...o, total, ...CUSTOMER });
          const date = new Date(`${o.date}T12:00:00`).toLocaleDateString('es-MX', {
            day: 'numeric', month: 'long', year: 'numeric',
          });
          const count = itemCount(o.items);

          return `
            <li class="order-card card">
              <div class="order-main">
                <p class="order-number">${o.order}</p>
                <p class="order-meta">${date} · ${count} ${count === 1 ? 'producto' : 'productos'}</p>
              </div>
              <span class="order-status order-status-${o.status}">${STATUS_LABELS[o.status]}</span>
              <p class="order-total">${formatPrice(total)}</p>
              <a href="${root}pages/ticket/ticket.html?${params}" class="btn btn-sm">Ver detalle</a>
            </li>`;
        }).join('')}
      </ul>`;
  }
}

customElements.define('order-history', OrderHistory);