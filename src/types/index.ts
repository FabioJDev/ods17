export type TipoFuente = 'Gobierno' | 'ONG' | 'Empresa' | 'Organismo Internacional';
export type EstadoFuente = 'Activo' | 'Inactivo';
export type TipoAyuda = 'Donación' | 'Préstamo' | 'Inversión';
export type EstadoRecurso = 'Disponible' | 'Asignado' | 'En proceso';
export type Sector = 'Salud' | 'Educación' | 'Infraestructura' | 'Tecnología' | 'Agricultura';
export type IndiceDesarrollo = 'bajo' | 'medio' | 'alto';
export type Rol = 'Administrador' | 'Analista' | 'Observador';

export interface Fuente {
  id: string;
  nombre: string;
  tipo: TipoFuente;
  paisOrigen: string;
  totalAportado: number;
  estado: EstadoFuente;
  contacto: string;
  descripcion: string;
  fechaRegistro: string;
}

export interface Recurso {
  id: string;
  monto: number;
  fuenteId: string;
  paisDestinoId: string;
  tipoAyuda: TipoAyuda;
  sector: Sector;
  estado: EstadoRecurso;
  fechaDesembolso: string;
  descripcion: string;
  impactoEstimado: string;
}

export interface Pais {
  id: string;
  nombre: string;
  bandera: string;
  region: string;
  poblacion: number;
  indiceDesarrollo: IndiceDesarrollo;
  totalRecibido: number;
  totalDisponible: number;
  totalAsignado: number;
  descripcion: string;
}

export interface Usuario {
  nombre: string;
  email: string;
  rol: Rol;
}

export interface Toast {
  id: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  mensaje: string;
}
