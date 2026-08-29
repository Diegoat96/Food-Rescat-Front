import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicarPaqueteFormComponent } from '../../components/publicar-paquete-form/publicar-paquete-form.component';
import { EstadisticasService } from '../../../../core/services/estadisticas.service';
import { LoadingSpinnerComponent } from '../../../../core/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, PublicarPaqueteFormComponent, LoadingSpinnerComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent implements OnInit {
  private estadisticasService = inject(EstadisticasService);

  readonly kpis = this.estadisticasService.kpis;
  readonly cargandoKpis = this.estadisticasService.cargandoKpis;

  readonly metricas = computed(() => {
    const k = this.kpis();
    if (!k) {
      return [];
    }
    return [
      { label: 'Paquetes activos', valor: String(k.paquetesActivos), icono: '📦' },
      { label: 'Pendientes hoy', valor: String(k.pendientesHoy), icono: '⏳' },
      {
        label: 'Kg rescatados hoy',
        valor: `${Number(k.kgRescatadosHoy).toLocaleString('es-GT')} kg`,
        icono: '🥦',
      },
      {
        label: 'Ingresos esta semana',
        valor: `Q${Number(k.ingresosSemana).toFixed(2)}`,
        icono: '💰',
      },
    ];
  });

  readonly ultimas = [
    {
      titulo: 'Verduras de temporada',
      categoria: 'Frutas y Verduras',
      hora: '10:30',
      estado: 'Activo',
    },
    { titulo: 'Pan artesanal', categoria: 'Panadería', hora: '09:15', estado: 'Activo' },
    { titulo: 'Bebidas sin azúcar', categoria: 'Bebidas', hora: '08:40', estado: 'Pendiente' },
  ];

  ngOnInit(): void {
    this.cargarKpis();
  }

  cargarKpis(): void {
    this.estadisticasService.cargarKpis().subscribe();
  }
}