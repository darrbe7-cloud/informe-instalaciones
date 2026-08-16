// Service worker mínimo: solo habilita que el navegador ofrezca
// "Agregar a pantalla de inicio" (PWA instalable). No cachea nada
// porque esta app necesita conexión para enviar los informes.
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("fetch", () => {
  // Sin cache: siempre va a la red.
});
