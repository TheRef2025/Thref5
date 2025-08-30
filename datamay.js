
let vozEspanol = null;

function cargarVozEspanol() {
    const voces = speechSynthesis.getVoices();
    vozEspanol = voces.find(
        (voz) => voz.lang.startsWith("es") && voz.name.toLowerCase().includes("google")
    ) || voces.find((voz) => voz.lang.startsWith("es"));
}

function leerTexto(texto) {
    if (!texto) return;
    window.speechSynthesis.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    if (vozEspanol) mensaje.voice = vozEspanol;
    mensaje.lang = "es-ES";
    mensaje.rate = 1;
    mensaje.pitch = 1;
    window.speechSynthesis.speak(mensaje);
}

const mensajeBienvenida = `Hola, bienvenido, mi nombre es TheRef y soy un programa creado para poder realizar un diagnóstico médico previo a tu consulta médica. Responde todas las preguntas y al finalizar tendrás tu boletín para pasar a tu consulta.`;

const mensajesPorSeccion = {
    "seccion-datos-basicos": `Por favor, ingresa tus datos básicos. Primero, dime tu nombre y tu edad.`,
    "seccion-identificacion": `Ahora, por favor ingresa tu número de identificación. Si eres menor de edad, ingresa tu CUI; si eres adulto, ingresa tu DPI.`,
    "seccion-genero": `Selecciona tu género. Si eres mujer, responderás algunas preguntas adicionales.`,
    "seccion-cronica": `Selecciona tu enfermedad crónica, si aplica.`,
    "seccion-alergias": `Selecciona tu alergia, si aplica.`,
    "seccion-operaciones": `Selecciona tu operación previa, si aplica.`,
    "seccion-familia": `Selecciona si hay antecedentes familiares de enfermedad.`,
    "seccion-signos": `Por favor, ingresa tus signos vitales.`,
    "seccion-zona-dolor": `Selecciona o especifica la zona donde tienes dolor, si aplica.`,
    "resultado": `Aquí tienes el resumen de tu diagnóstico previo.`,
};

document.addEventListener("DOMContentLoaded", () => {
    cargarVozEspanol();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => cargarVozEspanol();
    }
    leerTexto(mensajeBienvenida);
    mostrarSeccion("seccion-datos-basicos");
});

function mostrarSeccion(id) {
    document.querySelectorAll(".seccion").forEach((sec) => sec.classList.add("oculto"));
    const seccion = document.getElementById(id);
    if (!seccion) return;
    seccion.classList.remove("oculto");

    if (mensajesPorSeccion[id]) {
        leerTexto(mensajesPorSeccion[id]);
    } else {
        const h2 = seccion.querySelector("h2");
        if (h2) leerTexto(h2.innerText);
    }
}

function validarDatosBasicos() {
    const nombre = document.getElementById("nombre").value.trim();
    const edadStr = document.getElementById("edad").value.trim();
    const edad = parseInt(edadStr);

    if (!nombre) { alert("Por favor, ingresa tu nombre."); return; }
    if (!edadStr || isNaN(edad) || edad <= 0) { alert("Por favor, ingresa una edad válida."); return; }

    mostrarSeccion("seccion-identificacion");

    if (edad <= 17) {
        document.getElementById("cui").classList.remove("oculto");
        document.getElementById("dpi").classList.add("oculto");
    } else {
        document.getElementById("dpi").classList.remove("oculto");
        document.getElementById("cui").classList.add("oculto");
    }
}

function irAGenero() {
    const edad = parseInt(document.getElementById("edad").value);
    if (edad <= 17) {
        const cui = document.getElementById("cui").value.trim();
        if (!cui) { alert("Por favor, ingresa tu CUI."); return; }
    } else {
        const dpi = document.getElementById("dpi").value.trim();
        if (!dpi) { alert("Por favor, ingresa tu DPI."); return; }
    }
    mostrarSeccion("seccion-genero");
}

function detectarEnterGenero(event) {
    if (event.key === "Enter") verificarGenero();
}

function verificarGenero() {
    const genero = document.getElementById("genero").value;
    const extraMujer = document.getElementById("extra-mujer");
    if (genero === "mujer") extraMujer.classList.remove("oculto");
    else extraMujer.classList.add("oculto");
}

function toggleOpcionesCronica(valor) {
    const div = document.getElementById("opciones-cronica");
    div.classList.toggle("oculto", valor !== "Sí");
}

function toggleOpcionesAlergias(valor) {
    const div = document.getElementById("opciones-alergias");
    div.classList.toggle("oculto", valor !== "Sí");
}

function toggleOpcionesOperaciones(valor) {
    const div = document.getElementById("opciones-operaciones");
    div.classList.toggle("oculto", valor !== "Sí");
}

function toggleOpcionesFamilia(valor) {
    const div = document.getElementById("opciones-familia");
    div.classList.toggle("oculto", valor !== "Sí");
}


function mostrarSignos() {
    mostrarSeccion("seccion-signos");
    const img = document.getElementById("imagen-signos");
    if (img) {
        img.classList.remove("oculto");
        setTimeout(() => img.classList.add("oculto"), 15000);
    }
}

function evaluarSignos() {
    const oxigenacion = parseFloat(document.getElementById("oxigenacion").value);
    const pulso = parseFloat(document.getElementById("pulso").value);
    const sistolica = parseFloat(document.getElementById("presion-sistolica").value);
    const diastolica = parseFloat(document.getElementById("presion-diastolica").value);
    const temperatura = parseFloat(document.getElementById("temperatura").value);

    if ([oxigenacion, pulso, sistolica, diastolica, temperatura].some((v) => isNaN(v))) {
        alert("Por favor, completa todos los signos vitales con valores válidos.");
        return;
    }

    const mensajes = [];
    if (oxigenacion < 90) mensajes.push("Oxigenación baja.");
    if (pulso < 60 || pulso > 100) mensajes.push("Pulso fuera del rango normal.");
    if (sistolica < 90 || sistolica > 140 || diastolica < 60 || diastolica > 90) mensajes.push("Presión arterial fuera del rango normal.");
    if (temperatura < 36 || temperatura > 38) mensajes.push("Temperatura fuera del rango normal.");

    document.getElementById("mensaje-final").textContent = mensajes.length ? mensajes.join(" ") : "Signos vitales dentro del rango normal.";
    mostrarSeccion("seccion-zona-dolor");
}

function mostrarSiguiente() {
    mostrarResumen();
    mostrarSeccion("resultado");
}


function obtenerValor(id) {
    const elem = document.getElementById(id);
    if (!elem) return "No especificado";
    const val = elem.value?.trim();
    return val ? val : "No especificado";
}

function mostrarResumen() {
    const edad = parseInt(obtenerValor("edad"));
    const genero = obtenerValor("genero");
    
    const cronica = document.getElementById("enfermedad-cronica-select")?.value;
    const alergia = document.getElementById("alergias-select")?.value;
    const operado = document.getElementById("operaciones-select")?.value;
    const familia = document.getElementById("familia-select")?.value;

    document.getElementById("r-nombre").textContent = obtenerValor("nombre");
    document.getElementById("r-cui").textContent = edad <= 17 ? obtenerValor("cui") : "No aplica";
    document.getElementById("r-dpi").textContent = edad > 17 ? obtenerValor("dpi") : "No aplica";
    document.getElementById("r-edad").textContent = edad || "No especificado";
    document.getElementById("r-genero").textContent = genero;
    document.getElementById("r-periodo").textContent = genero === "mujer" ? obtenerValor("periodo") : "No aplica";
    document.getElementById("r-embarazo").textContent = genero === "mujer" ? obtenerValor("embarazo") : "No aplica";
    
    document.getElementById("r-cronica").textContent = (obtenerValor("tiene-enfermedad-cronica") === "No") ? "No" : (cronica || "No especificado");
    document.getElementById("r-alergias").textContent = (obtenerValor("tiene-alergia") === "No") ? "No" : (alergia || "No especificado");
    document.getElementById("r-operado").textContent = (obtenerValor("fue-operado") === "No") ? "No" : (operado || "No especificado");
    document.getElementById("r-familia").textContent = (obtenerValor("tiene-familia") === "No") ? "No" : (familia || "No especificado");

    document.getElementById("r-oxigenacion").textContent = obtenerValor("oxigenacion");
    document.getElementById("r-pulso").textContent = obtenerValor("pulso");
document.getElementById("r-presion-sistolica").textContent = obtenerValor("presion-sistolica");
document.getElementById("r-presion-diastolica").textContent = obtenerValor("presion-diastolica");
document.getElementById("r-temperatura").textContent = obtenerValor("temperatura");
document.getElementById("r-zona-dolor").textContent = obtenerValor("zonaSelect") !== "" ? obtenerValor("zonaSelect") : obtenerValor("zona-especifica");
}


function imprimirResumenRawbt() {
    const cronica = document.getElementById("enfermedad-cronica-select")?.value;
    const alergia = document.getElementById("alergias-select")?.value;
    const operado = document.getElementById("operaciones-select")?.value;
    const familia = document.getElementById("familia-select")?.value;

    const texto =
        `--- Diagnóstico Previo ---\n` +
        `Nombre: ${obtenerValor("nombre")}\n` +
        `Edad: ${obtenerValor("edad")}\n` +
        `CUI: ${obtenerValor("cui")}\n` +
        `DPI: ${obtenerValor("dpi")}\n` +
        `Género: ${obtenerValor("genero")}\n` +
        `Periodo: ${obtenerValor("periodo")}\n` +
        `Embarazo: ${obtenerValor("embarazo")}\n` +
        `Enfermedad Crónica: ${(obtenerValor("tiene-enfermedad-cronica") === "No") ? "No" : (cronica || "No especificado")}\n` +
        `Alergias: ${(obtenerValor("tiene-alergia") === "No") ? "No" : (alergia || "No especificado")}\n` +
        `Operaciones: ${(obtenerValor("fue-operado") === "No") ? "No" : (operado || "No especificado")}\n` +
        `Familiares: ${(obtenerValor("tiene-familia") === "No") ? "No" : (familia || "No especificado")}\n` +
        `Oxigenación: ${obtenerValor("oxigenacion")}\n` +
        `Pulso: ${obtenerValor("pulso")}\n` +
        `Presión: ${obtenerValor("presion-sistolica")}/${obtenerValor("presion-diastolica")}\n` +
        `Temperatura: ${obtenerValor("temperatura")}\n` +
        `Zona de Dolor: ${obtenerValor("zonaSelect") || obtenerValor("zona-especifica")}\n` +
        `-------------------------\n\n`;

  const rawbtURL = "rawbt:" + encodeURIComponent(texto);
  window.location.href = rawbtURL;
}


function imprimirYReiniciar() {
  mostrarResumen();

  document.querySelectorAll(".seccion").forEach(s => s.classList.add("oculto"));
  const resultado = document.getElementById("resultado");
  resultado.classList.remove("oculto");
  resultado.scrollIntoView({ behavior: "smooth", block: "start" });

  setTimeout(() => {
    imprimirResumenRawbt(); 
  }, 1500);

  setTimeout(() => {
    window.location.href = "index.html"; 
  }, 3000);
}

