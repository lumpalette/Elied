// Las reseñas aquí son solo de lectura: se escriben y editan desde el perfil.
document.getElementById('review-grid').innerHTML = REVIEWS
  .map(review => ReviewCard(review))
  .join('');