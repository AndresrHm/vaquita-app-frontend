import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Search, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { crearGrupo } from '@/service/groupsService'

const mockFriends = [
  { id: 'u1', name: 'Lucía Fernández' },
  { id: 'u2', name: 'Martín Gómez' },
  { id: 'u3', name: 'Juan Carlos Pérez' },
  { id: 'u4', name: 'Sofía Rodríguez' },
  { id: 'u5', name: 'Diego Torres' },
]

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function CreateGroupPage() {
  const navigate = useNavigate()
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const filteredFriends = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return mockFriends
    return mockFriends.filter((f) => f.name.toLowerCase().includes(q))
  }, [search])

  const isValid = groupName.trim().length >= 2

  function toggleMember(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return

    setLoading(true)
    setError(null)

    try {
      // TODO: reemplazar 1 por el id del usuario autenticado
      await crearGrupo(1, {
        nombre: groupName.trim(),
        descripcion: description.trim(),
        imagen: '',
        integrantesIds: Array.from(selectedIds).map(Number),
      })
      setStatus('Grupo creado. Redirigiendo...')
      setTimeout(() => navigate('/groups'), 700)
    } catch {
      setError('No se pudo crear el grupo. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-4 min-h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="-mx-4 rounded-b-2xl rounded-t-none border border-border bg-card/70 px-4 py-4 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted transition cursor-pointer"
            aria-label="Volver"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Nuevo grupo</h1>
            <p className="text-sm text-muted-foreground">Completá los datos del grupo</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Datos del grupo */}
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-xl space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Datos del grupo</h2>

          <label className="block">
            <span className="text-sm font-medium text-foreground">Nombre</span>
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              type="text"
              placeholder="Ej: Asado del finde"
              className="mt-2 w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground">
              Descripción{' '}
              <span className="font-normal text-muted-foreground">(opcional)</span>
            </span>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              placeholder="¿De qué trata el grupo?"
              className="mt-2 w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>

        {/* Miembros */}
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Miembros</h2>
            {selectedIds.size > 0 && (
              <span className="text-xs text-muted-foreground">{selectedIds.size} seleccionado{selectedIds.size !== 1 ? 's' : ''}</span>
            )}
          </div>

          <label className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar amigos"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>

          <div className="space-y-2">
            {filteredFriends.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Sin resultados</p>
            ) : (
              filteredFriends.map((f) => {
                const selected = selectedIds.has(f.id)
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleMember(f.id)}
                    className={[
                      'w-full flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition',
                      selected
                        ? 'border-ring bg-primary/10'
                        : 'border-border bg-background/70 hover:bg-muted/50',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/80 text-xs font-semibold text-muted-foreground">
                        {getInitials(f.name)}
                      </div>
                      <span className="text-sm font-medium text-foreground">{f.name}</span>
                    </div>

                    <span
                      className={[
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition',
                        selected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background',
                      ].join(' ')}
                    >
                      {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Feedback y submit */}
        {status && (
          <div className="rounded-xl border border-border bg-background/70 px-3 py-2 text-sm text-muted-foreground">
            {status}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button className="w-full rounded-xl" disabled={!isValid || loading} type="submit">
          {loading ? 'Creando...' : 'Crear grupo'}
        </Button>
      </form>
    </div>
  )
}
