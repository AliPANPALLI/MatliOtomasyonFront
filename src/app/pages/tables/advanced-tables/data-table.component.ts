import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { SAMPLE_RECORDS, STATUS_CLASS, SampleRecord, T, fmtDate, fmtMoney } from './data';

type SortKey = keyof Pick<SampleRecord, 'code' | 'name' | 'category' | 'status' | 'date' | 'amount'>;

/** Arama + filtre + sıralama + sayfalama */
@Component({
  selector: 'app-data-table',
  imports: [TranslatePipe],
  template: `
    <!-- Araç çubuğu -->
    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-col gap-3 sm:flex-row">
        <div class="relative">
          <svg class="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-gray-400 ltr:left-3 rtl:right-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input type="search" [value]="query()" (input)="query.set($any($event.target).value); page.set(1)" [placeholder]="'table.search' | t" [class]="T.input + ' w-full ltr:pl-9 rtl:pr-9 sm:w-64'" />
        </div>
        <select [value]="category()" (change)="category.set($any($event.target).value); page.set(1)" [class]="T.input + ' sm:w-44'">
          <option value="" [selected]="!category()">{{ 'table.allCategories' | t }}</option>
          @for (c of categories; track c) { <option [value]="c" [selected]="c === category()">{{ c }}</option> }
        </select>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span>{{ 'table.show' | t }}</span>
        <select [value]="pageSize()" (change)="pageSize.set(+$any($event.target).value); page.set(1)" [class]="T.input + ' w-20'">
          @for (s of [5, 10, 20, 50]; track s) { <option [value]="s" [selected]="s === pageSize()">{{ s }}</option> }
        </select>
      </div>
    </div>

    <div [class]="T.wrap">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead class="border-b border-gray-100 bg-gray-50 dark:border-white/5 dark:bg-white/[0.02]">
            <tr>
              @for (col of columns; track col.key) {
                <th [class]="T.th" [class.text-end]="col.key === 'amount'">
                  <button type="button" (click)="sortBy(col.key)" class="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200">
                    {{ col.label | t }}
                    <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M8 9l4-4 4 4" [class.text-brand-500]="sortKey() === col.key && sortDir() === 'asc'" [attr.stroke-opacity]="sortKey() === col.key && sortDir() === 'asc' ? 1 : 0.35" />
                      <path d="M16 15l-4 4-4-4" [attr.stroke-opacity]="sortKey() === col.key && sortDir() === 'desc' ? 1 : 0.35" />
                    </svg>
                  </button>
                </th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-white/5">
            @for (r of paged(); track r.id) {
              <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                <td [class]="T.td">{{ r.code }}</td>
                <td [class]="T.tdStrong">{{ r.name }}</td>
                <td [class]="T.td">{{ r.category }}</td>
                <td [class]="T.td"><span [class]="T.badge + ' ' + STATUS_CLASS[r.status]">{{ 'table.status.' + r.status | t }}</span></td>
                <td [class]="T.td">{{ date(r.date) }}</td>
                <td [class]="T.tdStrong + ' text-end'">{{ money(r.amount) }}</td>
              </tr>
            } @empty {
              <tr><td colspan="6" class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">{{ 'table.noResults' | t }}</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sayfalama -->
    <div class="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ filtered().length ? (page() - 1) * pageSize() + 1 : 0 }}–{{ min(page() * pageSize(), filtered().length) }}
        / {{ filtered().length }} {{ 'table.records' | t }}
      </p>
      <nav class="flex items-center gap-1">
        <button type="button" [class]="T.btn" [disabled]="page() === 1" (click)="page.set(page() - 1)" [attr.aria-label]="'table.prev' | t">
          <svg class="size-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        @for (p of pages(); track $index) {
          @if (p === 0) {
            <span class="px-2 text-gray-400">…</span>
          } @else {
            <button
              type="button"
              (click)="page.set(p)"
              class="flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors"
              [class]="p === page() ? 'bg-brand-500 text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'"
            >{{ p }}</button>
          }
        }
        <button type="button" [class]="T.btn" [disabled]="page() === totalPages()" (click)="page.set(page() + 1)" [attr.aria-label]="'table.next' | t">
          <svg class="size-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </nav>
    </div>
  `,
})
export class DataTableComponent {
  private readonly lang = inject(LanguageService);
  readonly T = T;
  readonly STATUS_CLASS = STATUS_CLASS;
  readonly categories = [...new Set(SAMPLE_RECORDS.map((r) => r.category))].sort();

  readonly columns: { key: SortKey; label: string }[] = [
    { key: 'code', label: 'table.col.code' },
    { key: 'name', label: 'table.col.name' },
    { key: 'category', label: 'table.col.category' },
    { key: 'status', label: 'table.col.status' },
    { key: 'date', label: 'table.col.date' },
    { key: 'amount', label: 'table.col.amount' },
  ];

  readonly query = signal('');
  readonly category = signal('');
  readonly sortKey = signal<SortKey>('code');
  readonly sortDir = signal<'asc' | 'desc'>('asc');
  readonly page = signal(1);
  readonly pageSize = signal(10);

  readonly filtered = computed(() => {
    const q = this.query().trim().toLocaleLowerCase('tr');
    const cat = this.category();
    const key = this.sortKey();
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    return SAMPLE_RECORDS.filter(
      (r) =>
        (!cat || r.category === cat) &&
        (!q || [r.code, r.name, r.category, r.owner].some((v) => v.toLocaleLowerCase('tr').includes(q))),
    ).sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      return (typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv), 'tr', { numeric: true })) * dir;
    });
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize())));
  readonly paged = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  /** 1 … 4 5 6 … 12 şeklinde sayfa numaraları (0 = üç nokta) */
  readonly pages = computed(() => {
    const total = this.totalPages();
    const cur = this.page();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const set = new Set([1, total, cur - 1, cur, cur + 1].filter((p) => p >= 1 && p <= total));
    const sorted = [...set].sort((a, b) => a - b);
    const out: number[] = [];
    sorted.forEach((p, i) => {
      if (i && p - sorted[i - 1] > 1) out.push(0);
      out.push(p);
    });
    return out;
  });

  sortBy(key: SortKey): void {
    if (this.sortKey() === key) this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
  }

  min(a: number, b: number) {
    return Math.min(a, b);
  }
  money(v: number) {
    return fmtMoney(v, this.lang.lang());
  }
  date(iso: string) {
    return fmtDate(iso, this.lang.lang());
  }
}
