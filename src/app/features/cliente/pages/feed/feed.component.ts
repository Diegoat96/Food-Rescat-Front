import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { PaquetesService } from '../../../../core/services/paquetes.service';
import { Reserva } from '../../../../core/models/reserva.model';
import { ImpactoClienteComponent } from '../../components/impacto-cliente/impacto-cliente.component';
import { FiltroCategoriasComponent } from '../../components/filtro-categorias/filtro-categorias.component';
import { PaqueteCardComponent } from '../../components/paquete-card/paquete-card.component';
import { TicketRescateModalComponent } from '../../components/ticket-rescate-modal/ticket-rescate-modal.component';
import {
  SucursalCardComponent,
  SucursalCardData,
} from '../../components/sucursal-card/sucursal-card.component';
import { LoadingSpinnerComponent } from '../../../../core/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../core/components/empty-state/empty-state.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    ImpactoClienteComponent,
    FiltroCategoriasComponent,
    PaqueteCardComponent,
    TicketRescateModalComponent,
    SucursalCardComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    LucideAngularModule,
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent {
  private paquetesService = inject(PaquetesService);
  private destroyRef = inject(DestroyRef);

  readonly paquetes = this.paquetesService.paquetes;
  readonly cargando = this.paquetesService.cargando;

  readonly busqueda = signal('');
  readonly seleccionCategoria = signal('Todo');
  readonly ticket = signal<Reserva | null>(null);

  readonly paquetesFiltrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const cat = this.seleccionCategoria();
    return this.paquetes().filter((p) => {
      // Filtra por tipo de comercio de la sucursal (no por categoría de producto).
      // TODO(backend): confirmar el campo exacto del contrato (se asume
      // paquete.branch.businessType con valores CAFETERIA/RESTAURANTE/PANADERIA/
      // COMIDA_RAPIDA/OTRO). Mientras el backend no lo exponga, los chips que no
      // sean "Todo" no matchean (comportamiento igual al bug actual).
      const matchCat =
        cat === 'Todo' || (p.branch?.businessType ?? '') === cat;
      const matchTexto =
        texto === '' || `${p.name} ${p.branch?.name ?? ''}`.toLowerCase().includes(texto);
      return matchCat && matchTexto;
    });
  });

  readonly sucursales = computed<SucursalCardData[]>(() => {
    const vistas = new Map<string, SucursalCardData>();
    for (const p of this.paquetesFiltrados()) {
      const s = p.branch;
      if (s?.id && !vistas.has(s.id)) {
        vistas.set(s.id, {
          id: s.id,
          name: s.name,
          address: s.address,
          city: s.city,
        });
      }
    }
    return [...vistas.values()];
  });

  constructor() {
    effect(() => {
      this.paquetesService.cargar().subscribe();
      const id = setInterval(() => {
        this.paquetesService.cargar().subscribe();
      }, 30000);
      this.destroyRef.onDestroy(() => clearInterval(id));
    });
  }

  onSeleccionCategoria(cat: string): void {
    this.seleccionCategoria.set(cat);
  }

  onBusqueda(event: Event): void {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  onReservaExitosa(reserva: Reserva): void {
    this.ticket.set(reserva);
  }

  cerrarTicket(): void {
    this.ticket.set(null);
    this.paquetesService.cargar().subscribe();
  }
}
