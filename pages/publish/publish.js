const form = document.getElementById('publish-form');
const formStatus = document.getElementById('form-status');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Los datos viajan en la URL (igual que en el carrito) para que
    // "Mis publicaciones" pueda mostrar el producto recién publicado.
    const params = new URLSearchParams({
        name: document.getElementById('product-name').value.trim(),
        price: document.getElementById('product-price').value,
        description: document.getElementById('product-description').value.trim(),
    });

    formStatus.textContent = 'Publicado, redirigiendo a las publicaciones...';
    formStatus.classList.add('is-visible');

    setTimeout(() => {
        window.location.href = `../my-listings/my-listings.html?${params}`;
    }, 1500);
});
