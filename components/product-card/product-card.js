function ProductBadge(product) {
  const tag = product.tag
    ? `<span class="badge badge-${product.tag}">${TAG_LABELS[product.tag]}</span>`
    : '';
  const community = isCommunity(product)
    ? `<span class="badge badge-community">${SOURCE_LABELS.community}</span>`
    : '';

  return tag + community;
}

function ProductPrice(product) {
  if (!product.oldPrice) return formatPrice(product.price);

  return `<s class="price-old">${formatPrice(product.oldPrice)}</s>${formatPrice(product.price)}`;
}

function ProductCard(product, root = '', level = 2) {
  const href = `${root}pages/product/product.html?id=${product.id}`;

  return `
    <li class="product-card">
      <a href="${href}" class="product-link">
        <div class="thumbnail" data-tone="${product.tone}">${ProductBadge(product)}</div>
        <h${level} class="product-name">${product.name}</h${level}>
        <p class="product-price">${ProductPrice(product)}</p>
        <p class="product-seller">${sellerLabel(product)}</p>
      </a>
      <a href="${href}" class="btn btn-sm">Ver detalle</a>
    </li>`;
}
