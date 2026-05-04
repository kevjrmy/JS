import { cargarTareas, guardarTareas } from './storage.js'

// Estado privado del módulo — nada externo puede mutarlo directamente
let tareas = cargarTareas()

// Devuelve una copia del array usando el operador spread, para evitar mutaciones externas
export function getTareas() {
  return [...tareas]
}

export function agregarTarea(texto) {
  if (!texto.trim()) return false

  const tarea = {
    id:         Date.now(),
    texto:      texto.trim(),
    completada: false,
  }

  tareas.push(tarea)
  guardarTareas(tareas)
  return true
}

export function toggleTarea(id) {
  const tarea = tareas.find(t => t.id === id)
  if (!tarea) return

  tarea.completada = !tarea.completada
  guardarTareas(tareas)
}

export function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id !== id)
  guardarTareas(tareas)
}

export function limpiarTareas() {
  tareas = []
  guardarTareas(tareas)
}