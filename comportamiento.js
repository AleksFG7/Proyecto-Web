// Mostrar y ocultar menú 
function toggleMenu() {
    document.getElementById("menu").classList.toggle("mostrar");
}

// Mostrar el formulario (login o registro)
function mostrarFormulario(tipo) {
    const formDiv = document.getElementById("formulario");
    const titulo = document.getElementById("titulo-form");
    const contenido = document.getElementById("form-content");

    formDiv.style.display = "flex";

    if (tipo === "login") {
        titulo.textContent = "Iniciar sesión";
        contenido.innerHTML = `
            <label>Correo:</label><br>
            <input type="email" id="correo" placeholder="Ingresa tu correo" required><br><br>
            <label>Contraseña:</label><br>
            <input type="password" id="password" placeholder="Ingresa tu contraseña" required><br><br>
            <button type="button" id="btnLogin">Entrar</button>
        `;

        document.getElementById("btnLogin").addEventListener("click", iniciarSesion);

    } else if (tipo === "registro") {
        titulo.textContent = "Registrarse";
        contenido.innerHTML = `
            <label>Nombre:</label><br>
            <input type="text" id="nombre" placeholder="Ingresa tu nombre" required><br><br>
            <label>Correo:</label><br>
            <input type="email" id="email" placeholder="Ingresa tu correo" required><br><br>
            <label>Contraseña:</label><br>
            <input type="password" id="password" placeholder="Crea una contraseña" required><br><br>
            <button type="button" id="btnRegistro">Registrarse</button>
        `;

        document.getElementById("btnRegistro").addEventListener("click", registrarUsuario);
    }
}

// Cerrar formulario
function cerrarFormulario() {
    document.getElementById("formulario").style.display = "none";
}

// login
async function iniciarSesion() {
    const email = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Por favor, llena todos los campos");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log(data); 
        


        if (data.success) {
            alert("Bienvenido, " + data.nombre + " ");
            cerrarFormulario();
            mostrarNombreEnHeader(data.nombre);
             // Guardar datos solo si login fue exitoso
            sessionStorage.setItem("usuarioActivo", data.nombre);
            sessionStorage.setItem("idUsuario", data.id); 
          
        } else {
            alert(data.mensaje || "Credenciales incorrectas");
        }

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Error de conexión con el servidor");
    }
}

//  registro
async function registrarUsuario() {
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if(!nombre || !email || !password){
        alert("Por favor llena todos los campos");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/usuarios/registro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, email, password })
        });

        const data = await response.json();

        if (data.success) {

            // guardamos el correo para la verificación
            sessionStorage.setItem("emailRegistro", data.email);

            mostrarVentanaVerificacion(data.email);
            cerrarFormulario();

        } else {
            alert("⚠️ " + data.mensaje);
            console.log(data)
        }

    } catch (error) {
        console.error("Error al registrar:", error);
        alert("Error de conexión con el servidor");
    }
}

// Mostrar nombre en el header después del login
function mostrarNombreEnHeader(nombre) {
    const header = document.querySelector("header");
    let usuarioSpan = document.getElementById("usuarioActivo");

    if (!usuarioSpan) {
        usuarioSpan = document.createElement("span");
        usuarioSpan.id = "usuarioActivo";
        usuarioSpan.style.marginLeft = "20px";
        usuarioSpan.style.fontWeight = "arial";
        usuarioSpan.style.color = "#ffffffff";
        header.appendChild(usuarioSpan);
    }

    usuarioSpan.textContent = "👤 " + nombre;
}

// Mostrar el nombre del usuario guardado al recargar
window.addEventListener("load", () => {
    const usuarioGuardado = sessionStorage.getItem("usuarioActivo");
    if (usuarioGuardado) {
        mostrarNombreEnHeader(usuarioGuardado);
    }
});

// Ventana para verificar código
let emailRegistro = "";

function mostrarVentanaVerificacion(email) {
    emailRegistro = email;
    document.getElementById("ventanaVerificacion").style.display = "block";
}

// Verificar código
function verificarCodigo() {
const codigo = document.getElementById("codigoVerificacion").value;
const email = sessionStorage.getItem("emailRegistro"); 

if (!email) {
    alert("No se pudo obtener el correo del registro.");
    return;
}

fetch("http://localhost:8080/api/usuarios/verificar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        email: email,
        codigo: codigo
    })
})
.then(res => res.json())
.then(data => {
    if (data.success) {
        document.getElementById("mensajeVerificacion").style.color = "green";
        document.getElementById("mensajeVerificacion").innerText = "Cuenta verificada correctamente";

        setTimeout(() => {
            alert("Tu cuenta ya está verificada, ahora puedes iniciar sesión");
            document.getElementById("ventanaVerificacion").style.display = "none";
        }, 1000);

    } else {
        document.getElementById("mensajeVerificacion").innerText = "Código incorrecto";
    }
});
}

// Reservar paquetes
let paqueteIdGlobal = null;

window.confirmarReserva = function(idPaquete) {
    paqueteIdGlobal = idPaquete; // p/guardar el paq seleccionado
    document.getElementById("modalReserva").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modalReserva").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const btnConfirmar = document.getElementById("btnConfirmar");
    if (btnConfirmar) {
        btnConfirmar.addEventListener("click", function() {

            const usuarioId = sessionStorage.getItem("idUsuario");
            const paqueteId = paqueteIdGlobal;  
            if (!usuarioId) {
                alert("Debes iniciar sesión para reservar");
                return;
            }

            console.log({
                idUsuario: usuarioId,
                idPaquete: paqueteIdGlobal
            });

            fetch("http://localhost:8080/api/reservas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idUsuario: parseInt(usuarioId),
                    idPaquete: parseInt(paqueteId)
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(data => {
                alert("¡Reserva creada exitosamente!");
                cerrarModal();
            })
            .catch(error => {
                console.error(error);
                console.log({
                idUsuario: usuarioId,
                idPaquete: paqueteIdGlobal
            });
                alert("Ocurrió un error al crear la reserva.");
            });
        });
    }
});
//Carga de reservas
document.addEventListener("DOMContentLoaded", () => {
    const idUsuario = sessionStorage.getItem("idUsuario"); // id dinámico
    console.log(sessionStorage.getItem("idUsuario"));


    if (!idUsuario) {
        console.error("Usuario no logueado");
        return;
    }

    fetch(`http://localhost:8080/api/reservas/${idUsuario}`)
        .then(res => res.json())
        .then(reservas => {
            const contenedor = document.getElementById("contenedorReservas");
            
            contenedor.innerHTML = ""; 

            if (reservas.length === 0) {
                contenedor.innerHTML = `
                    <div class="reserva-card ejemplo">
                        <h3>Sin reservas aún</h3>
                        <p>Cuando reserves un viaje o concierto, aparecerá aquí.</p>
                    </div>`;
            } else {
                reservas.forEach(reserva => {
                    contenedor.innerHTML += `
                        <div class="reserva-card">
                            <h3>Reserva #${reserva.numeroReserva}</h3>
                            <p>Paquete: ${reserva.paquete.nombre}</p>
                            <p>Usuario: ${reserva.usuario.nombre}</p>
                        </div>`;
                });
            }
        })
        .catch(error => console.error("Error al cargar reservas:", error));
});

//Cerrar sesion
function cerrarSesion() {
    // Borrar datos del usuario
    sessionStorage.clear();  

    // Redirigir al inicio o login
    window.location.href = "index.html"; 
}

//NewsLetter
document.getElementById("newsletter-form").addEventListener("submit", function (e) {
    e.preventDefault(); // evitar refrescar la página

    const nombre = document.getElementById("newsletterName").value;
    const email = document.getElementById("newsletterEmail").value;

    if (!nombre || !email) {
        alert("Por favor completa nombre y email.");
        return;
    }

    fetch("http://localhost:8080/api/newsletter/suscribir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email })
    })
        .then(res => res.text())
        .then(msg => {
            alert("¡Gracias por suscribirte! Revisa tu correo.");
            
            // limpiar campos
            document.getElementById("newsletterName").value = "";
            document.getElementById("newsletterEmail").value = "";
        })
        .catch(err => console.error("Error:", err));
});

