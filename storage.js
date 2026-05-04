const CLAVE = 'tareas'

export function cargarTareas() {
  const guardadas = localStorage.getItem(CLAVE)
  return guardadas ? JSON.parse(guardadas) : []
}

export function guardarTareas(tareas) {
  localStorage.setItem(CLAVE, JSON.stringify(tareas))
}