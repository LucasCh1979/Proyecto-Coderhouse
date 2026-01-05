const filtroCategoria = document.getElementById('filtroCategoria');
const resultadosDiv = document.getElementById('resultados');

if (filtroCategoria && resultadosDiv) {

    filtroCategoria.addEventListener('change', function () {
        const categoria = this.value;
        const usuarios = JSON.parse(localStorage.getItem('listaUsuarios')) || [];

        resultadosDiv.innerHTML = '';

        const filtrados = usuarios.filter(u => u.categoria === categoria);

        if (filtrados.length === 0) {
            resultadosDiv.innerHTML = `
                <div class="col-12 text-center">
                    <p>No hay jugadores en esa categoría.</p>
                </div>
            `;
            return;
        }

        filtrados.forEach(jugador => {
            const col = document.createElement('div');
            col.className = 'col-12 col-md-6 col-lg-4 d-flex justify-content-center p-2';

            const card = document.createElement('div');
            card.className = 'card';
            card.style.width = '18rem';
            card.style.background =
                'linear-gradient(-45deg, hsl(34, 82%, 63%), hwb(34 87% 8%), hsl(34, 82%, 63%), hwb(34 87% 8%))';
            card.setAttribute('data-aos', 'flip-left');

            card.innerHTML = `
                <img src="${jugador.foto || '../assets/img/jugador3500.webp'}" class="card-img-top" alt="jugador">
                <div class="card-body">
                    <h5 class="card-title">Categoría: ${jugador.categoria}</h5>
                    <ul>
                        <li>Nombre: ${jugador.nombre} ${jugador.apellido}</li>
                        <li>Edad: ${jugador.edad}</li>
                        <li>Etapa: ${jugador.etapa}</li>
                        <li>Contacto: ${jugador.contacto}</li>
                    </ul>
                </div>
            `;

            col.appendChild(card);
            resultadosDiv.appendChild(col);
        });

        AOS.refreshHard();
    });

}
