// Uso: ReviewCard(review)                      → solo lectura (campaña)
//      ReviewCard(review, { editable: true })  → con Editar/Eliminar si review.own (perfil)
function escapeReviewText(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function ReviewCard(review, { editable = false } = {}) {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  const author = escapeReviewText(review.city ? `${review.author}, ${review.city}` : review.author);
  const actions = editable && review.own
    ? `
      <div class="review-actions">
        <button type="button" class="link-action" data-action="edit">Editar</button>
        <button type="button" class="link-action" data-action="delete">Eliminar</button>
      </div>`
    : '';

  return `
    <figure class="review card" data-id="${review.id}">
      <p class="review-stars" role="img" aria-label="${review.rating} de 5 estrellas">${stars}</p>
      <blockquote class="review-text">${escapeReviewText(review.text)}</blockquote>
      <figcaption class="review-author">${author}</figcaption>${actions}
    </figure>`;
}