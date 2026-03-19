import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const isValid = useMemo(() => {
    return email.trim().length > 3 && password.trim().length >= 6
  }, [email, password])

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
          <h1 className="text-xl font-semibold text-slate-900">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-slate-600">
            Accedé a Vaquita para administrar grupos y deudas.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!isValid) return

              // Mock: simulamos login exitoso.
              setStatus('Login OK (mock). Redirigiendo...')
              setTimeout(() => navigate('/groups'), 650)
            }}
          >
            <label className="block">
              <span className="text-sm font-medium text-slate-800">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="tu@email.com"
                className="mt-2 w-full rounded-xl border border-slate-200/70 bg-white/90 px-3 py-2 text-sm outline-none focus:border-slate-900/40 focus:ring-3 focus:ring-slate-900/10"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-800">Contraseña</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-slate-200/70 bg-white/90 px-3 py-2 text-sm outline-none focus:border-slate-900/40 focus:ring-3 focus:ring-slate-900/10"
              />
            </label>

            <Button className="w-full rounded-xl" disabled={!isValid} type="submit">
              Entrar
            </Button>

            {status ? (
              <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">{status}</div>
            ) : null}
          </form>

          <div className="mt-5 text-center text-sm text-slate-600">
            ¿No tenés cuenta?{' '}
            <Link className="font-medium text-slate-900 underline underline-offset-4" to="/register">
              Registrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

