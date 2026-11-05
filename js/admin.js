
var ROLES = ["usuario", "encargado", "administrador"];
var ZONAS = ["San José Centro", "Escazú", "Desamparados"];
var CENTROS_TOTAL = 3;

function dos(n) { return n < 10 ? "0" + n : "" + n; }
function formatoFecha(d) { return d.getFullYear() + "-" + dos(d.getMonth() + 1) + "-" + dos(d.getDate()); }
function fechaHoy() { return formatoFecha(new Date()); }
function haceDias(n) { var d = new Date(); d.setDate(d.getDate() - n); return formatoFecha(d); }
function fechaCorta(iso) { return iso.substr(8, 2) + "/" + iso.substr(5, 2) + "/" + iso.substr(0, 4); }
function nombreRol(rol) {
  switch (rol) {
    case "usuario": return "Usuario";
    case "encargado": return "Encargado de centro";
    case "administrador": return "Administrador";
    default: return "";
  }
}

var usuarios = [
  { nombre: "Ana Mora", correo: "ana.mora@ejemplo.com", rol: "administrador", activo: true },
  { nombre: "Luis Vargas", correo: "luis.vargas@ejemplo.com", rol: "encargado", activo: true },
  { nombre: "Marta Rojas", correo: "marta.rojas@ejemplo.com", rol: "usuario", activo: true },
  { nombre: "Carlos Pérez", correo: "carlos.perez@ejemplo.com", rol: "usuario", activo: false },
  { nombre: "Sofía Jiménez", correo: "sofia.jimenez@ejemplo.com", rol: "usuario", activo: true },
  { nombre: "Diego Castro", correo: "diego.castro@ejemplo.com", rol: "encargado", activo: false }
];
var materiales = [
  { nombre: "Papel", puntos: 10 }, { nombre: "Cartón", puntos: 8 }, { nombre: "Plástico (PET)", puntos: 15 },
  { nombre: "Vidrio", puntos: 6 }, { nombre: "Aluminio", puntos: 25 }, { nombre: "Tetra Pak", puntos: 12 }
];
var comercios = ["Soda La Esquina", "Papelería Verde", "Super Mercado Comunal", "Vivero Altos del Valle"];
var recompensas = [
  { nombre: "Café americano gratis", comercio: "Soda La Esquina", costo: 120 },
  { nombre: "Bolsa reutilizable", comercio: "Super Mercado Comunal", costo: 150 },
  { nombre: "Libreta ecológica", comercio: "Papelería Verde", costo: 180 },
  { nombre: "Planta de interior pequeña", comercio: "Vivero Altos del Valle", costo: 400 }
];
var entregas = [
  { fecha: haceDias(40), zona: "Escazú", material: "Vidrio", kg: 8 },
  { fecha: haceDias(33), zona: "San José Centro", material: "Papel", kg: 12.5 },
  { fecha: haceDias(21), zona: "Desamparados", material: "Plástico (PET)", kg: 6 },
  { fecha: haceDias(14), zona: "Escazú", material: "Aluminio", kg: 3.5 },
  { fecha: haceDias(10), zona: "San José Centro", material: "Cartón", kg: 15 },
  { fecha: haceDias(6), zona: "Desamparados", material: "Papel", kg: 9 },
  { fecha: haceDias(4), zona: "San José Centro", material: "Plástico (PET)", kg: 7.5 },
  { fecha: haceDias(3), zona: "Escazú", material: "Tetra Pak", kg: 4 },
  { fecha: haceDias(1), zona: "Desamparados", material: "Aluminio", kg: 2.8 },
  { fecha: haceDias(0), zona: "San José Centro", material: "Vidrio", kg: 10 }
];

function llenarSelect(id, valores, etiqueta, textoInicial) {
  var select = document.getElementById(id);
  select.innerHTML = "";
  if (textoInicial !== "") {
    var inicial = document.createElement("option");
    inicial.value = "";
    inicial.innerHTML = textoInicial;
    select.appendChild(inicial);
  }
  for (var i = 0; i < valores.length; i++) {
    var op = document.createElement("option");
    op.value = valores[i];
    op.innerHTML = etiqueta(valores[i]);
    select.appendChild(op);
  }
}
function igual(x) { return x; }

function iniciarDashboard() {
  var activos = 0;
  var kgMes = 0;
  var mes = fechaHoy().substr(0, 7);
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].activo) { activos++; }
  }
  for (var j = 0; j < entregas.length; j++) {
    if (entregas[j].fecha.substr(0, 7) === mes) { kgMes += entregas[j].kg; }
  }
  document.getElementById("usuariosActivos").innerHTML = activos;
  document.getElementById("kgMes").innerHTML = kgMes.toFixed(1);
  document.getElementById("centros").innerHTML = CENTROS_TOTAL;

  var html = "";
  for (var k = entregas.length - 1; k >= entregas.length - 5; k--) {
    html += "<li><span>" + entregas[k].material + ", " + entregas[k].kg + " kg (" + entregas[k].zona + ")</span><span>" +
      fechaCorta(entregas[k].fecha) + "</span></li>";
  }
  document.getElementById("recientes").innerHTML = html;
}

function iniciarUsuarios() {
  var html = "";
  for (var i = 0; i < usuarios.length; i++) {
    var opciones = "";
    for (var r = 0; r < ROLES.length; r++) {
      opciones += '<option value="' + ROLES[r] + '"' + (usuarios[i].rol === ROLES[r] ? " selected" : "") + ">" + nombreRol(ROLES[r]) + "</option>";
    }
    html += '<div class="col-md-6"><article class="card"><div class="card-body">' +
      '<h3 class="card-title h5">' + usuarios[i].nombre + "</h3>" +
      '<p class="text-muted small mb-2">' + usuarios[i].correo + "</p>" +
      '<label class="form-label" for="rol-' + i + '">Rol</label>' +
      '<select id="rol-' + i + '" class="form-select mb-3">' + opciones + "</select>" +
      '<div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" id="act-' + i + '"' +
      (usuarios[i].activo ? " checked" : "") + '><label class="form-check-label" for="act-' + i + '">Cuenta activa</label></div>' +
      "</div></article></div>";
  }
  document.getElementById("listaUsuarios").innerHTML = html;

  for (let u = 0; u < usuarios.length; u++) {
    document.getElementById("rol-" + u).addEventListener("change", function () {
      usuarios[u].rol = document.getElementById("rol-" + u).value;
      mostrarAlerta("mensaje", "success", usuarios[u].nombre + " ahora tiene el rol de " + nombreRol(usuarios[u].rol) + ".");
    });
    document.getElementById("act-" + u).addEventListener("change", function () {
      usuarios[u].activo = document.getElementById("act-" + u).checked;
      mostrarAlerta("mensaje", "success", "La cuenta de " + usuarios[u].nombre + (usuarios[u].activo ? " fue activada." : " fue desactivada."));
    });
  }
}

function pintarMateriales() {
  var ul = document.getElementById("listaMateriales");
  ul.innerHTML = "";
  for (let i = 0; i < materiales.length; i++) {
    var li = document.createElement("li");
    li.innerHTML = '<span>' + materiales[i].nombre + ' <span class="pts">' + materiales[i].puntos + " pts por kg</span></span>" +
      '<button type="button" id="delMat-' + i + '" class="btn btn-outline-danger btn-sm">Eliminar</button>';
    ul.appendChild(li);
    document.getElementById("delMat-" + i).addEventListener("click", function () {
      var nombre = materiales[i].nombre;
      materiales.splice(i, 1);
      pintarMateriales();
      mostrarAlerta("mensaje", "success", "Se eliminó " + nombre + " del catálogo.");
    });
  }
}

function iniciarMateriales() {
  pintarMateriales();
  document.getElementById("btnAgregarMat").addEventListener("click", function () {
    var nombre = document.getElementById("nombreMat").value;
    var puntos = document.getElementById("puntosMat").value;
    var errores = [validarTexto(nombre, "el nombre", 3), validarNumero(puntos, "puntos por kg", 1, 1000)];
    for (var i = 0; i < materiales.length; i++) {
      if (materiales[i].nombre.toLowerCase() === nombre.trim().toLowerCase()) { errores.push("Ese material ya existe en el catálogo."); }
    }
    if (!mostrarErrores("mensaje", errores)) { return; }

    materiales.push({ nombre: limpiarTexto(nombre.trim()), puntos: parseFloat(puntos) });
    pintarMateriales();
    mostrarAlerta("mensaje", "success", "Material agregado: " + limpiarTexto(nombre.trim()) + ", " + puntos + " puntos por kg.");
    document.getElementById("nombreMat").value = "";
    document.getElementById("puntosMat").value = "";
  });
}

function pintarComercios() {
  var ul = document.getElementById("listaComercios");
  ul.innerHTML = "";
  for (var i = 0; i < comercios.length; i++) {
    var li = document.createElement("li");
    li.innerHTML = "<span>" + comercios[i] + "</span>";
    ul.appendChild(li);
  }
  llenarSelect("comercioRec", comercios, igual, "Selecciona un comercio");
}

function pintarRecompensas() {
  var html = "";
  for (var i = 0; i < recompensas.length; i++) {
    html += '<div class="col-sm-6 col-lg-4"><article class="card h-100"><div class="card-body d-flex flex-column">' +
      '<h3 class="card-title h5">' + recompensas[i].nombre + "</h3>" +
      '<p class="card-text text-muted mb-1">' + recompensas[i].comercio + "</p>" +
      '<p class="mb-3"><span class="pts">' + recompensas[i].costo + " puntos</span></p>" +
      '<button type="button" id="delRec-' + i + '" class="btn btn-outline-danger btn-sm mt-auto">Eliminar</button></div></article></div>';
  }
  document.getElementById("rejillaRec").innerHTML = html;
  for (let j = 0; j < recompensas.length; j++) {
    document.getElementById("delRec-" + j).addEventListener("click", function () {
      var nombre = recompensas[j].nombre;
      recompensas.splice(j, 1);
      pintarRecompensas();
      mostrarAlerta("mensaje", "success", "Se eliminó la recompensa " + nombre + ".");
    });
  }
}

function iniciarRecompensas() {
  pintarComercios();
  pintarRecompensas();

  document.getElementById("btnAgregarComercio").addEventListener("click", function () {
    var nombre = document.getElementById("nombreComercio").value;
    var errores = [validarTexto(nombre, "el nombre del comercio", 3)];
    for (var i = 0; i < comercios.length; i++) {
      if (comercios[i].toLowerCase() === nombre.trim().toLowerCase()) { errores.push("Ese comercio ya está registrado."); }
    }
    if (!mostrarErrores("mensaje", errores)) { return; }
    comercios.push(limpiarTexto(nombre.trim()));
    pintarComercios();
    mostrarAlerta("mensaje", "success", "Comercio agregado: " + limpiarTexto(nombre.trim()) + ".");
    document.getElementById("nombreComercio").value = "";
  });

  document.getElementById("btnAgregarRec").addEventListener("click", function () {
    var nombre = document.getElementById("nombreRec").value;
    var comercio = document.getElementById("comercioRec").value;
    var costo = document.getElementById("costoRec").value;
    var errores = [validarTexto(nombre, "el nombre de la recompensa", 3), validarSeleccion(comercio, "un comercio aliado"),
      validarNumero(costo, "el costo en puntos", 1, 10000)];
    if (!mostrarErrores("mensaje", errores)) { return; }
    recompensas.push({ nombre: limpiarTexto(nombre.trim()), comercio: comercio, costo: parseFloat(costo) });
    pintarRecompensas();
    mostrarAlerta("mensaje", "success", "Recompensa agregada: " + limpiarTexto(nombre.trim()) + ".");
    document.getElementById("nombreRec").value = "";
    document.getElementById("costoRec").value = "";
    document.getElementById("comercioRec").value = "";
  });
}

function pasaFiltro(e, desde, hasta, zona, material) {
  return (desde === "" || e.fecha >= desde) && (hasta === "" || e.fecha <= hasta) &&
    (zona === "" || e.zona === zona) && (material === "" || e.material === material);
}

function iniciarReportes() {
  llenarSelect("zona", ZONAS, igual, "Todas las zonas");
  var nombres = [];
  for (var m = 0; m < materiales.length; m++) { nombres.push(materiales[m].nombre); }
  llenarSelect("material", nombres, igual, "Todos los materiales");

  document.getElementById("btnGenerar").addEventListener("click", function () {
    var desde = document.getElementById("desde").value;
    var hasta = document.getElementById("hasta").value;
    var zona = document.getElementById("zona").value;
    var material = document.getElementById("material").value;
    var errores = [];
    if (desde !== "" && hasta !== "" && desde > hasta) { errores.push("La fecha inicial no puede ser mayor que la final."); }
    if (!mostrarErrores("mensaje", errores)) { return; }

    var total = 0;
    var cantidad = 0;
    for (var i = 0; i < entregas.length; i++) {
      if (pasaFiltro(entregas[i], desde, hasta, zona, material)) { cantidad++; total += entregas[i].kg; }
    }
    if (cantidad === 0) {
      document.getElementById("resultado").innerHTML = '<div class="alert alert-secondary">No hay entregas con esos filtros.</div>';
      return;
    }

    var detalle = "";
    for (var j = 0; j < nombres.length; j++) {
      var suma = 0;
      for (var k = 0; k < entregas.length; k++) {
        if (entregas[k].material === nombres[j] && pasaFiltro(entregas[k], desde, hasta, zona, material)) { suma += entregas[k].kg; }
      }
      if (suma > 0) { detalle += "<li><span>" + nombres[j] + '</span><span class="pts">' + suma.toFixed(1) + " kg</span></li>"; }
    }
    document.getElementById("resultado").innerHTML =
      '<div class="alert alert-success">Entregas: <strong>' + cantidad + "</strong>. Material total: <strong>" + total.toFixed(1) + " kg</strong>.</div>" +
      '<div class="card card-body"><h2 class="h5">Kilogramos por material</h2><ul class="lista-simple">' + detalle + "</ul></div>";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var pagina = document.body.id.replace("admin-", "");
  if (!verificarAcceso(pagina)) { return; }
  switch (pagina) {
    case "dashboard": iniciarDashboard(); break;
    case "usuarios": iniciarUsuarios(); break;
    case "materiales": iniciarMateriales(); break;
    case "recompensas": iniciarRecompensas(); break;
    case "reportes": iniciarReportes(); break;
  }
});
