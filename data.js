// Mostrar selector de idioma
function mostrarSelectorIdioma() {
  document.getElementById('boton-continuar').classList.add('oculto');
  document.getElementById('selector-idioma').classList.remove('oculto');
}

function iniciar(idioma) {
  document.getElementById('bienvenida').style.display = 'none';
  document.querySelector('form.contenedor').style.display = 'block';
  mostrarSeccion('seccion-datos-basicos');
}

// Función para mostrar solo la sección indicada
function mostrarSeccion(id) {
  document.querySelectorAll(".seccion").forEach(s => s.classList.add("oculto"));
  const seccion = document.getElementById(id);
  if (seccion) seccion.classList.remove("oculto");
}

// Validar datos básicos y avanzar
function validarDatosBasicos() {
  const nombre = document.getElementById("nombre").value.trim();
  const edadStr = document.getElementById("edad").value.trim();
  const edad = parseInt(edadStr);

  if (!nombre) {
    alert("Por favor, ingresa tu nombre.");
    return;
  }
  if (!edadStr || isNaN(edad) || edad <= 0) {
    alert("Por favor, ingresa una edad válida.");
    return;
  }

  // Mostrar sección identificación y mostrar campos según edad
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
    if (!cui) {
      alert("Por favor, ingresa tu CUI.");
      return;
    }
  } else {
    const dpi = document.getElementById("dpi").value.trim();
    if (!dpi) {
      alert("Por favor, ingresa tu DPI.");
      return;
    }
  }
  mostrarSeccion("seccion-genero");
}

function verificarGenero() {
  const genero = document.getElementById("genero").value;
  const extraMujer = document.getElementById("extra-mujer");
  if (genero === "mujer") {
    extraMujer.classList.remove("oculto");
  } else {
    extraMujer.classList.add("oculto");
  }
}

function detectarEnterGenero(event) {
  if (event.key === "Enter") {
    verificarGenero();
  }
}

function toggleInput(selectId, inputId) {
  const selectVal = document.getElementById(selectId).value;
  const input = document.getElementById(inputId);
  if (selectVal === "sí") {
    input.classList.remove("oculto");
  } else {
    input.classList.add("oculto");
    input.value = "";
  }
}

function validarYContinuar(selectId, inputId, siguienteSeccion) {
  const selectVal = document.getElementById(selectId).value;
  const inputVal = document.getElementById(inputId).value.trim();

  if (!selectVal) {
    alert("Por favor, selecciona una opción.");
    return;
  }
  if (selectVal === "sí" && !inputVal) {
    alert("Por favor, completa el campo requerido.");
    return;
  }
  mostrarSeccion(siguienteSeccion);
}

function mostrarCronica() {
  mostrarSeccion("seccion-cronica");
}
function mostrarAlergias() {
  validarYContinuar("tiene-enfermedad-cronica", "cronica", "seccion-alergias");
}
function mostrarOperaciones() {
  validarYContinuar("tiene-alergia", "alergias", "seccion-operaciones");
}
function mostrarFamilia() {
  validarYContinuar("fue-operado", "operado", "seccion-familia");
}
function mostrarSignos() {
  validarYContinuar("tiene-familia", "caso-familiar", "seccion-signos");
}

function evaluarSignos() {
  const oxigenacion = parseFloat(document.getElementById("oxigenacion").value);
  const pulso = parseFloat(document.getElementById("pulso").value);
  const sistolica = parseFloat(document.getElementById("presion-sistolica").value);
  const diastolica = parseFloat(document.getElementById("presion-diastolica").value);
  const temperatura = parseFloat(document.getElementById("temperatura").value);

  if ([oxigenacion, pulso, sistolica, diastolica, temperatura].some(v => isNaN(v))) {
    alert("Por favor, completa todos los signos vitales con valores válidos.");
    return;
  }

  let mensajes = [];
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

  document.getElementById("r-nombre").textContent = obtenerValor("nombre");
  document.getElementById("r-cui").textContent = edad <= 17 ? obtenerValor("cui") : "No aplica";
  document.getElementById("r-dpi").textContent = edad > 17 ? obtenerValor("dpi") : "No aplica";
  document.getElementById("r-edad").textContent = edad || "No especificado";
  document.getElementById("r-genero").textContent = genero;
  document.getElementById("r-periodo").textContent = genero === "mujer" ? obtenerValor("periodo") : "No aplica";
  document.getElementById("r-embarazo").textContent = genero === "mujer" ? obtenerValor("embarazo") : "No aplica";
  document.getElementById("r-cronica").textContent = obtenerValor("tiene-enfermedad-cronica") === "sí" ? obtenerValor("cronica") : "No";
  document.getElementById("r-alergias").textContent = obtenerValor("tiene-alergia") === "sí" ? obtenerValor("alergias") : "No";
  document.getElementById("r-operado").textContent = obtenerValor("fue-operado") === "sí" ? obtenerValor("operado") : "No";
  document.getElementById("r-familia").textContent = obtenerValor("tiene-familia") === "sí" ? obtenerValor("caso-familiar") : "No";
  document.getElementById("r-oxigenacion").textContent = obtenerValor("oxigenacion");
  document.getElementById("r-pulso").textContent = obtenerValor("pulso");
  document.getElementById("r-presion").textContent = obtenerValor("presion-sistolica") + "/" + obtenerValor("presion-diastolica");
  document.getElementById("r-temperatura").textContent = obtenerValor("temperatura");
  document.getElementById("r-zona-dolor").textContent = obtenerValor("zonaSelect") !== "" ? obtenerValor("zonaSelect") : obtenerValor("zona-especifica");
}

function imprimirYReiniciar() {
  mostrarResumen();

  const nombre = obtenerValor("nombre");
  const edad = obtenerValor("edad");
  const cui = obtenerValor("cui");
  const dpi = obtenerValor("dpi");
  const genero = obtenerValor("genero");
  const periodo = obtenerValor("periodo");
  const embarazo = obtenerValor("embarazo");
  const cronica = obtenerValor("tiene-enfermedad-cronica") === "sí" ? obtenerValor("cronica") : "No";
  const alergias = obtenerValor("tiene-alergia") === "sí" ? obtenerValor("alergias") : "No";
  const operado = obtenerValor("fue-operado") === "sí" ? obtenerValor("operado") : "No";
  const familia = obtenerValor("tiene-familia") === "sí" ? obtenerValor("caso-familiar") : "No";
  const oxigenacion = obtenerValor("oxigenacion");
  const pulso = obtenerValor("pulso");
  const presion = obtenerValor("presion-sistolica") + "/" + obtenerValor("presion-diastolica");
  const temperatura = obtenerValor("temperatura");
  const zonaDolor = obtenerValor("zonaSelect") !== "" ? obtenerValor("zonaSelect") : obtenerValor("zona-especifica");

  const textoImpresion = 
`***** TheRef - Diagnóstico Médico Previo *****

Nombre: ${nombre}
Edad: ${edad}
CUI: ${cui}
DPI: ${dpi}
Género: ${genero}
Periodo: ${periodo}
Embarazo: ${embarazo}

Enfermedad Crónica: ${cronica}
Alergias: ${alergias}
Operaciones: ${operado}
Antecedentes Familiares: ${familia}

Signos Vitales:
 - Oxigenación: ${oxigenacion} %
 - Pulso: ${pulso} lpm
 - Presión: ${presion} mmHg
 - Temperatura: ${temperatura} °C

Zona de Dolor: ${zonaDolor}

**************************************`;

  const urlRawBT = "rawbt://print?text=" + encodeURIComponent(textoImpresion);
  window.location.href = urlRawBT;

  setTimeout(() => {
    location.reload();
  }, 3000);
}
