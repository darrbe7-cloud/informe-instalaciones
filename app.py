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
from datetime import datetime

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
    PageBreak,
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


def generar_pdf(tecnico, cliente, rut_cliente, direccion, comuna, region, fotos, observacion):
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

    _agregar_fila("Auditor", tecnico)
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

    pdf_bytes = generar_pdf(tecnico, cliente, rut_cliente, direccion, comuna, region, fotos, observacion)

    fecha_archivo = datetime.now().strftime("%Y%m%d_%H%M")
    nombre_pdf = f"Auditoria_Fotografica_{rut_cliente}_{fecha_archivo}.pdf".replace(" ", "")

    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name=nombre_pdf,
    )


if __name__ == "__main__":
    # host="0.0.0.0" para poder abrirlo desde el celular en la misma red Wi-Fi
    app.run(host="0.0.0.0", port=5000, debug=True)
