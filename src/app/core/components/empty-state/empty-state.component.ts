import { Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  readonly icono = input('utensils');
  readonly titulo = input('Sin datos');
  readonly descripcion = input('');
  readonly compacto = input(false);
}