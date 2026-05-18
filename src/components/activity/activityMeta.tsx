import {
    Receipt,
    Pencil,
    Trash2,
    CreditCard,
    Users,
    Wallet,
} from 'lucide-react'

import { TipoActividad } from '@/domain/enums/tipoActividad'

export const activityMeta = {
    [TipoActividad.INGRESO_GRUPO]: {
        title: 'Ingreso al grupo',
        icon: Users,
        color: 'bg-blue-500/10 text-blue-600',
        badge: 'Grupo',
    },

    [TipoActividad.GASTO_CREADO]: {
        title: 'Gasto creado',
        icon: Receipt,
        color: 'bg-orange-500/10 text-orange-600',
        badge: 'Gasto',
    },

    [TipoActividad.GASTO_ACTUALIZADO]: {
        title: 'Gasto actualizado',
        icon: Pencil,
        color: 'bg-amber-500/10 text-amber-600',
        badge: 'Gasto',
    },

    [TipoActividad.GASTO_ELIMINADO]: {
        title: 'Gasto eliminado',
        icon: Trash2,
        color: 'bg-red-500/10 text-red-600',
        badge: 'Gasto',
    },

    [TipoActividad.PAGO_REALIZADO]: {
        title: 'Pago realizado',
        icon: CreditCard,
        color: 'bg-emerald-500/10 text-emerald-600',
        badge: 'Pago',
    },

    [TipoActividad.PAGO_RECIBIDO]: {
        title: 'Pago recibido',
        icon: Wallet,
        color: 'bg-cyan-500/10 text-cyan-600',
        badge: 'Pago',
    },

    [TipoActividad.GASTO_DEUDA]: {
        title: 'Nueva deuda',
        icon: Receipt,
        color: 'bg-red-500/10 text-red-600',
        badge: 'Deuda',
    },
}