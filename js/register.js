const form = document.getElementById('register-form');
const formStatus = document.getElementById('form-status');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    formStatus.textContent = '¡Registro exitoso! (no realmente)';
    formStatus.classList.add('is-visible');
    form.reset();

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
});