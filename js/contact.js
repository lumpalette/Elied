
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    formStatus.textContent = 'Mensaje enviado (simulado)';
    formStatus.classList.add('is-visible');
    form.reset();

    setTimeout(() => {
        window.location.href = "poeoquito.html"; // omibbpoeoquito
    }, 2000);
});