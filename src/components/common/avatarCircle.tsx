import { Initials } from './initials'

export function AvatarCircle({
    nombre,
    imagenUrl,
    sizeClass = 'h-9 w-9',
}: {
    nombre: string
    imagenUrl?: string | null
    sizeClass?: string
}) {
    return (
        <div className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full text-xs font-medium overflow-hidden bg-muted`}>
            {imagenUrl ? (
                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                <img src={imagenUrl} alt={`${nombre} avatar`} className="h-full w-full object-cover" />
            ) : (
                <Initials nombre={nombre} />
            )}
        </div>
    )
}