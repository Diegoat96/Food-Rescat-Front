import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-estado-badge',
  standalone: true,
  templateUrl: './estado-badge.component.html',
  styleUrl: './estado-badge.component.css',
})
export class EstadoBadgeComponent {
  @Input() urgente = false;
  @Input() estado: string | null = 'DISPONIBLE';

  get clases(): { bag: string; texto: string } {
    if (this.urgente) {
      return { bag: 'bg-secondary-100 text-secondary-700', texto: 'Por vencer' };
    }
    if (this.estado === 'RESERVADO') {
      return { bag: 'bg-primary-100 text-primary-700', texto: 'Reservado' };
    }
    if (this.estado === 'RECOGIDO') {
      return { bag: 'bg-border text-text-muted', texto: 'Recogido' };
    }
    return { bag: 'bg-primary-100 text-primary-700', texto: 'Disponible' };
  }
}
