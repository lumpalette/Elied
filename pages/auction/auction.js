const MIN_STEP = 10;
const DURATION_SECONDS = 20;

// Producto subastado: auction.html?id=7 (por defecto, el bolso de cuero).
const product_id = Math.floor(Math.random() * PRODUCTS.length) + 1
console.trace(product_id)
const params = new URLSearchParams(window.location.search);
const product =
  PRODUCTS.find(p => p.id === Number(params.get('id'))) ||
  PRODUCTS.find(p => p.id === product_id);

const timerBox = document.querySelector('.auction-timer');
const timerEl = document.getElementById('auction-timer');
const currentEl = document.getElementById('auction-current');
const countEl = document.getElementById('auction-count');
const bidList = document.getElementById('bid-list');
const bidForm = document.getElementById('bid-form');
const bidInput = document.getElementById('bid-input');
const bidSubmit = document.getElementById('bid-submit');
const bidStatus = document.getElementById('bid-status');

document.title = `Elied - Subasta: ${product.name}`;
document.getElementById('auction-thumbnail').dataset.tone = product.tone;
document.getElementById('auction-category').textContent = CATEGORY_LABELS[product.category];
document.getElementById('auction-name').textContent = product.name;
document.getElementById('auction-desc').textContent =
  product.description || DESCRIPTIONS[product.category];

const base = Math.round(product.price * 0.5 / 10) * 10;
let bids = [
  { bidder: "Poeoquito", amount: 999, time: "Hace -1 s" },
  { bidder: 'Persona C', amount: base + 150, time: 'Hace 12 min' },
  { bidder: 'Persona B', amount: base + 90, time: 'Hace 40 min' },
  { bidder: 'Persona A', amount: base + 40, time: 'Hace 1 h' },
  { bidder: 'Persona D', amount: base, time: 'Hace 2 h' },
];

function showStatus(message) {
  bidStatus.textContent = message;
  bidStatus.classList.add('is-visible');
}

function BidItem(bid, index) {
  return `
    <li class="bid${index === 0 ? ' bid-top' : ''}">
      <div>
        <p class="bid-who">${bid.bidder}${index === 0 ? '<span class="bid-badge">Mejor oferta</span>' : ''}</p>
        <p class="bid-time">${bid.time}</p>
      </div>
      <p class="bid-amount">${formatPrice(bid.amount)}</p>
    </li>`;
}

function render() {
  const current = bids[0].amount;

  currentEl.textContent = formatPrice(current);
  countEl.textContent = bids.length;
  bidInput.placeholder = current + MIN_STEP;
  bidList.innerHTML = bids.map(BidItem).join('');
}

bidForm.addEventListener('submit', e => {
  e.preventDefault();

  const amount = Number(bidInput.value);
  const minimum = bids[0].amount + MIN_STEP;

  if (amount < minimum) {
    showStatus(`Tu oferta debe ser de al menos ${formatPrice(minimum)}.`);
    return;
  }

  bids.unshift({ bidder: 'Tú', amount, time: 'Justo ahora' });
  bidInput.value = '';
  showStatus('Oferta registrada ');
  render();
});

let remaining = DURATION_SECONDS;

function pad(n) {
  return String(n).padStart(2, '0');
}

function renderTimer() {
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  timerEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
}

const timer = setInterval(() => {
  remaining -= 1;
  renderTimer();

  if (remaining <= 0) {
    clearInterval(timer);
    timerBox.classList.add('is-ended');
    bidInput.disabled = true;
    bidSubmit.disabled = true;
    showStatus('La subasta ha finalizado.');
  }
}, 1000);

renderTimer();
render();
