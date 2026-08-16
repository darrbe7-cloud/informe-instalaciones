// --- Regiones y comunas de Chile -------------------------------------------
// Listado oficial de las 16 regiones con sus comunas (346 en total). Se usa
// para armar el <select> de Región y, según la región elegida, filtrar el
// <select> de Comuna correspondiente.

const REGIONES_COMUNAS = {
  "Región de Arica y Parinacota": ["Arica", "Camarones", "General Lagos", "Putre"],
  "Región de Tarapacá": ["Alto Hospicio", "Camiña", "Colchane", "Huara", "Iquique", "Pica", "Pozo Almonte"],
  "Región de Antofagasta": ["Antofagasta", "Calama", "María Elena", "Mejillones", "Ollagüe", "San Pedro de Atacama", "Sierra Gorda", "Taltal", "Tocopilla"],
  "Región de Atacama": ["Alto del Carmen", "Caldera", "Chañaral", "Copiapó", "Diego de Almagro", "Freirina", "Huasco", "Tierra Amarilla", "Vallenar"],
  "Región de Coquimbo": ["Andacollo", "Canela", "Combarbalá", "Coquimbo", "Illapel", "La Higuera", "La Serena", "Los Vilos", "Monte Patria", "Ovalle", "Paihuano", "Punitaqui", "Río Hurtado", "Salamanca", "Vicuña"],
  "Región de Valparaíso": ["Algarrobo", "Cabildo", "Calle Larga", "Cartagena", "Casablanca", "Catemu", "Concón", "El Quisco", "El Tabo", "Hijuelas", "Isla de Pascua", "Juan Fernández", "La Calera", "La Cruz", "La Ligua", "Limache", "Llay-Llay", "Los Andes", "Nogales", "Olmué", "Panquehue", "Papudo", "Petorca", "Puchuncaví", "Putaendo", "Quillota", "Quilpué", "Quintero", "Rinconada", "San Antonio", "San Esteban", "San Felipe", "Santa María", "Santo Domingo", "Valparaíso", "Villa Alemana", "Viña del Mar", "Zapallar"],
  "Región Metropolitana de Santiago": ["Alhué", "Buin", "Calera de Tango", "Cerrillos", "Cerro Navia", "Colina", "Conchalí", "Curacaví", "El Bosque", "El Monte", "Estación Central", "Huechuraba", "Independencia", "Isla de Maipo", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Lampa", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "María Pinto", "Melipilla", "Ñuñoa", "Padre Hurtado", "Paine", "Pedro Aguirre Cerda", "Peñaflor", "Peñalolén", "Pirque", "Providencia", "Pudahuel", "Puente Alto", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Bernardo", "San Joaquín", "San José de Maipo", "San Miguel", "San Pedro", "San Ramón", "Santiago", "Talagante", "Tiltil", "Vitacura"],
  "Región del Libertador General Bernardo O'Higgins": ["Chépica", "Chimbarongo", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "La Estrella", "Las Cabras", "Litueche", "Lolol", "Machalí", "Malloa", "Marchihue", "Mostazal", "Nancagua", "Navidad", "Olivar", "Palmilla", "Paredones", "Peralillo", "Peumo", "Pichidegua", "Pichilemu", "Placilla", "Pumanque", "Quinta de Tilcoco", "Rancagua", "Rengo", "Requínoa", "San Fernando", "San Vicente", "Santa Cruz"],
  "Región del Maule": ["Cauquenes", "Chanco", "Colbún", "Constitución", "Curepto", "Curicó", "Empedrado", "Hualañé", "Licantén", "Linares", "Longaví", "Maule", "Molina", "Parral", "Pelarco", "Pelluhue", "Pencahue", "Rauco", "Retiro", "Río Claro", "Romeral", "Sagrada Familia", "San Clemente", "San Javier", "San Rafael", "Talca", "Teno", "Vichuquén", "Villa Alegre", "Yerbas Buenas"],
  "Región de Ñuble": ["Bulnes", "Chillán", "Chillán Viejo", "Cobquecura", "Coelemu", "Coihueco", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"],
  "Región del Biobío": ["Alto Biobío", "Antuco", "Arauco", "Cabrero", "Cañete", "Chiguayante", "Concepción", "Contulmo", "Coronel", "Curanilahue", "Florida", "Hualpén", "Hualqui", "Laja", "Lebu", "Los Álamos", "Los Ángeles", "Lota", "Mulchén", "Nacimiento", "Negrete", "Penco", "Quilaco", "Quilleco", "San Pedro de la Paz", "San Rosendo", "Santa Bárbara", "Santa Juana", "Talcahuano", "Tirúa", "Tomé", "Tucapel", "Yumbel"],
  "Región de La Araucanía": ["Angol", "Carahue", "Cholchol", "Collipulli", "Cunco", "Curacautín", "Curarrehue", "Ercilla", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Lonquimay", "Los Sauces", "Lumaco", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Purén", "Renaico", "Saavedra", "Temuco", "Teodoro Schmidt", "Toltén", "Traiguén", "Victoria", "Vilcún", "Villarrica"],
  "Región de Los Ríos": ["Corral", "Futrono", "Lago Ranco", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "Río Bueno", "La Unión", "Valdivia"],
  "Región de Los Lagos": ["Ancud", "Calbuco", "Castro", "Chaitén", "Chonchi", "Cochamó", "Curaco de Vélez", "Dalcahue", "Fresia", "Frutillar", "Futaleufú", "Hualaihué", "Llanquihue", "Los Muermos", "Maullín", "Osorno", "Palena", "Puerto Montt", "Puerto Octay", "Puerto Varas", "Puqueldón", "Purranque", "Puyehue", "Queilén", "Quellón", "Quemchi", "Quinchao", "Río Negro", "San Juan de la Costa", "San Pablo"],
  "Región de Aysén del General Carlos Ibáñez del Campo": ["Aysén", "Chile Chico", "Cisnes", "Cochrane", "Coyhaique", "Guaitecas", "Lago Verde", "O'Higgins", "Río Ibáñez", "Tortel"],
  "Región de Magallanes y de la Antártica Chilena": ["Antártica", "Cabo de Hornos", "Laguna Blanca", "Natales", "Porvenir", "Primavera", "Punta Arenas", "Río Verde", "San Gregorio", "Timaukel", "Torres del Paine"],
};

function inicializarRegionComuna() {
  const regionSelect = document.getElementById("region");
  const comunaSelect = document.getElementById("comuna");
  if (!regionSelect || !comunaSelect) return;

  Object.keys(REGIONES_COMUNAS).forEach((region) => {
    const opcion = document.createElement("option");
    opcion.value = region;
    opcion.textContent = region;
    regionSelect.appendChild(opcion);
  });

  function actualizarComunas() {
    const region = regionSelect.value;
    const comunas = REGIONES_COMUNAS[region] || [];

    comunaSelect.innerHTML = "";

    if (!region) {
      comunaSelect.disabled = true;
      const opcion = document.createElement("option");
      opcion.value = "";
      opcion.textContent = "Selecciona primero una región";
      comunaSelect.appendChild(opcion);
      return;
    }

    comunaSelect.disabled = false;
    const opcionVacia = document.createElement("option");
    opcionVacia.value = "";
    opcionVacia.textContent = "Selecciona una comuna";
    comunaSelect.appendChild(opcionVacia);

    comunas.forEach((comuna) => {
      const opcion = document.createElement("option");
      opcion.value = comuna;
      opcion.textContent = comuna;
      comunaSelect.appendChild(opcion);
    });
  }

  regionSelect.addEventListener("change", actualizarComunas);
  actualizarComunas();
}

function previewFoto(clave) {
  const input = document.getElementById(`foto_${clave}`);
  const preview = document.getElementById(`preview-${clave}`);
  const archivo = input.files && input.files[0];

  if (!archivo) {
    preview.innerHTML = "📷";
    return;
  }

  const lector = new FileReader();
  lector.onload = (e) => {
    preview.innerHTML = `<img src="${e.target.result}" alt="Vista previa" />`;
  };
  lector.readAsDataURL(archivo);
}

// --- Cámara en vivo -------------------------------------------------------
// En vez de dejar que el navegador ofrezca "elegir de la galería", la app
// abre la cámara del celular directamente dentro de la página (con
// getUserMedia) y solo permite capturar una foto nueva en el momento. Así
// no queda forma de adjuntar fotos sacadas antes.

let camaraStreamActual = null;
let camaraSlotActual = null;

async function abrirCamara(slotKey, titulo) {
  const modal = document.getElementById("camera-modal");
  const video = document.getElementById("camera-video");
  const tituloEl = document.getElementById("camera-titulo");

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert(
      "Este navegador no permite acceder a la cámara desde la app. Probá actualizar el navegador o usar Chrome/Safari en su versión más reciente."
    );
    return;
  }

  camaraSlotActual = slotKey;
  if (tituloEl) tituloEl.textContent = titulo || "";

  try {
    camaraStreamActual = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    });
  } catch (err) {
    alert(
      "No se pudo acceder a la cámara. Revisá que le hayas dado permiso a la app en la configuración del navegador.\n\nDetalle: " +
        err.message
    );
    return;
  }

  video.srcObject = camaraStreamActual;
  modal.style.display = "flex";
}

function cerrarCamara() {
  const modal = document.getElementById("camera-modal");
  modal.style.display = "none";
  if (camaraStreamActual) {
    camaraStreamActual.getTracks().forEach((track) => track.stop());
    camaraStreamActual = null;
  }
  camaraSlotActual = null;
}

function capturarFoto() {
  const video = document.getElementById("camera-video");
  const canvas = document.getElementById("camera-canvas");
  const slotKey = camaraSlotActual;
  if (!slotKey || !video.videoWidth) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(
    (blob) => {
      if (!blob) {
        alert("No se pudo capturar la foto, probá de nuevo.");
        return;
      }
      const archivo = new File([blob], `foto_${slotKey}.jpg`, { type: "image/jpeg" });
      const input = document.getElementById(`foto_${slotKey}`);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(archivo);
      input.files = dataTransfer.files;

      previewFoto(slotKey);
      cerrarCamara();
    },
    "image/jpeg",
    0.9
  );
}

// --- Validación de RUT chileno --------------------------------------------

function limpiarRut(rut) {
  return (rut || "").replace(/[^0-9kK]/g, "").toUpperCase();
}

function calcularDvRut(cuerpo) {
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}

function rutValido(rut) {
  const limpio = limpiarRut(rut);
  if (limpio.length < 2) return false;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return false;
  return calcularDvRut(cuerpo) === dv;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-informe");
  const boton = document.getElementById("btn-enviar");

  inicializarRegionComuna();

  const btnCancelar = document.getElementById("camera-cancel");
  const btnCapturar = document.getElementById("camera-capture");
  if (btnCancelar) btnCancelar.addEventListener("click", cerrarCamara);
  if (btnCapturar) btnCapturar.addEventListener("click", capturarFoto);

  const rutInput = document.getElementById("rut_cliente");
  const rutError = document.getElementById("rut-error");

  function validarRutEnPantalla() {
    if (!rutInput) return true;
    const valor = rutInput.value.trim();
    if (!valor) {
      rutInput.classList.remove("input-error");
      if (rutError) rutError.style.display = "none";
      return false; // vacío también es inválido, pero sin mostrar el error hasta que escriba algo
    }
    const esValido = rutValido(valor);
    rutInput.classList.toggle("input-error", !esValido);
    if (rutError) rutError.style.display = esValido ? "none" : "block";
    return esValido;
  }

  if (rutInput) {
    rutInput.addEventListener("blur", validarRutEnPantalla);
    rutInput.addEventListener("input", () => {
      // mientras escribe, si ya estaba marcado como error, revalida en vivo
      if (rutInput.classList.contains("input-error")) validarRutEnPantalla();
    });
  }

  form.addEventListener("submit", (event) => {
    if (rutInput && !rutValido(rutInput.value)) {
      event.preventDefault();
      validarRutEnPantalla();
      alert("El RUT del cliente no es válido. Revisalo (incluyendo el dígito verificador) antes de enviar.");
      rutInput.focus();
      return;
    }

    // Los inputs de tipo archivo están ocultos (las fotos se cargan desde
    // la cámara en vivo, no eligiéndolos), así que la validación "required"
    // nativa del navegador no funciona bien sobre ellos. Se valida acá.
    const fotosObligatorias = document.querySelectorAll(
      '.foto-file-input[data-obligatoria="true"]'
    );
    const faltantes = [];
    fotosObligatorias.forEach((input) => {
      if (!input.files || !input.files[0]) {
        faltantes.push(input.dataset.titulo || input.name);
      }
    });

    if (faltantes.length > 0) {
      event.preventDefault();
      alert("Faltan estas fotos obligatorias:\n- " + faltantes.join("\n- "));
      return;
    }

    boton.disabled = true;
    boton.textContent = "Enviando...";
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/static/service-worker.js").catch(() => {
      // Si falla el registro, la app sigue funcionando normalmente por navegador.
    });
  }
});
