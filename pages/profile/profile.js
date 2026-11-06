const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', function () {
    window.location.href = "../../index.html";
});

const confirmDialog = document.querySelector('confirm-dialog');

// Devuelve una función que muestra un mensaje en el elemento y lo oculta solo.
// Todo lo de esta página vive en memoria: al recargar vuelven los datos originales.
function createStatus(element) {
    let timer = null;

    return message => {
        element.textContent = message;
        element.classList.add('is-visible');
        clearTimeout(timer);
        timer = setTimeout(() => element.classList.remove('is-visible'), 2500);
    };
}

/* ---------- Mis datos ---------- */

const profileAvatar = document.getElementById('profile-avatar');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const dataName = document.getElementById('data-name');
const dataEmail = document.getElementById('data-email');
const dataPhone = document.getElementById('data-phone');
const dataCity = document.getElementById('data-city');
const showProfileStatus = createStatus(document.getElementById('profile-status'));

const profileDialog = document.getElementById('profile-dialog');
const profileForm = document.getElementById('profile-form');
const fieldName = document.getElementById('field-name');
const fieldEmail = document.getElementById('field-email');
const fieldPhone = document.getElementById('field-phone');
const fieldCity = document.getElementById('field-city');

document.getElementById('edit-profile-btn').addEventListener('click', () => {
    fieldName.value = dataName.textContent;
    fieldEmail.value = dataEmail.textContent;
    fieldPhone.value = dataPhone.textContent;
    fieldCity.value = dataCity.textContent;

    profileDialog.showModal();
    fieldName.focus();
});

document.getElementById('cancel-profile-btn').addEventListener('click', () => profileDialog.close());

profileForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = fieldName.value.trim();
    const email = fieldEmail.value.trim();

    dataName.textContent = name;
    dataEmail.textContent = email;
    dataPhone.textContent = fieldPhone.value.trim() || '—';
    dataCity.textContent = fieldCity.value.trim() || '—';

    profileName.textContent = name;
    profileEmail.textContent = email;
    profileAvatar.textContent = name.charAt(0).toUpperCase();

    profileDialog.close();
    showProfileStatus('Datos actualizados ');
});

/* ---------- Mis comentarios ---------- */

const commentList = document.getElementById('my-comment-list');
const commentsEmpty = document.getElementById('my-comments-empty');
const showCommentStatus = createStatus(document.getElementById('comments-status'));

const commentDialog = document.getElementById('comment-dialog');
const commentDialogTitle = document.getElementById('comment-dialog-title');
const commentForm = document.getElementById('comment-form');
const fieldCommentRating = document.getElementById('comment-rating');
const fieldCommentText = document.getElementById('comment-text');

// Solo se muestran (y se pueden editar) los comentarios del usuario.
let myComments = COMMENTS.filter(c => c.own).map(c => ({ ...c }));
let nextCommentId = 1000;
let editingCommentId = null;

function renderComments() {
    commentList.innerHTML = myComments.map(CommentCard).join('');
    commentsEmpty.hidden = myComments.length > 0;
}

function openCommentDialog(comment) {
    editingCommentId = comment ? comment.id : null;
    commentDialogTitle.textContent = comment ? 'Editar comentario' : 'Escribir comentario';
    fieldCommentRating.value = comment ? comment.rating : 5;
    fieldCommentText.value = comment ? comment.text : '';

    commentDialog.showModal();
    fieldCommentText.focus();
}

document.getElementById('new-comment-btn').addEventListener('click', () => openCommentDialog(null));
document.getElementById('cancel-comment-btn').addEventListener('click', () => commentDialog.close());

commentForm.addEventListener('submit', e => {
    e.preventDefault();

    const rating = Number(fieldCommentRating.value);
    const text = fieldCommentText.value.trim();

    if (editingCommentId === null) {
        myComments.unshift({
            id: nextCommentId++,
            author: dataName.textContent,
            rating,
            date: 'Justo ahora',
            text,
            own: true,
        });
        showCommentStatus('Comentario publicado ');
    } else {
        Object.assign(myComments.find(c => c.id === editingCommentId), { rating, text, edited: true });
        showCommentStatus('Comentario actualizado ');
    }

    commentDialog.close();
    renderComments();
});

commentList.addEventListener('click', async e => {
    const button = e.target.closest('[data-action]');
    if (!button) return;

    const id = Number(button.closest('.comment').dataset.id);
    const comment = myComments.find(c => c.id === id);

    if (button.dataset.action === 'edit') {
        openCommentDialog(comment);
    } else if (button.dataset.action === 'delete') {
        const confirmed = await confirmDialog.ask({
            title: '¿Eliminar comentario?',
            message: 'Tu comentario se quitará de la comunidad .',
            confirmLabel: 'Eliminar',
        });
        if (!confirmed) return;

        myComments = myComments.filter(c => c.id !== id);
        showCommentStatus('Comentario eliminado ');
        renderComments();
    }
});

/* ---------- Mis reseñas ---------- */

const reviewList = document.getElementById('my-review-list');
const reviewsEmpty = document.getElementById('my-reviews-empty');
const showReviewStatus = createStatus(document.getElementById('reviews-status'));

const reviewDialog = document.getElementById('review-dialog');
const reviewDialogTitle = document.getElementById('review-dialog-title');
const reviewForm = document.getElementById('review-form');
const fieldReviewCity = document.getElementById('review-city');
const fieldReviewRating = document.getElementById('review-rating');
const fieldReviewText = document.getElementById('review-text');

// Solo se muestran (y se pueden editar) las reseñas del usuario.
let myReviews = REVIEWS.filter(r => r.own).map(r => ({ ...r }));
let nextReviewId = 1000;
let editingReviewId = null;

function renderReviews() {
    reviewList.innerHTML = myReviews
        .map(review => `<li>${ReviewCard(review, { editable: true })}</li>`)
        .join('');
    reviewsEmpty.hidden = myReviews.length > 0;
}

function openReviewDialog(review) {
    editingReviewId = review ? review.id : null;
    reviewDialogTitle.textContent = review ? 'Editar reseña' : 'Escribir reseña';
    fieldReviewCity.value = review ? review.city : '';
    fieldReviewRating.value = review ? review.rating : 5;
    fieldReviewText.value = review ? review.text : '';

    reviewDialog.showModal();
    fieldReviewText.focus();
}

document.getElementById('new-review-btn').addEventListener('click', () => openReviewDialog(null));
document.getElementById('cancel-review-btn').addEventListener('click', () => reviewDialog.close());

reviewForm.addEventListener('submit', e => {
    e.preventDefault();

    const data = {
        city: fieldReviewCity.value.trim(),
        rating: Number(fieldReviewRating.value),
        text: fieldReviewText.value.trim(),
    };

    if (editingReviewId === null) {
        myReviews.unshift({ id: nextReviewId++, author: dataName.textContent, own: true, ...data });
        showReviewStatus('Reseña publicada ');
    } else {
        Object.assign(myReviews.find(r => r.id === editingReviewId), data);
        showReviewStatus('Reseña actualizada ');
    }

    reviewDialog.close();
    renderReviews();
});

reviewList.addEventListener('click', async e => {
    const button = e.target.closest('[data-action]');
    if (!button) return;

    const id = Number(button.closest('.review').dataset.id);

    if (button.dataset.action === 'edit') {
        openReviewDialog(myReviews.find(r => r.id === id));
    } else if (button.dataset.action === 'delete') {
        const confirmed = await confirmDialog.ask({
            title: '¿Eliminar reseña?',
            message: 'Tu reseña se quitará de la campaña .',
            confirmLabel: 'Eliminar',
        });
        if (!confirmed) return;

        myReviews = myReviews.filter(r => r.id !== id);
        showReviewStatus('Reseña eliminada ');
        renderReviews();
    }
});

renderComments();
renderReviews();