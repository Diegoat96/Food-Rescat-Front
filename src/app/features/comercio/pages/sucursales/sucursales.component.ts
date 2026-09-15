import { Component, OnInit, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { SucursalesService } from '../../../../core/services/sucursales.service';
import { Sucursal, SucursalRequest } from '../../../../core/models/sucursal.model';
import { SucursalFormComponent } from './sucursal-form.component';
import { LoadingSpinnerComponent } from '../../../../core/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../core/components/empty-state/empty-state.component';

@Component({
  selector: 'app-sucursales',
  standalone: true,
  imports: [SucursalFormComponent, LoadingSpinnerComponent, EmptyStateComponent, LucideAngularModule],
  templateUrl: './sucursales.component.html',
  styleUrl: './sucursales.component.css',
})
export class SucursalesComponent implements OnInit {
  private sucursalesService = inject(SucursalesService);

  readonly sucursales = this.sucursalesService.sucursales;
  readonly cargando = this.sucursalesService.cargando;

  readonly mostrandoFormulario = signal(false);
  readonly editando = signal<Sucursal | null>(null);
  readonly guardando = signal(false);

  ngOnInit(): void {
    this.sucursalesService.cargar().subscribe();
  }

  abrirCrear(): void {
    this.editando.set(null);
    this.mostrandoFormulario.set(true);
  }

  abrirEditar(sucursal: Sucursal): void {
    this.editando.set(sucursal);
    this.mostrandoFormulario.set(true);
  }

  cerrarFormulario(): void {
    this.mostrandoFormulario.set(false);
    this.editando.set(null);
  }

  guardar(data: SucursalRequest): void {
    const actual = this.editando();
    this.guardando.set(true);
    const finalizar = () => this.guardando.set(false);
    if (actual) {
      this.sucursalesService.actualizar(actual.id, data).subscribe({
        next: () => this.cerrarFormulario(),
        error: finalizar,
        complete: finalizar,
      });
    } else {
      this.sucursalesService.crear(data).subscribe({
        next: () => this.cerrarFormulario(),
        error: finalizar,
        complete: finalizar,
      });
    }
  }
}
