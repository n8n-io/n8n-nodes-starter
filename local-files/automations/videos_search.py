from pathlib import Path
from datetime import datetime, timedelta
import shutil

# ====== CONFIGURACIÓN ======
carpeta_base = Path(r"D:\Users\aleja\AppData\Local\Temp\gradio")
carpeta_destino = Path(r"D:\Users\aleja\Code\n8n-nodes-starter-s4ds\local-files\videos")
buscar_recursivamente = True

# ====== CALCULAR HORA LÍMITE ======
ahora = datetime.now()
una_hora_atras = ahora - timedelta(hours=1)

# ====== BÚSQUEDA ======
archivos = carpeta_base.rglob("*.mp4") if buscar_recursivamente else carpeta_base.glob("*.mp4")
encontrados = []

for archivo in archivos:
    try:
        modificado = datetime.fromtimestamp(archivo.stat().st_mtime)
        if modificado >= una_hora_atras:
            encontrados.append(archivo)
    except Exception as e:
        print(f"⚠️ Error al leer {archivo.name}: {e}")

# ====== COPIAR ARCHIVOS ======
if encontrados:
    carpeta_destino.mkdir(parents=True, exist_ok=True)
    print(f"\n🎯 Archivos .mp4 modificados en la última hora:\n")

    for archivo in encontrados:
        destino = carpeta_destino / archivo.name
        try:
            shutil.copy2(archivo, destino)
            print(f"✅ Copiado: {archivo.name}")
        except Exception as e:
            print(f"❌ Error al copiar {archivo.name}: {e}")
else:
    print("\n⚠️ No se encontraron archivos .mp4 recientes.")
