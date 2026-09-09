import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Sucursal, SucursalRequest } from '../models/sucursal.model';

@Injectable({ providedIn: 'root' })
export class SucursalesService {
  readonly sucursales = signal<Sucursal[]>([]);
  readonly cargando = signal(false);

  constructor(private api: ApiService) {}

  cargar(): Observable<Sucursal[]> {
    this.cargando.set(true);
    return this.api.get<Sucursal[]>('/branches').pipe(
      tap((lista) => {
        this.sucursales.set(lista);
        this.cargando.set(false);
      }),
    );
  }

  crear(data: SucursalRequest): Observable<Sucursal> {
    return this.api.post<Sucursal>('/branches', data).pipe(
      tap((nueva) => {
        this.sucursales.update((lista) => [...lista, nueva]);
      }),
    );
  }

  actualizar(id: string, data: SucursalRequest): Observable<Sucursal> {
    return this.api.patch<Sucursal>(`/branches/${id}`, data).pipe(
      tap((editada) => {
        this.sucursales.update((lista) => lista.map((s) => (s.id === id ? editada : s)));
      }),
    );
  }
}
