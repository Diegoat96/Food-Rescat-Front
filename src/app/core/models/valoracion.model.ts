export interface Valoracion {
  id: string;
  reservationId: string;
  clientId: string;
  branchId: string;
  packageId?: string;
  score: number;
  comment?: string;
  createdAt: string;
}

export interface ValoracionConCliente extends Valoracion {
  client?: { id: string; name: string };
}

export interface ValoracionesPaquete {
  ratings: ValoracionConCliente[];
  average: number;
  total: number;
}

export interface MiReservaCalificable {
  reservationId: string | null;
}

export interface ValoracionRequest {
  reservationId?: string;
  packageId?: string;
  score: number;
  comment?: string;
}
