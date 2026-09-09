// TODO: Verificar campos exactos contra el Swagger del backend real.
// Estos nombres son una estimación basada en el README.
export interface EstadisticasHoy {
  kgRescatadosHoy: number;
  pedidosCompletadosHoy: number;
  ingresosHoy: number;
}

export interface EstadisticasKpis {
  paquetesActivos: number;
  pendientesHoy: number;
  kgRescatadosHoy: number;
  ingresosSemana: number;
}
