import { useEffect, useMemo, useState } from 'react'
import Modal from '@/components/common/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/utils/formatCurrency'
import { useToast } from '@/customHooks/useToast'
import { pagarDeudaGrupoAUsuario, pagarDeudaGlobalAUsuario } from '@/service/groupsService'
import { useNetwork } from '@/customHooks/useNetwork'

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
  const [monto, setMonto] = useState(totalMonto.toFixed(2))
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()
  const isOnline = useNetwork()

  useEffect(() => {
    if (open) {
      setMonto(totalMonto.toFixed(2))
      setError(null)
    }
  }, [open, totalMonto])

  const parsedMonto = Number(monto)

  const validationMessage = useMemo(() => {
    if (!monto.trim()) return 'Ingresá un monto válido'
    if (Number.isNaN(parsedMonto)) return 'Ingresá un monto válido'
    if (parsedMonto <= 0) return 'El monto debe ser mayor a 0'
    if (parsedMonto > totalMonto) return 'No podés pagar más que la deuda total'
    return null
  }, [monto, parsedMonto, totalMonto])

  const isSubmitDisabled = validationMessage !== null

  const handleMontoChange = (value: string) => {
    setMonto(value)
    if (error) {
      setError(null)
    }
    console.log(parsedMonto)
    console.log(totalMonto)
  }

  const handleSubmit = async () => {
    if (validationMessage) {
      setError(validationMessage)
      return
    }

    try {
      if (grupoId !== undefined) {
        await pagarDeudaGrupoAUsuario(grupoId, acreedorId, parsedMonto)
      } else {
        await pagarDeudaGlobalAUsuario(acreedorId, parsedMonto)
      }
      showToast('Pago registrado correctamente', 'success')
      setOpen(false)
      onPagoExitoso?.()
    } catch (err) {
      console.error('Error al pagar deuda', err)
      showToast('No se pudo procesar el pago. Intentá de nuevo.', 'error')
    }
  }

  return (
    <>
      <Button disabled={!isOnline} variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Pagar
      </Button>
      <Modal
        isOpen={open}
        title="Pagar deuda"
        description={`Estás pagando a ${acreedorNombre}. El monto máximo disponible es ${formatCurrency(totalMonto)}.`}
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)} type="button">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} type="button" disabled={isSubmitDisabled}>
              Confirmar pago
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Monto a pagar
          </label>
          <Input
            type="number"
            min="0"
            step="0.01"
            max={totalMonto}
            value={monto}
            onChange={(event) => handleMontoChange(event.target.value)}
          />
          {(error || validationMessage) && (
            <div className="text-sm text-destructive">{error ?? validationMessage}</div>
          )}
        </div>
      </Modal>
    </>
  )
}
