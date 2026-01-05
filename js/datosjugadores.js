const formUsuario = document.getElementById('formUsuario');

if (formUsuario) {
    formUsuario.addEventListener('submit', function (e) {
        e.preventDefault();

        const inputFoto = document.getElementById('foto');
        const archivo = inputFoto.files[0];

        const usuario = {
            categoria: document.getElementById('categoria').value,
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            edad: document.getElementById('edad').value,
            etapa: document.getElementById('etapa').value,
            contacto: document.getElementById('contacto').value,
            foto: null
        };

        if (!archivo) {
            guardarUsuario(usuario);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            usuario.foto = reader.result;
            guardarUsuario(usuario);
        };
        reader.readAsDataURL(archivo);
    });
}

function guardarUsuario(usuario) {
    const usuarios = JSON.parse(localStorage.getItem('listaUsuarios')) || [];
    usuarios.push(usuario);
    localStorage.setItem('listaUsuarios', JSON.stringify(usuarios));
    alert('Jugador agregado correctamente!');
    formUsuario.reset();
}
