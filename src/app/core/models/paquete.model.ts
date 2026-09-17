import { EstadoPaquete } from './estado-paquete.enum';

export interface Paquete {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category: { id: string; name: string } | null;
  branch: {
    id: string;
    name: string;
    address: string;
    city?: string;
    // Tipo de comercio de la sucursal (ver TipoComercio). Contrato confirmado
    // con backend: GET /packages incluye branch.businessType.
    businessType?: string;
  } | null;
  quantity: number;
  pickupDeadline: string;
  originalPrice: number | null;
  discountedPrice: number | null;
  estimatedWeightKg: number;
  status: EstadoPaquete;
  urgent?: boolean;
  discountPercentage?: number;
  ratingAverage?: number;
  ratingCount?: number;
}

export interface PaqueteRequest {
  name: string;
  description?: string;
  categoryId: string;
  branchId: string;
  quantity: number;
  pickupDeadline: string;
  originalPrice?: number;
  discountedPrice?: number;
  estimatedWeightKg: number;
}

export interface PaquetesQuery {
  city?: string;
  categoryId?: string;
  status?: EstadoPaquete;
  businessType?: string;
  skip?: number;
  take?: number;
}

export interface PaquetesDeMiComercioQuery {
  branchId?: string;
  status?: EstadoPaquete;
  skip?: number;
  take?: number;
}

// Tipo de comercio de la sucursal. Contrato confirmado con backend:
// CAFETERIA | RESTAURANTE | PANADERIA | COMIDA_RAPIDA | OTRO.
export type TipoComercio =
  | 'CAFETERIA'
  | 'RESTAURANTE'
  | 'PANADERIA'
  | 'COMIDA_RAPIDA'
  | 'OTRO';
