import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Paquete, PaqueteRequest, PaquetesQuery } from '../models/paquete.model';

@Injectable({ providedIn: 'root' })
export class PaquetesService {
  readonly paquetes = signal<Paquete[]>([]);
  readonly cargando = signal(false);

  constructor(private api: ApiService) {}

  cargar(query?: PaquetesQuery): Observable<Paquete[]> {
    this.cargando.set(true);
    return this.api.get<Paquete[]>(`/paquetes${this.buildQuery(query)}`).pipe(
      tap((lista) => {
        this.paquetes.set(lista);
        this.cargando.set(false);
      }),
    );
  }

  obtener(id: string): Observable<Paquete> {
    return this.api.get<Paquete>(`/paquetes/${id}`);
  }

  crear(data: PaqueteRequest): Observable<Paquete> {
    return this.api.post<Paquete>('/paquetes', data).pipe(
      tap((nuevo) => {
        this.paquetes.update((lista) =>
          lista.some((p) => p.id === nuevo.id) ? lista : [nuevo, ...lista],
        );
      }),
    );
  }

  private buildQuery(query?: PaquetesQuery): string {
    if (!query) {
      return '';
    }
    const params: string[] = [];
    if (query.ciudad) {
      params.push(`ciudad=${encodeURIComponent(query.ciudad)}`);
    }
    if (query.categoria) {
      params.push(`categoria=${encodeURIComponent(query.categoria)}`);
    }
    if (query.estado) {
      params.push(`estado=${encodeURIComponent(query.estado)}`);
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
