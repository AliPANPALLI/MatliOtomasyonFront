import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { PopupService } from '../../../core/popup/popup.service';
import { SAMPLE_RECORDS, STATUS_CLASS, SampleRecord, T, fmtDate, fmtMoney } from './data';

/** Para/tarih biçimlendirme için ortak taban */
abstract class TableBase {
  protected readonly lang = inject(LanguageService);
  readonly T = T;
  readonly STATUS_CLASS = STATUS_CLASS;
  money(v: number) {
    return fmtMoney(v, this.lang.lang());
  }
  date(iso: string) {
    return fmtDate(iso, this.lang.lang());
  }
}

/* =====================================================================
 * 1) Seçilebilir satırlar + toplu işlem çubuğu
 * ===================================================================== */
@Component({
  selector: 'app-selectable-table',
  imports: [TranslatePipe],
  template: `
    @if (selected().size) {
      <div class="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-25 px-4 py-2.5 animate-in fade-in slide-in-from-top-1 dark:border-brand-500/30 dark:bg-brand-500/10">
        <span class="text-sm font-medium text-brand-700 dark:text-brand-300">{{ selected().size }} {{ 'table.selected' | t }}</span>
        <div class="flex gap-2">
          <button type="button" [class]="T.btn" (click)="clearSelection()">{{ 'table.clearSelection' | t }}</button>
          <button type="button" [class]="T.btn + ' !border-error-300 !text-error-600 hover:!bg-error-50 dark:!border-error-500/40 dark:!text-error-400'" (click)="deleteSelected()">
            {{ 'table.deleteSelected' | t }}
          </button>
        </div>
      </div>
    }
    <div [class]="T.wrap">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead class="border-b border-gray-100 dark:border-white/5">
            <tr>
              <th class="w-12 px-5 py-3">
                <input type="checkbox" [class]="T.checkbox" [checked]="allSelected()" [indeterminate]="someSelected()" (change)="toggleAll()" [attr.aria-label]="'table.selectAll' | t" />
              </th>
              <th [class]="T.th">{{ 'table.col.name' | t }}</th>
              <th [class]="T.th">{{ 'table.col.owner' | t }}</th>
              <th [class]="T.th">{{ 'table.col.status' | t }}</th>
              <th [class]="T.th + ' text-end'">{{ 'table.col.amount' | t }}</th>
              <th [class]="T.th + ' text-end'">{{ 'table.col.actions' | t }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-white/5">
            @for (r of rows(); track r.id) {
              @let isSel = selected().has(r.id);
              <tr class="transition-colors" [class]="isSel ? 'bg-brand-25 dark:bg-brand-500/[0.07]' : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'">
                <td class="px-5 py-3.5"><input type="checkbox" [class]="T.checkbox" [checked]="isSel" (change)="toggle(r.id)" [attr.aria-label]="r.name" /></td>
                <td [class]="T.tdStrong">
                  <div class="flex items-center gap-3">
                    <span class="flex size-9 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">{{ initials(r.owner) }}</span>
                    <div>
                      <p>{{ r.name }}</p>
                      <p class="text-xs font-normal text-gray-500 dark:text-gray-400">{{ r.code }}</p>
                    </div>
                  </div>
                </td>
                <td [class]="T.td">{{ r.owner }}</td>
                <td [class]="T.td"><span [class]="T.badge + ' ' + STATUS_CLASS[r.status]">{{ 'table.status.' + r.status | t }}</span></td>
                <td [class]="T.tdStrong + ' text-end'">{{ money(r.amount) }}</td>
                <td class="px-5 py-3.5 text-end">
                  <div class="inline-flex gap-1">
                    <button type="button" (click)="view(r)" [title]="'table.view' | t" class="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-white/5">
                      <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
                    </button>
                    <button type="button" (click)="deleteOne(r)" [title]="'table.delete' | t" class="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-error-50 hover:text-error-600 dark:text-gray-400 dark:hover:bg-error-500/15">
                      <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4h6v3" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="6" class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">{{ 'table.noResults' | t }}</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class SelectableTableComponent extends TableBase {
  private readonly popup = inject(PopupService);
  readonly rows = signal<SampleRecord[]>(SAMPLE_RECORDS.slice(0, 6));
  readonly selected = signal<Set<number>>(new Set());
  readonly allSelected = computed(() => this.rows().length > 0 && this.selected().size === this.rows().length);
  readonly someSelected = computed(() => this.selected().size > 0 && !this.allSelected());
  clearSelection() {
    this.selected.set(new Set());
  }

  toggle(id: number) {
    this.selected.update((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  toggleAll() {
    this.selected.set(this.allSelected() ? new Set() : new Set(this.rows().map((r) => r.id)));
  }
  initials(name: string) {
    return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  }
  view(r: SampleRecord) {
    this.popup.info(r.name, r.code);
  }
  async deleteOne(r: SampleRecord) {
    const ok = await this.popup.confirm({ type: 'error', danger: true, title: this.lang.t('popupDemo.confirmTitle'), message: r.name, confirmText: this.lang.t('table.delete') });
    if (!ok) return;
    this.rows.update((list) => list.filter((x) => x.id !== r.id));
    this.selected.update((s) => { const n = new Set(s); n.delete(r.id); return n; });
    this.popup.success(this.lang.t('table.deleted'));
  }
  async deleteSelected() {
    const count = this.selected().size;
    const ok = await this.popup.confirm({ type: 'error', danger: true, title: this.lang.t('popupDemo.confirmTitle'), message: `${count} ${this.lang.t('table.selected')}`, confirmText: this.lang.t('table.delete') });
    if (!ok) return;
    const ids = this.selected();
    this.rows.update((list) => list.filter((x) => !ids.has(x.id)));
    this.selected.set(new Set());
    this.popup.success(this.lang.t('table.deleted'));
  }
}

/* =====================================================================
 * 2) Stil seçenekleri: zebra / kenarlıklı / sıkışık
 * ===================================================================== */
@Component({
  selector: 'app-styled-table',
  imports: [TranslatePipe],
  template: `
    <div class="mb-4 flex flex-wrap gap-2">
      @for (opt of options; track opt.key) {
        <button
          type="button"
          (click)="toggle(opt.key)"
          class="inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors"
          [class]="flags()[opt.key] ? 'border-brand-500 bg-brand-500 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'"
        >
          @if (flags()[opt.key]) {
            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          }
          {{ opt.label | t }}
        </button>
      }
    </div>
    <div [class]="T.wrap">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full" [class.border-collapse]="flags().bordered">
          <thead class="bg-gray-50 dark:bg-white/[0.02]">
            <tr>
              @for (h of headers; track h) {
                <th [class]="th()" [class.text-end]="h === 'table.col.quantity' || h === 'table.col.amount'">{{ h | t }}</th>
              }
            </tr>
          </thead>
          <tbody [class.divide-y]="!flags().bordered" class="divide-gray-100 dark:divide-white/5">
            @for (r of rows; track r.id; let odd = $odd) {
              <tr [class]="flags().striped && odd ? 'bg-gray-50 dark:bg-white/[0.025]' : ''" class="hover:bg-brand-25 dark:hover:bg-brand-500/[0.06]">
                <td [class]="td()">{{ r.code }}</td>
                <td [class]="td() + ' font-medium text-gray-800 dark:text-white/90'">{{ r.name }}</td>
                <td [class]="td()">{{ r.category }}</td>
                <td [class]="td()">{{ date(r.date) }}</td>
                <td [class]="td() + ' text-end'">{{ r.quantity }}</td>
                <td [class]="td() + ' text-end font-medium text-gray-800 dark:text-white/90'">{{ money(r.amount) }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class StyledTableComponent extends TableBase {
  readonly rows = SAMPLE_RECORDS.slice(10, 18);
  readonly headers = ['table.col.code', 'table.col.name', 'table.col.category', 'table.col.date', 'table.col.quantity', 'table.col.amount'];
  readonly options = [
    { key: 'striped', label: 'table.style.striped' },
    { key: 'bordered', label: 'table.style.bordered' },
    { key: 'compact', label: 'table.style.compact' },
  ] as const;
  readonly flags = signal({ striped: true, bordered: false, compact: false });

  toggle(key: 'striped' | 'bordered' | 'compact') {
    this.flags.update((f) => ({ ...f, [key]: !f[key] }));
  }
  th() {
    const f = this.flags();
    return `${f.compact ? 'px-3 py-2' : 'px-5 py-3'} text-start text-xs font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 ${
      f.bordered ? 'border border-gray-200 dark:border-white/10' : 'border-b border-gray-100 dark:border-white/5'
    }`;
  }
  td() {
    const f = this.flags();
    return `${f.compact ? 'px-3 py-1.5 text-xs' : 'px-5 py-3.5 text-sm'} text-gray-700 whitespace-nowrap dark:text-gray-300 ${
      f.bordered ? 'border border-gray-200 dark:border-white/10' : ''
    }`;
  }
}

/* =====================================================================
 * 3) Açılır (detaylı) satırlar
 * ===================================================================== */
@Component({
  selector: 'app-expandable-table',
  imports: [TranslatePipe],
  template: `
    <div [class]="T.wrap">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead class="border-b border-gray-100 dark:border-white/5">
            <tr>
              <th class="w-12 px-5 py-3"></th>
              <th [class]="T.th">{{ 'table.col.code' | t }}</th>
              <th [class]="T.th">{{ 'table.col.name' | t }}</th>
              <th [class]="T.th">{{ 'table.col.status' | t }}</th>
              <th [class]="T.th + ' text-end'">{{ 'table.col.amount' | t }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-white/5">
            @for (r of rows; track r.id) {
              @let open = expanded() === r.id;
              <tr class="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]" (click)="toggle(r.id)" [attr.aria-expanded]="open">
                <td class="px-5 py-3.5">
                  <span class="flex size-7 items-center justify-center rounded-md text-gray-500 transition-transform dark:text-gray-400" [class.rotate-90]="open">
                    <svg class="size-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                  </span>
                </td>
                <td [class]="T.td">{{ r.code }}</td>
                <td [class]="T.tdStrong">{{ r.name }}</td>
                <td [class]="T.td"><span [class]="T.badge + ' ' + STATUS_CLASS[r.status]">{{ 'table.status.' + r.status | t }}</span></td>
                <td [class]="T.tdStrong + ' text-end'">{{ money(r.amount) }}</td>
              </tr>
              @if (open) {
                <tr class="bg-gray-50/70 dark:bg-white/[0.02]">
                  <td></td>
                  <td colspan="4" class="px-5 py-4">
                    <dl class="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4 animate-in fade-in slide-in-from-top-1">
                      <div><dt class="text-xs text-gray-500 dark:text-gray-400">{{ 'table.col.category' | t }}</dt><dd class="mt-0.5 font-medium text-gray-800 dark:text-white/90">{{ r.category }}</dd></div>
                      <div><dt class="text-xs text-gray-500 dark:text-gray-400">{{ 'table.col.owner' | t }}</dt><dd class="mt-0.5 font-medium text-gray-800 dark:text-white/90">{{ r.owner }}</dd></div>
                      <div><dt class="text-xs text-gray-500 dark:text-gray-400">{{ 'table.col.date' | t }}</dt><dd class="mt-0.5 font-medium text-gray-800 dark:text-white/90">{{ date(r.date) }}</dd></div>
                      <div><dt class="text-xs text-gray-500 dark:text-gray-400">{{ 'table.col.quantity' | t }}</dt><dd class="mt-0.5 font-medium text-gray-800 dark:text-white/90">{{ r.quantity }}</dd></div>
                    </dl>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ExpandableTableComponent extends TableBase {
  readonly rows = SAMPLE_RECORDS.slice(20, 26);
  readonly expanded = signal<number | null>(SAMPLE_RECORDS[20].id);
  toggle(id: number) {
    this.expanded.update((cur) => (cur === id ? null : id));
  }
}

/* =====================================================================
 * 4) Sabit başlık + sabit ilk sütun (kaydırılabilir)
 * ===================================================================== */
@Component({
  selector: 'app-sticky-table',
  imports: [TranslatePipe],
  template: `
    <div [class]="T.wrap">
      <div class="custom-scrollbar max-h-96 overflow-auto">
        <table class="min-w-[1100px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th [class]="stickyHead + ' z-20 ltr:left-0 rtl:right-0 ltr:border-r rtl:border-l'">{{ 'table.col.name' | t }}</th>
              @for (h of headers; track h) {
                <th [class]="stickyHead + ' z-10'">{{ h | t }}</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (r of rows; track r.id) {
              <tr class="group">
                <td class="sticky z-[5] border-b border-gray-100 bg-white px-5 py-3.5 text-sm font-medium whitespace-nowrap text-gray-800 group-hover:bg-gray-50 ltr:left-0 ltr:border-r rtl:right-0 rtl:border-l dark:border-white/5 dark:bg-gray-900 dark:text-white/90 dark:group-hover:bg-gray-800">{{ r.name }}</td>
                <td [class]="cell">{{ r.code }}</td>
                <td [class]="cell">{{ r.category }}</td>
                <td [class]="cell">{{ r.owner }}</td>
                <td [class]="cell"><span [class]="T.badge + ' ' + STATUS_CLASS[r.status]">{{ 'table.status.' + r.status | t }}</span></td>
                <td [class]="cell">{{ date(r.date) }}</td>
                <td [class]="cell + ' text-end'">{{ r.quantity }}</td>
                <td [class]="cell + ' text-end font-medium text-gray-800 dark:text-white/90'">{{ money(r.amount) }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class StickyTableComponent extends TableBase {
  readonly rows = SAMPLE_RECORDS.slice(0, 25);
  readonly headers = ['table.col.code', 'table.col.category', 'table.col.owner', 'table.col.status', 'table.col.date', 'table.col.quantity', 'table.col.amount'];
  readonly stickyHead =
    'sticky top-0 border-b border-gray-200 bg-gray-50 px-5 py-3 text-start text-xs font-medium whitespace-nowrap text-gray-500 dark:border-white/10 dark:bg-gray-800 dark:text-gray-400';
  readonly cell =
    'border-b border-gray-100 px-5 py-3.5 text-sm whitespace-nowrap text-gray-700 group-hover:bg-gray-50 dark:border-white/5 dark:text-gray-300 dark:group-hover:bg-white/[0.02]';
}

/* =====================================================================
 * 5) Gruplu tablo (ara toplam + genel toplam)
 * ===================================================================== */
@Component({
  selector: 'app-grouped-table',
  imports: [TranslatePipe],
  template: `
    <div [class]="T.wrap">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead class="border-b border-gray-100 dark:border-white/5">
            <tr>
              <th [class]="T.th">{{ 'table.col.name' | t }}</th>
              <th [class]="T.th">{{ 'table.col.owner' | t }}</th>
              <th [class]="T.th + ' text-end'">{{ 'table.col.quantity' | t }}</th>
              <th [class]="T.th + ' text-end'">{{ 'table.col.amount' | t }}</th>
            </tr>
          </thead>
          @for (g of groups(); track g.name) {
            <tbody class="divide-y divide-gray-100 border-b border-gray-100 dark:divide-white/5 dark:border-white/5">
              <tr class="bg-brand-25 dark:bg-brand-500/[0.07]">
                <td colspan="4" class="px-5 py-2.5">
                  <button type="button" (click)="toggle(g.name)" class="flex items-center gap-2 text-sm font-semibold text-brand-700 dark:text-brand-300">
                    <svg class="size-4 transition-transform rtl:rotate-180" [class.rotate-90]="!collapsed().has(g.name)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    {{ g.name }}
                    <span class="rounded-full bg-brand-100 px-2 text-xs font-medium dark:bg-brand-500/20">{{ g.rows.length }}</span>
                  </button>
                </td>
              </tr>
              @if (!collapsed().has(g.name)) {
                @for (r of g.rows; track r.id) {
                  <tr>
                    <td [class]="T.tdStrong + ' ltr:pl-11 rtl:pr-11'">{{ r.name }}</td>
                    <td [class]="T.td">{{ r.owner }}</td>
                    <td [class]="T.td + ' text-end'">{{ r.quantity }}</td>
                    <td [class]="T.td + ' text-end'">{{ money(r.amount) }}</td>
                  </tr>
                }
              }
              <tr>
                <td colspan="2" class="px-5 py-2.5 text-xs font-medium text-gray-500 ltr:pl-11 rtl:pr-11 dark:text-gray-400">{{ 'table.subtotal' | t }}</td>
                <td class="px-5 py-2.5 text-end text-sm font-semibold text-gray-800 dark:text-white/90">{{ g.qty }}</td>
                <td class="px-5 py-2.5 text-end text-sm font-semibold text-gray-800 dark:text-white/90">{{ money(g.total) }}</td>
              </tr>
            </tbody>
          }
          <tfoot class="bg-gray-50 dark:bg-white/[0.03]">
            <tr>
              <td colspan="2" class="px-5 py-3.5 text-sm font-semibold text-gray-800 dark:text-white/90">{{ 'table.grandTotal' | t }}</td>
              <td class="px-5 py-3.5 text-end text-sm font-bold text-gray-800 dark:text-white/90">{{ grandQty() }}</td>
              <td class="px-5 py-3.5 text-end text-sm font-bold text-brand-600 dark:text-brand-400">{{ money(grandTotal()) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `,
})
export class GroupedTableComponent extends TableBase {
  private readonly rows = SAMPLE_RECORDS.slice(30, 44);
  readonly collapsed = signal<Set<string>>(new Set());
  readonly groups = computed(() => {
    const map = new Map<string, SampleRecord[]>();
    for (const r of this.rows) map.set(r.category, [...(map.get(r.category) ?? []), r]);
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b, 'tr'))
      .map(([name, rows]) => ({
        name,
        rows,
        qty: rows.reduce((s, r) => s + r.quantity, 0),
        total: rows.reduce((s, r) => s + r.amount, 0),
      }));
  });
  readonly grandQty = computed(() => this.groups().reduce((s, g) => s + g.qty, 0));
  readonly grandTotal = computed(() => this.groups().reduce((s, g) => s + g.total, 0));

  toggle(name: string) {
    this.collapsed.update((s) => {
      const n = new Set(s);
      n.has(name) ? n.delete(name) : n.add(name);
      return n;
    });
  }
}

/* =====================================================================
 * 6) Satır içi düzenlenebilir tablo
 * ===================================================================== */
@Component({
  selector: 'app-editable-table',
  imports: [TranslatePipe],
  template: `
    <div [class]="T.wrap">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead class="border-b border-gray-100 dark:border-white/5">
            <tr>
              <th [class]="T.th">{{ 'table.col.code' | t }}</th>
              <th [class]="T.th">{{ 'table.col.name' | t }}</th>
              <th [class]="T.th">{{ 'table.col.status' | t }}</th>
              <th [class]="T.th + ' text-end'">{{ 'table.col.quantity' | t }}</th>
              <th [class]="T.th + ' text-end'">{{ 'table.col.actions' | t }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-white/5">
            @for (r of rows(); track r.id) {
              @let editing = editId() === r.id;
              <tr [class]="editing ? 'bg-brand-25 dark:bg-brand-500/[0.07]' : ''">
                <td [class]="T.td">{{ r.code }}</td>
                <td [class]="T.tdStrong">
                  @if (editing) {
                    <input [class]="T.input + ' h-9 w-48'" [value]="draft().name" (input)="patch('name', $any($event.target).value)" />
                  } @else { {{ r.name }} }
                </td>
                <td [class]="T.td">
                  @if (editing) {
                    <select [class]="T.input + ' h-9 w-36'" [value]="draft().status" (change)="patch('status', $any($event.target).value)">
                      @for (s of statuses; track s) { <option [value]="s" [selected]="s === draft().status">{{ 'table.status.' + s | t }}</option> }
                    </select>
                  } @else {
                    <span [class]="T.badge + ' ' + STATUS_CLASS[r.status]">{{ 'table.status.' + r.status | t }}</span>
                  }
                </td>
                <td [class]="T.td + ' text-end'">
                  @if (editing) {
                    <input type="number" min="0" [class]="T.input + ' h-9 w-24 text-end'" [value]="draft().quantity" (input)="patch('quantity', +$any($event.target).value)" />
                  } @else { {{ r.quantity }} }
                </td>
                <td class="px-5 py-3 text-end whitespace-nowrap">
                  @if (editing) {
                    <div class="inline-flex gap-2">
                      <button type="button" [class]="T.btn" (click)="editId.set(null)">{{ 'popup.cancel' | t }}</button>
                      <button type="button" class="inline-flex h-9 items-center rounded-lg bg-brand-500 px-3 text-sm font-medium text-white hover:bg-brand-600" (click)="save()">{{ 'table.save' | t }}</button>
                    </div>
                  } @else {
                    <button type="button" [class]="T.btn" (click)="edit(r)">
                      <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg>
                      {{ 'table.edit' | t }}
                    </button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class EditableTableComponent extends TableBase {
  private readonly popup = inject(PopupService);
  readonly statuses = ['active', 'pending', 'passive'] as const;
  readonly rows = signal<SampleRecord[]>(SAMPLE_RECORDS.slice(45, 51).map((r) => ({ ...r })));
  readonly editId = signal<number | null>(null);
  readonly draft = signal<SampleRecord>({} as SampleRecord);

  edit(r: SampleRecord) {
    this.draft.set({ ...r });
    this.editId.set(r.id);
  }
  patch<K extends keyof SampleRecord>(key: K, value: SampleRecord[K]) {
    this.draft.update((d) => ({ ...d, [key]: value }));
  }
  save() {
    const d = this.draft();
    this.rows.update((list) => list.map((r) => (r.id === d.id ? d : r)));
    this.editId.set(null);
    this.popup.success(this.lang.t('table.saved'));
  }
}
