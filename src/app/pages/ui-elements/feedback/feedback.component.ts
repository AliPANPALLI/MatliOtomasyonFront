import { Component, HostListener, OnDestroy, signal } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { ICON, UI } from '../ui-kit';

/* =========================== TOOLTIP & POPOVER =========================== */
@Component({
  selector: 'app-tooltips-page',
  imports: [ComponentCardComponent, PageBreadcrumbComponent, TranslatePipe],
  styles: `
    .tip { pointer-events: none; opacity: 0; transition: opacity .15s, transform .15s; }
    .has-tip:hover .tip, .has-tip:focus-within .tip { opacity: 1; }
  `,
  template: `
    <app-page-breadcrumb [pageTitle]="'Tooltips & Popovers' | t" />
    <div class="space-y-6">
      <app-component-card [title]="'ui.tip.positions' | t" [desc]="'ui.tip.hint' | t">
        <div class="flex flex-wrap items-center justify-center gap-4 py-10">
          @for (p of positions; track p.key) {
            <div class="has-tip relative">
              <button type="button" [class]="UI.btn + ' ' + UI.outline">{{ p.label | t }}</button>
              <span role="tooltip" class="tip absolute z-30 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white shadow-theme-lg dark:bg-white dark:text-gray-900" [class]="p.cls">
                {{ 'ui.tip.text' | t }}
                <span class="absolute size-2 rotate-45 bg-gray-900 dark:bg-white" [class]="p.arrow"></span>
              </span>
            </div>
          }
        </div>
      </app-component-card>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <app-component-card [title]="'ui.tip.light' | t">
          <div class="flex flex-wrap items-center gap-6 pt-10">
            <div class="has-tip relative">
              <span class="flex size-10 cursor-help items-center justify-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/15" tabindex="0">
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path [attr.d]="ICON.info" /></svg>
              </span>
              <span role="tooltip" class="tip absolute bottom-full left-1/2 z-30 mb-2 w-56 -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-600 shadow-theme-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <span class="mb-1 block font-semibold text-gray-800 dark:text-white/90">{{ 'ui.tip.title' | t }}</span>
                {{ 'ui.sampleText' | t }}
              </span>
            </div>
            <p [class]="UI.text">{{ 'ui.tip.hoverIcon' | t }}</p>
          </div>
        </app-component-card>

        <app-component-card [title]="'ui.tip.popover' | t">
          <div class="relative inline-block min-h-44">
            <button type="button" [class]="UI.btn + ' ' + UI.primary" (click)="pop.set(!pop()); $event.stopPropagation()">{{ 'ui.tip.clickMe' | t }}</button>
            @if (pop()) {
              <div class="absolute top-12 z-30 w-72 rounded-xl border border-gray-200 bg-white shadow-theme-lg animate-in fade-in zoom-in-95 ltr:left-0 rtl:right-0 dark:border-gray-800 dark:bg-[#1E2635]" (click)="$event.stopPropagation()">
                <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                  <p [class]="UI.heading">{{ 'ui.tip.title' | t }}</p>
                  <button type="button" (click)="pop.set(false)" class="text-gray-400 hover:text-gray-700 dark:hover:text-white" [attr.aria-label]="'popup.close' | t">
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path [attr.d]="ICON.x" /></svg>
                  </button>
                </div>
                <p class="px-4 py-3" [class]="UI.text">{{ 'ui.longText' | t }}</p>
                <div class="flex justify-end gap-2 px-4 pb-3">
                  <button type="button" class="h-8 rounded-lg px-3 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5" (click)="pop.set(false)">{{ 'popup.cancel' | t }}</button>
                  <button type="button" class="h-8 rounded-lg bg-brand-500 px-3 text-xs font-medium text-white hover:bg-brand-600" (click)="pop.set(false)">{{ 'popup.ok' | t }}</button>
                </div>
              </div>
            }
          </div>
        </app-component-card>
      </div>
    </div>
  `,
  host: { class: 'block' },
})
export class TooltipsPageComponent {
  readonly UI = UI;
  readonly ICON = ICON;
  readonly pop = signal(false);
  readonly positions = [
    { key: 'top', label: 'ui.tip.top', cls: 'bottom-full left-1/2 mb-2 -translate-x-1/2', arrow: '-bottom-1 left-1/2 -translate-x-1/2' },
    { key: 'right', label: 'ui.tip.right', cls: 'left-full top-1/2 ml-2 -translate-y-1/2', arrow: '-left-1 top-1/2 -translate-y-1/2' },
    { key: 'bottom', label: 'ui.tip.bottom', cls: 'top-full left-1/2 mt-2 -translate-x-1/2', arrow: '-top-1 left-1/2 -translate-x-1/2' },
    { key: 'left', label: 'ui.tip.left', cls: 'right-full top-1/2 mr-2 -translate-y-1/2', arrow: '-right-1 top-1/2 -translate-y-1/2' },
  ];

  @HostListener('document:click')
  onDoc() {
    this.pop.set(false);
  }
}

/* =========================== İLERLEME & YÜKLENİYOR =========================== */
@Component({
  selector: 'app-progress-page',
  imports: [ComponentCardComponent, PageBreadcrumbComponent, TranslatePipe],
  styles: `
    @keyframes stripes { from { background-position: 1rem 0; } to { background-position: 0 0; } }
    .striped { background-image: linear-gradient(45deg, rgb(255 255 255 / .2) 25%, transparent 25%, transparent 50%, rgb(255 255 255 / .2) 50%, rgb(255 255 255 / .2) 75%, transparent 75%); background-size: 1rem 1rem; animation: stripes 1s linear infinite; }
    @keyframes indet { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }
    .indet { animation: indet 1.5s ease-in-out infinite; }
    @keyframes bounce3 { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
    .b3 { animation: bounce3 1.2s infinite ease-in-out both; }
    @keyframes bars { 0%, 40%, 100% { transform: scaleY(.4); } 20% { transform: scaleY(1); } }
    .bars span { animation: bars 1.1s infinite ease-in-out; }
  `,
  template: `
    <app-page-breadcrumb [pageTitle]="'Progress & Loaders' | t" />
    <div class="space-y-6">
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <!-- Çubuklar -->
        <app-component-card [title]="'ui.prog.bars' | t">
          <div class="space-y-5">
            @for (b of bars; track b.label) {
              <div>
                <div class="mb-1.5 flex justify-between text-sm">
                  <span class="text-gray-700 dark:text-gray-300">{{ b.label | t }}</span>
                  <span class="font-medium text-gray-800 dark:text-white/90">%{{ value() < b.v ? value() : b.v }}</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
                  <div class="h-full rounded-full transition-all duration-700" [class]="b.color" [style.width.%]="b.v"></div>
                </div>
              </div>
            }
          </div>
        </app-component-card>

        <!-- Boyutlar + çizgili + belirsiz -->
        <app-component-card [title]="'ui.prog.variants' | t">
          <div class="space-y-5">
            <div class="h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5"><div class="h-full w-1/3 rounded-full bg-brand-500"></div></div>
            <div class="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5"><div class="h-full w-1/2 rounded-full bg-brand-500"></div></div>
            <div class="h-5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
              <div class="flex h-full w-2/3 items-center justify-end rounded-full bg-brand-500 pe-2 text-[11px] font-semibold text-white">%66</div>
            </div>
            <div class="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5"><div class="striped h-full w-3/4 rounded-full bg-success-500"></div></div>
            <div class="h-1.5 overflow-hidden rounded-full bg-brand-100 dark:bg-brand-500/15"><div class="indet h-full w-2/5 rounded-full bg-brand-500"></div></div>
            <!-- Çok parçalı -->
            <div class="flex h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
              <div class="h-full w-[35%] bg-brand-500"></div>
              <div class="h-full w-[25%] bg-success-500"></div>
              <div class="h-full w-[15%] bg-warning-500"></div>
            </div>
          </div>
        </app-component-card>
      </div>

      <!-- Dairesel -->
      <app-component-card [title]="'ui.prog.circular' | t">
        <div class="flex flex-wrap items-center justify-around gap-8">
          @for (c of circles; track c.v) {
            <div class="relative size-28">
              <svg class="size-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke-width="10" class="stroke-gray-100 dark:stroke-white/5" />
                <circle cx="60" cy="60" r="52" fill="none" stroke-width="10" stroke-linecap="round" [attr.class]="c.stroke"
                  [attr.stroke-dasharray]="327" [attr.stroke-dashoffset]="327 - (327 * c.v) / 100" style="transition: stroke-dashoffset .7s" />
              </svg>
              <span class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-xl font-semibold text-gray-800 dark:text-white/90">%{{ c.v }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ c.label | t }}</span>
              </span>
            </div>
          }
        </div>
      </app-component-card>

      <!-- Yükleniyor -->
      <app-component-card [title]="'ui.prog.spinners' | t">
        <div class="flex flex-wrap items-center justify-around gap-10 py-4">
          <span class="size-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500 dark:border-brand-500/20 dark:border-t-brand-500" role="status" [attr.aria-label]="'ui.loading' | t"></span>
          <svg class="size-10 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-20" /><path d="M22 12a10 10 0 00-10-10" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
          <span class="flex gap-1.5">
            <span class="b3 size-3 rounded-full bg-brand-500"></span>
            <span class="b3 size-3 rounded-full bg-brand-500 [animation-delay:.16s]"></span>
            <span class="b3 size-3 rounded-full bg-brand-500 [animation-delay:.32s]"></span>
          </span>
          <span class="bars flex h-10 items-center gap-1">
            @for (i of [0, 1, 2, 3, 4]; track i) {
              <span class="h-full w-1.5 rounded-full bg-brand-500" [style.animation-delay.s]="i * 0.1"></span>
            }
          </span>
          <span class="relative flex size-10">
            <span class="absolute inline-flex size-full animate-ping rounded-full bg-brand-400 opacity-60"></span>
            <span class="relative inline-flex size-10 rounded-full bg-brand-500"></span>
          </span>
          <button type="button" disabled class="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white opacity-80">
            <span class="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
            {{ 'ui.loading' | t }}
          </button>
        </div>
      </app-component-card>

      <!-- İskelet -->
      <app-component-card [title]="'ui.prog.skeleton' | t">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          @for (s of [1, 2, 3]; track s) {
            <div class="animate-pulse rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <div class="h-32 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              <div class="mt-4 flex items-center gap-3">
                <div class="size-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div class="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
              <div class="mt-4 space-y-2">
                <div class="h-2.5 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-2.5 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          }
        </div>
      </app-component-card>
    </div>
  `,
  host: { class: 'block' },
})
export class ProgressPageComponent implements OnDestroy {
  readonly bars = [
    { label: 'ui.item1', v: 72, color: 'bg-brand-500' },
    { label: 'ui.item2', v: 48, color: 'bg-success-500' },
    { label: 'ui.item3', v: 90, color: 'bg-warning-500' },
    { label: 'ui.item4', v: 25, color: 'bg-error-500' },
  ];
  readonly circles = [
    { v: 75, label: 'ui.item1', stroke: 'stroke-brand-500' },
    { v: 52, label: 'ui.item2', stroke: 'stroke-success-500' },
    { v: 34, label: 'ui.item3', stroke: 'stroke-warning-500' },
    { v: 88, label: 'ui.item4', stroke: 'stroke-brand-300' },
  ];
  /** İlk açılışta yüzde etiketleri yukarı sayar */
  readonly value = signal(0);
  private readonly timer = setInterval(() => {
    this.value.update((v) => (v >= 100 ? 100 : v + 4));
    if (this.value() >= 100) clearInterval(this.timer);
  }, 30);
  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
