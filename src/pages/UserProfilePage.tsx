import { useState } from 'react'
import { useToast } from '@/customHooks/useToast'
import { getMensajeError } from '@/utils/getMensajeError'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, UserMinus, UserPlus } from 'lucide-react'
import { useOnInit } from '@/customHooks/hooks'
import { usuarioService } from '@/service/usuarioService'
import type { UsuarioInfoDTO } from '@/domain/usuario'
import ColumnContainer from '@/components/common/columnContainer'
import Modal from '@/components/common/modal'
import { Button } from '@/components/ui/button'
import MoneyBadge from '@/components/moneyBadge/moneyBadge'
import PayDebtModal from '@/components/balancesPage/PayDebtModal'
import { SectionCard } from '@/components/balancesPage/sectionCard'
import { BalanceRow } from '@/components/balancesPage/balanceRow'
import { Divider } from '@/components/common/divider'
import { formatCurrency } from '@/utils/formatCurrency'
import PageTitle from '@/components/common/pageTitle'

type Tab = 'balances' | 'grupos'

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
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<Tab>('balances')

  useOnInit(() => {
    if (!targetId || !currentUserId) return
    usuarioService.obtenerUsuarioInfo(targetId)
      .then(setInfo)
      .catch((err) => showToast(getMensajeError(err), 'error'))
  }, [targetId])

  function refreshInfo() {
    usuarioService.obtenerUsuarioInfo(targetId)
      .then(setInfo)
      .catch(() => { })
  }

  function handleFriendButtonClick() {
    if (!info || info.solicitudPendiente) return

    if (info.esAmigo) {
      setConfirmRemove(true)
    } else {
      setLoading(true)
      usuarioService.enviarSolicitudAmistad(targetId)
        .then(() => setInfo({ ...info, solicitudPendiente: true }))
        .catch((err) => {
          setInfo({ ...info })
          showToast(getMensajeError(err), 'error')
        })
        .finally(() => setLoading(false))
    }
  }

  function handleConfirmRemove() {
    if (!info) return
    setConfirmRemove(false)
    setLoading(true)
    usuarioService.eliminarAmigo(currentUserId, targetId)
      .then(() => setInfo({ ...info, esAmigo: false }))
      .catch((err) => {
        setInfo({ ...info })
        showToast(getMensajeError(err), 'error')
      })
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

  const owedToMe = info.balances.filter((b) => b.acreedorId === currentUserId)
  const iOwe = info.balances.filter((b) => b.deudorId === currentUserId)
  const totalOwedToMe = owedToMe.reduce((acc, b) => acc + b.monto, 0)
  const totalIOwe = iOwe.reduce((acc, b) => acc + b.monto, 0)
  const netAmount = totalIOwe - totalOwedToMe
  const headerAmount = netAmount

  const tabs: { key: Tab; label: string }[] = [
    { key: 'balances', label: 'Balance' },
    { key: 'grupos', label: `Grupos${info.gruposCompartidos.length > 0 ? ` (${info.gruposCompartidos.length})` : ''}` },
  ]

  return (
    <div className="space-y-4">
      {/* Back header */}
      <PageTitle
        title="Perfil de amigo"
        onBack={() => { window.history.back() }}
      >
      </PageTitle>

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
          <p className="text-sm text-muted-foreground">@{info.username}</p>

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

        {/* Tabs */}
        <div className="border-t border-border">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={[
                  'flex-1 py-3 text-sm font-semibold transition-colors border-b-2',
                  activeTab === tab.key
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Balance */}
          {activeTab === 'balances' && (
            <div className="px-4 py-4 space-y-4">
              {/* Summary card */}
              <div className="rounded-2xl border border-border bg-background/70 px-4 py-3 shadow-sm flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">
                    {netAmount > 0 ? 'Debés' : netAmount < 0 ? 'Te deben' : 'Sin deudas'}
                  </div>
                  <div
                    className="mt-1 text-xl font-semibold"
                    style={{ color: netAmount > 0 ? 'var(--danger)' : netAmount < 0 ? 'var(--success)' : undefined }}
                  >
                    {formatCurrency(Math.abs(netAmount))}
                  </div>
                </div>
                {netAmount > 0 && (
                  <PayDebtModal
                    acreedorId={targetId}
                    acreedorNombre={info.nombre}
                    totalMonto={netAmount}
                    onPagoExitoso={refreshInfo}
                  />
                )}
              </div>

              {info.balances.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-background/50 px-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground">No hay deudas pendientes con esta persona 🎉</p>
                </div>
              ) : (
                <>
                  {owedToMe.length > 0 && (
                    <SectionCard title="Lo que te deben">
                      {owedToMe.map((b, i) => (
                        <div key={`owed-${b.deudorId}-${b.grupoId}`}>
                          {i > 0 && <Divider />}
                          <BalanceRow
                            avatarNombre={b.deudorNombre}
                            label={b.deudorNombre}
                            sublabel={b.grupoNombre}
                            amount={`+${formatCurrency(b.monto)}`}
                            variant="success"
                          />
                        </div>
                      ))}
                    </SectionCard>
                  )}

                  {iOwe.length > 0 && (
                    <SectionCard title="Lo que debés">
                      {iOwe.map((b, i) => (
                        <div key={`iowe-${b.acreedorId}-${b.grupoId}`}>
                          {i > 0 && <Divider />}
                          <BalanceRow
                            avatarNombre={b.acreedorNombre}
                            label={<>A <span className="font-medium">{b.acreedorNombre}</span></>}
                            sublabel={b.grupoNombre}
                            amount={`-${formatCurrency(b.monto)}`}
                            variant="danger"
                            showPayButton
                            grupoId={b.grupoId}
                            totalMonto={b.monto}
                            acreedorId={b.acreedorId}
                            acreedorNombre={b.acreedorNombre}
                            onPagoExitoso={refreshInfo}
                          />
                        </div>
                      ))}
                    </SectionCard>
                  )}
                </>
              )}
            </div>
          )}

          {/* Tab: Grupos */}
          {activeTab === 'grupos' && (
            <div className="px-4 py-4">
              {info.gruposCompartidos.length === 0 ? (
                <p className="text-sm text-muted-foreground">No compartís grupos con esta persona.</p>
              ) : (
                <div className="space-y-2">
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
