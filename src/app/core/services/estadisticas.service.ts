import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { EstadisticasHoy, EstadisticasKpis } from '../models/estadisticas.model';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  readonly estadisticasHoy = signal<EstadisticasHoy | null>(null);
  readonly cargando = signal(false);

  readonly kpis = signal<EstadisticasKpis | null>(null);
  readonly cargandoKpis = signal(false);

  constructor(private api: ApiService) {}

  cargarHoy(): Observable<EstadisticasHoy> {
    this.cargando.set(true);
    return this.api.get<EstadisticasHoy>('/comercios/me/estadisticas/hoy').pipe(
      tap((data) => {
        this.estadisticasHoy.set(data);
        this.cargando.set(false);
      }),
    );
  }

  cargarKpis(): Observable<EstadisticasKpis> {
    this.cargandoKpis.set(true);
    return this.api.get<EstadisticasKpis>('/comercios/me/estadisticas/kpis').pipe(
      tap((data) => {
        this.kpis.set(data);
        this.cargandoKpis.set(false);
      }),
    );
  }
}