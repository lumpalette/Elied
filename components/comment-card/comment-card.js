// Uso: CommentCard({ id, author, rating, date, text, own, edited })
// Devuelve el HTML de un comentario. Si "own" es true (comentario del usuario),
// muestra los enlaces Editar y Eliminar. El texto se escapa porque lo escribe el usuario.
function escapeCommentText(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function CommentCard(comment) {
  const stars = '★'.repeat(comment.rating) + '☆'.repeat(5 - comment.rating);
  const author = escapeCommentText(comment.author);
  const edited = comment.edited ? ' · editado' : '';
  const actions = comment.own
    ? `
      <div class="comment-actions">
        <button type="button" class="link-action" data-action="edit">Editar</button>
        <button type="button" class="link-action" data-action="delete">Eliminar</button>
      </div>`
    : '';

  return `
    <li class="comment card" data-id="${comment.id}">
      <div class="comment-header">
        <div class="comment-avatar" aria-hidden="true">${author.charAt(0).toUpperCase()}</div>
        <div>
          <p class="comment-author">${author}</p>
          <p class="comment-date">${comment.date}${edited}</p>
        </div>
        <p class="comment-stars" role="img" aria-label="${comment.rating} de 5 estrellas">${stars}</p>
      </div>
      <p class="comment-text">${escapeCommentText(comment.text)}</p>${actions}
    </li>`;
}