class SiteHeader extends HTMLElement {
  connectedCallback() {
    const root = this.getAttribute('root') || '';
    const active = this.getAttribute('active');

    const links = [
      { id: 'home', label: 'Inicio', href: 'index.html' },
      { id: 'catalog', label: 'Catálogo', href: 'pages/catalog/catalog.html' },
      { id: 'about', label: 'Nosotros', href: 'pages/about/about.html' },
      { id: 'contact', label: 'Contacto', href: 'pages/contact/contact.html' },
    ];

    const items = links
      .map(({ id, label, href }) => {
        const cls = id === active ? ' class="active"' : '';
        return `<li><a href="${root}${href}"${cls}>${label}</a></li>`;
      })
      .join('');

    let account = `<li><a href="${root}pages/login/login.html" class="btn btn-sm">Iniciar sesión</a></li>`;
    
    if (active === 'login') {
      account = '';
    } else if (active === 'profile') {
      account = `<li><a href="${root}pages/profile/profile.html" class="active">Mi perfil</a></li>`;
    }

    this.innerHTML = `
      <header class="site-header">
        <div class="wrap">
          <a href="${root}index.html" class="logo">Elied</a>
          <nav class="main-nav">
            <ul>${items}${account}</ul>
          </nav>
          <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false">☰</button>
        </div>
      </header>`;

    const toggle = this.querySelector('.nav-toggle');
    const nav = this.querySelector('.main-nav');

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  }
}

customElements.define('site-header', SiteHeader);