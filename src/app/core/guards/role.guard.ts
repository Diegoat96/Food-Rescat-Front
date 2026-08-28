import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Rol } from '../models/rol.enum';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['expectedRole'] as Rol | undefined;
  const user = authService.currentUser();

  if (!user) {
    return router.createUrlTree(['/auth/login']);
  }

  if (!expectedRole || user.rol === expectedRole) {
    return true;
  }

  authService.redirectByRole(user.rol);
  return false;
};
