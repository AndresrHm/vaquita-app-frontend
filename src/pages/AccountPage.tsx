import { Button } from '@/components/ui/button'
import PageTitle from '@/components/common/pageTitle'
import Card from '@/components/common/card'
import ColumnContainer from '@/components/common/columnContainer'

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

        <Button className="mt-4 w-full rounded-xl" variant="secondary" type="button">
          Cerrar sesión (mock)
        </Button>
      </ColumnContainer>
    </div>
  )
}

