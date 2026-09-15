import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { ConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-comercio-header',
  standalone: true,
  imports: [ConfirmDialogComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class ComercioHeaderComponent {
  private authService = inject(AuthService);

  readonly usuario = this.authService.currentUser;

  readonly mostrarConfirmacionLogout = signal(false);

  preguntarLogout(): void {
    this.mostrarConfirmacionLogout.set(true);
  }

  confirmarLogout(): void {
    this.mostrarConfirmacionLogout.set(false);
    this.authService.logout();
  }

  cancelarLogout(): void {
    this.mostrarConfirmacionLogout.set(false);
  }
}
