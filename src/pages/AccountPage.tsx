import { Button } from '@/components/ui/button'

const mockUser = {
  name: 'Juan',
  email: 'juan@unsam.edu.ar',
}

export default function AccountPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
        <h1 className="text-lg font-semibold text-slate-900">Account</h1>
        <p className="mt-1 text-sm text-slate-600">Tu perfil (mock).</p>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">{mockUser.name}</div>
            <div className="mt-1 text-xs text-slate-600">{mockUser.email}</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            {mockUser.name.slice(0, 1)}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white/70 p-5 shadow-sm backdrop-blur-xl">
        <h2 className="text-sm font-semibold text-slate-900">Preferencias</h2>
        <div className="mt-3 space-y-2">
          <div className="rounded-xl border border-slate-200/60 bg-white/70 px-3 py-2">
            <div className="text-xs font-medium text-slate-800">Tema</div>
            <div className="mt-1 text-xs text-slate-600">Sistema (mock)</div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white/70 px-3 py-2">
            <div className="text-xs font-medium text-slate-800">Notificaciones</div>
            <div className="mt-1 text-xs text-slate-600">On (mock)</div>
          </div>
        </div>

        <Button className="mt-4 w-full rounded-xl" variant="secondary" type="button">
          Cerrar sesión (mock)
        </Button>
      </div>
    </div>
  )
}

