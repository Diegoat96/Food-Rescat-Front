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
    return this.api.get<Favorito[]>('/favorites').pipe(
      tap((lista) => {
        this.favoritos.set(lista);
        this.cargando.set(false);
      }),
    );
  }

  esFavorito(branchId: string | null | undefined): boolean {
    if (!branchId) {
      return false;
    }
    return this.favoritos().some((f) => (f.branch?.id ?? f.id) === branchId);
  }

  toggle(branchId: string): Observable<unknown> {
    if (this.esFavorito(branchId)) {
      return this.api.delete(`/favorites/${branchId}`).pipe(
        tap(() => {
          this.favoritos.update((lista) =>
            lista.filter((f) => (f.branch?.id ?? f.id) !== branchId),
          );
        }),
      );
    }
    return this.api.post<Favorito>(`/favorites/${branchId}`, {}).pipe(
      tap((favorito) => {
        const nuevo: Favorito = favorito?.branch
          ? favorito
          : { id: favorito?.id ?? branchId, branch: { id: branchId } as Sucursal };
        this.favoritos.update((lista) => [...lista, nuevo]);
      }),
    );
  }
}
