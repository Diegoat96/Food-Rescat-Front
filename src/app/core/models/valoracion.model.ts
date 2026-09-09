export interface Valoracion {
  id: string;
  reservationId: string;
  clientId: string;
  branchId: string;
  score: number;
  comment?: string;
  createdAt: string;
}

export interface ValoracionRequest {
  reservationId: string;
  score: number;
  comment?: string;
}
