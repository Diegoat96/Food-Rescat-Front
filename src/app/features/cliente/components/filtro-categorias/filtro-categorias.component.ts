import { Component, input, output } from '@angular/core';
import { TipoComercio, TIPOS_COMERCIO_LABELS } from '../../../../core/models/sucursal.model';

// Tipo de comercio de la sucursal, expuesto por el backend en
// paquete.branch.businessType (contrato confirmado). Los valores coinciden con
// el enum BusinessType del backend: CAFETERIA, RESTAURANTE, PANADERIA,
// COMIDA_RAPIDA, OTRO.
export const TIPOS_COMERCIO: { value: TipoComercio; label: string }[] = (
  Object.keys(TIPOS_COMERCIO_LABELS) as TipoComercio[]
).map((value) => ({ value, label: TIPOS_COMERCIO_LABELS[value] }));

export const CATEGORIAS_CHIPS = [
  { value: 'Todo', label: 'Todo' },
  ...TIPOS_COMERCIO,
] as const;

@Component({
  selector: 'app-filtro-categorias',
  standalone: true,
  templateUrl: './filtro-categorias.component.html',
  styleUrl: './filtro-categorias.component.css',
})
export class FiltroCategoriasComponent {
  readonly seleccion = input<string>('Todo');
  readonly seleccionCambio = output<string>();

  readonly chips = CATEGORIAS_CHIPS;

  seleccionar(chip: { value: string; label: string }): void {
    this.seleccionCambio.emit(chip.value);
  }
}
