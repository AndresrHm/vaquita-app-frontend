/* eslint-disable no-undef */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Camera, ChevronLeft } from 'lucide-react'
import ColumnContainer from '@/components/common/columnContainer'
import { usuarioService } from '@/service/usuarioService'
import type { UsuarioEditarDTO } from '@/domain/usuario'
import { useToast } from '@/customHooks/useToast'
import { getMensajeError } from '@/utils/getMensajeError'
import PageTitle from '@/components/common/pageTitle'
import IconNavButton from '@/components/common/IconNavButton'

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function SettingsAccountPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [nombre, setNombre] = useState(window.localStorage.getItem('user_name') || '')
  const [email, setEmail] = useState(window.localStorage.getItem('user_email') || '')
  const [imagenUrl, setImagenUrl] = useState(window.localStorage.getItem('user_image') || '')
  const username = window.localStorage.getItem('user_username') || ''

  const [loading, setLoading] = useState(false)

  // 👇 Lógica para convertir la imagen a Base64 👇
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Por favor, selecciona un archivo de imagen válido', 'error')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('La imagen es muy grande. Máximo 2MB.', 'error')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagenUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleGuardar = async () => {
    if (!nombre.trim() || !email.trim()) {
      showToast('El nombre y el email son obligatorios', 'error')
      return
    }

    setLoading(true)
    try {
      const dto: UsuarioEditarDTO = { nombre, email, imagenUrl }
      await usuarioService.actualizarPerfil(dto)

      window.localStorage.setItem('user_name', nombre)
      window.localStorage.setItem('user_email', email)
      window.localStorage.setItem('user_image', imagenUrl)

      showToast('¡Perfil actualizado con éxito!', 'success')

      // Opcional: Volver a la página de cuenta después de un segundo
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
            <h1 className="text-xl font-semibold text-foreground">Tu perfil</h1>
          </div>
        </div>
      </div>

      <ColumnContainer>
        <div className="flex flex-col gap-6 py-6 px-4">

          {/* Avatar con selector de imagen local */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              {imagenUrl ? (
                <img
                  src={imagenUrl}
                  alt={nombre}
                  className="h-24 w-24 rounded-full border border-border object-cover shadow-sm transition-opacity group-hover:opacity-80"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border bg-muted/80 text-2xl font-semibold text-muted-foreground shadow-sm transition-opacity group-hover:opacity-80">
                  {getInitials(nombre || 'Yo')}
                </div>
              )}

              <label
                htmlFor="file-upload"
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              >
                <Camera className="h-6 w-6 text-white" />
              </label>
            </div>

            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <span className="text-xs font-medium text-muted-foreground">
              Click en la foto para cambiar
            </span>
          </div>

          <div className="space-y-4 w-full mt-2">

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Nombre de usuario</label>
              <div className="flex items-center rounded-xl border border-border bg-muted/50 px-4 py-2.5">
                <span className="text-sm text-muted-foreground select-none">@</span>
                <span className="ml-1 text-sm text-muted-foreground">{username}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className="w-full rounded-xl border border-border bg-background/70 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-xl border border-border bg-background/70 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleGuardar}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-50 hover:opacity-90"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>

        </div>
      </ColumnContainer>
    </div>
  )
}