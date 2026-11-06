
// Datos de ejemplo de comentarios (Comunidad) y reseñas (Campaña).
// "own: true" marca lo que escribió el usuario actual: solo eso se puede
// editar o eliminar, y es lo que aparece en su perfil.
const CURRENT_USER = 'Betabel';

// El más reciente primero.
const COMMENTS = [
  { id: 1, author: 'Persona A', rating: 5, date: 'Hace 2 días', text: 'Comentario de ejemplo A.' },
  {
    id: 2, author: CURRENT_USER, rating: 4, date: 'Hace 4 días', own: true,
    text: 'Me gustó mucho la calidad de la camisa, aunque tardó un poco en llegar.',
  },
  { id: 3, author: 'Persona C', rating: 5, date: 'Hace 1 semana', text: 'Comentario de ejemplo C.' },
  { id: 4, author: 'Persona D', rating: 3, date: 'Hace 2 semanas', text: 'Comentario de ejemplo D.' },
  {
    id: 5, author: CURRENT_USER, rating: 5, date: 'Hace 3 semanas', own: true,
    text: 'La playera vintage es justo como se ve en las fotos. Muy recomendable.',
  },
];

const REVIEWS = [
  { id: 1, author: 'Persona A', city: 'Aguascalientes', rating: 5, text: 'Texto A' },
  { id: 2, author: 'Persona B', city: 'Calvillo', rating: 5, text: 'Texto B' },
  { id: 3, author: 'Poeoquito', city: 'Aguascalientes', rating: 4, text: 'Realmente alguien va a leer esto¿' },
  {
    id: 4, author: CURRENT_USER, city: 'Calvillo', rating: 5, own: true,
    text: 'ñiñiñiñiñiñiñiñiñiñiñi',
  },
];