import { cn } from '@/lib/utils'

// Le ponemos props para poder cambiar el tamaño o las clases si lo necesitamos
interface LogoProps {
  className?: string
  iconSize?: number // Por si en algún lugar queremos el ícono más grande o más chico
}

export default function Logo({ className = "", iconSize = 48 }: LogoProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <img
        src="/favicon_vaquita.png" // O /icon-192.png, la que tenga mejor resolución
        alt="Vaquita"
        width={iconSize}
        height={iconSize}
        className="shrink-0"
      />
    </div>
  )
}