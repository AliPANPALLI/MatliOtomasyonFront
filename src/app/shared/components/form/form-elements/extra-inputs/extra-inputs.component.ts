import { Component, computed, inject, signal } from '@angular/core';
import { ComponentCardComponent } from '../../../common/component-card/component-card.component';
import { TranslatePipe } from '../../../../../core/i18n/translate.pipe';
import { PopupService } from '../../../../../core/popup/popup.service';
import { LanguageService } from '../../../../../core/i18n/language.service';

const INPUT =
  'w-full rounded-[10px] border border-gray-300 bg-white text-gray-800 shadow-theme-xs outline-hidden placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500';
const LABEL = 'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400';

/* ======================= Ek form elemanları (sağ sütun) ======================= */
@Component({
  selector: 'app-extra-inputs',
  imports: [ComponentCardComponent, TranslatePipe],
  host: { class: 'block space-y-6' },
  template: `
    <!-- Boyutlar -->
    <app-component-card [title]="'form.sizes' | t">
      <div class="space-y-4">
        <input type="text" [class]="INPUT + ' h-9 px-3 text-xs'" [placeholder]="'form.small' | t" />
        <input type="text" [class]="INPUT + ' h-11 px-4 text-sm'" [placeholder]="'form.medium' | t" />
        <input type="text" [class]="INPUT + ' h-13 px-5 text-base'" [placeholder]="'form.large' | t" />
      </div>
    </app-component-card>

    <!-- Sayı arttırıcı + arama + sayaç -->
    <app-component-card [title]="'form.special' | t">
      <div class="space-y-5">
        <div>
          <label [class]="LABEL">{{ 'form.stepper' | t }}</label>
          <div class="inline-flex h-11 items-center overflow-hidden rounded-[10px] border border-gray-300 shadow-theme-xs dark:border-gray-700">
            <button type="button" (click)="qty.set(max(0, qty() - 1))" [disabled]="qty() === 0" class="flex h-full w-11 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-white/5" aria-label="-">
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14" /></svg>
            </button>
            <input type="number" min="0" [value]="qty()" (input)="qty.set(max(0, +$any($event.target).value || 0))" class="h-full w-16 border-x border-gray-300 bg-white text-center text-sm font-medium text-gray-800 outline-hidden [appearance:textfield] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 [&::-webkit-inner-spin-button]:appearance-none" />
            <button type="button" (click)="qty.set(qty() + 1)" class="flex h-full w-11 items-center justify-center text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5" aria-label="+">
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
            </button>
          </div>
        </div>

        <div>
          <label [class]="LABEL">{{ 'form.search' | t }}</label>
          <div class="relative">
            <svg class="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-gray-400 ltr:left-3.5 rtl:right-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            <input type="text" [value]="search()" (input)="search.set($any($event.target).value)" [placeholder]="'table.search' | t" [class]="INPUT + ' h-11 ltr:pl-10 ltr:pr-10 rtl:pr-10 rtl:pl-10 text-sm'" />
            @if (search()) {
              <button type="button" (click)="search.set('')" [attr.aria-label]="'form.clear' | t" class="absolute top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 ltr:right-3 rtl:left-3 dark:hover:bg-white/5">
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            }
          </div>
        </div>

        <div>
          <div class="mb-1.5 flex justify-between">
            <label [class]="LABEL + ' !mb-0'">{{ 'form.counter' | t }}</label>
            <span class="text-xs" [class]="note().length > 180 ? 'text-warning-600' : 'text-gray-400'">{{ note().length }}/200</span>
          </div>
          <textarea rows="3" maxlength="200" [value]="note()" (input)="note.set($any($event.target).value)" [placeholder]="'Enter a description...' | t" [class]="INPUT + ' px-4 py-2.5 text-sm'"></textarea>
        </div>
      </div>
    </app-component-card>

    <!-- Etiket girişi -->
    <app-component-card [title]="'form.tagInput' | t">
      <div class="flex min-h-11 flex-wrap items-center gap-1.5 rounded-[10px] border border-gray-300 bg-white px-2 py-1.5 shadow-theme-xs focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900">
        @for (tag of tags(); track tag) {
          <span class="inline-flex items-center gap-1 rounded-md bg-brand-50 py-0.5 ps-2 pe-1 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
            {{ tag }}
            <button type="button" (click)="removeTag(tag)" class="rounded hover:bg-brand-100 dark:hover:bg-brand-500/25" [attr.aria-label]="'table.delete' | t">
              <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </span>
        }
        <input #tagEl type="text" (keydown)="onTagKey($event, tagEl)" [placeholder]="'form.tagHint' | t" class="min-w-24 flex-1 bg-transparent px-1 text-sm text-gray-800 outline-hidden placeholder:text-gray-400 dark:text-white/90" />
      </div>
    </app-component-card>

    <!-- Tarih aralığı + renk -->
    <app-component-card [title]="'form.dateRange' | t">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label [class]="LABEL">{{ 'form.start' | t }}</label>
          <input type="date" [value]="start()" (change)="start.set($any($event.target).value)" [class]="INPUT + ' h-11 px-4 text-sm'" />
        </div>
        <div>
          <label [class]="LABEL">{{ 'form.end' | t }}</label>
          <input type="date" [value]="end()" [min]="start()" (change)="end.set($any($event.target).value)" [class]="INPUT + ' h-11 px-4 text-sm'" [class.!border-red-500]="rangeInvalid()" />
        </div>
      </div>
      @if (rangeInvalid()) {
        <p class="mt-2 text-sm text-red-500">{{ 'form.rangeError' | t }}</p>
      }
      <div class="mt-5">
        <label [class]="LABEL">{{ 'form.color' | t }}</label>
        <div class="flex items-center gap-3">
          <input type="color" [value]="color()" (input)="color.set($any($event.target).value)" class="h-11 w-14 cursor-pointer rounded-[10px] border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-gray-900" />
          <code class="rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-700 dark:bg-white/5 dark:text-gray-300">{{ color() }}</code>
          @for (c of swatches; track c) {
            <button type="button" (click)="color.set(c)" class="size-7 rounded-full ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900" [style.background]="c" [class]="color() === c ? 'ring-gray-400' : 'ring-transparent'" [attr.aria-label]="c"></button>
          }
        </div>
      </div>
    </app-component-card>

    <!-- Kart seçenekler -->
    <app-component-card [title]="'form.choiceCards' | t">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        @for (n of [1, 2, 3]; track n) {
          <label class="relative flex cursor-pointer flex-col gap-1 rounded-xl border-2 p-4 transition-colors"
            [class]="plan() === n ? 'border-brand-500 bg-brand-25 dark:bg-brand-500/10' : 'border-gray-200 hover:border-brand-300 dark:border-gray-800'">
            <input type="radio" name="plan" class="sr-only" [checked]="plan() === n" (change)="plan.set(n)" />
            <span class="text-sm font-semibold text-gray-800 dark:text-white/90">{{ 'ui.option' | t }} {{ n }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ 'ui.sampleText' | t }}</span>
            @if (plan() === n) {
              <span class="absolute top-3 flex size-5 items-center justify-center rounded-full bg-brand-500 text-white ltr:right-3 rtl:left-3">
                <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              </span>
            }
          </label>
        }
      </div>
      <div class="mt-5 space-y-3">
        @for (s of switches; track s; let i = $index) {
          <label class="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-800">
            <span>
              <span class="block text-sm font-medium text-gray-800 dark:text-white/90">{{ s | t }}</span>
              <span class="block text-xs text-gray-500 dark:text-gray-400">{{ 'ui.sampleText' | t }}</span>
            </span>
            <input type="checkbox" class="peer sr-only" [checked]="toggles()[i]" (change)="flip(i)" />
            <span class="relative h-6 w-11 shrink-0 rounded-full bg-gray-200 transition-colors peer-checked:bg-brand-500 peer-focus-visible:ring-3 peer-focus-visible:ring-brand-500/30 dark:bg-gray-700 after:absolute after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow-theme-xs after:transition-all ltr:after:left-0.5 rtl:after:right-0.5 ltr:peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-5"></span>
          </label>
        }
      </div>
    </app-component-card>
  `,
})
export class ExtraInputsComponent {
  readonly INPUT = INPUT;
  readonly LABEL = LABEL;
  readonly qty = signal(1);
  readonly search = signal('');
  readonly note = signal('');
  readonly tags = signal(['Etiket 1', 'Etiket 2']);
  readonly start = signal('');
  readonly end = signal('');
  readonly rangeInvalid = computed(() => !!this.start() && !!this.end() && this.end() < this.start());
  readonly color = signal('#2a7cb6');
  readonly swatches = ['#2a7cb6', '#22ad4b', '#f79009', '#f04438', '#7a5af8'];
  readonly plan = signal(1);
  readonly switches = ['form.switch1', 'form.switch2', 'form.switch3'];
  readonly toggles = signal([true, false, true]);
  max = Math.max;

  onTagKey(e: KeyboardEvent, el: HTMLInputElement) {
    if ((e.key === 'Enter' || e.key === ',') && el.value.trim()) {
      e.preventDefault();
      const v = el.value.trim().replace(/,$/, '');
      if (!this.tags().includes(v)) this.tags.update((l) => [...l, v]);
      el.value = '';
    } else if (e.key === 'Backspace' && !el.value && this.tags().length) {
      this.tags.update((l) => l.slice(0, -1));
    }
  }
  removeTag(t: string) {
    this.tags.update((l) => l.filter((x) => x !== t));
  }
  flip(i: number) {
    this.toggles.update((a) => a.map((v, k) => (k === i ? !v : v)));
  }
}

/* ======================= Doğrulamalı örnek form (tam genişlik) ======================= */
@Component({
  selector: 'app-validated-form',
  imports: [ComponentCardComponent, TranslatePipe],
  host: { class: 'block' },
  template: `
    <app-component-card [title]="'form.validated' | t" [desc]="'form.validatedDesc' | t">
      <form (submit)="$event.preventDefault(); submit()" novalidate class="grid grid-cols-1 gap-5 md:grid-cols-2">
        @for (f of fields; track f.key) {
          <div [class.md:col-span-2]="f.wide">
            <label [for]="'vf-' + f.key" [class]="LABEL">{{ f.label | t }} <span class="text-red-500">*</span></label>
            @if (f.type === 'textarea') {
              <textarea [id]="'vf-' + f.key" rows="3" [value]="model()[f.key]" (input)="set(f.key, $any($event.target).value)" (blur)="touch(f.key)" [class]="INPUT + ' px-4 py-2.5 text-sm ' + stateCls(f.key)"></textarea>
            } @else if (f.type === 'select') {
              <select [id]="'vf-' + f.key" (change)="set(f.key, $any($event.target).value); touch(f.key)" [class]="INPUT + ' h-11 px-4 text-sm ' + stateCls(f.key)">
                <option value="" [selected]="!model()[f.key]">{{ 'Select Option' | t }}</option>
                @for (o of ['Kategori A', 'Kategori B', 'Kategori C']; track o) {
                  <option [value]="o" [selected]="model()[f.key] === o">{{ o }}</option>
                }
              </select>
            } @else {
              <input [id]="'vf-' + f.key" [type]="f.type" [value]="model()[f.key]" (input)="set(f.key, $any($event.target).value)" (blur)="touch(f.key)" [class]="INPUT + ' h-11 px-4 text-sm ' + stateCls(f.key)" />
            }
            @if (show(f.key) && errors()[f.key]) {
              <p class="mt-1.5 text-sm text-red-500 dark:text-red-400">{{ errors()[f.key]! | t }}</p>
            } @else if (show(f.key)) {
              <p class="mt-1.5 text-sm text-success-600 dark:text-success-500">✓ {{ 'form.valid' | t }}</p>
            }
          </div>
        }
        <label class="flex items-start gap-3 md:col-span-2">
          <input type="checkbox" class="mt-0.5 size-4 accent-brand-500" [checked]="agree()" (change)="agree.set(!agree())" />
          <span class="text-sm text-gray-700 dark:text-gray-400">{{ 'form.agree' | t }}</span>
        </label>
        @if (submitted() && !agree()) {
          <p class="-mt-3 text-sm text-red-500 md:col-span-2">{{ 'form.agreeRequired' | t }}</p>
        }
        <div class="flex justify-end gap-3 md:col-span-2">
          <button type="button" (click)="reset()" class="inline-flex h-11 items-center rounded-[10px] border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ 'form.reset' | t }}</button>
          <button type="submit" class="inline-flex h-11 items-center rounded-[10px] bg-brand-500 px-5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600">{{ 'Send' | t }}</button>
        </div>
      </form>
    </app-component-card>
  `,
})
export class ValidatedFormComponent {
  private readonly popup = inject(PopupService);
  private readonly lang = inject(LanguageService);
  readonly INPUT = INPUT;
  readonly LABEL = LABEL;
  readonly fields = [
    { key: 'name', label: 'form.f.name', type: 'text', wide: false },
    { key: 'email', label: 'Email', type: 'email', wide: false },
    { key: 'phone', label: 'Phone', type: 'tel', wide: false },
    { key: 'category', label: 'table.col.category', type: 'select', wide: false },
    { key: 'message', label: 'Description', type: 'textarea', wide: true },
  ] as const;

  readonly model = signal<Record<string, string>>({ name: '', email: '', phone: '', category: '', message: '' });
  readonly touched = signal<Set<string>>(new Set());
  readonly submitted = signal(false);
  readonly agree = signal(false);

  readonly errors = computed<Record<string, string | null>>(() => {
    const m = this.model();
    return {
      name: !m['name'].trim() ? 'form.err.required' : m['name'].trim().length < 3 ? 'form.err.min3' : null,
      email: !m['email'].trim() ? 'form.err.required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m['email']) ? 'form.err.email' : null,
      phone: !m['phone'].trim() ? 'form.err.required' : m['phone'].replace(/\D/g, '').length < 10 ? 'form.err.phone' : null,
      category: !m['category'] ? 'form.err.required' : null,
      message: !m['message'].trim() ? 'form.err.required' : m['message'].trim().length < 10 ? 'form.err.min10' : null,
    };
  });

  set(k: string, v: string) {
    this.model.update((m) => ({ ...m, [k]: v }));
  }
  touch(k: string) {
    this.touched.update((s) => new Set(s).add(k));
  }
  show(k: string) {
    return this.submitted() || this.touched().has(k);
  }
  stateCls(k: string) {
    if (!this.show(k)) return '';
    return this.errors()[k] ? '!border-red-500 focus:!ring-red-500/20' : '!border-success-500 focus:!ring-success-500/20';
  }
  submit() {
    this.submitted.set(true);
    const ok = Object.values(this.errors()).every((e) => !e) && this.agree();
    if (ok) {
      this.popup.success(this.lang.t('form.sentOk'));
      this.reset();
    } else {
      this.popup.error(this.lang.t('form.sentErr'));
    }
  }
  reset() {
    this.model.set({ name: '', email: '', phone: '', category: '', message: '' });
    this.touched.set(new Set());
    this.submitted.set(false);
    this.agree.set(false);
  }
}
