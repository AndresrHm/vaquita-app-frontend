import { ChevronLeft, UserPlus, Trash2, LogOut, AlertTriangle, Crown, Check, X } from 'lucide-react'
import type { ReactNode, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import ColumnContainer from '@/components/common/columnContainer'
import Card from '@/components/common/card'
import PageTitle from '@/components/common/pageTitle'
import IconNavButton from '@/components/common/IconNavButton'
import ActionButton from '@/components/common/ActionButton'
import Select from '@/components/ui/select'
import { useState } from 'react'
import type { GrupoContextoUsuarioDTO, GrupoSettingsDTO, Miembro } from '@/domain/Grupo'
import { CURRENCY_LABELS, SUPPORTED_CURRENCIES, type SupportedCurrency } from '@/domain/currency'
import { useOnInit } from '@/customHooks/hooks'
import { obtenerGrupoUsuarioContexto, obtenerGrupoSettings, obtenerMiembrosDeGrupoSettings, actualizarGrupoSettings, eliminarMiembro, agregarMiembros, eliminarGrupo } from '@/service/groupsService'
import { usuarioService } from '@/service/usuarioService'
import type { UsuarioConBalanceDTO } from '@/domain/usuario'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@/customHooks/useToast'
import { getMensajeError } from '@/utils/getMensajeError'

function Avatar({ src, alt, size = 10 }: { src?: string; alt?: string; size?: number }) {
    const px = size * 4
    const fallback = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'

    const [error, setError] = useState(false)

    const finalSrc = !error && src ? src : fallback

    return (
        <img
            src={finalSrc}
            onError={() => setError(true)}
            alt={alt ?? 'avatar'}
            style={{ width: px, height: px }}
            className="rounded-full object-cover"
        />
    )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange?: (v: boolean) => void; label: string }) {
    return (
        <label className="flex items-center space-x-3">
            <div
                role="switch"
                aria-checked={checked}
                onClick={() => onChange && onChange(!checked)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-primary' : 'bg-gray-300'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${checked ? 'translate-x-5' : ''}`} />
            </div>
            <span className="text-sm">{label}</span>
        </label>
    )
}

function Modal({ open, title, children, onClose, onConfirm }: { open: boolean; title: string; children: ReactNode; onClose?: () => void; onConfirm?: () => void }) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-5">
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <div className="text-sm text-muted-foreground">{children}</div>
                <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    {onConfirm && (
                        <Button variant="destructive" onClick={onConfirm}>Confirmar</Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function GroupSettingsPage() {
    const { showToast } = useToast()
    const [initialData, setInitialData] = useState<GrupoSettingsDTO | null>(null)
    const [formularioGrupo, setFormularioGrupo] = useState<GrupoSettingsDTO>({} as GrupoSettingsDTO)
    const [miembros, setMiembros] = useState<Miembro[]>([])
    const [contextoUsuario, setContextoUsuario] = useState<GrupoContextoUsuarioDTO>({} as GrupoContextoUsuarioDTO)
    const [loading, setLoading] = useState(true)
    const [memberToDelete, setMemberToDelete] = useState<Miembro | null>(null)
    const [addFriendsOpen, setAddFriendsOpen] = useState(false)
    const [friends, setFriends] = useState<UsuarioConBalanceDTO[]>([])
    const [selectedFriendIds, setSelectedFriendIds] = useState<Set<number>>(new Set())
    const [addingMembers, setAddingMembers] = useState(false)
    const [deletingGroup, setDeletingGroup] = useState(false)
    const [deleteGroupOpen, setDeleteGroupOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [imageError, setImageError] = useState(false)
    const imageUrl = formularioGrupo?.imagenUrl || ''
    const navigate = useNavigate()
    const { groupId } = useParams()
    const parsedGroupId = Number(groupId)

    const updateGroupField = (field: keyof GrupoSettingsDTO, value: unknown) => {
        if (!formularioGrupo) return

        setFormularioGrupo({
            ...formularioGrupo,
            [field]: value
        })
    }

    const isDirty = JSON.stringify(formularioGrupo) !== JSON.stringify(initialData)

    const validate = () => {
        if (!formularioGrupo.nombre?.trim()) {
            setError('El nombre del grupo es obligatorio')
            return false
        }
        return true
    }

    const handleSave = async () => {
        try {
            if (!validate()) return

            if (!isDirty) return

            setLoading(true)

            const updated = await actualizarGrupoSettings(parsedGroupId, formularioGrupo)

            setFormularioGrupo(updated)
            setInitialData(updated)

        } catch (error: unknown) {
            const mensaje = getMensajeError(error)
            showToast(mensaje, 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        if (initialData) {
            setFormularioGrupo(initialData)
        }
    }

    const handleRemoveMember = async (memberId: number) => {
        try {
            setLoading(true)

            await eliminarMiembro(parsedGroupId, memberId)

            setMiembros(prev => prev.filter(m => m.id !== memberId))

        } catch (error: unknown) {
            const mensaje = getMensajeError(error)
            showToast(mensaje, 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleOpenAddFriends = async () => {
        try {
            const amigos = await usuarioService.obtenerAmigos()
            const memberIds = new Set(miembros.map(m => m.id))
            setFriends(amigos.filter(a => a.id !== undefined && !memberIds.has(a.id!)))
            setSelectedFriendIds(new Set())
            setAddFriendsOpen(true)
        } catch (error: unknown) {
            const mensaje = getMensajeError(error)
            showToast(mensaje, 'error')
        }
    }

    const toggleFriend = (id: number) => {
        setSelectedFriendIds(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const handleConfirmAddFriends = async () => {
        if (selectedFriendIds.size === 0) return
        try {
            setAddingMembers(true)
            await agregarMiembros(parsedGroupId, [...selectedFriendIds])
            const updatedMembers = await obtenerMiembrosDeGrupoSettings(parsedGroupId)
            setMiembros(updatedMembers)
            setAddFriendsOpen(false)
        } catch (error: unknown) {
            const mensaje = getMensajeError(error)
            showToast(mensaje, 'error')
        } finally {
            setAddingMembers(false)
        }
    }

    const handleDeleteGroup = async () => {
        try {
            setDeletingGroup(true)
            await eliminarGrupo(parsedGroupId)
            setDeleteGroupOpen(false)
            navigate('/groups')
        } catch (error: unknown) {
            const mensaje = getMensajeError(error)
            showToast(mensaje, 'error')
        } finally {
            setDeletingGroup(false)
        }
    }

    useOnInit(() => {
        const fetchData = async () => {
            try {
                setLoading(true)

                const [grupo, miembros, contexto] = await Promise.all([
                    obtenerGrupoSettings(parsedGroupId),
                    obtenerMiembrosDeGrupoSettings(parsedGroupId),
                    obtenerGrupoUsuarioContexto(parsedGroupId)
                ])

                setInitialData(grupo)
                setFormularioGrupo(grupo)
                setMiembros(miembros)
                setContextoUsuario(contexto)

            } catch (error: unknown) {
                const mensaje = getMensajeError(error)
                showToast(mensaje, 'error')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    })

    return (
        <div className="flex flex-col space-y-4 min-h-[calc(100vh-5rem)]">

            <PageTitle>
                <div className="max-w-2xl mx-auto px-4 flex items-center justify-between relative">
                    <div className="flex items-center space-x-3">
                        <IconNavButton ariaLabel="Volver" onClick={() => window.history.back()} icon={<ChevronLeft className="h-5 w-5" />} />
                    </div>
                    <h2 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-foreground">Ajustes del grupo</h2>
                </div>
            </PageTitle>

            <ColumnContainer>
                {loading || error ? (
                    // 🟣 Skeleton
                    <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
                        {error && (
                            <div className="d-flex justify-content-center align-items-center text-center text-sm text-red-600 bg-red-50 p-3 rounded-xl">
                                {error}
                            </div>
                        )}
                        <div className="h-24 bg-muted rounded-xl" />
                        <div className="h-40 bg-muted rounded-xl" />
                        <div className="h-40 bg-muted rounded-xl" />
                    </div>
                ) : (

                    <main className="max-w-2xl mx-auto space-y-6">

                        {/* Group Info */}
                        <Card interactive={false}>
                            <h3 className="text-lg font-semibold mb-3">Información del grupo</h3>
                            {contextoUsuario?.esAdmin ? (
                                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-muted-foreground mb-1">Nombre del grupo</label>
                                        <input
                                            value={formularioGrupo.nombre || ''}
                                            onChange={(e) => updateGroupField('nombre', e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-md bg-white text-sm text-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-muted-foreground mb-1">Descripción</label>
                                        <input
                                            value={formularioGrupo?.descripcion || ''}
                                            onChange={(e) => updateGroupField('descripcion', e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-md bg-white text-sm text-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-muted-foreground">Imagen (URL)</label>
                                        <div className="flex items-center space-x-1">
                                                <input
                                                    value={imageUrl}
                                                    onChange={(e) => {
                                                        setImageError(false)
                                                        updateGroupField('imagenUrl', e.target.value)
                                                    }}
                                                    className="flex-1 px-3 py-2 border border-border rounded-md bg-white text-sm text-foreground"
                                                />
                                                <div className="flex items-center space-x-2">
                                                    {imageUrl && !imageError ? (
                                                        <img
                                                            src={imageUrl}
                                                            onError={() => setImageError(true)}
                                                            alt="preview"
                                                            className="w-30 h-20 rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-32 h-20 rounded-md flex items-center justify-center border border-border bg-muted/20 text-sm text-muted-foreground text-center">
                                                            No hay foto seleccionada
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-3">
                                    <div className="rounded-xl border border-border bg-card/70 p-3">
                                        <div className="text-sm text-muted-foreground mb-1">Nombre del grupo</div>
                                        <div className="font-medium">{formularioGrupo.nombre || '-'}</div>
                                    </div>
                                    <div className="rounded-xl border border-border bg-card/70 p-3">
                                        <div className="text-sm text-muted-foreground mb-1">Descripción</div>
                                        <div className="text-sm">{formularioGrupo?.descripcion || '-'}</div>
                                    </div>
                                        <div className="rounded-xl border border-border bg-card/70 p-3">
                                        <div className="text-sm text-muted-foreground mb-1">Imagen</div>
                                        {imageUrl && !imageError ? (
                                            <img src={imageUrl} alt="preview" className="w-30 h-20 rounded-md object-cover" />
                                        ) : (
                                            <div className="w-32 h-20 rounded-md flex items-center justify-center border border-border bg-muted/20 text-sm text-muted-foreground text-center">No hay foto seleccionada</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Members */}
                        <Card interactive={false}>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">Miembros ({miembros?.length})</h3>
                                {contextoUsuario?.esAdmin ? (
                                    <ActionButton icon={<UserPlus className="w-4 h-4" />} onClick={handleOpenAddFriends} />
                                ) : null}
                            </div>
                            <div className="space-y-3">
                                {miembros?.map((m) => (
                                    <div key={m.id} className="flex items-center justify-between rounded-xl border border-border bg-card/70 px-3 py-2">
                                        <button type="button" onClick={() => navigate(`/friends/${m.id}`)} className="flex items-center space-x-3 text-left hover:opacity-75 transition-opacity">
                                            <Avatar src={m.imagenUrl} alt={m.nombre} />
                                            <div>
                                                <div className="font-medium">{m.nombre} {contextoUsuario.usuarioId === m.id && '(Tú)'}</div>
                                                {m.username && <div className="text-xs text-muted-foreground">@{m.username}</div>}
                                                <div className="text-sm text-muted-foreground capitalize">{m.rol}</div>
                                            </div>
                                        </button>
                                        <div className="pr-3">
                                            {m.rol === 'admin' ? (
                                                <div className="inline-flex items-center gap-2 text-muted-foreground font-semibold pr-1">
                                                    <Crown className="w-6 h-6" />
                                                </div>
                                            ) : contextoUsuario.esAdmin && m.id !== contextoUsuario.usuarioId ? (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setMemberToDelete(m)}
                                                >
                                                    <Trash2 className="w-5 h-5 text-red-600" />
                                                </Button>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Currency & Preferences */}
                        <Card interactive={false}>
                            <h3 className="text-lg font-semibold mb-3">Moneda y preferencias</h3>
                            <div className="space-y-4">
                                {contextoUsuario?.esAdmin ? (
                                    <>
                                        <div>
                                            <label className="block text-sm text-muted-foreground mb-1">Moneda por defecto</label>
                                            <Select
                                                value={formularioGrupo?.moneda || ''}
                                                onChange={(e: ChangeEvent<HTMLSelectElement>) => updateGroupField('moneda', e.target.value as SupportedCurrency)}
                                                disabled={!contextoUsuario?.esAdmin}
                                            >
                                                {SUPPORTED_CURRENCIES.map((c) => (
                                                    <option key={c} value={c}>{c} — {CURRENCY_LABELS[c]}</option>
                                                ))}
                                            </Select>
                                        </div>
                                        {/*
                                        <div className="flex items-center justify-between">
                                            <Toggle
                                                checked={formularioGrupo.simplificarDeudas}
                                                onChange={(v) => updateGroupField('simplificarDeudas', v)}
                                                label="Simplificar deudas"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Toggle
                                                checked={formularioGrupo.notificaciones}
                                                onChange={(v) => updateGroupField('notificaciones', v)}
                                                label="Notificaciones" />
                                        </div>
                                        */}
                                        <div className="flex items-center justify-between">
                                            <Toggle
                                                checked={formularioGrupo.modoRata}
                                                onChange={(v) => updateGroupField('modoRata', v)}
                                                label="Modo rata 🐀" />
                                        </div>
                                    </>
                                        ) : (
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="rounded-md border border-border bg-muted/30 p-3">
                                            <div className="text-xs">Moneda por defecto</div>
                                            <div className="font-medium">{formularioGrupo?.moneda || '-'}</div>
                                        </div>
                                        { /*
                                        <div className="rounded-md border border-border bg-muted/30 p-3">
                                            <div className="text-xs">Simplificar deudas</div>
                                            <div>{formularioGrupo?.simplificarDeudas ? 'Activado' : 'Desactivado'}</div>
                                        </div>
                                        <div className="rounded-md border border-border bg-muted/30 p-3">
                                            <div className="text-xs">Notificaciones</div>
                                            <div>{formularioGrupo?.notificaciones ? 'Activado' : 'Desactivado'}</div>
                                        </div>
                                        */ }
                                        <div className="rounded-md border border-border bg-muted/30 p-3">
                                            <div className="text-xs">Modo rata</div>
                                            <div>{formularioGrupo?.modoRata ? 'Activado' : 'Desactivado'}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Gestión del grupo */}
                        <Card interactive={false}>
                            <h3 className="text-lg font-semibold mb-3">Gestión del grupo</h3>
                            <div className="space-y-3">
                                <Button variant="outline" className="w-full justify-start bg-red-50 border-red-200 text-red-500 hover:bg-red-100 py-2.5 text-base" disabled>
                                    <LogOut className="w-6 h-6 mr-3" /> Salir del grupo
                                </Button>
                                {contextoUsuario?.esAdmin && (
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start bg-red-50 border-red-200 text-red-500 hover:bg-red-100 py-2.5 text-base"
                                        disabled={contextoUsuario?.tieneDeudas || deletingGroup}
                                        onClick={() => setDeleteGroupOpen(true)}
                                    >
                                        <AlertTriangle className="w-6 h-6 mr-3" /> {deletingGroup ? 'Eliminando grupo...' : 'Eliminar grupo'}
                                    </Button>
                                )}
                            </div>
                            {/* todo mejorar esto, que aparezca al clickear el button desactivado */}
                            {contextoUsuario && contextoUsuario.tieneDeudas && (
                                <p className='text-xs text-gray-400 pt-2'>
                                    No podés salir del grupo porque tenés deudas pendientes.
                                </p>
                            )}
                        </Card>

                        {isDirty && (
                            <div className="flex items-center justify-center-safe gap-4">
                                <ActionButton
                                    icon={<Check className="w-5 h-5" />}
                                    onClick={handleSave}
                                    className="text-base"
                                >
                                    Guardar
                                </ActionButton>

                                <ActionButton
                                    variant="secondary"
                                    icon={<X className="w-5 h-5" />}
                                    onClick={handleCancel}
                                    className="text-base"
                                >
                                    Cancelar
                                </ActionButton>
                            </div>
                        )}

                    </main>
                )}
            </ColumnContainer>

            <Modal open={false} title="Salir del grupo">
                ¿Estás seguro que quieres salir del grupo? Perderás acceso a los gastos.
            </Modal>

            <Modal
                open={deleteGroupOpen}
                title="Eliminar grupo"
                onClose={() => setDeleteGroupOpen(false)}
                onConfirm={handleDeleteGroup}
            >
                Esta acción eliminará el grupo y no se puede deshacer. Asegúrate de tener respaldo.
            </Modal>

            {addFriendsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-5">
                        <h3 className="text-lg font-semibold mb-3">Agregar amigos al grupo</h3>
                        <div className="max-h-64 overflow-y-auto space-y-2">
                            {friends.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No tenés amigos para agregar.</p>
                            ) : (
                                friends.map(f => (
                                    <label key={f.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-muted">
                                        <input
                                            type="checkbox"
                                            checked={selectedFriendIds.has(f.id!)}
                                            onChange={() => toggleFriend(f.id!)}
                                            className="w-4 h-4 accent-primary"
                                        />
                                        <Avatar alt={f.nombre} />
                                        <div>
                                            <div className="text-sm font-medium">{f.nombre}</div>
                                            {f.username && <div className="text-xs text-muted-foreground">@{f.username}</div>}
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setAddFriendsOpen(false)}>Cancelar</Button>
                            <Button
                                onClick={handleConfirmAddFriends}
                                disabled={selectedFriendIds.size === 0 || addingMembers}
                            >
                                {addingMembers ? 'Agregando…' : 'Confirmar'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Modal
                open={!!memberToDelete}
                title="Eliminar miembro"
                onClose={() => setMemberToDelete(null)}
                onConfirm={() => {
                    if (memberToDelete) {
                        handleRemoveMember(memberToDelete.id)
                        setMemberToDelete(null)
                    }
                }}
            >
                ¿Seguro que querés eliminar a {memberToDelete?.nombre}?
            </Modal>
        </div >
    )
}
