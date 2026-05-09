import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/customHooks/useToast'
import { getMensajeError } from '@/utils/getMensajeError'
import { Search, Check, X } from 'lucide-react'
import PageTitle from '@/components/common/pageTitle'
import ColumnContainer from '@/components/common/columnContainer'
import FriendCard from '@/components/friendsPage/FriendCard'

import { usuarioService } from '@/service/usuarioService'
import type { SolicitudAmistadFront, UsuarioBusquedaDTO } from '@/domain/usuario'

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function FriendsPage() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  // Solo lo usamos para filtrar que no nos aparezcamos en la lista de "Agregar amigos"
  const currentUserId = Number(localStorage.getItem('id'))

  const [friends, setFriends] = useState<{ id: string; name: string; role: string; due: number; imageUrl: string }[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const [solicitudes, setSolicitudes] = useState<SolicitudAmistadFront[]>([])

  const [sentIds, setSentIds] = useState<Set<number>>(new Set())
  const [usernameSearch, setUsernameSearch] = useState('')
  const [usernameResults, setUsernameResults] = useState<UsuarioBusquedaDTO[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    loadFriends()
    usuarioService.obtenerSolicitudesPendientes()
      .then(setSolicitudes)
      .catch((err) => showToast(getMensajeError(err), 'error'))
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (usernameSearch.trim().length < 2) {
      setUsernameResults([])
      return
    }
    debounceRef.current = setTimeout(() => {
      setSearchLoading(true)
      usuarioService.buscarPorUsername(usernameSearch.trim())
        .then(setUsernameResults)
        .catch((err) => showToast(getMensajeError(err), 'error'))
        .finally(() => setSearchLoading(false))
    }, 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [usernameSearch])

  const loadFriends = () => {
    usuarioService.obtenerAmigos()
      .then((data) => {
        setFriends(data.map((u) => ({ id: String(u.id), name: u.nombre, role: 'Amigo', due: u.monto, imageUrl: '' })))
      })
      .catch((err) => showToast(getMensajeError(err), 'error'))
  }

  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const friendIds = new Set(friends.map((f) => Number(f.id)))

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
      .catch((err) => showToast(getMensajeError(err), 'error'))
  }

  function handleRechazar(solicitud: SolicitudAmistadFront) {
    // 🔴 REFACTOR: Mismo caso que aceptar
    usuarioService.responderSolicitudAmistad(solicitud.id, false)
      .then(() => {
        setSolicitudes((prev) => prev.filter((s) => s.id !== solicitud.id))
      })
      .catch((err) => showToast(getMensajeError(err), 'error'))
  }

  function handleEnviarSolicitud(receptorId: number) {
    // 🔴 REFACTOR: Solo mandamos el ID del receptor, el emisor va en el token
    usuarioService.enviarSolicitudAmistad(receptorId)
      .then(() => {
        setSentIds((prev) => new Set(prev).add(receptorId))
      })
      .catch((err) => showToast(getMensajeError(err), 'error'))
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
            filteredFriends.map((f) => <FriendCard key={f.id} friend={f} onPagoExitoso={loadFriends} />)
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

        {/* Agregar amigo por username */}
        <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Agregar amigo</h2>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
            <span className="text-sm text-muted-foreground select-none">@</span>
            <input
              type="text"
              placeholder="nombre de usuario"
              value={usernameSearch}
              onChange={(e) => setUsernameSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {searchLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />}
          </div>
          {usernameResults.length > 0 && (
            <div className="mt-3 space-y-2">
              {usernameResults.map((u) => (
                <div key={u.id} className="flex items-center justify-between gap-3">
                  <button type="button" onClick={() => navigate(`/friends/${u.id}`)} className="flex items-center gap-3 text-left hover:opacity-75 transition-opacity">
                    {u.imagenUrl ? (
                      <img src={u.imagenUrl} alt={u.nombre} className="h-9 w-9 shrink-0 rounded-full border border-border object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/80 text-xs font-semibold text-muted-foreground">
                        {getInitials(u.nombre)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{u.nombre}</p>
                      <p className="text-xs text-muted-foreground">@{u.username}</p>
                    </div>
                  </button>
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