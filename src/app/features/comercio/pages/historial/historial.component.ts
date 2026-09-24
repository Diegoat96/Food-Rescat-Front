import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { PaquetesService } from '../../../../core/services/paquetes.service';
import { SucursalesService } from '../../../../core/services/sucursales.service';
import { Paquete } from '../../../../core/models/paquete.model';
import { EstadoPaquete } from '../../../../core/models/estado-paquete.enum';
import { categoryLabel } from '../../../../core/models/categoria.model';
import { packageStatusLabel } from '../../../../shared/utils/package-status.util';
import { LoadingSpinnerComponent } from '../../../../core/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../core/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';

const TAKE = 10;

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [
    LucideAngularModule,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css',
})
export class HistorialComponent implements OnInit {
  private paquetesService = inject(PaquetesService);
  private sucursalesService = inject(SucursalesService);

  readonly sucursales = this.sucursalesService.sucursales;

  readonly paquetes = signal<Paquete[]>([]);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);
  readonly total = signal(0);
  readonly pagina = signal(0);

  readonly sucursalFiltro = signal('');
  readonly estadoFiltro = signal('');

  readonly paqueteACancelar = signal<Paquete | null>(null);
  readonly errorCancelar = signal<string | null>(null);

  readonly estados = Object.values(EstadoPaquete);
  readonly packageStatusLabel = packageStatusLabel;

  readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.total() / TAKE)));

  ngOnInit(): void {
    this.sucursalesService.cargar().subscribe();
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.paquetesService
      .cargarMisPaquetes({
        branchId: this.sucursalFiltro() || undefined,
        status: this.estadoFiltro() ? (this.estadoFiltro() as EstadoPaquete) : undefined,
        skip: this.pagina() * TAKE,
        take: TAKE,
      })
      .subscribe({
        next: (pag) => {
          this.paquetes.set(pag.data);
          this.total.set(pag.total);
          this.cargando.set(false);
        },
        error: () => {
          this.cargando.set(false);
          this.error.set('No se pudo cargar el historial. Intenta de nuevo.');
        },
      });
  }

  cambiarFiltroSucursal(event: Event): void {
    this.sucursalFiltro.set((event.target as HTMLSelectElement).value);
    this.pagina.set(0);
    this.cargar();
  }

  cambiarFiltroEstado(event: Event): void {
    this.estadoFiltro.set((event.target as HTMLSelectElement).value);
    this.pagina.set(0);
    this.cargar();
  }

  irAnterior(): void {
    if (this.pagina() > 0) {
      this.pagina.update((p) => p - 1);
      this.cargar();
    }
  }

  irSiguiente(): void {
    if (this.pagina() < this.totalPaginas() - 1) {
      this.pagina.update((p) => p + 1);
      this.cargar();
    }
  }

  fecha(paquete: Paquete): string {
    const fecha = new Date(paquete.pickupDeadline);
    if (!paquete.pickupDeadline || Number.isNaN(fecha.getTime())) {
      return '—';
    }
    return fecha.toLocaleDateString('es-GT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  hora(paquete: Paquete): string {
    const fecha = new Date(paquete.pickupDeadline);
    if (!paquete.pickupDeadline || Number.isNaN(fecha.getTime())) {
      return '—';
    }
    return fecha.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }) + ' hrs';
  }

  categoria(paquete: Paquete): string {
    return categoryLabel(paquete.category?.name) || '—';
  }

  badge(estado: string): { bag: string; texto: string } {
    const texto = packageStatusLabel(estado);
    switch (estado) {
      case EstadoPaquete.AVAILABLE:
        return { bag: 'bg-green-100 text-green-800', texto };
      case EstadoPaquete.RESERVED:
        return { bag: 'bg-blue-100 text-blue-800', texto };
      case EstadoPaquete.PICKED_UP:
        return { bag: 'bg-gray-100 text-gray-600', texto };
      case EstadoPaquete.EXPIRED:
        return { bag: 'bg-red-100 text-red-700', texto };
      case EstadoPaquete.CANCELLED:
        return { bag: 'bg-red-100 text-red-700', texto };
      default:
        return { bag: 'bg-gray-100 text-gray-600', texto };
    }
  }

  puedeCancelar(paquete: Paquete): boolean {
    return paquete.status === EstadoPaquete.AVAILABLE || paquete.status === EstadoPaquete.RESERVED;
  }

  preguntarCancelar(paquete: Paquete): void {
    this.paqueteACancelar.set(paquete);
    this.errorCancelar.set(null);
  }

  cerrarConfirmacion(): void {
    this.paqueteACancelar.set(null);
  }

  cancelarConfirmado(): void {
    const paquete = this.paqueteACancelar();
    if (!paquete) {
      return;
    }
    this.errorCancelar.set(null);
    this.paquetesService.cancelarPaquete(paquete.id).subscribe({
      next: () => {
        this.paqueteACancelar.set(null);
        this.cargar();
      },
      // Contrato confirmado con backend: 403 (ajeno), 404 (inexistente), 409 (no
      // cancelable desde el estado actual).
      error: (err) => {
        this.paqueteACancelar.set(null);
        if (err?.status === 409) {
          this.errorCancelar.set(
            'El paquete ya no se puede dar de baja porque su estado cambió.',
          );
        } else if (err?.status === 403) {
          this.errorCancelar.set('No tienes permisos para dar de baja este paquete.');
        } else if (err?.status === 404) {
          this.errorCancelar.set('El paquete ya no existe.');
        } else {
          this.errorCancelar.set('No se pudo dar de baja el paquete. Intenta de nuevo.');
        }
      },
    });
  }
}