import { Routes } from '@angular/router';
import { ComercioLayoutComponent } from './layout/comercio-layout.component';

export const COMERCIO_ROUTES: Routes = [
  {
    path: '',
    component: ComercioLayoutComponent,
    children: [
      {
        path: 'inicio',
        loadComponent: () =>
          import('./pages/inicio/inicio.component').then((m) => m.InicioComponent),
      },
      {
        path: 'publicar',
        loadComponent: () =>
          import('./pages/publicar/publicar.component').then((m) => m.PublicarComponent),
      },
      {
        path: 'pendientes',
        loadComponent: () =>
          import('./pages/pendientes/pendientes.component').then((m) => m.PendientesComponent),
      },
      {
        path: 'historial',
        loadComponent: () =>
          import('./pages/historial/historial.component').then((m) => m.HistorialComponent),
      },
      {
        path: 'sucursales',
        loadComponent: () =>
          import('./pages/sucursales/sucursales.component').then((m) => m.SucursalesComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
    ],
  },
];
