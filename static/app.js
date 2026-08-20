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

// --- Fotos dinámicas de la auditoría (hasta MAX_FOTOS) ---------------------
// En vez de campos fijos, el técnico va agregando fotos con el botón
// "+ Agregar foto" (hasta el máximo). Cada foto tiene su propia glosa
// (descripción de a qué corresponde). Los campos se numeran en orden
// (foto_1, glosa_1, foto_2, glosa_2, ...) cada vez que se agrega o quita
// una foto, así el backend siempre puede leerlos como foto_1..foto_N.
//
// IMPORTANTE: este número tiene que coincidir con MAX_FOTOS en app.py.
const MAX_FOTOS = 8;

let contadorSlotId = 0;

function crearSlotFoto() {
  contadorSlotId += 1;

  const slot = document.createElement("div");
  slot.className = "foto-slot";
  slot.dataset.slotId = String(contadorSlotId);

  slot.innerHTML = `
    <div class="foto-slot-header">
      <label class="foto-label">Foto <span class="foto-slot-numero"></span></label>
      <button type="button" class="foto-eliminar">Quitar ✕</button>
    </div>
    <div class="foto-input-row">
      <button type="button" class="foto-btn">
        <span class="foto-preview">📷</span>
        <span class="foto-btn-text">Tomar foto con la cámara</span>
      </button>
      <input type="file" class="foto-file-input" style="display:none" />
    </div>
    <input type="text" class="foto-glosa-input" placeholder='Glosa: ¿a qué corresponde esta foto? (ej: "Antena en el techo")' />
  `;

  const btnCamara = slot.querySelector(".foto-btn");
  const inputArchivo = slot.querySelector(".foto-file-input");
  const preview = slot.querySelector(".foto-preview");
  const btnEliminar = slot.querySelector(".foto-eliminar");

  btnCamara.addEventListener("click", () => {
    const numero = slot.querySelector(".foto-slot-numero").textContent;
    abrirCamara(inputArchivo, preview, `Foto ${numero}`);
  });

  btnEliminar.addEventListener("click", () => {
    slot.remove();
    renumerarFotoSlots();
  });

  return slot;
}

function agregarFotoSlot() {
  const contenedor = document.getElementById("fotos-container");
  if (!contenedor) return;

  const actuales = contenedor.querySelectorAll(".foto-slot").length;
  if (actuales >= MAX_FOTOS) return;

  contenedor.appendChild(crearSlotFoto());
  renumerarFotoSlots();
}

function renumerarFotoSlots() {
  const contenedor = document.getElementById("fotos-container");
  if (!contenedor) return;

  const slots = contenedor.querySelectorAll(".foto-slot");

  slots.forEach((slot, index) => {
    const numero = index + 1;
    slot.querySelector(".foto-slot-numero").textContent = numero;

    const inputArchivo = slot.querySelector(".foto-file-input");
    const inputGlosa = slot.querySelector(".foto-glosa-input");

    inputArchivo.name = `foto_${numero}`;
    inputArchivo.id = `foto_input_${numero}`;
    inputGlosa.name = `glosa_${numero}`;
    inputGlosa.id = `glosa_input_${numero}`;
  });

  const contador = document.getElementById("fotos-contador");
  if (contador) {
    contador.textContent = `${slots.length} de ${MAX_FOTOS} fotos agregadas`;
  }

  const btnAgregar = document.getElementById("btn-agregar-foto");
  if (btnAgregar) {
    const alcanzoMaximo = slots.length >= MAX_FOTOS;
    btnAgregar.disabled = alcanzoMaximo;
    btnAgregar.style.display = alcanzoMaximo ? "none" : "block";
  }
}

function inicializarFotos() {
  const btnAgregar = document.getElementById("btn-agregar-foto");
  if (btnAgregar) {
    btnAgregar.addEventListener("click", agregarFotoSlot);
  }
  agregarFotoSlot(); // arranca con una foto lista para completar
}

function mostrarPreview(inputEl, previewEl) {
  const archivo = inputEl.files && inputEl.files[0];

  if (!archivo) {
    previewEl.innerHTML = "📷";
    return;
  }

  const lector = new FileReader();
  lector.onload = (e) => {
    previewEl.innerHTML = `<img src="${e.target.result}" alt="Vista previa" />`;
  };
  lector.readAsDataURL(archivo);
}

// --- Cámara en vivo -------------------------------------------------------
// En vez de dejar que el navegador ofrezca "elegir de la galería", la app
// abre la cámara del celular directamente dentro de la página (con
// getUserMedia) y solo permite capturar una foto nueva en el momento. Así
// no queda forma de adjuntar fotos sacadas antes.

let camaraStreamActual = null;
let camaraInputActual = null;
let camaraPreviewActual = null;

async function abrirCamara(inputEl, previewEl, titulo) {
  const modal = document.getElementById("camera-modal");
  const video = document.getElementById("camera-video");
  const tituloEl = document.getElementById("camera-titulo");

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert(
      "Este navegador no permite acceder a la cámara desde la app. Probá actualizar el navegador o usar Chrome/Safari en su versión más reciente."
    );
    return;
  }

  camaraInputActual = inputEl;
  camaraPreviewActual = previewEl;
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
  camaraInputActual = null;
  camaraPreviewActual = null;
}

function capturarFoto() {
  const video = document.getElementById("camera-video");
  const canvas = document.getElementById("camera-canvas");
  if (!camaraInputActual || !video.videoWidth) return;

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
      const archivo = new File([blob], `foto_${Date.now()}.jpg`, { type: "image/jpeg" });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(archivo);
      camaraInputActual.files = dataTransfer.files;

      mostrarPreview(camaraInputActual, camaraPreviewActual);
      cerrarCamara();
    },
    "image/jpeg",
    0.9
  );
}

// --- Correos "Otros correos" y "CC" predefinidos ---------------------------
// Para no tener que escribir siempre los mismos correos, la app guarda en el
// propio celular (localStorage del navegador) lo último que se escribió en
// "Otros correos" y en "Con copia (CC)", y lo deja precargado la próxima vez
// que se abre la app (por ejemplo después de instalarla en la pantalla de
// inicio). Esto es solo un recordatorio local del celular: cada técnico
// puede seguir escribiendo o borrando el correo que quiera en el momento.

const CLAVE_CORREO_EXTRA = "informeInstalacion_correoExtra";
const CLAVE_CC_EXTRA = "informeInstalacion_ccExtra";

function guardarCorreosPredefinidos() {
  const inputCorreoExtra = document.getElementById("correo_extra");
  const inputCcExtra = document.getElementById("cc_extra");
  try {
    if (inputCorreoExtra) localStorage.setItem(CLAVE_CORREO_EXTRA, inputCorreoExtra.value.trim());
    if (inputCcExtra) localStorage.setItem(CLAVE_CC_EXTRA, inputCcExtra.value.trim());
  } catch (err) {
    // Si el navegador bloquea localStorage (modo privado, etc.), la app
    // sigue funcionando normalmente, solo que sin recordar los correos.
  }
}

function inicializarCorreosPredefinidos() {
  const inputCorreoExtra = document.getElementById("correo_extra");
  const inputCcExtra = document.getElementById("cc_extra");

  try {
    if (inputCorreoExtra) {
      const guardado = localStorage.getItem(CLAVE_CORREO_EXTRA);
      if (guardado) inputCorreoExtra.value = guardado;
    }
    if (inputCcExtra) {
      const guardado = localStorage.getItem(CLAVE_CC_EXTRA);
      if (guardado) inputCcExtra.value = guardado;
    }
  } catch (err) {
    // Si el navegador bloquea localStorage (modo privado, etc.), la app
    // sigue funcionando normalmente, solo que sin recordar los correos.
  }

  if (inputCorreoExtra) inputCorreoExtra.addEventListener("blur", guardarCorreosPredefinidos);
  if (inputCcExtra) inputCcExtra.addEventListener("blur", guardarCorreosPredefinidos);
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
  inicializarFotos();
  inicializarCorreosPredefinidos();

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
    guardarCorreosPredefinidos();

    if (rutInput && !rutValido(rutInput.value)) {
      event.preventDefault();
      validarRutEnPantalla();
      alert("El RUT del cliente no es válido. Revisalo (incluyendo el dígito verificador) antes de enviar.");
      rutInput.focus();
      return;
    }

    // Los inputs de tipo archivo están ocultos (las fotos se cargan desde
    // la cámara en vivo, no eligiéndolas), así que la validación "required"
    // nativa del navegador no funciona bien sobre ellos. Se valida acá:
    // tiene que haber al menos una foto, y toda foto que se haya cargado
    // tiene que tener su glosa completa.
    const slotsFoto = document.querySelectorAll("#fotos-container .foto-slot");
    let totalFotos = 0;
    const glosasFaltantes = [];

    slotsFoto.forEach((slot, index) => {
      const inputArchivo = slot.querySelector(".foto-file-input");
      const inputGlosa = slot.querySelector(".foto-glosa-input");
      const tieneArchivo = inputArchivo && inputArchivo.files && inputArchivo.files[0];

      if (tieneArchivo) {
        totalFotos += 1;
        if (!inputGlosa || !inputGlosa.value.trim()) {
          glosasFaltantes.push(index + 1);
        }
      }
    });

    if (totalFotos === 0) {
      event.preventDefault();
      alert("Agregá al menos una foto a la auditoría antes de enviar.");
      return;
    }

    if (glosasFaltantes.length > 0) {
      event.preventDefault();
      alert(
        "Falta la glosa (descripción) de la foto " +
          glosasFaltantes.join(", ") +
          ". Cada foto necesita indicar a qué corresponde."
      );
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
