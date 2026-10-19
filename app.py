"""
Informe de Auditoría - App web (PWA) en Python
--------------------------------------------------
Permite completar los datos del cliente (RUT, dirección, comuna, región),
sacar hasta 8 fotos de la auditoría (cada una con su propia glosa que indica
a qué corresponde), agregar un informe final para cerrar la auditoría, y
generar un PDF que se comparte usando el menú nativo de "Compartir" del
celular (Gmail, Outlook, WhatsApp, etc.), para que cada auditor lo mande
desde su propia cuenta de correo.

Ejecutar localmente:
    pip install -r requirements.txt
    python app.py

Luego abrir desde el celular (en la misma red Wi-Fi) la URL que se muestra
en la consola, por ejemplo: http://192.168.1.5:5000
"""

import io
import os
import re
import smtplib
from datetime import datetime
from email.message import EmailMessage

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request, send_file, send_from_directory
from PIL import Image, ImageOps
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Image as RLImage,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

load_dotenv()

APP_DIR = os.path.dirname(os.path.abspath(__file__))

# Cantidad máxima de fotos que se pueden agregar a una auditoría. El
# formulario arma los campos de cada foto como foto_1, foto_2, ... foto_N y
# su glosa (descripción de a qué corresponde) como glosa_1, glosa_2, ...
# Si cambiás este número, también hay que actualizarlo en static/app.js
# (constante MAX_FOTOS) y en el texto de ayuda de templates/index.html.
MAX_FOTOS = 8

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "cambia-esto-en-produccion")
app.config["MAX_CONTENT_LENGTH"] = 25 * 1024 * 1024  # 25 MB por envío

# --- Envío automático de correo con cada informe generado ------------------
# El servidor manda SIEMPRE una copia del PDF a EMAIL_DESTINO_FIJO, usando la
# cuenta EMAIL_ADDRESS/EMAIL_PASSWORD (contraseña de aplicación, no la
# contraseña normal). Si además el técnico cargó un "correo adicional" en su
# configuración guardada en el celular, también se le manda copia a esa
# dirección. Ver .env.example para la lista completa de variables.
EMAIL_ADDRESS = os.environ.get("EMAIL_ADDRESS", "").strip()
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD", "").strip()
SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp.gmail.com").strip()
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587") or "587")
EMAIL_DISPLAY_NAME = os.environ.get("EMAIL_DISPLAY_NAME", "Informes de Auditoría").strip()
EMAIL_DESTINO_FIJO = os.environ.get("EMAIL_DESTINO_FIJO", "auditoriastuves@tuves.com").strip()

# Opciones válidas para el desplegable "Tipo de actividad" del formulario.
# Si cambiás esta lista, actualizá también el <select> en templates/index.html.
TIPOS_ACTIVIDAD = [
    "Instalación",
    "Reparación",
    "Boca adicional",
    "Traslados",
    "Reconexión",
    "Modificación de instalación",
]

_EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def correo_valido(correo):
    return bool(_EMAIL_REGEX.match(correo or ""))


_TRADUCTOR_SIN_TILDES = str.maketrans("áéíóúÁÉÍÓÚñÑ", "aeiouAEIOUnN")


def nombre_archivo_desde_texto(texto, sufijo=""):
    """Convierte un texto (por ejemplo, el mismo asunto del correo) en un
    nombre de archivo seguro para cualquier celular/computador: sin tildes,
    sin caracteres especiales y con espacios reemplazados por guion bajo.
    `sufijo` se agrega al final (antes de ".pdf") para evitar que dos
    informes del mismo cliente/región se pisen si se descargan el mismo día.
    """
    limpio = (texto or "").translate(_TRADUCTOR_SIN_TILDES)
    limpio = re.sub(r"[^A-Za-z0-9\-_ ]", "", limpio)
    limpio = re.sub(r"\s+", "_", limpio.strip())
    if sufijo:
        limpio = f"{limpio}_{sufijo}"
    return f"{limpio}.pdf"


def parsear_correos_adicionales(texto):
    """Separa el campo "correo adicional" en una lista de direcciones.

    El técnico puede cargar uno o varios correos separados por coma (o punto
    y coma) en el mismo campo, por ejemplo:
    "juan@tuves.com, maria@tuves.com". Devuelve (correos_validos, correos_invalidos).
    """
    partes = [p.strip() for p in re.split(r"[,;]", texto or "") if p.strip()]
    validos = [p for p in partes if correo_valido(p)]
    invalidos = [p for p in partes if not correo_valido(p)]
    return validos, invalidos


def enviar_correo_informe(pdf_bytes, nombre_pdf, destinatarios, asunto, cuerpo_texto):
    """Manda el PDF adjunto por correo a `destinatarios` (lista de direcciones).

    Devuelve una tupla (ok, error): `ok` es True/False, y `error` trae el
    detalle en texto si algo falló (para poder mostrárselo al técnico sin
    que la generación del PDF se vea afectada: el informe se genera y se
    puede compartir igual aunque el envío automático falle).
    """
    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        return False, "El servidor no tiene configurado el envío de correos (faltan EMAIL_ADDRESS / EMAIL_PASSWORD)."

    mensaje = EmailMessage()
    mensaje["Subject"] = asunto
    mensaje["From"] = f"{EMAIL_DISPLAY_NAME} <{EMAIL_ADDRESS}>"
    mensaje["To"] = ", ".join(destinatarios)
    mensaje.set_content(cuerpo_texto)
    mensaje.add_attachment(pdf_bytes, maintype="application", subtype="pdf", filename=nombre_pdf)

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=20) as servidor:
            servidor.starttls()
            servidor.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            servidor.send_message(mensaje)
        return True, None
    except Exception as exc:  # noqa: BLE001 - queremos capturar cualquier falla de SMTP
        return False, str(exc)


def _limpiar_rut(rut):
    """Deja solo dígitos y la letra K/k (sin puntos, guión ni espacios)."""
    return re.sub(r"[^0-9kK]", "", rut or "").upper()


def _calcular_dv_rut(cuerpo):
    """Calcula el dígito verificador de un RUT chileno (algoritmo módulo 11)."""
    suma = 0
    multiplo = 2
    for digito in reversed(cuerpo):
        suma += int(digito) * multiplo
        multiplo = multiplo + 1 if multiplo < 7 else 2
    resto = 11 - (suma % 11)
    if resto == 11:
        return "0"
    if resto == 10:
        return "K"
    return str(resto)


def rut_valido(rut):
    """Valida formato y dígito verificador de un RUT chileno."""
    limpio = _limpiar_rut(rut)
    if len(limpio) < 2:
        return False
    cuerpo, dv = limpio[:-1], limpio[-1]
    if not cuerpo.isdigit():
        return False
    return _calcular_dv_rut(cuerpo) == dv


@app.route("/.well-known/assetlinks.json", methods=["GET"])
def assetlinks():
    """
    Necesario únicamente si vas a publicar la app en Google Play (ver sección
    7 del README). Google exige que este archivo esté en esta ruta exacta
    de la raíz del dominio (no dentro de /static/) para verificar que el
    paquete Android publicado corresponde a este sitio.
    """
    return send_from_directory(
        os.path.join(APP_DIR, "static", ".well-known"),
        "assetlinks.json",
        mimetype="application/json",
    )


@app.route("/service-worker.js", methods=["GET"])
def service_worker():
    """
    Sirve el service worker en /service-worker.js (en vez de
    /static/service-worker.js). Es importante que esté en la raíz: por
    default, un service worker solo "controla" (queda con alcance sobre)
    las páginas dentro de su misma carpeta o subcarpetas — si quedara en
    /static/, no cubriría el resto de la app que vive en "/", y
    herramientas como PWABuilder lo marcan como si no hubiera service
    worker instalado.
    """
    return send_from_directory(
        os.path.join(APP_DIR, "static"),
        "service-worker.js",
        mimetype="application/javascript",
    )


@app.route("/privacidad.html", methods=["GET"])
def privacidad():
    """
    Sirve la política de privacidad en /privacidad.html (en vez de
    /static/privacidad.html) para poder usar una URL más corta y prolija
    al completar el campo de "política de privacidad" en Google Play
    Console (ver sección 7 del README).
    """
    return send_from_directory(
        os.path.join(APP_DIR, "static"),
        "privacidad.html",
        mimetype="text/html",
    )


@app.route("/", methods=["GET"])
def index():
    return render_template(
        "index.html",
        max_fotos=MAX_FOTOS,
    )


def preparar_imagen(file_storage):
    """Corrige la orientación EXIF (fotos de celular) y devuelve bytes JPEG listos para el PDF."""
    imagen = Image.open(file_storage.stream)
    imagen = ImageOps.exif_transpose(imagen)  # corrige fotos "acostadas"
    if imagen.mode != "RGB":
        imagen = imagen.convert("RGB")

    buffer = io.BytesIO()
    imagen.save(buffer, format="JPEG", quality=85, optimize=True)
    buffer.seek(0)
    return buffer, imagen.size


def generar_pdf(
    tecnico,
    rut_tecnico,
    empresa,
    tipo_actividad,
    cliente,
    rut_cliente,
    direccion,
    comuna,
    region,
    fotos,
    observacion,
):
    """Arma el PDF del informe en memoria y devuelve los bytes.

    `fotos` es una lista de tuplas (glosa, foto_buffer, tam_original) — una
    por cada foto que el técnico agregó (hasta MAX_FOTOS), en el orden en
    que las cargó.

    El diseño busca verse "ejecutivo": encabezado con banda de color, una
    ficha de datos del cliente en formato tabla prolija, cada foto dentro de
    una tarjeta con su número arriba y su glosa (descripción de a qué
    corresponde) en una franja destacada debajo de la imagen, y el informe
    final que cierra la auditoría dentro de un recuadro con borde de color
    (estilo "callout").
    """
    ANCHO_CONTENIDO = 18 * cm  # A4 (21cm) menos 1.5cm de margen a cada lado

    COLOR_PRIMARIO = colors.HexColor("#1f6feb")
    COLOR_PRIMARIO_OSCURO = colors.HexColor("#17539c")
    COLOR_FONDO_ALTERNO = colors.HexColor("#f7f9fc")
    COLOR_BORDE = colors.HexColor("#d7dbe0")
    COLOR_TEXTO = colors.HexColor("#1a1a1a")
    COLOR_TEXTO_MUTED = colors.HexColor("#5a6472")
    COLOR_GLOSA_FONDO = colors.HexColor("#eef4ff")
    COLOR_OBS_FONDO = colors.HexColor("#f5f9ff")

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
        leftMargin=1.5 * cm,
        rightMargin=1.5 * cm,
    )

    styles = getSampleStyleSheet()
    titulo_style = ParagraphStyle(
        "TituloInforme", parent=styles["Title"], alignment=TA_CENTER,
        fontSize=17, leading=20, textColor=colors.white, spaceAfter=0,
    )
    subtitulo_header_style = ParagraphStyle(
        "SubtituloHeader", parent=styles["Normal"], alignment=TA_CENTER,
        fontSize=9.5, leading=12, textColor=colors.white,
    )
    fecha_style = ParagraphStyle(
        "Fecha", parent=styles["Normal"], alignment=TA_CENTER,
        fontSize=8.5, textColor=COLOR_TEXTO_MUTED, spaceBefore=8, spaceAfter=16,
    )
    ficha_header_style = ParagraphStyle(
        "FichaHeader", parent=styles["Normal"], fontSize=10.5,
        fontName="Helvetica-Bold", textColor=colors.white,
    )
    etiqueta_style = ParagraphStyle(
        "Etiqueta", parent=styles["Normal"], fontSize=9.5,
        fontName="Helvetica-Bold", textColor=COLOR_TEXTO_MUTED,
    )
    valor_style = ParagraphStyle(
        "Valor", parent=styles["Normal"], fontSize=10, textColor=COLOR_TEXTO,
    )
    foto_titulo_style = ParagraphStyle(
        "FotoTitulo", parent=styles["Normal"], fontSize=11.5,
        fontName="Helvetica-Bold", textColor=colors.white,
    )
    glosa_style = ParagraphStyle(
        "Glosa", parent=styles["Normal"], fontSize=10, leading=14,
        textColor=COLOR_TEXTO,
    )
    observacion_header_style = ParagraphStyle(
        "ObservacionHeader", parent=styles["Normal"], fontSize=11.5,
        fontName="Helvetica-Bold", textColor=COLOR_PRIMARIO, spaceAfter=5,
    )
    observacion_texto_style = ParagraphStyle(
        "ObservacionTexto", parent=styles["Normal"], fontSize=10,
        leading=14, textColor=COLOR_TEXTO,
    )

    elementos = []

    # --- Encabezado con banda de color ---------------------------------
    encabezado = Table(
        [
            [Paragraph("INFORME DE AUDITORÍA", titulo_style)],
            [Paragraph("Auditoría fotográfica de instalación", subtitulo_header_style)],
        ],
        colWidths=[ANCHO_CONTENIDO],
    )
    encabezado.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), COLOR_PRIMARIO),
                ("TOPPADDING", (0, 0), (-1, 0), 12),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 2),
                ("TOPPADDING", (0, 1), (-1, 1), 0),
                ("BOTTOMPADDING", (0, 1), (-1, 1), 12),
            ]
        )
    )
    elementos.append(encabezado)

    fecha_str = datetime.now().strftime("%d/%m/%Y %H:%M")
    elementos.append(Paragraph(f"Generado el {fecha_str}", fecha_style))

    # --- Ficha de datos del cliente, en formato tabla prolijo -----------
    filas_cliente = []

    def _agregar_fila(etiqueta, valor):
        if valor:
            filas_cliente.append([Paragraph(etiqueta, etiqueta_style), Paragraph(valor, valor_style)])

    _agregar_fila("Empresa", empresa)
    _agregar_fila("Técnico", tecnico)
    _agregar_fila("RUT técnico", rut_tecnico)
    _agregar_fila("Tipo de actividad", tipo_actividad)
    _agregar_fila("Cliente", cliente)
    _agregar_fila("RUT cliente", rut_cliente)
    _agregar_fila("Dirección", direccion)
    _agregar_fila("Comuna", comuna)
    _agregar_fila("Región", region)

    if filas_cliente:
        filas = [[Paragraph("DATOS DEL CLIENTE", ficha_header_style), ""]] + filas_cliente
        ficha = Table(filas, colWidths=[4.5 * cm, ANCHO_CONTENIDO - 4.5 * cm])
        estilo_ficha = [
            ("SPAN", (0, 0), (-1, 0)),
            ("BACKGROUND", (0, 0), (-1, 0), COLOR_PRIMARIO_OSCURO),
            ("TOPPADDING", (0, 0), (-1, 0), 7),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 7),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ("TOPPADDING", (0, 1), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 1), (-1, -1), 6),
            ("LINEBELOW", (0, 1), (-1, -2), 0.5, COLOR_BORDE),
            ("BOX", (0, 0), (-1, -1), 0.75, COLOR_BORDE),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ]
        for idx in range(1, len(filas)):
            if idx % 2 == 0:
                estilo_ficha.append(("BACKGROUND", (0, idx), (-1, idx), COLOR_FONDO_ALTERNO))
        ficha.setStyle(TableStyle(estilo_ficha))
        elementos.append(ficha)
        elementos.append(Spacer(1, 20))

    # --- Fotos: cada una en su propia tarjeta ---------------------------
    # Se limita el alto para que, en general, entren 2 tarjetas por página
    # (más compacto y prolijo que una foto gigante por hoja).
    max_ancho = 16.4 * cm
    max_alto = 8.6 * cm

    for i, (glosa, foto_buffer, tam_original) in enumerate(fotos, start=1):
        ancho_original, alto_original = tam_original
        ratio = min(max_ancho / ancho_original, max_alto / alto_original, 1.0)
        ancho_final = ancho_original * ratio
        alto_final = alto_original * ratio

        imagen = RLImage(foto_buffer, width=ancho_final, height=alto_final)
        imagen.hAlign = "CENTER"

        filas_foto = [[Paragraph(f"Foto {i}", foto_titulo_style)], [imagen]]
        estilo_foto = [
            ("BACKGROUND", (0, 0), (-1, 0), COLOR_PRIMARIO),
            ("TOPPADDING", (0, 0), (-1, 0), 6),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 6),
            ("LEFTPADDING", (0, 0), (-1, 0), 10),
            ("TOPPADDING", (0, 1), (-1, 1), 8),
            ("BOTTOMPADDING", (0, 1), (-1, 1), 3),
            ("BOX", (0, 0), (-1, -1), 0.75, COLOR_BORDE),
        ]

        filas_foto.append([Paragraph(f"<b>Descripción:</b> {glosa}", glosa_style)])
        estilo_foto.append(("BACKGROUND", (0, 2), (-1, 2), COLOR_GLOSA_FONDO))
        estilo_foto.append(("TOPPADDING", (0, 2), (-1, 2), 8))
        estilo_foto.append(("BOTTOMPADDING", (0, 2), (-1, 2), 8))
        estilo_foto.append(("LEFTPADDING", (0, 2), (-1, 2), 10))
        estilo_foto.append(("RIGHTPADDING", (0, 2), (-1, 2), 10))
        estilo_foto.append(("LINEABOVE", (0, 2), (-1, 2), 0.5, COLOR_BORDE))

        tarjeta_foto = Table(filas_foto, colWidths=[ANCHO_CONTENIDO])
        tarjeta_foto.setStyle(TableStyle(estilo_foto))

        elementos.append(KeepTogether([tarjeta_foto, Spacer(1, 14)]))

    # --- Informe final dentro de un recuadro destacado --------------------
    if observacion:
        contenido_obs = [Paragraph("INFORME FINAL DE LA AUDITORÍA", observacion_header_style)]
        for linea in observacion.splitlines() or [""]:
            contenido_obs.append(Paragraph(linea if linea.strip() else "&nbsp;", observacion_texto_style))

        caja_obs = Table([[contenido_obs]], colWidths=[ANCHO_CONTENIDO])
        caja_obs.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), COLOR_OBS_FONDO),
                    ("LINEBEFORE", (0, 0), (0, -1), 3, COLOR_PRIMARIO),
                    ("BOX", (0, 0), (-1, -1), 0.75, COLOR_BORDE),
                    ("TOPPADDING", (0, 0), (-1, -1), 12),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
                    ("LEFTPADDING", (0, 0), (-1, -1), 14),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 14),
                ]
            )
        )
        elementos.append(caja_obs)

    doc.build(elementos)
    buffer.seek(0)
    return buffer.getvalue()


@app.route("/generar-pdf", methods=["POST"])
def generar_pdf_endpoint():
    """Genera el PDF de la auditoría y lo devuelve como archivo descargable.

    No envía ningún correo desde el servidor: el navegador recibe el PDF y
    usa la función nativa de "Compartir" del celular para que el propio
    auditor lo mande desde su app de correo (Gmail, Outlook, la que tenga
    instalada), con su propia cuenta. Si algo falla en la validación,
    devuelve un JSON con "error" y código 400 en vez de generar el PDF.
    """
    tecnico = request.form.get("tecnico", "").strip()
    rut_tecnico = request.form.get("rut_tecnico", "").strip()
    empresa = request.form.get("empresa", "").strip()
    tipo_actividad = request.form.get("tipo_actividad", "").strip()
    correo_adicional = request.form.get("correo_adicional", "").strip()
    cliente = request.form.get("cliente", "").strip()
    rut_cliente = request.form.get("rut_cliente", "").strip()
    direccion = request.form.get("direccion", "").strip()
    comuna = request.form.get("comuna", "").strip()
    region = request.form.get("region", "").strip()
    observacion = request.form.get("observacion", "").strip()

    if not rut_cliente:
        return jsonify({"error": "Tenés que completar el RUT del cliente."}), 400

    if not rut_valido(rut_cliente):
        return jsonify(
            {
                "error": "El RUT del cliente no es válido. Revisá que esté bien escrito, "
                "incluyendo el dígito verificador (ej: 12.345.678-5)."
            }
        ), 400

    if not tipo_actividad:
        return jsonify({"error": "Tenés que elegir el tipo de actividad."}), 400

    if tipo_actividad not in TIPOS_ACTIVIDAD:
        return jsonify({"error": "El tipo de actividad elegido no es válido."}), 400

    if rut_tecnico and not rut_valido(rut_tecnico):
        return jsonify(
            {
                "error": "El RUT del técnico guardado en tu configuración no es válido. "
                'Tocá "⚙️ Mis datos" arriba y revisalo.'
            }
        ), 400

    correos_adicionales, correos_adicionales_invalidos = parsear_correos_adicionales(correo_adicional)
    if correos_adicionales_invalidos:
        return jsonify(
            {
                "error": "El correo adicional guardado en tu configuración no es válido ("
                + ", ".join(correos_adicionales_invalidos)
                + "). Tocá \"⚙️ Mis datos\" arriba y revisalo."
            }
        ), 400

    fotos = []
    sin_glosa = []
    for i in range(1, MAX_FOTOS + 1):
        archivo = request.files.get(f"foto_{i}")
        glosa = request.form.get(f"glosa_{i}", "").strip()

        if not archivo or not archivo.filename:
            continue

        if not glosa:
            sin_glosa.append(i)
            continue

        buffer, tam = preparar_imagen(archivo)
        fotos.append((glosa, buffer, tam))

    if sin_glosa:
        return jsonify(
            {
                "error": "Falta indicar la glosa (a qué corresponde) de la foto "
                + ", ".join(str(n) for n in sin_glosa)
                + "."
            }
        ), 400

    if not fotos:
        return jsonify({"error": "Agregá al menos una foto a la auditoría antes de generar el PDF."}), 400

    pdf_bytes = generar_pdf(
        tecnico,
        rut_tecnico,
        empresa,
        tipo_actividad,
        cliente,
        rut_cliente,
        direccion,
        comuna,
        region,
        fotos,
        observacion,
    )

    # El asunto del correo y el nombre del PDF descargado usan el mismo
    # formato (RUT del cliente + región), para que sea fácil relacionar un
    # archivo con el correo correspondiente. Se le agrega fecha y hora al
    # nombre del archivo para que dos informes del mismo cliente/región no
    # se pisen entre sí si se descargan el mismo día.
    asunto = f"Informe de Auditoría - RUT {rut_cliente} - {region or 'Sin región'}"
    fecha_archivo = datetime.now().strftime("%Y%m%d_%H%M")
    nombre_pdf = nombre_archivo_desde_texto(asunto, sufijo=fecha_archivo)

    # --- Envío automático por correo -----------------------------------
    # Siempre se manda una copia a EMAIL_DESTINO_FIJO. Si el técnico cargó uno
    # o varios correos adicionales en su configuración (separados por coma),
    # también se les manda copia a ellos. Si el envío falla (por ejemplo,
    # falta configurar EMAIL_ADDRESS/EMAIL_PASSWORD en el servidor), el PDF
    # se genera y se puede compartir igual: el error se informa en una
    # cabecera que lee el navegador, sin frenar al técnico.
    destinatarios = [EMAIL_DESTINO_FIJO]
    for correo in correos_adicionales:
        if correo.lower() not in (d.lower() for d in destinatarios):
            destinatarios.append(correo)

    cuerpo_texto = (
        "Se adjunta el informe de auditoría generado desde la app.\n\n"
        f"Empresa: {empresa or '-'}\n"
        f"Técnico: {tecnico or '-'} (RUT {rut_tecnico or '-'})\n"
        f"Tipo de actividad: {tipo_actividad}\n\n"
        f"Cliente: {cliente or '-'}\n"
        f"RUT cliente: {rut_cliente}\n"
        f"Dirección: {direccion or '-'}, {comuna or '-'}, {region or '-'}\n"
    )

    email_ok, email_error = enviar_correo_informe(pdf_bytes, nombre_pdf, destinatarios, asunto, cuerpo_texto)

    respuesta = send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name=nombre_pdf,
    )
    respuesta.headers["X-Email-Enviado"] = "1" if email_ok else "0"
    respuesta.headers["X-Email-Destino"] = ", ".join(destinatarios)
    if email_error:
        respuesta.headers["X-Email-Error"] = email_error.replace("\n", " ").replace("\r", " ")[:300]
    return respuesta


if __name__ == "__main__":
    # host="0.0.0.0" para poder abrirlo desde el celular en la misma red Wi-Fi
    app.run(host="0.0.0.0", port=5000, debug=True)
