import axios from 'axios'
import { type GrupoDTO, type GrupoCreacionDTO, type GroupDetailPageResponse, Grupo, type GrupoNombreIdDTO, type GrupoDetalleDTO, type GrupoGastosPorAnioDTO, type GrupoCardDTO } from '@/domain/Grupo'

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

export async function obtenerDetalleGrupo(
  grupoId: number
): Promise<GrupoDetalleDTO> {
  const { data } = await api.get<GrupoDetalleDTO>(`/grupo/${grupoId}/detalle`)
  return data
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

export async function obtenerGrupoPorId(id: number): Promise<GrupoNombreIdDTO> {
  const { data } = await api.get<GrupoNombreIdDTO>(`/grupo/${id}`)
  return data
}