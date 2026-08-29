import { Component, HostListener, inject, signal } from '@angular/core';
import { NotificacionesService } from '../../../../core/services/notificaciones.service';
import { LoadingSpinnerComponent } from '../../../../core/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../core/components/empty-state/empty-state.component';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.css',
})
export class NotificacionesComponent {
  private notificacionesService = inject(NotificacionesService);

  readonly notificaciones = this.notificacionesService.notificaciones;
  readonly noLeidas = this.notificacionesService.noLeidas;
  readonly cargando = this.notificacionesService.cargando;

  readonly abierto = signal(false);

  alternar(): void {
    this.abierto.update((v) => !v);
    if (!this.abierto()) {
      return;
    }
    this.notificacionesService.cargar().subscribe();
  }

  marcarLeida(id: string): void {
    this.notificacionesService.marcarLeida(id).subscribe();
  }

  fecha(iso: string): string {
    const fecha = new Date(iso);
    if (Number.isNaN(fecha.getTime())) {
      return '';
    }
    return fecha.toLocaleDateString('es-GT', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target && !target.closest('.app-notificaciones')) {
      this.abierto.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.abierto.set(false);
  }
}