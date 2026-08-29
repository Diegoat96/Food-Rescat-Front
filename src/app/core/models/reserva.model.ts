export enum EstadoReserva {
  PENDIENTE = 'PENDIENTE',
  COMPLETADA = 'COMPLETADA',
  EXPIRADA = 'EXPIRADA',
  CANCELADA = 'CANCELADA',
}

export interface Reserva {
  id: string;
  codigoVerificacion: string;
  estado: EstadoReserva;
  clienteId: string;
  clienteNombre?: string;
  paqueteId: string;
  paqueteNombre?: string;
  sucursalId: string;
  sucursalNombre?: string;
  sucursalCiudad?: string;
  sucursalDireccion?: string;
  horaLimiteRecogida?: string;
  createdAt?: string;
  completadaEn?: string;
  valorada?: boolean;
}

export interface ReservaResponse {
  reserva: Reserva;
  mensaje?: string;
}