// Tipo de comercio de la sucursal. Contrato confirmado con backend:
// enum BusinessType = CAFETERIA | RESTAURANTE | PANADERIA | COMIDA_RAPIDA | OTRO.
export type TipoComercio =
  | 'CAFETERIA'
  | 'RESTAURANTE'
  | 'PANADERIA'
  | 'COMIDA_RAPIDA'
  | 'OTRO';

export const TIPOS_COMERCIO_LABELS: Record<TipoComercio, string> = {
  CAFETERIA: 'Cafetería',
  RESTAURANTE: 'Restaurante',
  PANADERIA: 'Panadería',
  COMIDA_RAPIDA: 'Comida rápida',
  OTRO: 'Otro',
};

export function tipoComercioLabel(tipo: TipoComercio | null | undefined): string {
  if (!tipo) {
    return '—';
  }
  return TIPOS_COMERCIO_LABELS[tipo] ?? tipo;
}

export const TIPOS_COMERCIO: TipoComercio[] = [
  'CAFETERIA',
  'RESTAURANTE',
  'PANADERIA',
  'COMIDA_RAPIDA',
  'OTRO',
];

export interface Sucursal {
  id: string;
  businessId: string;
  name: string;
  address: string;
  city?: string;
  phone?: string;
  openingHours?: string;
  businessType: TipoComercio;
}

export interface SucursalRequest {
  name: string;
  address: string;
  city?: string;
  phone?: string;
  openingHours?: string;
  businessType: TipoComercio;
}