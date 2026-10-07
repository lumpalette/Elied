class AdminSidebar extends HTMLElement {
  connectedCallback() {
    const root = this.getAttribute('root') || '';
    const active = this.getAttribute('active');

    const links = [
      { id: 'products', label: 'Productos', href: 'pages/admin/admin.html' },
      { id: 'orders', label: 'Pedidos', href: 'pages/admin-orders/admin-orders.html' },
      { id: 'promotions', label: 'Promociones', href: 'pages/admin-promotions/admin-promotions.html' }
    ];

    const items = links
      .map(({ id, label, href }) => {
        const current = id === active ? ' aria-current="page"' : '';
        return `<li><a href="${root}${href}"${current}>${label}</a></li>`;
      })
      .join('');

    this.innerHTML = `
      <nav class="admin-nav" aria-label="Administración">
        <p class="admin-nav-title">Administración</p>
        <ul>${items}</ul>
      </nav>`;
  }
}

customElements.define('admin-sidebar', AdminSidebar);