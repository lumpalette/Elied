const adminBody = document.getElementById('admin-body');
const adminEmpty = document.getElementById('admin-empty');
const adminStatus = document.getElementById('admin-status');
const searchBar = document.querySelector('search-bar');
const confirmDialog = document.querySelector('confirm-dialog');
const newProductBtn = document.getElementById('new-product-btn');

const statProducts = document.getElementById('stat-products');
const statCategories = document.getElementById('stat-categories');
const statAverage = document.getElementById('stat-average');

const dialog = document.getElementById('product-dialog');
const dialogTitle = document.getElementById('dialog-title');
const form = document.getElementById('product-form');
const cancelBtn = document.getElementById('cancel-btn');
const fieldName = document.getElementById('field-name');
const fieldCategory = document.getElementById('field-category');
const fieldPrice = document.getElementById('field-price');
const fieldDescription = document.getElementById('field-description');

// Changes live only in memory: reloading the page restores the original list.
let products = PRODUCTS.map(p => ({ ...p }));
let nextId = Math.max(...products.map(p => p.id)) + 1;
let editingId = null;
let statusTimer = null;
let query = '';

fieldCategory.innerHTML = Object.entries(CATEGORY_LABELS)
  .map(([value, label]) => `<option value="${value}">${label}</option>`)
  .join('');

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showStatus(message) {
  adminStatus.textContent = message;
  adminStatus.classList.add('is-visible');
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => adminStatus.classList.remove('is-visible'), 2500);
}

function ProductRow(product) {
  return `
    <tr data-id="${product.id}">
      <td><div class="thumbnail" data-tone="${product.tone}"></div></td>
      <td class="cell-name">${escapeHtml(product.name)}</td>
      <td>${CATEGORY_LABELS[product.category]}</td>
      <td>${formatPrice(product.price)}</td>
      <td>
        <div class="cell-actions">
          <button class="btn btn-sm" data-action="edit">Editar</button>
          <button class="btn btn-sm" data-action="delete">Eliminar</button>
        </div>
      </td>
    </tr>`;
}

function renderStats() {
  const total = products.length;
  const categories = new Set(products.map(p => p.category)).size;
  const average = total === 0
    ? 0
    : Math.round(products.reduce((sum, p) => sum + p.price, 0) / total);

  statProducts.textContent = total;
  statCategories.textContent = categories;
  statAverage.textContent = total === 0 ? '—' : formatPrice(average);
}

function render() {
  const term = query.trim().toLowerCase();
  const visible = products.filter(p => p.name.toLowerCase().includes(term));

  adminBody.innerHTML = visible.map(ProductRow).join('');
  adminEmpty.hidden = visible.length > 0;
  renderStats();
}

function openDialog(product) {
  editingId = product ? product.id : null;
  dialogTitle.textContent = product ? 'Editar producto' : 'Nuevo producto';

  fieldName.value = product ? product.name : '';
  fieldCategory.value = product ? product.category : Object.keys(CATEGORY_LABELS)[0];
  fieldPrice.value = product ? product.price : '';
  fieldDescription.value = product && product.description ? product.description : '';

  dialog.showModal();
  fieldName.focus();
}

newProductBtn.addEventListener('click', () => openDialog(null));
cancelBtn.addEventListener('click', () => dialog.close());

searchBar.addEventListener('search-input', e => {
  query = e.detail;
  render();
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = {
    name: fieldName.value.trim(),
    category: fieldCategory.value,
    price: Number(fieldPrice.value),
  };
  const description = fieldDescription.value.trim();

  if (editingId === null) {
    const product = { id: nextId++, tone: Math.ceil(Math.random() * 8), ...data };
    if (description) product.description = description;
    products.push(product);
    showStatus('Producto agregado (simulado)');
  } else {
    const product = products.find(p => p.id === editingId);
    Object.assign(product, data);
    if (description) {
      product.description = description;
    } else {
      delete product.description;
    }
    showStatus('Producto actualizado (simulado)');
  }

  dialog.close();
  render();
});

adminBody.addEventListener('click', async e => {
  const button = e.target.closest('button[data-action]');
  if (!button) return;

  const id = Number(button.closest('tr').dataset.id);
  const product = products.find(p => p.id === id);

  if (button.dataset.action === 'edit') {
    openDialog(product);
  } else if (button.dataset.action === 'delete') {
    const confirmed = await confirmDialog.ask({
      title: '¿Eliminar producto?',
      message: `Se eliminará "${product.name}" del panel (simulado).`,
      confirmLabel: 'Eliminar',
    });
    if (!confirmed) return;

    products = products.filter(p => p.id !== id);
    showStatus('Producto eliminado (simulado)');
    render();
  }
});

render();