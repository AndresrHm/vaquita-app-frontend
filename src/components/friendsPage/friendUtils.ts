import { REST_SERVER_URL } from '@/service/configurations'
import type { UsuarioConBalanceDTO } from '@/domain/usuario'

export type FriendListItem = {
  id: string
  name: string
  role: string
  due: number
  imageUrl?: string
}

export function normalizeFriendImageUrl(imagenUrl?: string): string | undefined {
  if (!imagenUrl) return undefined
  const cleanUrl = imagenUrl.trim()
  if (!cleanUrl) return undefined
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl
  }
  if (cleanUrl.startsWith('//')) {
    return `${window.location.protocol}${cleanUrl}`
  }
  if (cleanUrl.startsWith('/')) {
    return `${REST_SERVER_URL}${cleanUrl}`
  }
  return `${REST_SERVER_URL}/${cleanUrl}`
}

export function mapUsuarioToFriend(usuario: UsuarioConBalanceDTO): FriendListItem {
  return {
    id: String(usuario.id),
    name: usuario.nombre,
    role: 'Amigo',
    due: usuario.monto,
    imageUrl: normalizeFriendImageUrl(usuario.imagenUrl),
  }
}
