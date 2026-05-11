export enum TipoActividad {
    MIS_DEUDAS = 'MIS_DEUDAS',
    MIS_DEUDAS_SALDADAS = 'MIS_DEUDAS_SALDADAS',
    MIS_PAGOS = 'MIS_PAGOS',
    COBROS_RECIBIDOS = 'DEUDA_SALDADA',
    INGRESO_GRUPO = 'INGRESO_GRUPO',
    EGRESO_GRUPO = 'EGRESO_GRUPO',
    CUENTA_CREADA = 'CUENTA_CREADA',
    // Agregar más tipos según corresponda
}

export const TipoActividadLabel: Record<TipoActividad, string> = {
    [TipoActividad.MIS_DEUDAS]: 'Mis deudas',
    [TipoActividad.MIS_DEUDAS_SALDADAS]: 'Mis deudas saldadas',
    [TipoActividad.MIS_PAGOS]: 'Mis pagos',
    [TipoActividad.COBROS_RECIBIDOS]: 'Deuda saldada',
    [TipoActividad.INGRESO_GRUPO]: 'Ingreso a grupo',
    [TipoActividad.EGRESO_GRUPO]: 'Egreso de grupo',
    [TipoActividad.CUENTA_CREADA]: 'Cuenta creada',
}
