const commentForm = document.getElementById('comment-form');
const commentList = document.getElementById('comment-list');
const commentCount = document.getElementById('comment-count');
const commentsEmpty = document.getElementById('comments-empty');
const formStatus = document.getElementById('form-status');
const confirmDialog = document.querySelector('confirm-dialog');

const fieldRating = document.getElementById('comment-rating');
const fieldText = document.getElementById('comment-text');

const dialog = document.getElementById('comment-dialog');
const editForm = document.getElementById('edit-form');
const editRating = document.getElementById('edit-rating');
const editText = document.getElementById('edit-text');

document.getElementById('comment-as').textContent = CURRENT_USER;

// Los comentarios viven solo en memoria: al recargar vuelve la lista original.
// Solo los del usuario ("own") muestran los enlaces Editar y Eliminar.
let comments = COMMENTS.map(c => ({ ...c }));
let nextId = 100;
let editingId = null;
let statusTimer = null;

function showStatus(message) {
  formStatus.textContent = message;
  formStatus.classList.add('is-visible');
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => formStatus.classList.remove('is-visible'), 2500);
}

function render() {
  commentList.innerHTML = comments.map(CommentCard).join('');
  commentsEmpty.hidden = comments.length > 0;
  commentCount.textContent =
    `${comments.length} ${comments.length === 1 ? 'comentario' : 'comentarios'}`;
}

// Crear
commentForm.addEventListener('submit', e => {
  e.preventDefault();

  comments.unshift({
    id: nextId++,
    author: CURRENT_USER,
    rating: Number(fieldRating.value),
    date: 'Justo ahora',
    text: fieldText.value.trim(),
    own: true,
  });

  showStatus('Comentario publicado ');
  commentForm.reset();
  render();
});

// Editar y eliminar (solo los comentarios propios tienen estos enlaces)
commentList.addEventListener('click', async e => {
  const button = e.target.closest('[data-action]');
  if (!button) return;

  const id = Number(button.closest('.comment').dataset.id);
  const comment = comments.find(c => c.id === id);

  if (button.dataset.action === 'edit') {
    editingId = id;
    editRating.value = comment.rating;
    editText.value = comment.text;

    dialog.showModal();
    editText.focus();
  } else if (button.dataset.action === 'delete') {
    const confirmed = await confirmDialog.ask({
      title: '¿Eliminar comentario?',
      message: 'Tu comentario se quitará de la comunidad .',
      confirmLabel: 'Eliminar',
    });
    if (!confirmed) return;

    comments = comments.filter(c => c.id !== id);
    showStatus('Comentario eliminado ');
    render();
  }
});

document.getElementById('cancel-edit-btn').addEventListener('click', () => dialog.close());

editForm.addEventListener('submit', e => {
  e.preventDefault();

  const comment = comments.find(c => c.id === editingId);
  comment.rating = Number(editRating.value);
  comment.text = editText.value.trim();
  comment.edited = true;

  dialog.close();
  showStatus('Comentario actualizado ');
  render();
});

render();