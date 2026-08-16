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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-informe");
  const boton = document.getElementById("btn-enviar");

  form.addEventListener("submit", (event) => {
    // Los inputs de tipo archivo están ocultos visualmente (se muestran con
    // un botón propio), así que la validación "required" nativa del
    // navegador no funciona bien sobre ellos. Se valida acá manualmente.
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
