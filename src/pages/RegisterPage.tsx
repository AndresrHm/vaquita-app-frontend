/* import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const isValid = useMemo(() => {
    return name.trim().length >= 2 && email.trim().length > 3 && password.trim().length >= 6
  }, [email, name, password])

  return (
    <div className="min-h-screen bg-background px-4 py-6 flex items-center">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur-xl">
          <h1 className="text-xl font-semibold text-foreground">Registrate</h1>
          <p className="mt-1 text-sm text-muted-foreground">Creá tu cuenta en Vaquita (mock).</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!isValid) return

              // Mock: simulamos registro exitoso.
              setStatus('Registro OK (mock). Redirigiendo...')
              setTimeout(() => navigate('/groups'), 700)
            }}
          >
            <label className="block">
              <span className="text-sm font-medium text-foreground">Nombre</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                autoComplete="name"
                placeholder="Juan"
                className="mt-2 w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

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
                autoComplete="new-password"
                placeholder="mínimo 6 caracteres"
                className="mt-2 w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <Button className="w-full rounded-xl" disabled={!isValid} type="submit">
              Crear cuenta
            </Button>

            {status ? (
              <div className="rounded-xl border border-border bg-background/70 px-3 py-2 text-sm text-muted-foreground">
                {status}
              </div>
            ) : null}
          </form>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{' '}
            <Link className="font-medium text-foreground underline underline-offset-4" to="/login">
              Entrá
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
// 1. Importamos tus archivos de lógica
import { Usuario } from '@/domain/usuario' 
import { usuarioService } from '@/service/usuarioService'

export default function RegisterPage() {
  const navigate = useNavigate()
  
  // 2. Cambiamos los 3 estados sueltos por uno solo que sea nuestra Clase
  const [usuario, setUsuario] = useState<Usuario>(new Usuario())
  const [status, setStatus] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  // 4. Función para actualizar el objeto (mantiene la inmutabilidad de React)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUsuario(new Usuario({ ...usuario, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // --- 1. VALIDACIÓN DEL FRONTEND (El Guardia) ---
    const erroresFront: string[] = [] // Armamos nuestra libreta en React
    
    if (usuario.nombre.trim() === '') erroresFront.push("• Faltó escribir tu nombre")
    
    if (usuario.email.trim() === '') {
        erroresFront.push("• Faltó escribir tu email")
    } else if (!usuario.email.includes('@')) {
        erroresFront.push("• El email no parece válido")
    }

    if (usuario.contrasena.trim() === '') {
        erroresFront.push("• Faltó la contraseña")
    } else if (usuario.contrasena.trim().length < 6) {
        erroresFront.push("• La contraseña es muy corta")
    }

    // Si el guardia encontró errores, los muestra y corta el viaje acá mismo
    if (erroresFront.length > 0) {
        setIsError(true)
        setStatus(erroresFront.join('\n')) // Une los errores con saltos de línea
        return 
    }

    // --- 2. VIAJE AL BACKEND ---
    setStatus('Procesando registro...')
    setIsError(false)

    try {
      await usuarioService.registrarUsuario(usuario)
      
      setStatus('¡Usuario registrado con éxito! Redirigiendo...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err: any) {
      // --- 3. VALIDACIÓN DEL BACKEND (El Candado Final) ---
      // Si a React se le escapó algo o el mail ya existía en la BD, cae acá
      setIsError(true)
      setStatus(err.message) 
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 flex items-center">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur-xl">
          <h1 className="text-xl font-semibold text-foreground">Registrate</h1>
          <p className="mt-1 text-sm text-muted-foreground">Unite a la red de gastos de Vaquita. 🐮</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-foreground">Nombre</span>
              <input
                name="nombre" 
                value={usuario.nombre}
                onChange={handleChange}
                type="text"
                placeholder="Juan"
                className="mt-2 w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground">Email</span>
              <input
                name="email"
                value={usuario.email}
                onChange={handleChange}
                type="email"
                placeholder="tu@email.com"
                className="mt-2 w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground">Contraseña</span>
              <input
                name="contrasena" 
                value={usuario.contrasena}
                onChange={handleChange}
                type="password"
                placeholder="mínimo 6 caracteres"
                className="mt-2 w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <Button className="w-full rounded-xl" /* disabled={!isValid} */ type="submit">
              Crear cuenta
            </Button>

            {status ? (
              <div className={`rounded-xl border px-3 py-2 text-sm whitespace-pre-line ${
                isError ? 'border-red-500 bg-red-50 text-red-600' : 'border-border bg-background/70 text-muted-foreground'
              }`}>
                {status}
              </div>
            ) : null}
          </form>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{' '}
            <Link className="font-medium text-foreground underline underline-offset-4" to="/login">
              Entrá
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}