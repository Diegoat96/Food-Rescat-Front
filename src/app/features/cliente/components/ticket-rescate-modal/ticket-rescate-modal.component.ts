import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import { Reserva } from '../../../../core/models/reserva.model';

@Component({
  selector: 'app-ticket-rescate-modal',
  standalone: true,
  imports: [QRCodeComponent],
  templateUrl: './ticket-rescate-modal.component.html',
  styleUrl: './ticket-rescate-modal.component.css',
})
export class TicketRescateModalComponent {
  @Input({ required: true }) reserva!: Reserva;
  @Output() cerrar = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.cerrar.emit();
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cerrar.emit();
    }
  }

  horaLimite(): string {
    const fecha = new Date(this.reserva.horaLimiteRecogida ?? '');
    if (Number.isNaN(fecha.getTime())) {
      return 'lo antes posible';
    }
    return fecha.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
  }
}