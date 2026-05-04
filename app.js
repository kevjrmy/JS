import { getTareas, agregarTarea, toggleTarea, eliminarTarea, limpiarTareas } from './tareas.js'

const formulario    = document.getElementById('formulario')
const inputTarea    = document.getElementById('input-tarea')
const listaTareas   = document.getElementById('lista-tareas')
const contador      = document.getElementById('contador')
const btnLimpiar    = document.getElementById('btn-limpiar')
const botonesFiltro = document.querySelectorAll('.filtro')

let filtroActivo = 'todas'

// =============================================
// Eventos
// =============================================

formulario.addEventListener('submit', (e) => {
  e.preventDefault()
  const ok = agregarTarea(inputTarea.value)
  if (!ok) {
    alert('Por favor, ingresa un texto válido.')
    return
  }
  inputTarea.value = ''
  inputTarea.focus()
  renderizarLista()
})

btnLimpiar.addEventListener('click', () => {
  limpiarTareas()
  renderizarLista()
})

botonesFiltro.forEach(boton => {
  boton.addEventListener('click', () => {
    filtroActivo = boton.dataset.filtro
    botonesFiltro.forEach(b => b.classList.remove('activo'))
    boton.classList.add('activo')
    renderizarLista()
  })
})

// =============================================
// Renderizado
// =============================================

function renderizarLista() {
  listaTareas.innerHTML = ''

  const tareasFiltradas = getTareas().filter(tarea => {
    if (filtroActivo === 'completadas') return tarea.completada
    return true
  })

  tareasFiltradas.forEach(tarea => renderizarTarea(tarea))
  actualizarContador()
}

function renderizarTarea(tarea) {
  const li = document.createElement('li')
  li.className  = 'tarea'
  li.dataset.id = tarea.id

  if (tarea.completada) li.classList.add('completada')

  const checkbox = document.createElement('input')
  checkbox.type      = 'checkbox'
  checkbox.checked   = tarea.completada
  checkbox.className = 'tarea-checkbox'
  checkbox.setAttribute('aria-label', `Marcar como completada: ${tarea.texto}`)
  checkbox.addEventListener('change', () => {
    toggleTarea(tarea.id)
    renderizarLista()
  })

  const span = document.createElement('span')
  span.className   = 'tarea-texto'
  span.textContent = tarea.texto

  const btnEliminar = document.createElement('button')
  btnEliminar.className   = 'btn-eliminar'
  btnEliminar.textContent = '×'
  btnEliminar.setAttribute('aria-label', `Eliminar tarea: ${tarea.texto}`)
  btnEliminar.addEventListener('click', () => {
    eliminarTarea(tarea.id)
    renderizarLista()
  })

  li.appendChild(checkbox)
  li.appendChild(span)
  li.appendChild(btnEliminar)
  listaTareas.appendChild(li)
}

function actualizarContador() {
  const pendientes = getTareas().filter(t => !t.completada).length
  contador.textContent = pendientes === 1
    ? '1 tarea pendiente'
    : `${pendientes} tareas pendientes`
}

// =============================================
// Inicio
// =============================================
renderizarLista()