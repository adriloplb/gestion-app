import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar color="danger">
        <ion-title>Control de Acceso - Error 403</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding error-content" role="main">
      <div class="error-wrapper">
        <ion-card class="error-card">
          <ion-card-header class="ion-text-center">
            <div class="lock-icon" aria-hidden="true">🚫</div>
            <ion-card-title>Acceso No Autorizado (403 Forbidden)</ion-card-title>
          </ion-card-header>

          <ion-card-content class="ion-text-center">
            <p class="error-description">
              El rol actual de su sesión
              (<strong>{{ authService.getCurrentUser()?.role || 'NO AUTENTICADO' }}</strong>)
              no cuenta con los privilegios requeridos para acceder a esta ruta protegida.
            </p>

            <div class="rbac-notice">
              <span>🔒 Protección activa mediante Angular <code>roleGuard</code>.</span>
            </div>

            <div class="action-buttons">
              <ion-button routerLink="/login" color="primary" expand="block">
                Iniciar Sesión con Otro Rol
              </ion-button>
              <ion-button routerLink="/ayuda" fill="outline" color="medium" expand="block">
                Consultar Roles en el Manual
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .error-content {
      --background: var(--ion-color-step-50, #f8fafc);
    }

    .error-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 120px);
    }

    .error-card {
      max-width: 480px;
      width: 100%;
      border-radius: 16px;
      border: 1px solid var(--ion-color-step-150, #e2e8f0);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      padding: 1rem 0;
    }

    .lock-icon {
      font-size: 3.5rem;
      margin-bottom: 0.5rem;
    }

    .error-description {
      font-size: 0.95rem;
      color: #475569;
      line-height: 1.5;
    }

    .rbac-notice {
      background: #fee2e2;
      color: #991b1b;
      padding: 0.6rem 0.8rem;
      border-radius: 8px;
      font-size: 0.85rem;
      margin: 1.25rem 0;
      font-weight: 500;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
    }
  `]
})
export class UnauthorizedPage {
  constructor(public authService: AuthService) {}
}
