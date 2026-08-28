import { Rol } from './rol.enum';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
}
