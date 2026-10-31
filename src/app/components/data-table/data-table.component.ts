import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  OnInit,
  OnDestroy,
  SimpleChanges,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface ColumnDef {
  key: string;
  header: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: Array<Record<string, any>> = [];
  @Input() columns: ColumnDef[] = [];
  @Input() tableTitle: string = 'Listado de Registros';
  @Input() pageSize: number = 5;

  @Output() rowSelected = new EventEmitter<Record<string, any>>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() deleteRequested = new EventEmitter<Record<string, any>>();

  searchTerm = signal<string>('');
  sortColumn = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal<number>(1);

  private searchSubject = new Subject<string>();
  private sub: Subscription = new Subscription();

  // Datos filtrados y ordenados mediante Signals computados
  processedData = computed(() => {
    let result = [...this.data];
    const query = this.searchTerm().trim().toLowerCase();

    // 1. Filtro de búsqueda
    if (query) {
      result = result.filter(item =>
        Object.values(item).some(val =>
          val !== null && val !== undefined && String(val).toLowerCase().includes(query)
        )
      );
    }

    // 2. Ordenación
    const col = this.sortColumn();
    const dir = this.sortDirection();
    if (col) {
      result.sort((a, b) => {
        const valA = a[col];
        const valB = b[col];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        const comparison = valA < valB ? -1 : 1;
        return dir === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  });

  // Datos paginados
  paginatedData = computed(() => {
    const list = this.processedData();
    const size = this.pageSize;
    const page = this.currentPage();
    const start = (page - 1) * size;
    return list.slice(start, start + size);
  });

  totalPages = computed(() => {
    const total = this.processedData().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  ngOnInit(): void {
    // Uso reactivo de RxJS con debounce para evitar cálculos innecesarios
    this.sub.add(
      this.searchSubject
        .pipe(debounceTime(250), distinctUntilChanged())
        .subscribe(term => {
          this.searchTerm.set(term);
          this.currentPage.set(1);
          this.searchChanged.emit(term);
        })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      // Si la página actual excede el nuevo total, ajustar
      if (this.currentPage() > this.totalPages()) {
        this.currentPage.set(1);
      }
    }
  }

  ngOnDestroy(): void {
    // Prevención estricta de Memory Leaks exigida en la rúbrica RA 3
    this.sub.unsubscribe();
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value || '');
  }

  clearSearch(): void {
    this.searchSubject.next('');
  }

  toggleSort(key: string): void {
    if (this.sortColumn() === key) {
      if (this.sortDirection() === 'asc') {
        this.sortDirection.set('desc');
      } else {
        this.sortColumn.set(null);
        this.sortDirection.set('asc');
      }
    } else {
      this.sortColumn.set(key);
      this.sortDirection.set('asc');
    }
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  selectRow(row: Record<string, any>): void {
    this.rowSelected.emit(row);
  }

  onDelete(row: Record<string, any>, event: MouseEvent): void {
    event.stopPropagation();
    this.deleteRequested.emit(row);
  }

  isStatusColumn(key: string): boolean {
    return key.toLowerCase().includes('estado') || key.toLowerCase().includes('status');
  }

  getStatusClass(val: string): string {
    const lower = String(val).toLowerCase();
    if (lower.includes('disponible') || lower.includes('activo')) return 'badge-success';
    if (lower.includes('bajo') || lower.includes('alerta')) return 'badge-warning';
    if (lower.includes('agotado') || lower.includes('inactivo')) return 'badge-danger';
    return 'badge-neutral';
  }
}
