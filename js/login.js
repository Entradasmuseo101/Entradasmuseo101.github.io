document.addEventListener("DOMContentLoaded", function() {
    // Referencias a los elementos del formulario
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('password');
    const loginForm = document.getElementById('loginForm');

    // Evento para mostrar u ocultar la contraseña
    togglePassword.addEventListener('click', function() {
        const type = passwordField.type === "password" ? "text" : "password";
        passwordField.type = type;
        this.querySelector("i").classList.toggle("fa-eye-slash");
    });

    // Manejo del formulario de inicio de sesión
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Evita que el formulario se envíe

        // Definir correo y contraseña correctos
        const validEmail = "innoventionPereira@gmail.com";
        const validPassword = "ADMINVENTASELN{Ñ}S";

        // Obtener valores ingresados por el usuario
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Validación del correo y la contraseña
        if (email === validEmail && password === validPassword) {
            // Si el correo y la contraseña son correctos, redirige a la página de administración
            window.location.href = "admin.html"; // Redirige a simulador.html
        } else {
            // Si no son correctos, muestra un mensaje de error
            alert("Correo o contraseña incorrectos.");
        }
    });
});
