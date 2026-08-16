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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-informe");
  const boton = document.getElementById("btn-enviar");

  const btnCancelar = document.getElementById("camera-cancel");
  const btnCapturar = document.getElementById("camera-capture");
  if (btnCancelar) btnCancelar.addEventListener("click", cerrarCamara);
  if (btnCapturar) btnCapturar.addEventListener("click", capturarFoto);

  form.addEventListener("submit", (event) => {
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
