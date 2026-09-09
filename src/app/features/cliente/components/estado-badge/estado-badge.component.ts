import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-estado-badge',
  standalone: true,
  templateUrl: './estado-badge.component.html',
  styleUrl: './estado-badge.component.css',
})
export class EstadoBadgeComponent {
  @Input() urgente = false;
  @Input() estado: string | null = 'AVAILABLE';

  get clases(): { bag: string; texto: string } {
    if (this.urgente) {
      return { bag: 'bg-secondary-100 text-secondary-700', texto: 'Por vencer' };
    }
    switch (this.estado) {
      case 'RESERVED':
        return { bag: 'bg-primary-100 text-primary-700', texto: 'Reservado' };
      case 'PICKED_UP':
        return { bag: 'bg-border text-text-muted', texto: 'Recogido' };
      case 'EXPIRED':
        return { bag: 'bg-border text-text-muted', texto: 'Vencido' };
      case 'CANCELLED':
        return { bag: 'bg-error-light text-error', texto: 'Cancelado' };
      default:
        return { bag: 'bg-primary-100 text-primary-700', texto: 'Disponible' };
    }
  }
}
