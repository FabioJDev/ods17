import type { Rol } from '../types';

const PERMISOS: Record<string, Rol[]> = {
  crear:    ['Administrador', 'Analista'],
  editar:   ['Administrador', 'Analista'],
  exportar: ['Administrador', 'Analista'],
  eliminar: ['Administrador'],
};

export function tienePermiso(rol: Rol | undefined, accion: keyof typeof PERMISOS): boolean {
  if (!rol) return false;
  return PERMISOS[accion]?.includes(rol) ?? false;
}

export function esAdmin(rol: Rol | undefined): boolean {
  return rol === 'Administrador';
}

export function esAnalista(rol: Rol | undefined): boolean {
  return rol === 'Analista';
}

export function esObservador(rol: Rol | undefined): boolean {
  return rol === 'Observador';
}
