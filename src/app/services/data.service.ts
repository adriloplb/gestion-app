import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, forkJoin, of, throwError } from 'rxjs';
import { delay, tap, map } from 'rxjs/operators';
import { HardwareItem, AuditLog } from '../models/user.model';

const STORAGE_SQL_KEY = 'gestion_app_sql_hardware';
const STORAGE_NOSQL_KEY = 'gestion_app_nosql_logs';

@Injectable({ providedIn: 'root' })
export class DataService {
  // 1. Simulación de Base de Datos Relacional SQL (Inventario Hardware)
  private initialSqlHardware: HardwareItem[] = [
    {
      id: 1,
      sku: 'SRV-2024-001',
      producto: 'Servidor Dell PowerEdge R750 2U',
      categoria: 'Servidores',
      stock: 14,
      precio: 3450,
      responsableEmail: 'admin@empresa.com',
      estado: 'Disponible',
      fechaAlta: '2024-01-15'
    },
    {
      id: 2,
      sku: 'SWT-2024-002',
      producto: 'Switch Cisco Catalyst 9200 48P PoE+',
      categoria: 'Redes',
      stock: 28,
      precio: 1890,
      responsableEmail: 'soporte@empresa.com',
      estado: 'Disponible',
      fechaAlta: '2024-02-10'
    },
    {
      id: 3,
      sku: 'SAI-2024-003',
      producto: 'SAI APC Smart-UPS Online 3000VA',
      categoria: 'Seguridad',
      stock: 4,
      precio: 1250,
      responsableEmail: 'admin@empresa.com',
      estado: 'Bajo Stock',
      fechaAlta: '2024-03-05'
    },
    {
      id: 4,
      sku: 'FW-2024-004',
      producto: 'Firewall Fortinet FortiGate 100F',
      categoria: 'Seguridad',
      stock: 9,
      precio: 2750,
      responsableEmail: 'admin@empresa.com',
      estado: 'Disponible',
      fechaAlta: '2024-03-22'
    },
    {
      id: 5,
      sku: 'NAS-2024-005',
      producto: 'Almacenamiento Synology RackStation 12 Bay',
      categoria: 'Almacenamiento',
      stock: 6,
      precio: 2100,
      responsableEmail: 'soporte@empresa.com',
      estado: 'Disponible',
      fechaAlta: '2024-04-12'
    },
    {
      id: 6,
      sku: 'RTR-2024-006',
      producto: 'Router MikroTik CCR2004 12S+2XS',
      categoria: 'Redes',
      stock: 0,
      precio: 620,
      responsableEmail: 'user@empresa.com',
      estado: 'Agotado',
      fechaAlta: '2024-04-30'
    }
  ];

  // 2. Simulación de NoSQL / Firebase Firestore en Tiempo Real (Eventos de Auditoría)
  private initialNoSqlLogs: AuditLog[] = [
    {
      id: 'doc-log-101',
      usuario: 'admin@empresa.com',
      accion: 'LOGIN',
      detalles: 'Inicio de sesión con credencial de Administrador',
      timestamp: new Date(Date.now() - 3600000 * 2).toLocaleTimeString()
    },
    {
      id: 'doc-log-102',
      usuario: 'user@empresa.com',
      accion: 'UPDATE',
      detalles: 'Actualización de inventario en lote SQL',
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString()
    },
    {
      id: 'doc-log-103',
      usuario: 'admin@empresa.com',
      accion: 'EXPORT_PDF',
      detalles: 'Generación de informe consolidado ejecutivo en PDF',
      timestamp: new Date(Date.now() - 1800000).toLocaleTimeString()
    }
  ];

  private sqlHardwareList: HardwareItem[] = [];
  private noSqlLogsSubject: BehaviorSubject<AuditLog[]>;
  public noSqlLogs$: Observable<AuditLog[]>;

  constructor() {
    this.sqlHardwareList = this.loadSqlData();
    const storedLogs = this.loadNoSqlData();
    this.noSqlLogsSubject = new BehaviorSubject<AuditLog[]>(storedLogs);
    this.noSqlLogs$ = this.noSqlLogsSubject.asObservable();
  }

  private loadSqlData(): HardwareItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_SQL_KEY);
      return raw ? JSON.parse(raw) : [...this.initialSqlHardware];
    } catch {
      return [...this.initialSqlHardware];
    }
  }

  private saveSqlData(): void {
    try {
      localStorage.setItem(STORAGE_SQL_KEY, JSON.stringify(this.sqlHardwareList));
    } catch (e) {
      console.warn('Error al persistir SQL en localStorage:', e);
    }
  }

  private loadNoSqlData(): AuditLog[] {
    try {
      const raw = localStorage.getItem(STORAGE_NOSQL_KEY);
      return raw ? JSON.parse(raw) : [...this.initialNoSqlLogs];
    } catch {
      return [...this.initialNoSqlLogs];
    }
  }

  private saveNoSqlData(logs: AuditLog[]): void {
    try {
      localStorage.setItem(STORAGE_NOSQL_KEY, JSON.stringify(logs));
    } catch (e) {
      console.warn('Error al persistir NoSQL en localStorage:', e);
    }
  }

  // API REST SQL: Obtener todos los registros de inventario (asíncrono con Observable)
  public getSqlRecords(): Observable<HardwareItem[]> {
    return of([...this.sqlHardwareList]).pipe(delay(450));
  }

  // API REST SQL: Crear nuevo registro desde formulario declarativo
  public addSqlRecord(item: Omit<HardwareItem, 'id' | 'fechaAlta'>): Observable<HardwareItem> {
    const nextId = this.sqlHardwareList.length > 0
      ? Math.max(...this.sqlHardwareList.map(h => h.id)) + 1
      : 1;

    const newItem: HardwareItem = {
      ...item,
      id: nextId,
      fechaAlta: new Date().toISOString().split('T')[0]
    };

    this.sqlHardwareList = [newItem, ...this.sqlHardwareList];
    this.saveSqlData();

    // Registramos evento en NoSQL tiempo real
    this.addNoSqlLog({
      usuario: item.responsableEmail || 'admin@empresa.com',
      accion: 'CREATE',
      detalles: `Nuevo equipo registrado: ${newItem.producto} (${newItem.sku})`
    });

    return of(newItem).pipe(delay(400));
  }

  // API REST SQL: Eliminar registro
  public deleteSqlRecord(id: number): Observable<boolean> {
    const prev = this.sqlHardwareList.length;
    this.sqlHardwareList = this.sqlHardwareList.filter(item => item.id !== id);
    this.saveSqlData();

    this.addNoSqlLog({
      usuario: 'admin@empresa.com',
      accion: 'DELETE',
      detalles: `Baja de elemento de hardware ID #${id}`
    });

    return of(this.sqlHardwareList.length < prev).pipe(delay(300));
  }

  // NoSQL / Firestore: Añadir evento a la colección en tiempo real
  public addNoSqlLog(entry: { usuario: string; accion: AuditLog['accion']; detalles: string }): void {
    const newLog: AuditLog = {
      id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      usuario: entry.usuario,
      accion: entry.accion,
      detalles: entry.detalles,
      timestamp: new Date().toLocaleTimeString()
    };

    const updated = [newLog, ...this.noSqlLogsSubject.value].slice(0, 20); // Mantiene últimos 20
    this.saveNoSqlData(updated);
    this.noSqlLogsSubject.next(updated);
  }

  // NoSQL / Firestore: Obtener snapshot
  public getNoSqlLogs(): Observable<AuditLog[]> {
    return of(this.noSqlLogsSubject.value).pipe(delay(300));
  }

  // Orquestación Asíncrona Concurrente (forkJoin) para Cuadro de Mando
  public getConsolidatedDashboardData(): Observable<{
    sql: HardwareItem[];
    nosql: AuditLog[];
    stats: {
      totalItems: number;
      totalValor: number;
      stockCritico: number;
      categoriasCount: Record<string, number>;
    };
  }> {
    return forkJoin({
      sql: this.getSqlRecords(),
      nosql: this.getNoSqlLogs()
    }).pipe(
      map(({ sql, nosql }) => {
        const totalItems = sql.reduce((acc, curr) => acc + curr.stock, 0);
        const totalValor = sql.reduce((acc, curr) => acc + (curr.precio * curr.stock), 0);
        const stockCritico = sql.filter(h => h.stock <= 4).length;

        const categoriasCount: Record<string, number> = {};
        for (const item of sql) {
          categoriasCount[item.categoria] = (categoriasCount[item.categoria] || 0) + item.stock;
        }

        return {
          sql,
          nosql,
          stats: {
            totalItems,
            totalValor,
            stockCritico,
            categoriasCount
          }
        };
      })
    );
  }
}
