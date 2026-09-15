import { Injectable, signal, computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { Usuario } from '../models/usuario.model';
import { AuthResponse, LoginRequest, RegisterRequest, RegisterResponse } from '../models/auth-response.model';
import { Rol } from '../models/rol.enum';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';

  currentUser = signal<Usuario | null>(null);
  isAuthenticated = computed(() => this.currentUser() !== null);

  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/login', credentials).pipe(
      tap((res) => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
        this.currentUser.set(res.user);
      }),
    );
  }

  // El backend no devuelve accessToken al registrar; solo crea el usuario CLIENT.
  // El cliente debe iniciar sesión después de registrarse.
  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.api.post<RegisterResponse>('/auth/register', data);
  }

  cargarSesion(): Observable<Usuario | null> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      this.currentUser.set(null);
      return of(null);
    }

    return this.api.get<Usuario>('/auth/me').pipe(
      tap((user) => {
        this.currentUser.set(user);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.logout();
        }
        return of(null);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  redirectByRole(role: Rol): void {
    switch (role) {
      case Rol.CLIENT:
        this.router.navigate(['/cliente/feed']);
        break;
      case Rol.BUSINESS:
        this.router.navigate(['/comercio/inicio']);
        break;
      case Rol.ADMIN:
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/auth/login']);
    }
  }
}
