class SiteHeader extends HTMLElement {
  connectedCallback() {
    const root = this.getAttribute('root') || '';
    const active = this.getAttribute('active');

    // Un elemento con "items" es un menú desplegable; el resto son enlaces simples.
    const links = [
      { id: 'home', label: 'Inicio', href: 'index.html' },
      { id: 'catalog', label: 'Catálogo', href: 'pages/catalog/catalog.html' },
      {
        label: 'Explorar',
        items: [
          { id: 'promotions', label: 'Promociones', href: 'pages/promotions/promotions.html' },
          { id: 'season', label: 'Destacados', href: 'pages/campaign/campaign.html' },
          { id: 'auction', label: 'Subasta', href: 'pages/auction/auction.html' },
          { id: 'community', label: 'Comunidad', href: 'pages/community/community.html' },
        ],
      },
      { id: 'about', label: 'Nosotros', href: 'pages/about/about.html' },
      { id: 'contact', label: 'Contacto', href: 'pages/contact/contact.html' },
    ];

    const renderLink = ({ id, label, href }) => {
      const cls = id === active ? ' class="active"' : '';
      return `<li><a href="${root}${href}"${cls}>${label}</a></li>`;
    };

    const items = links
      .map(link => {
        if (!link.items) return renderLink(link);

        const hasActive = link.items.some(item => item.id === active);
        return `
          <li class="nav-dropdown${hasActive ? ' has-active' : ''}">
            <button type="button" class="nav-dropdown-toggle" aria-haspopup="true" aria-expanded="false">
              ${link.label}<span class="nav-caret" aria-hidden="true"></span>
            </button>
            <ul class="nav-submenu">${link.items.map(renderLink).join('')}</ul>
          </li>`;
      })
      .join('');

    const cartClass = active === 'cart' ? ' active' : '';
    const cartItem = `
      <li>
        <a href="${root}pages/cart/cart.html" class="cart-link${cartClass}" aria-label="Carrito">
          <span class="cart-icon"></span>
        </a>
      </li>`;

    let account = `<li><a href="${root}pages/login/login.html" class="btn btn-sm">Iniciar sesión</a></li>`;

    if (active === 'profile') {
      account = `<li><a href="${root}pages/profile/profile.html" class="active">Mi perfil</a></li>`;
    } else if (active === 'admin') {
      account = `<li><a href="${root}pages/profile/profile.html">Mi perfil</a></li>`;
    }

    this.innerHTML = `
      <header class="site-header">
        <div class="wrap">
          <a href="${root}index.html" class="logo">Elied</a>
          <nav class="main-nav">
            <ul>${items}${account}${cartItem}</ul>
          </nav>
          <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false">☰</button>
        </div>
      </header>`;

    // Menú móvil (hamburguesa)
    const toggle = this.querySelector('.nav-toggle');
    const nav = this.querySelector('.main-nav');

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Desplegable "Explorar": clic para abrir/cerrar; se cierra al hacer clic fuera o con Esc.
    const dropdown = this.querySelector('.nav-dropdown');
    const dropdownToggle = this.querySelector('.nav-dropdown-toggle');

    const setDropdown = open => {
      dropdown.classList.toggle('is-open', open);
      dropdownToggle.setAttribute('aria-expanded', open);
    };

    dropdownToggle.addEventListener('click', () => {
      setDropdown(!dropdown.classList.contains('is-open'));
    });

    document.addEventListener('click', e => {
      if (!dropdown.contains(e.target)) setDropdown(false);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') setDropdown(false);
    });
  }
}

customElements.define('site-header', SiteHeader);