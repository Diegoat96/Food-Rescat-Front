import { Component, input, output } from '@angular/core';

export const CATEGORIAS_CHIPS = [
  'Todo',
  'Cafetería',
  'Restaurante',
  'Panadería',
  'Comida rápida',
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

  seleccionar(chip: string): void {
    this.seleccionCambio.emit(chip);
  }
}
