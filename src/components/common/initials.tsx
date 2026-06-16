const AVATAR_COLORS = [
  { bg: 'bg-sky-100', text: 'text-sky-700' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-violet-100', text: 'text-violet-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700' },
  { bg: 'bg-rose-100', text: 'text-rose-700' },
  { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  { bg: 'bg-lime-100', text: 'text-lime-700' },
  { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700' },
]

export function getInitials(nombre: string) {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

function getAvatarColorIndex(nombre: string) {
  const hash = nombre
    .split('')
    .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0)

  return Math.abs(hash) % AVATAR_COLORS.length
}

export function getAvatarColorClass(nombre: string) {
  return AVATAR_COLORS[getAvatarColorIndex(nombre)]
}

export function Initials({ nombre }: { nombre: string }) {
  return getInitials(nombre)
}
