const contenedor = document.getElementById("contenedorJugadores");
const filtroCategoria = document.getElementById("filtroCategoria");

const URL = "../data/jugadores.json";

let jugadoresTotal = [];


function obtenerJugadores() {
    const guardados = localStorage.getItem("jugadores");

    if (guardados) {
        jugadoresTotal = JSON.parse(guardados);
        renderizar();
    } else {
        fetch(URL)
            .then(response => response.json())
            .then(data => {
                jugadoresTotal = data;
                localStorage.setItem("jugadores", JSON.stringify(jugadoresTotal));
                renderizar();
            });
    }
}

obtenerJugadores();

function renderizar() {
    elegirCategoria(jugadoresTotal);
}

function crearCards(jugadores) {
    contenedor.innerHTML = "";

    jugadores.forEach(jugador => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-4 p-2";

        col.innerHTML = `
            <div class="card h-100">
                <img src="../assets/img/jugadores/${jugador.foto}" class="card-img-top">
                <div class="card-body">
                    <h5>${jugador.nombre} ${jugador.apellido}</h5>
                    <p>
                        Categoría: ${jugador.categoria}<br>
                        Edad: ${jugador.edad}<br>
                        Contacto: ${jugador.contacto}
                    </p>
                    <button 
                        class="btn btn-danger btn-sm btn-eliminar"
                        data-id="${jugador.id}">
                        Eliminar
                    </button>
                </div>
            </div>
        `;

        contenedor.appendChild(col);
    });


    const botonesEliminar = document.querySelectorAll(".btn-eliminar");

    botonesEliminar.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;

            Swal.fire({
                title: "¿Estás seguro?",
                text: "No vas a poder revertir esto",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {

                    eliminarJugador(id);

                    Swal.fire({
                        title: "Eliminado",
                        text: "El jugador fue eliminado correctamente",
                        icon: "success"
                    });
                }
            });
        });
    });
}


function eleccion() {
    const categoria = filtroCategoria.value;

    let jugadores;

    if (categoria === "") {
        jugadores = jugadoresTotal;
    } else {
        jugadores = jugadoresTotal.filter(j => j.categoria === categoria);
    }

    return jugadores
}

function elegirCategoria(jugadoresArray) {
    filtroCategoria.addEventListener("change", () => {

        crearCards(eleccion());
    });
}


function eliminarJugador(id) {
    jugadoresTotal = jugadoresTotal.filter(j => j.id != id);

    localStorage.setItem("jugadores", JSON.stringify(jugadoresTotal));

    crearCards(eleccion());
}











/* const contenedor = document.getElementById("contenedorJugadores");
const filtroCategoria = document.getElementById("filtroCategoria");

let jugadoresData = []; // ← acá guardamos el JSON completo

fetch("../data/jugadores.json")
    .then(response => response.json())
    .then(jugadores => {
        jugadoresData = jugadores;   // guardamos datos
        crearCards(jugadoresData);   // pintamos todo
    })
    .catch(error => {
        console.error("Error cargando jugadores:", error);
    });

function crearCards(jugadores) {
    contenedor.innerHTML = "";

    jugadores.forEach((jugador, index) => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4 d-flex justify-content-center p-1";

        const card = document.createElement("div");
        card.className = "card h-100";

        // 👉 AOS dinámico
        card.setAttribute("data-aos", "flip-left");
        card.setAttribute("data-aos-delay", index * 100);
        card.setAttribute("data-aos-duration", "800");

        card.innerHTML = `
        <img src="../${jugador.foto}" class="card-img-top" alt="${jugador.nombre}">
        <div class="card-body">
        <h5 class="card-title">${jugador.nombre} ${jugador.apellido}</h5>
        <p class="card-text">
            <strong>Categoría:</strong> ${jugador.categoria}<br>
            <strong>Edad:</strong> ${jugador.edad}<br>
            <strong>Mejor etapa:</strong> ${jugador.etapa}<br>
            <strong>Contacto:</strong> ${jugador.contacto}
        </p>
        </div>
    `;

        col.appendChild(card);
        contenedor.appendChild(col);
    });

    // 🔁 MUY IMPORTANTE
    AOS.refreshHard();
}

/* 🎯 FILTRO POR CATEGORÍA */
/* filtroCategoria.addEventListener("change", () => {
    const categoriaSeleccionada = filtroCategoria.value;

    if (categoriaSeleccionada === "") {
        crearCards(jugadoresData);
        return;
    }

    const filtrados = jugadoresData.filter(
        jugador => jugador.categoria === categoriaSeleccionada
    );

    crearCards(filtrados);
});  */