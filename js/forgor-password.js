const form = document.getElementById('forgot-form');
const formStatus = document.getElementById('form-status');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    formStatus.textContent = 'Enlace de recuperación enviado (probablemente)';
    formStatus.classList.add('is-visible');
    form.reset();

    setTimeout(() => {
        window.location.href = "login.html";
    }, 2000);
});