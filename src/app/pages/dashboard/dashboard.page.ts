import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonBadge,
  IonSpinner,
  IonToast,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../../services/data.service';
import { ExportService } from '../../services/export.service';
import { AuthService } from '../../services/auth.service';
import { StatsWidgetComponent } from '../../components/stats-widget/stats-widget.component';
import { DataTableComponent, ColumnDef } from '../../components/data-table/data-table.component';
import { HardwareItem, AuditLog } from '../../models/user.model';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonBadge,
    IonSpinner,
    IonToast,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    StatsWidgetComponent,
    DataTableComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Cuadro de Mando Ejecutivo (Admin)</ion-title>
        <ion-buttons slot="end">
          <ion-badge color="warning" class="role-badge">ADMINISTRADOR</ion-badge>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding dashboard-content" role="main">
      <!-- Barra superior de bienvenida y acciones globales -->
      <div class="dashboard-header-row">
        <div>
          <h2 class="dashboard-title">Panel de Control & Exposición de Métricas</h2>
          <p class="dashboard-sub">
            Consolidación concurrente asíncrona: Inventario SQL + Auditoría en tiempo real NoSQL.
          </p>
        </div>

        <div class="action-buttons-group">
          <ion-button color="danger" (click)="exportarPdf()" class="btn-export">
            Exportar Informe PDF
          </ion-button>
          <ion-button color="success" (click)="exportarCsv()" class="btn-export">
            Exportar Datos CSV
          </ion-button>
          <ion-button fill="outline" color="primary" (click)="recargarDatos()" title="Refrescar">
            Refrescar
          </ion-button>
        </div>
      </div>

      <!-- Spinner de Carga Asíncrona Concurrente (forkJoin) -->
      @if (isLoading()) {
        <div class="loading-state" role="status" aria-live="polite">
          <ion-spinner name="bubbles" color="primary"></ion-spinner>
          <p>Orquestando datos concurrentes desde SQL y NoSQL con RxJS...</p>
        </div>
      } @else {
        <!-- 1. WIDGETS ESTADÍSTICOS PERSONALIZADOS -->
        <div class="stats-grid">
          <app-stats-widget
            title="Total Unidades Stock (SQL)"
            [value]="totalStock()"
            trendText="+8% este mes"
            trendColor="#16a34a"
            subtitle="Equipos disponibles"
          >
          </app-stats-widget>

          <app-stats-widget
            title="Valor del Inventario"
            [value]="(totalValor() | currency:'EUR':'symbol':'1.0-0':'es-ES') || '0 €'"
            trendText="Activo consolidado"
            trendColor="#2563eb"
            subtitle="Cálculo dinámico"
          >
          </app-stats-widget>

          <app-stats-widget
            title="Alertas Bajo Stock"
            [value]="stockCritico()"
            trendText="Requiere reposición"
            trendColor="#dc2626"
            badge="Crítico"
            badgeBg="#ef4444"
          >
          </app-stats-widget>

          <app-stats-widget
            title="Logs NoSQL Tiempo Real"
            [value]="noSqlLogs().length"
            trendText="Sincronizado"
            trendColor="#0284c7"
            badge="Live"
            badgeBg="#0ea5e9"
          >
          </app-stats-widget>
        </div>

        <!-- 2. SECCIÓN DEL GRÁFICO INTERACTIVO CHART.JS -->
        <ion-card class="chart-card">
          <ion-card-header>
            <div class="chart-header-flex">
              <div>
                <ion-card-title>Distribución de Stock por Categoría (Chart.js)</ion-card-title>
                <p class="chart-desc">Gráfico visual interactivo con actualización en tiempo real.</p>
              </div>

              <!-- Filtro Interactivo del Gráfico -->
              <div class="chart-filter-pills" role="group" aria-label="Filtro de métricas">
                <button
                  type="button"
                  class="pill-btn"
                  [class.active]="chartMetric() === 'stock'"
                  (click)="setChartMetric('stock')"
                >
                  Unidades en Stock
                </button>
                <button
                  type="button"
                  class="pill-btn"
                  [class.active]="chartMetric() === 'valor'"
                  (click)="setChartMetric('valor')"
                >
                  Valor Monetario (€)
                </button>
              </div>
            </div>
          </ion-card-header>
          <ion-card-content>
            <div class="chart-canvas-wrapper">
              <canvas #chartCanvas aria-label="Gráfico de distribución de hardware"></canvas>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- 3. TABLA CONSOLIDADA SQL & REGISTROS DE AUDITORÍA NOSQL -->
        <div class="dashboard-data-grid">
          <!-- Columna Izquierda: Tabla Personalizada Avanzada -->
          <div class="data-col-left">
            <app-data-table
              [data]="sqlData()"
              [columns]="columns"
              tableTitle="Inventario Consolidado de Hardware (SQL)"
              [pageSize]="5"
              (rowSelected)="onRowSelected($event)"
              (deleteRequested)="onDeleteRecord($event)"
            >
            </app-data-table>
          </div>

          <!-- Columna Derecha: Stream NoSQL / Firestore en tiempo real -->
          <div class="data-col-right">
            <ion-card class="nosql-card">
              <ion-card-header>
                <div class="nosql-header-row">
                  <ion-card-title>Auditoría en Tiempo Real (NoSQL)</ion-card-title>
                  <span class="live-dot" title="Sincronización activa"></span>
                </div>
                <p class="nosql-desc">Últimos eventos emitidos por el flujo reactivo.</p>
              </ion-card-header>
              <ion-card-content>
                <div class="logs-feed" role="feed" aria-label="Logs de auditoría NoSQL">
                  @for (log of noSqlLogs(); track log.id) {
                    <div class="log-item">
                      <div class="log-meta">
                        <span class="log-badge" [ngClass]="getLogActionClass(log.accion)">
                          {{ log.accion }}
                        </span>
                        <span class="log-time">{{ log.timestamp }}</span>
                      </div>
                      <p class="log-text">{{ log.detalles }}</p>
                      <span class="log-user">Usuario: {{ log.usuario }}</span>
                    </div>
                  } @empty {
                    <p class="empty-logs">No hay eventos recientes registrados.</p>
                  }
                </div>
              </ion-card-content>
            </ion-card>
          </div>
        </div>
      }

      <ion-toast
        [isOpen]="showToast()"
        [message]="toastMessage()"
        [duration]="3000"
        (didDismiss)="showToast.set(false)"
        color="dark"
      >
      </ion-toast>
    </ion-content>
  `,
  styles: [`
    .dashboard-content {
      --background: var(--ion-color-step-50, #f8fafc);
    }

    .role-badge {
      font-size: 0.75rem;
      margin-right: 0.5rem;
      letter-spacing: 0.05em;
    }

    .dashboard-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .dashboard-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--ion-text-color, #0f172a);
      margin: 0;
    }

    .dashboard-sub {
      margin: 0.25rem 0 0 0;
      color: #64748b;
      font-size: 0.92rem;
    }

    .action-buttons-group {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .btn-export {
      font-weight: 600;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 1rem;
      color: #64748b;
      font-size: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .chart-card {
      border-radius: 14px;
      border: 1px solid var(--ion-color-step-150, #e2e8f0);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      margin-bottom: 1.5rem;
      background: var(--ion-background-color, #ffffff);
    }

    .chart-header-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .chart-desc {
      margin: 0.25rem 0 0 0;
      font-size: 0.88rem;
      color: #64748b;
    }

    .chart-filter-pills {
      display: flex;
      background: #f1f5f9;
      padding: 0.25rem;
      border-radius: 8px;
      gap: 0.25rem;
    }

    .pill-btn {
      padding: 0.35rem 0.75rem;
      border: none;
      background: transparent;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      transition: all 0.15s;
    }

    .pill-btn.active {
      background: #ffffff;
      color: var(--ion-color-primary, #3880ff);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    .chart-canvas-wrapper {
      position: relative;
      height: 280px;
      width: 100%;
    }

    .dashboard-data-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    @media (max-width: 992px) {
      .dashboard-data-grid {
        grid-template-columns: 1fr;
      }
    }

    .nosql-card {
      border-radius: 14px;
      border: 1px solid var(--ion-color-step-150, #e2e8f0);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      background: var(--ion-background-color, #ffffff);
    }

    .nosql-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nosql-desc {
      margin: 0.25rem 0 0 0;
      font-size: 0.85rem;
      color: #64748b;
    }

    .live-dot {
      width: 10px;
      height: 10px;
      background-color: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.25);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.9; }
      50% { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.9; }
    }

    .logs-feed {
      max-height: 480px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .log-item {
      padding: 0.75rem;
      border-radius: 8px;
      background: var(--ion-color-step-50, #f8fafc);
      border-left: 3px solid var(--ion-color-primary, #3880ff);
      font-size: 0.85rem;
    }

    .log-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.35rem;
    }

    .log-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
    }

    .log-badge-login { background: #dbeafe; color: #1e40af; }
    .log-badge-create { background: #dcfce7; color: #166534; }
    .log-badge-update { background: #fef9c3; color: #854d0e; }
    .log-badge-delete { background: #fee2e2; color: #991b1b; }
    .log-badge-export { background: #f3e8ff; color: #6b21a8; }

    .log-time {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .log-text {
      margin: 0 0 0.25rem 0;
      color: var(--ion-text-color, #1e293b);
      line-height: 1.4;
    }

    .log-user {
      font-size: 0.78rem;
      color: #64748b;
    }

    .empty-logs {
      text-align: center;
      color: #94a3b8;
      padding: 2rem 0;
    }
  `]
})
export class DashboardPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  isLoading = signal<boolean>(true);
  sqlData = signal<HardwareItem[]>([]);
  noSqlLogs = signal<AuditLog[]>([]);

  totalStock = signal<number>(0);
  totalValor = signal<number>(0);
  stockCritico = signal<number>(0);

  chartMetric = signal<'stock' | 'valor'>('stock');
  showToast = signal<boolean>(false);
  toastMessage = signal<string>('');

  private chart: Chart | null = null;
  private sub = new Subscription();

  columns: ColumnDef[] = [
    { key: 'sku', header: 'Código SKU' },
    { key: 'producto', header: 'Dispositivo / Hardware' },
    { key: 'categoria', header: 'Categoría' },
    { key: 'stock', header: 'Stock' },
    { key: 'precio', header: 'Precio Unit.' },
    { key: 'estado', header: 'Estado' }
  ];

  constructor(
    private dataService: DataService,
    private exportService: ExportService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngAfterViewInit(): void {
    // El gráfico se creará en cuanto los datos se carguen
  }

  ngOnDestroy(): void {
    // Prevención de fugas de memoria exigida en RA 3
    this.sub.unsubscribe();
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  cargarDatos(): void {
    this.isLoading.set(true);

    // Orquestación Asíncrona Concurrente con forkJoin (cumple RA 5)
    this.sub.add(
      this.dataService.getConsolidatedDashboardData().subscribe({
        next: (data) => {
          this.sqlData.set(data.sql);
          this.noSqlLogs.set(data.nosql);
          this.totalStock.set(data.stats.totalItems);
          this.totalValor.set(data.stats.totalValor);
          this.stockCritico.set(data.stats.stockCritico);
          this.isLoading.set(false);

          // Inicializar o refrescar gráfico
          setTimeout(() => this.renderChart(), 100);
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('Error al cargar datos consolidados:', err);
        }
      })
    );

    // Suscripción al stream NoSQL de eventos en vivo
    this.sub.add(
      this.dataService.noSqlLogs$.subscribe(logs => {
        this.noSqlLogs.set(logs);
      })
    );
  }

  recargarDatos(): void {
    this.cargarDatos();
    this.toastMessage.set('Datos actualizados desde SQL y NoSQL.');
    this.showToast.set(true);
  }

  setChartMetric(metric: 'stock' | 'valor'): void {
    this.chartMetric.set(metric);
    this.renderChart();
  }

  private renderChart(): void {
    if (!this.chartCanvas) return;
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const items = this.sqlData();
    const categories = ['Servidores', 'Redes', 'Almacenamiento', 'Seguridad'];

    let chartData: number[] = [];
    if (this.chartMetric() === 'stock') {
      chartData = categories.map(cat =>
        items.filter(i => i.categoria === cat).reduce((sum, i) => sum + i.stock, 0)
      );
    } else {
      chartData = categories.map(cat =>
        items.filter(i => i.categoria === cat).reduce((sum, i) => sum + (i.precio * i.stock), 0)
      );
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: this.chartMetric() === 'stock' ? 'Unidades en Stock' : 'Valor Total (€)',
          data: chartData,
          backgroundColor: [
            'rgba(56, 128, 255, 0.75)',
            'rgba(61, 194, 255, 0.75)',
            'rgba(82, 96, 255, 0.75)',
            'rgba(45, 211, 111, 0.75)'
          ],
          borderColor: [
            '#3880ff',
            '#3dc2ff',
            '#5260ff',
            '#2dd36f'
          ],
          borderWidth: 1.5,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const val = context.parsed.y ?? 0;
                return this.chartMetric() === 'valor'
                  ? ` ${val.toLocaleString('es-ES')} €`
                  : ` ${val} unidades`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  onRowSelected(row: Record<string, any>): void {
    this.toastMessage.set(`Elemento seleccionado: ${row['producto']} (${row['sku']})`);
    this.showToast.set(true);
  }

  onDeleteRecord(record: Record<string, any>): void {
    if (confirm(`¿Confirma eliminar el dispositivo ${record['producto']}?`)) {
      this.dataService.deleteSqlRecord(record['id']).subscribe(() => {
        this.cargarDatos();
        this.toastMessage.set(`Registro #${record['id']} eliminado.`);
        this.showToast.set(true);
      });
    }
  }

  exportarCsv(): void {
    const data = this.sqlData().map(i => ({
      ID: i.id,
      SKU: i.sku,
      Producto: i.producto,
      Categoria: i.categoria,
      Stock: i.stock,
      PrecioUnitario: i.precio,
      ValorTotal: i.precio * i.stock,
      Responsable: i.responsableEmail,
      Estado: i.estado,
      FechaAlta: i.fechaAlta
    }));

    this.exportService.exportToCsv('informe_inventario_hardware', data);

    this.dataService.addNoSqlLog({
      usuario: this.authService.getCurrentUser()?.email || 'admin@empresa.com',
      accion: 'EXPORT_CSV',
      detalles: 'Descarga de informe tabulado en formato CSV'
    });

    this.toastMessage.set('Informe CSV generado y descargado correctamente.');
    this.showToast.set(true);
  }

  exportarPdf(): void {
    const headers = ['ID', 'SKU', 'Producto', 'Categoría', 'Stock', 'Precio (€)', 'Total (€)', 'Estado'];
    const body = this.sqlData().map(i => [
      i.id,
      i.sku,
      i.producto,
      i.categoria,
      i.stock,
      `${i.precio.toLocaleString('es-ES')} €`,
      `${(i.precio * i.stock).toLocaleString('es-ES')} €`,
      i.estado
    ]);

    this.exportService.exportToPdf(
      'INFORME OFICIAL CONSOLIDADO DE HARDWARE',
      headers,
      body,
      'informe_oficial_hardware'
    );

    this.dataService.addNoSqlLog({
      usuario: this.authService.getCurrentUser()?.email || 'admin@empresa.com',
      accion: 'EXPORT_PDF',
      detalles: 'Generación de informe ejecutivo oficial en formato PDF'
    });

    this.toastMessage.set('Informe PDF profesional generado y descargado.');
    this.showToast.set(true);
  }

  getLogActionClass(action: string): string {
    switch (action) {
      case 'LOGIN': return 'log-badge-login';
      case 'CREATE': return 'log-badge-create';
      case 'UPDATE': return 'log-badge-update';
      case 'DELETE': return 'log-badge-delete';
      case 'EXPORT_PDF':
      case 'EXPORT_CSV': return 'log-badge-export';
      default: return 'log-badge-login';
    }
  }
}
