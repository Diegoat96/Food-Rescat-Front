import { Component, input, output } from '@angular/core';
import { TipoComercio } from '../../../../core/models/paquete.model';

// Tipo de comercio de la sucursal, expuesto por el backend en
// paquete.branch.businessType (contrato confirmado). Los valores coinciden con
// el enum BusinessType del backend: CAFETERIA, RESTAURANTE, PANADERIA,
// COMIDA_RAPIDA, OTRO.
export const TIPOS_COMERCIO: { value: TipoComercio; label: string }[] = [
  { value: 'CAFETERIA', label: 'Cafetería' },
  { value: 'RESTAURANTE', label: 'Restaurante' },
  { value: 'PANADERIA', label: 'Panadería' },
  { value: 'COMIDA_RAPIDA', label: 'Comida rápida' },
  { value: 'OTRO', label: 'Otro' },
];

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
