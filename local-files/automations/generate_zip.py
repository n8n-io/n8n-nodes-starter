from pathlib import Path
from zipfile import ZipFile
import datetime
import os

# ====== CONFIGURACIÓN ======
carpeta_origen = Path(r"D:\Users\aleja\Code\n8n-nodes-starter-s4ds\local-files\images")
archivo_zip = carpeta_origen.parent / f"queue_{datetime.date.today()}.zip"

# Extensiones de imagen a eliminar después del zip
extensiones_imagen = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tiff"}

# ====== OBTENER ARCHIVOS ======
archivos_a_comprimir = list(carpeta_origen.glob("*"))  # Solo archivos del nivel actual

archivo_queue_json = carpeta_origen / "queue.json"

# ====== CREAR ZIP ======
if archivos_a_comprimir:
    with ZipFile(archivo_zip, 'w') as zipf:
        for archivo in archivos_a_comprimir:
            if archivo.is_file():
                zipf.write(archivo, arcname=archivo.name)
                print(f"📦 Añadido al zip: {archivo.name}")
    print(f"\n✅ ZIP creado en: {archivo_zip}")
else:
    print("⚠️ No hay archivos para comprimir.")
    exit()

# ====== ELIMINAR IMÁGENES ======
eliminados = 0
for archivo in archivos_a_comprimir:
    if archivo.suffix.lower() in extensiones_imagen:
        try:
            archivo.unlink()
            print(f"🗑️ Imagen eliminada: {archivo.name}")
            eliminados += 1
        except Exception as e:
            print(f"❌ Error al eliminar {archivo.name}: {e}")

print(f"\n🧹 Eliminación finalizada. Total imágenes eliminadas: {eliminados}")

# ====== LIMPIAR queue.json ======
if archivo_queue_json.exists():
    try:
        archivo_queue_json.write_text("[]", encoding="utf-8")
        print(f"\n✅ queue.json limpiado correctamente.")
    except Exception as e:
        print(f"❌ Error al limpiar queue.json: {e}")
else:
    print("⚠️ queue.json no se encontró en la carpeta.")