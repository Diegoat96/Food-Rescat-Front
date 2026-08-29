import { Routes } from '@angular/router';
import { ClienteLayoutComponent } from './layout/cliente-layout.component';

export const CLIENTE_ROUTES: Routes = [
  {
    path: '',
    component: ClienteLayoutComponent,
    children: [
      {
        path: 'feed',
        loadComponent: () =>
          import('./pages/feed/feed.component').then((m) => m.FeedComponent),
      },
      {
        path: 'historial',
        loadComponent: () =>
          import('./pages/historial/historial.component').then((m) => m.HistorialComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'feed' },
    ],
  },
];