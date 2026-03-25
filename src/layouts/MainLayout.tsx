import { Activity, LayoutGrid, PlusCircle, Users, User as UserIcon } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'

type NavItemProps = {
  to: string
  label: string
  icon: ReactNode
}

function MobileNavItem({ to, label, icon }: NavItemProps) {
  return (
    <NavLink
      to={to}
      aria-label={label}
      className={({ isActive }) =>
        [
          'flex flex-col items-center justify-center',
          'h-12 w-full',
          'text-[11px] font-medium',
          'transition-colors',
          isActive ? 'text-foreground' : 'text-muted-foreground'
        ].join(' ')
      }
    >
      {icon}
      <span className="mt-1 leading-none">{label}</span>
    </NavLink>
  )
}

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-md px-4 pb-28 pt-0">
        <Outlet />
      </main>

      <nav
        className={[
          'fixed inset-x-0 bottom-0 z-50',
          'bg-card/80 backdrop-blur-xl',
          'border-t border-border',
          'shadow-lg'
        ].join(' ')}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto w-full max-w-md px-4">
          <div className="relative grid grid-cols-5 items-center pt-2 pb-3">
            <MobileNavItem
              to="/groups"
              label="Grupos"
              icon={<LayoutGrid className="h-5 w-5" strokeWidth={2} />}
            />

            <MobileNavItem
              to="/friends"
              label="Amigos"
              icon={<Users className="h-5 w-5" strokeWidth={2} />}
            />

            <div className="flex justify-center">
              <NavLink
                to="/groups/scan"
                aria-label="Add"
                className="relative -top-4 flex items-center justify-center"
              >
                <span
                  className={[
                    'inline-flex h-16 w-16 items-center justify-center',
                    'rounded-2xl',
                    'bg-primary text-primary-foreground',
                    'shadow-lg',
                    'ring-1 ring-ring/30',
                    'transition-transform',
                    'active:scale-[0.98]'
                  ].join(' ')}
                >
                  <PlusCircle className="h-9 w-9" strokeWidth={2.25} />
                </span>
              </NavLink>
            </div>

            <MobileNavItem
              to="/activity"
              label="Actividad"
              icon={<Activity className="h-5 w-5" strokeWidth={2} />}
            />

            <MobileNavItem
              to="/account"
              label="Cuenta"
              icon={<UserIcon className="h-5 w-5" strokeWidth={2} />}
            />
          </div>
        </div>
      </nav>
    </div>
  )
}

