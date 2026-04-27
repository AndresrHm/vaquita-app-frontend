import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, UserMinus, UserPlus, Settings } from 'lucide-react'
import { useOnInit } from '@/customHooks/hooks'
import { usuarioService } from '@/service/usuarioService'
import type { UsuarioInfoDTO } from '@/domain/usuario'
import ColumnContainer from '@/components/common/columnContainer'
import Modal from '@/components/common/modal'
import { Button } from '@/components/ui/button'

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function UserProfilePage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const currentUserId = Number(localStorage.getItem('id'))
  const targetId = Number(userId)

  const [info, setInfo] = useState<UsuarioInfoDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState(false)

  useOnInit(() => {
    if (!targetId || !currentUserId) return
    usuarioService.obtenerUsuarioInfo(targetId)
      .then(setInfo)
      .catch(() => {})
  }, [targetId])

  function handleFriendButtonClick() {
    if (!info || info.solicitudPendiente) return

    if (info.esAmigo) {
      setConfirmRemove(true)
    } else {
      setLoading(true)
      usuarioService.enviarSolicitudAmistad(targetId)
        .then(() => setInfo({ ...info, solicitudPendiente: true }))
        .catch(() => setInfo({ ...info }))
        .finally(() => setLoading(false))
    }
  }

  function handleConfirmRemove() {
    if (!info) return
    setConfirmRemove(false)
    setLoading(true)
    usuarioService.eliminarAmigo(currentUserId, targetId)
      .then(() => setInfo({ ...info, esAmigo: false }))
      .catch(() => setInfo({ ...info }))
      .finally(() => setLoading(false))
  }

  if (!info) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 pt-4">
          <div className="h-8 w-8 rounded-full bg-muted/60 animate-pulse" />
          <div className="h-5 w-32 rounded bg-muted/60 animate-pulse" />
        </div>
        <ColumnContainer>
          <div className="flex flex-col items-center gap-4 p-6">
            <div className="h-24 w-24 rounded-full bg-muted/60 animate-pulse" />
            <div className="h-5 w-40 rounded bg-muted/60 animate-pulse" />
            <div className="h-9 w-32 rounded-xl bg-muted/60 animate-pulse" />
          </div>
        </ColumnContainer>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Back header */}
      <div className="flex items-center gap-3 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground hover:text-foreground"
          aria-label="Volver"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium text-muted-foreground">Perfil</span>
      </div>

      <ColumnContainer>
        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-4 py-6">
          {info.imagenUrl ? (
            <img
              src={info.imagenUrl}
              alt={info.nombre}
              className="h-24 w-24 rounded-full border border-border object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border bg-muted/80 text-2xl font-semibold text-muted-foreground shadow-sm">
              {getInitials(info.nombre)}
            </div>
          )}

          <h1 className="text-xl font-semibold text-foreground">{info.nombre}</h1>

          {/* Add / Remove friend button */}
          <button
            onClick={handleFriendButtonClick}
            disabled={loading || info.solicitudPendiente}
            className={[
              'flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-opacity disabled:opacity-50',
              info.esAmigo || info.solicitudPendiente
                ? 'border border-border bg-muted text-muted-foreground'
                : 'bg-primary text-primary-foreground',
            ].join(' ')}
          >
            {info.esAmigo ? (
              <>
                <UserMinus className="h-4 w-4" />
                Eliminar amigo
              </>
            ) : info.solicitudPendiente ? (
              <>
                <UserPlus className="h-4 w-4" />
                Solicitud pendiente
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Agregar amigo
              </>
            )}
          </button>
        </div>

        {/* Shared groups */}
        <div className="border-t border-border px-4 py-4">
          <h2 className="text-sm font-semibold text-foreground">
            Grupos en común{info.gruposCompartidos.length > 0 && ` (${info.gruposCompartidos.length})`}
          </h2>

          {info.gruposCompartidos.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No compartís grupos con esta persona.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {info.gruposCompartidos.map((g) => (
                <button
                  key={g.id}
                  onClick={() => navigate(`/groups/${g.id}`)}
                  className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  {g.nombre}
                </button>
              ))}
            </div>
          )}
        </div>
      </ColumnContainer>

      <Modal
        isOpen={confirmRemove}
        title="Eliminar amigo"
        description={`¿Estás seguro de que querés eliminar a ${info.nombre} de tus amigos?`}
        onClose={() => setConfirmRemove(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmRemove(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmRemove}>
              Eliminar
            </Button>
          </>
        }
      >
        <></>
      </Modal>
    </div>
  )
}
