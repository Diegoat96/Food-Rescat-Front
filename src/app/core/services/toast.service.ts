import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  tipo: 'exito' | 'error' | 'info';
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private contador = 0;
  private timeout: ReturnType<typeof setTimeout> | null = null;

  mostrar(mensaje: string, tipo: Toast['tipo'] = 'info'): void {
    const id = ++this.contador;
    this.toasts.update((lista) => [...lista, { id, tipo, mensaje }]);

    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => this.quitar(id), 4000);
  }

  quitar(id: number): void {
    this.toasts.update((lista) => lista.filter((t) => t.id !== id));
  }
}