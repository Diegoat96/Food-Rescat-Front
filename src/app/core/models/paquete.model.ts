import { EstadoPaquete } from './estado-paquete.enum';

export interface Paquete {
  id: string;
  nombre: string;
  categoria: { id: string; nombre: string } | null;
  sucursal: { id: string; nombre: string; direccion: string; ciudad?: string } | null;
  cantidadStock: number;
  horaLimiteRecogida: string;
  esDonacion: boolean;
  precioOriginal: number | null;
  precioDescuento: number | null;
  pesoEstimadoKg: number;
  estado: EstadoPaquete;
  urgente: boolean;
  porcentajeDescuento: number | null;
}

export interface PaqueteRequest {
  producto: string;
  categoriaId: string;
  sucursalId: string;
  cantidadStock: number;
  horaLimiteRecogida: string;
  esDonacion: boolean;
  precioOriginal?: number;
  precioDescuento?: number;
  pesoEstimadoKg: number;
}

export interface PaquetesQuery {
  ciudad?: string;
  categoria?: string;
  estado?: EstadoPaquete;
  skip?: number;
  take?: number;
}
