import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { PublicarPaqueteFormComponent } from '../../components/publicar-paquete-form/publicar-paquete-form.component';
import { EstadisticasService } from '../../../../core/services/estadisticas.service';
import { PaquetesService } from '../../../../core/services/paquetes.service';
import { categoryLabel } from '../../../../core/models/categoria.model';
import { LoadingSpinnerComponent } from '../../../../core/components/loading-spinner/loading-spinner.component';

interface UltimaPublicacion {
  titulo: string;
  categoria: string;
  hora: string;
  estado: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, PublicarPaqueteFormComponent, LoadingSpinnerComponent, LucideAngularModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent implements OnInit, OnDestroy {
  private estadisticasService = inject(EstadisticasService);
  private paquetesService = inject(PaquetesService);
  private sub?: Subscription;

  readonly kpis = this.estadisticasService.kpis;
  readonly cargandoKpis = this.estadisticasService.cargandoKpis;

  readonly ultimas = signal<UltimaPublicacion[]>([]);

  readonly metricas = computed(() => {
    const k = this.kpis();
    if (!k) {
      return [];
    }
    return [
      { label: 'Paquetes activos', valor: String(k.activePackages ?? 0), icono: 'package' },
      { label: 'Pendientes hoy', valor: String(k.pendingToday ?? 0), icono: 'hourglass' },
      {
        label: 'Ingresos esta semana',
        valor: `Q${Number(k.weeklyRevenue ?? 0).toFixed(2)}`,
        icono: 'wallet',
      },
    ];
  });

  ngOnInit(): void {
    this.cargarKpis();
    this.cargarUltimas();

    // Refresco automático cada 30s (mismo patrón que estadisticas-hoy.component)
    this.sub = interval(30000).subscribe(() => {
      this.cargarKpis();
      this.cargarUltimas();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  cargarKpis(): void {
    this.estadisticasService.cargarKpis().subscribe();
  }

  // Últimas publicaciones reales: GET /merchants/me/packages (take=5).
  // Contrato confirmado con backend.
  cargarUltimas(): void {
    this.paquetesService.cargarMisPaquetes({ take: 5 }).subscribe({
      next: (pag) => {
        this.ultimas.set(
          pag.data.map((p) => ({
            titulo: p.name,
            categoria: categoryLabel(p.category?.name) || '—',
            hora: this.horaRecogida(p.pickupDeadline),
            estado: this.etiquetaEstado(p.status),
          })),
        );
      },
      error: () => {
        this.ultimas.set([]);
      },
    });
  }

  private horaRecogida(iso: string): string {
    if (!iso) {
      return '—';
    }
    const fecha = new Date(iso);
    if (Number.isNaN(fecha.getTime())) {
      return '—';
    }
    return fecha.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
  }

  private etiquetaEstado(estado: string): string {
    switch (estado) {
      case 'AVAILABLE':
        return 'Activo';
      case 'RESERVED':
        return 'Pendiente';
      case 'PICKED_UP':
        return 'Recogido';
      case 'EXPIRED':
        return 'Vencido';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return estado;
    }
  }
}