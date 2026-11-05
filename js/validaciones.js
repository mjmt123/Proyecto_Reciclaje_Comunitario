
var ROL_ACTUAL = "administrador";

function validarTexto(valor, nombre, minimo) {
  if (valor.trim() === "") { return "Escribe " + nombre + "."; }
  if (valor.trim().length < minimo) { return "Escribe al menos " + minimo + " caracteres en " + nombre + "."; }
  return "";
}

function validarNumero(valor, nombre, minimo, maximo) {
  var n = parseFloat(valor);
  if (isNaN(n)) { return "Escribe un número en " + nombre + "."; }
  if (n < minimo || n > maximo) { return "El valor de " + nombre + " debe estar entre " + minimo + " y " + maximo + "."; }
  return "";
}

function validarSeleccion(valor, nombre) {
  return valor === "" ? "Elige " + nombre + "." : "";
}

function validarCorreo(valor) {
  var arroba = valor.indexOf("@");
  if (arroba < 1 || valor.indexOf(".", arroba) === -1 || valor.endsWith(".")) { return "Escribe un correo válido."; }
  return "";
}

function limpiarTexto(texto) {
  var salida = "";
  for (var i = 0; i < texto.length; i++) {
    var c = texto.charAt(i);
    switch (c) {
      case "<": salida += "&lt;"; break;
      case ">": salida += "&gt;"; break;
      case "&": salida += "&amp;"; break;
      case '"': salida += "&quot;"; break;
      default: salida += c;
    }
  }
  return salida;
}

function mostrarAlerta(idContenedor, tipo, texto) {
  document.getElementById(idContenedor).innerHTML = '<div class="alert alert-' + tipo + '" role="alert">' + texto + "</div>";
}

function mostrarErrores(idContenedor, errores) {
  var items = "";
  for (var i = 0; i < errores.length; i++) {
    if (errores[i] !== "") { items += "<li>" + errores[i] + "</li>"; }
  }
  if (items === "") {
    document.getElementById(idContenedor).innerHTML = "";
    return true;
  }
  mostrarAlerta(idContenedor, "danger", '<strong>Revisa estos datos:</strong><ul class="mb-0">' + items + "</ul>");
  return false;
}

function puedeAcceder(rol, pagina) {
  switch (pagina) {
    case "dashboard":
    case "usuarios":
    case "materiales":
    case "recompensas":
    case "reportes":
      return rol === "administrador";
    default:
      return true;
  }
}

function verificarAcceso(pagina) {
  if (puedeAcceder(ROL_ACTUAL, pagina)) { return true; }
  document.getElementById("contenido").innerHTML =
    '<div class="alert alert-danger" role="alert"><strong>Acceso denegado.</strong> Tu rol (' + ROL_ACTUAL +
    ') no tiene permiso para ver esta página.</div>';
  return false;
}
