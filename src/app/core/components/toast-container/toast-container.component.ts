import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css',
})
export class ToastContainerComponent {
  private toastService = inject(ToastService);

  readonly toasts = this.toastService.toasts;

  readonly clases: Record<string, string> = {
    exito: 'border-green-500/40 bg-green-50 text-green-900',
    error: 'border-error/40 bg-error-light text-error',
    info: 'border-primary-500/40 bg-primary-50 text-primary-900',
  };

  quitar(id: number): void {
    this.toastService.quitar(id);
  }
}