import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event: HttpEvent<unknown>) => {
      if (event instanceof HttpResponse) {
        const body = event.body as ApiEnvelope<unknown> | null;
        if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
          if (body.success) {
            return event.clone({ body: body.data });
          }
          const errorMsg = (body as { message?: string }).message ?? 'Error del servidor';
          throw { success: false, message: errorMsg, status: 0 };
        }
      }
      return event;
    }),
  );
};
