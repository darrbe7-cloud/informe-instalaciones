# Informe de Auditoría (app web en Python)

Aplicación web para auditores/técnicos: completá los datos del cliente (RUT,
dirección, comuna y región), sacá hasta 8 fotos de la auditoría —cada una
con su propia glosa (descripción de a qué corresponde)—, agregá un informe
final para cerrar la auditoría, y generá un PDF ejecutivo con todo eso. El
PDF no lo manda el servidor: se entrega al celular, que abre el menú nativo
de "Compartir" para que el propio auditor lo mande por correo (o por la app
que prefiera) usando su propia cuenta.

Es una **PWA** (app web instalable): se abre desde el navegador del celular
(Android o iPhone) y se puede "Agregar a pantalla de inicio" para que quede
como un ícono más, sin pasar por ninguna tienda de aplicaciones ni pagar
nada. Además, se puede empaquetar para publicarla en **Google Play**
(ver sección 7).

---

## 1. Instalar dependencias

Necesitás Python 3.9 o superior instalado en la computadora/servidor donde
vas a correr la app.

```bash
cd informe-instalaciones
pip install -r requirements.txt
```

## 2. Configuración (opcional)

La app funciona sin configuración adicional. Si querés, podés definir una
clave secreta propia de Flask:

1. Copiá `.env.example` como `.env`:
   ```bash
   cp .env.example .env
   ```
2. Completá `FLASK_SECRET_KEY` con cualquier texto largo inventado.

**Nota:** versiones anteriores de esta app enviaban el correo directamente
desde el servidor (con una cuenta de Gmail/Outlook configurada en variables
de entorno). Eso ya no es así: ahora el PDF se comparte desde el propio
celular del auditor, así que no hace falta configurar ninguna cuenta de
correo en el servidor.

## 3. Probar en tu computadora

```bash
python app.py
```

Vas a ver algo como:

```
Running on http://0.0.0.0:5000
```

Abrí `http://localhost:5000` desde tu computadora para probar el formulario
(la cámara y el botón de compartir solo funcionan bien desde un celular).

## 4. Usarla desde el celular

### Opción rápida (misma red Wi-Fi, para probar)

1. Con `python app.py` corriendo, fijate la IP de tu computadora en la red
   (en Windows: `ipconfig`, en Mac/Linux: `ifconfig` o `ip addr`).
2. Desde el celular, conectado al mismo Wi-Fi, abrí en el navegador algo como
   `http://192.168.1.5:5000` (reemplazando por tu IP real).
3. Tocá el menú del navegador → "Agregar a pantalla de inicio" para que quede
   como un ícono instalado.

Esto sirve para probar, pero **solo funciona mientras la computadora esté
prendida y con la app corriendo**, y ambos dispositivos en la misma red.

### Opción recomendada para uso real: desplegarla online con Render (gratis)

Así queda disponible siempre, sin depender de tu computadora ni de estar en
la misma red que el celular. No hace falta saber usar git ni la terminal:
todo se hace desde el navegador.

**Paso 1 — Subir el código a GitHub**

1. Entrá a [github.com](https://github.com) y creá una cuenta gratis (si ya
   tenés una, usá esa).
2. Arriba a la derecha, tocá el botón **"+"** → **"New repository"**.
3. Ponele un nombre, por ejemplo `informe-instalaciones`, dejalo en
   "Private" o "Public" (cualquiera sirve), y tocá **"Create repository"**
   (sin tildar ninguna otra opción).
4. En la página del repositorio recién creado, tocá el enlace
   **"uploading an existing file"**.
5. En tu computadora, descomprimí (extraé) el archivo `.zip` que te mandé.
6. Arrastrá **todo el contenido** de la carpeta `informe-instalaciones`
   (el archivo `app.py`, `requirements.txt`, y las carpetas `templates` y
   `static` completas) a la zona que dice "Drag files here to add them to
   your repository". Importante: arrastrá las carpetas `templates` y
   `static` enteras, no solo los archivos de adentro, para que se mantenga
   la misma estructura.
7. Abajo de todo, escribí un mensaje como "primera versión" y tocá
   **"Commit changes"**.

Para cambios posteriores (como los que venimos haciendo), simplemente
abrís el archivo dentro de GitHub, tocás el lápiz (editar), pegás el
contenido nuevo completo, y hacés "Commit changes" de nuevo.

**Paso 2 — Crear el servicio en Render**

1. Entrá a [render.com](https://render.com) y creá una cuenta gratis
   (lo más simple es tocar "Sign up with GitHub" para que quede conectado
   directo).
2. Tocá **"New +"** → **"Web Service"**.
3. Elegí el repositorio `informe-instalaciones` que acabás de crear.
4. Completá:
   - **Name**: `informe-instalaciones` (o el nombre que quieras)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: `Free`
5. (Opcional) En **"Environment Variables"** podés agregar
   `FLASK_SECRET_KEY` con cualquier texto largo inventado.
6. Tocá **"Create Web Service"** y esperá unos minutos mientras se instala
   y arranca. Cuando termine, Render te muestra una URL fija, algo como
   `https://informe-instalaciones.onrender.com`.

Nota: en el plan gratuito, si nadie usa la app por un rato "se duerme", y la
primera vez que la abrís después de eso puede tardar cerca de un minuto en
responder. Después de esa primera carga anda normal.

**Paso 3 — Instalarla en el celular**

1. Abrí esa URL (`https://informe-instalaciones.onrender.com`) desde el
   navegador del celular (Chrome en Android, Safari en iPhone).
2. Tocá el menú del navegador:
   - **Android/Chrome**: los tres puntitos (⋮) → "Agregar a pantalla de
     inicio" / "Instalar aplicación".
   - **iPhone/Safari**: el ícono de compartir (□ con flecha) → "Agregar a
     pantalla de inicio".
3. Confirmá el nombre y tocá "Agregar". Va a quedar un ícono en tu celular
   como cualquier otra app, y al abrirlo ya no muestra la barra del
   navegador.

## 5. Cómo se usa

1. El auditor abre la app desde el ícono en el celular.
2. Completa los datos del cliente: auditor, nombre del cliente, RUT,
   dirección, comuna y región.
3. Toca "+ Agregar foto" para cada foto que necesite (hasta 8). Cada foto se
   saca en el momento con la cámara (no se puede elegir de la galería), y
   hay que escribir una glosa breve que indique a qué corresponde (por
   ejemplo "Antena en el techo", "TV living", "Cableado exterior"). Se
   pueden agregar o quitar fotos libremente antes de enviar.
4. Escribe el informe final que cierra la auditoría (resumen, estado
   general, recomendaciones, pendientes, etc.).
5. Toca **"Generar PDF y compartir"**. El celular arma el PDF (con los
   datos del cliente, cada foto con su glosa, y el informe final) y abre el
   menú nativo de "Compartir" para elegir con qué app enviarlo — Gmail,
   Outlook, WhatsApp, la que tenga instalada — usando su propia cuenta. Si
   el navegador no soporta compartir así, el PDF se descarga directo al
   celular para adjuntarlo a mano.

## 6. Sobre iPhone y las tiendas de aplicaciones

**Android (Google Play):** se puede publicar sin problema empaquetando la
PWA — ver sección 7 más abajo.

**iPhone (Apple App Store):** Apple rechaza casi sistemáticamente las apps
que son, en el fondo, solo una página web empaquetada sin funciones
nativas reales (regla 4.2 "Minimum Functionality" de sus lineamientos de
revisión). Como esta app no tiene funciones nativas más allá de lo que ya
hace en el navegador, intentar subirla a la App Store tiene un riesgo alto
de rechazo, además de requerir una cuenta de Apple Developer paga (99
USD/año).

Por eso, para iPhone la recomendación es **no pasar por la App Store**: el
usuario simplemente abre la URL en Safari y usa "Agregar a pantalla de
inicio" (paso 3 más arriba). Queda instalada igual que cualquier app, con
ícono propio, funciona con la cámara y todo lo demás, sin pagar nada, sin
depender de que Apple la apruebe, y se actualiza sola cada vez que subís
cambios nuevos (a diferencia de una app de tienda, que tarda en aprobarse
cada actualización).

## 7. Publicarla en Google Play Store

**Importante:** esta parte requiere que la app ya esté desplegada online con
una URL pública en HTTPS (sección 4, "Render"). No es posible generar
el paquete para Google Play sin eso, porque la herramienta necesita
"leer" la app real desde internet.

### Paso 1 — Generar el paquete Android con PWABuilder

1. Entrá a [pwabuilder.com](https://www.pwabuilder.com) desde una
   computadora.
2. Pegá la URL pública de tu app (ej.
   `https://informe-instalaciones.onrender.com`) y tocá "Start".
3. PWABuilder analiza la app y muestra un puntaje. Con lo que ya armamos
   (manifest.json, ícono, service worker) debería estar en verde o cerca.
4. Tocá "Package for stores" → elegí **"Android"**.
5. Te va a pedir algunos datos (nombre del paquete, ej.
   `com.tuempresa.informeauditoria`) y generar una clave de firma (podés
   dejar que PWABuilder la genere automáticamente).
6. Descargá el paquete `.aab` que genera, y **guardá también el archivo de
   la clave de firma que te da** en un lugar seguro (lo vas a necesitar si
   algún día actualizás la app — si la perdés, no vas a poder subir
   actualizaciones nunca más).
7. PWABuilder también te va a mostrar un texto para un archivo llamado
   `assetlinks.json` (con una huella digital / fingerprint). Copiá ese
   contenido completo.

### Paso 2 — Verificar el dominio (Digital Asset Links)

Esto es lo que hace que la app en el celular se vea "sin barra de
navegador", como una app nativa de verdad:

1. En GitHub, andá al repositorio y tocá **"Add file" → "Create new file"**
   (no uses "arrastrar archivos" para este paso, porque GitHub a veces no
   crea bien carpetas que empiezan con un punto si se arrastran).
2. En el campo del nombre del archivo, escribí la ruta completa:
   `static/.well-known/assetlinks.json` — GitHub crea las carpetas
   automáticamente al escribir la ruta con `/`.
3. Pegá el contenido que te dio PWABuilder en el paso anterior, en el
   cuadro de texto de abajo.
4. Bajá y tocá **"Commit changes"**.
5. Esperá a que Render termine de redesplegar (podés revisarlo en la
   pestaña "Deploys" de tu servicio en Render).
6. Verificá que quede accesible entrando desde el navegador a:
   `https://tu-app.onrender.com/.well-known/assetlinks.json` — tiene que
   mostrar el mismo contenido que pegaste, no un error 404.

### Paso 3 — Publicar en Google Play Console

1. Entrá a [play.google.com/console](https://play.google.com/console) y
   creá una cuenta de desarrollador (pago único de 25 USD).
2. Creá una nueva app, completá el nombre, categoría, y la ficha de la
   tienda (ícono, descripción, un par de capturas de pantalla usando la
   app desde el celular).
3. Google Play pide obligatoriamente un enlace a una **política de
   privacidad**. Ya tenés una lista en `static/privacidad.html` — usá la
   URL `https://tu-app.onrender.com/privacidad.html` en ese campo.
4. En la sección de "Producción" (o "Testing interno" para probar primero),
   subí el archivo `.aab` que generaste con PWABuilder.
5. Completá el cuestionario de clasificación de contenido y de datos
   (privacidad) que pide Google. Como referencia: la app usa la cámara,
   no guarda datos en ningún servidor (el PDF se genera en memoria y se
   descarta al instante) y no comparte datos con terceros — la comparte
   el propio usuario, desde su celular, con la app que elija.
6. Enviá a revisión. Google suele tardar entre unas horas y un par de días
   en aprobarla.

Una vez aprobada, la app va a aparecer en Google Play buscándola por su
nombre, y se instala como cualquier otra app.

## Estructura del proyecto

```
informe-instalaciones/
├── app.py                  # Backend Flask: formulario y generación del PDF
├── requirements.txt        # Dependencias Python
├── .env.example             # Plantilla de configuración (copiar a .env)
├── templates/
│   └── index.html          # Formulario principal
└── static/
    ├── style.css
    ├── app.js               # Fotos dinámicas, cámara, compartir PDF, RUT
    ├── manifest.json        # Configuración de instalación como PWA
    ├── service-worker.js
    ├── privacidad.html      # Política de privacidad (para Google Play)
    ├── icon-192.png
    ├── icon-512.png
    └── .well-known/
        └── assetlinks.json  # Solo necesario para publicar en Google Play
```

`contacts.json` quedó del diseño anterior y ya no lo usa la app (se puede
borrar del repositorio sin que afecte nada).

## Notas técnicas

- El PDF se genera con `reportlab`, corrigiendo automáticamente la
  orientación de las fotos (con `Pillow`) para que no aparezcan rotadas.
- El PDF no se envía por correo desde el servidor: el navegador lo recibe
  y usa la Web Share API del celular (la misma función de "Compartir" que
  usa WhatsApp) para que el auditor lo mande con su propia app y cuenta de
  correo. Si el celular no soporta esa función, el PDF se descarga directo.
- No se guardan las fotos ni los PDFs en el servidor: se generan en memoria
  y se descartan apenas se genera la respuesta (no ocupan espacio ni quedan
  datos sensibles guardados).
