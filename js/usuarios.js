// Pantallas del módulo de gestión de usuarios.
// Mientras no exista el Back End (PHP y MySQL), los datos se guardan en el
// navegador (localStorage) solo para simular registro, sesión y recuperación.

var ZONAS = ["San José", "Alajuela", "Cartago", "Heredia", "Liberia", "Puntarenas", "Limón"];
var CLAVE_USUARIOS = "rc_usuarios";
var CLAVE_SESION = "rc_sesion";
var CLAVE_RECUPERACION = "rc_recuperacion";

/* ---------- Almacenamiento ---------- */
function leerJSON(clave, porDefecto) {
  try {
    var datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : porDefecto;
  } catch (e) {
    return porDefecto;
  }
}
function guardarJSON(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch (e) {
    return false;
  }
}
function quitarClave(clave) {
  try { localStorage.removeItem(clave); } catch (e) { }
}

/* ---------- Usuarios y sesión ---------- */
function leerUsuarios() { return leerJSON(CLAVE_USUARIOS, []); }
function guardarUsuarios(lista) { return guardarJSON(CLAVE_USUARIOS, lista); }

function buscarUsuario(correo) {
  var lista = leerUsuarios();
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].correo.toLowerCase() === correo.toLowerCase()) { return i; }
  }
  return -1;
}
function correoRegistrado(correo) { return buscarUsuario(correo) !== -1; }

function sesionActual() {
  var correo = leerJSON(CLAVE_SESION, null);
  if (correo === null) { return null; }
  var i = buscarUsuario(correo);
  return i === -1 ? null : leerUsuarios()[i];
}

/* ---------- Validaciones ---------- */
function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}
function validarNombre(nombre) {
  if (nombre.length < 3) { return "Escribe tu nombre completo (mínimo 3 letras)."; }
  if (/\d/.test(nombre)) { return "El nombre no puede contener números."; }
  return "";
}
function validarClave(clave, clave2) {
  if (clave.length < 8) { return "La contraseña debe tener al menos 8 caracteres."; }
  if (!/[A-Za-z]/.test(clave) || !/[0-9]/.test(clave)) { return "La contraseña debe combinar letras y números."; }
  if (clave !== clave2) { return "Las contraseñas no coinciden."; }
  return "";
}

/* ---------- Mensajes y utilidades de pantalla ---------- */
function mostrarErrores(errores) {
  var items = "";
  for (var e = 0; e < errores.length; e++) { items += "<li>" + errores[e] + "</li>"; }
  document.getElementById("mensaje").innerHTML =
    '<div class="alert alert-danger" role="alert"><strong>Revisa estos datos:</strong><ul class="mb-0">' + items + "</ul></div>";
}
function mostrarMensaje(tipo, html) {
  document.getElementById("mensaje").innerHTML = '<div class="alert alert-' + tipo + '" role="alert">' + html + "</div>";
}
function llenarZonas(id, textoInicial) {
  var select = document.getElementById(id);
  var inicial = document.createElement("option");
  inicial.value = "";
  inicial.innerHTML = textoInicial;
  select.appendChild(inicial);
  for (var i = 0; i < ZONAS.length; i++) {
    var op = document.createElement("option");
    op.value = ZONAS[i];
    op.innerHTML = ZONAS[i];
    select.appendChild(op);
  }
}
function activarMostrarClave(idCheck, idsCampos) {
  document.getElementById(idCheck).addEventListener("change", function () {
    var tipo = this.checked ? "text" : "password";
    for (var i = 0; i < idsCampos.length; i++) {
      document.getElementById(idsCampos[i]).type = tipo;
    }
  });
}

/* ---------- Página de inicio ---------- */
function iniciarInicio() {
  var usuario = sesionActual();
  if (usuario !== null) {
    document.getElementById("saludo").textContent =
      "Hola, " + usuario.nombre.split(" ")[0] + ". ¡Qué bueno verte de nuevo!";
  }
}

/* ---------- Registro ---------- */
function iniciarRegistro() {
  llenarZonas("zona", "Selecciona tu zona");
  activarMostrarClave("verClave", ["clave", "clave2"]);

  document.getElementById("formRegistro").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var nombre = document.getElementById("nombre").value.trim();
    var correo = document.getElementById("correo").value.trim();
    var zona = document.getElementById("zona").value;
    var direccion = document.getElementById("direccion").value.trim();
    var clave = document.getElementById("clave").value;
    var clave2 = document.getElementById("clave2").value;
    var errores = [];

    var errNombre = validarNombre(nombre);
    if (errNombre !== "") { errores.push(errNombre); }

    if (correo === "") { errores.push("Escribe tu correo electrónico."); }
    else if (!correoValido(correo)) { errores.push("El correo no tiene un formato válido (ejemplo: nombre@correo.com)."); }
    else if (correoRegistrado(correo)) { errores.push("Ese correo ya tiene una cuenta. Inicia sesión."); }

    if (zona === "") { errores.push("Elige tu zona."); }

    var errClave = validarClave(clave, clave2);
    if (errClave !== "") { errores.push(errClave); }

    if (!document.getElementById("acepto").checked) { errores.push("Debes aceptar el uso de tus datos para continuar."); }

    if (errores.length > 0) {
      mostrarErrores(errores);
      return;
    }

    var lista = leerUsuarios();
    lista.push({ nombre: nombre, correo: correo, zona: zona, direccion: direccion, clave: clave, rol: "usuario" });
    if (!guardarUsuarios(lista)) {
      mostrarErrores(["No se pudo guardar la cuenta en este navegador. Intenta de nuevo."]);
      return;
    }

    mostrarMensaje("success", '<strong>Cuenta creada.</strong> Ya puedes <a href="login.html">iniciar sesión</a>.');
    document.getElementById("formRegistro").reset();
  });
}

/* ---------- Inicio de sesión ---------- */
function iniciarLogin() {
  activarMostrarClave("verClave", ["claveLogin"]);

  document.getElementById("formLogin").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var correo = document.getElementById("correoLogin").value.trim();
    var clave = document.getElementById("claveLogin").value;
    var errores = [];

    if (correo === "") { errores.push("Escribe tu correo electrónico."); }
    else if (!correoValido(correo)) { errores.push("El correo no tiene un formato válido."); }
    if (clave === "") { errores.push("Escribe tu contraseña."); }

    if (errores.length > 0) {
      mostrarErrores(errores);
      return;
    }

    var i = buscarUsuario(correo);
    if (i === -1 || leerUsuarios()[i].clave !== clave) {
      mostrarErrores(["Correo o contraseña incorrectos."]);
      return;
    }

    guardarJSON(CLAVE_SESION, leerUsuarios()[i].correo);
    location.href = "mis-puntos.html";
  });
}

/* ---------- Recuperar contraseña ---------- */
function iniciarRecuperar() {
  activarMostrarClave("verClave", ["claveNueva", "claveNueva2"]);

  // Paso 1: pedir el código
  document.getElementById("formSolicitar").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var correo = document.getElementById("correoRec").value.trim();
    if (correo === "") { mostrarErrores(["Escribe tu correo electrónico."]); return; }
    if (!correoValido(correo)) { mostrarErrores(["El correo no tiene un formato válido."]); return; }

    var texto = "Si el correo está registrado, enviaremos un código de verificación válido por 15 minutos.";
    if (correoRegistrado(correo)) {
      var codigo = String(Math.floor(100000 + Math.random() * 900000));
      guardarJSON(CLAVE_RECUPERACION, { correo: correo, codigo: codigo, expira: new Date().getTime() + 15 * 60 * 1000 });
      // Solo para la demostración: con el Back End el código llegará por correo.
      texto += '<br><small>Modo demostración: tu código es <strong>' + codigo + "</strong>.</small>";
    }
    mostrarMensaje("info", texto);
    document.getElementById("formRestablecer").classList.remove("d-none");
  });

  // Paso 2: validar el código y cambiar la contraseña
  document.getElementById("formRestablecer").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var correo = document.getElementById("correoRec").value.trim();
    var codigo = document.getElementById("codigo").value.trim();
    var clave = document.getElementById("claveNueva").value;
    var clave2 = document.getElementById("claveNueva2").value;
    var errores = [];

    var rec = leerJSON(CLAVE_RECUPERACION, null);
    if (codigo === "") { errores.push("Escribe el código de verificación."); }
    else if (rec === null || rec.correo.toLowerCase() !== correo.toLowerCase() ||
      rec.codigo !== codigo || new Date().getTime() > rec.expira) {
      errores.push("El código es incorrecto o ya venció.");
    }

    var errClave = validarClave(clave, clave2);
    if (errClave !== "") { errores.push(errClave); }

    if (errores.length > 0) {
      mostrarErrores(errores);
      return;
    }

    var lista = leerUsuarios();
    var i = buscarUsuario(correo);
    lista[i].clave = clave;
    guardarUsuarios(lista);
    quitarClave(CLAVE_RECUPERACION);

    mostrarMensaje("success", '<strong>Contraseña actualizada.</strong> Ya puedes <a href="login.html">iniciar sesión</a>.');
    document.getElementById("formRestablecer").reset();
    document.getElementById("formRestablecer").classList.add("d-none");
    document.getElementById("formSolicitar").reset();
  });
}

/* ---------- Editar perfil ---------- */
function iniciarPerfil() {
  var usuario = sesionActual();
  var form = document.getElementById("formPerfil");

  if (usuario === null) {
    form.classList.add("d-none");
    mostrarMensaje("warning", 'Debes <a href="login.html">iniciar sesión</a> para ver tu perfil.');
    return;
  }

  llenarZonas("zonaPerfil", "Selecciona tu zona");
  activarMostrarClave("verClave", ["claveActual", "claveNueva", "claveNueva2"]);
  document.getElementById("correoPerfil").value = usuario.correo;
  document.getElementById("nombrePerfil").value = usuario.nombre;
  document.getElementById("zonaPerfil").value = usuario.zona;
  document.getElementById("direccionPerfil").value = usuario.direccion;
  document.getElementById("saludoPerfil").textContent = "Sesión iniciada como " + usuario.nombre + ".";

  document.getElementById("btnSalir").addEventListener("click", function () {
    quitarClave(CLAVE_SESION);
    location.href = "login.html";
  });

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var nombre = document.getElementById("nombrePerfil").value.trim();
    var zona = document.getElementById("zonaPerfil").value;
    var direccion = document.getElementById("direccionPerfil").value.trim();
    var actual = document.getElementById("claveActual").value;
    var nueva = document.getElementById("claveNueva").value;
    var nueva2 = document.getElementById("claveNueva2").value;
    var errores = [];

    var errNombre = validarNombre(nombre);
    if (errNombre !== "") { errores.push(errNombre); }
    if (zona === "") { errores.push("Elige tu zona."); }

    var cambiaClave = actual !== "" || nueva !== "" || nueva2 !== "";
    if (cambiaClave) {
      if (actual !== usuario.clave) { errores.push("La contraseña actual no es correcta."); }
      else {
        var errClave = validarClave(nueva, nueva2);
        if (errClave !== "") { errores.push(errClave); }
        else if (nueva === actual) { errores.push("La nueva contraseña debe ser distinta a la actual."); }
      }
    }

    if (errores.length > 0) {
      mostrarErrores(errores);
      return;
    }

    var lista = leerUsuarios();
    var i = buscarUsuario(usuario.correo);
    lista[i].nombre = nombre;
    lista[i].zona = zona;
    lista[i].direccion = direccion;
    if (cambiaClave) { lista[i].clave = nueva; }
    if (!guardarUsuarios(lista)) {
      mostrarErrores(["No se pudieron guardar los cambios. Intenta de nuevo."]);
      return;
    }

    usuario = lista[i];
    document.getElementById("saludoPerfil").textContent = "Sesión iniciada como " + usuario.nombre + ".";
    document.getElementById("claveActual").value = "";
    document.getElementById("claveNueva").value = "";
    document.getElementById("claveNueva2").value = "";
    mostrarMensaje("success", "Tus datos se actualizaron correctamente.");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  switch (document.body.id) {
    case "pagina-inicio": iniciarInicio(); break;
    case "pagina-registro": iniciarRegistro(); break;
    case "pagina-login": iniciarLogin(); break;
    case "pagina-recuperar": iniciarRecuperar(); break;
    case "pagina-perfil": iniciarPerfil(); break;
  }
});