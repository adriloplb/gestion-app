import { TestBed } from '@angular/core/testing';
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
    service.login('admin@empresa.com', 'Admin123!').subscribe(user => {
      expect(user).toBeTruthy();
      expect(user.role).toBe('ADMIN');
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  it('should fail authentication with incorrect password', () => {
    service.login('admin@empresa.com', 'wrongpassword').subscribe({
      next: () => {
        throw new Error('Debería haber fallado');
      },
      error: (err) => {
        expect(err.message).toContain('Credenciales incorrectas');
      }
    });
  });

  it('should detect existing emails with checkEmailExists', () => {
    service.checkEmailExists('admin@empresa.com').subscribe(exists => {
      expect(exists).toBe(true);
    });
    service.checkEmailExists('noexiste@empresa.com').subscribe(exists => {
      expect(exists).toBe(false);
    });
  });

  it('should clear session on logout', () => {
    service.logout();
    expect(service.getCurrentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
