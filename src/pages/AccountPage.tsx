import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import PageTitle from '@/components/common/pageTitle'
import Card from '@/components/common/card'
import ColumnContainer from '@/components/common/columnContainer'
import { useNetwork } from '@/customHooks/useNetwork'
import Modal from '@/components/common/modal'

export default function AccountPage() {
  const navigate = useNavigate()
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'))
  // 👇 Agregamos el estado para controlar el modal
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const userName = window.localStorage.getItem('user_name') || 'Usuario'
  const userUsername = window.localStorage.getItem('user_username') || ''
  const userImage = window.localStorage.getItem('user_image') || ''
  const isOnline = useNetwork()

  const handleLogout = () => {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('user_name')
    window.localStorage.removeItem('user_email')
    window.localStorage.removeItem('user_image')
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
        <div className="mt-0 flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-foreground">{userName}</div>
            {userUsername && (
              <div className="text-xs text-muted-foreground">@{userUsername}</div>
            )}
          </div>

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
        <h2 className="text-sm font-semibold text-foreground pl-1">Gestión de Cuenta</h2>
        <div className="mt-3 space-y-2 mb-4">
          <Card
            className={`rounded-xl border border-border px-3 py-2 transition-colors ${isOnline
              ? 'cursor-pointer hover:bg-muted/50'
              : 'opacity-50 cursor-not-allowed'
              }`}
            role="button"
            tabIndex={isOnline ? 0 : -1}
            onClick={() => {
              if (isOnline) navigate('/account/settings')
            }}
          >
            <div className="text-xs font-medium text-foreground">Ajustes de perfil</div>
            <div className="mt-1 text-xs text-muted-foreground">Cambiar tu nombre, email o foto</div>
          </Card>

          <Card
            className={`rounded-xl border border-border px-3 py-2 transition-colors ${isOnline
              ? 'cursor-pointer hover:bg-muted/50'
              : 'opacity-50 cursor-not-allowed'
              }`}
            role="button"
            tabIndex={isOnline ? 0 : -1}
            onClick={() => {
              if (isOnline) navigate('/account/password')
            }}
          >
            <div className="text-xs font-medium text-foreground">Cambiar contraseña</div>
            <div className="mt-1 text-xs text-muted-foreground">Actualizá tu clave de acceso</div>
          </Card>
        </div>

        <h2 className="text-sm font-semibold text-foreground pl-1">Preferencias</h2>
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

        {/* 👇 Modificamos el onClick para que abra el modal */}
        <Button
          className="mt-6 w-full rounded-xl"
          variant="destructive"
          type="button"
          onClick={() => setShowLogoutModal(true)}
        >
          Cerrar sesión
        </Button>
      </ColumnContainer>

      {/* 👇 Integramos el componente Modal */}
      <Modal
        isOpen={showLogoutModal}
        title="¿Cerrar sesión?"
        description="¿Estás segura de que querés salir de tu cuenta? Tendrás que volver a ingresar tus datos la próxima vez."
        onClose={() => setShowLogoutModal(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Sí, salir
            </Button>
          </>
        }
      >
        <></> {/* Children vacío porque la data va en title y description */}
      </Modal>

    </div>
  )
}