function ProductCard(product, root = '', level = 2) {
  const href = `${root}pages/product/product.html?id=${product.id}`;

  return `
    <li class="product-card">
      <a href="${href}" class="product-link">
        <div class="thumbnail" data-tone="${product.tone}"></div>
        <h${level} class="product-name">${product.name}</h${level}>
        <p class="product-price">${formatPrice(product.price)}</p>
      </a>
      <a href="${href}" class="btn btn-sm">Ver detalle</a>
    </li>`;
}

function formatPrice(price) {
  return `$${price} MXN`;
}