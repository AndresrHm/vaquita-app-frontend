import {
  Receipt,
  CheckCircle2,
  Users,
  UserMinus,
  UserPlus,
  Pencil,
  Trash2,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react'
import { TipoActividad } from '@/domain/enums/tipoActividad'

// TODO: Revisar esto de acá porque metí tipoActividad . . . porque sino rompía activity card (estilos).

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

[TipoActividad.GASTO_CREADO]: {
  title: 'Gasto creado',
  icon: Receipt,
  color: 'bg-blue-500/10 text-blue-600',
  badge: 'Gasto',
},

[TipoActividad.GASTO_ELIMINADO]: {
  title: 'Gasto eliminado',
  icon: Trash2,
  color: 'bg-red-500/10 text-red-600',
  badge: 'Gasto',
},

[TipoActividad.GASTO_ACTUALIZADO]: {
  title: 'Gasto actualizado',
  icon: Pencil,
  color: 'bg-amber-500/10 text-amber-600',
  badge: 'Gasto',
},

[TipoActividad.GASTO_DEUDA]: {
  title: 'Deuda generada',
  icon: Wallet,
  color: 'bg-orange-500/10 text-orange-600',
  badge: 'Deuda',
},

[TipoActividad.DEUDA_SALDADA]: {
  title: 'Deuda saldada',
  icon: CheckCircle2,
  color: 'bg-emerald-500/10 text-emerald-600',
  badge: 'Deuda',
},

[TipoActividad.PAGO_REALIZADO]: {
  title: 'Pago realizado',
  icon: ArrowUpCircle,
  color: 'bg-violet-500/10 text-violet-600',
  badge: 'Pago',
},

[TipoActividad.PAGO_RECIBIDO]: {
  title: 'Pago recibido',
  icon: ArrowDownCircle,
  color: 'bg-cyan-500/10 text-cyan-600',
  badge: 'Pago',
},
}
