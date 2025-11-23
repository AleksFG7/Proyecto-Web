// --- Mostrar y ocultar menú ---
function toggleMenu() {
    document.getElementById("menu").classList.toggle("mostrar");
}

//Mostrar el formulario (login o registro)
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

// --- Cerrar formulario ---
function cerrarFormulario() {
    document.getElementById("formulario").style.display = "none";
}

//  LOGIN (usa fetch para enviar los datos al backend)
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

        if (data.success) {
            alert("Bienvenido, " + data.nombre + " ");
            cerrarFormulario();
            mostrarNombreEnHeader(data.nombre);

            // Guardar el nombre en sessionStorage para mantener sesión
            sessionStorage.setItem("usuarioActivo", data.nombre);
        } else {
            alert(data.mensaje || "Credenciales incorrectas");
        }

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Error de conexión con el servidor");
    }
}

//  REGISTRO (usa fetch para crear usuario en la base de datos)
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
            alert("✅ " + data.mensaje);
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

// --- Mostrar nombre en el header después del login ---
function mostrarNombreEnHeader(nombre) {
    const header = document.querySelector("header");
    let usuarioSpan = document.getElementById("usuarioActivo");

    if (!usuarioSpan) {
        usuarioSpan = document.createElement("span");
        usuarioSpan.id = "usuarioActivo";
        usuarioSpan.style.marginLeft = "20px";
        usuarioSpan.style.fontWeight = "bold";
        usuarioSpan.style.color = "#222";
        header.appendChild(usuarioSpan);
    }

    usuarioSpan.textContent = "👤 " + nombre;
}

// --- Mostrar el nombre del usuario guardado si recarga la página ---
window.addEventListener("load", () => {
    const usuarioGuardado = sessionStorage.getItem("usuarioActivo");
    if (usuarioGuardado) {
        mostrarNombreEnHeader(usuarioGuardado);
    }
});
