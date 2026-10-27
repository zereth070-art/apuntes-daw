document.addEventListener("DOMContentLoaded", () => {
  
  // === 1. MODO CLARO / OSCURO (Bootstrap 5 nativo) ===
  const themeToggle = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;

  // Comprobar preferencia guardada
  const savedTheme = localStorage.getItem("theme") || "light";
  htmlElement.setAttribute("data-bs-theme", savedTheme);
  themeToggle.textContent = savedTheme === "dark" ? "Modo Claro" : "Modo Oscuro";

  themeToggle.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    htmlElement.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeToggle.textContent = newTheme === "dark" ? "Modo Claro" : "Modo Oscuro";
  });

  // === 2. VALIDACIÓN DE FORMULARIO (Estilo Bootstrap) ===
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", (e) => {
    // Si los campos HTML5 nativos (required, minlength, type="email") fallan
    if (!form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      alert("¡Formulario enviado con éxito!");
    }

    // Añade la clase de Bootstrap para mostrar visualmente los errores (.is-invalid)
    form.classList.add("was-validated");
  }, false);
});