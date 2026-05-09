import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
// 1. Importamos tus archivos de lógica
import { Usuario } from '@/domain/usuario' 
import { usuarioService } from '@/service/usuarioService'
import { useToast } from '@/customHooks/useToast'
import { getMensajeError } from '@/utils/getMensajeError'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  
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
    
    if (usuario.nombre.trim() === '') erroresFront.push('• Faltó escribir tu nombre')

    if (usuario.username.trim() === '') {
        erroresFront.push('• Faltó escribir tu nombre de usuario')
    } else if (!/^[a-zA-Z0-9._]{3,20}$/.test(usuario.username)) {
        erroresFront.push('• El nombre de usuario solo puede contener letras, números, puntos y guiones bajos (3-20 caracteres)')
    }

    if (usuario.email.trim() === '') {
        erroresFront.push('• Faltó escribir tu email')
    } else if (!usuario.email.includes('@')) {
        erroresFront.push('• El email no parece válido')
    }

    if (usuario.contrasena.trim() === '') {
        erroresFront.push('• Faltó la contraseña')
    } else if (usuario.contrasena.trim().length < 6) {
        erroresFront.push('• La contraseña es muy corta')
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
              <span className="text-sm font-medium text-foreground">Nombre de usuario</span>
              <div className="mt-2 flex items-center rounded-xl border border-border bg-input px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
                <span className="text-sm text-muted-foreground select-none">@</span>
                <input
                  name="username"
                  value={usuario.username}
                  onChange={handleChange}
                  type="text"
                  placeholder="juan.perez"
                  className="flex-1 bg-transparent text-sm text-foreground outline-none ml-1"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Letras, números, puntos y guiones bajos. No se puede cambiar después.</p>
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