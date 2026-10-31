import { Component, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonToast,
  IonSpinner
} from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { uniqueSkuValidator } from '../../validators/email-async.validator';
import { DataTableComponent, ColumnDef } from '../../components/data-table/data-table.component';
import { HardwareItem } from '../../models/user.model';

@Component({
  selector: 'app-registros',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge,
    IonToast,
    IonSpinner,
    DataTableComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar color="tertiary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Gestión y Alta de Registros</ion-title>
        <ion-buttons slot="end">
          <ion-badge color="light" class="user-role-pill">
            {{ currentUser()?.role || 'ESTÁNDAR' }}
          </ion-badge>
        </ion-buttons>
      </ion-toolbar>

      <ion-toolbar>
        <ion-segment [value]="activeSegment()" (ionChange)="onSegmentChange($event)">
          <ion-segment-button value="alta">
            <ion-label>Alta de Hardware</ion-label>
          </ion-segment-button>
          <ion-segment-button value="listado">
            <ion-label>Inventario Registrado</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" role="main">
      <!-- 1. PESTAÑA: FORMULARIO REACTIVO Y VALIDACIÓN ASÍNCRONA -->
      @if (activeSegment() === 'alta') {
        <div class="form-container">
          <div class="form-grid">
            <!-- Columna Formulario -->
            <div class="form-card-wrapper">
              <ion-card class="app-card">
                <ion-card-header>
                  <ion-card-title>Alta de Registro de Hardware (SQL)</ion-card-title>
                  <p class="section-desc">
                    Formulario declarativo con validaciones reactivas y validación asíncrona contra base de datos.
                  </p>
                </ion-card-header>

                <ion-card-content>
                  <form [formGroup]="registroForm" (ngSubmit)="onSubmit()" novalidate>
                    <!-- Campo: Nombre del Producto -->
                    <div class="form-field">
                      <label for="prod-name" class="label-heading">
                        Nombre del Equipo / Dispositivo <span class="required">*</span>
                      </label>
                      <input
                        id="prod-name"
                        type="text"
                        formControlName="producto"
                        placeholder="Ej. Servidor Blade ProLiant Gen11"
                        [class.field-error-border]="isFieldInvalid('producto')"
                        aria-required="true"
                      />
                      @if (isFieldInvalid('producto')) {
                        <span class="error-msg">El nombre es obligatorio (mínimo 3 caracteres).</span>
                      }
                    </div>

                    <!-- Fila 2: SKU con Validación Asíncrona -->
                    <div class="form-row-2">
                      <div class="form-field">
                        <label for="prod-sku" class="label-heading">
                          Código de Serie / SKU <span class="required">*</span>
                          @if (registroForm.get('sku')?.status === 'PENDING') {
                            <ion-spinner name="dots" class="async-spinner"></ion-spinner>
                            <span class="async-text">Verificando en base de datos...</span>
                          }
                        </label>
                        <input
                          id="prod-sku"
                          type="text"
                          formControlName="sku"
                          placeholder="Ej. SRV-2024-099"
                          [class.field-error-border]="isFieldInvalid('sku')"
                          aria-required="true"
                        />
                        @if (registroForm.get('sku')?.touched && registroForm.get('sku')?.hasError('required')) {
                          <span class="error-msg">El código SKU es obligatorio.</span>
                        }
                        @if (registroForm.get('sku')?.hasError('skuTaken')) {
                          <span class="error-msg text-danger">Este código SKU ya está registrado en la base de datos SQL.</span>
                        }
                      </div>

                      <div class="form-field">
                        <label for="prod-category" class="label-heading">
                          Categoría Técnica <span class="required">*</span>
                        </label>
                        <select id="prod-category" formControlName="categoria" aria-required="true">
                          <option value="Servidores">Servidores</option>
                          <option value="Redes">Redes & Telecom</option>
                          <option value="Almacenamiento">Almacenamiento (NAS/SAN)</option>
                          <option value="Seguridad">Seguridad Perimetral</option>
                        </select>
                      </div>
                    </div>

                    <!-- Fila 3: Precio y Stock -->
                    <div class="form-row-2">
                      <div class="form-field">
                        <label for="prod-stock" class="label-heading">
                          Unidades de Stock <span class="required">*</span>
                        </label>
                        <input
                          id="prod-stock"
                          type="number"
                          formControlName="stock"
                          min="0"
                          max="999"
                          [class.field-error-border]="isFieldInvalid('stock')"
                          aria-required="true"
                        />
                        @if (isFieldInvalid('stock')) {
                          <span class="error-msg">Debe ser un número entero entre 0 y 999.</span>
                        }
                      </div>

                      <div class="form-field">
                        <label for="prod-price" class="label-heading">
                          Precio Unitario (€) <span class="required">*</span>
                        </label>
                        <input
                          id="prod-price"
                          type="number"
                          step="0.01"
                          formControlName="precio"
                          min="1"
                          [class.field-error-border]="isFieldInvalid('precio')"
                          aria-required="true"
                        />
                        @if (isFieldInvalid('precio')) {
                          <span class="error-msg">El precio debe ser superior a 0 €.</span>
                        }
                      </div>
                    </div>

                    <!-- Fila 4: Correo Responsable y Estado -->
                    <div class="form-row-2">
                      <div class="form-field">
                        <label for="prod-email" class="label-heading">
                          Correo del Técnico Responsable <span class="required">*</span>
                        </label>
                        <input
                          id="prod-email"
                          type="email"
                          formControlName="responsableEmail"
                          placeholder="tecnico@empresa.com"
                          [class.field-error-border]="isFieldInvalid('responsableEmail')"
                          aria-required="true"
                        />
                        @if (isFieldInvalid('responsableEmail')) {
                          <span class="error-msg">Indique un correo electrónico corporativo válido.</span>
                        }
                      </div>

                      <div class="form-field">
                        <label for="prod-status" class="label-heading">
                          Estado Operativo <span class="required">*</span>
                        </label>
                        <select id="prod-status" formControlName="estado" aria-required="true">
                          <option value="Disponible">Disponible</option>
                          <option value="Bajo Stock">Bajo Stock</option>
                          <option value="Agotado">Agotado</option>
                        </select>
                      </div>
                    </div>

                    <!-- Botones de Acción -->
                    <div class="form-actions">
                      <ion-button
                        type="submit"
                        color="tertiary"
                        [disabled]="registroForm.invalid || isSubmitting()"
                        expand="block"
                        class="btn-save"
                      >
                        @if (isSubmitting()) {
                          <ion-spinner name="crescent"></ion-spinner>
                          <span style="margin-left: 0.5rem;">Guardando en base de datos...</span>
                        } @else {
                          <span>Guardar Registro en SQL</span>
                        }
                      </ion-button>
                      <button type="button" class="btn-reset" (click)="resetForm()">
                        Restablecer Campos
                      </button>
                    </div>
                  </form>
                </ion-card-content>
              </ion-card>
            </div>

            <!-- Columna Data Binding: Ficha de Previsualización en Vivo (Two-Way Reactive) -->
            <div class="preview-card-wrapper">
              <ion-card class="app-card preview-card">
                <ion-card-header>
                  <div class="preview-badge">
                    <span>Data Binding Reactivo</span>
                  </div>
                  <ion-card-title>Ficha Técnica en Tiempo Real</ion-card-title>
                  <p class="section-desc">Demostración de enlace bidireccional y reactividad de estado.</p>
                </ion-card-header>
                <ion-card-content>
                  <div class="preview-device-screen">
                    <div class="device-header">
                      <div>
                        <h4 class="device-title">
                          {{ livePreview().producto || 'Nombre del equipo...' }}
                        </h4>
                        <span class="sku-badge">{{ livePreview().sku || 'SKU-0000-000' }}</span>
                      </div>
                    </div>

                    <div class="device-details">
                      <div class="detail-row">
                        <span class="detail-label">Categoría:</span>
                        <span class="detail-val">{{ livePreview().categoria }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Stock en Almacén:</span>
                        <span class="detail-val" [class.stock-warn]="livePreview().stock < 5">
                          {{ livePreview().stock }} uds.
                        </span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Precio Unitario:</span>
                        <span class="detail-val price-val">
                          {{ livePreview().precio | currency:'EUR':'symbol':'1.0-2':'es-ES' }}
                        </span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Valor Total en Stock:</span>
                        <span class="detail-val total-val">
                          {{ (livePreview().precio * livePreview().stock) | currency:'EUR':'symbol':'1.0-2':'es-ES' }}
                        </span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Responsable Asignado:</span>
                        <span class="detail-val">{{ livePreview().responsableEmail || 'No asignado' }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Estado:</span>
                        <span class="detail-val">
                          <ion-badge [color]="getEstadoColor(livePreview().estado)">
                            {{ livePreview().estado }}
                          </ion-badge>
                        </span>
                      </div>
                    </div>
                  </div>
                </ion-card-content>
              </ion-card>
            </div>
          </div>
        </div>
      }

      <!-- 2. PESTAÑA: LISTADO CON COMPONENTE PERSONALIZADO DATA-TABLE -->
      @if (activeSegment() === 'listado') {
        <div class="listado-container">
          <app-data-table
            [data]="hardwareList()"
            [columns]="tableColumns"
            tableTitle="Catálogo Completo de Hardware Registrado"
            [pageSize]="6"
            (rowSelected)="onItemSelected($event)"
            (deleteRequested)="onDeleteRequested($event)"
          >
          </app-data-table>
        </div>
      }

      <ion-toast
        [isOpen]="showToast()"
        [message]="toastMessage()"
        [duration]="3000"
        (didDismiss)="showToast.set(false)"
        color="success"
      >
      </ion-toast>
    </ion-content>
  `,
  styles: [`
    .user-role-pill {
      font-size: 0.75rem;
      margin-right: 0.5rem;
      letter-spacing: 0.05em;
    }

    .form-container,
    .listado-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    @media (max-width: 900px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }

    .app-card {
      border-radius: 14px;
      border: 1px solid var(--ion-color-step-150, #e2e8f0);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      background: #ffffff !important;
      --background: #ffffff !important;
    }

    .section-desc {
      margin: 0.35rem 0 0 0;
      font-size: 0.88rem;
      color: #64748b;
    }

    .form-field {
      margin-bottom: 1.15rem;
    }

    .form-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    @media (max-width: 600px) {
      .form-row-2 {
        grid-template-columns: 1fr;
      }
    }

    .label-heading {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--ion-text-color, #1e293b);
      margin-bottom: 0.35rem;
    }

    .required {
      color: var(--ion-color-danger, #eb445a);
    }

    .async-spinner {
      width: 16px;
      height: 16px;
    }

    .async-text {
      font-size: 0.75rem;
      color: var(--ion-color-primary, #3880ff);
      font-weight: normal;
    }

    input, select {
      width: 100%;
      padding: 0.65rem 0.85rem;
      border: 1.5px solid var(--ion-color-step-200, #cbd5e1);
      border-radius: 8px;
      background: var(--ion-background-color, #ffffff);
      color: var(--ion-text-color, #1e293b);
      font-size: 0.92rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    input:focus-visible, select:focus-visible {
      outline: none;
      border-color: var(--ion-color-tertiary, #5260ff);
      box-shadow: 0 0 0 3px rgba(82, 96, 255, 0.22);
    }

    .field-error-border {
      border-color: var(--ion-color-danger, #eb445a) !important;
    }

    .error-msg {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.8rem;
      color: var(--ion-color-danger, #eb445a);
      font-weight: 500;
    }

    .text-danger {
      color: #b91c1c;
      font-weight: 600;
    }

    .form-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .btn-save {
      font-weight: 700;
    }

    .btn-reset {
      background: transparent;
      border: 1px dashed var(--ion-color-step-300, #94a3b8);
      color: #64748b;
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: background 0.15s;
    }

    .btn-reset:hover {
      background: var(--ion-color-step-100, #f1f5f9);
    }

    /* Vista Previa Reactiva */
    .preview-card {
      background: #ffffff !important;
      --background: #ffffff !important;
    }

    .preview-badge {
      display: inline-block;
      background: #e0e7ff;
      color: #3730a3;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .preview-device-screen {
      background: #ffffff;
      border-radius: 12px;
      padding: 1.25rem;
      border: 1px solid #cbd5e1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .device-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f1f5f9;
      margin-bottom: 1rem;
    }

    .device-icon {
      font-size: 2.2rem;
    }

    .device-title {
      margin: 0;
      font-size: 1.1rem;
      color: #0f172a;
      font-weight: 700;
    }

    .sku-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-family: monospace;
      background: #f1f5f9;
      color: #475569;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      margin-top: 0.25rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.45rem 0;
      font-size: 0.9rem;
      border-bottom: 1px dashed #f1f5f9;
    }

    .detail-label {
      color: #64748b;
    }

    .detail-val {
      font-weight: 600;
      color: #1e293b;
    }

    .price-val {
      color: #059669;
      font-size: 1.05rem;
    }

    .total-val {
      color: #2563eb;
      font-size: 1.1rem;
      font-weight: 800;
    }

    .stock-warn {
      color: #d97706;
    }
  `]
})
export class RegistrosPage implements OnInit {
  activeSegment = signal<'alta' | 'listado'>('alta');
  registroForm!: FormGroup;
  isSubmitting = signal<boolean>(false);
  showToast = signal<boolean>(false);
  toastMessage = signal<string>('');
  hardwareList = signal<HardwareItem[]>([]);
  currentUser = signal(this.authService.getCurrentUser());

  // Data binding computado para la ficha técnica reactiva
  livePreview = signal({
    producto: '',
    sku: '',
    categoria: 'Servidores',
    stock: 10,
    precio: 1500,
    responsableEmail: '',
    estado: 'Disponible'
  });

  tableColumns: ColumnDef[] = [
    { key: 'sku', header: 'Código SKU' },
    { key: 'producto', header: 'Equipo / Producto' },
    { key: 'categoria', header: 'Categoría' },
    { key: 'stock', header: 'Stock' },
    { key: 'precio', header: 'Precio' },
    { key: 'estado', header: 'Estado' }
  ];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadHardware();

    // Actualiza preview reactivamente conforme el usuario escribe
    this.registroForm.valueChanges.subscribe(val => {
      this.livePreview.set({
        producto: val.producto || 'Servidor Rack Demo',
        sku: val.sku || 'SRV-DEMO-001',
        categoria: val.categoria || 'Servidores',
        stock: val.stock !== null && val.stock !== undefined ? val.stock : 0,
        precio: val.precio || 0,
        responsableEmail: val.responsableEmail || 'admin@empresa.com',
        estado: val.estado || 'Disponible'
      });
    });
  }

  private buildForm(): void {
    this.registroForm = this.fb.group({
      producto: ['Servidor Dell PowerEdge R650xs', [Validators.required, Validators.minLength(3)]],
      sku: ['', [Validators.required], [uniqueSkuValidator(this.authService)]],
      categoria: ['Servidores', [Validators.required]],
      stock: [8, [Validators.required, Validators.min(0), Validators.max(999)]],
      precio: [2890, [Validators.required, Validators.min(1)]],
      responsableEmail: ['soporte@empresa.com', [Validators.required, Validators.email]],
      estado: ['Disponible', [Validators.required]]
    });
  }

  private loadHardware(): void {
    this.dataService.getSqlRecords().subscribe({
      next: (data) => this.hardwareList.set(data),
      error: (err) => console.error('Error al cargar hardware:', err)
    });
  }

  onSegmentChange(event: any): void {
    this.activeSegment.set(event.detail.value);
    if (event.detail.value === 'listado') {
      this.loadHardware();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const ctrl = this.registroForm.get(fieldName);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  resetForm(): void {
    this.registroForm.reset({
      producto: '',
      sku: '',
      categoria: 'Servidores',
      stock: 1,
      precio: 100,
      responsableEmail: '',
      estado: 'Disponible'
    });
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    this.dataService.addSqlRecord(this.registroForm.value).subscribe({
      next: (created) => {
        this.isSubmitting.set(false);
        this.toastMessage.set(`¡Registro guardado con éxito! ID #${created.id} asignado en SQL.`);
        this.showToast.set(true);
        this.loadHardware();
        this.resetForm();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('Error al guardar registro:', err);
      }
    });
  }

  onItemSelected(item: Record<string, any>): void {
    this.toastMessage.set(`Seleccionado: ${item['producto']} (Stock: ${item['stock']} uds)`);
    this.showToast.set(true);
  }

  onDeleteRequested(item: Record<string, any>): void {
    if (confirm(`¿Confirma eliminar ${item['producto']} del inventario SQL?`)) {
      this.dataService.deleteSqlRecord(item['id']).subscribe(() => {
        this.toastMessage.set(`Registro #${item['id']} eliminado.`);
        this.showToast.set(true);
        this.loadHardware();
      });
    }
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'Disponible': return 'success';
      case 'Bajo Stock': return 'warning';
      case 'Agotado': return 'danger';
      default: return 'medium';
    }
  }
}
