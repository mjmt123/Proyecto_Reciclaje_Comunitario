// centros.js - Pantallas del módulo de centros de acopio: directorio, detalle,
// registro/edición, panel del encargado y rutas. Mientras no exista el Back End
// (PHP y MySQL), los datos se guardan en el navegador (localStorage).

var MATERIALES = ["Papel", "Cartón", "Plástico", "Vidrio", "Aluminio", "Tetra Pak"];
var ZONAS = ["San José", "Alajuela", "Cartago", "Heredia", "Liberia", "Puntarenas", "Limón"];
var CLAVE_CENTROS = "rc_centros";
var CLAVE_ENTREGAS_CENTRO = "rc_entregas_centro";

var CENTROS_INICIALES = [
  { id: 1, nombre: "Centro de acopio Central", zona: "San José", direccion: "200 m norte del Parque Central", telefono: "2222-1111", horario: "Lun a Sáb, 8:00 a 17:00", materiales: ["Papel", "Cartón", "Plástico", "Vidrio"] },
  { id: 2, nombre: "Centro de acopio Universidad", zona: "Heredia", direccion: "Frente al campus universitario", telefono: "2260-2222", horario: "Lun a Vie, 9:00 a 16:00", materiales: ["Aluminio", "Plástico", "Tetra Pak"] },
  { id: 3, nombre: "Centro de acopio Plaza Norte", zona: "Alajuela", direccion: "Costado este de Plaza Norte", telefono: "2440-3333", horario: "Mar a Dom, 7:30 a 15:30", materiales: ["Papel", "Cartón", "Vidrio"] },
  { id: 4, nombre: "Centro de acopio Cartago Sur", zona: "Cartago", direccion: "100 m sur de la Basílica", telefono: "2551-4444", horario: "Lun a Vie, 8:00 a 16:30", materiales: ["Aluminio", "Vidrio", "Plástico", "Tetra Pak"] }
];
var ENTREGAS_INICIALES = [
  { id: 1, centroId: 1, usuario: "María Rojas", material: "Plástico", kg: 4.5, fecha: "2026-11-03", estado: "Pendiente" },
  { id: 2, centroId: 1, usuario: "Luis Mora", material: "Vidrio", kg: 8, fecha: "2026-11-04", estado: "Pendiente" },
  { id: 3, centroId: 2, usuario: "Ana Solís", material: "Aluminio", kg: 2.2, fecha: "2026-11-04", estado: "Pendiente" },
  { id: 4, centroId: 3, usuario: "Carlos Vega", material: "Papel", kg: 6, fecha: "2026-11-02", estado: "Pendiente" },
  { id: 5, centroId: 4, usuario: "Sofía Araya", material: "Tetra Pak", kg: 1.5, fecha: "2026-11-05", estado: "Pendiente" }
];
var RUTAS = [
  { id: 1, nombre: "Ruta Norte", zona: "Heredia", dia: "Lunes", hora: "7:00", materiales: ["Plástico", "Aluminio"] },
  { id: 2, nombre: "Ruta Centro", zona: "San José", dia: "Martes", hora: "8:00", materiales: ["Papel", "Cartón", "Vidrio"] },
  { id: 3, nombre: "Ruta Occidente", zona: "Alajuela", dia: "Jueves", hora: "7:30", materiales: ["Papel", "Cartón", "Tetra Pak"] },
  { id: 4, nombre: "Ruta Este", zona: "Cartago", dia: "Viernes", hora: "8:30", materiales: ["Vidrio", "Plástico", "Aluminio"] }
];

/* ---------- Utilidades ---------- */
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
function getCentros() { return leerJSON(CLAVE_CENTROS, CENTROS_INICIALES); }
function getEntregas() { return leerJSON(CLAVE_ENTREGAS_CENTRO, ENTREGAS_INICIALES); }

// Evita que texto escrito por una persona se interprete como HTML.
function esc(t) {
  return String(t === null || t === undefined ? "" : t).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function idUrl() { return Number(new URLSearchParams(location.search).get("id")); }

function etiquetas(lista) {
  var html = "";
  for (var i = 0; i < lista.length; i++) { html += '<span class="etiqueta">' + esc(lista[i]) + "</span>"; }
  return html;
}
function opciones(lista, textoInicial) {
  var html = '<option value="">' + textoInicial + "</option>";
  for (var i = 0; i < lista.length; i++) { html += "<option>" + esc(lista[i]) + "</option>"; }
  return html;
}
function mostrarErrores(errores) {
  var items = "";
  for (var e = 0; e < errores.length; e++) { items += "<li>" + errores[e] + "</li>"; }
  document.getElementById("mensaje").innerHTML =
    '<div class="alert alert-danger" role="alert"><strong>Revisa estos datos:</strong><ul class="mb-0">' + items + "</ul></div>";
}
function mostrarMensaje(tipo, html) {
  document.getElementById("mensaje").innerHTML = '<div class="alert alert-' + tipo + '" role="alert">' + html + "</div>";
}
function buscarPorId(lista, id) {
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].id === id) { return lista[i]; }
  }
  return null;
}

/* ---------- Directorio de centros ---------- */
function iniciarCentros() {
  document.getElementById("zona").innerHTML = opciones(ZONAS, "Todas las zonas");
  document.getElementById("material").innerHTML = opciones(MATERIALES, "Todos los materiales");

  function pintar() {
    var q = document.getElementById("buscar").value.trim().toLowerCase();
    var z = document.getElementById("zona").value;
    var m = document.getElementById("material").value;
    var centros = getCentros();
    var html = "";
    var n = 0;

    for (var i = 0; i < centros.length; i++) {
      var c = centros[i];
      var texto = (c.nombre + " " + c.direccion).toLowerCase();
      if ((q === "" || texto.indexOf(q) !== -1) && (z === "" || c.zona === z) &&
        (m === "" || c.materiales.indexOf(m) !== -1)) {
        n++;
        html += '<div class="col-sm-6 col-lg-4"><article class="card h-100"><div class="card-body d-flex flex-column">' +
          '<h2 class="h5 card-title">' + esc(c.nombre) + "</h2>" +
          '<p class="zona mb-1">' + esc(c.zona) + "</p>" +
          '<p class="mb-2">' + esc(c.horario) + "</p>" +
          '<div class="mb-3">' + etiquetas(c.materiales) + "</div>" +
          '<a class="btn btn-primary mt-auto" href="centro-detalle.html?id=' + c.id + '">Ver detalle</a>' +
          "</div></article></div>";
      }
    }
    document.getElementById("total").textContent = n + (n === 1 ? " centro encontrado" : " centros encontrados");
    document.getElementById("lista").innerHTML = n > 0 ? html :
      '<div class="col-12"><div class="alert alert-secondary">No hay centros con esos filtros. ' +
      'Prueba quitar alguno o <a href="centro-form.html">registra un centro nuevo</a>.</div></div>';
  }

  document.getElementById("buscar").addEventListener("input", pintar);
  document.getElementById("zona").addEventListener("change", pintar);
  document.getElementById("material").addEventListener("change", pintar);
  pintar();
}

/* ---------- Detalle de un centro ---------- */
function iniciarDetalleCentro() {
  var c = buscarPorId(getCentros(), idUrl());
  var cont = document.getElementById("detalle");
  if (c === null) {
    cont.innerHTML = '<div class="alert alert-danger">No encontramos ese centro. <a href="centros.html">Volver al directorio</a>.</div>';
    return;
  }
  document.title = c.nombre + " - Reciclaje Comunitario";
  var mapa = "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(c.nombre + ", " + c.direccion + ", " + c.zona);

  cont.innerHTML =
    "<h1>" + esc(c.nombre) + '</h1><p class="zona">' + esc(c.zona) + "</p>" +
    '<div class="card card-body mb-3"><dl class="row mb-0">' +
    '<dt class="col-sm-3">Horario</dt><dd class="col-sm-9">' + esc(c.horario) + "</dd>" +
    '<dt class="col-sm-3">Ubicación</dt><dd class="col-sm-9">' + esc(c.direccion) + "</dd>" +
    '<dt class="col-sm-3">Teléfono</dt><dd class="col-sm-9">' + esc(c.telefono) + "</dd>" +
    '<dt class="col-sm-3">Materiales aceptados</dt><dd class="col-sm-9 mb-0">' + etiquetas(c.materiales) + "</dd>" +
    "</dl></div>" +
    '<a class="btn btn-primary me-2 mb-2" href="' + mapa + '" target="_blank" rel="noopener">Ver en el mapa</a>' +
    '<a class="btn btn-outline-secondary me-2 mb-2" href="centro-form.html?id=' + c.id + '">Editar centro</a>' +
    '<a class="btn btn-outline-secondary mb-2" href="centros.html">Volver al directorio</a>';
}

/* ---------- Registrar o editar un centro ---------- */
function iniciarFormCentro() {
  var centros = getCentros();
  var actual = buscarPorId(centros, idUrl());

  document.getElementById("zona").innerHTML = opciones(ZONAS, "Selecciona una zona");
  var checks = "";
  for (var i = 0; i < MATERIALES.length; i++) {
    checks += '<div class="form-check form-check-inline">' +
      '<input class="form-check-input" type="checkbox" name="materiales" id="mat' + i + '" value="' + esc(MATERIALES[i]) + '">' +
      '<label class="form-check-label" for="mat' + i + '">' + esc(MATERIALES[i]) + "</label></div>";
  }
  document.getElementById("materiales").innerHTML = checks;

  if (actual !== null) {
    document.getElementById("titulo").textContent = "Editar centro de acopio";
    var campos = ["nombre", "zona", "direccion", "telefono", "horario"];
    for (var k = 0; k < campos.length; k++) { document.getElementById(campos[k]).value = actual[campos[k]]; }
    var marcas = document.getElementsByName("materiales");
    for (var j = 0; j < marcas.length; j++) { marcas[j].checked = actual.materiales.indexOf(marcas[j].value) !== -1; }
  }

  document.getElementById("formCentro").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var nombre = document.getElementById("nombre").value.trim();
    var zona = document.getElementById("zona").value;
    var direccion = document.getElementById("direccion").value.trim();
    var telefono = document.getElementById("telefono").value.trim();
    var horario = document.getElementById("horario").value.trim();
    var materiales = [];
    var marcados = document.getElementsByName("materiales");
    for (var m = 0; m < marcados.length; m++) {
      if (marcados[m].checked) { materiales.push(marcados[m].value); }
    }
    var errores = [];

    if (nombre.length < 3) { errores.push("Escribe el nombre del centro (mínimo 3 letras)."); }
    if (zona === "") { errores.push("Selecciona la zona."); }
    if (direccion.length < 5) { errores.push("Escribe la dirección o señas del centro."); }
    if (!/^[0-9+\- ]{8,15}$/.test(telefono)) { errores.push("El teléfono debe tener entre 8 y 15 números."); }
    if (horario === "") { errores.push("Indica el horario de atención."); }
    if (materiales.length === 0) { errores.push("Marca al menos un material aceptado."); }

    if (errores.length > 0) {
      mostrarErrores(errores);
      return;
    }

    if (actual !== null) {
      actual.nombre = nombre; actual.zona = zona; actual.direccion = direccion;
      actual.telefono = telefono; actual.horario = horario; actual.materiales = materiales;
    } else {
      var maxId = 0;
      for (var x = 0; x < centros.length; x++) {
        if (centros[x].id > maxId) { maxId = centros[x].id; }
      }
      centros.push({ id: maxId + 1, nombre: nombre, zona: zona, direccion: direccion,
        telefono: telefono, horario: horario, materiales: materiales });
    }
    if (!guardarJSON(CLAVE_CENTROS, centros)) {
      mostrarErrores(["No se pudo guardar el centro en este navegador. Intenta de nuevo."]);
      return;
    }
    location.href = "centros.html";
  });
}

/* ---------- Panel del encargado ---------- */
function iniciarPanel() {
  var sel = document.getElementById("centro");
  var centros = getCentros();
  var opts = "";
  for (var i = 0; i < centros.length; i++) {
    opts += '<option value="' + centros[i].id + '">' + esc(centros[i].nombre) + "</option>";
  }
  sel.innerHTML = opts;

  function pintar() {
    var todas = getEntregas();
    var idCentro = Number(sel.value);
    var html = "";
    var total = 0;
    var pendientes = 0;

    for (var j = 0; j < todas.length; j++) {
      var e = todas[j];
      if (e.centroId === idCentro) {
        total++;
        if (e.estado === "Pendiente") { pendientes++; }
        html += "<tr><td>" + esc(e.fecha) + "</td><td>" + esc(e.usuario) + "</td><td>" + esc(e.material) +
          "</td><td>" + esc(e.kg) + " kg</td><td>" +
          (e.estado === "Pendiente"
            ? '<button type="button" class="btn btn-sm btn-primary" data-id="' + e.id + '">Confirmar entrega</button>'
            : '<span class="etiqueta etiqueta--ok">Confirmada</span>') + "</td></tr>";
      }
    }
    document.getElementById("resumen").textContent =
      pendientes + (pendientes === 1 ? " entrega por confirmar" : " entregas por confirmar");
    document.getElementById("tabla").innerHTML = total > 0 ? html :
      '<tr><td colspan="5" class="text-muted">Este centro no tiene entregas registradas.</td></tr>';
  }

  document.getElementById("tabla").addEventListener("click", function (ev) {
    var id = Number(ev.target.getAttribute("data-id"));
    if (!id) { return; }
    var todas = getEntregas();
    var e = buscarPorId(todas, id);
    if (e !== null) {
      e.estado = "Confirmada";
      guardarJSON(CLAVE_ENTREGAS_CENTRO, todas);
      mostrarMensaje("success", "Entrega de <strong>" + esc(e.usuario) + "</strong> confirmada.");
    }
    pintar();
  });
  sel.addEventListener("change", pintar);
  pintar();
}

/* ---------- Rutas de recolección ---------- */
function iniciarRutas() {
  document.getElementById("zona").innerHTML = opciones(ZONAS, "Todas las zonas");

  function pintar() {
    var z = document.getElementById("zona").value;
    var html = "";
    var n = 0;
    for (var i = 0; i < RUTAS.length; i++) {
      var r = RUTAS[i];
      if (z === "" || r.zona === z) {
        n++;
        html += "<tr><td>" + esc(r.nombre) + "</td><td>" + esc(r.zona) + "</td><td>" + esc(r.dia) +
          "</td><td>" + esc(r.hora) + "</td><td>" + etiquetas(r.materiales) + "</td></tr>";
      }
    }
    document.getElementById("tabla").innerHTML = n > 0 ? html :
      '<tr><td colspan="5" class="text-muted">No hay rutas en esa zona todavía.</td></tr>';
  }
  document.getElementById("zona").addEventListener("change", pintar);
  pintar();
}

document.addEventListener("DOMContentLoaded", function () {
  switch (document.body.id) {
    case "pagina-centros": iniciarCentros(); break;
    case "pagina-centro-detalle": iniciarDetalleCentro(); break;
    case "pagina-centro-form": iniciarFormCentro(); break;
    case "pagina-panel": iniciarPanel(); break;
    case "pagina-rutas": iniciarRutas(); break;
  }
});