import type { Expense } from './expense'
import type { Usuario } from './usuario'

// ---------- Creación de grupo
export interface UsuarioDTO {
  id: number
  nombre: string
}

export interface GrupoDTO {
  id: number
  nombre: string
  descripcion: string
  imagen: string
  fechaCreacion: string
  integrantes: UsuarioDTO[]
}

export interface GrupoCreacionDTO {
  nombre: string
  descripcion: string
  imagenUrl: string
  integrantesIds: number[]
}

export interface GrupoNombreIdDTO {
  id: number
  nombre: string
}


export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}

export class Grupo {
  id: number | null = null
  nombre: string
  descripcion: string
  imagen: string
  fechaCreacion: Date
  integrantes: Usuario[] = []

  constructor({
    nombre = 'Grupo',
    descripcion = '',
    imagen = '',
    fechaCreacion = new Date(),
  }: {
    nombre?: string
    descripcion?: string
    imagen?: string
    fechaCreacion?: Date
  } = {}) {
    this.nombre = nombre
    this.descripcion = descripcion
    this.imagen = imagen
    this.fechaCreacion = fechaCreacion
  }

  agregarIntegrante(nuevo: Usuario): void {
    this.integrantes.push(nuevo)
  }

  registrarGasto(_gasto: Expense): void {
    // TODO
  }

  static fromNombreIdJSON(json: GrupoNombreIdDTO): Grupo {
    const grupo = new Grupo()
    grupo.id = json.id
    grupo.nombre = json.nombre
    return grupo
  }
}

// --------------------------- Types para groupDetail (detalle y gastos)
export type GrupoDetalleDTO = {
  id: number
  nombre: string
  descripcion: string
  imagenUrl: string
  cantidadIntegrantes: number
}

export type GrupoGastoItemDTO = {
  id: number
  day: number
  title: string
  amount: number
  currency: string
  paymentType: string
  imageUrl: string
}

export type GrupoGastosPorMesDTO = {
  month: string
  expenses: GrupoGastoItemDTO[]
}

export type GrupoGastosPorAnioDTO = {
  year: number
  months: GrupoGastosPorMesDTO[]
}

export type GroupDetailPageResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}

// --------------------------- Types para groups (listado de grupos)
export type GrupoCardDTO = {
  id: number
  nombre: string
  imagenUrl: string
  estadoGrupo: string
}

// --------------------------- Types para settings
export type GrupoSettingsDTO = {
  id: number
  nombre: string
  descripcion: string
  imagenUrl: string
  moneda: string
  simplificarDeudas: boolean
  notificaciones: boolean
  modoRata: boolean
}

export type GrupoContextoUsuarioDTO = {
  usuarioId: number,
  esAdmin: boolean
  tieneDeudas: boolean
}

export type Miembro = {
  id: number;
  nombre: string;
  username?: string;
  rol: 'admin' | 'member';
  imagenUrl: string
  esRata?: boolean
}

export type BalanceDTO = {
  deudorId: number,
  deudorNombre: string,
  acreedorId: number,
  acreedorNombre: string,
  monto: number
}

export type BalanceConGrupoDTO = {
  deudorId: number,
  deudorNombre: string,
  acreedorId: number,
  acreedorNombre: string,
  monto: number,
  grupoId: number,
  grupoNombre: string,
}