import { Usuario } from './usuario.model';

export interface AuthResponse {
  accessToken: string;
  user: Usuario;
}

export type RegisterResponse = Usuario;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}
