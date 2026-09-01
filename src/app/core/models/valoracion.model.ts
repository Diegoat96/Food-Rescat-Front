export interface Valoracion {
  id: string;
  reservaId: string;
  clienteId: string;
  sucursalId: string;
  puntuacion: number;
  comentario?: string;
  createdAt: string;
}

export interface ValoracionRequest {
  reservaId: string;
  puntuacion: number;
  comentario?: string;
}