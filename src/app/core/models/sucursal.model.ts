export interface Sucursal {
  id: string;
  comercioId: string;
  nombreSucursal: string;
  direccion: string;
  latitud: number;
  longitud: number;
}

export interface SucursalRequest {
  nombreSucursal: string;
  direccion: string;
  latitud: number;
  longitud: number;
}
