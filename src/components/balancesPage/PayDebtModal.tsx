import { useState } from 'react'
import Modal from '@/components/common/modal'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/formatCurrency'
import { useToast } from '@/customHooks/useToast'
import { pagarDeudaGrupoAUsuario, pagarDeudaGlobalAUsuario } from '@/service/groupsService'
import { useNetwork } from '@/customHooks/useNetwork'
import ButtonSkeleton from '../common/ButtonSkeleton'

interface PayDebtModalProps {
  grupoId?: number
  acreedorId: number
  acreedorNombre: string
  totalMonto: number
  onPagoExitoso?: () => void
}

export default function PayDebtModal({
  grupoId,
  acreedorId,
  acreedorNombre,
  totalMonto,
  onPagoExitoso,
}: PayDebtModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const isOnline = useNetwork()

  const handleSubmit = async () => {
    setLoading(true)

    try {
      if (grupoId !== undefined) {
        await pagarDeudaGrupoAUsuario(grupoId, acreedorId, totalMonto)
      } else {
        await pagarDeudaGlobalAUsuario(acreedorId, totalMonto)
      }
      showToast('Pago registrado correctamente', 'success')
      setOpen(false)
      onPagoExitoso?.()
    } catch (err) {
      console.error('Error al pagar deuda', err)
      showToast('No se pudo procesar el pago. Intentá de nuevo.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button disabled={!isOnline} variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Pagar
      </Button>
      <Modal
        isOpen={open}
        title="Confirmar pago"
        description={`¿Estás seguro de que querés pagar ${formatCurrency(totalMonto)} a ${acreedorNombre}?`}
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)} type="button" disabled={loading}>
              Cancelar
            </Button>
            
            {loading ? (
              <ButtonSkeleton className="w-32" />
            ) : (
              <Button onClick={handleSubmit} type="button">
                Confirmar pago
              </Button>
            )}
          </>
        }
      >
        <div className="rounded-lg border border-border bg-background/70 p-4">
          <p className="text-sm text-muted-foreground mb-2">Monto a pagar:</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalMonto)}</p>
        </div>
      </Modal>
    </>
  )
}
