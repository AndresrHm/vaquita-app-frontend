export type FriendListItem = {
  id: string
  name: string
  role: string
  due: number
  imageUrl?: string
}

export function mapUsuarioToFriend(usuario: {
  id: number
  nombre: string
  monto: number
  imagenUrl?: string
}): FriendListItem {
  return {
    id: String(usuario.id),
    name: usuario.nombre,
    role: 'Amigo',
    due: usuario.monto,
    imageUrl: usuario.imagenUrl,
  }
}
