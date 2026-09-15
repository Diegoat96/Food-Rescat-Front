import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { finalize, switchMap } from 'rxjs';
import { ReservasService } from '../../../../core/services/reservas.service';

@Component({
  selector: 'app-verificacion-caja',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './verificacion-caja.component.html',
  styleUrl: './verificacion-caja.component.css',
})
export class VerificacionCajaComponent {
  private reservasService = inject(ReservasService);

  readonly codigo = signal('');
  readonly verificando = signal(false);
  readonly exito = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.codigo.set(value.toUpperCase());
    this.error.set(null);
    this.exito.set(null);
  }

  verificar(): void {
    const codigo = this.codigo().trim();
    if (!codigo) {
      this.error.set('Ingresa el código de verificación.');
      return;
    }
    if (this.verificando()) {
      return;
    }

    this.verificando.set(true);
    this.error.set(null);
    this.exito.set(null);

    this.reservasService
      .verificar(codigo)
      .pipe(
        switchMap((reserva) => this.reservasService.completar(reserva.id)),
        finalize(() => this.verificando.set(false)),
      )
      .subscribe({
        next: (reserva) => {
          this.exito.set(`Entrega completada para el pedido ${reserva.id.toUpperCase()}.`);
          this.codigo.set('');
          this.reservasService.cargarPendientes().subscribe();
        },
        error: () => {
          this.error.set(
            'Código inválido o ya fue verificado. Verifica que coincida con una entrega pendiente.',
          );
        },
      });
  }
}