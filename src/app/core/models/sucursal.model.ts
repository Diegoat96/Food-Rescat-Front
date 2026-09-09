export interface Sucursal {
  id: string;
  businessId: string;
  name: string;
  address: string;
  city?: string;
  phone?: string;
  openingHours?: string;
}

export interface SucursalRequest {
  name: string;
  address: string;
  city?: string;
  phone?: string;
  openingHours?: string;
}
