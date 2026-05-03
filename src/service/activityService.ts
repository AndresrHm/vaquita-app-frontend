
import api from './apiToken'
import type { ActividadDTO } from '../domain/actividadDTO'
import type { TipoActividad } from '../domain/enums/tipoActividad'
import type { PageResponse } from '../domain/pageResponse'

const manejarError = (error: any): never => {
    const mensaje = error.response?.data?.message || 'Error de conexión'
    throw new Error(mensaje)
}

interface ObtenerActividadesParams {
    tipo?: TipoActividad
    desde?: string // ISO DateTime format: "2026-04-26T18:30:00"
    hasta?: string // ISO DateTime format: "2026-04-26T18:30:00"
    page?: number
    size?: number
}

export const actividadService = {
    async obtenerActividades(params: ObtenerActividadesParams = {}): Promise<PageResponse<ActividadDTO>> {
        try {
            const requestParams = {
                tipo: params.tipo ?? undefined,
                desde: params.desde ?? undefined,
                hasta: params.hasta ?? undefined,
                page: params.page ?? 0,
                size: params.size ?? 6,
            }

            const { data } = await api.get<PageResponse<ActividadDTO>>('/actividad/me', {
                params: requestParams,
                paramsSerializer: {
                    indexes: null,
                },
            })
            return data
        } catch (error: any) {
            return manejarError(error)
        }
    },
}