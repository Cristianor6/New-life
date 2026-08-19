// 1. Identificamos las tarjetas por su ID
const btnReportar = document.querySelector('#btn-reportar');
const btnManual = document.querySelector('#btn-manual');

// 2. Acción para el botón de Reportar
btnReportar.addEventListener('click', () => {
    alert("Iniciando sistema de reporte...");
    // Aquí podrías llevarlos a otra página: 
    // window.location.href = "reporte.html";
});

// 3. Acción para el botón de Manual
btnManual.addEventListener('click', () => {
    alert("Abriendo el manual de usuario");
});
// 1. Seleccionamos el botón y el menú nav
const botonMenu = document.querySelector('#boton-menu');
const menuNavegacion = document.querySelector('#navegacion');

// 2. Escuchamos el clic en el botón hamburguesa
botonMenu.addEventListener('click', () => {
    // 3. El toggle quita o pone la clase "menu-oculto" dinámicamente
    menuNavegacion.classList.toggle('menu-oculto');
});