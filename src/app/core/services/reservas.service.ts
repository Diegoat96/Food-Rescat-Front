import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Reserva } from '../models/reserva.model';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  readonly pendientes = signal<Reserva[]>([]);
  readonly cargandoPendientes = signal(false);

  constructor(private api: ApiService) {}

  reservar(paqueteId: string, paymentMethod: string): Observable<Reserva> {
    return this.api.post<Reserva>(`/packages/${paqueteId}/reserve`, { paymentMethod });
  }

  verificar(verificationCode: string): Observable<Reserva> {
    return this.api.post<Reserva>('/reservations/verify', { verificationCode });
  }

  completar(reservaId: string): Observable<Reserva> {
    return this.api.patch<Reserva>(`/reservations/${reservaId}/complete`, {});
  }

  cargarPendientes(): Observable<Reserva[]> {
    this.cargandoPendientes.set(true);
    return this.api.get<Reserva[]>('/reservations/pending').pipe(
      tap((lista) => {
        this.pendientes.set(lista);
        this.cargandoPendientes.set(false);
      }),
    );
  }

  misReservas(): Observable<Reserva[]> {
    return this.api.get<Reserva[]>('/customers/me/reservations');
  }
}
