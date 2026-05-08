import { TipoActividad } from './enums/tipoActividad'

export type ActividadDTO = {
    id: number
    tipo: TipoActividad
    fecha: string
    descripcion: string
    metadata: string // JSON string con información adicional
}

export type ActividadMetadata = {
    grupoId?: number
    grupoNombre?: string
    gastoId?: number
    usuarioId?: number
    [key: string]: any
}
