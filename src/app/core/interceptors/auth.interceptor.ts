import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedUrls = ['/api/auth/login', '/api/auth/register'];
  const isExcluded = excludedUrls.some((url) => req.url.includes(url));

  if (isExcluded) {
    return next(req);
  }

  const token = localStorage.getItem('access_token');

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};
