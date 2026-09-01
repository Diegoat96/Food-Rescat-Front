import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Favorito } from '../models/favorito.model';
import { Sucursal } from '../models/sucursal.model';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  readonly favoritos = signal<Favorito[]>([]);
  readonly cargando = signal(false);

  constructor(private api: ApiService) {}

  cargar(): Observable<Favorito[]> {
    this.cargando.set(true);
    return this.api.get<Favorito[]>('/favoritos').pipe(
      tap((lista) => {
        this.favoritos.set(lista);
        this.cargando.set(false);
      }),
    );
  }

  esFavorito(sucursalId: string | null | undefined): boolean {
    if (!sucursalId) {
      return false;
    }
    return this.favoritos().some((f) => (f.sucursal?.id ?? f.id) === sucursalId);
  }

  toggle(sucursalId: string): Observable<unknown> {
    if (this.esFavorito(sucursalId)) {
      return this.api.delete(`/favoritos/${sucursalId}`).pipe(
        tap(() => {
          this.favoritos.update((lista) =>
            lista.filter((f) => (f.sucursal?.id ?? f.id) !== sucursalId),
          );
        }),
      );
    }
    return this.api.post<Favorito>(`/favoritos/${sucursalId}`, {}).pipe(
      tap((favorito) => {
        const nuevo: Favorito = favorito?.sucursal
          ? favorito
          : { id: favorito?.id ?? sucursalId, sucursal: { id: sucursalId } as Sucursal };
        this.favoritos.update((lista) => [...lista, nuevo]);
      }),
    );
  }
}