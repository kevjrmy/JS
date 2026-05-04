/**
 * Referencias al DOM
 */
const formulario  = document.getElementById('formulario')
const inputTarea  = document.getElementById('input-tarea')
const listaTareas = document.getElementById('lista-tareas')
const contador    = document.getElementById('contador')
const btnLimpiar  = document.getElementById('btn-limpiar')

// fuente de verdad — el array manda, el DOM es solo la representación visual
let tareas = cargarTareas()

/* Evento de envío del formulario */
formulario.addEventListener('submit', (e) => {
  e.preventDefault()
  agregarTarea(inputTarea.value)
  inputTarea.value = ''
  inputTarea.focus()
})

/* Evento del botón limpiar */
btnLimpiar.addEventListener('click', limpiarTareas)

// =============================================
// Persistencia
// =============================================

/* Lee las tareas guardadas en localStorage, o devuelve un array vacío */
function cargarTareas() {
  const guardadas = localStorage.getItem('tareas') // devuelve un string o null
  return guardadas ? JSON.parse(guardadas) : []    // JSON.parse convierte string → array
}

/* Guarda el array de tareas en localStorage */
function guardarTareas() {
  localStorage.setItem('tareas', JSON.stringify(tareas)) // JSON.stringify convierte array → string
}

// =============================================
// Lógica
// =============================================

/* Agrega una nueva tarea al array, la persiste y actualiza la vista */
function agregarTarea(texto) {
  if (!texto.trim()) {
    alert('Por favor, ingresa un texto válido.')
    return
  }

  // la tarea ahora es un objeto, preparado para tener más propiedades después (ej: completada)
  const tarea = {
    id:    Date.now(), // id único basado en la fecha, suficiente para este proyecto
    texto: texto.trim(),
  }

  tareas.push(tarea)  // añadir al array
  guardarTareas()     // persistir
  renderizarTarea(tarea) // pasar el objeto, no solo el texto
}

/* Elimina todos las tareas del array, persiste y limpia el DOM */
function limpiarTareas() {
  tareas = []
  guardarTareas()
  listaTareas.innerHTML = ''
  actualizarContador()
}

// =============================================
// Renderizado
// =============================================

/* Crea el elemento <li> con sus hijos y lo añade a la lista */
function renderizarTarea(tarea) { // ahora recibe un objeto
  const li = document.createElement('li')
  li.className    = 'tarea'
  li.dataset.id   = tarea.id // guardamos el id en el DOM para poder identificar la tarea

  const span = document.createElement('span')
  span.className   = 'tarea-texto'
  span.textContent = tarea.texto // leemos el texto del objeto

  const btnEliminar = document.createElement('button')
  btnEliminar.className   = 'btn-eliminar'
  btnEliminar.textContent = '×'

  btnEliminar.addEventListener('click', () => {
    tareas = tareas.filter(t => t.id !== tarea.id) // eliminar del array por id
    guardarTareas()
    li.remove()
    actualizarContador()
  })

  li.appendChild(span)
  li.appendChild(btnEliminar)
  listaTareas.appendChild(li)
  actualizarContador() // <- después de añadir la tarea, actualizamos el contador
}

/* Lee cuántos <li> hay en la lista y actualiza el texto del contador */
function actualizarContador() {
  const total = listaTareas.querySelectorAll('li').length

  contador.textContent = total === 1
    ? '1 tarea pendiente'
    : `${total} tareas pendientes`
}

// =============================================
// Inicio — cargar tareas guardadas al arrancar
// =============================================
tareas.forEach(tarea => renderizarTarea(tarea)) // renderizar lo que había guardado
actualizarContador()