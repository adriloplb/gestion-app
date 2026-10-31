import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, timer, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Validador Asíncrono para verificar en tiempo real si un correo electrónico ya está registrado.
 * Cumple con RA 2: Validaciones asíncronas contra servicio simulado con debounce reactivo.
 */
export function uniqueEmailValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = control.value;
    if (!value || typeof value !== 'string' || value.trim() === '') {
      return of(null);
    }

    // Debounce reactivo de 350ms antes de consultar el servicio
    return timer(350).pipe(
      switchMap(() => authService.checkEmailExists(value)),
      map(isTaken => (isTaken ? { emailTaken: true } : null)),
      catchError(() => of(null))
    );
  };
}

/**
 * Validador Asíncrono para verificar duplicidad de código SKU de hardware en la base de datos.
 */
export function uniqueSkuValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = control.value;
    if (!value || typeof value !== 'string' || value.trim() === '') {
      return of(null);
    }

    return timer(300).pipe(
      switchMap(() => authService.checkSkuExists(value)),
      map(isTaken => (isTaken ? { skuTaken: true } : null)),
      catchError(() => of(null))
    );
  };
}
