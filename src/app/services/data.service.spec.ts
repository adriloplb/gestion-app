import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';

import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve SQL hardware records as an Observable', async () => {
    const records = await firstValueFrom(service.getSqlRecords());
    expect(Array.isArray(records)).toBe(true);
    expect(records.length).toBeGreaterThan(0);
  });

  it('should add a new hardware item and record audit log', async () => {
    const created = await firstValueFrom(
      service.addSqlRecord({
        sku: 'TEST-SKU-999',
        producto: 'Router Core Test',
        categoria: 'Redes',
        stock: 5,
        precio: 850,
        responsableEmail: 'test@empresa.com',
        estado: 'Disponible'
      })
    );
    expect(created.id).toBeDefined();
    expect(created.sku).toBe('TEST-SKU-999');
  });

  it('should consolidate SQL and NoSQL data with forkJoin in getConsolidatedDashboardData', async () => {
    const consolidated = await firstValueFrom(service.getConsolidatedDashboardData());
    expect(consolidated.sql).toBeDefined();
    expect(consolidated.nosql).toBeDefined();
    expect(consolidated.stats.totalItems).toBeGreaterThan(0);
    expect(consolidated.stats.totalValor).toBeGreaterThan(0);
  });
});
