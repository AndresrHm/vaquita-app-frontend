export enum TipoActividad {
    INGRESO_GRUPO = 'INGRESO_GRUPO',
    GASTO_CREADO = 'GASTO_CREADO',
    GASTO_ACTUALIZADO = 'GASTO_ACTUALIZADO',
    GASTO_ELIMINADO = 'GASTO_ELIMINADO',
    PAGO_REALIZADO = 'PAGO_REALIZADO',
    PAGO_RECIBIDO = 'PAGO_RECIBIDO',
    // Agregar más tipos según corresponda
}

// activityLabels.ts
export const TipoActividadLabels: Record<TipoActividad, string> = {
    [TipoActividad.INGRESO_GRUPO]: 'Ingreso al grupo',
    [TipoActividad.GASTO_CREADO]: 'Gasto creado',
    [TipoActividad.GASTO_ACTUALIZADO]: 'Gasto actualizado',
    [TipoActividad.GASTO_ELIMINADO]: 'Gasto eliminado',
    [TipoActividad.PAGO_REALIZADO]: 'Pago realizado',
    [TipoActividad.PAGO_RECIBIDO]: 'Pago recibido',
}