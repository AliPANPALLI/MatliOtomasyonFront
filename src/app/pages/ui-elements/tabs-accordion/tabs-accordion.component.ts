import { Component, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { ICON, UI } from '../ui-kit';

const TAB_KEYS = ['ui.tab.overview', 'ui.tab.details', 'ui.tab.history', 'ui.tab.settings'];

/* =========================== SEKMELER =========================== */
@Component({
  selector: 'app-tabs-page',
  imports: [ComponentCardComponent, PageBreadcrumbComponent, TranslatePipe, NgTemplateOutlet],
  template: `
    <ng-template #panel let-i>
      <div class="pt-5" role="tabpanel">
        <p [class]="UI.heading">{{ tabs[i] | t }}</p>
        <p class="mt-1.5" [class]="UI.text">{{ 'ui.longText' | t }}</p>
      </div>
    </ng-template>

    <app-page-breadcrumb [pageTitle]="'Tabs' | t" />
    <div class="space-y-6">
      <!-- Alt çizgili -->
      <app-component-card [title]="'ui.tabs.underline' | t">
        <div role="tablist" class="flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
          @for (k of tabs; track k; let i = $index) {
            <button type="button" role="tab" [attr.aria-selected]="t1() === i" (click)="t1.set(i)"
              class="-mb-px border-b-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors"
              [class]="t1() === i ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'">
              {{ k | t }}
            </button>
          }
        </div>
        <ng-container *ngTemplateOutlet="panel; context: { $implicit: t1() }" />
      </app-component-card>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <!-- Hap -->
        <app-component-card [title]="'ui.tabs.pills' | t">
          <div role="tablist" class="flex flex-wrap gap-2">
            @for (k of tabs; track k; let i = $index) {
              <button type="button" role="tab" [attr.aria-selected]="t2() === i" (click)="t2.set(i)"
                class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
                [class]="t2() === i ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10'">
                {{ k | t }}
              </button>
            }
          </div>
          <ng-container *ngTemplateOutlet="panel; context: { $implicit: t2() }" />
        </app-component-card>

        <!-- Segment -->
        <app-component-card [title]="'ui.tabs.segmented' | t">
          <div role="tablist" class="inline-flex w-full rounded-xl bg-gray-100 p-1 dark:bg-gray-900">
            @for (k of tabs; track k; let i = $index) {
              <button type="button" role="tab" [attr.aria-selected]="t3() === i" (click)="t3.set(i)"
                class="flex-1 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-all"
                [class]="t3() === i ? 'bg-white text-gray-900 shadow-theme-xs dark:bg-gray-800 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'">
                {{ k | t }}
              </button>
            }
          </div>
          <ng-container *ngTemplateOutlet="panel; context: { $implicit: t3() }" />
        </app-component-card>
      </div>

      <!-- İkon + rozet -->
      <app-component-card [title]="'ui.tabs.icons' | t">
        <div role="tablist" class="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
          @for (k of tabs; track k; let i = $index) {
            <button type="button" role="tab" [attr.aria-selected]="t4() === i" (click)="t4.set(i)"
              class="-mb-px flex items-center gap-2 border-b-2 px-3 pb-3 text-sm font-medium whitespace-nowrap transition-colors"
              [class]="t4() === i ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'">
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="icons[i]" /></svg>
              {{ k | t }}
              <span class="rounded-full px-2 py-0.5 text-xs" [class]="t4() === i ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400' : 'bg-gray-100 text-gray-500 dark:bg-white/5'">{{ (i + 1) * 3 }}</span>
            </button>
          }
        </div>
        <ng-container *ngTemplateOutlet="panel; context: { $implicit: t4() }" />
      </app-component-card>

      <!-- Dikey -->
      <app-component-card [title]="'ui.tabs.vertical' | t">
        <div class="flex flex-col gap-6 sm:flex-row">
          <div role="tablist" class="flex shrink-0 flex-row gap-1 overflow-x-auto sm:w-48 sm:flex-col">
            @for (k of tabs; track k; let i = $index) {
              <button type="button" role="tab" [attr.aria-selected]="t5() === i" (click)="t5.set(i)"
                class="rounded-lg px-4 py-2.5 text-start text-sm font-medium whitespace-nowrap transition-colors"
                [class]="t5() === i ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'">
                {{ k | t }}
              </button>
            }
          </div>
          <div class="flex-1 rounded-xl border border-gray-200 p-5 dark:border-gray-800">
            <p [class]="UI.heading">{{ tabs[t5()] | t }}</p>
            <p class="mt-1.5" [class]="UI.text">{{ 'ui.longText' | t }}</p>
          </div>
        </div>
      </app-component-card>
    </div>
  `,
  host: { class: 'block' },
})
export class TabsPageComponent {
  readonly UI = UI;
  readonly tabs = TAB_KEYS;
  readonly icons = [ICON.info, ICON.file, ICON.folder, ICON.settings];
  readonly t1 = signal(0);
  readonly t2 = signal(0);
  readonly t3 = signal(0);
  readonly t4 = signal(0);
  readonly t5 = signal(0);
}

/* =========================== AKORDEON =========================== */
@Component({
  selector: 'app-accordion-page',
  imports: [ComponentCardComponent, PageBreadcrumbComponent, TranslatePipe, NgTemplateOutlet],
  template: `
    <ng-template #chev let-open>
      <svg class="size-5 shrink-0 text-gray-400 transition-transform duration-200" [class.rotate-180]="open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path [attr.d]="ICON.chevronDown" /></svg>
    </ng-template>

    <app-page-breadcrumb [pageTitle]="'Accordion' | t" />
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <!-- Standart (tek açık) -->
      <app-component-card [title]="'ui.acc.default' | t">
        <div class="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
          @for (n of items; track n) {
            @let isOpen = a1() === n;
            <div>
              <button type="button" (click)="a1.set(isOpen ? 0 : n)" [attr.aria-expanded]="isOpen"
                class="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-sm font-medium text-gray-800 hover:bg-gray-50 dark:text-white/90 dark:hover:bg-white/[0.02]"
                [class.bg-gray-50]="isOpen">
                {{ 'ui.acc.question' | t }} {{ n }}
                <ng-container *ngTemplateOutlet="chev; context: { $implicit: isOpen }" />
              </button>
              @if (isOpen) {
                <div class="px-5 pb-4 text-sm text-gray-600 animate-in fade-in slide-in-from-top-1 dark:text-gray-400">{{ 'ui.longText' | t }}</div>
              }
            </div>
          }
        </div>
      </app-component-card>

      <!-- Ayrık kartlar -->
      <app-component-card [title]="'ui.acc.separated' | t">
        <div class="space-y-3">
          @for (n of items; track n) {
            @let isOpen = a2() === n;
            <div class="rounded-xl border transition-colors" [class]="isOpen ? 'border-brand-300 bg-brand-25 dark:border-brand-500/40 dark:bg-brand-500/[0.06]' : 'border-gray-200 dark:border-gray-800'">
              <button type="button" (click)="a2.set(isOpen ? 0 : n)" [attr.aria-expanded]="isOpen" class="flex w-full items-center gap-3 px-5 py-4 text-start">
                <span class="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold" [class]="isOpen ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300'">{{ n }}</span>
                <span class="flex-1 text-sm font-medium text-gray-800 dark:text-white/90">{{ 'ui.acc.question' | t }} {{ n }}</span>
                <ng-container *ngTemplateOutlet="chev; context: { $implicit: isOpen }" />
              </button>
              @if (isOpen) {
                <div class="ps-16 pe-5 pb-4 text-sm text-gray-600 animate-in fade-in dark:text-gray-400">{{ 'ui.longText' | t }}</div>
              }
            </div>
          }
        </div>
      </app-component-card>

      <!-- Çoklu açılabilir -->
      <app-component-card [title]="'ui.acc.multiple' | t">
        <div class="space-y-2">
          @for (n of items; track n) {
            @let isOpen = a3().has(n);
            <div [class]="UI.box">
              <button type="button" (click)="toggle3(n)" [attr.aria-expanded]="isOpen" class="flex w-full items-center justify-between gap-4 px-5 py-3.5 text-start text-sm font-medium text-gray-800 dark:text-white/90">
                {{ 'ui.acc.section' | t }} {{ n }}
                <span class="flex size-6 items-center justify-center rounded-md bg-gray-100 text-gray-500 dark:bg-white/5">
                  <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path [attr.d]="isOpen ? 'M5 12h14' : ICON.plus" /></svg>
                </span>
              </button>
              @if (isOpen) {
                <div class="border-t border-gray-100 px-5 py-3.5 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">{{ 'ui.longText' | t }}</div>
              }
            </div>
          }
        </div>
      </app-component-card>

      <!-- Sade (çizgisiz) -->
      <app-component-card [title]="'ui.acc.flush' | t">
        @for (n of items; track n) {
          @let isOpen = a4() === n;
          <div class="border-b border-gray-100 last:border-0 dark:border-gray-800">
            <button type="button" (click)="a4.set(isOpen ? 0 : n)" [attr.aria-expanded]="isOpen" class="flex w-full items-center justify-between gap-4 py-4 text-start text-sm font-medium" [class]="isOpen ? 'text-brand-600 dark:text-brand-400' : 'text-gray-800 dark:text-white/90'">
              {{ 'ui.acc.question' | t }} {{ n }}
              <ng-container *ngTemplateOutlet="chev; context: { $implicit: isOpen }" />
            </button>
            @if (isOpen) {
              <p class="pb-4 text-sm text-gray-600 dark:text-gray-400">{{ 'ui.longText' | t }}</p>
            }
          </div>
        }
      </app-component-card>
    </div>
  `,
  host: { class: 'block' },
})
export class AccordionPageComponent {
  readonly UI = UI;
  readonly ICON = ICON;
  readonly items = [1, 2, 3, 4];
  readonly a1 = signal(1);
  readonly a2 = signal(1);
  readonly a3 = signal<Set<number>>(new Set([1, 2]));
  readonly a4 = signal(0);

  toggle3(n: number) {
    this.a3.update((s) => {
      const x = new Set(s);
      x.has(n) ? x.delete(n) : x.add(n);
      return x;
    });
  }
}
