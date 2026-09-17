import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  MiReservaCalificable,
  Valoracion,
  ValoracionRequest,
  ValoracionesPaquete,
} from '../models/valoracion.model';

@Injectable({ providedIn: 'root' })
export class ValoracionesService {
  constructor(private api: ApiService) {}

  crear(data: ValoracionRequest): Observable<Valoracion> {
    return this.api.post<Valoracion>('/ratings', data);
  }

  dePaquete(packageId: string): Observable<ValoracionesPaquete> {
    return this.api.get<ValoracionesPaquete>(`/packages/${packageId}/ratings`);
  }

  miReservaCalificable(packageId: string): Observable<MiReservaCalificable> {
    return this.api.get<MiReservaCalificable>(
      `/ratings/me/package/${packageId}`,
    );
  }
}
