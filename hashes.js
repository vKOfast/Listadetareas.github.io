// Declarar hash vacío
const registro = {};

// Utilidades
function generarClaveUnica() {
  return `reg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function validarCampos(nombre, edad, correo) {
  if (!nombre || !edad || !correo) return { ok: false, msg: "Todos los campos son obligatorios." };
  // Edad debe ser un número entero no negativo
  const nEdad = Number(edad);
  if (!Number.isInteger(nEdad) || nEdad < 0) return { ok: false, msg: "La edad debe ser un número entero mayor o igual a 0." };
  return { ok: true };
}

function renderTabla() {
  const cont = document.getElementById("tabla-contenedor");
  const entries = Object.entries(registro);

  if (entries.length === 0) {
    cont.innerHTML = '<div style="padding:14px;color:#94a3b8">Sin registros por el momento…</div>';
    return;
  }

  let html = '';
  html += '<table>';
  html += '<thead><tr><th>Clave</th><th>Nombre</th><th>Edad</th><th>Correo Electrónico</th></tr></thead>';
  html += '<tbody>';
  for (const [clave, dato] of entries) {
    const safeNombre = escapeHtml(dato.nombre);
    const safeCorreo = escapeHtml(dato.correo);
    html += `<tr><td>${clave}</td><td>${safeNombre}</td><td>${dato.edad}</td><td>${safeCorreo}</td></tr>`;
  }
  html += '</tbody></table>';
  cont.innerHTML = html;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Eventos
window.addEventListener("DOMContentLoaded", () => {
  const f = document.getElementById("form-registro");
  const nombre = document.getElementById("nombre");
  const edad = document.getElementById("edad");
  const correo = document.getElementById("correo");
  const errorMsg = document.getElementById("error-msg");
  const btnRegistrar = document.getElementById("btn-registrar");
  const btnEliminar = document.getElementById("btn-eliminar");

  // Inicializar la tabla
  renderTabla();

  btnRegistrar.addEventListener("click", () => {
    const nom = nombre.value.trim();
    const ed = edad.value.trim();
    const mail = correo.value.trim();

    const valid = validarCampos(nom, ed, mail);
    if (!valid.ok) {
      errorMsg.textContent = valid.msg;
      errorMsg.style.display = "block";
      return;
    }

    errorMsg.style.display = "none";

    const clave = generarClaveUnica();
    registro[clave] = { nombre: nom, edad: Number(ed), correo: mail };
    renderTabla();

    // Limpiar formulario y notificar
    f.reset();
    nombre.focus();
    alert(`Registro agregado con clave: ${clave}`);
  });

  btnEliminar.addEventListener("click", () => {
    const clave = prompt("Ingresa la clave del registro a eliminar:");
    if (clave === null) return; // cancelado
    const key = clave.trim();
    if (!key) {
      alert("Debes ingresar una clave válida.");
      return;
    }

    if (Object.prototype.hasOwnProperty.call(registro, key)) {
      delete registro[key];
      renderTabla();
      alert("Registro eliminado correctamente.");
    } else {
      alert("No existe un registro con esa clave.");
    }
  });
});
