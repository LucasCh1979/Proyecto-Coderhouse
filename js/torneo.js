// ===============================
// TORNEO - CREACIÓN Y SELECCIÓN
// ===============================

const selectTorneo = document.getElementById("torneo");
const inputCantidad = document.getElementById("cantidadJugadores");
const seccionSeleccion = document.getElementById("seccionSeleccionJugadores");
const tituloTorneo = document.getElementById("tituloTorneo");
const contadorSeleccion = document.getElementById("contadorSeleccion");
const listaJugadores = document.getElementById("listaJugadoresTorneo");
const btnContinuar = document.getElementById("btnContinuarTorneo");

let cantidadMaxima = 0;
let jugadoresSeleccionados = [];

// ===============================
// EVENTOS
// ===============================
selectTorneo.addEventListener("change", actualizarSeleccion);
inputCantidad.addEventListener("input", actualizarSeleccion);

// ===============================
// ACTUALIZAR SECCIÓN
// ===============================
function actualizarSeleccion() {
    const torneo = selectTorneo.value;
    const cantidad = parseInt(inputCantidad.value);

    if (!torneo || !cantidad || cantidad < 2) {
        seccionSeleccion.classList.add("d-none");
        return;
    }

    cantidadMaxima = cantidad;
    jugadoresSeleccionados = [];

    tituloTorneo.textContent = torneo;
    contadorSeleccion.textContent = `Seleccionados: 0 / ${cantidadMaxima}`;
    btnContinuar.disabled = true;

    renderListaJugadores();
    seccionSeleccion.classList.remove("d-none");
}

// ===============================
// RENDER LISTA DE JUGADORES
// ===============================
function renderListaJugadores() {
    listaJugadores.innerHTML = "";

    if (!window.jugadores || window.jugadores.length === 0) {
        listaJugadores.innerHTML = "<p>No hay jugadores cargados</p>";
        return;
    }

    window.jugadores.forEach((jugador, index) => {
        const div = document.createElement("div");
        div.className = "form-check";

        div.innerHTML = `
            <input
                class="form-check-input jugador-checkbox"
                type="checkbox"
                id="jugador-${index}"
                data-index="${index}"
            >
            <label class="form-check-label" for="jugador-${index}">
                ${jugador.nombre} ${jugador.apellido}
            </label>
        `;

        listaJugadores.appendChild(div);
    });

    activarCheckboxes();
}

// ===============================
// CONTROL DE CHECKBOX
// ===============================
function activarCheckboxes() {
    const checkboxes = document.querySelectorAll(".jugador-checkbox");

    checkboxes.forEach(chk => {
        chk.addEventListener("change", () => {
            const index = parseInt(chk.dataset.index);
            const jugador = window.jugadores[index];

            if (chk.checked) {
                if (jugadoresSeleccionados.length >= cantidadMaxima) {
                    chk.checked = false;
                    return;
                }
                jugadoresSeleccionados.push(jugador);
            } else {
                jugadoresSeleccionados = jugadoresSeleccionados.filter(
                    j => j !== jugador
                );
            }

            actualizarContador();
        });
    });
}

// ===============================
// CONTADOR + BOTÓN
// ===============================
function actualizarContador() {
    contadorSeleccion.textContent =
        `Seleccionados: ${jugadoresSeleccionados.length} / ${cantidadMaxima}`;

    btnContinuar.disabled = jugadoresSeleccionados.length < 2;
}

// ===============================
// CREAR TORNEO
// ===============================
btnContinuar.addEventListener("click", () => {

    const torneo = selectTorneo.value;

    const torneoData = {
        nombre: torneo,
        cantidad: cantidadMaxima,
        cerrado: true,
        jugadores: [...jugadoresSeleccionados],
        fixture: Array.from({ length: cantidadMaxima }, () => null)
    };

    // guardar torneo activo
    localStorage.setItem("torneoActivo", torneo);

    // guardar torneo
    localStorage.setItem(
        `fixture_${torneo}`,
        JSON.stringify(torneoData)
    );

    console.log("Torneo creado:", torneoData);

    // ir al fixture visual
    window.location.href = "torneo5ta.html";
});