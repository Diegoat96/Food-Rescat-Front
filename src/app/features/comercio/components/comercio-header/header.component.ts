import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-comercio-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class ComercioHeaderComponent {
  private authService = inject(AuthService);

  readonly usuario = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }
}
