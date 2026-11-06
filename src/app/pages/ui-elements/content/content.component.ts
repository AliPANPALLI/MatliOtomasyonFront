import { Component, signal } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { ICON, UI } from '../ui-kit';

/* =========================== KARTLAR =========================== */
@Component({
  selector: 'app-cards-page',
  imports: [PageBreadcrumbComponent, TranslatePipe],
  template: `
    <app-page-breadcrumb [pageTitle]="'Cards' | t" />

    <!-- İstatistik kartları -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      @for (s of stats; track s.label) {
        <div [class]="UI.box + ' p-5'">
          <div class="flex items-center justify-between">
            <span class="flex size-11 items-center justify-center rounded-xl" [class]="s.soft">
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="s.icon" /></svg>
            </span>
            <span class="rounded-full px-2 py-0.5 text-xs font-medium" [class]="s.up ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500' : 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'">
              {{ s.up ? '↑' : '↓' }} %{{ s.change }}
            </span>
          </div>
          <p class="mt-4" [class]="UI.text">{{ s.label | t }}</p>
          <p class="mt-1 text-2xl font-semibold text-gray-800 dark:text-white/90">{{ s.value }}</p>
        </div>
      }
    </div>

    <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <!-- Temel -->
      <div [class]="UI.box + ' p-6'">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">{{ 'ui.card.basic' | t }}</h3>
        <p class="mt-2" [class]="UI.text">{{ 'ui.longText' | t }}</p>
        <button type="button" class="mt-4 text-sm font-medium text-brand-500 hover:text-brand-600">{{ 'ui.readMore' | t }} →</button>
      </div>

      <!-- Görselli -->
      <div [class]="UI.box + ' overflow-hidden'">
        <img src="/images/cards/card-01.png" alt="" class="h-44 w-full object-cover" />
        <div class="p-5">
          <span class="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">{{ 'ui.tag' | t }}</span>
          <h3 class="mt-3 text-base font-semibold text-gray-800 dark:text-white/90">{{ 'ui.card.image' | t }}</h3>
          <p class="mt-1.5" [class]="UI.text">{{ 'ui.sampleText' | t }}</p>
        </div>
      </div>

      <!-- Profil -->
      <div [class]="UI.box + ' p-6 text-center'">
        <span class="mx-auto flex size-20 items-center justify-center rounded-full bg-brand-500 text-2xl font-semibold text-white ring-4 ring-brand-100 dark:ring-brand-500/20">KA</span>
        <h3 class="mt-4 text-base font-semibold text-gray-800 dark:text-white/90">{{ 'ui.userName' | t }}</h3>
        <p [class]="UI.text">{{ 'ui.role' | t }}</p>
        <div class="mt-4 grid grid-cols-3 divide-x divide-gray-100 rounded-xl bg-gray-50 py-3 rtl:divide-x-reverse dark:divide-gray-800 dark:bg-white/[0.03]">
          @for (n of [12, 48, 7]; track $index) {
            <div><p class="font-semibold text-gray-800 dark:text-white/90">{{ n }}</p><p class="text-xs text-gray-500">{{ 'ui.metric' | t }} {{ $index + 1 }}</p></div>
          }
        </div>
        <div class="mt-4 flex gap-2">
          <button type="button" [class]="UI.btn + ' ' + UI.primary + ' flex-1'">{{ 'ui.message' | t }}</button>
          <button type="button" [class]="UI.btn + ' ' + UI.outline + ' flex-1'">{{ 'table.view' | t }}</button>
        </div>
      </div>

      <!-- Yatay -->
      <div [class]="UI.box + ' flex overflow-hidden md:col-span-2'">
        <img src="/images/cards/card-02.png" alt="" class="hidden w-48 object-cover sm:block" />
        <div class="flex flex-1 flex-col p-5">
          <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">{{ 'ui.card.horizontal' | t }}</h3>
          <p class="mt-1.5 flex-1" [class]="UI.text">{{ 'ui.longText' | t }}</p>
          <div class="mt-4 flex items-center justify-between">
            <span class="text-xs text-gray-400">{{ 'ui.updated' | t }}</span>
            <button type="button" [class]="UI.btn + ' ' + UI.outline">{{ 'table.edit' | t }}</button>
          </div>
        </div>
      </div>

      <!-- Vurgulu / aksiyon -->
      <div class="relative overflow-hidden rounded-xl p-6 bg-matli-gradient matli-fg">
        <div class="pointer-events-none absolute inset-0 bg-honeycomb-adaptive"></div>
        <div class="relative">
          <h3 class="text-lg font-semibold">{{ 'ui.card.highlight' | t }}</h3>
          <p class="mt-2 text-sm matli-fg-muted">{{ 'ui.sampleText' | t }}</p>
          <button type="button" [class]="UI.btn + ' ' + UI.primary + ' mt-5'">{{ 'ui.getStarted' | t }}</button>
        </div>
      </div>
    </div>
  `,
  host: { class: 'block' },
})
export class CardsPageComponent {
  readonly UI = UI;
  readonly stats = [
    { label: 'ui.metric1', value: '1.284', change: 12, up: true, icon: ICON.user, soft: 'bg-brand-50 text-brand-500 dark:bg-brand-500/15' },
    { label: 'ui.metric2', value: '356', change: 4, up: true, icon: ICON.file, soft: 'bg-success-50 text-success-600 dark:bg-success-500/15' },
    { label: 'ui.metric3', value: '%72', change: 3, up: false, icon: ICON.star, soft: 'bg-warning-50 text-warning-600 dark:bg-warning-500/15' },
    { label: 'ui.metric4', value: '48', change: 9, up: true, icon: ICON.bell, soft: 'bg-error-50 text-error-600 dark:bg-error-500/15' },
  ];
}

/* =========================== LİSTE, ETİKET, PUANLAMA, BOŞ DURUM =========================== */
@Component({
  selector: 'app-lists-page',
  imports: [ComponentCardComponent, PageBreadcrumbComponent, TranslatePipe],
  template: `
    <app-page-breadcrumb [pageTitle]="'Lists & Tags' | t" />
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <!-- Liste grubu -->
      <app-component-card [title]="'ui.list.group' | t">
        <ul class="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
          @for (n of [1, 2, 3, 4]; track n) {
            <li class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.02]">
              <span class="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/15">
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="n % 2 ? ICON.file : ICON.folder" /></svg>
              </span>
              <div class="min-w-0 flex-1">
                <p class="truncate" [class]="UI.heading">{{ 'ui.item' | t }} {{ n }}</p>
                <p class="truncate text-xs text-gray-500 dark:text-gray-400">{{ 'ui.sampleText' | t }}</p>
              </div>
              <span class="text-xs text-gray-400">{{ n * 2 }} {{ 'ui.minAgo' | t }}</span>
            </li>
          }
        </ul>
      </app-component-card>

      <!-- Seçilebilir liste -->
      <app-component-card [title]="'ui.list.selectable' | t">
        <div class="space-y-2">
          @for (n of [1, 2, 3, 4]; track n) {
            <label class="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors"
              [class]="picked() === n ? 'border-brand-500 bg-brand-25 dark:bg-brand-500/10' : 'border-gray-200 hover:border-brand-300 dark:border-gray-800'">
              <input type="radio" name="pick" class="size-4 accent-brand-500" [checked]="picked() === n" (change)="picked.set(n)" />
              <span class="flex-1">
                <span class="block" [class]="UI.heading">{{ 'ui.option' | t }} {{ n }}</span>
                <span class="block text-xs text-gray-500 dark:text-gray-400">{{ 'ui.sampleText' | t }}</span>
              </span>
            </label>
          }
        </div>
      </app-component-card>

      <!-- Etiketler -->
      <app-component-card [title]="'ui.tags' | t">
        <div class="flex flex-wrap gap-2">
          @for (t of tags(); track t) {
            <span class="inline-flex items-center gap-1.5 rounded-full bg-brand-50 py-1 ps-3 pe-1.5 text-sm font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
              {{ t }}
              <button type="button" (click)="removeTag(t)" [attr.aria-label]="'table.delete' | t" class="flex size-5 items-center justify-center rounded-full hover:bg-brand-100 dark:hover:bg-brand-500/25">
                <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path [attr.d]="ICON.x" /></svg>
              </button>
            </span>
          }
          <form class="inline-flex" (submit)="$event.preventDefault(); addTag(tagInput.value); tagInput.value = ''">
            <input #tagInput type="text" [placeholder]="'ui.addTag' | t" class="h-8 w-32 rounded-full border border-dashed border-gray-300 bg-transparent px-3 text-sm outline-hidden focus:border-brand-400 dark:border-gray-700 dark:text-white/90" />
          </form>
        </div>
        <div class="mt-5 flex flex-wrap gap-2">
          @for (c of chipColors; track c.label) {
            <span class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium" [class]="c.cls">
              <span class="size-1.5 rounded-full bg-current"></span>{{ c.label | t }}
            </span>
          }
        </div>
      </app-component-card>

      <!-- Puanlama + kaydırıcı -->
      <app-component-card [title]="'ui.rating' | t">
        <div class="flex items-center gap-1" (mouseleave)="hover.set(0)">
          @for (s of [1, 2, 3, 4, 5]; track s) {
            <button type="button" (click)="rating.set(s)" (mouseenter)="hover.set(s)" [attr.aria-label]="s + '/5'">
              <svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linejoin="round"
                [attr.class]="'size-8 transition-transform hover:scale-110 ' + ((hover() || rating()) >= s ? 'fill-warning-400 stroke-warning-500' : 'fill-none stroke-gray-300 dark:stroke-gray-600')">
                <path [attr.d]="ICON.star" />
              </svg>
            </button>
          }
          <span class="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">{{ rating() }}/5</span>
        </div>
        <div class="mt-8">
          <div class="mb-2 flex justify-between text-sm">
            <span class="text-gray-700 dark:text-gray-300">{{ 'ui.slider' | t }}</span>
            <span class="font-medium text-brand-600 dark:text-brand-400">{{ range() }}</span>
          </div>
          <input type="range" min="0" max="100" [value]="range()" (input)="range.set(+$any($event.target).value)" class="w-full cursor-pointer accent-brand-500" />
        </div>
      </app-component-card>

      <!-- Boş durumlar -->
      <app-component-card class="xl:col-span-2" [title]="'ui.empty' | t">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          @for (e of empties; track e.title) {
            <div class="flex flex-col items-center rounded-xl border border-dashed border-gray-300 px-6 py-10 text-center dark:border-gray-700">
              <span class="flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-white/5">
                <svg class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="e.icon" /></svg>
              </span>
              <p class="mt-4" [class]="UI.heading">{{ e.title | t }}</p>
              <p class="mt-1" [class]="UI.text">{{ 'ui.sampleText' | t }}</p>
              @if (e.action) {
                <button type="button" [class]="UI.btn + ' ' + UI.primary + ' mt-4'">
                  <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path [attr.d]="ICON.plus" /></svg>
                  {{ e.action | t }}
                </button>
              }
            </div>
          }
        </div>
      </app-component-card>
    </div>
  `,
  host: { class: 'block' },
})
export class ListsPageComponent {
  readonly UI = UI;
  readonly ICON = ICON;
  readonly picked = signal(1);
  readonly tags = signal(['Etiket 1', 'Etiket 2', 'Etiket 3']);
  readonly rating = signal(4);
  readonly hover = signal(0);
  readonly range = signal(40);
  readonly chipColors = [
    { label: 'table.status.active', cls: 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500' },
    { label: 'table.status.pending', cls: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-orange-400' },
    { label: 'popupDemo.type.error', cls: 'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500' },
    { label: 'popupDemo.type.info', cls: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400' },
    { label: 'table.status.passive', cls: 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-400' },
  ];
  readonly empties = [
    { title: 'ui.empty.noData', icon: ICON.folder, action: 'ui.empty.add' },
    { title: 'ui.empty.noResults', icon: 'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-3.5-3.5', action: null },
    { title: 'ui.empty.noNotifications', icon: ICON.bell, action: null },
  ];

  addTag(v: string) {
    const t = v.trim();
    if (t && !this.tags().includes(t)) this.tags.update((l) => [...l, t]);
  }
  removeTag(t: string) {
    this.tags.update((l) => l.filter((x) => x !== t));
  }
}
