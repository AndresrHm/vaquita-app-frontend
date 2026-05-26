import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, KeyRound } from 'lucide-react'
import ColumnContainer from '@/components/common/columnContainer'
import { usuarioService } from '@/service/usuarioService'
import { useToast } from '@/customHooks/useToast'
import { getMensajeError } from '@/utils/getMensajeError'
import IconNavButton from '@/components/common/IconNavButton'

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [contrasenaActual, setContrasenaActual] = useState('')
  const [contrasenaNueva, setContrasenaNueva] = useState('')
  const [confirmarContrasena, setConfirmarContrasena] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGuardar = async () => {
    // 1. Que no haya campos vacíos
    if (!contrasenaActual || !contrasenaNueva || !confirmarContrasena) {
      showToast('Por favor, completá todos los campos', 'error')
      return
    }

    // 2. Que tenga 6 caracteres mínimo
    if (contrasenaNueva.length < 6) {
      showToast('La nueva contraseña debe tener al menos 6 caracteres', 'error')
      return
    }

    // 3. Que coincidan las contraseñas nuevas
    if (contrasenaNueva !== confirmarContrasena) {
      showToast('Las contraseñas nuevas no coinciden', 'error')
      return
    }

    setLoading(true)
    try {
      // Le pegamos al backend con nuestro DTO
      await usuarioService.cambiarContrasena({
        contrasenaActual,
        contrasenaNueva
      })

      showToast('¡Contraseña actualizada con éxito!', 'success')

      // Volvemos a la cuenta
      setTimeout(() => navigate('/account'), 1000)
    } catch (error: unknown) {
      const mensaje = getMensajeError(error)
      showToast(mensaje, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="-mx-4 rounded-b-2xl rounded-t-none border border-border bg-card/70 px-4 py-4 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <IconNavButton ariaLabel="Volver" onClick={() => window.history.back()} icon={<ChevronLeft className="h-5 w-5" />} />
          <div>
            <h1 className="text-xl font-semibold text-foreground">Cambiar contraseña</h1>
          </div>
        </div>
      </div>

      <ColumnContainer>
        <div className="flex flex-col gap-6 py-6 px-4">

          <div className="space-y-4 w-full">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">
                Contraseña actual
              </label>
              <input
                type="password"
                value={contrasenaActual}
                onChange={(e) => setContrasenaActual(e.target.value)}
                placeholder="Tu contraseña actual"
                className="w-full rounded-xl border border-border bg-background/70 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={contrasenaNueva}
                onChange={(e) => setContrasenaNueva(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-xl border border-border bg-background/70 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                placeholder="Repetí la nueva contraseña"
                className="w-full rounded-xl border border-border bg-background/70 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleGuardar}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-50 hover:opacity-90"
          >
            <KeyRound className="h-4 w-4" />
            {loading ? 'Guardando...' : 'Cambiar contraseña'}
          </button>

        </div>
      </ColumnContainer>
    </div>
  )
}