import axios from 'axios'
import { type GrupoDTO, type GrupoCreacionDTO, type PageResponse, Grupo, type GrupoNombreIdDTO } from '@/domain/Grupo'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

const api = axios.create({ baseURL: BASE_URL })

// ── Endpoints ─────────────────────────────────────────────────────────────────

export async function obtenerGrupos(
  usuarioId: number,
  page: number,
  size: number,
): Promise<PageResponse<GrupoDTO>> {
  const { data } = await api.get<PageResponse<GrupoDTO>>('/grupo', {
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