import axios from 'axios'
import { type GrupoDTO, type GrupoCreacionDTO, type GroupDetailPageResponse, Grupo, type GrupoNombreIdDTO, type GrupoDetalleDTO, type GrupoGastosPorAnioDTO, type GrupoCardDTO, type GrupoSettingsDTO, type GrupoContextoUsuarioDTO, type Miembro } from '@/domain/Grupo'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

const api = axios.create({ baseURL: BASE_URL })

// ── Endpoints ─────────────────────────────────────────────────────────────────

export async function obtenerGrupos(
  usuarioId: number,
  page: number,
  size: number,
): Promise<GroupDetailPageResponse<GrupoCardDTO>> {
  const { data } = await api.get<GroupDetailPageResponse<GrupoCardDTO>>('/grupo', {
    params: { usuarioId, page, size },
  })
  return data
}

export async function crearGrupo(
  usuarioId: number,
  dto: GrupoCreacionDTO,
): Promise<GrupoDTO> {
  const { data } = await api.post<GrupoDTO>('/grupo', dto, {
    params: { usuarioId },
  })
  return data
}

export async function obtenerGruposDeUsuario(usuarioId: number): Promise<Grupo[]> {
  const { data } = await axios.get<GrupoNombreIdDTO[]>(BASE_URL + `/grupo/usuario/${usuarioId}`)
  return data.map(userJson => Grupo.fromNombreIdJSON(userJson))
}


export async function obtenerGastosGrupo(
  grupoId: number,
  page: number,
  size: number
): Promise<GroupDetailPageResponse<GrupoGastosPorAnioDTO>> {
  const { data } = await api.get<GroupDetailPageResponse<GrupoGastosPorAnioDTO>>(
    `/grupo/${grupoId}/gastos`,
    {
      params: { page, size },
    }
  )

  return data
}

// Usado en groupDetail
export async function obtenerDetalleGrupo(
  grupoId: number
): Promise<GrupoDetalleDTO> {
  const { data } = await api.get<GrupoDetalleDTO>(`/grupo/${grupoId}/detalle`)
  return data
}

// Usado en groupSettings
export async function obtenerGrupoSettings(id: number): Promise<GrupoSettingsDTO> {
  const { data } = await api.get<GrupoSettingsDTO>(`/grupo/${id}/settings`)
  return data
}

export async function obtenerGrupoUsuarioContexto(
  id: number,
  usuarioId?: number,
): Promise<GrupoContextoUsuarioDTO> {
  const currentUserId = usuarioId ?? Number(globalThis.localStorage?.getItem('id'))
  if (!currentUserId) {
    throw new Error('Usuario no autenticado')
  }

  const { data } = await api.get<GrupoContextoUsuarioDTO>(`/grupo/${id}/contexto`, {
    params: {
      usuarioId: currentUserId,
    }
  })
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
  usuarioId: number,
  usuarioAEliminarId: number,
): Promise<number> {
  const { data } = await api.delete<number>(`/grupo/${grupoId}/miembros`, {
    params: {
      usuarioId,
      usuarioAEliminarId,
    }
  })
  return data
}

export async function agregarMiembros(
  grupoId: number,
  usuarioIds: number[],
  usuarioId?: number,
): Promise<void> {
  const currentUserId = usuarioId ?? Number(globalThis.localStorage?.getItem('id'))
  if (!currentUserId) {
    throw new Error('Usuario no autenticado')
  }

  await api.post(`/grupo/${grupoId}/miembros`, { usuarioIds }, {
    params: { usuarioId: currentUserId }
  })
}

// Usado en createExpense para grupo específico
export async function obtenerGrupoPorId(id: number): Promise<GrupoNombreIdDTO> {
  const { data } = await api.get<GrupoNombreIdDTO>(`/grupo/${id}`)
  return data
}

export async function eliminarGrupo(
  grupoId: number,
  usuarioId?: number,
): Promise<void> {
  const currentUserId = usuarioId ?? Number(globalThis.localStorage?.getItem('id'))
  if (!currentUserId) {
    throw new Error('Usuario no autenticado')
  }

  await api.delete<number>(`/grupo/${grupoId}`, {
    params: { usuarioId: currentUserId }
  })
}
  