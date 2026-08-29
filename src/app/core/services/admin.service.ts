import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Usuario } from '../models/usuario.model';
import { AdminEstadisticas } from '../models/admin-estadisticas.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  readonly usuarios = signal<Usuario[]>([]);
  readonly cargandoUsuarios = signal(false);
  readonly cargandoEstadisticas = signal(false);
  readonly estadisticas = signal<AdminEstadisticas | null>(null);

  constructor(private api: ApiService) {}

  cargarUsuarios(): Observable<Usuario[]> {
    this.cargandoUsuarios.set(true);
    return this.api.get<Usuario[]>('/admin/usuarios').pipe(
      tap((lista) => {
        this.usuarios.set(lista);
        this.cargandoUsuarios.set(false);
      }),
    );
  }

  cargarEstadisticas(): Observable<AdminEstadisticas> {
    this.cargandoEstadisticas.set(true);
    return this.api.get<AdminEstadisticas>('/admin/estadisticas').pipe(
      tap((data) => {
        this.estadisticas.set(data);
        this.cargandoEstadisticas.set(false);
      }),
    );
  }

  suspender(id: string): Observable<Usuario> {
    return this.api.patch<Usuario>(`/admin/usuarios/${id}/suspender`, {}).pipe(
      tap((usuario) => this.actualizarLocal(usuario)),
    );
  }

  activar(id: string): Observable<Usuario> {
    return this.api.patch<Usuario>(`/admin/usuarios/${id}/activar`, {}).pipe(
      tap((usuario) => this.actualizarLocal(usuario)),
    );
  }

  toggleEstado(usuario: Usuario): Observable<Usuario> {
    return usuario.activo ? this.suspender(usuario.id) : this.activar(usuario.id);
  }

  private actualizarLocal(usuario: Usuario): void {
    this.usuarios.update((lista) =>
      lista.map((u) => (u.id === usuario.id ? { ...u, activo: usuario.activo } : u)),
    );
  }
}