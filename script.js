/**
 * Referencias al DOM
 */
const formulario  = document.getElementById('formulario')
const inputTarea  = document.getElementById('input-tarea')
const listaTareas = document.getElementById('lista-tareas')
const contador    = document.getElementById('contador')
const btnLimpiar  = document.getElementById('btn-limpiar')
const botonesFiltro = document.querySelectorAll('.filtro') // todos los botones de filtro

// fuente de verdad — el array manda, el DOM es solo la representación visual
let tareas = cargarTareas()

// filtro activo: 'todas' | 'completadas'
// es otra pieza de estado, igual que `tareas`
let filtroActivo = 'todas'

/* Evento de envío del formulario */
formulario.addEventListener('submit', (e) => {
  e.preventDefault()
  agregarTarea(inputTarea.value)
  inputTarea.value = ''
  inputTarea.focus()
})

/* Evento del botón limpiar */
btnLimpiar.addEventListener('click', limpiarTareas)

/* Eventos de los botones de filtro */
botonesFiltro.forEach(boton => {
  boton.addEventListener('click', () => {
    // leemos el filtro del atributo data-filtro del botón pulsado
    filtroActivo = boton.dataset.filtro
    
    // actualizamos la clase 'activo' visualmente
    botonesFiltro.forEach(b => b.classList.remove('activo'))
    boton.classList.add('activo')

    // re-renderizamos la lista con el nuevo filtro
    renderizarLista()
  })
})

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

  const tarea = {
    id:         Date.now(), // id único basado en la fecha, suficiente para este proyecto
    texto:      texto.trim(),
    completada: false,      // nueva propiedad: todas las tareas nacen pendientes
  }

  tareas.push(tarea)
  guardarTareas()
  renderizarLista() // re-pintamos toda la lista (así respeta el filtro activo)
}

/* Togglea el estado completada de una tarea por su id */
function toggleTarea(id) {
  // encontramos la tarea en el array y le damos la vuelta a su estado
  const tarea = tareas.find(t => t.id === id)
  tarea.completada = !tarea.completada

  guardarTareas()
  renderizarLista() // re-pintamos para que el filtro se aplique al instante
}

/* Elimina una tarea del array por su id */
function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id !== id)
  guardarTareas()
  renderizarLista()
}

/* Elimina todos las tareas del array, persiste y limpia el DOM */
function limpiarTareas() {
  tareas = []
  guardarTareas()
  renderizarLista()
}

// =============================================
// Renderizado
// =============================================

/*
 * Función principal de renderizado — declarativa.
 *
 * En lugar de añadir o quitar <li> uno a uno (imperativo),
 * esta función borra todo y repinta desde cero con el estado actual.
 * Esto simplifica mucho la lógica: cualquier cambio (añadir, completar,
 * eliminar, filtrar) llama a esta misma función y el resultado es siempre correcto.
 */
function renderizarLista() {
  // 1. Limpiamos el DOM
  listaTareas.innerHTML = ''

  // 2. Filtramos el array según el filtro activo
  const tareasFiltradas = tareas.filter(tarea => {
    if (filtroActivo === 'completadas') return tarea.completada
    return true // 'todas' muestra todo
  })

  // 3. Pintamos solo las que pasan el filtro
  tareasFiltradas.forEach(tarea => renderizarTarea(tarea))

  // 4. Actualizamos el contador
  actualizarContador()
}

/* Crea el elemento <li> con sus hijos y lo añade a la lista */
function renderizarTarea(tarea) {
  const li = document.createElement('li')
  li.className  = 'tarea'
  li.dataset.id = tarea.id

  // si la tarea está completada añadimos la clase que la estilos diferente
  if (tarea.completada) li.classList.add('completada')

  // --- Checkbox ---
  const checkbox = document.createElement('input')
  checkbox.type    = 'checkbox'
  checkbox.checked = tarea.completada
  checkbox.className = 'tarea-checkbox'
  checkbox.setAttribute('aria-label', `Marcar como completada: ${tarea.texto}`)

  checkbox.addEventListener('change', () => toggleTarea(tarea.id))

  // --- Texto ---
  const span = document.createElement('span')
  span.className   = 'tarea-texto'
  span.textContent = tarea.texto

  // --- Botón eliminar ---
  const btnEliminar = document.createElement('button')
  btnEliminar.className   = 'btn-eliminar'
  btnEliminar.textContent = '×'
  btnEliminar.setAttribute('aria-label', `Eliminar tarea: ${tarea.texto}`)

  btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id))

  li.appendChild(checkbox)
  li.appendChild(span)
  li.appendChild(btnEliminar)
  listaTareas.appendChild(li)
  actualizarContador() // <- después de añadir la tarea, actualizamos el contador
}

/*
 * Cuenta las tareas pendientes del array (no los <li> visibles).
 * Así el contador es siempre fiel a la realidad,
 * independientemente del filtro que esté activo.
 */
function actualizarContador() {
  const pendientes = tareas.filter(t => !t.completada).length

  contador.textContent = pendientes === 1
    ? '1 tarea pendiente'
    : `${pendientes} tareas pendientes`
}

// =============================================
// Inicio — cargar tareas guardadas al arrancar
// =============================================
renderizarLista()