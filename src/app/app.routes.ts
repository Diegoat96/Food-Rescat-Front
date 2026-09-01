import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Rol } from './core/models/rol.enum';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'cliente',
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: Rol.CLIENTE },
    loadChildren: () => import('./features/cliente/cliente.routes').then((m) => m.CLIENTE_ROUTES),
  },
  {
    path: 'comercio',
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: Rol.COMERCIO },
    loadChildren: () =>
      import('./features/comercio/comercio.routes').then((m) => m.COMERCIO_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: Rol.ADMIN },
    loadComponent: () =>
      import('./features/admin/pages/dashboard/dashboard.component').then(
        (m) => m.AdminDashboardComponent,
      ),
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' },
];
