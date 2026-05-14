import api from './apiToken'
import {
  type GrupoDTO,
  type GrupoCreacionDTO,
  type GroupDetailPageResponse,
  Grupo,
  type GrupoNombreIdDTO,
  type GrupoDetalleDTO,
  type GrupoGastosPorAnioDTO,
  type GrupoCardDTO,
  type GrupoSettingsDTO,
  type GrupoContextoUsuarioDTO,
  type Miembro,
  type BalanceDTO
} from '@/domain/Grupo'

// ── Endpoints Refactorizados y Protegidos ─────────────────────────────────────

export async function obtenerGrupos(
  page: number = 0,
  size: number = 5,
  search?: string,
  filter?: string,
): Promise<GroupDetailPageResponse<GrupoCardDTO>> {
  const finalSize = size > 0 ? size : 8
  const searchTerm = search?.trim()
  const filterTerm = filter?.trim()

  // 1. Creamos una llave única para el caché basada en lo que el usuario pidió
  // Ej: "cache_grupos_p0_s5_search_none_filter_all"
  const cacheKey = `cache_grupos_p${page}_s${finalSize}_search_${searchTerm || 'none'}_filter_${filterTerm || 'none'}`

  try {
    // 2. Intentamos buscar la data fresca al backend
    const { data } = await api.get<GroupDetailPageResponse<GrupoCardDTO>>('/grupo', {
      params: {
        page,
        size: finalSize,
        search: searchTerm || undefined,
        filter: filterTerm || undefined,
      },
    })

    // 3. ¡Anduvo! Guardamos esta página específica en la mochila
    localStorage.setItem(cacheKey, JSON.stringify(data))

    return data
  } catch (error: any) {
    // 4. Si se corta la red, buscamos la página guardada con esa misma llave
    if (!navigator.onLine || error.message === 'Network Error') {
      const cacheGuardado = localStorage.getItem(cacheKey)
      
      if (cacheGuardado) {
        return JSON.parse(cacheGuardado)
      }
    }

    // Si explota por otra cosa o no hay caché, dejamos que el error suba a tu GroupsPage
    throw error
  }
}

export async function crearGrupo(dto: GrupoCreacionDTO): Promise<GrupoDTO> {
  const { data } = await api.post<GrupoDTO>('/grupo', dto)
  return data
}

export async function obtenerGruposDeUsuario(): Promise<Grupo[]> {
  const { data } = await api.get<GrupoNombreIdDTO[]>('/grupo/me')
  return data.map(json => Grupo.fromNombreIdJSON(json))
}

export async function obtenerGastosGrupo(
  grupoId: number,
  page: number = 0,
  size: number = 10
): Promise<GroupDetailPageResponse<GrupoGastosPorAnioDTO>> {
  const finalSize = size > 0 ? size : 10

  const { data } = await api.get<GroupDetailPageResponse<GrupoGastosPorAnioDTO>>(
    `/grupo/${grupoId}/gastos`,
    { params: { page, size: finalSize } }
  )

  return data
}

export async function obtenerBalancesGrupo(grupoId: number): Promise<BalanceDTO[]> {
  const { data } = await api.get<BalanceDTO[]>(`/grupo/${grupoId}/balances`)
  return data
}

export async function obtenerDetalleGrupo(grupoId: number): Promise<GrupoDetalleDTO> {
  const { data } = await api.get<GrupoDetalleDTO>(`/grupo/${grupoId}/detalle`)
  return data
}

export async function pagarDeudaGrupoAUsuario(
  grupoId: number,
  acreedorId: number,
  monto: number
): Promise<void> {
  await api.post('/grupo/pagar/usuario', {
    grupoId,
    acreedorId,
    monto,
  })
}

export async function pagarDeudaGlobalAUsuario(
  acreedorId: number,
  monto: number
): Promise<void> {
  await api.post('/gasto/pagar/global', {
    grupoId: null,
    acreedorId,
    monto,
  })
}

export async function obtenerGrupoSettings(id: number): Promise<GrupoSettingsDTO> {
  const { data } = await api.get<GrupoSettingsDTO>(`/grupo/${id}/settings`)
  return data
}

export async function obtenerGrupoUsuarioContexto(id: number): Promise<GrupoContextoUsuarioDTO> {
  const { data } = await api.get<GrupoContextoUsuarioDTO>(`/grupo/${id}/contexto`)
  return data
}

export async function obtenerMiembrosDeGrupoSettings(grupoId: number): Promise<Miembro[]> {
  const { data } = await api.get<Miembro[]>(`/grupo/${grupoId}/miembros`)
  return data
}

export async function actualizarGrupoSettings(
  grupoId: number,
  dto: GrupoSettingsDTO
): Promise<GrupoSettingsDTO> {
  const { data } = await api.patch<GrupoSettingsDTO>(`/grupo/${grupoId}/settings`, dto)
  return data
}

export async function eliminarMiembro(
  grupoId: number,
  usuarioAEliminarId: number,
): Promise<number> {
  const { data } = await api.delete<number>(`/grupo/${grupoId}/miembros`, {
    params: { usuarioAEliminarId }
  })
  return data
}

export async function agregarMiembros(
  grupoId: number,
  usuarioIds: number[]
): Promise<void> {
  await api.post(`/grupo/${grupoId}/miembros`, { usuarioIds })
}

export async function obtenerGrupoPorId(id: number): Promise<GrupoNombreIdDTO> {
  const { data } = await api.get<GrupoNombreIdDTO>(`/grupo/${id}`)
  return data
}

export async function eliminarGrupo(grupoId: number): Promise<void> {
  await api.delete(`/grupo/${grupoId}`)
}
