/* import { Button } from '@/components/ui/button'
import PageTitle from '@/components/common/pageTitle'
import Card from '@/components/common/card'
import ColumnContainer from '@/components/common/columnContainer'
import UserExpensesButton from '@/components/accountPage/UserExpensesButton'

const mockUser = {
  name: 'Juan',
  email: 'juan@unsam.edu.ar',
}

export default function AccountPage() {
  return (
    <div className="space-y-4">
      <PageTitle title="Cuenta" subtitle="Tu perfil (mock).">
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-foreground">{mockUser.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">{mockUser.email}</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            {mockUser.name.slice(0, 1)}
          </div>
        </div>
      </PageTitle>

      <ColumnContainer>
        <h2 className="text-sm font-semibold text-foreground">Preferencias</h2>
        <div className="mt-3 space-y-2">
          <Card className="rounded-xl border border-border px-3 py-2">
            <div className="text-xs font-medium text-foreground">Tema</div>
            <div className="mt-1 text-xs text-muted-foreground">Sistema (mock)</div>
          </Card>
          <Card className="rounded-xl border border-border px-3 py-2">
            <div className="text-xs font-medium text-foreground">Notificaciones</div>
            <div className="mt-1 text-xs text-muted-foreground">On (mock)</div>
          </Card>
        </div>

        <UserExpensesButton />

        <Button className="mt-4 w-full rounded-xl" variant="secondary" type="button">
          Cerrar sesión (mock)
        </Button>
      </ColumnContainer>
    </div>
  )
}
 */


import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import PageTitle from '@/components/common/pageTitle'
import Card from '@/components/common/card'
import ColumnContainer from '@/components/common/columnContainer'
import UserExpensesButton from '@/components/accountPage/UserExpensesButton'

export default function AccountPage() {
  const navigate = useNavigate()

  // Intentamos obtener los datos reales del localStorage si los guardaste en el login
  // Si no, usamos valores por defecto
  const userName = localStorage.getItem('user_name') || 'Usuario'
  const userEmail = localStorage.getItem('user_email') || 'email@ejemplo.com'

  const handleLogout = () => {
    // 1. Borramos el token y cualquier dato del usuario (VAQUITA-25)
    localStorage.removeItem('token')
    localStorage.removeItem('user_name')
    localStorage.removeItem('user_email')

    // 2. Redirigimos al login inmediatamente
    navigate('/login')
  }

  return (
    <div className="space-y-4">
      <PageTitle title="Cuenta" subtitle="Información de tu perfil.">
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-foreground">{userName}</div>
            <div className="mt-1 text-xs text-muted-foreground">{userEmail}</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            {userName.slice(0, 1).toUpperCase()}
          </div>
        </div>
      </PageTitle>

      <ColumnContainer>
        <h2 className="text-sm font-semibold text-foreground">Preferencias</h2>
        <div className="mt-3 space-y-2">
          <Card className="rounded-xl border border-border px-3 py-2">
            <div className="text-xs font-medium text-foreground">Tema</div>
            <div className="mt-1 text-xs text-muted-foreground">Sistema</div>
          </Card>
          <Card className="rounded-xl border border-border px-3 py-2">
            <div className="text-xs font-medium text-foreground">Notificaciones</div>
            <div className="mt-1 text-xs text-muted-foreground">Activadas</div>
          </Card>
        </div>

        <UserExpensesButton />

        {/* Botón de cierre de sesión real */}
        <Button 
          className="mt-4 w-full rounded-xl" 
          variant="destructive" // Cambié a destructive para que sea rojo y se note que es una acción crítica
          type="button"
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </ColumnContainer>
    </div>
  )
}