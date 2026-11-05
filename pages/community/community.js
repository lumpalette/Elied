const commentForm = document.getElementById('comment-form');
const commentList = document.getElementById('comment-list');
const commentCount = document.getElementById('comment-count');

const formStatus = document.getElementById('form-status');

const fieldAuthor = document.getElementById('comment-author');
const fieldRating = document.getElementById('comment-rating');
const fieldText = document.getElementById('comment-text');

let comments = [
  { author: 'Persona A', rating: 5, date: 'Hace 2 días', text: 'Comentario A.' },
  { author: 'Persona B', rating: 4, date: 'Hace 5 días', text: 'Comentario B.' },
  { author: 'Persona C', rating: 5, date: 'Hace 1 semana', text: 'Comentario C.' },
  { author: 'Poeoquito', rating: 3, date: 'Hace 2 semanas', text: 'poeoquito' },
];

function render() {
  commentList.innerHTML = comments.map(CommentCard).join('');
  commentCount.textContent =
    `${comments.length} ${comments.length === 1 ? 'comentario' : 'comentarios'}`;
}

commentForm.addEventListener('submit', e => {
  e.preventDefault();

  comments.unshift({
    author: fieldAuthor.value.trim(),
    rating: Number(fieldRating.value),
    date: 'Justo ahora',
    text: fieldText.value.trim(),
  });

  formStatus.textContent = 'Comentario publicado (nocierto)';
  formStatus.classList.add('is-visible');
  commentForm.reset();

  render();
});

render();
