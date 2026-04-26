/**
 * Referencias al DOM
 */
const formulario = document.getElementById('formulario')
const inputTarea = document.getElementById('input-tarea')
const listaTareas = document.getElementById('lista-tareas')

/* Evento de envío del formulario */
formulario.addEventListener('submit', (e) => {
  e.preventDefault()
  agregarTarea(inputTarea.value)
  inputTarea.value = ''
  inputTarea.focus()
})

/* Agrega una nueva tarea y actualiza la vista */
function agregarTarea(texto) {
  if (!texto.trim()) {
    alert('Por favor, ingresa un texto válido.')
    return
  }

  renderizarTarea(texto)
}

/* Crea el elemento <li> y lo añade a la lista */
function renderizarTarea(texto) {
  const li = document.createElement('li')
  li.className = 'tarea'
  li.textContent = texto

  listaTareas.appendChild(li)
}