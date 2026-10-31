import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should authenticate admin user with valid credentials', async () => {
    const user = await firstValueFrom(service.login('admin@empresa.com', 'Admin123!'));
    expect(user).toBeTruthy();
    expect(user.role).toBe('ADMIN');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should fail authentication with incorrect password', async () => {
    try {
      await firstValueFrom(service.login('admin@empresa.com', 'wrongpassword'));
      expect.fail('Debería haber lanzado un error de autenticación');
    } catch (err: any) {
      expect(err.message).toContain('Credenciales incorrectas');
    }
  });

  it('should detect existing emails with checkEmailExists', async () => {
    const exists = await firstValueFrom(service.checkEmailExists('admin@empresa.com'));
    expect(exists).toBe(true);

    const notExists = await firstValueFrom(service.checkEmailExists('noexiste@empresa.com'));
    expect(notExists).toBe(false);
  });

  it('should clear session on logout', () => {
    service.logout();
    expect(service.getCurrentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
