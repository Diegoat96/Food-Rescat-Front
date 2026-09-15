import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { NotificacionesService } from '../../../core/services/notificaciones.service';
import { FavoritosService } from '../../../core/services/favoritos.service';
import { NotificacionesComponent } from '../components/notificaciones/notificaciones.component';
import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cliente-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NotificacionesComponent, ConfirmDialogComponent, LucideAngularModule],
  templateUrl: './cliente-layout.component.html',
  styleUrl: './cliente-layout.component.css',
})
export class ClienteLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private notificacionesService = inject(NotificacionesService);
  private favoritosService = inject(FavoritosService);
  private destroyRef = inject(DestroyRef);

  readonly usuario = this.authService.currentUser;

  readonly mostrarConfirmacionLogout = signal(false);

  readonly navItems = [
    { path: '/cliente/feed', label: 'Feed', icon: 'utensils' },
    { path: '/cliente/historial', label: 'Historial', icon: 'history' },
    { path: '/cliente/solicitud-negocio', label: 'Ser Negocio', icon: 'store' },
  ];

  ngOnInit(): void {
    this.notificacionesService.cargar().subscribe();
    this.favoritosService.cargar().subscribe();
    const id = setInterval(() => {
      this.notificacionesService.cargar().subscribe();
    }, 30000);
    this.destroyRef.onDestroy(() => clearInterval(id));
  }

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