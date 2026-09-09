import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Notificacion } from '../models/notificacion.model';

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  readonly notificaciones = signal<Notificacion[]>([]);
  readonly cargando = signal(false);

  readonly noLeidas = computed(
    () => this.notificaciones().filter((n) => !n.read).length,
  );

  constructor(private api: ApiService) {}

  cargar(): Observable<Notificacion[]> {
    this.cargando.set(true);
    return this.api.get<Notificacion[]>('/notifications').pipe(
      tap((lista) => {
        this.notificaciones.set(lista);
        this.cargando.set(false);
      }),
    );
  }

  marcarLeida(id: string): Observable<Notificacion> {
    return this.api.patch<Notificacion>(`/notifications/${id}/read`, {}).pipe(
      tap(() => {
        this.notificaciones.update((lista) =>
          lista.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
      }),
    );
  }
}
