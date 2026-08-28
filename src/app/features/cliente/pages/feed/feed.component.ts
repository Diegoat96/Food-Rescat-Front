import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { PaquetesService } from '../../../../core/services/paquetes.service';
import { Paquete } from '../../../../core/models/paquete.model';
import { ImpactoClienteComponent } from '../../components/impacto-cliente/impacto-cliente.component';
import { FiltroCategoriasComponent } from '../../components/filtro-categorias/filtro-categorias.component';
import { PaqueteCardComponent } from '../../components/paquete-card/paquete-card.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [ImpactoClienteComponent, FiltroCategoriasComponent, PaqueteCardComponent],
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
  readonly mensajeReserva = signal<string | null>(null);

  readonly paquetesFiltrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const cat = this.seleccionCategoria();
    return this.paquetes().filter((p) => {
      const matchCat =
        cat === 'Todo' || (p.categoria?.nombre ?? '').toLowerCase() === cat.toLowerCase();
      const matchTexto =
        texto === '' || `${p.nombre} ${p.sucursal?.nombre ?? ''}`.toLowerCase().includes(texto);
      return matchCat && matchTexto;
    });
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

  reservar(paquete: Paquete): void {
    const hora = new Date(paquete.horaLimiteRecogida).toLocaleTimeString('es-GT', {
      hour: '2-digit',
      minute: '2-digit',
    });
    this.mensajeReserva.set(`Solicitaste "${paquete.nombre}". Recógelo antes de las ${hora}.`);
  }
}
