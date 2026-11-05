// Uso: <featured-product product-id="15" promo="ELIED10" root="../../"></featured-product>
// Muestra un producto de PRODUCTS con llamado a la acción. Si se indica "promo",
// el botón "Comprar ahora" lleva al carrito con ese código ya aplicado.
// Requiere product_data.js y product-card.js (ProductBadge, ProductPrice).
class FeaturedProduct extends HTMLElement {
  connectedCallback() {
    var productId = Number(this.getAttribute('product-id'));

    // nomás pq se ve bonito
    if (productId === 0) {
      productId = Math.floor(Math.random() * PRODUCTS.length) + 1;
    }

    const root = this.getAttribute('root') || '../../';
    const product = PRODUCTS.find(p => p.id === productId);
    const promoCode = this.getAttribute('promo');
    const promo = PROMOS[promoCode];

    if (!product) return;

    const buyHref =
      `${root}pages/cart/cart.html?add=${product.id}&qty=1` + (promo ? `&promo=${promoCode}` : '');
    const detailHref = `${root}pages/product/product.html?id=${product.id}`;

    this.innerHTML = `
      <article class="featured">
        <div class="thumbnail" data-tone="${product.tone}">${ProductBadge(product)}</div>
        <div class="featured-info">
          <p class="featured-category">${CATEGORY_LABELS[product.category]}</p>
          <h2 class="featured-name">${product.name}</h2>
          <p class="featured-price">${ProductPrice(product)}</p>
          <p class="featured-desc">${product.description || DESCRIPTIONS[product.category]}</p>
          ${promo ? `<p class="featured-promo">Al comprar se aplica el código <strong>${promoCode}</strong>: ${promo.title.toLowerCase()}.</p>` : ''}
          <div class="featured-actions">
            <a href="${buyHref}" class="btn btn-primary">Comprar ahora</a>
            <a href="${detailHref}" class="btn btn-sm">Ver detalle</a>
          </div>
        </div>
      </article>`;
  }
}

customElements.define('featured-product', FeaturedProduct);
