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
const MAX_FOTOS = 10;

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
    // Se limita la resolución de captura (Full HD) para que cada foto pese
    // poco sin importar qué tan buena sea la cámara del celular: así el
    // conjunto de hasta MAX_FOTOS fotos de una auditoría queda bien lejos
    // del límite de tamaño que acepta el servidor (MAX_CONTENT_LENGTH en
    // app.py). No afecta la nitidez de forma perceptible en el PDF.
    camaraStreamActual = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1920, max: 1920 },
        height: { ideal: 1080, max: 1080 },
      },
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

// --- Compartir el PDF generado ---------------------------------------------
// En vez de mandar el correo desde el servidor con una cuenta fija, la app
// genera el PDF y se lo entrega al celular usando la Web Share API (la
// misma función que usa "Compartir" en WhatsApp, Telegram o Instagram). El
// propio auditor elige con qué app mandarlo (WhatsApp, Telegram, Gmail,
// Outlook, etc.), usando sus propias cuentas ya configuradas en el celular.
// Si el navegador no soporta compartir archivos, el PDF se descarga para
// adjuntarlo a mano. Además, siempre se manda una copia automática por
// correo desde el servidor (ver app.py).

const URL_GENERAR_PDF = "/generar-pdf";

function mostrarEstadoEnvio(mensaje, tipo) {
  let contenedor = document.getElementById("estado-envio");
  if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.id = "estado-envio";
    contenedor.className = "flash-container";
    const main = document.querySelector("main");
    if (main) main.insertBefore(contenedor, main.firstChild);
  }
  contenedor.innerHTML = `<div class="flash flash-${tipo}">${mensaje}</div>`;
  contenedor.scrollIntoView({ behavior: "smooth", block: "start" });
}

function descargarComoArchivo(blob, nombreArchivo) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function nombreDesdeContentDisposition(disposition, porDefecto) {
  if (!disposition) return porDefecto;
  const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  return match ? decodeURIComponent(match[1]) : porDefecto;
}

// Hace el pedido al servidor y devuelve los datos del PDF ya generado. Si el
// `fetch` ni siquiera llega a completarse (sin conexión a internet), lanza
// un error marcado con `esErrorDeRed = true`, para poder distinguirlo de un
// error de validación real (RUT inválido, falta una glosa, etc.).
async function enviarAlServidor(formData) {
  let resp;
  try {
    resp = await fetch(URL_GENERAR_PDF, { method: "POST", body: formData });
  } catch (errorRed) {
    const error = new Error("Sin conexión a internet.");
    error.esErrorDeRed = true;
    throw error;
  }

  if (!resp.ok) {
    let mensajeError = "No se pudo generar el PDF.";
    try {
      const data = await resp.json();
      if (data && data.error) mensajeError = data.error;
    } catch (err) {
      // si la respuesta de error no viene en JSON, se usa el mensaje genérico
    }
    const error = new Error(mensajeError);
    error.esErrorDeRed = false;
    throw error;
  }

  const nombreArchivo = nombreDesdeContentDisposition(
    resp.headers.get("Content-Disposition"),
    "Informe_Auditoria.pdf"
  );

  // El servidor ya intentó mandar el correo automático (siempre a
  // auditoriastuves@tuves.com, y también a los correos adicionales si están
  // configurados) antes de devolver el PDF. El resultado viaja en estas
  // cabeceras, para avisarle al técnico con un mensaje bien visible.
  const emailEnviado = resp.headers.get("X-Email-Enviado") === "1";
  const emailError = resp.headers.get("X-Email-Error");
  const emailDestino = resp.headers.get("X-Email-Destino") || "auditoriastuves@tuves.com";
  const blob = await resp.blob();

  return { blob, nombreArchivo, emailEnviado, emailError, emailDestino };
}

// Abre el menú nativo de "Compartir" (WhatsApp, Telegram, Gmail, etc.) con
// el PDF ya generado. Solo se puede llamar justo después de un toque del
// técnico (por eso no se usa en los reintentos automáticos en segundo
// plano: el navegador no deja abrir ese menú si no es en respuesta directa
// a una acción de la persona).
async function compartirPdfGenerado({ blob, nombreArchivo, emailEnviado, emailError, emailDestino }) {
  const avisoCorreo = emailEnviado
    ? `<br><strong>✅ Auditoría enviada correctamente</strong> por correo a: ${emailDestino}.`
    : `<br><strong>⚠️ No se pudo enviar automáticamente la auditoría por correo.</strong>` +
      (emailError ? ` Detalle: ${emailError}.` : "") +
      " Compartí o descargá el PDF para mandarlo de forma manual.";

  const archivoPdf = new File([blob], nombreArchivo, { type: "application/pdf" });

  if (navigator.canShare && navigator.canShare({ files: [archivoPdf] })) {
    try {
      await navigator.share({
        files: [archivoPdf],
        title: "Informe de Auditoría",
        text: "Se adjunta el informe de auditoría generado desde la app.",
      });
      mostrarEstadoEnvio(
        "PDF generado. Elegí la app (WhatsApp, Telegram, Gmail, etc.) para enviarlo." + avisoCorreo,
        emailEnviado ? "success" : "error"
      );
    } catch (err) {
      if (err && err.name === "AbortError") {
        // El auditor cerró el menú de compartir sin elegir nada: no es un error.
        mostrarEstadoEnvio(
          "PDF generado. Tocá \"Generar PDF y compartir\" de nuevo cuando quieras compartirlo." + avisoCorreo,
          emailEnviado ? "success" : "error"
        );
      } else {
        descargarComoArchivo(blob, nombreArchivo);
        mostrarEstadoEnvio(
          "No se pudo abrir el menú para compartir. El PDF se descargó: adjuntalo manualmente si hace falta." + avisoCorreo,
          emailEnviado ? "success" : "error"
        );
      }
    }
  } else {
    descargarComoArchivo(blob, nombreArchivo);
    mostrarEstadoEnvio(
      "Este navegador no permite compartir directamente. El PDF se descargó: adjuntalo manualmente si hace falta." + avisoCorreo,
      emailEnviado ? "success" : "error"
    );
  }
}

function resumenDesdeFormulario(form) {
  const campoRut = form.querySelector("#rut_cliente");
  const campoRegion = form.querySelector("#region");
  const campoCliente = form.querySelector("#cliente");
  const rut = (campoRut && campoRut.value.trim()) || "sin RUT";
  const region = (campoRegion && campoRegion.value.trim()) || "sin región";
  const cliente = (campoCliente && campoCliente.value.trim()) || "";
  return `RUT ${rut} - ${region}` + (cliente ? ` - ${cliente}` : "");
}

async function generarYCompartirPdf(form, boton) {
  boton.disabled = true;
  boton.textContent = "Generando PDF...";

  const formData = new FormData(form);

  try {
    const resultado = await enviarAlServidor(formData);
    await compartirPdfGenerado(resultado);
  } catch (err) {
    if (err && err.esErrorDeRed) {
      // Sin conexión: se guarda el informe completo (todos los datos y las
      // fotos ya sacadas) en este celular, para mandarlo solo, automática-
      // mente, apenas vuelva a haber señal. El técnico no tiene que volver
      // a sacar fotos ni a completar nada de nuevo (ver "Informes
      // pendientes" más abajo).
      try {
        await guardarInformePendiente(formData, resumenDesdeFormulario(form));
        mostrarEstadoEnvio(
          "📥 Sin conexión a internet: el informe se guardó en este celular y se va a enviar automáticamente apenas tengas señal. No hace falta sacar las fotos de nuevo ni volver a completar el formulario.",
          "error"
        );
        actualizarPanelPendientes();
      } catch (errorGuardado) {
        mostrarEstadoEnvio(
          "Sin conexión a internet, y no se pudo guardar el informe como pendiente en este celular. Probá de nuevo cuando tengas señal.",
          "error"
        );
      }
    } else {
      mostrarEstadoEnvio(err.message || "No se pudo generar el PDF.", "error");
    }
  } finally {
    boton.disabled = false;
    boton.textContent = "Generar PDF y compartir";
  }
}

// --- Informes pendientes de enviar (sin conexión) ---------------------------
// Si no hay internet en el momento de generar el informe, se guarda acá —en
// IndexedDB, una base de datos dentro del propio navegador/celular— con
// todos sus datos y fotos. La app reintenta mandarlos solo en cuanto detecta
// conexión (evento "online"), al volver a abrir la página, y cada cierto
// tiempo mientras está abierta, como respaldo (el evento "online" no
// siempre es confiable en celulares). Una vez que un informe pendiente se
// manda con éxito, el correo automático ya sale solo; además queda
// disponible un botón "Compartir" para mandarlo también por WhatsApp,
// Telegram, etc. cuando el técnico quiera (eso sí requiere un toque suyo).
const PENDIENTES_DB_NOMBRE = "auditoria_pendientes_db";
const PENDIENTES_DB_VERSION = 1;
const PENDIENTES_STORE = "pendientes";

function abrirPendientesDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB no disponible en este navegador."));
      return;
    }
    const peticion = indexedDB.open(PENDIENTES_DB_NOMBRE, PENDIENTES_DB_VERSION);
    peticion.onupgradeneeded = () => {
      const db = peticion.result;
      if (!db.objectStoreNames.contains(PENDIENTES_STORE)) {
        db.createObjectStore(PENDIENTES_STORE, { keyPath: "id", autoIncrement: true });
      }
    };
    peticion.onsuccess = () => resolve(peticion.result);
    peticion.onerror = () => reject(peticion.error);
  });
}

function entradasDesdeFormData(formData) {
  const entradas = [];
  for (const [nombre, valor] of formData.entries()) {
    if (valor instanceof File) {
      entradas.push({ nombre, esArchivo: true, archivo: valor });
    } else {
      entradas.push({ nombre, esArchivo: false, valor: String(valor) });
    }
  }
  return entradas;
}

function formDataDesdeEntradas(entradas) {
  const formData = new FormData();
  entradas.forEach((entrada) => {
    if (entrada.esArchivo) {
      formData.append(entrada.nombre, entrada.archivo, entrada.archivo.name);
    } else {
      formData.append(entrada.nombre, entrada.valor);
    }
  });
  return formData;
}

async function guardarInformePendiente(formData, resumen) {
  const db = await abrirPendientesDB();
  const registro = {
    creado: Date.now(),
    resumen,
    entradas: entradasDesdeFormData(formData),
    estado: "pendiente",
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDIENTES_STORE, "readwrite");
    tx.objectStore(PENDIENTES_STORE).add(registro);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function listarInformesPendientes() {
  const db = await abrirPendientesDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDIENTES_STORE, "readonly");
    const peticion = tx.objectStore(PENDIENTES_STORE).getAll();
    peticion.onsuccess = () => resolve(peticion.result || []);
    peticion.onerror = () => reject(peticion.error);
  });
}

async function actualizarInformePendiente(id, cambios) {
  const db = await abrirPendientesDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDIENTES_STORE, "readwrite");
    const almacen = tx.objectStore(PENDIENTES_STORE);
    const peticion = almacen.get(id);
    peticion.onsuccess = () => {
      const registro = peticion.result;
      if (registro) almacen.put(Object.assign(registro, cambios));
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function eliminarInformePendiente(id) {
  const db = await abrirPendientesDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDIENTES_STORE, "readwrite");
    tx.objectStore(PENDIENTES_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function actualizarPanelPendientes() {
  const panel = document.getElementById("pendientes-panel");
  if (!panel) return;

  let registros;
  try {
    registros = await listarInformesPendientes();
  } catch (err) {
    panel.style.display = "none";
    return;
  }

  if (!registros || registros.length === 0) {
    panel.style.display = "none";
    panel.innerHTML = "";
    return;
  }

  registros.sort((a, b) => a.creado - b.creado);
  const sinEnviar = registros.filter((r) => r.estado === "pendiente").length;

  const filas = registros
    .map((registro) => {
      const fecha = new Date(registro.creado).toLocaleString("es-CL");
      if (registro.estado === "enviado") {
        return `
          <div class="pendiente-item">
            <div class="pendiente-info">
              <strong>✅ ${registro.resumen}</strong>
              <span class="correo-chico">Enviado automáticamente (${fecha})</span>
            </div>
            <button type="button" class="btn-pendiente-compartir" data-id="${registro.id}">Compartir</button>
            <button type="button" class="btn-pendiente-descartar" data-id="${registro.id}">✕</button>
          </div>`;
      }
      if (registro.estado === "error") {
        return `
          <div class="pendiente-item">
            <div class="pendiente-info">
              <strong>⚠️ ${registro.resumen}</strong>
              <span class="correo-chico">No se pudo generar: ${registro.mensajeError || "error desconocido"}</span>
            </div>
            <button type="button" class="btn-pendiente-descartar" data-id="${registro.id}">✕</button>
          </div>`;
      }
      return `
        <div class="pendiente-item">
          <div class="pendiente-info">
            <strong>📥 ${registro.resumen}</strong>
            <span class="correo-chico">Esperando señal para enviar (guardado ${fecha})</span>
          </div>
          <button type="button" class="btn-pendiente-descartar" data-id="${registro.id}">✕</button>
        </div>`;
    })
    .join("");

  panel.innerHTML = `
    <h2>📥 Informes pendientes${sinEnviar > 0 ? ` (${sinEnviar} sin enviar)` : ""}</h2>
    <p class="hint">Se guardaron en este celular porque no había conexión al generarlos. Se mandan solos apenas haya señal; no hace falta volver a sacar las fotos.</p>
    ${filas}
    <button type="button" class="btn-agregar-foto" id="btn-reintentar-pendientes" style="margin-top:10px;">🔄 Reintentar ahora</button>
  `;
  panel.style.display = "block";

  panel.querySelectorAll(".btn-pendiente-descartar").forEach((boton) => {
    boton.addEventListener("click", async () => {
      await eliminarInformePendiente(Number(boton.dataset.id));
      actualizarPanelPendientes();
    });
  });

  panel.querySelectorAll(".btn-pendiente-compartir").forEach((boton) => {
    boton.addEventListener("click", async () => {
      const id = Number(boton.dataset.id);
      const registrosActuales = await listarInformesPendientes();
      const registro = registrosActuales.find((r) => r.id === id);
      if (!registro || !registro.pdfBlob) return;
      const nombre = registro.nombrePdf || "Informe_Auditoria.pdf";
      const archivoPdf = new File([registro.pdfBlob], nombre, { type: "application/pdf" });
      if (navigator.canShare && navigator.canShare({ files: [archivoPdf] })) {
        try {
          await navigator.share({ files: [archivoPdf], title: "Informe de Auditoría" });
        } catch (err) {
          // El técnico cerró el menú de compartir sin elegir nada: no hace falta avisar nada.
        }
      } else {
        descargarComoArchivo(registro.pdfBlob, nombre);
      }
    });
  });

  const btnReintentar = document.getElementById("btn-reintentar-pendientes");
  if (btnReintentar) {
    btnReintentar.addEventListener("click", () => reintentarPendientes());
  }
}

let reintentandoPendientes = false;

async function reintentarPendientes() {
  if (reintentandoPendientes) return;
  reintentandoPendientes = true;

  try {
    let registros;
    try {
      registros = await listarInformesPendientes();
    } catch (err) {
      return; // IndexedDB no disponible en este navegador: no hay nada que reintentar.
    }

    const pendientes = registros.filter((r) => r.estado === "pendiente");
    if (pendientes.length === 0) return;

    let enviadosAhora = 0;

    for (const registro of pendientes) {
      try {
        const formData = formDataDesdeEntradas(registro.entradas);
        const resultado = await enviarAlServidor(formData);
        await actualizarInformePendiente(registro.id, {
          estado: "enviado",
          pdfBlob: resultado.blob,
          nombrePdf: resultado.nombreArchivo,
          emailEnviado: resultado.emailEnviado,
          emailDestino: resultado.emailDestino,
        });
        enviadosAhora += 1;
      } catch (err) {
        if (err && err.esErrorDeRed) {
          // Todavía sin señal: se deja pendiente y se prueba de nuevo más
          // adelante (no tiene sentido seguir probando los demás ahora).
          break;
        }
        // Error de validación real (muy poco probable, porque ya se había
        // validado antes de guardarlo como pendiente): se deja a la vista
        // para que el técnico decida, sin reintentarlo en loop para siempre.
        await actualizarInformePendiente(registro.id, { estado: "error", mensajeError: err.message });
      }
    }

    if (enviadosAhora > 0) {
      mostrarEstadoEnvio(
        `✅ Se ${enviadosAhora === 1 ? "envió" : "enviaron"} automáticamente ${enviadosAhora} informe${enviadosAhora === 1 ? "" : "s"} que estaba${enviadosAhora === 1 ? "" : "n"} pendiente${enviadosAhora === 1 ? "" : "s"} por falta de señal.`,
        "success"
      );
    }

    actualizarPanelPendientes();
  } finally {
    reintentandoPendientes = false;
  }
}

function inicializarPendientes() {
  actualizarPanelPendientes();
  reintentarPendientes();

  window.addEventListener("online", () => reintentarPendientes());

  // Respaldo del evento "online", que en celulares no siempre se dispara de
  // forma confiable: mientras la app queda abierta, reintenta cada 45s.
  setInterval(() => reintentarPendientes(), 45000);
}

// --- Configuración guardada del técnico/empresa (una sola vez por celular) -
// Se guarda en localStorage del celular, no en el servidor: cada auditor ve
// solo sus propios datos guardados en su propio teléfono. Si el navegador
// bloquea localStorage (por ejemplo en una ventana privada muy estricta),
// la app sigue funcionando igual, solo que hay que volver a completar los
// datos cada vez.
const CONFIG_STORAGE_KEY = "auditoria_config_v1";

function cargarConfigGuardada() {
  try {
    const guardado = localStorage.getItem(CONFIG_STORAGE_KEY);
    return guardado ? JSON.parse(guardado) : null;
  } catch (err) {
    return null;
  }
}

function guardarConfig(config) {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    // Si no se puede guardar, igual se aplica al formulario para esta sesión.
  }
}

function aplicarConfigAlFormulario(config) {
  const mapaCampos = {
    empresa: "empresa",
    tecnico: "tecnico",
    rut_tecnico: "rut_tecnico",
    correo_adicional: "correo_adicional",
  };
  Object.keys(mapaCampos).forEach((clave) => {
    const input = document.getElementById(mapaCampos[clave]);
    if (input) input.value = (config && config[clave]) || "";
  });
}

function abrirConfigModal() {
  const modal = document.getElementById("config-modal");
  if (!modal) return;

  const config = cargarConfigGuardada() || {};
  const campoEmpresa = document.getElementById("config_empresa");
  const campoTecnico = document.getElementById("config_tecnico");
  const campoRut = document.getElementById("config_rut_tecnico");
  const campoCorreo = document.getElementById("config_correo_adicional");

  if (campoEmpresa) campoEmpresa.value = config.empresa || "";
  if (campoTecnico) campoTecnico.value = config.tecnico || "";
  if (campoRut) campoRut.value = config.rut_tecnico || "";
  if (campoCorreo) campoCorreo.value = config.correo_adicional || "";

  modal.style.display = "flex";
}

function cerrarConfigModal() {
  const modal = document.getElementById("config-modal");
  if (modal) modal.style.display = "none";
}

function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

// Valida el campo "correo adicional", que puede tener uno o varios
// correos escritos juntos separados por coma (o punto y coma). Devuelve
// la lista de correos que no son válidos (vacía si todos están bien).
function correosAdicionalesInvalidos(texto) {
  return (texto || "")
    .split(/[,;]/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0 && !correoValido(c));
}

function inicializarConfig() {
  const btnAbrir = document.getElementById("btn-abrir-config");
  const btnGuardar = document.getElementById("btn-guardar-config");
  const campoRut = document.getElementById("config_rut_tecnico");
  const errorRut = document.getElementById("config-rut-error");

  if (btnAbrir) {
    btnAbrir.addEventListener("click", abrirConfigModal);
  }

  if (btnGuardar) {
    btnGuardar.addEventListener("click", () => {
      const empresa = document.getElementById("config_empresa").value.trim();
      const tecnico = document.getElementById("config_tecnico").value.trim();
      const rutTecnico = document.getElementById("config_rut_tecnico").value.trim();
      const correoAdicional = document.getElementById("config_correo_adicional").value.trim();

      if (!empresa || !tecnico || !rutTecnico) {
        alert("Completá al menos el nombre de la empresa, tu nombre y tu RUT para poder continuar.");
        return;
      }

      if (!rutValido(rutTecnico)) {
        if (campoRut) campoRut.classList.add("input-error");
        if (errorRut) errorRut.style.display = "block";
        alert("Revisá el RUT del técnico: el dígito verificador no es válido.");
        return;
      }
      if (campoRut) campoRut.classList.remove("input-error");
      if (errorRut) errorRut.style.display = "none";

      const invalidos = correosAdicionalesInvalidos(correoAdicional);
      if (invalidos.length > 0) {
        alert(
          "Revisá el correo adicional, no parece una dirección válida: " + invalidos.join(", ")
        );
        return;
      }

      const config = { empresa, tecnico, rut_tecnico: rutTecnico, correo_adicional: correoAdicional };
      guardarConfig(config);
      aplicarConfigAlFormulario(config);
      cerrarConfigModal();
    });
  }

  // Si ya hay datos guardados de una vez anterior, se aplican solos. Si no
  // hay nada guardado todavía (primera vez que se abre la app en este
  // celular), se abre la configuración automáticamente.
  const configGuardada = cargarConfigGuardada();
  if (configGuardada) {
    aplicarConfigAlFormulario(configGuardada);
  } else {
    abrirConfigModal();
  }
}

// --- Ubicación GPS automática (opcional) ------------------------------------
// Apenas se abre el formulario, la app intenta obtener la ubicación del
// celular sola (sin que el técnico tenga que hacer nada) y la deja lista en
// los campos ocultos ubicacion_lat/ubicacion_lng para que viaje junto con el
// resto del informe. Es "mejor esfuerzo": si no hay señal GPS, el técnico
// todavía no le dio permiso a la app, o el navegador no lo soporta, el
// informe se genera y se envía igual, simplemente sin esos datos. Nunca
// frena ni bloquea el botón de generar el PDF.
function inicializarUbicacion() {
  const estadoEl = document.getElementById("ubicacion-estado");
  const inputLat = document.getElementById("ubicacion_lat");
  const inputLng = document.getElementById("ubicacion_lng");

  if (!navigator.geolocation) {
    if (estadoEl) estadoEl.textContent = "📍 Este navegador no permite obtener la ubicación automáticamente. El informe se puede generar igual, sin ubicación.";
    return;
  }

  if (estadoEl) estadoEl.textContent = "📍 Buscando tu ubicación para incluirla en el informe…";

  navigator.geolocation.getCurrentPosition(
    (posicion) => {
      if (inputLat) inputLat.value = posicion.coords.latitude;
      if (inputLng) inputLng.value = posicion.coords.longitude;
      if (estadoEl) estadoEl.textContent = "📍 Ubicación capturada: se va a incluir en el informe.";
    },
    (error) => {
      let motivo = "sin señal o permiso denegado";
      if (error && error.code === error.PERMISSION_DENIED) motivo = "no le diste permiso de ubicación a la app";
      else if (error && error.code === error.TIMEOUT) motivo = "tardó demasiado en responder (poca señal GPS)";
      else if (error && error.code === error.POSITION_UNAVAILABLE) motivo = "no hay señal GPS disponible acá";

      if (estadoEl) {
        estadoEl.textContent =
          `📍 No se pudo obtener la ubicación automáticamente (${motivo}). El informe se puede generar igual, sin ubicación.`;
      }
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
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
  inicializarFotos();
  inicializarConfig();
  inicializarUbicacion();
  inicializarPendientes();

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
    event.preventDefault();

    const campoTecnico = document.getElementById("tecnico");
    if (!campoTecnico || !campoTecnico.value.trim()) {
      alert('Antes de generar el informe, completá tus datos (empresa, nombre y RUT) tocando "⚙️ Mis datos" arriba.');
      abrirConfigModal();
      return;
    }

    const tipoActividad = document.getElementById("tipo_actividad");
    if (tipoActividad && !tipoActividad.value) {
      alert("Elegí el tipo de actividad antes de generar el informe.");
      tipoActividad.focus();
      return;
    }

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
      alert("Agregá al menos una foto a la auditoría antes de generar el PDF.");
      return;
    }

    if (glosasFaltantes.length > 0) {
      alert(
        "Falta la glosa (descripción) de la foto " +
          glosasFaltantes.join(", ") +
          ". Cada foto necesita indicar a qué corresponde."
      );
      return;
    }

    generarYCompartirPdf(form, boton);
  });

  if ("serviceWorker" in navigator) {
    // Registrado desde la raíz (no desde /static/) para que su alcance
    // cubra toda la app y no solo la carpeta static/.
    navigator.serviceWorker.register("/service-worker.js").catch(() => {
      // Si falla el registro, la app sigue funcionando normalmente por navegador.
    });
  }
});
