import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/customHooks/useToast'
import { getMensajeError } from '@/utils/getMensajeError'
import { Search, Check, X, WifiOff } from 'lucide-react'
import { debounce, SEARCH_DEBOUNCE_MS } from '@/lib/utils'
import PageTitle from '@/components/common/pageTitle'
import ColumnContainer from '@/components/common/columnContainer'
import FriendCard, { FriendCardSkeleton } from '@/components/friendsPage/FriendCard'

import { usuarioService } from '@/service/usuarioService'
import type { SolicitudAmistadFront, UsuarioBusquedaDTO } from '@/domain/usuario'

import { useNetwork } from '@/customHooks/useNetwork'
import { mapUsuarioToFriend } from '@/components/friendsPage/friendUtils'

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
  const isOnline = useNetwork()

  const [friends, setFriends] = useState<{ id: string; name: string; role: string; due: number; imageUrl?: string }[]>([])
  const [loadingFriends, setLoadingFriends] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  const [solicitudes, setSolicitudes] = useState<SolicitudAmistadFront[]>([])

  const [sentIds, setSentIds] = useState<Set<number>>(new Set())
  const [usernameSearch, setUsernameSearch] = useState('')
  const [usernameResults, setUsernameResults] = useState<UsuarioBusquedaDTO[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const debouncedUsernameFetchRef = useRef(debounce((value: string) => {
    setSearchLoading(true)
    usuarioService.buscarPorUsername(value.trim())
      .then(setUsernameResults)
      .catch((err) => showToast(getMensajeError(err), 'error'))
      .finally(() => setSearchLoading(false))
  }, SEARCH_DEBOUNCE_MS))
  const debouncedSearchQueryRef = useRef(debounce((value: string) => {
    setDebouncedSearchQuery(value)
  }, SEARCH_DEBOUNCE_MS))

  useEffect(() => {
    loadFriends()
    usuarioService.obtenerSolicitudesPendientes()
      .then(setSolicitudes)
      .catch((err) => {
        if (isOnline) showToast(getMensajeError(err), 'error')
      })
  }, [isOnline]) // Recargamos si vuelve el internet

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (usernameSearch.trim().length < 2 || !isOnline) { // Frenamos la búsqueda si estamos offline
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
  }, [usernameSearch, isOnline])

  const loadFriends = () => {
    setLoadingFriends(true)
    usuarioService.obtenerAmigos()
      .then((data) => {
        setFriends(data.map(mapUsuarioToFriend))
      })
      .catch((err) => {
        if (isOnline) showToast(getMensajeError(err), 'error')
      })
      .finally(() => setLoadingFriends(false))
  }

  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  )

  function handleAceptar(solicitud: SolicitudAmistadFront) {
    if (!isOnline) return // Bloqueo extra por las dudas
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
    if (!isOnline) return
    usuarioService.responderSolicitudAmistad(solicitud.id, false)
      .then(() => {
        setSolicitudes((prev) => prev.filter((s) => s.id !== solicitud.id))
      })
      .catch((err) => showToast(getMensajeError(err), 'error'))
  }

  function handleEnviarSolicitud(receptorId: number) {
    if (!isOnline) return
    usuarioService.enviarSolicitudAmistad(receptorId)
      .then(() => {
        setSentIds((prev) => new Set(prev).add(receptorId))
      })
      .catch((err) => showToast(getMensajeError(err), 'error'))
  }

  return (
    <div className="space-y-4">
      <PageTitle title="Amigos" subtitle="Agregá amigos y consultá deudas!" />

      <ColumnContainer>
        {/* Buscar entre mis amigos */}
        <div>
          <label className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar amigos"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value
                setSearchQuery(value)
                if (value.trim().length === 0) {
                  debouncedSearchQueryRef.current.cancel()
                  setDebouncedSearchQuery('')
                  return
                }
                debouncedSearchQueryRef.current(value)
              }}
              disabled={!isOnline && friends.length === 0} // Si no hay red ni amigos, al pedo buscar
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
            />
          </label>
        </div>

        {/* Lista de amigos (CON CARTEL OFFLINE) */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-background/70 pt-1 pd-1">

          {/* Fade superior */}
          <div className="pointer-events-none absolute top-0 left-0 right-0 z-10 h-4 bg-linear-to-b from-background via-background/80 to-transparent" />

          {/* Lista */}
          <div className="min-h-[22.5vh] max-h-[26vh] overflow-y-auto space-y-3 px-1 py-3 pb-2 pr-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">

            {loadingFriends && friends.length === 0 ? (
              <>
                {Array.from({ length: 3 }).map((_, i) => <FriendCardSkeleton key={i} />)}
              </>
            ) : !isOnline && friends.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-red-300/50 bg-red-50/50 p-6 text-center shadow-sm dark:border-red-900/50 dark:bg-red-950/20">
                <WifiOff className="mb-2 h-6 w-6 text-red-500/70" />

                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                  ¡Ups! No hay conexión
                </p>

                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  No pudimos cargar tus amigos y no hay datos guardados.
                </p>
              </div>
            ) : filteredFriends.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No tenés amigos aún.
              </p>
            ) : (
              filteredFriends.map((f) => (
                <FriendCard
                  key={f.id}
                  friend={f}
                  onPagoExitoso={loadFriends}
                />
              ))
            )}
          </div>

          {/* Fade inferior */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-5 bg-linear-to-t from-background via-background/90 to-transparent" />
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
                      disabled={!isOnline}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Aceptar"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRechazar(s)}
                      disabled={!isOnline}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Agregar amigo por username (BLOQUEADO SI ESTAMOS OFFLINE) */}
        <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Agregar amigo</h2>
          <div className={`mt-3 flex items-center gap-2 rounded-xl border px-3 py-2 ${!isOnline ? 'bg-muted/50 border-border/50 cursor-not-allowed' : 'border-border bg-background'}`}>
            <span className="text-sm text-muted-foreground select-none">@</span>
            <input
              type="text"
              placeholder={isOnline ? 'nombre de usuario' : 'Conectate para buscar amigos'}
              value={usernameSearch}
              onChange={(e) => {
                const value = e.target.value
                setUsernameSearch(value)
                if (value.trim().length < 2) {
                  debouncedUsernameFetchRef.current.cancel()
                  setUsernameResults([])
                  setSearchLoading(false)
                  return
                }
                debouncedUsernameFetchRef.current(value)
              }}
              disabled={!isOnline}
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {searchLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />}
          </div>
          {/* ... (El resto del render de usernameResults queda igual) ... */}
          {usernameResults.length > 0 && isOnline && (
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
                    disabled={sentIds.has(u.id) || !isOnline}
                    className="rounded-xl border border-border bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
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