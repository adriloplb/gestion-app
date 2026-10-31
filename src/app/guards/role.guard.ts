import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

/**
 * Guard para validar que el usuario ha iniciado sesión.
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

/**
 * Guard para verificar el rol exigido en la ruta según la matriz de accesos RBAC.
 * @param allowedRole Rol mínimo o específico requerido ('ADMIN' o 'STANDARD')
 */
export const roleGuard = (allowedRole: UserRole): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // El Administrador tiene acceso total al sistema (incluyendo vistas estándar)
    // El usuario STANDARD solo tiene acceso a sus vistas correspondientes
    const currentUser = authService.getCurrentUser();
    if (currentUser?.role === 'ADMIN' || currentUser?.role === allowedRole) {
      return true;
    }

    router.navigate(['/unauthorized']);
    return false;
  };
};
