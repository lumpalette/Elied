// Uso: <promo-form></promo-form>
// Emite "promo-apply" con el código escrito. Quien lo use decide qué hacer
// y puede mostrar un mensaje con setStatus().
class PromoForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <form class="promo-form">
        <div class="field">
          <label for="promo-input">Código de descuento</label>
          <div class="promo-row">
            <input type="text" id="promo-input" placeholder="ELIED10" autocomplete="off" required>
            <button type="submit" class="btn btn-sm">Aplicar</button>
          </div>
        </div>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>`;

    this.input = this.querySelector('input');
    this.status = this.querySelector('.form-status');

    this.querySelector('form').addEventListener('submit', e => {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent('promo-apply', { detail: this.input.value }));
    });
  }

  setStatus(message) {
    this.status.textContent = message;
    this.status.classList.add('is-visible');
  }
}

customElements.define('promo-form', PromoForm);
