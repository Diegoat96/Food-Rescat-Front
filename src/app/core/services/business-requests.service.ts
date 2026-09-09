import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { BusinessRequest } from '../models/business-request.model';

@Injectable({ providedIn: 'root' })
export class BusinessRequestsService {
  readonly solicitudActual = signal<BusinessRequest | null>(null);
  readonly cargando = signal(false);

  constructor(private api: ApiService) {}

  crear(formData: FormData): Observable<BusinessRequest> {
    return this.api.post<BusinessRequest>('/business-requests', formData);
  }

  miSolicitud(): Observable<BusinessRequest> {
    this.cargando.set(true);
    return this.api.get<BusinessRequest>('/business-requests/me').pipe(
      tap((data) => {
        this.solicitudActual.set(data);
        this.cargando.set(false);
      }),
    );
  }
}
