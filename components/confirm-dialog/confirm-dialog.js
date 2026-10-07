let confirmDialogCount = 0;

class ConfirmDialog extends HTMLElement {
  connectedCallback() {
    const titleId = `confirm-title-${confirmDialogCount++}`;

    this.innerHTML = `
      <dialog class="confirm-dialog" aria-labelledby="${titleId}">
        <h2 class="confirm-title" id="${titleId}"></h2>
        <p class="confirm-text"></p>
        <div class="confirm-actions">
          <button type="button" class="btn btn-sm" data-result="cancel" autofocus></button>
          <button type="button" class="btn btn-sm btn-primary" data-result="accept"></button>
        </div>
      </dialog>`;

    this.dialog = this.querySelector('dialog');
    this.titleEl = this.querySelector('.confirm-title');
    this.textEl = this.querySelector('.confirm-text');
    this.cancelBtn = this.querySelector('[data-result="cancel"]');
    this.acceptBtn = this.querySelector('[data-result="accept"]');
    this.resolver = null;

    this.cancelBtn.addEventListener('click', () => this.dialog.close('cancel'));
    this.acceptBtn.addEventListener('click', () => this.dialog.close('accept'));

    // Fires for every way of closing: buttons or the Esc key.
    this.dialog.addEventListener('close', () => {
      if (this.resolver) {
        this.resolver(this.dialog.returnValue === 'accept');
        this.resolver = null;
      }
    });
  }

  ask({
    title = '¿Estás seguro?',
    message = '',
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
  } = {}) {
    if (this.dialog.open) return Promise.resolve(false);

    this.titleEl.textContent = title;
    this.textEl.textContent = message;
    this.acceptBtn.textContent = confirmLabel;
    this.cancelBtn.textContent = cancelLabel;

    // returnValue persists between openings, so it must be reset first.
    this.dialog.returnValue = '';
    this.dialog.showModal();

    return new Promise(resolve => {
      this.resolver = resolve;
    });
  }
}

customElements.define('confirm-dialog', ConfirmDialog);