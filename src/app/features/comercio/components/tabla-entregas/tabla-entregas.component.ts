import { Component, OnInit, inject } from '@angular/core';
import { ReservasService } from '../../../../core/services/reservas.service';
import { Reserva } from '../../../../core/models/reserva.model';
import { LoadingSpinnerComponent } from '../../../../core/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../core/components/empty-state/empty-state.component';

@Component({
  selector: 'app-tabla-entregas',
  standalone: true,
  imports: [LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './tabla-entregas.component.html',
  styleUrl: './tabla-entregas.component.css',
})
export class TablaEntregasComponent implements OnInit {
  private reservasService = inject(ReservasService);

  readonly pendientes = this.reservasService.pendientes;
  readonly cargando = this.reservasService.cargandoPendientes;

  ngOnInit(): void {
    this.reservasService.cargarPendientes().subscribe();
  }

  idCorto(reserva: Reserva): string {
    return reserva.id.length > 8 ? reserva.id.slice(0, 8).toUpperCase() : reserva.id.toUpperCase();
  }

  horaRecogida(reserva: Reserva): string {
    // Buscamos dentro de package, ya que el backend lo manda anidado ahí
    const raw = (reserva as any).package?.pickupDeadline || reserva.pickupDeadline;
    if (!raw) return '—';

    // Si viene en formato simple "HH:mm" o "HH:mm:ss"
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(raw)) {
      return raw.slice(0, 5) + ' hrs';
    }

    // Si viene como fecha ISO estándar
    const fecha = new Date(raw);
    if (!Number.isNaN(fecha.getTime())) {
      return fecha.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }) + ' hrs';
    }

    return raw;
  }

  badge(reserva: Reserva): { bag: string; texto: string } {
    if (reserva.status === 'COMPLETED') {
      return { bag: 'bg-green-100 text-green-800', texto: 'Rescatado' };
    }
    if (reserva.status === 'EXPIRED' || reserva.status === 'CANCELED') {
      return { bag: 'bg-border text-text-muted', texto: reserva.status };
    }
    return { bag: 'bg-amber-100 text-amber-800', texto: 'Pendiente' };
  }
}