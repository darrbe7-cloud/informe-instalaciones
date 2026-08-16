"""
Informe de Instalación - App web (PWA) en Python
--------------------------------------------------
Permite completar los datos del cliente (RUT, dirección, comuna, región),
sacar las 5 fotos fijas del informe (antena + 4 TV, cada TV con su nivel de
señal), agregar una observación final, y generar un PDF que se envía por
correo a los destinatarios seleccionados.

Ejecutar localmente:
    pip install -r requirements.txt
    python app.py

Luego abrir desde el celular (en la misma red Wi-Fi) la URL que se muestra
en la consola, por ejemplo: http://192.168.1.5:5000
"""

import io
import json
import os
import smtplib
from datetime import datetime
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr

from dotenv import load_dotenv
from flask import Flask, flash, redirect, render_template, request, send_from_directory, url_for
from PIL import Image, ImageOps
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Image as RLImage,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

load_dotenv()

APP_DIR = os.path.dirname(os.path.abspath(__file__))
CONTACTS_PATH = os.path.join(APP_DIR, "contacts.json")

# Estructura fija del informe: la antena (sin nivel de señal) + siempre 4 TV
# (cada una con su nivel de señal). "key" se usa para armar los nombres de
# los campos del formulario (foto_<key>, señal_<key>).
FOTO_SLOTS = [
    {"key": "antena", "titulo": "Instalación antena fuera del domicilio", "requiere_senal": False, "obligatoria": True},
    {"key": "tv1", "titulo": "Instalación TV 1", "requiere_senal": True, "obligatoria": True},
    {"key": "tv2", "titulo": "Instalación TV 2", "requiere_senal": False, "obligatoria": False},
    {"key": "tv3", "titulo": "Instalación TV 3", "requiere_senal": False, "obligatoria": False},
    {"key": "tv4", "titulo": "Instalación TV 4", "requiere_senal": False, "obligatoria": False},
]

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "cambia-esto-en-produccion")
app.config["MAX_CONTENT_LENGTH"] = 25 * 1024 * 1024  # 25 MB por envío


def cargar_contactos():
    with open(CONTACTS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


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


@app.route("/", methods=["GET"])
def index():
    datos = cargar_contactos()
    return render_template(
        "index.html",
        destinatarios=datos.get("destinatarios", []),
        foto_slots=FOTO_SLOTS,
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


def generar_pdf(tecnico, cliente, rut_cliente, direccion, comuna, region, fotos, observacion):
    """Arma el PDF del informe en memoria y devuelve los bytes.

    `fotos` es una lista de tuplas (titulo, foto_buffer, tam_original, nivel_senal_o_None).
    """
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
        "TituloInforme",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=18,
        spaceAfter=6,
    )
    subtitulo_style = ParagraphStyle(
        "Subtitulo",
        parent=styles["Normal"],
        alignment=TA_CENTER,
        fontSize=10,
        textColor=colors.grey,
        spaceAfter=16,
    )
    foto_titulo_style = ParagraphStyle(
        "FotoTitulo",
        parent=styles["Heading2"],
        fontSize=13,
        spaceBefore=10,
        spaceAfter=8,
    )
    observacion_titulo_style = ParagraphStyle(
        "ObservacionTitulo",
        parent=styles["Heading2"],
        fontSize=13,
        spaceBefore=16,
        spaceAfter=8,
    )

    elementos = []

    elementos.append(Paragraph("Informe de Instalación", titulo_style))
    fecha_str = datetime.now().strftime("%d/%m/%Y %H:%M")
    elementos.append(Paragraph(f"Generado el {fecha_str}", subtitulo_style))

    datos_generales = []
    if tecnico:
        datos_generales.append(["Técnico:", tecnico])
    if cliente:
        datos_generales.append(["Cliente:", cliente])
    if rut_cliente:
        datos_generales.append(["RUT cliente:", rut_cliente])
    if direccion:
        datos_generales.append(["Dirección:", direccion])
    if comuna:
        datos_generales.append(["Comuna:", comuna])
    if region:
        datos_generales.append(["Región:", region])

    if datos_generales:
        tabla = Table(datos_generales, colWidths=[4 * cm, 12 * cm])
        tabla.setStyle(
            TableStyle(
                [
                    ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )
        elementos.append(tabla)
        elementos.append(Spacer(1, 12))

    max_ancho = 16 * cm
    max_alto = 12 * cm

    for i, (titulo_foto, foto_buffer, tam_original, nivel_senal) in enumerate(fotos, start=1):
        ancho_original, alto_original = tam_original
        ratio = min(max_ancho / ancho_original, max_alto / alto_original, 1.0)
        ancho_final = ancho_original * ratio
        alto_final = alto_original * ratio

        elementos.append(Paragraph(f"{i}. {titulo_foto}", foto_titulo_style))
        elementos.append(RLImage(foto_buffer, width=ancho_final, height=alto_final))
        if nivel_senal:
            elementos.append(Spacer(1, 4))
            elementos.append(Paragraph(f"<b>Nivel de señal:</b> {nivel_senal}", styles["Normal"]))
        elementos.append(Spacer(1, 14))

    if observacion:
        elementos.append(Paragraph("Observaciones", observacion_titulo_style))
        for linea in observacion.splitlines() or [""]:
            elementos.append(Paragraph(linea if linea.strip() else "&nbsp;", styles["Normal"]))

    doc.build(elementos)
    buffer.seek(0)
    return buffer.getvalue()


def enviar_correo(destinatarios, asunto, cuerpo, pdf_bytes, nombre_pdf):
    remitente = os.environ["EMAIL_ADDRESS"]
    clave = os.environ["EMAIL_PASSWORD"]
    servidor = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
    puerto = int(os.environ.get("SMTP_PORT", 587))
    nombre_mostrado = os.environ.get("EMAIL_DISPLAY_NAME", "Informes de Instalación")

    mensaje = MIMEMultipart()
    mensaje["From"] = formataddr((nombre_mostrado, remitente))
    mensaje["To"] = ", ".join(destinatarios)
    mensaje["Subject"] = asunto
    mensaje.attach(MIMEText(cuerpo, "plain", "utf-8"))

    adjunto = MIMEApplication(pdf_bytes, _subtype="pdf")
    adjunto.add_header("Content-Disposition", "attachment", filename=nombre_pdf)
    mensaje.attach(adjunto)

    with smtplib.SMTP(servidor, puerto) as smtp:
        smtp.starttls()
        smtp.login(remitente, clave)
        smtp.sendmail(remitente, destinatarios, mensaje.as_string())


@app.route("/enviar", methods=["POST"])
def enviar():
    tecnico = request.form.get("tecnico", "").strip()
    cliente = request.form.get("cliente", "").strip()
    rut_cliente = request.form.get("rut_cliente", "").strip()
    direccion = request.form.get("direccion", "").strip()
    comuna = request.form.get("comuna", "").strip()
    region = request.form.get("region", "").strip()
    observacion = request.form.get("observacion", "").strip()

    destinatarios = request.form.getlist("destinatarios")
    correo_extra = request.form.get("correo_extra", "").strip()
    if correo_extra:
        extras = [c.strip() for c in correo_extra.split(",") if c.strip()]
        destinatarios.extend(extras)
    destinatarios = list(dict.fromkeys(destinatarios))  # sin duplicados, mantiene orden

    if not destinatarios:
        flash("Tenés que seleccionar o escribir al menos un correo destinatario.", "error")
        return redirect(url_for("index"))

    if not rut_cliente:
        flash("Tenés que completar el RUT del cliente.", "error")
        return redirect(url_for("index"))

    fotos = []
    faltantes = []
    for slot in FOTO_SLOTS:
        key = slot["key"]
        archivo = request.files.get(f"foto_{key}")
        nivel_senal = request.form.get(f"senal_{key}", "").strip() if slot["requiere_senal"] else None

        if archivo and archivo.filename:
            buffer, tam = preparar_imagen(archivo)
            fotos.append((slot["titulo"], buffer, tam, nivel_senal))
        elif slot["obligatoria"]:
            faltantes.append(slot["titulo"])

    if faltantes:
        flash(
            "Faltan fotos obligatorias del informe: " + ", ".join(faltantes) + ".",
            "error",
        )
        return redirect(url_for("index"))

    pdf_bytes = generar_pdf(tecnico, cliente, rut_cliente, direccion, comuna, region, fotos, observacion)

    fecha_archivo = datetime.now().strftime("%Y%m%d_%H%M")
    nombre_pdf = f"Auditoria_Fotografica_{rut_cliente}_{fecha_archivo}.pdf".replace(" ", "")
    asunto = f"Auditoría Fotográfica Cliente RUT {rut_cliente}"
    if cliente:
        asunto += f" - {cliente}"
    cuerpo = (
        f"Se adjunta el informe de instalación generado el {datetime.now().strftime('%d/%m/%Y %H:%M')}.\n\n"
        f"Técnico: {tecnico or '-'}\n"
        f"Cliente: {cliente or '-'}\n"
        f"RUT: {rut_cliente or '-'}\n"
        f"Dirección: {direccion or '-'}\n"
        f"Comuna: {comuna or '-'}\n"
        f"Región: {region or '-'}\n"
    )

    try:
        enviar_correo(destinatarios, asunto, cuerpo, pdf_bytes, nombre_pdf)
    except KeyError:
        flash(
            "Falta configurar EMAIL_ADDRESS y EMAIL_PASSWORD en el archivo .env del servidor.",
            "error",
        )
        return redirect(url_for("index"))
    except smtplib.SMTPAuthenticationError:
        flash(
            "El servidor de correo rechazó las credenciales. Revisá EMAIL_ADDRESS/EMAIL_PASSWORD "
            "(recordá usar una contraseña de aplicación, no la contraseña normal).",
            "error",
        )
        return redirect(url_for("index"))
    except Exception as e:
        flash(f"No se pudo enviar el correo: {e}", "error")
        return redirect(url_for("index"))

    flash(f"Informe enviado correctamente a: {', '.join(destinatarios)}", "success")
    return redirect(url_for("index"))


if __name__ == "__main__":
    # host="0.0.0.0" para poder abrirlo desde el celular en la misma red Wi-Fi
    app.run(host="0.0.0.0", port=5000, debug=True)
