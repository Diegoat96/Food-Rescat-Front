import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { ValoracionesService } from '../../../../core/services/valoraciones.service';

@Component({
  selector: 'app-valoracion-form',
  standalone: true,
  templateUrl: './valoracion-form.component.html',
  styleUrl: './valoracion-form.component.css',
})
export class ValoracionFormComponent {
  @Input({ required: true }) reservationId!: string;
  @Output() valorada = new EventEmitter<void>();

  private valoracionesService = inject(ValoracionesService);

  readonly puntuacion = signal(0);
  readonly comentario = signal('');
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);

  readonly estrellas = [1, 2, 3, 4, 5];

  seleccionar(valor: number): void {
    this.puntuacion.set(valor);
    this.error.set(null);
  }

  onComentario(event: Event): void {
    this.comentario.set((event.target as HTMLTextAreaElement).value);
  }

  enviar(): void {
    if (this.puntuacion() === 0) {
      this.error.set('Selecciona entre 1 y 5 estrellas.');
      return;
    }
    if (this.guardando()) {
      return;
    }
    this.guardando.set(true);
    this.error.set(null);

    this.valoracionesService
      .crear({
        reservationId: this.reservationId,
        score: this.puntuacion(),
        comment: this.comentario().trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.valorada.emit();
        },
        error: () => {
          this.guardando.set(false);
          this.error.set('No se pudo guardar la valoración. Intenta de nuevo.');
        },
      });
  }
}
