import { Component, OnInit, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ReservasService } from '../../../../core/services/reservas.service';
import { Reserva } from '../../../../core/models/reserva.model';
import { LoadingSpinnerComponent } from '../../../../core/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../core/components/empty-state/empty-state.component';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [
    LoadingSpinnerComponent,
    EmptyStateComponent,
    LucideAngularModule,
  ],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css',
})
export class HistorialComponent implements OnInit {
  private reservasService = inject(ReservasService);

  readonly reservas = signal<Reserva[]>([]);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.reservasService.misReservas().subscribe({
      next: (lista) => {
        this.reservas.set(
          lista
            .filter((r) => r.status === 'COMPLETED')
            .sort(
              (a, b) =>
                new Date(b.completedAt ?? b.createdAt ?? 0).getTime() -
                new Date(a.completedAt ?? a.createdAt ?? 0).getTime(),
            ),
        );
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('No se pudo cargar tu historial. Intenta de nuevo.');
      },
    });
  }

  fechaCompletada(reserva: Reserva): string {
    const iso = reserva.completedAt ?? reserva.createdAt;
    const fecha = new Date(iso ?? '');
    if (!iso || Number.isNaN(fecha.getTime())) {
      return '';
    }
    return fecha.toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric' });
  }
}
