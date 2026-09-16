import { Component, EventEmitter, HostListener, Input, Output, computed, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-rechazar-solicitud-modal',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './rechazar-solicitud-modal.component.html',
  styleUrl: './rechazar-solicitud-modal.component.css',
})
export class RechazarSolicitudModalComponent {
  @Input() visible = false;
  @Input() nombreNegocio = '';
  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  readonly motivo = signal('');
  readonly tocado = signal(false);

  readonly motivoInvalido = computed(() => this.motivo().trim().length === 0);
  readonly mostrarError = computed(() => this.motivoInvalido() && this.tocado());

  onInput(value: string): void {
    this.motivo.set(value);
    this.tocado.set(true);
  }

  confirmar(): void {
    const motivo = this.motivo().trim();
    if (!motivo) {
      this.tocado.set(true);
      return;
    }
    this.confirm.emit(motivo);
    this.motivo.set('');
    this.tocado.set(false);
  }

  cancelar(): void {
    this.cancel.emit();
    this.motivo.set('');
    this.tocado.set(false);
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancelar();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.visible) {
      this.cancelar();
    }
  }
}