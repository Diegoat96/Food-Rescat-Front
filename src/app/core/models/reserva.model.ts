export enum EstadoReserva {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
}

export interface Reserva {
  id: string;
  verificationCode: string;
  status: EstadoReserva;
  paymentMethod?: string;
  clientId?: string;
  packageId?: string;
  branchId?: string;
  notifiedExpiring?: boolean;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
  packageName?: string;
  branchName?: string;
  branchCity?: string;
  branchAddress?: string;
  pickupDeadline?: string;
  clientName?: string;
}