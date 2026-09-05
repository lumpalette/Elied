const form = document.getElementById('login-form');
const formStatus = document.getElementById('form-status');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    formStatus.textContent = 'Ingresando...';
    formStatus.classList.add('is-visible');

    setTimeout(() => {
        window.location.href = "profile.html";
    }, 1000);
});