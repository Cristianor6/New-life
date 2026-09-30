const webcamElement = document.getElementById('webcam');
const scanButton = document.getElementById('scan-btn');
const predictionOutput = document.getElementById('prediction');
const recommendationOutput = document.getElementById('recommendation');

let net;

// 1. Iniciar la cámara del celular
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' } // Usa la cámara trasera por defecto en celulares
        });
        webcamElement.srcObject = stream;
        return new Promise((resolve) => {
            webcamElement.onloadedmetadata = () => { resolve(); };
        });
    } catch (error) {
        alert("No se pudo acceder a la cámara. Asegúrate de dar permisos.");
        console.error(error);
    }
}

// 2. Cargar el modelo de IA
async function loadModel() {
    predictionOutput.innerText = "Cargando modelo de inteligencia artificial...";
    net = await mobilenet.load();
    predictionOutput.innerText = "¡Listo! Presiona el botón para escanear.";
}

// 3. Función para clasificar lo que ve la cámara
async function classifyImage() {
    if (!net) {
        alert("El modelo aún se está cargando, espera un momento.");
        return;
    }

    predictionOutput.innerText = "Analizando residuo...";
    recommendationOutput.innerText = "";

    // Realizar la predicción usando el elemento de video
    const result = await net.classify(webcamElement);

    if (result && result.length > 0) {
        const topPrediction = result[0].className;
        predictionOutput.innerText = `Objeto detectado: ${topPrediction}`;

        // Lógica básica para dar recomendaciones según palabras clave comunes
        darRecomendacionBasura(topPrediction.toLowerCase());
    } else {
        predictionOutput.innerText = "No se pudo identificar el objeto. Intenta de nuevo.";
    }
}

// 4. Guía de reciclaje básica según el objeto detectado
function darRecomendacionBasura(objeto) {
    let contenedor = "";
    let desc = "";

    if (objeto.includes('bottle') || objeto.includes('plastic') || objeto.includes('cup') || objeto.includes('can')) {
        contenedor = "CONTENEDOR BLANCO / APROVECHABLE ♻️";
        desc = "Este objeto es reciclable (plástico/lata). Asegúrate de enjuagarlo antes de botarlo.";
    } else if (objeto.includes('paper') || objeto.includes('cardboard') || objeto.includes('box')) {
        contenedor = "CONTENEDOR BLANCO / PAPEL Y CARTÓN 📦";
        desc = "Debe ir limpio y seco. Si está manchado con grasa (como cajas de pizza), va al ordinario.";
    } else if (objeto.includes('banana') || objeto.includes('apple') || objeto.includes('fruit') || objeto.includes('food')) {
        contenedor = "CONTENEDOR VERDE / ORGÁNICOS 🌱";
        desc = "Residuos de comida o restos orgánicos aptos para compostaje.";
    } else {
        contenedor = "CONTENEDOR NEGRO / NO APROVECHABLE 🗑️";
        desc = "Residuo ordinario o material no reciclable.";
    }

    recommendationOutput.innerHTML = `<strong>Clasificación sugerida:</strong> ${contenedor}<br><small>${desc}</small>`;
}

// Inicializar todo al cargar la página
async function init() {
    await setupCamera();
    await loadModel();
    scanButton.addEventListener('click', classifyImage);
}

init();