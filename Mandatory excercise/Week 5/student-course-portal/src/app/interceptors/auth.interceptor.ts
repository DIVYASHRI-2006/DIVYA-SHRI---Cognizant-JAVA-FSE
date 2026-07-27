import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = 'Bearer mock-jwt-token-erp-portal-2026';
  
  const authReq = req.clone({
    setHeaders: {
      Authorization: authToken
    }
  });

  return next(authReq);
};
