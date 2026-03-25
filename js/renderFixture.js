// ===============================
// ESTADO GLOBAL
// ===============================
let slotSeleccionado = null;
let panelActivo = null;

let jugadoresPendientes = [];
let torneoData = null;

// ===============================
// FIXTURE BASE
// ===============================
let fixtureActual = FIXTURE_32.map(slot => ({
    ...slot,
    jugador: null,
    estado: "bye"
}));

const contenedorFixture = document.getElementById("fixtureSlots");

// ===============================
// RENDER FIXTURE
// ===============================
function renderFixture() {
    contenedorFixture.innerHTML = "";

    fixtureActual.forEach((slot, index) => {
        const div = document.createElement("div");

        div.className = `jugador--${slot.lado}`;
        div.style.top = `${slot.top}%`;

        div.addEventListener("click", () => {
            abrirPanelAsignacion(index, div);
        });

        if (slot.estado === "bye") {
            div.textContent = "BYE";
            div.classList.add("slot-bye");
        } else if (slot.jugador) {
            div.textContent = `${slot.jugador.nombre} ${slot.jugador.apellido}`;
            div.classList.add("slot-ocupado");
        }

        contenedorFixture.appendChild(div);
    });
}

// ===============================
// PANEL ASIGNACIÓN
// ===============================
function abrirPanelAsignacion(index, slotDiv) {

    if (panelActivo) panelActivo.remove();
    slotSeleccionado = index;

    const panel = document.createElement("div");
    panel.className = "panel-asignacion mt-2";

    // jugadores pendientes
    jugadoresPendientes.forEach(jugador => {
        const btn = document.createElement("button");
        btn.className = "btn btn-sm btn-outline-primary m-1";
        btn.textContent = `${jugador.nombre} ${jugador.apellido}`;
        btn.onclick = () => asignarJugadorManual(jugador);
        panel.appendChild(btn);
    });

    // botón BYE
    const btnBye = document.createElement("button");
    btnBye.className = "btn btn-sm btn-outline-danger m-1";
    btnBye.textContent = "BYE";
    btnBye.onclick = marcarByeManual;
    panel.appendChild(btnBye);

    slotDiv.after(panel);
    panelActivo = panel;
}

// ===============================
// ASIGNAR JUGADOR
// ===============================
function asignarJugadorManual(jugador) {
    const slot = fixtureActual[slotSeleccionado];

    if (slot.jugador) {
        jugadoresPendientes.push(slot.jugador);
    }

    slot.jugador = jugador;
    slot.estado = "ocupado";

    jugadoresPendientes = jugadoresPendientes.filter(j => j !== jugador);

    guardarFixture();
    cerrarPanel();
    renderFixture();
}

// ===============================
// MARCAR BYE
// ===============================
function marcarByeManual() {
    const slot = fixtureActual[slotSeleccionado];

    if (slot.jugador) {
        jugadoresPendientes.push(slot.jugador);
    }

    slot.jugador = null;
    slot.estado = "bye";

    guardarFixture();
    cerrarPanel();
    renderFixture();
}

// ===============================
// GUARDAR
// ===============================
function guardarFixture() {

    torneoData.fixture = fixtureActual
        .slice(0, torneoData.cantidad)
        .map(slot => slot.jugador || null);

    localStorage.setItem(
        `fixture_${torneoData.nombre}`,
        JSON.stringify(torneoData)
    );
}

// ===============================
// CERRAR PANEL
// ===============================
function cerrarPanel() {
    if (panelActivo) panelActivo.remove();
    panelActivo = null;
    slotSeleccionado = null;
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;
    const torneoPagina = body.dataset.torneo; // ej: "5ta"

    if (!torneoPagina) return;

    const torneoActivo = localStorage.getItem("torneoActivo");
    if (!torneoActivo) return;

    // validación: que el torneo activo corresponda a esta página
    if (!torneoActivo.toLowerCase().includes(torneoPagina)) {
        console.log("Este torneo no corresponde a esta página");
        return;
    }

    const data = localStorage.getItem(`fixture_${torneoActivo}`);
    if (!data) return;

    torneoData = JSON.parse(data);

    // limpiar fixture
    fixtureActual.forEach(slot => {
        slot.jugador = null;
        slot.estado = "bye";
    });

    // reconstruir fixture desde storage
    torneoData.fixture.forEach((jugador, index) => {
        if (jugador) {
            fixtureActual[index].jugador = jugador;
            fixtureActual[index].estado = "ocupado";
        }
    });

    // jugadores pendientes = seleccionados - ya ubicados
    const jugadoresUbicados = torneoData.fixture.filter(j => j !== null);

    jugadoresPendientes = torneoData.jugadores.filter(
        j => !jugadoresUbicados.some(u => u.nombre === j.nombre && u.apellido === j.apellido)
    );

    renderFixture();
});