// Uso: <promo-card code="ELIED10" root="../../"></promo-card>
// Lee los datos de la promoción desde PROMOS (shared/product_data.js).
class PromoCard extends HTMLElement {
  connectedCallback() {
    const code = this.getAttribute('code');
    const root = this.getAttribute('root') || '../../';
    const promo = PROMOS[code];

    if (!promo) return;

    this.innerHTML = `
      <article class="promo-card card">
        <span class="promo-tag">${promo.tag}</span>
        <h2 class="promo-title">${promo.title}</h2>
        <p class="promo-desc">${promo.description}</p>
        <p class="promo-note">${promo.note}</p>
        <p class="promo-code" aria-label="Código de descuento">${code}</p>
        <a href="${root}pages/cart/cart.html?promo=${code}" class="btn btn-primary btn-block">Aplicar</a>
      </article>`;
  }
}

customElements.define('promo-card', PromoCard);
