function toggleMenu() {
        document.getElementById("menu").classList.toggle("mostrar");
    }

    function mostrarFormulario(tipo) {
        const formDiv = document.getElementById("formulario");
        const titulo = document.getElementById("titulo-form");
        const contenido = document.getElementById("form-content");

        formDiv.style.display = "block";

        if (tipo === "login") {
            titulo.textContent = "Iniciar sesión";
            contenido.innerHTML = `
                <label>Correo:</label><br>
                <input type="email" placeholder="Ingresa tu correo"><br><br>
                <label>Contraseña:</label><br>
                <input type="password" placeholder="Ingresa tu contraseña"><br><br>
                <button type="submit">Entrar</button>
            `;
        } else if (tipo === "registro") {
            titulo.textContent = "Registrarse";
            contenido.innerHTML = `
                <label>Nombre:</label><br>
                <input type="text" placeholder="Ingresa tu nombre"><br><br>
                <label>Correo:</label><br>
                <input type="email" placeholder="Ingresa tu correo"><br><br>
                <label>Contraseña:</label><br>
                <input type="password" placeholder="Crea una contraseña"><br><br>
                <button type="submit">Registrarse</button>
            `;
        }
    }

    function cerrarFormulario() {
        document.getElementById("formulario").style.display = "none";
    }