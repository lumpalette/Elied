class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="wrap footer-bottom">
          <span class="logo">Elied</span>
          <span>&copy; ${new Date().getFullYear()} Elied.</span>
        </div>
      </footer>`;
  }
}

customElements.define('site-footer', SiteFooter);