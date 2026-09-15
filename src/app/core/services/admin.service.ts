import { Injectable, signal } from '@angular/core';
import { Observable, finalize, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Usuario } from '../models/usuario.model';
import { AdminEstadisticas } from '../models/admin-estadisticas.model';
import { BusinessRequest, BusinessRequestStatus } from '../models/business-request.model';
import { PaginatedData } from '../models/paginated-data.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  readonly usuarios = signal<Usuario[]>([]);
  readonly cargandoUsuarios = signal(false);
  readonly cargandoEstadisticas = signal(false);
  readonly estadisticas = signal<AdminEstadisticas | null>(null);

  readonly solicitudes = signal<BusinessRequest[]>([]);
  readonly cargandoSolicitudes = signal(false);

  constructor(private api: ApiService) {}

  cargarUsuarios(): Observable<Usuario[]> {
    this.cargandoUsuarios.set(true);
    return this.api.get<PaginatedData<Usuario>>('/admin/users').pipe(
      map((pag) => pag.data),
      tap((lista) => {
        this.usuarios.set(lista);
      }),
      finalize(() => this.cargandoUsuarios.set(false)),
    );
  }

  cargarEstadisticas(): Observable<AdminEstadisticas> {
    this.cargandoEstadisticas.set(true);
    return this.api.get<AdminEstadisticas>('/admin/statistics').pipe(
      tap((data) => {
        this.estadisticas.set(data);
      }),
      finalize(() => this.cargandoEstadisticas.set(false)),
    );
  }

  toggleEstado(usuario: Usuario): Observable<Usuario> {
    const nuevoEstado = !usuario.isActive;
    return this.api.patch<Usuario>(`/admin/users/${usuario.id}`, { isActive: nuevoEstado }).pipe(
      tap((actualizado) => {
        this.usuarios.update((lista) =>
          lista.map((u) => (u.id === actualizado.id ? { ...u, isActive: actualizado.isActive } : u)),
        );
      }),
    );
  }

  cargarSolicitudes(status?: string): Observable<BusinessRequest[]> {
    this.cargandoSolicitudes.set(true);
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.api.get<PaginatedData<BusinessRequest>>(`/admin/business-requests${query}`).pipe(
      map((pag) => pag.data),
      tap((lista) => {
        this.solicitudes.set(lista);
      }),
      finalize(() => this.cargandoSolicitudes.set(false)),
    );
  }

  aprobarSolicitud(id: string): Observable<BusinessRequest> {
    return this.api.patch<BusinessRequest>(`/admin/business-requests/${id}/approve`, {}).pipe(
      tap(() => {
        this.solicitudes.update((lista) =>
          lista.map((s) => (s.id === id ? { ...s, status: BusinessRequestStatus.APPROVED } : s)),
        );
      }),
    );
  }

  rechazarSolicitud(id: string, reason: string): Observable<BusinessRequest> {
    return this.api.patch<BusinessRequest>(`/admin/business-requests/${id}/reject`, { reason }).pipe(
      tap(() => {
        this.solicitudes.update((lista) =>
          lista.map((s) => (s.id === id ? { ...s, status: BusinessRequestStatus.REJECTED, reason } : s)),
        );
      }),
    );
  }
}
