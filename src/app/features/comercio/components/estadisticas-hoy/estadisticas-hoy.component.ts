import { Component, OnInit, OnDestroy, computed, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { EstadisticasService } from '../../../../core/services/estadisticas.service';
import { LoadingSpinnerComponent } from '../../../../core/components/loading-spinner/loading-spinner.component';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-estadisticas-hoy',
  standalone: true,
  imports: [LoadingSpinnerComponent, LucideAngularModule],
  templateUrl: './estadisticas-hoy.component.html',
  styleUrl: './estadisticas-hoy.component.css',
})
export class EstadisticasHoyComponent implements OnInit, OnDestroy {
  private estadisticasService = inject(EstadisticasService);
  private sub?: Subscription;

  readonly datos = this.estadisticasService.estadisticasHoy;
  readonly cargando = this.estadisticasService.cargando;

  readonly kgFormateado = computed(() => {
    const d = this.datos();
    return d ? `${Number(d.kgRescuedToday ?? 0).toLocaleString('es-GT')} kg` : '0 kg';
  });

  readonly ingresosFormateado = computed(() => {
    const d = this.datos();
    return d ? `Q${Number(d.revenueToday ?? 0).toFixed(2)}` : 'Q0.00';
  });

  ngOnInit(): void {
    this.cargarDatos();

    // Actualiza automáticamente cada 30 segundos para reflejar cambios al instante
    this.sub = interval(30000).subscribe(() => {
      this.cargarDatos();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private cargarDatos(): void {
    this.estadisticasService.cargarHoy().subscribe({
      error: () => {
        // Manejo silencioso en fondo para evitar bloqueos visuales
      }
    });
  }
}