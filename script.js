// 1. REGISTRO DEL SERVICE WORKER
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('Service Worker registrado con éxito:', reg.scope))
      .catch((err) => console.error('Error al registrar Service Worker:', err));
  });
}

// 2. DETECCIÓN DE CONEXIÓN ONLINE/OFFLINE
const estadoBadge = document.getElementById('estado-conexion');

function actualizarEstadoRed() {
  if (navigator.onLine) {
    estadoBadge.textContent = 'Online';
    estadoBadge.className = 'badge online';
  } else {
    estadoBadge.textContent = 'Offline';
    estadoBadge.className = 'badge offline';
  }
}

window.addEventListener('online', actualizarEstadoRed);
window.addEventListener('offline', actualizarEstadoRed);
actualizarEstadoRed();

// 3. CONTROL DEL MENÚ DESPLEGABLE Y NAVEGACIÓN
const botonMenu = document.getElementById('boton-menu');
const navegacion = document.getElementById('navegacion');

botonMenu.addEventListener('click', () => {
  navegacion.classList.toggle('menu-oculto');
});

function mostrarSeccion(idSeccion) {
  // Ocultar todas las secciones
  const secciones = document.querySelectorAll('main > section');
  secciones.forEach(sec => {
    sec.classList.remove('seccion-activa');
    sec.classList.add('seccion-oculta');
  });
  
  // Mostrar la sección seleccionada
  const seccionObjetivo = document.getElementById(`sec-${idSeccion}`);
  if (seccionObjetivo) {
    seccionObjetivo.classList.remove('seccion-oculta');
    seccionObjetivo.classList.add('seccion-activa');
  }
  
  // Ocultar menú tras hacer clic
  navegacion.classList.add('menu-oculto');
}

// 4. BASE DE DATOS DE RESIDUOS Y CLASIFICADOR INTERACTIVO
const baseResiduos = [
  { nombre: 'Botella Plástica', caneca: 'blanca', icono: '🍾', desc: 'Limpia y seca' },
  { nombre: 'Lata de Aluminio', caneca: 'blanca', icono: '🥤', desc: 'Enjuagada' },
  { nombre: 'Caja de Cartón', caneca: 'blanca', icono: '📦', desc: 'Desarmada y seca' },
  { nombre: 'Frasco de Vidrio', caneca: 'blanca', icono: '🫙', desc: 'Sin tapas' },
  { nombre: 'Cáscara de Banano', caneca: 'verde', icono: '🍌', desc: 'Residuo orgánico' },
  { nombre: 'Restos de Comida', caneca: 'verde', icono: '🍲', desc: 'Biodegradable' },
  { nombre: 'Hojas Secas y Poda', caneca: 'verde', icono: '🍂', desc: 'Jardinería' },
  { nombre: 'Papel Higiénico Usado', caneca: 'negra', icono: '🧻', desc: 'No reciclable' },
  { nombre: 'Servilletas Usadas', caneca: 'negra', icono: '🍽️', desc: 'Contaminadas' },
  { nombre: 'Cartón Sucio con Grasa', caneca: 'negra', icono: '🍕', desc: 'Caja de pizza' },
  { nombre: 'Tapabocas Usado', caneca: 'negra', icono: '😷', desc: 'Residuo sanitario' }
];

let categoriaFiltroActual = 'todos';

function renderizarResiduos(lista) {
  const contenedor = document.getElementById('lista-residuos');
  contenedor.innerHTML = '';
  if (lista.length === 0) {
    contenedor.innerHTML = '<p style="text-align:center; color:#888;">No se encontraron residuos.</p>';
    return;
  }
  lista.forEach(item => {
    const div = document.createElement('div');
    div.className = 'residuo-item';
    
    let nombreCaneca = 'Blanca (Aprovechable)';
    let claseTag = 'tag-blanca';
    if (item.caneca === 'verde') {
      nombreCaneca = 'Verde (Orgánico)';
      claseTag = 'tag-verde';
    } else if (item.caneca === 'negra') {
      nombreCaneca = 'Negra (No Aprovechable)';
      claseTag = 'tag-negra';
    }
    
    div.innerHTML = `
      <div class="residuo-info">
        <span class="residuo-icono">${item.icono}</span>
        <div>
          <div class="residuo-nombre">${item.nombre}</div>
          <small style="color:#777;">${item.desc}</small>
        </div>
      </div>
      <span class="tag-caneca ${claseTag}">${nombreCaneca}</span>
    `;
    contenedor.appendChild(div);
  });
}

function filtrarResiduos() {
  const texto = document.getElementById('input-busqueda').value.toLowerCase();
  const filtrados = baseResiduos.filter(item => {
    const coincideTexto = item.nombre.toLowerCase().includes(texto) || item.desc.toLowerCase().includes(texto);
    const coincideCategoria = categoriaFiltroActual === 'todos' || item.caneca === categoriaFiltroActual;
    return coincideTexto && coincideCategoria;
  });
  renderizarResiduos(filtrados);
}

function filtrarCategoria(cat, elementoBoton) {
  categoriaFiltroActual = cat;
  document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('active'));
  elementoBoton.classList.add('active');
  filtrarResiduos();
}

// Inicializar lista
renderizarResiduos(baseResiduos);

// 5. LÓGICA DEL JUEGO ECO-DESAFÍO
let juegoPuntos = 0;
let juegoRacha = 0;
let itemJuegoActual = null;

function nuevoItemJuego() {
  const idx = Math.floor(Math.random() * baseResiduos.length);
  itemJuegoActual = baseResiduos[idx];
  document.getElementById('juego-icono').textContent = itemJuegoActual.icono;
  document.getElementById('juego-nombre').textContent = itemJuegoActual.nombre;
  document.getElementById('juego-pista').textContent = `Pista: ${itemJuegoActual.desc}`;
  document.getElementById('feedback-juego').textContent = '';
}

function validarRespuesta(canecaSeleccionada) {
  const feedback = document.getElementById('feedback-juego');
  if (canecaSeleccionada === itemJuegoActual.caneca) {
    juegoPuntos += 10;
    juegoRacha += 1;
    feedback.textContent = '🎉 ¡Correcto! +10 puntos';
    feedback.className = 'feedback correct';
  } else {
    juegoRacha = 0;
    feedback.textContent = `❌ ¡Incorrecto! Iba en la caneca ${itemJuegoActual.caneca.toUpperCase()}`;
    feedback.className = 'feedback incorrect';
  }
  document.getElementById('score').textContent = juegoPuntos;
  document.getElementById('streak').textContent = juegoRacha;
  setTimeout(nuevoItemJuego, 1200);
}

// Cargar primer elemento del juego
nuevoItemJuego();

// 6. GESTIÓN DE REPORTES Y LOCALSTORAGE
function guardarReporte(e) {
  e.preventDefault();
  const tipo = document.getElementById('tipo-reporte').value;
  const ubicacion = document.getElementById('ubicacion').value;
  const descripcion = document.getElementById('descripcion').value;
  
  const nuevoReporte = {
    tipo,
    ubicacion,
    descripcion,
    fecha: new Date().toLocaleDateString()
  };
  
  let reportes = JSON.parse(localStorage.getItem('eco_reportes')) || [];
  reportes.unshift(nuevoReporte);
  localStorage.setItem('eco_reportes', JSON.stringify(reportes));
  
  document.getElementById('form-reporte').reset();
  alert('¡Reporte guardado exitosamente! Has ganado +50 EcoPuntos.');
  renderizarReportes();
}

function renderizarReportes() {
  const listaUI = document.getElementById('lista-reportes');
  let reportes = JSON.parse(localStorage.getItem('eco_reportes')) || [];
  listaUI.innerHTML = '';
  
  if (reportes.length === 0) {
    listaUI.innerHTML = '<li>No has realizado ningún reporte aún.</li>';
    return;
  }
  
  reportes.forEach(rep => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>[${rep.fecha}] ${rep.tipo}:</strong> ${rep.ubicacion}<br><em>${rep.descripcion}</em>`;
    listaUI.appendChild(li);
  });
}

renderizarReportes();