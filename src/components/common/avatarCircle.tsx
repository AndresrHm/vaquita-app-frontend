import { Initials } from './initials'

export function AvatarCircle({
    nombre,
}: {
    nombre: string
}) {
    return (
        <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium"
        >
            <Initials nombre={nombre} />
        </div>
    )
}