import { Component, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { ICON, UI } from '../ui-kit';

/* =========================== SAYFALAMA & BREADCRUMB =========================== */
@Component({
  selector: 'app-pagination-page',
  imports: [ComponentCardComponent, PageBreadcrumbComponent, TranslatePipe, RouterModule],
  template: `
    <app-page-breadcrumb [pageTitle]="'Pagination & Breadcrumbs' | t" />
    <div class="space-y-6">
      <!-- Numaralı -->
      <app-component-card [title]="'ui.pag.numbered' | t">
        <nav class="flex flex-wrap items-center gap-1" [attr.aria-label]="'ui.pag.numbered' | t">
          <button type="button" [class]="arrowBtn" [disabled]="p1() === 1" (click)="p1.set(p1() - 1)">
            <svg class="size-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6" /></svg>
            <span class="hidden sm:inline">{{ 'table.prev' | t }}</span>
          </button>
          @for (p of pages(); track $index) {
            @if (p === 0) { <span class="px-2 text-gray-400">…</span> }
            @else {
              <button type="button" (click)="p1.set(p)" [attr.aria-current]="p === p1() ? 'page' : null"
                class="flex size-10 items-center justify-center rounded-lg text-sm font-medium transition-colors"
                [class]="p === p1() ? 'bg-brand-500 text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'">{{ p }}</button>
            }
          }
          <button type="button" [class]="arrowBtn" [disabled]="p1() === total" (click)="p1.set(p1() + 1)">
            <span class="hidden sm:inline">{{ 'table.next' | t }}</span>
            <svg class="size-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </nav>
      </app-component-card>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <!-- Sade -->
        <app-component-card [title]="'ui.pag.simple' | t">
          <div class="flex items-center justify-between">
            <button type="button" [class]="arrowBtn" [disabled]="p2() === 1" (click)="p2.set(p2() - 1)">{{ 'table.prev' | t }}</button>
            <span [class]="UI.text">{{ 'ui.pag.page' | t }} <b class="text-gray-800 dark:text-white/90">{{ p2() }}</b> / {{ total }}</span>
            <button type="button" [class]="arrowBtn" [disabled]="p2() === total" (click)="p2.set(p2() + 1)">{{ 'table.next' | t }}</button>
          </div>
        </app-component-card>

        <!-- Kompakt / yuvarlak -->
        <app-component-card [title]="'ui.pag.rounded' | t">
          <div class="inline-flex items-center overflow-hidden rounded-full border border-gray-200 dark:border-gray-800">
            @for (p of [1, 2, 3, 4, 5]; track p) {
              <button type="button" (click)="p3.set(p)" class="flex h-9 w-10 items-center justify-center text-sm font-medium transition-colors"
                [class]="p === p3() ? 'bg-brand-500 text-white' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'">{{ p }}</button>
            }
          </div>
        </app-component-card>
      </div>

      <!-- Breadcrumbs -->
      <app-component-card [title]="'ui.bc.title' | t">
        <div class="space-y-5">
          @for (style of crumbStyles; track style.sep) {
            <nav aria-label="breadcrumb">
              <ol class="flex flex-wrap items-center gap-1.5 text-sm">
                @for (c of crumbs; track c; let last = $last; let first = $first) {
                  <li class="flex items-center gap-1.5">
                    @if (first && style.home) {
                      <svg class="size-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8M5 9v11h14V9" /></svg>
                    }
                    @if (last) {
                      <span class="font-medium text-gray-800 dark:text-white/90" aria-current="page">{{ c | t }}</span>
                    } @else {
                      <a routerLink="." class="text-gray-500 hover:text-brand-500 dark:text-gray-400">{{ c | t }}</a>
                      <span class="text-gray-300 dark:text-gray-600 rtl:rotate-180">{{ style.sep }}</span>
                    }
                  </li>
                }
              </ol>
            </nav>
          }
          <!-- Arka planlı -->
          <nav aria-label="breadcrumb" class="inline-flex rounded-lg bg-gray-100 px-4 py-2 dark:bg-white/5">
            <ol class="flex flex-wrap items-center gap-2 text-sm">
              @for (c of crumbs; track c; let last = $last) {
                <li class="flex items-center gap-2">
                  <span [class]="last ? 'font-medium text-brand-600 dark:text-brand-400' : 'text-gray-600 dark:text-gray-300'">{{ c | t }}</span>
                  @if (!last) {
                    <svg class="size-3.5 text-gray-400 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6" /></svg>
                  }
                </li>
              }
            </ol>
          </nav>
        </div>
      </app-component-card>
    </div>
  `,
  host: { class: 'block' },
})
export class PaginationPageComponent {
  readonly UI = UI;
  readonly total = 12;
  readonly p1 = signal(5);
  readonly p2 = signal(1);
  readonly p3 = signal(2);
  readonly arrowBtn =
    'inline-flex h-10 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5';
  readonly crumbs = ['ui.bc.home', 'ui.bc.section', 'ui.bc.subsection', 'ui.bc.current'];
  readonly crumbStyles = [
    { sep: '/', home: false },
    { sep: '›', home: true },
    { sep: '•', home: false },
  ];
  readonly pages = computed(() => {
    const cur = this.p1();
    const set = [...new Set([1, this.total, cur - 1, cur, cur + 1].filter((p) => p >= 1 && p <= this.total))].sort((a, b) => a - b);
    const out: number[] = [];
    set.forEach((p, i) => {
      if (i && p - set[i - 1] > 1) out.push(0);
      out.push(p);
    });
    return out;
  });
}

/* =========================== ADIMLAR & ZAMAN ÇİZELGESİ =========================== */
@Component({
  selector: 'app-steps-page',
  imports: [ComponentCardComponent, PageBreadcrumbComponent, TranslatePipe],
  template: `
    <app-page-breadcrumb [pageTitle]="'Steps & Timeline' | t" />
    <div class="space-y-6">
      <!-- Yatay adımlar -->
      <app-component-card [title]="'ui.steps.horizontal' | t">
        <ol class="flex items-start">
          @for (s of steps; track s; let i = $index; let last = $last) {
            <li class="flex flex-1 items-start" [class.flex-none]="last">
              <div class="flex flex-col items-center gap-2 text-center">
                <span class="flex size-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors"
                  [class]="i < step() ? 'border-brand-500 bg-brand-500 text-white' : i === step() ? 'border-brand-500 bg-white text-brand-600 dark:bg-gray-900 dark:text-brand-400' : 'border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900'">
                  @if (i < step()) {
                    <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="ICON.check" /></svg>
                  } @else { {{ i + 1 }} }
                </span>
                <span class="max-w-24 text-xs font-medium sm:text-sm" [class]="i <= step() ? 'text-gray-800 dark:text-white/90' : 'text-gray-400'">{{ s | t }}</span>
              </div>
              @if (!last) {
                <span class="mx-2 mt-5 h-0.5 flex-1 rounded-full transition-colors" [class]="i < step() ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'"></span>
              }
            </li>
          }
        </ol>
        <div class="mt-6 flex justify-between">
          <button type="button" [class]="UI.btn + ' ' + UI.outline" [disabled]="step() === 0" (click)="step.set(step() - 1)">{{ 'table.prev' | t }}</button>
          <button type="button" [class]="UI.btn + ' ' + UI.primary" (click)="step.set(step() === steps.length ? 0 : step() + 1)">
            {{ (step() === steps.length ? 'ui.steps.restart' : 'table.next') | t }}
          </button>
        </div>
      </app-component-card>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <!-- Dikey adımlar -->
        <app-component-card [title]="'ui.steps.vertical' | t">
          <ol>
            @for (s of steps; track s; let i = $index; let last = $last) {
              <li class="relative flex gap-4 pb-6 last:pb-0">
                @if (!last) {
                  <span class="absolute top-9 bottom-0 w-0.5 ltr:left-[15px] rtl:right-[15px]" [class]="i < 2 ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'"></span>
                }
                <span class="relative z-1 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                  [class]="i < 2 ? 'bg-brand-500 text-white' : i === 2 ? 'border-2 border-brand-500 bg-white text-brand-600 dark:bg-gray-900' : 'border-2 border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900'">
                  {{ i + 1 }}
                </span>
                <div class="pt-1">
                  <p [class]="UI.heading">{{ s | t }}</p>
                  <p class="mt-0.5" [class]="UI.text">{{ 'ui.sampleText' | t }}</p>
                </div>
              </li>
            }
          </ol>
        </app-component-card>

        <!-- Zaman çizelgesi -->
        <app-component-card [title]="'ui.timeline' | t">
          <ol class="ltr:border-l-2 rtl:border-r-2 border-gray-200 ltr:ml-3 rtl:mr-3 dark:border-gray-700">
            @for (e of events; track e.time) {
              <li class="relative pb-6 ltr:pl-6 rtl:pr-6 last:pb-0">
                <span class="absolute top-0.5 flex size-6 items-center justify-center rounded-full ring-4 ring-white ltr:-left-[13px] rtl:-right-[13px] dark:ring-gray-900" [class]="e.color">
                  <svg class="size-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="e.icon" /></svg>
                </span>
                <div class="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p [class]="UI.heading">{{ e.title | t }}</p>
                  <time class="text-xs text-gray-400">{{ e.time }}</time>
                </div>
                <p class="mt-1" [class]="UI.text">{{ 'ui.sampleText' | t }}</p>
              </li>
            }
          </ol>
        </app-component-card>
      </div>
    </div>
  `,
  host: { class: 'block' },
})
export class StepsPageComponent {
  readonly UI = UI;
  readonly ICON = ICON;
  readonly steps = ['ui.step1', 'ui.step2', 'ui.step3', 'ui.step4'];
  readonly step = signal(1);
  readonly events = [
    { title: 'ui.event1', time: '09:30', color: 'bg-brand-500', icon: ICON.plus },
    { title: 'ui.event2', time: '11:15', color: 'bg-success-500', icon: ICON.check },
    { title: 'ui.event3', time: '14:40', color: 'bg-warning-500', icon: ICON.edit },
    { title: 'ui.event4', time: '16:05', color: 'bg-gray-400', icon: ICON.file },
  ];
}
