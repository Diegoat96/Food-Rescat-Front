import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { SucursalesService } from '../../../../core/services/sucursales.service';
import { EstadisticasHoyComponent } from '../estadisticas-hoy/estadisticas-hoy.component';

@Component({
  selector: 'app-comercio-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, EstadisticasHoyComponent, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class ComercioSidebarComponent {
  private sucursalesService = inject(SucursalesService);

  readonly sucursalActiva = this.sucursalesService.sucursales;

  readonly navItems = [
    { path: '/comercio/inicio', label: 'Inicio', icon: 'home' },
    { path: '/comercio/publicar', label: 'Publicar', icon: 'upload' },
    { path: '/comercio/pendientes', label: 'Pendientes', icon: 'hourglass' },
    { path: '/comercio/historial', label: 'Historial', icon: 'history' },
  ];
}
