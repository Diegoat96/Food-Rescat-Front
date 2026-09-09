import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { EstadisticasCliente } from '../models/estadisticas-cliente.model';

@Injectable({ providedIn: 'root' })
export class EstadisticasClienteService {
  readonly datos = signal<EstadisticasCliente | null>(null);
  readonly cargando = signal(false);

  constructor(private api: ApiService) {}

  cargar(): Observable<EstadisticasCliente> {
    this.cargando.set(true);
    return this.api.get<EstadisticasCliente>('/customers/me/statistics').pipe(
      tap((data) => {
        this.datos.set(data);
        this.cargando.set(false);
      }),
    );
  }
}
