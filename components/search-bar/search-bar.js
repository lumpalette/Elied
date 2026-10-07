class SearchBar extends HTMLElement {
  connectedCallback() {
    const label = this.getAttribute('label') || 'Buscar';
    const placeholder = this.getAttribute('placeholder') || '';
    const id = this.getAttribute('input-id') || 'search';

    this.innerHTML = `
      <div class="field search-bar">
        <label for="${id}">${label}</label>
        <input type="search" id="${id}" placeholder="${placeholder}">
      </div>`;

    const input = this.querySelector('input');

    input.addEventListener('input', () => {
      this.dispatchEvent(new CustomEvent('search-input', { detail: input.value }));
    });
  }
}

customElements.define('search-bar', SearchBar);