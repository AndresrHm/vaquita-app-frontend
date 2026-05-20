
import api from './apiToken'
import type { ActividadDTO } from '../domain/actividadDTO'
import type { TipoActividad } from '../domain/enums/tipoActividad'
import type { PageResponse } from '../domain/pageResponse'

const manejarError = (error: any): never => {
    const mensaje = error.response?.data?.message || 'Error de conexión'
    throw new Error(mensaje)
}

interface ObtenerActividadesParams {
    searchText?: string
    tipo?: TipoActividad
    desde?: string // ISO DateTime format: "2026-04-26T18:30:00"
    hasta?: string // ISO DateTime format: "2026-04-26T18:30:00"
    page?: number
    size?: number
}

export const actividadService = {
    async obtenerActividades(params: ObtenerActividadesParams = {}): Promise<PageResponse<ActividadDTO>> {
        const searchText = params.searchText?.trim()
        const requestParams = {
            searchText: searchText || undefined,
            tipo: params.tipo ?? undefined,
            desde: params.desde ?? undefined,
            hasta: params.hasta ?? undefined,
            page: params.page ?? 0,
            size: params.size ?? 6,
        }

        // 1. Armamos una llave única combinando tooooodos los filtros posibles
        const cacheKey = `cache_actv_p${requestParams.page}_s${requestParams.size}_txt_${requestParams.searchText || 'all'}_tipo_${requestParams.tipo || 'all'}_d_${requestParams.desde || 'all'}_h_${requestParams.hasta || 'all'}`

        try {
            const { data } = await api.get<PageResponse<ActividadDTO>>('/actividad/me', {
                params: requestParams,
                paramsSerializer: {
                    indexes: null,
                },
            })
            
            // 2. Si la petición sale bien, guardamos esta búsqueda específica
            localStorage.setItem(cacheKey, JSON.stringify(data))
            
            return data
        } catch (error: any) {
            // 3. Si nos quedamos sin internet, buscamos exactamente lo mismo en la mochila
            if (!navigator.onLine || error.message === 'Network Error') {
                const cacheGuardado = localStorage.getItem(cacheKey)
                
                if (cacheGuardado) {
                    return JSON.parse(cacheGuardado)
                }
            }
            
            // 4. Si no es un problema de red o no hay nada cacheado, dejamos que actúe tu manejador normal
            return manejarError(error)
        }
    },
}

