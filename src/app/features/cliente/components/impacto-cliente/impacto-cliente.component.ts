import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { EstadisticasClienteService } from '../../../../core/services/estadisticas-cliente.service';

@Component({
  selector: 'app-impacto-cliente',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './impacto-cliente.component.html',
  styleUrl: './impacto-cliente.component.css',
})
export class ImpactoClienteComponent implements OnInit, OnDestroy {
  private estadisticasService = inject(EstadisticasClienteService);
  private sub?: Subscription;

  readonly cargando = this.estadisticasService.cargando;

  readonly datos = computed(() => {
    const d = this.estadisticasService.datos();
    if (!d) {
      return [
        { valor: '—', label: 'alimentos rescatados' },
        { valor: '—', label: 'kg de CO₂ evitado' },
        { valor: '—', label: 'Q ahorrados' },
      ];
    }
    return [
      { valor: (d.totalRescues ?? 0).toLocaleString('es-GT'), label: 'alimentos rescatados' },
      { valor: `${(d.kgSaved ?? 0).toLocaleString('es-GT')} kg`, label: 'de CO₂ evitado' },
      { valor: `Q${(d.totalSaved ?? 0).toFixed(2)}`, label: 'ahorrados' },
    ];
  });

  ngOnInit(): void {
    this.cargar();

    // Refresco automático cada 30s (mismo patrón que estadisticas-hoy.component)
    this.sub = interval(30000).subscribe(() => {
      this.cargar();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private cargar(): void {
    this.estadisticasService.cargar().subscribe({
      error: () => {
        // Manejo silencioso en fondo para evitar bloqueos visuales
      }
    });
  }
}