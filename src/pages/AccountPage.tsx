import { Button } from '@/components/ui/button'

const mockUser = {
  name: 'Juan',
  email: 'juan@unsam.edu.ar',
}

export default function AccountPage() {
  return (
    <div className="space-y-4">
      <div className="-mx-4 rounded-b-lg rounded-t-none border border-border bg-card/70 px-9 py-5 shadow-sm backdrop-blur-xl">
        <h1 className="text-lg font-semibold text-foreground">Cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tu perfil (mock).</p>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-foreground">{mockUser.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">{mockUser.email}</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            {mockUser.name.slice(0, 1)}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card/70 p-5 shadow-sm backdrop-blur-xl border border-border">
        <h2 className="text-sm font-semibold text-foreground">Preferencias</h2>
        <div className="mt-3 space-y-2">
          <div className="rounded-xl border border-border bg-card/70 px-3 py-2">
            <div className="text-xs font-medium text-foreground">Tema</div>
            <div className="mt-1 text-xs text-muted-foreground">Sistema (mock)</div>
          </div>
          <div className="rounded-xl border border-border bg-card/70 px-3 py-2">
            <div className="text-xs font-medium text-foreground">Notificaciones</div>
            <div className="mt-1 text-xs text-muted-foreground">On (mock)</div>
          </div>
        </div>

        <Button className="mt-4 w-full rounded-xl" variant="secondary" type="button">
          Cerrar sesión (mock)
        </Button>
      </div>
    </div>
  )
}

