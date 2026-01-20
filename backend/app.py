import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # permite llamadas desde el frontend (JS)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "..", "data", "jugadores.json")


# -----------------------------
# helpers
# -----------------------------
def leer_jugadores():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def guardar_jugadores(jugadores):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(jugadores, f, indent=2, ensure_ascii=False)


# -----------------------------
# rutas
# -----------------------------
@app.route("/jugadores", methods=["GET"])
def obtener_jugadores():
    return jsonify(leer_jugadores())


@app.route("/jugadores", methods=["POST"])
def agregar_jugador():
    jugador = request.json

    jugadores = leer_jugadores()
    jugadores.append(jugador)  # 👈 NO borra, agrega

    guardar_jugadores(jugadores)

    return jsonify({
        "ok": True,
        "mensaje": "Jugador agregado",
        "total": len(jugadores)
    })


# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)