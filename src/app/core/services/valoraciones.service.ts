import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Valoracion, ValoracionRequest } from '../models/valoracion.model';

@Injectable({ providedIn: 'root' })
export class ValoracionesService {
  constructor(private api: ApiService) {}

  crear(data: ValoracionRequest): Observable<Valoracion> {
    return this.api.post<Valoracion>('/valoraciones', data);
  }

  obtenerDeReserva(reservaId: string): Observable<Valoracion> {
    return this.api.get<Valoracion>(`/valoraciones/reserva/${reservaId}`);
  }
}