import { useEffect, useState } from 'react'
import { Search, UserPlus, Check, X } from 'lucide-react'
import PageTitle from '@/components/common/pageTitle'
import ColumnContainer from '@/components/common/columnContainer'
import FriendCard from '@/components/friendsPage/FriendCard'
import { usuarioService } from '@/service/usuarioService'
import type { SolicitudAmistadFront } from '@/domain/usuario'

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function FriendsPage() {
  // Solo lo usamos para filtrar que no nos aparezcamos en la lista de "Agregar amigos"
  const currentUserId = Number(localStorage.getItem('id'))

  const [friends, setFriends] = useState<{ id: string; name: string; role: string; due: number; imageUrl: string }[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const [solicitudes, setSolicitudes] = useState<SolicitudAmistadFront[]>([])

  const [allUsers, setAllUsers] = useState<{ id: number; nombre: string }[]>([])
  const [addSearch, setAddSearch] = useState('')
  const [sentIds, setSentIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    usuarioService.obtenerAmigos()
      .then((data) => {
        setFriends(data.map((u) => ({ id: String(u.id), name: u.nombre, role: 'Amigo', due: u.monto, imageUrl: '' })))
      })
      .catch(() => {})

    usuarioService.obtenerSolicitudesPendientes()
      .then(setSolicitudes)
      .catch(() => {})

    usuarioService.obtenerTodos()
      .then((data) => setAllUsers(data.map((u) => ({ id: u.id!, nombre: u.nombre }))))
      .catch(() => {})
  }, [])

  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const friendIds = new Set(friends.map((f) => Number(f.id)))
  // solicitudEmisorIds no se estaba usando, lo dejo por si lo necesitás después
  const solicitudEmisorIds = new Set(solicitudes.map((s) => s.id))

  const addCandidates = allUsers.filter(
    (u) =>
      u.id !== currentUserId && // Evita que te agregues a vos mismo en la UI
      !friendIds.has(u.id) &&
      addSearch.trim() !== '' &&
      u.nombre.toLowerCase().includes(addSearch.toLowerCase())
  )

  function handleAceptar(solicitud: SolicitudAmistadFront) {
    // 🔴 REFACTOR: Ya no mandamos userId, solo el ID de la solicitud y si aceptamos
    usuarioService.responderSolicitudAmistad(solicitud.id, true)
      .then(() => {
        setSolicitudes((prev) => prev.filter((s) => s.id !== solicitud.id))
        setFriends((prev) => [
          ...prev,
          { id: String(solicitud.id), name: solicitud.nombre, role: 'Amigo', due: 0, imageUrl: solicitud.imagenUrl },
        ])
      })
      .catch(() => {})
  }

  function handleRechazar(solicitud: SolicitudAmistadFront) {
    // 🔴 REFACTOR: Mismo caso que aceptar
    usuarioService.responderSolicitudAmistad(solicitud.id, false)
      .then(() => {
        setSolicitudes((prev) => prev.filter((s) => s.id !== solicitud.id))
      })
      .catch(() => {})
  }

  function handleEnviarSolicitud(receptorId: number) {
    // 🔴 REFACTOR: Solo mandamos el ID del receptor, el emisor va en el token
    usuarioService.enviarSolicitudAmistad(receptorId)
      .then(() => {
        setSentIds((prev) => new Set(prev).add(receptorId))
      })
      .catch(() => {})
  }

  return (
    <div className="space-y-4">
      <PageTitle title="Amigos" subtitle="Agregá y organizá participantes." />

      <ColumnContainer>
        {/* Buscar entre mis amigos */}
        <div>
          <label className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar amigos"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>

        {/* Lista de amigos */}
        <div className="max-h-[30vh] space-y-3 overflow-y-auto pr-1">
          {filteredFriends.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tenés amigos aún.</p>
          ) : (
            filteredFriends.map((f) => <FriendCard key={f.id} friend={f} />)
          )}
        </div>

        {/* Solicitudes pendientes */}
        <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">
            Solicitudes de amistad {solicitudes.length > 0 && `(${solicitudes.length})`}
          </h2>
          {solicitudes.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No tenés solicitudes pendientes.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {solicitudes.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {s.imagenUrl ? (
                      <img
                        src={s.imagenUrl}
                        alt={s.nombre}
                        className="h-9 w-9 shrink-0 rounded-full border border-border object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/80 text-xs font-semibold text-muted-foreground">
                        {getInitials(s.nombre)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground">{s.nombre}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAceptar(s)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90"
                      aria-label="Aceptar"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRechazar(s)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground hover:opacity-90"
                      aria-label="Rechazar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agregar amigo */}
        <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Agregar amigo</h2>
          <label className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
            <UserPlus className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={addSearch}
              onChange={(e) => setAddSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
          {addCandidates.length > 0 && (
            <div className="mt-3 space-y-2">
              {addCandidates.map((u) => (
                <div key={u.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/80 text-xs font-semibold text-muted-foreground">
                      {getInitials(u.nombre)}
                    </div>
                    <span className="text-sm font-medium text-foreground">{u.nombre}</span>
                  </div>
                  <button
                    onClick={() => handleEnviarSolicitud(u.id)}
                    disabled={sentIds.has(u.id)}
                    className="rounded-xl border border-border bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    {sentIds.has(u.id) ? 'Enviada' : 'Agregar'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </ColumnContainer>
    </div>
  )
}