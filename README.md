# Informe de Instalación (app web en Python)

Aplicación web para técnicos: completá los datos del cliente (RUT, dirección,
comuna y región), sacá las 5 fotos fijas que pide el informe (la instalación
de la antena, más las 4 instalaciones de TV, cada una con su nivel de señal),
agregá una observación final, y al tocar **Enviar** se genera automáticamente
un PDF que se manda por correo a los destinatarios elegidos.

Es una **PWA** (app web instalable): se abre desde el navegador del celular
(Android o iPhone) y se puede "Agregar a pantalla de inicio" para que quede
como un ícono más, sin pasar por ninguna tienda de aplicaciones ni pagar nada.

---

## 1. Instalar dependencias

Necesitás Python 3.9 o superior instalado en la computadora/servidor donde
vas a correr la app.

```bash
cd informe-instalaciones
pip install -r requirements.txt
```

## 2. Configurar el envío de correo

1. Copiá `.env.example` como `.env`:
   ```bash
   cp .env.example .env
   ```
2. Completá `EMAIL_ADDRESS` con tu correo (Gmail u Outlook).
3. Completá `EMAIL_PASSWORD` con una **contraseña de aplicación** (no la
   contraseña normal de tu cuenta). Ver el paso a paso más abajo.
4. Si usás Outlook/Office365 en vez de Gmail, descomentá esas líneas de
   `SMTP_SERVER`/`SMTP_PORT` y comentá las de Gmail.

### Cómo crear una contraseña de aplicación en Gmail

1. Andá a https://myaccount.google.com/security
2. Activá la "Verificación en dos pasos" si todavía no la tenés activada
   (es un requisito para poder generar contraseñas de aplicación).
3. Buscá "Contraseñas de aplicaciones" (Search en la parte superior de la
   página de tu cuenta de Google → escribí "contraseñas de aplicaciones").
4. Creá una nueva, ponele un nombre como "Informe Instalaciones", y copiá el
   código de 16 caracteres que te muestra.
5. Pegalo en `EMAIL_PASSWORD` dentro del archivo `.env` (sin espacios).

### Cómo crear una contraseña de aplicación en Outlook/Office365

1. Andá a https://account.microsoft.com/security
2. Activá la verificación en dos pasos.
3. Buscá "Opciones de seguridad avanzadas" → "Contraseñas de aplicación" →
   creá una nueva y copiala en `EMAIL_PASSWORD`.

**Importante:** el archivo `.env` tiene tus credenciales, no lo compartas ni
lo subas a repositorios públicos.

## 3. Agregar contactos frecuentes (opcional)

Editá `contacts.json` para que los destinatarios habituales aparezcan como
casilleros para tildar en la app, en vez de tener que escribirlos cada vez:

```json
{
  "destinatarios": [
    { "nombre": "Oficina Central", "correo": "oficina@tuempresa.com" },
    { "nombre": "Supervisor", "correo": "supervisor@tuempresa.com" }
  ]
}
```

También podés escribir cualquier otro correo al momento de enviar, en el
campo "Otros correos".

## 4. Probar en tu computadora

```bash
python app.py
```

Vas a ver algo como:

```
Running on http://0.0.0.0:5000
```

Abrí `http://localhost:5000` desde tu computadora para probar el formulario.

## 5. Usarla desde el celular

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
   (el archivo `app.py`, `requirements.txt`, `contacts.json`, y las carpetas
   `templates` y `static` completas) a la zona que dice "Drag files here to
   add them to your repository". Importante: arrastrá las carpetas
   `templates` y `static` enteras, no solo los archivos de adentro, para que
   se mantenga la misma estructura.
7. Abajo de todo, escribí un mensaje como "primera versión" y tocá
   **"Commit changes"**.

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
5. Bajá hasta **"Environment Variables"** y agregá una por una las mismas
   que pusiste en tu `.env`:
   - `EMAIL_ADDRESS`
   - `EMAIL_PASSWORD` (la contraseña de aplicación de 16 caracteres)
   - `SMTP_SERVER` (ej. `smtp.gmail.com`)
   - `SMTP_PORT` (ej. `587`)
   - `EMAIL_DISPLAY_NAME`
   - `FLASK_SECRET_KEY` (cualquier texto largo inventado)
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

## 6. Cómo se usa

1. Abrís la app desde el ícono en el celular.
2. Completás los datos del cliente: técnico, nombre del cliente, RUT,
   dirección, comuna y región.
3. Sacás las 5 fotos obligatorias del informe, en este orden fijo:
   1. Instalación antena fuera del domicilio
   2. Instalación TV 1 (con su nivel de señal)
   3. Instalación TV 2 (con su nivel de señal)
   4. Instalación TV 3 (con su nivel de señal)
   5. Instalación TV 4 (con su nivel de señal)

   Para cada una, tocás "Tomar / elegir foto" (abre la cámara directo). En
   las 4 fotos de TV, además escribís el nivel de señal medido (por
   ejemplo "85%" o "-65 dBm").
4. Escribís una observación final si querés.
5. Tildás los destinatarios guardados y/o escribís otros correos.
6. Tocás "Generar PDF y enviar". Si falta alguna de las 5 fotos
   obligatorias, la app te avisa cuáles antes de dejarte enviar. Si está
   todo completo, arma el PDF (con los datos del cliente, las fotos, el
   nivel de señal de cada TV y la observación) y lo manda por correo como
   adjunto a todos los destinatarios elegidos.

## 7. Publicarla en Google Play Store (opcional)

**Importante:** esta parte requiere que la app ya esté desplegada online con
una URL pública en HTTPS (paso 5, sección "Render"). No es posible generar
el paquete para Google Play sin eso, porque la herramienta necesita
"leer" la app real desde internet.

**Nota sobre Apple App Store:** Apple no acepta apps que son básicamente una
página web empaquetada (rechaza este tipo de apps por la regla "4.2 Minimum
Functionality"). Por eso esta sección solo cubre Google Play. En iPhone, la
app se sigue usando instalándola desde el navegador como PWA (ver paso 5),
que funciona igual de bien aunque no aparezca en la App Store.

### Paso 1 — Generar el paquete Android con PWABuilder

1. Entrá a [pwabuilder.com](https://www.pwabuilder.com) desde una
   computadora.
2. Pegá la URL pública de tu app (ej.
   `https://informe-instalaciones.onrender.com`) y tocá "Start".
3. PWABuilder analiza la app y muestra un puntaje. Con lo que ya armamos
   (manifest.json, ícono, service worker) debería estar en verde o cerca.
4. Tocá "Package for stores" → elegí **"Android"**.
5. Te va a pedir algunos datos (nombre del paquete, ej.
   `com.tuempresa.informeinstalaciones`) y generar una clave de firma
   (podés dejar que PWABuilder la genere automáticamente).
6. Descargá el paquete `.aab` que genera, y **guardá también el archivo de
   la clave de firma que te da** (lo vas a necesitar si algún día actualizás
   la app).
7. PWABuilder también te va a mostrar un texto para un archivo llamado
   `assetlinks.json` (con una huella digital / fingerprint). Copiá ese
   contenido.

### Paso 2 — Verificar el dominio (Digital Asset Links)

Esto es lo que hace que la app en el celular se vea "sin barra de
navegador", como una app nativa de verdad:

1. Reemplazá el contenido del archivo `static/.well-known/assetlinks.json`
   de tu proyecto (creá esa carpeta `.well-known` si no existe) con el
   texto que te dio PWABuilder en el paso anterior.
2. Subí ese cambio a GitHub (arrastrando el archivo actualizado al
   repositorio, igual que hiciste la primera vez) — Render va a redesplegar
   solo cuando detecte el cambio.
3. Verificá que quede accesible en:
   `https://tu-app.onrender.com/.well-known/assetlinks.json`

### Paso 3 — Publicar en Google Play Console

1. Entrá a [play.google.com/console](https://play.google.com/console) y
   creá una cuenta de desarrollador (pago único de 25 USD).
2. Creá una nueva app, completá el nombre, categoría, y la ficha de la
   tienda (ícono, descripción, un par de capturas de pantalla usando la
   app desde el celular).
3. Google Play pide obligatoriamente un enlace a una **política de
   privacidad**. En este proyecto ya te dejé una plantilla lista en
   `static/privacidad.html` — completá los datos entre corchetes, subila
   junto con el resto del proyecto, y usá la URL
   `https://tu-app.onrender.com/privacidad.html` en ese campo.
4. En la sección de "Producción" (o "Testing interno" para probar primero),
   subí el archivo `.aab` que generaste con PWABuilder.
5. Completá el cuestionario de clasificación de contenido y de datos
   (privacidad) que pide Google — como la app solo usa la cámara y envía
   los datos por correo a quien el usuario elige, es un caso simple.
6. Enviá a revisión. Google suele tardar entre unas horas y un par de días
   en aprobarla.

Una vez aprobada, la app va a aparecer en Google Play buscándola por su
nombre, y se instala como cualquier otra app.

## Estructura del proyecto

```
informe-instalaciones/
├── app.py                  # Backend Flask: formulario, PDF, envío de correo
├── contacts.json           # Contactos frecuentes y títulos sugeridos
├── requirements.txt        # Dependencias Python
├── .env.example             # Plantilla de configuración (copiar a .env)
├── templates/
│   └── index.html          # Formulario principal
└── static/
    ├── style.css
    ├── app.js               # Vista previa de fotos + registro PWA
    ├── manifest.json        # Configuración de instalación como PWA
    ├── service-worker.js
    ├── icon-192.png
    └── icon-512.png
```

## Notas técnicas

- El PDF se genera con `reportlab`, corrigiendo automáticamente la
  orientación de las fotos (con `Pillow`) para que no aparezcan rotadas.
- El correo se envía con `smtplib` (librería estándar de Python), por lo que
  no depende de ningún servicio externo de pago.
- No se guardan las fotos ni los PDFs en el servidor: se generan en memoria
  y se descartan después de enviar el correo (no ocupan espacio ni quedan
  datos sensibles guardados).
