import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Reserva, ReservaResponse } from '../models/reserva.model';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  readonly pendientes = signal<Reserva[]>([]);
  readonly cargandoPendientes = signal(false);

  constructor(private api: ApiService) {}

  reservar(paqueteId: string): Observable<ReservaResponse> {
    return this.api.post<ReservaResponse>(`/paquetes/${paqueteId}/reservar`, {});
  }

  verificar(codigoVerificacion: string): Observable<Reserva> {
    return this.api.post<Reserva>('/reservas/verificar', { codigoVerificacion });
  }

  completar(reservaId: string): Observable<Reserva> {
    return this.api.patch<Reserva>(`/reserva/${reservaId}/completar`, {});
  }

  cargarPendientes(): Observable<Reserva[]> {
    this.cargandoPendientes.set(true);
    return this.api.get<Reserva[]>('/reservas/pendientes').pipe(
      tap((lista) => {
        this.pendientes.set(lista);
        this.cargandoPendientes.set(false);
      }),
    );
  }

  misReservas(): Observable<Reserva[]> {
    return this.api.get<Reserva[]>('/clientes/me/reservas');
  }
}