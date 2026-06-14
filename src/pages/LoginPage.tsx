/* eslint-disable no-undef */
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { usuarioService } from '@/service/usuarioService'
import { useToast } from '@/customHooks/useToast'
import { getMensajeError } from '@/utils/getMensajeError'
import { useNetwork } from '@/customHooks/useNetwork'
import Logo from '@/components/common/Logo'

export default function LoginPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  // 2. Activamos el radar de internet
  const isOnline = useNetwork()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  const isValid = useMemo(() => {
    return email.trim().length > 3 && password.trim().length >= 6
  }, [email, password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 3. Mini validación extra por si logran bypassear el botón bloqueado
    if (!isValid || !isOnline) return

    setIsError(false)
    setStatus('Verificando credenciales...')

    try {
      await usuarioService.login({ email, contrasena: password })

      setStatus('¡Ingreso exitoso! Redirigiendo...')
      
      setTimeout(() => navigate('/groups'), 1000)


    } catch (error: unknown) {
      const mensaje = getMensajeError(error)
      showToast(mensaje, 'error')
      setIsError(true)
      setStatus(mensaje)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 flex items-center">
      <div className="mx-auto w-full max-w-md">
        <Logo className="mb-8" iconSize={100} />
        <div className="rounded-2xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur-xl">
          <h1 className="text-xl font-semibold text-foreground">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Accedé a Vaquita para administrar grupos y deudas.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-foreground">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="tu@email.com"
                className="mt-2 w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground">Contraseña</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            {/* 4. El cartel condicional que salta si apagan el WiFi */}
            {!isOnline && (
              <div className="rounded-xl border border-orange-500 bg-orange-50 px-3 py-2 text-sm text-orange-600">
                ⚠️ Necesitás conexión a internet para iniciar sesión.
              </div>
            )}

            {/* 5. Bloqueamos el botón si no hay internet (o si el formulario no es válido) */}
            <Button
              className="w-full rounded-xl"
              type="submit"
              disabled={!isOnline || !isValid}
            >
              Entrar
            </Button>

            {status ? (
              <div className={`rounded-xl border px-3 py-2 text-sm ${isError
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-border bg-background/70 text-muted-foreground'
                }`}>
                {status}
              </div>
            ) : null}
          </form>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            ¿No tenés cuenta?{' '}
            <Link className="font-medium text-foreground underline underline-offset-4" to="/register">
              Registrate
            </Link>

          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground mb-2">¿Sin cuenta? Probá igual</p>
            <Link
              to="/split"
              className="inline-flex items-center gap-1.5 text-s text-primary hover:underline font-medium"
            >
              <span>🍕</span> División rápida — sin registro
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}