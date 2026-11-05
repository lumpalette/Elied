// Uso: CommentCard({ author, rating, date, text })
// Devuelve el HTML de un comentario. El texto se escapa porque lo escribe el usuario.
function escapeCommentText(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function CommentCard(comment) {
  const stars = '★'.repeat(comment.rating) + '☆'.repeat(5 - comment.rating);
  const author = escapeCommentText(comment.author);

  return `
    <li class="comment card">
      <div class="comment-header">
        <div class="comment-avatar" aria-hidden="true">${author.charAt(0).toUpperCase()}</div>
        <div>
          <p class="comment-author">${author}</p>
          <p class="comment-date">${comment.date}</p>
        </div>
        <p class="comment-stars" role="img" aria-label="${comment.rating} de 5 estrellas">${stars}</p>
      </div>
      <p class="comment-text">${escapeCommentText(comment.text)}</p>
    </li>`;
}
