// Uso: <order-ticket root="../../"></order-ticket>
// Ticket/factura visual del pedido. Todo es simulado.
const PAYMENT_LABELS = {
  card: 'Tarjeta de crédito/débito',
  transfer: 'Transferencia',
  cash: 'Efectivo',
  wallet: 'Monedero electrónico',
};

const BUSINESS = {
  name: 'Elied Ropa y Accesorios',
  rfc: 'ELI000000XX0',
  address: 'Calvillo, Aguascalientes',
};

class OrderTicket extends HTMLElement {
  connectedCallback() {
    const root = this.getAttribute('root') || '../../';
    const params = new URLSearchParams(window.location.search);

    const order = params.get('order') || 'ELD-000000';
    const method = params.get('method') || 'card';
    const total = Number(params.get('total')) || 0;
    const promo = params.get('promo');
    const name = params.get('name') || 'Betabel';
    const email = params.get('email') || 'poeoquito.bb@ejemplo.com';

    const items = (params.get('items') || '')
      .split(',')
      .map(pair => {
        const [id, qty] = pair.split(':').map(Number);
        return { product: PRODUCTS.find(p => p.id === id), qty: qty || 1 };
      })
      .filter(item => item.product);

    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
    const adjustment = total - subtotal; // envío (+) y descuentos (−)

    const now = params.get('date') ? new Date(`${params.get('date')}T12:00:00`) : new Date();
    const date = now.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    const folio = `F-${order.replace(/\D/g, '').slice(-6).padStart(6, '0')}`;

    this.innerHTML = `
      <article class="ticket card">
        <header class="ticket-header">
          <h1 class="ticket-business">${BUSINESS.name}</h1>
          <p class="ticket-muted">RFC ${BUSINESS.rfc} · ${BUSINESS.address}</p>
          <p class="ticket-label">Comprobante de compra (simulado)</p>
        </header>

        <dl class="data-list ticket-data">
          <div class="info"><dt>Folio</dt><dd>${folio}</dd></div>
          <div class="info"><dt>Pedido</dt><dd>${order}</dd></div>
          <div class="info"><dt>Fecha</dt><dd>${date}, ${time}</dd></div>
          <div class="info"><dt>Método de pago</dt><dd>${PAYMENT_LABELS[method] || method}</dd></div>
          <div class="info"><dt>Cliente</dt><dd>${name}</dd></div>
          <div class="info"><dt>Correo</dt><dd>${email}</dd></div>
        </dl>

        <table class="ticket-table">
          <thead>
            <tr><th>Producto</th><th>Cant.</th><th>P. unit.</th><th>Importe</th></tr>
          </thead>
          <tbody>
            ${items.map(({ product, qty }) => `
              <tr>
                <td>${product.name}</td>
                <td>${qty}</td>
                <td>${formatPrice(product.price)}</td>
                <td>${formatPrice(product.price * qty)}</td>
              </tr>`).join('')}
          </tbody>
        </table>

        <dl class="ticket-totals">
          <div><dt>Subtotal</dt><dd>${formatPrice(subtotal)}</dd></div>
          ${adjustment !== 0 ? `
            <div><dt>Envío y descuentos${promo ? ` (${promo})` : ''}</dt>
            <dd>${adjustment > 0 ? '' : '−'}${formatPrice(Math.abs(adjustment))}</dd></div>` : ''}
          <div class="ticket-total"><dt>Total</dt><dd>${formatPrice(total)}</dd></div>
        </dl>
        <p class="ticket-muted ticket-note">Precios con IVA incluido. Gracias por comprar en Elied.</p>

        <div class="ticket-actions">
          <a href="javascript:history.back()" class="btn btn-sm">Regresar</a>
          <button type="button" class="btn btn-primary" id="ticket-download">Descargar PDF</button>
        </div>
        <p class="form-status" id="ticket-status" role="status" aria-live="polite"></p>
      </article>`;

    this.querySelector('#ticket-download').addEventListener('click', () => window.print());
  }
}

customElements.define('order-ticket', OrderTicket);