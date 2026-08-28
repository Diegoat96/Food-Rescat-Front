import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  readonly categorias = signal<Categoria[]>([]);

  constructor(private api: ApiService) {}

  cargar(): Observable<Categoria[]> {
    return this.api.get<Categoria[]>('/categorias').pipe(
      tap((lista) => {
        this.categorias.set(lista);
      }),
    );
  }
}
