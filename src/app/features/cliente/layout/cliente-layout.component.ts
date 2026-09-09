import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificacionesService } from '../../../core/services/notificaciones.service';
import { FavoritosService } from '../../../core/services/favoritos.service';
import { NotificacionesComponent } from '../components/notificaciones/notificaciones.component';

@Component({
  selector: 'app-cliente-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NotificacionesComponent],
  templateUrl: './cliente-layout.component.html',
  styleUrl: './cliente-layout.component.css',
})
export class ClienteLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private notificacionesService = inject(NotificacionesService);
  private favoritosService = inject(FavoritosService);
  private destroyRef = inject(DestroyRef);

  readonly usuario = this.authService.currentUser;

  readonly navItems = [
    { path: '/cliente/feed', label: 'Feed', icon: '🍽️' },
    { path: '/cliente/historial', label: 'Historial', icon: '🕘' },
    { path: '/cliente/solicitud-negocio', label: 'Ser Negocio', icon: '🏪' },
  ];

  ngOnInit(): void {
    this.notificacionesService.cargar().subscribe();
    this.favoritosService.cargar().subscribe();
    const id = setInterval(() => {
      this.notificacionesService.cargar().subscribe();
    }, 30000);
    this.destroyRef.onDestroy(() => clearInterval(id));
  }

  logout(): void {
    this.authService.logout();
  }
}