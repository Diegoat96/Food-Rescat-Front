import { Component, OnInit, computed, inject } from '@angular/core';
import { EstadisticasClienteService } from '../../../../core/services/estadisticas-cliente.service';

@Component({
  selector: 'app-impacto-cliente',
  standalone: true,
  templateUrl: './impacto-cliente.component.html',
  styleUrl: './impacto-cliente.component.css',
})
export class ImpactoClienteComponent implements OnInit {
  private estadisticasService = inject(EstadisticasClienteService);

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
      { valor: d.totalRescates.toLocaleString('es-GT'), label: 'alimentos rescatados' },
      { valor: `${d.kgEvitados.toLocaleString('es-GT')} kg`, label: 'de CO₂ evitado' },
      { valor: `Q${d.totalAhorrado.toFixed(2)}`, label: 'ahorrados' },
    ];
  });

  ngOnInit(): void {
    this.estadisticasService.cargar().subscribe();
  }
}