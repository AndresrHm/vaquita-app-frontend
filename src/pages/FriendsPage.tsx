import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import PageTitle from '@/components/common/pageTitle'
import ColumnContainer from '@/components/common/columnContainer'
import FriendCard from '@/components/friendsPage/FriendCard'
import { usuarioService } from '@/service/usuarioService'

export default function FriendsPage() {
  const [friends, setFriends] = useState<{ id: string; name: string; role: string; due: number; imageUrl: string }[]>([])

  useEffect(() => {
    const userId = Number(localStorage.getItem('id'))
    if (!userId) return
    usuarioService.obtenerAmigos(userId).then((data) => {
      setFriends(data.map((u) => ({ id: String(u.id), name: u.nombre, role: 'Amigo', due: 0, imageUrl: '' })))
    }).catch(() => {})
  }, [])

  return (
    <div className="space-y-4">
      <PageTitle title="Amigos" subtitle="Agregá y organizá participantes." />

      <ColumnContainer>
        {/* Search amigos */}
        <div>
          <label className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar amigos"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>

        {/* Lista de amigos */}
        <div className="mt-3 max-h-[42vh] space-y-3 overflow-y-auto pr-1">
          {friends.map((f) => (
            <FriendCard key={f.id} friend={f} />
          ))}
        </div>

        {/* coso de invitaciones */}
        <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Invitaciones (mock)</h2>
          <p className="mt-1 text-sm text-muted-foreground">Por ahora usamos datos estáticos.</p>
          <Button className="mt-4 w-full rounded-xl" variant="secondary" type="button">
            Invitar por link
          </Button>
        </div>
      </ColumnContainer>
    </div>
  )
}

