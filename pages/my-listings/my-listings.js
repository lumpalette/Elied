const listingList = document.getElementById('listing-list');
const listingsEmpty = document.getElementById('listings-empty');
const listingsCount = document.getElementById('listings-count');
const listingsStatus = document.getElementById('listings-status');
const confirmDialog = document.querySelector('confirm-dialog');

const dialog = document.getElementById('listing-dialog');
const form = document.getElementById('listing-form');
const cancelBtn = document.getElementById('cancel-btn');
const fieldName = document.getElementById('field-name');
const fieldPrice = document.getElementById('field-price');
const fieldDescription = document.getElementById('field-description');

// Las publicaciones viven solo en memoria: al recargar vuelve la lista original.
let listings = [
  {
    id: 1,
    name: 'Chamarra de Mezclilla Vintage',
    price: 650,
    description: 'Chamarra en buen estado, talla M. Poco uso, sin manchas ni roturas.',
    tone: 4,
    date: 'Publicado hace 3 días',
  },
  {
    id: 2,
    name: 'Bolsa de Tela Bordada',
    price: 180,
    description: 'Bolsa hecha a mano con bordado floral. Ideal para el día a día.',
    tone: 2,
    date: 'Publicado hace 1 semana',
  },
];
let nextId = 3;
let editingId = null;
let statusTimer = null;

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showStatus(message) {
  listingsStatus.textContent = message;
  listingsStatus.classList.add('is-visible');
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => listingsStatus.classList.remove('is-visible'), 2500);
}

function ListingItem(listing) {
  return `
    <li class="listing" data-id="${listing.id}">
      <div class="thumbnail" data-tone="${listing.tone}"></div>
      <div class="listing-info">
        <p class="listing-date">${listing.date}</p>
        <h2 class="listing-name">${escapeHtml(listing.name)}</h2>
        <p class="listing-price">${formatPrice(listing.price)}</p>
        <p class="listing-desc">${escapeHtml(listing.description)}</p>
      </div>
      <div class="listing-actions">
        <button class="btn btn-sm" data-action="edit">Editar</button>
        <button class="btn btn-sm" data-action="delete">Eliminar</button>
      </div>
    </li>`;
}

function render() {
  listingList.innerHTML = listings.map(ListingItem).join('');
  listingsEmpty.hidden = listings.length > 0;
  listingsCount.textContent =
    `${listings.length} ${listings.length === 1 ? 'publicación' : 'publicaciones'}`;
}

const params = new URLSearchParams(window.location.search);
const newName = (params.get('name') || '').trim();
const newPrice = Number(params.get('price'));

if (newName && newPrice > 0) {
  listings.unshift({
    id: nextId++,
    name: newName,
    price: newPrice,
    description: (params.get('description') || '').trim(),
    tone: Math.ceil(Math.random() * 8),
    date: 'Publicado justo ahora',
  });
  showStatus('Publicado ');

  history.replaceState(null, '', window.location.pathname);
}

function openDialog(listing) {
  editingId = listing.id;
  fieldName.value = listing.name;
  fieldPrice.value = listing.price;
  fieldDescription.value = listing.description;

  dialog.showModal();
  fieldName.focus();
}

cancelBtn.addEventListener('click', () => dialog.close());

form.addEventListener('submit', e => {
  e.preventDefault();

  const listing = listings.find(l => l.id === editingId);
  listing.name = fieldName.value.trim();
  listing.price = Number(fieldPrice.value);
  listing.description = fieldDescription.value.trim();

  dialog.close();
  showStatus('Publicación actualizada ');
  render();
});

listingList.addEventListener('click', async e => {
  const button = e.target.closest('button[data-action]');
  if (!button) return;

  const id = Number(button.closest('.listing').dataset.id);
  const listing = listings.find(l => l.id === id);

  if (button.dataset.action === 'edit') {
    openDialog(listing);
  } else if (button.dataset.action === 'delete') {
    const confirmed = await confirmDialog.ask({
      title: '¿Eliminar publicación?',
      message: `Se eliminará "${listing.name}" de tus publicaciones.`,
      confirmLabel: 'Eliminar',
    });
    if (!confirmed) return;

    listings = listings.filter(l => l.id !== id);
    showStatus('Publicación eliminada');
    render();
  }
});

render();
