const formUsuario = document.getElementById("formUsuario");
const URL = "../data/jugadores.json";

let jugadores = [];


function obtenerJugadores() {
    const guardados = localStorage.getItem("jugadores");

    if (guardados) {

        jugadores = JSON.parse(guardados);

    } else {

        fetch(URL)
            .then(response => response.json())
            .then(data => {
                jugadores = data;
                guardarJugadores();
            });
    }
}

obtenerJugadores();

function guardarJugadores() {
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
}


formUsuario.addEventListener("submit", (e) => {
    e.preventDefault();

    const jugador = {
        id: Date.now(),
        categoria: document.getElementById("categoria").value,
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        edad: Number(document.getElementById("edad").value),
        contacto: document.getElementById("contacto").value,
        foto: document.getElementById("foto").value
    };

    const existe = jugadores.find(j =>
        j.nombre === jugador.nombre &&
        j.apellido === jugador.apellido
    );

    if (existe) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Este jugador ya existe!",
        });
        formUsuario.reset()
        return;
    }

    jugadores.push(jugador);

    guardarJugadores();

    formUsuario.reset();
    Swal.fire({
        icon: "success",
        title: "Jugador Creado",
    });
});

















/* const formUsuario = document.getElementById("formUsuario");
const btnDescargar = document.getElementById("descargarJSON");

window.jugadores = [];

// ---------------------------------
// CARGAR JUGADORES DESDE PYTHON
// ---------------------------------
fetch("http://localhost:5000/jugadores")
    .then(res => res.json())
    .then(data => {
        window.jugadores = data;
        console.log("Jugadores cargados:", window.jugadores);
    })
    .catch(err => {
        console.error("Error cargando jugadores:", err);
        window.jugadores = [];
    });


// ---------------------------------
// GUARDAR NUEVO JUGADOR
// ---------------------------------
if (formUsuario) {
    formUsuario.addEventListener("submit", function (e) {
        e.preventDefault();

        const inputFoto = document.getElementById("foto");
        const archivo = inputFoto.files[0];

        const jugador = {
            categoria: document.getElementById("categoria").value,
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            edad: document.getElementById("edad").value,
            etapa: document.getElementById("etapa").value,
            contacto: document.getElementById("contacto").value,
            foto: archivo ? `assets/img/jugadores/${archivo.name}` : ""
        };

        fetch("http://localhost:5000/jugadores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jugador)
        })
            .then(res => res.json())
            .then(data => {
                console.log("Jugador guardado:", data);

                // mantener estado sincronizado
                window.jugadores.push(jugador);

                // 🔔 avisar al torneo que cambió la lista
                window.dispatchEvent(new Event("jugadoresActualizados"));

                formUsuario.reset();
            })
            .catch(err => console.error("Error al guardar:", err));
    });
}


// ---------------------------------
// DESCARGAR JSON (opcional)
// ---------------------------------
if (btnDescargar) {
    btnDescargar.addEventListener("click", () => {
        const blob = new Blob(
            [JSON.stringify(window.jugadores, null, 2)],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "jugadores.json";
        a.click();

        URL.revokeObjectURL(url);
    });
}
const btnBorrarTorneo = document.getElementById("btnBorrarTorneo");

if (btnBorrarTorneo) {
    btnBorrarTorneo.addEventListener("click", () => {

        // obtener torneos existentes
        const torneos = Object.keys(localStorage)
            .filter(key => key.startsWith("fixture_"))
            .map(key => key.replace("fixture_", ""));

        if (torneos.length === 0) {
            alert("No hay torneos cargados para borrar.");
            return;
        }

        // armar listado para el prompt
        const lista = torneos.join("\n• ");

        const torneoElegido = prompt(
            `¿Qué torneo querés borrar?\n\n• ${lista}\n\nEscribí exactamente el nombre:`
        );

        if (!torneoElegido) return;

        if (!torneos.includes(torneoElegido)) {
            alert("❌ El torneo ingresado no existe.");
            return;
        }

        const confirmar = confirm(
            `⚠️ Se eliminará el torneo "${torneoElegido}".\n\n¿Confirmar borrado?`
        );

        if (!confirmar) return;

        // borrar SOLO ese torneo
        localStorage.removeItem(`fixture_${torneoElegido}`);

        alert(`✅ Torneo "${torneoElegido}" eliminado correctamente.`);
    });
} */