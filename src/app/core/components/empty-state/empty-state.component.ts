import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  readonly icono = input('🍽️');
  readonly titulo = input('Sin datos');
  readonly descripcion = input('');
  readonly compacto = input(false);
}