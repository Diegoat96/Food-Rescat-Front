import { Component, OnInit, inject, signal } from '@angular/core';
import { ReservasService } from '../../../../core/services/reservas.service';
import { Reserva } from '../../../../core/models/reserva.model';
import { ValoracionFormComponent } from '../../components/valoracion-form/valoracion-form.component';
import { LoadingSpinnerComponent } from '../../../../core/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../core/components/empty-state/empty-state.component';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [
    ValoracionFormComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
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
            .filter((r) => r.estado === 'COMPLETADA')
            .sort(
              (a, b) =>
                new Date(b.completadaEn ?? b.createdAt ?? 0).getTime() -
                new Date(a.completadaEn ?? a.createdAt ?? 0).getTime(),
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

  onValorada(id: string): void {
    this.reservas.update((lista) =>
      lista.map((r) => (r.id === id ? { ...r, valorada: true } : r)),
    );
  }

  fechaCompletada(reserva: Reserva): string {
    const iso = reserva.completadaEn ?? reserva.createdAt;
    const fecha = new Date(iso ?? '');
    if (!iso || Number.isNaN(fecha.getTime())) {
      return '';
    }
    return fecha.toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric' });
  }
}