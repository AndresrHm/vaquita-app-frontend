import {
    Receipt,
    Pencil,
    Trash2,
    CheckCircle2,
    Users,
    UserMinus,
    UserPlus,
} from 'lucide-react'
import { TipoActividad } from '@/domain/enums/tipoActividad'

export const activityMeta = {
    [TipoActividad.MIS_DEUDAS]: {
        title: 'Nueva deuda',
        icon: Receipt,
        color: 'bg-red-500/10 text-red-600',
        badge: 'Gasto',
    },

    [TipoActividad.MIS_DEUDAS_SALDADAS]: {
        title: 'Deuda saldada',
        icon: CheckCircle2,
        color: 'bg-emerald-500/10 text-emerald-600',
        badge: 'Pago',
    },

    [TipoActividad.MIS_PAGOS]: {
        title: 'Pago registrado',
        icon: Receipt, // O el que prefieras usar para representar que alguien te debe
        color: 'bg-orange-500/10 text-orange-600',
        badge: 'Gasto',
    },

    [TipoActividad.COBROS_RECIBIDOS]: {
        title: 'Cobro recibido',
        icon: CheckCircle2,
        color: 'bg-cyan-500/10 text-cyan-600',
        badge: 'Pago',
    },

    [TipoActividad.INGRESO_GRUPO]: {
        title: 'Ingreso al grupo',
        icon: Users,
        color: 'bg-blue-500/10 text-blue-600',
        badge: 'Grupo',
    },

    [TipoActividad.EGRESO_GRUPO]: {
        title: 'Egreso de grupo',
        icon: UserMinus,
        color: 'bg-amber-500/10 text-amber-600',
        badge: 'Grupo',
    },

    [TipoActividad.CUENTA_CREADA]: {
        title: 'Cuenta creada',
        icon: UserPlus,
        color: 'bg-purple-500/10 text-purple-600',
        badge: 'Sistema',
    },
}