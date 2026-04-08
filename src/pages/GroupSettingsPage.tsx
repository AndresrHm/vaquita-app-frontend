import { ChevronLeft, Save, UserPlus, Trash2, LogOut, AlertTriangle, Camera } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import GroupsContainer from '@/components/groupsPage/GroupsContainer'
import Card from '@/components/common/card'

const getAvatarUrl = (name: string) =>
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`

type Member = { id: string; name: string; role: 'admin' | 'member'; avatar: string }

const mockGroup = {
    id: 'g1',
    name: 'Viaje a Bariloche',
    imageUrl: getAvatarUrl('Viaje a Bariloche'),
    currency: 'ARS',
    simplifyDebts: true,
    notifications: true,
    members: [
        { id: 'u1', name: 'Sofía', role: 'admin', avatar: getAvatarUrl('Sofía') },
        { id: 'u2', name: 'Mateo', role: 'member', avatar: getAvatarUrl('Mateo') },
        { id: 'u3', name: 'Lucía', role: 'member', avatar: getAvatarUrl('Lucía') },
    ] as Member[],
}

function Avatar({ src, alt, size = 10 }: { src: string; alt?: string; size?: number }) {
    const px = size * 4
    return (
        <img src={src} alt={alt ?? 'avatar'} style={{ width: px, height: px }} className="rounded-full object-cover" />
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
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5">
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
    // Visual-only: functional logic removed, keeps layout and mocked data.
    const members = mockGroup.members
    const error: string | null = null

    return (
        <div className="flex flex-col space-y-4 min-h-[calc(100vh-5rem)]">

            {/* Go Back y Título */}
            <div className="-mx-4 rounded-b-2xl rounded-t-none overflow-hidden shadow-sm bg-white">
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between relative">
                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" onClick={() => { }}>
                            <ChevronLeft className="w-4 h-4 mr-2" />
                        </Button>
                    </div>
                    <h2 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-foreground">Ajustes del grupo</h2>
                </div>
            </div>

            <GroupsContainer>
                <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                    {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

                    {/* Group Info */}
                    <Card>
                        <h3 className="text-md font-semibold mb-3">Información del grupo</h3>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre del grupo</label>
                                <input defaultValue={mockGroup.name} readOnly className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Imagen (URL)</label>
                                <div className="flex items-center space-x-3">
                                    <input defaultValue={mockGroup.imageUrl} readOnly className="flex-1 px-3 py-2 border border-gray-200 rounded-md bg-gray-50" />
                                    <div className="flex items-center space-x-2">
                                        <Avatar src={mockGroup.imageUrl} size={12} />
                                        <Camera className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Card>

                    {/* Members */}
                    <Card>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-md font-semibold">Miembros ({members.length})</h3>
                            <Button onClick={() => { }}><UserPlus className="w-4 h-4 mr-2" />Agregar</Button>
                        </div>
                        <div className="space-y-3">
                            {members.map((m) => (
                                <div key={m.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Avatar src={m.avatar} alt={m.name} />
                                        <div>
                                            <div className="font-medium">{m.name}</div>
                                            <div className="text-sm text-muted-foreground capitalize">{m.role}</div>
                                        </div>
                                    </div>
                                    <div>
                                        {m.role !== 'admin' && (
                                            <Button variant="ghost" size="icon" disabled>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Currency & Preferences */}
                    <Card>
                        <h3 className="text-md font-semibold mb-3">Moneda y preferencias</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Moneda por defecto</label>
                                <select defaultValue={mockGroup.currency} disabled className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                                    <option value="ARS">ARS — Peso argentino</option>
                                    <option value="USD">USD — US Dollar</option>
                                    <option value="EUR">EUR — Euro</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <Toggle checked={!!mockGroup.simplifyDebts} onChange={() => { }} label="Simplificar deudas" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Toggle checked={!!mockGroup.notifications} onChange={() => { }} label="Notificaciones" />
                            </div>
                        </div>
                    </Card>

                    {/* Danger Zone */}
                    <Card>
                        <h3 className="text-md font-semibold mb-3 text-red-600">Zona peligrosa</h3>
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-start" disabled>
                                <LogOut className="w-4 h-4 mr-2" /> Salir del grupo
                            </Button>
                            <Button variant="destructive" className="w-full justify-start" disabled>
                                <AlertTriangle className="w-4 h-4 mr-2" /> Eliminar grupo
                            </Button>
                        </div>
                    </Card>

                    <div>
                        <Button disabled>
                            <Save className="w-4 h-4 mr-2" /> Guardar
                        </Button>
                    </div>

                </main>
            </GroupsContainer>

            <Modal open={false} title="Salir del grupo">
                ¿Estás seguro que quieres salir del grupo? Perderás acceso a los gastos.
            </Modal>

            <Modal open={false} title="Eliminar grupo">
                Esta acción eliminará el grupo y no se puede deshacer. Asegúrate de tener respaldo.
            </Modal>
        </div >
    )
}
