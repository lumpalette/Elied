const promoBody = document.getElementById('promo-body');
const promoEmpty = document.getElementById('promo-empty');
const promoStatus = document.getElementById('promo-status');
const searchBar = document.querySelector('search-bar');
const confirmDialog = document.querySelector('confirm-dialog');
const newPromoBtn = document.getElementById('new-promo-btn');

const statCodes = document.getElementById('stat-codes');
const statMax = document.getElementById('stat-max');
const statTypes = document.getElementById('stat-types');

const dialog = document.getElementById('promo-dialog');
const dialogTitle = document.getElementById('promo-dialog-title');
const form = document.getElementById('promo-form');
const cancelBtn = document.getElementById('cancel-btn');
const fieldCode = document.getElementById('field-code');
const fieldTitle = document.getElementById('field-title');
const fieldType = document.getElementById('field-type');
const valueField = document.getElementById('value-field');
const fieldValue = document.getElementById('field-value');
const fieldCategory = document.getElementById('field-category');
const fieldDescription = document.getElementById('field-description');

// Los cambios viven solo en memoria: al recargar vuelve la lista original (PROMOS).
let promos = Object.entries(PROMOS).map(([code, promo]) => ({ code, ...promo }));
let editingCode = null;
let statusTimer = null;
let query = '';

fieldCategory.innerHTML =
  '<option value="">Toda la tienda</option>' +
  Object.entries(CATEGORY_LABELS)
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join('');

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showStatus(message) {
  promoStatus.textContent = message;
  promoStatus.classList.add('is-visible');
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => promoStatus.classList.remove('is-visible'), 2500);
}

function discountLabel(promo) {
  switch (promo.type) {
    case 'percent': return `${promo.value}%`;
    case 'bogo': return '2x1';
    case 'shipping': return 'Envío gratis';
  }
}

function appliesTo(promo) {
  return promo.category ? CATEGORY_LABELS[promo.category] : 'Toda la tienda';
}

function PromoRow(promo) {
  return `
    <tr data-code="${promo.code}">
      <td class="cell-code">${escapeHtml(promo.code)}</td>
      <td class="cell-name">
        ${escapeHtml(promo.title)}
        <span class="cell-sub">${escapeHtml(promo.description)}</span>
      </td>
      <td>${discountLabel(promo)}</td>
      <td>${appliesTo(promo)}</td>
      <td>
        <div class="cell-actions">
          <button class="btn btn-sm" data-action="edit">Editar</button>
          <button class="btn btn-sm" data-action="delete">Eliminar</button>
        </div>
      </td>
    </tr>`;
}

function renderStats() {
  const percents = promos.filter(p => p.type === 'percent').map(p => p.value);

  statCodes.textContent = promos.length;
  statMax.textContent = percents.length ? `${Math.max(...percents)}%` : '—';
  statTypes.textContent = new Set(promos.map(p => p.type)).size;
}

function render() {
  const term = query.trim().toLowerCase();
  const visible = promos.filter(
    p => p.code.toLowerCase().includes(term) || p.title.toLowerCase().includes(term)
  );

  promoBody.innerHTML = visible.map(PromoRow).join('');
  promoEmpty.hidden = visible.length > 0;
  renderStats();
}

// El campo de porcentaje solo aplica a las promociones de tipo "Porcentaje".
function updateValueField() {
  const isPercent = fieldType.value === 'percent';
  valueField.hidden = !isPercent;
  fieldValue.required = isPercent;
}

function openDialog(promo) {
  editingCode = promo ? promo.code : null;
  dialogTitle.textContent = promo ? 'Editar promoción' : 'Nueva promoción';

  fieldCode.value = promo ? promo.code : '';
  fieldCode.readOnly = Boolean(promo); // el código identifica a la promoción
  fieldCode.setCustomValidity('');
  fieldTitle.value = promo ? promo.title : '';
  fieldType.value = promo ? promo.type : 'percent';
  fieldValue.value = promo && promo.type === 'percent' ? promo.value : '';
  fieldCategory.value = promo && promo.category ? promo.category : '';
  fieldDescription.value = promo ? promo.description : '';
  updateValueField();

  dialog.showModal();
  (promo ? fieldTitle : fieldCode).focus();
}

newPromoBtn.addEventListener('click', () => openDialog(null));
cancelBtn.addEventListener('click', () => dialog.close());
fieldType.addEventListener('change', updateValueField);
fieldCode.addEventListener('input', () => fieldCode.setCustomValidity(''));

searchBar.addEventListener('search-input', e => {
  query = e.detail;
  render();
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const code = fieldCode.value.trim().toUpperCase();

  if (editingCode === null && promos.some(p => p.code === code)) {
    fieldCode.setCustomValidity('Ese código ya existe.');
    fieldCode.reportValidity();
    return;
  }

  const data = {
    title: fieldTitle.value.trim(),
    type: fieldType.value,
    description: fieldDescription.value.trim(),
  };
  if (data.type === 'percent') data.value = Number(fieldValue.value);
  if (fieldCategory.value) data.category = fieldCategory.value;

  if (editingCode === null) {
    promos.unshift({ code, ...data });
    showStatus('Promoción agregada (simulado)');
  } else {
    // Se reemplaza el registro completo para no arrastrar campos que ya no aplican.
    const index = promos.findIndex(p => p.code === editingCode);
    promos[index] = { code: editingCode, ...data };
    showStatus('Promoción actualizada (simulado)');
  }

  dialog.close();
  render();
});

promoBody.addEventListener('click', async e => {
  const button = e.target.closest('button[data-action]');
  if (!button) return;

  const code = button.closest('tr').dataset.code;
  const promo = promos.find(p => p.code === code);

  if (button.dataset.action === 'edit') {
    openDialog(promo);
  } else if (button.dataset.action === 'delete') {
    const confirmed = await confirmDialog.ask({
      title: '¿Eliminar promoción?',
      message: `Se eliminará el código "${promo.code}" de la tienda (simulado).`,
      confirmLabel: 'Eliminar',
    });
    if (!confirmed) return;

    promos = promos.filter(p => p.code !== code);
    showStatus('Promoción eliminada (simulado)');
    render();
  }
});

render();