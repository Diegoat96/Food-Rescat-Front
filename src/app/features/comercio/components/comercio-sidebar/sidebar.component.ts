import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SucursalesService } from '../../../../core/services/sucursales.service';

@Component({
  selector: 'app-comercio-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class ComercioSidebarComponent {
  private sucursalesService = inject(SucursalesService);

  readonly sucursalActiva = this.sucursalesService.sucursales;

  readonly navItems = [
    { path: '/comercio/inicio', label: 'Inicio', icon: '🏠' },
    { path: '/comercio/publicar', label: 'Publicar', icon: '📤' },
    { path: '/comercio/pendientes', label: 'Pendientes', icon: '⏳' },
    { path: '/comercio/historial', label: 'Historial', icon: '🕘' },
  ];
}
