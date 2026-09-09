import { Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
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

  // NOTA: el backend real NO expone un endpoint de historial de reservas del cliente
  // (verificado en /api/docs-json). No se inventa una ruta; se retorna vacío.
  misReservas(): Observable<Reserva[]> {
    return of([]);
  }
}
