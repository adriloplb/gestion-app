import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor HTTP Funcional (Angular 15+)
 * Inyecta el token Bearer JWT en las cabeceras salientes y captura errores 401/403.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Requested-With': 'GestionApp-Client',
        'X-App-Version': '1.0.0'
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login'], { queryParams: { sessionExpired: 'true' } });
      } else if (error.status === 403) {
        router.navigate(['/unauthorized']);
      }
      return throwError(() => error);
    })
  );
};

