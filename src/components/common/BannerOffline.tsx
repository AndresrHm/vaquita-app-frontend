import { useNetwork } from '@/customHooks/useNetwork'

export function BannerOffline() {
  const isOnline = useNetwork()

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 z-50 w-full bg-red-500 py-2 px-4 text-center text-sm font-medium text-white shadow-md">
      ⚠️ Estás sin conexión a internet. Algunas funciones pueden no estar disponibles.
    </div>
  )
}