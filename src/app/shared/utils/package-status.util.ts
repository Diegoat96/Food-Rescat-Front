const ETIQUETAS_ES: Record<string, string> = {
  AVAILABLE: 'Disponible',
  RESERVED: 'Reservado',
  PICKED_UP: 'Recogido',
  EXPIRED: 'Expirado',
  CANCELLED: 'Cancelado',
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  CANCELED: 'Cancelado',
};

export function packageStatusLabel(estado: string | null | undefined): string {
  if (!estado) {
    return '—';
  }
  return ETIQUETAS_ES[estado] ?? estado;
}