async function cargarUsuario() {
    try {
        const response = await fetch('../db.json');
        const data = await response.json();
        return data.usuarios;
    } catch (error) {
        console.error('Error al cargar usuarios', error);
        return [];
    }
};

function verificarLogin(nombreUsuario, contrasena, usuarios) {
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].nombre === nombreUsuario && usuarios[i].contrasena === contrasena) {
            return usuarios[i].nombre;
        }
    }
    return null;
}

async function iniciarSesion() {
    let nombreUsuarioIngresado = document.getElementById('nombreUsuarioLogin').value;
    let contrasenaIngresada = document.getElementById('passwordLogin').value;

    let usuarios = await cargarUsuario();
    let resultadoLogin = verificarLogin(nombreUsuarioIngresado, contrasenaIngresada, usuarios);

    if (resultadoLogin) {
        Swal.fire({
            icon: 'success',
            title: `Bienvenido ${resultadoLogin}!`,
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.href = 'index.html';
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'No se pudo acceder',
            text: 'Nombre de usuario o contraseña incorrectos.'
        });
    }
}

async function crearCuenta() {
    let nombreUsuario = document.getElementById('nombreUsuario').value;
    let nuevoEmail = document.getElementById('nuevoEmail').value;
    let nuevaPassword = document.getElementById('nuevaPassword').value;
    let confirmarPassword = document.getElementById('confirmarPassword').value;

    if (nuevaPassword !== confirmarPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las contraseñas no coinciden.'
        });

        return;
    }

    let usuarios = await cargarUsuario();
    let usuarioExistente = usuarios.find(usuario => usuario.nombre === nombreUsuario);

    if (usuarioExistente) {
        alert('El nombre de usuario está en uso.');
        return;
    };

    let nuevoUsuario = {
        nombre: nombreUsuario,
        email: nuevoEmail,
        contrasena: nuevaPassword
    };

    usuarios.push(nuevoUsuario);



    await fetch('../db.json', {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({usuarios}),
    });

    Swal.fire({
        icon: 'succes',
        title: 'Cuenta creada con exito.',
        text: 'Ya puedes iniciar sesión'
    })
}

document.getElementById('btnIniciarSesion').addEventListener('click', iniciarSesion);
document.getElementById('btnCrearCuenta').addEventListener('click', crearCuenta);

document.getElementById('linkCrearCuenta').addEventListener('click', function() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('registro-container').style.display = 'block';
});

document.getElementById('linkVolverLogin').addEventListener('click', function() {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('registro-container').style.display = 'none';
})