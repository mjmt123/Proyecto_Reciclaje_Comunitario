var CLAVES = ["papel", "carton", "plastico", "vidrio", "aluminio", "tetrapak"];
var CENTROS = ["Centro de acopio Central", "Centro de acopio Universidad", "Centro de acopio Plaza Norte"];
var CATEGORIAS = ["comida", "papeleria", "hogar"];
var RECOMPENSAS = [
  { id: 1, icono: "☕", nombre: "Café americano gratis", comercio: "Soda La Esquina", categoria: "comida", costo: 120,
    descripcion: "Un café americano de 12 oz preparado en el momento.",
    condiciones: ["Válido por 30 días.", "Un canje por persona por visita."] },
  { id: 2, icono: "👜", nombre: "Bolsa reutilizable", comercio: "Super Mercado Comunal", categoria: "hogar", costo: 150,
    descripcion: "Bolsa de tela resistente para las compras.",
    condiciones: ["Se retira en servicio al cliente.", "Válido por 45 días."] },
  { id: 3, icono: "📓", nombre: "Libreta ecológica", comercio: "Papelería Verde", categoria: "papeleria", costo: 180,
    descripcion: "Libreta de 80 hojas de papel reciclado.",
    condiciones: ["Sujeta a disponibilidad.", "Válido por 45 días."] },
  { id: 4, icono: "🥪", nombre: "Almuerzo con 20% de descuento", comercio: "Soda La Esquina", categoria: "comida", costo: 250,
    descripcion: "Descuento del 20% en el casado o plato del día.",
    condiciones: ["Válido de lunes a viernes.", "Presentar el código al pagar."] },
  { id: 5, icono: "🖨️", nombre: "50 copias gratis", comercio: "Centro de copiado Central", categoria: "papeleria", costo: 300,
    descripcion: "50 copias en blanco y negro tamaño carta.",
    condiciones: ["Solo blanco y negro.", "Máximo un canje por semana."] },
  { id: 6, icono: "🌱", nombre: "Planta de interior pequeña", comercio: "Vivero Altos del Valle", categoria: "hogar", costo: 400,
    descripcion: "Planta en maceta de 10 cm, según el inventario del vivero.",
    condiciones: ["Se retira en el vivero.", "Válido por 60 días."] }
];

function dos(n) { return n < 10 ? "0" + n : "" + n; }
function formatoFecha(d) { return d.getFullYear() + "-" + dos(d.getMonth() + 1) + "-" + dos(d.getDate()); }
function fechaHoy() { return formatoFecha(new Date()); }
function haceDias(n) { var d = new Date(); d.setDate(d.getDate() - n); return formatoFecha(d); }
function fechaCorta(iso) { return iso.substr(8, 2) + "/" + iso.substr(5, 2) + "/" + iso.substr(0, 4); }

var entregas = [
  { fecha: haceDias(12), material: "papel", peso: 6.5, centro: CENTROS[0], puntos: 65 },
  { fecha: haceDias(7), material: "plastico", peso: 4, centro: CENTROS[1], puntos: 60 },
  { fecha: haceDias(2), material: "aluminio", peso: 3.2, centro: CENTROS[0], puntos: 80 }
];
var canjes = [
  { fecha: haceDias(1), nombre: "Bolsa reutilizable", costo: 150 }
];

function puntosPorKilo(material) {
  switch (material) {
    case "papel": return 10;
    case "carton": return 8;
    case "plastico": return 15;
    case "vidrio": return 6;
    case "aluminio": return 25;
    case "tetrapak": return 12;
    default: return 0;
  }
}
function nombreMaterial(material) {
  switch (material) {
    case "papel": return "Papel";
    case "carton": return "Cartón";
    case "plastico": return "Plástico (PET)";
    case "vidrio": return "Vidrio";
    case "aluminio": return "Aluminio";
    case "tetrapak": return "Tetra Pak";
    default: return "";
  }
}
function nombreCategoria(c) {
  switch (c) {
    case "comida": return "Comida";
    case "papeleria": return "Papelería";
    case "hogar": return "Hogar";
    default: return "";
  }
}
function igual(x) { return x; }

function totales() {
  var ganados = 0;
  var gastados = 0;
  for (var i = 0; i < entregas.length; i++) { ganados += entregas[i].puntos; }
  for (var j = 0; j < canjes.length; j++) { gastados += canjes[j].costo; }
  return { ganados: ganados, gastados: gastados, saldo: ganados - gastados };
}

function llenarSelect(id, valores, etiqueta, textoInicial) {
  var select = document.getElementById(id);
  var inicial = document.createElement("option");
  inicial.value = "";
  inicial.innerHTML = textoInicial;
  select.appendChild(inicial);
  for (var i = 0; i < valores.length; i++) {
    var op = document.createElement("option");
    op.value = valores[i];
    op.innerHTML = etiqueta(valores[i]);
    select.appendChild(op);
  }
}

function vistaPrevia() {
  var kg = parseFloat(document.getElementById("peso").value);
  var pts = isNaN(kg) ? 0 : Math.round(kg * puntosPorKilo(document.getElementById("material").value));
  document.getElementById("vistaPuntos").innerHTML = pts;
}

function iniciarRegistrar() {
  llenarSelect("material", CLAVES, nombreMaterial, "Selecciona un material");
  llenarSelect("centro", CENTROS, igual, "Selecciona un centro");
  document.getElementById("fecha").value = fechaHoy();
  document.getElementById("fecha").max = fechaHoy();

  for (var i = 0; i < CLAVES.length; i++) {
    var li = document.createElement("li");
    li.innerHTML = nombreMaterial(CLAVES[i]) + ": " + puntosPorKilo(CLAVES[i]) + " pts por kg";
    document.getElementById("tarifas").appendChild(li);
  }

  document.getElementById("material").addEventListener("change", vistaPrevia);
  document.getElementById("peso").addEventListener("input", vistaPrevia);

  document.getElementById("btnRegistrar").addEventListener("click", function () {
    var material = document.getElementById("material").value;
    var kg = parseFloat(document.getElementById("peso").value);
    var centro = document.getElementById("centro").value;
    var fecha = document.getElementById("fecha").value;
    var errores = [];

    if (material === "") { errores.push("Elige el tipo de material."); }
    if (isNaN(kg) || kg <= 0) { errores.push("Escribe un peso mayor que 0 kg."); }
    else if (kg > 500) { errores.push("El peso máximo por entrega es 500 kg."); }
    if (centro === "") { errores.push("Elige dónde entregaste el material."); }
    if (fecha === "") { errores.push("Indica la fecha de entrega."); }
    else if (fecha > fechaHoy()) { errores.push("La fecha no puede ser futura."); }
    if (!document.getElementById("confirmo").checked) { errores.push("Marca la confirmación de los datos."); }

    var mensaje = document.getElementById("mensaje");
    if (errores.length > 0) {
      var items = "";
      for (var e = 0; e < errores.length; e++) { items += "<li>" + errores[e] + "</li>"; }
      mensaje.innerHTML = '<div class="alert alert-danger" role="alert"><strong>Revisa estos datos:</strong><ul class="mb-0">' + items + "</ul></div>";
      return;
    }

    var puntos = Math.round(kg * puntosPorKilo(material));
    mensaje.innerHTML = '<div class="alert alert-success" role="alert">Entrega registrada. Sumaste <strong>' + puntos +
      "</strong> puntos.</div>";
    document.getElementById("formEntrega").reset();
    document.getElementById("fecha").value = fechaHoy();
    vistaPrevia();
  });
}

function pintarHistorial() {
  var filtro = document.getElementById("fMaterial").value;
  var html = "";
  var n = 0, kgTotal = 0, ptsTotal = 0;

  for (var i = entregas.length - 1; i >= 0; i--) {
    var e = entregas[i];
    if (filtro === "" || e.material === filtro) {
      n++;
      kgTotal += e.peso;
      ptsTotal += e.puntos;
      html += '<div class="col-12 col-md-6 col-lg-4"><article class="card"><div class="card-body">' +
        '<h3 class="card-title h5">' + nombreMaterial(e.material) + "</h3>" +
        '<p class="card-text mb-1">' + e.peso + " kg, " + fechaCorta(e.fecha) + "</p>" +
        '<p class="card-text text-muted small">' + e.centro + "</p>" +
        '<span class="pts">+' + e.puntos + " puntos</span></div></article></div>";
    }
  }
  document.getElementById("lista").innerHTML = n > 0 ? html :
    '<div class="col-12"><div class="alert alert-secondary">No hay entregas para mostrar.</div></div>';
  document.getElementById("resumen").innerHTML = n > 0 ?
    '<div class="alert alert-success">Entregas: <strong>' + n + "</strong>. Material: <strong>" + kgTotal.toFixed(2) +
    " kg</strong>. Puntos ganados: <strong>" + ptsTotal + "</strong>.</div>" : "";
}

function iniciarHistorial() {
  llenarSelect("fMaterial", CLAVES, nombreMaterial, "Todos los materiales");
  document.getElementById("fMaterial").addEventListener("change", pintarHistorial);
  pintarHistorial();
}

function iniciarPuntos() {
  var t = totales();
  document.getElementById("saldo").innerHTML = t.saldo;
  document.getElementById("ganados").innerHTML = t.ganados;
  document.getElementById("gastados").innerHTML = t.gastados;
  document.getElementById("nEntregas").innerHTML = entregas.length;

  var meta = null;
  for (var i = 0; i < RECOMPENSAS.length; i++) {
    if (RECOMPENSAS[i].costo > t.saldo && meta === null) { meta = RECOMPENSAS[i]; }
  }
  if (meta === null) {
    document.getElementById("meta").innerHTML = "<p class='mb-0'>Ya puedes canjear cualquier recompensa del catálogo.</p>";
  } else {
    document.getElementById("meta").innerHTML = "<p class='mb-0'><strong>" + meta.nombre + "</strong> cuesta " + meta.costo +
      " puntos. Te faltan <strong>" + (meta.costo - t.saldo) + "</strong>.</p><div class='progreso'><div id='barra'></div></div>";
    document.getElementById("barra").style.width = Math.round(t.saldo / meta.costo * 100) + "%";
  }

  var htmlE = "";
  var mostradas = 0;
  for (var j = entregas.length - 1; j >= 0 && mostradas < 5; j--) {
    htmlE += "<li>" + nombreMaterial(entregas[j].material) + ", " + entregas[j].peso + " kg (" + fechaCorta(entregas[j].fecha) +
      ') <span class="pts">+' + entregas[j].puntos + "</span></li>";
    mostradas++;
  }
  document.getElementById("listaEntregas").innerHTML = htmlE;

  var htmlC = "";
  for (var k = canjes.length - 1; k >= 0; k--) {
    htmlC += "<li>" + canjes[k].nombre + " (" + fechaCorta(canjes[k].fecha) + ") <span class='pts'>-" + canjes[k].costo + "</span></li>";
  }
  document.getElementById("listaCanjes").innerHTML = htmlC || "<li class='text-muted'>Todavía no has canjeado recompensas.</li>";
}

function pintarCatalogo() {
  var saldo = totales().saldo;
  var categoria = document.getElementById("fCategoria").value;
  var ascendente = document.getElementById("ordAsc").checked;
  var soloPuedo = document.getElementById("soloPuedo").checked;
  var html = "";

  for (var k = 0; k < RECOMPENSAS.length; k++) {
    var r = RECOMPENSAS[ascendente ? k : RECOMPENSAS.length - 1 - k];
    var alcanza = saldo >= r.costo;
    if ((categoria === "" || r.categoria === categoria) && (!soloPuedo || alcanza)) {
      html += '<div class="col-sm-6 col-lg-4"><article class="card h-100"><div class="card-body d-flex flex-column">' +
        '<div class="icono">' + r.icono + "</div>" +
        '<h3 class="card-title h5">' + r.nombre + "</h3>" +
        '<p class="card-text text-muted mb-1">' + r.comercio + " (" + nombreCategoria(r.categoria) + ")</p>" +
        '<p class="mb-1"><span class="pts">' + r.costo + " puntos</span></p>" +
        '<p class="small text-muted">' + (alcanza ? "Tienes puntos suficientes." : "Te faltan " + (r.costo - saldo) + " puntos.") + "</p>" +
        '<a class="btn ' + (alcanza ? "btn-warning" : "btn-outline-secondary") + ' mt-auto" href="detalle-recompensa.html?id=' + r.id + '">Ver detalle</a>' +
        "</div></article></div>";
    }
  }
  document.getElementById("rejilla").innerHTML = html ||
    '<div class="col-12"><div class="alert alert-secondary">No hay recompensas con esos filtros.</div></div>';
}

function iniciarCatalogo() {
  document.getElementById("saldo").innerHTML = totales().saldo;
  llenarSelect("fCategoria", CATEGORIAS, nombreCategoria, "Todas las categorías");
  document.getElementById("fCategoria").addEventListener("change", pintarCatalogo);
  document.getElementById("ordAsc").addEventListener("change", pintarCatalogo);
  document.getElementById("ordDesc").addEventListener("change", pintarCatalogo);
  document.getElementById("soloPuedo").addEventListener("change", pintarCatalogo);
  pintarCatalogo();
}

function iniciarDetalle() {
  var id = Number(location.search.replace("?id=", ""));
  var r = null;
  for (var i = 0; i < RECOMPENSAS.length; i++) {
    if (RECOMPENSAS[i].id === id) { r = RECOMPENSAS[i]; }
  }
  if (r === null) {
    document.getElementById("contenido").innerHTML =
      '<div class="alert alert-danger">Esa recompensa no existe. <a href="catalogo-recompensas.html">Elige una del catálogo</a>.</div>';
    return;
  }
  document.getElementById("icono").innerHTML = r.icono;
  document.getElementById("nombre").innerHTML = r.nombre;
  document.getElementById("comercio").innerHTML = r.comercio;
  document.getElementById("descripcion").innerHTML = r.descripcion;
  document.getElementById("costo").innerHTML = r.costo;
  for (var c = 0; c < r.condiciones.length; c++) {
    var li = document.createElement("li");
    li.innerHTML = r.condiciones[c];
    document.getElementById("condiciones").appendChild(li);
  }
  function actualizar() {
    var saldo = totales().saldo;
    var alcanza = saldo >= r.costo;
    document.getElementById("saldo").innerHTML = saldo;
    document.getElementById("btnCanjear").disabled = !alcanza;
    document.getElementById("faltan").innerHTML = alcanza ? "Tienes puntos suficientes para canjear." :
      "Te faltan " + (r.costo - saldo) + " puntos. Registra más entregas para llegar.";
  }
  actualizar();
  document.getElementById("btnCanjear").addEventListener("click", function () {
    document.getElementById("confirmacion").innerHTML = '<div class="alert alert-warning">' +
      "<p>Se descontarán " + r.costo + " puntos de tu saldo. ¿Confirmas el canje?</p>" +
      '<button type="button" id="si" class="btn btn-primary me-2">Sí, canjear</button>' +
      '<button type="button" id="no" class="btn btn-outline-secondary">Cancelar</button></div>';

    document.getElementById("no").addEventListener("click", function () {
      document.getElementById("confirmacion").innerHTML = "";
    });
    document.getElementById("si").addEventListener("click", function () {
      if (totales().saldo < r.costo) { actualizar(); return; }
      var letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      var codigo = "";
      do {
        codigo += letras.charAt(Math.floor(Math.random() * letras.length));
      } while (codigo.length < 6);

      canjes.push({ fecha: fechaHoy(), nombre: r.nombre, costo: r.costo });
      document.getElementById("confirmacion").innerHTML = '<div class="alert alert-success">' +
        "<strong>Canje realizado.</strong> Presenta este código en el comercio:" +
        '<p class="codigo mb-1">RC-' + codigo + "</p></div>";
      actualizar();
      document.getElementById("btnCanjear").disabled = true;
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  switch (document.body.id) {
    case "pagina-registrar": iniciarRegistrar(); break;
    case "pagina-historial": iniciarHistorial(); break;
    case "pagina-puntos": iniciarPuntos(); break;
    case "pagina-catalogo": iniciarCatalogo(); break;
    case "pagina-detalle": iniciarDetalle(); break;
  }
});
