import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, UserRole } from '../models/user.model';

const STORAGE_KEY_USER = 'gestion_app_current_user';
const STORAGE_KEY_TOKEN = 'gestion_app_jwt_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Cuentas de demostración preconfiguradas para evaluación académica (2º DAM Nebrija)
  private readonly mockUsers: Array<User & { passwordHash: string }> = [
    {
      id: 'usr-admin-01',
      email: 'admin@empresa.com',
      name: 'Adrián López (Administrador)',
      role: 'ADMIN',
      passwordHash: 'Admin123!',
      avatar: 'assets/icon/favicon.png',
      lastLogin: new Date().toISOString()
    },
    {
      id: 'usr-standard-02',
      email: 'user@empresa.com',
      name: 'Carlos Ruiz (Operador Estándar)',
      role: 'STANDARD',
      passwordHash: 'User123!',
      avatar: 'assets/icon/favicon.png',
      lastLogin: new Date().toISOString()
    }
  ];

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();
  public currentUserSignal = signal<User | null>(this.getStoredUser());

  constructor() {
    // Si no hay usuario guardado previamente, iniciamos sesión como ADMIN por comodidad de evaluación
    if (!this.currentUserSubject.value) {
      const defaultAdmin = this.mockUsers[0];
      const token = this.generateMockJwt(defaultAdmin);
      const userSession: User = {
        id: defaultAdmin.id,
        email: defaultAdmin.email,
        name: defaultAdmin.name,
        role: defaultAdmin.role,
        avatar: defaultAdmin.avatar,
        lastLogin: new Date().toISOString(),
        token
      };
      this.persistSession(userSession, token);
    }
  }

  private getStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  public getToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY_TOKEN);
    } catch {
      return null;
    }
  }

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    const token = this.getToken();
    return !!(user && token);
  }

  public hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  public login(email: string, pass: string): Observable<User> {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const match = this.mockUsers.find(
      u => u.email.toLowerCase() === trimmedEmail && u.passwordHash === pass
    );

    if (!match) {
      return throwError(() => new Error('Credenciales incorrectas. Verifique correo y contraseña.'));
    }

    const token = this.generateMockJwt(match);
    const sessionUser: User = {
      id: match.id,
      email: match.email,
      name: match.name,
      role: match.role,
      avatar: match.avatar,
      lastLogin: new Date().toISOString(),
      token
    };

    return of(sessionUser).pipe(
      delay(400), // Simula latencia de red asíncrona hacia backend
      tap(user => {
        this.persistSession(user, token);
      })
    );
  }

  public logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    } catch (e) {
      console.warn('No se pudo limpiar localStorage:', e);
    }
    this.currentUserSubject.next(null);
    this.currentUserSignal.set(null);
  }

  private persistSession(user: User, token: string): void {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
    } catch (e) {
      console.warn('No se pudo guardar sesión en localStorage:', e);
    }
    this.currentUserSubject.next(user);
    this.currentUserSignal.set(user);
  }

  private generateMockJwt(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 3600
      })
    );
    const signature = btoa('nebrija_dam_signature_hash');
    return `${header}.${payload}.${signature}`;
  }

  // Validación asíncrona: comprueba si un correo ya está en el sistema
  public checkEmailExists(email: string): Observable<boolean> {
    const lower = (email || '').trim().toLowerCase();
    const registeredEmails = [
      'admin@empresa.com',
      'user@empresa.com',
      'director@empresa.com',
      'soporte@empresa.com'
    ];
    return of(registeredEmails.includes(lower)).pipe(delay(350));
  }

  // Validación asíncrona: comprueba si un código de inventario (SKU) ya existe
  public checkSkuExists(sku: string): Observable<boolean> {
    const registeredSkus = ['SRV-2024-001', 'SWT-2024-002', 'SAI-2024-003', 'FW-2024-004'];
    const exists = registeredSkus.includes((sku || '').trim().toUpperCase());
    return of(exists).pipe(delay(300));
  }
}
