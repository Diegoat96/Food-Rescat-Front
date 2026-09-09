import { Rol } from './rol.enum';

export interface Usuario {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Rol;
  isActive?: boolean;
}
