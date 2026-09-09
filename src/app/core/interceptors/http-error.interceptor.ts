import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

const URLsExcluidas = ['/api/auth/login', '/api/auth/register'];

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const authService = inject(AuthService);
  const excluida = URLsExcluidas.some((url) => req.url.includes(url));

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!excluida) {
        if (error.status === 401) {
          toastService.mostrar('Tu sesión expiró. Inicia sesión de nuevo.', 'info');
          authService.logout();
        } else {
          toastService.mostrar(extraerMensaje(error), 'error');
        }
      }
      return throwError(() => error);
    }),
  );
};

function extraerMensaje(error: HttpErrorResponse): string {
  const cuerpo = error.error;
  if (cuerpo?.mensaje) {
    return String(cuerpo.mensaje);
  }
  if (typeof cuerpo?.message === 'string') {
    return cuerpo.message;
  }
  const fallos: Record<number, string> = {
    400: 'Solicitud inválida. Revisa los datos.',
    401: 'No autorizado.',
    403: 'No tienes permiso para realizar esta acción.',
    404: 'El recurso solicitado no existe.',
    409: 'El registro ya existe.',
    500: 'Error interno del servidor. Intenta de nuevo.',
  };
  return fallos[error.status] ?? 'Ocurrió un error inesperado.';
}