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
  imagen: string
  integrantesIds: number[]
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

  registrarGasto(gasto: Gasto): void {
    // TODO
  }
}
