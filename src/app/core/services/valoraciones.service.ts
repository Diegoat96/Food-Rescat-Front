import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Valoracion, ValoracionRequest } from '../models/valoracion.model';

@Injectable({ providedIn: 'root' })
export class ValoracionesService {
  constructor(private api: ApiService) {}

  crear(data: ValoracionRequest): Observable<Valoracion> {
    return this.api.post<Valoracion>('/ratings', data);
  }

  // TODO: Endpoint GET /ratings/reserva/:id no confirmado en backend.
  obtenerDeReserva(reservationId: string): Observable<Valoracion> {
    return this.api.get<Valoracion>(`/ratings/reservation/${reservationId}`);
  }
}
