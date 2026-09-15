import { Component, OnInit, computed, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { EstadisticasService } from '../../../../core/services/estadisticas.service';
import { LoadingSpinnerComponent } from '../../../../core/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-estadisticas-hoy',
  standalone: true,
  imports: [LoadingSpinnerComponent, LucideAngularModule],
  templateUrl: './estadisticas-hoy.component.html',
  styleUrl: './estadisticas-hoy.component.css',
})
export class EstadisticasHoyComponent implements OnInit {
  private estadisticasService = inject(EstadisticasService);

  readonly datos = this.estadisticasService.estadisticasHoy;
  readonly cargando = this.estadisticasService.cargando;

  readonly kgFormateado = computed(() => {
    const d = this.datos();
    return d ? `${Number(d.kgRescuedToday ?? 0).toLocaleString('es-GT')} kg` : '—';
  });

  readonly ingresosFormateado = computed(() => {
    const d = this.datos();
    return d ? `Q${Number(d.revenueToday ?? 0).toFixed(2)}` : '—';
  });

  ngOnInit(): void {
    this.estadisticasService.cargarHoy().subscribe();
  }
}