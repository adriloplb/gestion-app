import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge
} from '@ionic/angular';

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge
  ],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Manual de Usuario y Documentación Técnica</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" role="main">
      <div class="manual-container">
        <!-- Banner de Bienvenida -->
        <div class="hero-banner">
          <span class="uni-tag">Universidad Nebrija - FP 2º DAM</span>
          <h1>Sistema de Gestión Multiplataforma (PWA/Híbrida)</h1>
          <p class="subtitle">
            Módulo: Desarrollo de Interfaces (Código: 0488) | Actividad Individual 1
          </p>
        </div>

        <!-- 1. Credenciales de Acceso para Evaluación -->
        <ion-card class="guide-card accent-card">
          <ion-card-header>
            <div class="card-badge-row">
              <ion-badge color="success">Evaluación Docente</ion-badge>
              <ion-badge color="tertiary">RBAC Activo</ion-badge>
            </div>
            <ion-card-title>Credenciales de Acceso de Prueba</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>El sistema cuenta con control de acceso basado en roles (Role-Based Access Control) y Guards de Angular:</p>
            
            <div class="credentials-grid">
              <div class="cred-box admin-box">
                <h4>Rol: Administrador</h4>
                <p><strong>Email:</strong> <code>admin@empresa.com</code></p>
                <p><strong>Contraseña:</strong> <code>Admin123!</code></p>
                <p class="desc">Permisos: Acceso total al Cuadro de Mando, Gráficos Chart.js interactivos, Auditoría NoSQL en tiempo real, Exportación oficial de informes a PDF y CSV, y Gestión de Hardware.</p>
                <ion-button routerLink="/login" fill="outline" size="small" color="primary">Ir a Login</ion-button>
              </div>

              <div class="cred-box user-box">
                <h4>Rol: Usuario Estándar</h4>
                <p><strong>Email:</strong> <code>user@empresa.com</code></p>
                <p><strong>Contraseña:</strong> <code>User123!</code></p>
                <p class="desc">Permisos: Alta de nuevos registros de inventario con validaciones reactivas y asíncronas (comprobación de correo y SKU únicos), consulta de registros.</p>
                <ion-button routerLink="/login" fill="outline" size="small" color="secondary">Ir a Login</ion-button>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- 2. Arquitectura del Proyecto -->
        <ion-card class="guide-card">
          <ion-card-header>
            <ion-card-title>Arquitectura del Software (MVC/MVVM)</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ul class="feature-list">
              <li><strong>Framework:</strong> Ionic 8+ con Angular 19 Standalone Components (sin NgModule obsoleto).</li>
              <li><strong>Gestión de Estado:</strong> Patrón reactivo predecible mediante <code>BehaviorSubject</code> y Angular <code>Signals</code> (<code>signal</code>, <code>computed</code>).</li>
              <li><strong>Seguridad y Enrutamiento:</strong> Carga diferida (<code>Lazy Loading</code>), protección con <code>roleGuard</code> y <code>authGuard</code>, e interceptor HTTP que inyecta tokens JWT simulados en cada petición saliente.</li>
              <li><strong>Consumo Dual Asíncrono (RA 5):</strong>
                <ul>
                  <li><strong>SQL REST API:</strong> Simulación de base de datos relacional para inventario con operaciones CRUD y latencia controlada.</li>
                  <li><strong>NoSQL / Firestore:</strong> Simulación de colección de eventos de auditoría y logs reactivos en tiempo real.</li>
                  <li><strong>Orquestación:</strong> Uso de <code>forkJoin</code> de RxJS para consolidación concurrente con feedback visual de carga.</li>
                </ul>
              </li>
            </ul>
          </ion-card-content>
        </ion-card>

        <!-- 3. Funcionalidades Destacadas -->
        <ion-card class="guide-card">
          <ion-card-header>
            <ion-card-title>Módulos y Guía de Uso</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="module-item">
              <h4>1. Cuadro de Mando Interactivo (Dashboard)</h4>
              <p>Visualiza widgets estadísticos reactivos, distribución de inventario mediante gráfico interactivo en <strong>Chart.js</strong> con filtrado por categoría en tiempo real, tabla avanzada con ordenación y búsqueda, y botones de exportación a PDF profesional y CSV con codificación UTF-8.</p>
            </div>

            <div class="module-item">
              <h4>2. Formulario Reactivo con Validación Asíncrona (Alta de Registros)</h4>
              <p>Formulario con Data Binding unidireccional y bidireccional en tarjeta de previsualización en vivo. Incluye validadores síncronos y <strong>validaciones asíncronas con debounce</strong> que consultan contra el servicio si el correo del responsable o el código SKU ya existen en la base de datos.</p>
            </div>

            <div class="module-item">
              <h4>3. Accesibilidad WCAG y Responsive Mobile-First</h4>
              <p>Navegación completa por teclado mediante <code>tabindex</code> lógico, atributos semánticos WAI-ARIA (<code>aria-label</code>, <code>role="grid"</code>, <code>aria-live</code>), contrastes de color validados WCAG AA/AAA y diseño fluido adaptable a móvil, tablet y monitor de escritorio.</p>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .manual-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .hero-banner {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: #ffffff;
      padding: 2.2rem;
      border-radius: 16px;
      margin-bottom: 1.5rem;
      box-shadow: 0 10px 25px rgba(30, 58, 138, 0.2);
    }

    .hero-banner h1 {
      margin: 0.5rem 0;
      font-size: 1.8rem;
      font-weight: 800;
    }

    .uni-tag {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .subtitle {
      margin: 0;
      opacity: 0.9;
      font-size: 1.05rem;
    }

    .guide-card {
      margin: 1.25rem 0;
      border-radius: 14px;
      border: 1px solid var(--ion-color-step-150, #e2e8f0);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
    }

    .accent-card {
      border-left: 5px solid var(--ion-color-primary, #3880ff);
    }

    .card-badge-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .credentials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.2rem;
      margin-top: 1rem;
    }

    .cred-box {
      padding: 1.25rem;
      border-radius: 10px;
      background: var(--ion-color-step-50, #f8fafc);
      border: 1px solid var(--ion-color-step-150, #e2e8f0);
    }

    .cred-box h4 {
      margin-top: 0;
      margin-bottom: 0.75rem;
      font-size: 1.05rem;
    }

    .cred-box code {
      background: #e2e8f0;
      color: #0f172a;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-weight: 600;
    }

    .cred-box .desc {
      font-size: 0.86rem;
      color: #64748b;
      margin: 0.75rem 0;
      line-height: 1.4;
    }

    .feature-list {
      padding-left: 1.2rem;
      line-height: 1.8;
      color: var(--ion-text-color, #334155);
    }

    .feature-list code {
      background: var(--ion-color-step-100, #f1f5f9);
      padding: 0.15rem 0.35rem;
      border-radius: 4px;
      font-weight: 600;
    }

    .module-item {
      margin-bottom: 1.2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--ion-color-step-100, #f1f5f9);
    }

    .module-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .module-item h4 {
      margin: 0 0 0.35rem 0;
      color: var(--ion-color-primary, #3880ff);
      font-size: 1.05rem;
    }

    .module-item p {
      margin: 0;
      color: #475569;
      line-height: 1.5;
    }
  `]
})
export class AyudaPage {}
