import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonSpinner
} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonSpinner
  ],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar color="primary">
        <ion-title>Portal de Acceso - Gestión Multiplataforma</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding login-content" role="main">
      <div class="login-wrapper">
        <ion-card class="login-card">
          <ion-card-header class="ion-text-center">
            <ion-card-title>Control de Acceso</ion-card-title>
            <ion-card-subtitle>FP Nebrija Madrid - Desarrollo de Interfaces</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <!-- Botones de Acceso Rápido para Pruebas del Evaluador -->
            <div class="quick-roles-panel">
              <span class="quick-title">Cuentas de Demostración (Evaluación):</span>
              <div class="quick-buttons">
                <button
                  type="button"
                  class="btn-demo btn-demo-admin"
                  (click)="fillCredentials('admin')"
                  aria-label="Rellenar como Administrador"
                >
                  Admin (Acceso Total)
                </button>
                <button
                  type="button"
                  class="btn-demo btn-demo-user"
                  (click)="fillCredentials('standard')"
                  aria-label="Rellenar como Usuario Estándar"
                >
                  Estándar (Operador)
                </button>
              </div>
            </div>

            @if (errorMessage()) {
              <div class="error-banner" role="alert" aria-live="assertive">
                <span>{{ errorMessage() }}</span>
              </div>
            }

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
              <div class="form-group">
                <label for="login-email" class="form-label">Correo Electrónico Corporativo</label>
                <div class="input-control">
                  <input
                    id="login-email"
                    type="email"
                    formControlName="email"
                    placeholder="ejemplo@empresa.com"
                    autocomplete="email"
                    required
                    aria-required="true"
                    [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                  />
                </div>
                @if (loginForm.get('email')?.touched && loginForm.get('email')?.hasError('required')) {
                  <span class="field-error">El correo electrónico es obligatorio.</span>
                }
                @if (loginForm.get('email')?.touched && loginForm.get('email')?.hasError('email')) {
                  <span class="field-error">Introduzca un formato de correo válido.</span>
                }
              </div>

              <div class="form-group">
                <label for="login-password" class="form-label">Contraseña</label>
                <div class="input-control">
                  <input
                    id="login-password"
                    type="password"
                    formControlName="password"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    required
                    aria-required="true"
                    [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                  />
                </div>
                @if (loginForm.get('password')?.touched && loginForm.get('password')?.hasError('required')) {
                  <span class="field-error">La contraseña es obligatoria.</span>
                }
                @if (loginForm.get('password')?.touched && loginForm.get('password')?.hasError('minlength')) {
                  <span class="field-error">La contraseña debe tener al menos 6 caracteres.</span>
                }
              </div>

              <ion-button
                expand="block"
                type="submit"
                [disabled]="loginForm.invalid || isLoading()"
                class="btn-submit"
                color="primary"
              >
                @if (isLoading()) {
                  <ion-spinner name="crescent"></ion-spinner>
                  <span style="margin-left: 0.5rem;">Validando sesión...</span>
                } @else {
                  <span>Iniciar Sesión</span>
                }
              </ion-button>
            </form>

            <div class="login-footer">
              <a routerLink="/ayuda" class="help-link">Ver Manual de Usuario y Roles</a>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .login-content {
      --background: var(--ion-color-step-50, #f8fafc);
    }

    .login-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 120px);
      padding: 1rem 0;
    }

    .login-card {
      width: 100%;
      max-width: 460px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--ion-color-step-150, #e2e8f0);
      background: var(--ion-background-color, #ffffff);
    }

    .logo-shield {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    .quick-roles-panel {
      background: rgba(56, 128, 255, 0.06);
      border: 1px dashed var(--ion-color-primary, #3880ff);
      border-radius: 10px;
      padding: 0.85rem;
      margin-bottom: 1.25rem;
    }

    .quick-title {
      display: block;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--ion-color-primary, #3880ff);
      margin-bottom: 0.5rem;
    }

    .quick-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-demo {
      flex: 1;
      padding: 0.45rem 0.6rem;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s;
    }

    .btn-demo-admin {
      background: #e0e7ff;
      color: #3730a3;
      border-color: #c7d2fe;
    }

    .btn-demo-admin:hover {
      background: #c7d2fe;
    }

    .btn-demo-user {
      background: #e0f2fe;
      color: #075985;
      border-color: #bae6fd;
    }

    .btn-demo-user:hover {
      background: #bae6fd;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #fee2e2;
      color: #991b1b;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.88rem;
      font-weight: 500;
    }

    .form-group {
      margin-bottom: 1.1rem;
    }

    .form-label {
      display: block;
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--ion-text-color, #1e293b);
      margin-bottom: 0.35rem;
    }

    .input-control input {
      width: 100%;
      padding: 0.75rem 0.9rem;
      border-radius: 8px;
      border: 1.5px solid var(--ion-color-step-200, #cbd5e1);
      background: var(--ion-background-color, #ffffff);
      color: var(--ion-text-color, #1e293b);
      font-size: 0.95rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .input-control input:focus-visible {
      outline: none;
      border-color: var(--ion-color-primary, #3880ff);
      box-shadow: 0 0 0 3px rgba(56, 128, 255, 0.25);
    }

    .input-control input.is-invalid {
      border-color: var(--ion-color-danger, #eb445a);
    }

    .field-error {
      display: block;
      margin-top: 0.3rem;
      font-size: 0.8rem;
      color: var(--ion-color-danger, #eb445a);
      font-weight: 500;
    }

    .btn-submit {
      margin-top: 1.5rem;
      font-weight: 600;
    }

    .login-footer {
      text-align: center;
      margin-top: 1.25rem;
      padding-top: 1rem;
      border-top: 1px solid var(--ion-color-step-150, #f1f5f9);
    }

    .help-link {
      font-size: 0.88rem;
      color: var(--ion-color-primary, #3880ff);
      text-decoration: none;
      font-weight: 600;
    }

    .help-link:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  private returnUrl: string = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['admin@empresa.com', [Validators.required, Validators.email]],
      password: ['Admin123!', [Validators.required, Validators.minLength(6)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  fillCredentials(role: 'admin' | 'standard'): void {
    if (role === 'admin') {
      this.loginForm.patchValue({
        email: 'admin@empresa.com',
        password: 'Admin123!'
      });
    } else {
      this.loginForm.patchValue({
        email: 'user@empresa.com',
        password: 'User123!'
      });
    }
    this.errorMessage.set(null);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        // Si hay una returnUrl previa y el rol lo permite, navegar hacia allá
        if (this.returnUrl && this.returnUrl !== '/unauthorized') {
          this.router.navigateByUrl(this.returnUrl);
        } else if (user.role === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/registros']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Error al autenticar.');
      }
    });
  }
}
