import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { usuarioService } from '@/service/usuarioService'
 // Verificá que la ruta sea correcta

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [isError, setIsError] = useState(false) // Nuevo estado para manejar errores

  const isValid = useMemo(() => {
    return email.trim().length > 3 && password.trim().length >= 6
  }, [email, password])

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setIsError(false)
    setStatus('Verificando credenciales...')

    try {
      // Llamamos al servicio con los datos del formulario
      // Recordá que el backend espera "contrasena"
      await usuarioService.login({ email, contrasena: password })

      setStatus('¡Ingreso exitoso! Redirigiendo...')
      
      // Si todo sale bien, esperamos un momento y navegamos
      setTimeout(() => navigate('/groups'), 1000) 

    } catch (err: any) {
      // Si el backend devuelve "Email o contraseña incorrectos", cae acá
      setIsError(true)
      setStatus(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 flex items-center">
      <div className="mx-auto w-full max-w-md">
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

            <Button className="w-full rounded-xl" type="submit">
              Entrar
            </Button>

            {status ? (
              <div className={`rounded-xl border px-3 py-2 text-sm ${
                isError 
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
        </div>
      </div>
    </div>
  )
}