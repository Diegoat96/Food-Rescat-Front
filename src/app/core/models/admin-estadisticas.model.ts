export interface RescateDiario {
  fecha: string;
  kg: number;
}

export interface AdminEstadisticas {
  totalUsuarios: number;
  totalComercios: number;
  totalRescates: number;
  totalKgRescatados: number;
  rescatadosUltimos7Dias: RescateDiario[];
}