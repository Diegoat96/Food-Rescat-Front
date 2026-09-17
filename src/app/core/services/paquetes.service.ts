import { Injectable, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Paquete, PaquetesDeMiComercioQuery, PaquetesQuery } from '../models/paquete.model';
import { PaginatedData } from '../models/paginated-data.model';

@Injectable({ providedIn: 'root' })
export class PaquetesService {
  readonly paquetes = signal<Paquete[]>([]);
  readonly cargando = signal(false);

  constructor(private api: ApiService) {}

  cargar(query?: PaquetesQuery): Observable<Paquete[]> {
    this.cargando.set(true);
    return this.api.get<PaginatedData<Paquete>>(`/packages${this.buildQuery(query)}`).pipe(
      map((pag) => pag.data),
      tap((lista) => {
        this.paquetes.set(lista);
        this.cargando.set(false);
      }),
    );
  }

  obtener(id: string): Observable<Paquete> {
    return this.api.get<Paquete>(`/packages/${id}`);
  }

  crear(data: FormData): Observable<Paquete> {
    return this.api.post<Paquete>('/packages', data).pipe(
      tap((nuevo) => {
        this.paquetes.update((lista) =>
          lista.some((p) => p.id === nuevo.id) ? lista : [nuevo, ...lista],
        );
      }),
    );
  }

  // Historial de publicaciones del comercio actual: GET /merchants/me/packages
  // con filtros de branchId/status y paginación (skip/take).
  // NOTA: contrato esperado con backend. Si el endpoint aún no existe, este método
  // queda listo para conectarse cuando el backend lo exponga.
  cargarMisPaquetes(
    query?: PaquetesDeMiComercioQuery,
  ): Observable<PaginatedData<Paquete>> {
    return this.api.get<PaginatedData<Paquete>>(
      `/merchants/me/packages${this.buildQueryDeMiComercio(query)}`,
    );
  }

  // Dar de baja un paquete propio: PATCH /packages/:id/cancel.
  // NOTA: contrato esperado con backend (misma dependencia que cargarMisPaquetes).
  cancelarPaquete(id: string): Observable<Paquete> {
    return this.api.patch<Paquete>(`/packages/${id}/cancel`, {});
  }

  private buildQuery(query?: PaquetesQuery): string {
    if (!query) {
      return '';
    }
    const params: string[] = [];
    if (query.city) {
      params.push(`city=${encodeURIComponent(query.city)}`);
    }
    if (query.categoryId) {
      params.push(`categoryId=${encodeURIComponent(query.categoryId)}`);
    }
    if (query.status) {
      params.push(`status=${encodeURIComponent(query.status)}`);
    }
    if (query.skip !== undefined) {
      params.push(`skip=${query.skip}`);
    }
    if (query.take !== undefined) {
      params.push(`take=${query.take}`);
    }
    return params.length ? `?${params.join('&')}` : '';
  }

  private buildQueryDeMiComercio(query?: PaquetesDeMiComercioQuery): string {
    if (!query) {
      return '';
    }
    const params: string[] = [];
    if (query.branchId) {
      params.push(`branchId=${encodeURIComponent(query.branchId)}`);
    }
    if (query.status) {
      params.push(`status=${encodeURIComponent(query.status)}`);
    }
    if (query.skip !== undefined) {
      params.push(`skip=${query.skip}`);
    }
    if (query.take !== undefined) {
      params.push(`take=${query.take}`);
    }
    return params.length ? `?${params.join('&')}` : '';
  }
}
