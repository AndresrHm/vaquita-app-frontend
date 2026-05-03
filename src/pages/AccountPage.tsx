import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import PageTitle from '@/components/common/pageTitle'
import Card from '@/components/common/card'
import ColumnContainer from '@/components/common/columnContainer'

export default function AccountPage() {
  const navigate = useNavigate()
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'))

  const userName = window.localStorage.getItem('user_name') || 'Usuario'
  const userEmail = window.localStorage.getItem('user_email') || 'email@ejemplo.com'
  // 👇 Traemos la imagen que guardamos en el login o al editar el perfil
  const userImage = window.localStorage.getItem('user_image') || ''

  const handleLogout = () => {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('user_name')
    window.localStorage.removeItem('user_email')
    window.localStorage.removeItem('user_image') // Sumamos borrar la imagen
    navigate('/login')
  }

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev)
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    window.localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  return (
    <div className="space-y-4">
      <PageTitle title="Cuenta" subtitle="Tu perfil">
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-foreground">{userName}</div>
            <div className="mt-1 text-xs text-muted-foreground">{userEmail}</div>
          </div>

          {/* 👇 Lógica para mostrar la foto real o la inicial */}
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              className="h-10 w-10 rounded-2xl object-cover shadow-sm border border-border"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              {userName.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
      </PageTitle>

      <ColumnContainer>
        {/* Nueva sección de Cuenta */}
        <h2 className="text-sm font-semibold text-foreground">Gestión de Cuenta</h2>
        <div className="mt-3 space-y-2 mb-4">
          <Card
            className="rounded-xl border border-border px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
            role="button"
            tabIndex={0}
            onClick={() => navigate('/account/settings')}
          >
            <div className="text-xs font-medium text-foreground">Ajustes de perfil</div>
            <div className="mt-1 text-xs text-muted-foreground">Cambiar tu nombre, email o foto</div>
          </Card>

          <Card
            className="rounded-xl border border-border px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
            role="button"
            tabIndex={0}
            onClick={() => navigate('/account/password')}
          >
            <div className="text-xs font-medium text-foreground">Cambiar contraseña</div>
            <div className="mt-1 text-xs text-muted-foreground">Actualizá tu clave de acceso</div>
          </Card>
        </div>

        <h2 className="text-sm font-semibold text-foreground">Preferencias</h2>
        <div className="mt-3 space-y-2">
          <Card
            className="rounded-xl border border-border px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
            role="button"
            tabIndex={0}
            aria-label="Cambiar tema"
            onClick={handleToggleTheme}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleToggleTheme()
              }
            }}
          >
            <div className="text-xs font-medium text-foreground">Tema</div>
            <div className="mt-1 text-xs text-muted-foreground">{isDarkMode ? 'Oscuro' : 'Claro'}</div>
          </Card>
          <Card className="rounded-xl border border-border px-3 py-2">
            <div className="text-xs font-medium text-foreground">Notificaciones</div>
            <div className="mt-1 text-xs text-muted-foreground">Activadas</div>
          </Card>
        </div>

        {/* Botón de cierre de sesión real */}
        <Button
          className="mt-6 w-full rounded-xl"
          variant="destructive"
          type="button"
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </ColumnContainer>
    </div>
  )
}