const FREE_SHIPPING_FROM = 999;
const SHIPPING_COST = 99;
const WALLET_BALANCE = 2000; // Saldo simulado del monedero electrónico.
const CONFIRMATION_PAGE = '../confirmation/confirmation.html';;

const BANK = {
  name: 'Banco Elied',
  beneficiary: 'Elied Ropa y Accesorios',
  clabe: '0123 4567 8901 2345 67',
};

const PAYMENT_LABELS = {
  card: 'Tarjeta de crédito/débito',
  transfer: 'Transferencia',
  cash: 'Efectivo',
  wallet: 'Monedero electrónico',
};

const $ = id => document.getElementById(id);

/* ---------- Carrito (viaja en la URL: checkout.html?items=1:1,8:2&promo=CODIGO) ---------- */

function findProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

const params = new URLSearchParams(window.location.search);

const cart = (params.get('items') || '')
  .split(',')
  .map(pair => {
    const [id, qty] = pair.split(':').map(Number);
    return { id, qty: Math.min(Math.max(qty || 1, 1), MAX_QTY) };
  })
  .filter(item => findProduct(item.id));

const promoCode = (params.get('promo') || '').toUpperCase();
const promo = PROMOS[promoCode] || null;

// Misma lógica que en cart.js.
function calcDiscount(promo) {
  const eligible = cart.filter(
    item => !promo.category || findProduct(item.id).category === promo.category
  );

  switch (promo.type) {
    case 'percent': {
      const base = eligible.reduce((sum, item) => sum + findProduct(item.id).price * item.qty, 0);
      return Math.round(base * promo.value / 100);
    }
    case 'bogo':
      return eligible.reduce(
        (sum, item) => sum + Math.floor(item.qty / 2) * findProduct(item.id).price,
        0
      );
    default:
      return 0;
  }
}

const subtotal = cart.reduce((sum, item) => sum + findProduct(item.id).price * item.qty, 0);
const discount = promo ? calcDiscount(promo) : 0;
const shipping =
  (promo && promo.type === 'shipping') || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
const total = subtotal - discount + shipping;

// Datos "falsos" generados una vez por visita.
const randomDigits = n =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
const orderNumber = `ELD-cuicuicui`;
const cashReference = randomDigits(16).replace(/(\d{4})(?=\d)/g, '$1 ');

/* ---------- Estado vacío ---------- */

if (cart.length === 0) {
  $('checkout-grid').hidden = true;
  $('checkout-empty').hidden = false;
} else {
  init();
}

function init() {
  renderSummary();
  fillPaymentData();
  bindInputMasks();
  bindNavigation();
}

/* ---------- Resumen lateral ---------- */

function renderSummary() {
  $('summary-items').innerHTML = cart
    .map(item => {
      const product = findProduct(item.id);
      return `
        <li class="summary-item">
          <span class="summary-item-name">${product.name}
            <span class="summary-item-qty">Cantidad: ${item.qty}</span>
          </span>
          <span class="summary-item-price">${formatPrice(product.price * item.qty)}</span>
        </li>`;
    })
    .join('');

  $('summary-subtotal').textContent = formatPrice(subtotal);
  $('summary-discount-row').hidden = discount === 0;
  $('summary-discount-code').textContent = promoCode;
  $('summary-discount').textContent = `−${formatPrice(discount)}`;
  $('summary-shipping').textContent = shipping === 0 ? 'Gratis' : formatPrice(shipping);
  $('summary-total').textContent = formatPrice(total);
}

/* ---------- Datos de cada método de pago ---------- */

function fillPaymentData() {
  $('bank-name').textContent = BANK.name;
  $('bank-beneficiary').textContent = BANK.beneficiary;
  $('bank-clabe').textContent = BANK.clabe;
  $('bank-reference').textContent = orderNumber;
  $('bank-amount').textContent = formatPrice(total);

  $('cash-reference').textContent = cashReference;
  $('cash-amount').textContent = formatPrice(total);
  const deadline = new Date(Date.now() + 48 * 60 * 60 * 1000);
  $('cash-deadline').textContent =
    `Hasta el ${deadline.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}`;

  $('wallet-balance').textContent = formatPrice(WALLET_BALANCE);
  $('wallet-total').textContent = formatPrice(total);
  $('wallet-remaining').textContent =
    total <= WALLET_BALANCE ? formatPrice(WALLET_BALANCE - total) : '—';
  $('wallet-error').hidden = total <= WALLET_BALANCE;
}

/* ---------- Formato de campos (solo dígitos, tarjeta, vencimiento) ---------- */

function bindInputMasks() {
  // Campos con data-digits="N": solo números, máximo N.
  document.querySelectorAll('[data-digits]').forEach(input => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(0, Number(input.dataset.digits));
    });
  });

  $('card-number').addEventListener('input', e => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    e.target.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  });

  $('card-expiry').addEventListener('input', e => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    e.target.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  });

  // Quitar el error en cuanto el usuario corrige el campo.
  document.querySelectorAll('[data-validate]').forEach(input => {
    input.addEventListener('input', () => clearError(input));
    input.addEventListener('change', () => clearError(input));
  });
}

/* ---------- Validación visual ---------- */

const RULES = {
  required: v => (v.trim() ? '' : 'Este campo es obligatorio.'),
  email: v => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Escribe un correo válido.'),
  phone: v => (/^\d{10}$/.test(v) ? '' : 'Escribe un teléfono de 10 dígitos.'),
  zip: v => (/^\d{5}$/.test(v) ? '' : 'Escribe un código postal de 5 dígitos.'),
  card: v => (/^\d{16}$/.test(v.replace(/\s/g, '')) ? '' : 'Escribe los 16 dígitos de tu tarjeta.'),
  cvv: v => (/^\d{3,4}$/.test(v) ? '' : 'El CVV tiene 3 o 4 dígitos.'),
  expiry: v => {
    const match = /^(\d{2})\/(\d{2})$/.exec(v);
    if (!match) return 'Usa el formato MM/AA.';

    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    if (month < 1 || month > 12) return 'El mes no es válido.';

    const now = new Date();
    const expired = year < now.getFullYear() ||
      (year === now.getFullYear() && month < now.getMonth() + 1);
    return expired ? 'La tarjeta está vencida.' : '';
  },
};

function errorElement(input) {
  const holder = input.closest('.field') || input.closest('.check-row');
  let error = holder.querySelector('.field-error');

  if (!error) {
    error = document.createElement('p');
    error.className = 'field-error';
    error.id = `${input.id}-error`;
    error.setAttribute('role', 'alert');
    holder.appendChild(error);
  }
  return error;
}

function setError(input, message) {
  const error = errorElement(input);
  error.textContent = message;
  error.hidden = !message;

  if (message) {
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', error.id);
  } else {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }
}

function clearError(input) {
  setError(input, '');
}

// Valida todos los campos [data-validate] dentro del contenedor. Devuelve true si todo está bien.
function validateFields(container) {
  let firstInvalid = null;

  container.querySelectorAll('[data-validate]').forEach(input => {
    const rule = input.dataset.validate;
    const message = rule === 'checked'
      ? (input.checked ? '' : 'Confirma que realizaste la transferencia.')
      : RULES[rule](input.value);

    setError(input, message);
    if (message && !firstInvalid) firstInvalid = input;
  });

  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

/* ---------- Pasos ---------- */

let currentStep = 1;
let paymentMethod = null;

const steps = document.querySelectorAll('.checkout-step');
const stepperItems = document.querySelectorAll('.stepper-item');

function goToStep(n) {
  currentStep = n;

  steps.forEach(section => {
    section.hidden = Number(section.dataset.step) !== n;
  });

  stepperItems.forEach(item => {
    const num = Number(item.dataset.step);
    item.classList.toggle('is-current', num === n);
    item.classList.toggle('is-done', num < n);
    if (num === n) {
      item.setAttribute('aria-current', 'step');
    } else {
      item.removeAttribute('aria-current');
    }
  });

  if (n === 3) renderReview();

  const title = $(`step-${n}-title`);
  title.scrollIntoView({ behavior: 'smooth', block: 'center' });
  title.focus({ preventScroll: true });
}

function bindNavigation() {
  // Paso 1 → 2
  $('address-form').addEventListener('submit', e => {
    e.preventDefault();
    if (validateFields($('address-form'))) goToStep(2);
  });

  // Selección de método: muestra solo su panel
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', () => {
      paymentMethod = radio.value;
      $('payment-error').hidden = true;

      document.querySelectorAll('.pay-panel').forEach(panel => {
        panel.hidden = panel.dataset.panel !== paymentMethod;
      });
    });
  });

  // Paso 2 → 3
  $('payment-form').addEventListener('submit', e => {
    e.preventDefault();

    if (!paymentMethod) {
      const error = $('payment-error');
      error.textContent = 'Selecciona un método de pago para continuar.';
      error.hidden = false;
      return;
    }

    if (paymentMethod === 'wallet' && total > WALLET_BALANCE) {
      $('wallet-error').hidden = false;
      return;
    }

    // Solo se validan los campos del panel del método elegido.
    const panel = document.querySelector(`.pay-panel[data-panel="${paymentMethod}"]`);
    if (!validateFields(panel)) return;

    goToStep(3);
  });

  // Botones "Regresar"
  document.querySelectorAll('[data-back]').forEach(button => {
    button.addEventListener('click', () => goToStep(Number(button.dataset.back)));
  });

  $('pay-btn').addEventListener('click', pay);
}

/* ---------- Confirmación (paso 3) ---------- */

function paymentSummary() {
  switch (paymentMethod) {
    case 'card': {
      const last4 = $('card-number').value.replace(/\s/g, '').slice(-4);
      return `${PAYMENT_LABELS.card} terminada en ${last4}`;
    }
    case 'transfer':
      return `${PAYMENT_LABELS.transfer} (referencia ${orderNumber})`;
    case 'cash':
      return `${PAYMENT_LABELS.cash} (referencia ${cashReference})`;
    case 'wallet':
      return `${PAYMENT_LABELS.wallet} (saldo restante ${formatPrice(WALLET_BALANCE - total)})`;
  }
}

function renderReview() {
  const value = id => $(id).value.trim();

  $('review-address').textContent =
    `${value('addr-name')}. ${value('addr-street')}, ${value('addr-colony')}, ` +
    `${value('addr-city')}, ${value('addr-state')}, C.P. ${value('addr-zip')}`;
  $('review-contact').textContent = `${value('addr-phone')} · ${value('addr-email')}`;
  $('review-payment').textContent = paymentSummary();

  // Al volver al paso 3 el botón vuelve a su estado inicial.
  $('pay-btn').disabled = false;
  $('pay-btn').textContent = paymentMethod === 'cash' ? 'Generar pedido' : 'Pagar';
  $('pay-status').classList.remove('is-visible');
}

function pay() {
  const payBtn = $('pay-btn');
  const status = $('pay-status');

  payBtn.disabled = true;
  payBtn.textContent = 'Procesando pago...';
  $('review-back').disabled = true;

  setTimeout(() => {
    status.textContent = paymentMethod === 'cash'
      ? `Pedido ${orderNumber} registrado. Paga en tienda con tu referencia.`
      : `Pago aprobado. Pedido ${orderNumber}.`;
    status.classList.add('is-visible');
    payBtn.textContent = paymentMethod === 'cash' ? 'Pedido generado' : 'Pago aprobado';

    if (CONFIRMATION_PAGE) {
      const next = new URLSearchParams({
        order: orderNumber,
        method: paymentMethod,
        items: params.get('items'),
        total,
      });
      if (promoCode) next.set('promo', promoCode);

      setTimeout(() => {
        window.location.href = `${CONFIRMATION_PAGE}?${next}`;
      }, 1200);
    }
  }, 1500);
}
