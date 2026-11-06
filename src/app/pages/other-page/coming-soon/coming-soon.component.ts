import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

/**
 * "Hazırlanıyor" sayfası.
 * Henüz hazır olmayan bir menü öğesini buraya yönlendirmek için:
 *   { path: 'ornek', component: ComingSoonComponent, data: { pageName: 'Sayfa adı' } }
 * pageName verilirse üstte etiket olarak gösterilir (çeviri anahtarı da olabilir).
 */
@Component({
  selector: 'app-coming-soon',
  imports: [RouterModule, TranslatePipe],
  styles: `
    @keyframes hex-fill {
      0%, 100% { opacity: 0.18; transform: scale(0.82); }
      35%, 65% { opacity: 1; transform: scale(0.92); }
    }
    .hex-cell { animation: hex-fill 2.8s ease-in-out infinite; }
    @keyframes progress-slide {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(250%); }
    }
    .progress-bar { animation: progress-slide 1.8s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .hex-cell, .progress-bar { animation: none; opacity: 1; }
    }
  `,
  template: `
    <div
      class="relative flex min-h-[calc(100vh-10rem)] items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white bg-honeycomb px-6 py-12 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <!-- Hafif mavi ışık -->
      <div class="pointer-events-none absolute -top-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-brand-400/15 blur-3xl"></div>

      <div class="relative z-1 mx-auto flex max-w-xl flex-col items-center text-center">
        <!-- Petek animasyonu -->
        <div class="relative h-[138.5px] w-[144px]" aria-hidden="true">
          @for (cell of cells; track $index) {
            <div
              class="hex-cell clip-hex absolute h-[55.4px] w-12"
              [class]="cell.color"
              [style.left.px]="cell.left"
              [style.top.px]="cell.top"
              [style.animation-delay.s]="$index * 0.35"
            ></div>
          }
          <!-- Merkez: Matlı küpü -->
          <div
            class="clip-hex absolute flex h-[55.4px] w-12 items-center justify-center bg-brand-50 shadow-theme-md dark:bg-brand-100"
            style="left: 48px; top: 41.55px"
          >
            <img src="/images/logo/matli-icon.png" alt="" class="h-7 w-7 object-contain" />
          </div>
        </div>

        @if (pageName()) {
          <span class="mt-8 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
            {{ pageName()! | t }}
          </span>
        }

        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white/90" [class]="pageName() ? 'mt-3' : 'mt-8'">
          {{ 'comingSoon.title' | t }}
        </h1>
        <p class="mt-3 text-base text-gray-500 sm:text-lg dark:text-gray-400">
          {{ 'comingSoon.message' | t }}
        </p>

        <!-- Belirsiz ilerleme çubuğu -->
        <div class="mt-8 h-1.5 w-64 overflow-hidden rounded-full bg-brand-100 dark:bg-brand-500/15">
          <div class="progress-bar h-full w-2/5 rounded-full bg-brand-500"></div>
        </div>

        <div class="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            routerLink="/"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-brand-500 px-5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600"
          >
            {{ 'comingSoon.home' | t }}
          </a>
          <button
            type="button"
            (click)="back()"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5"
          >
            <svg class="size-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            {{ 'comingSoon.back' | t }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ComingSoonComponent {
  private readonly location = inject(Location);

  readonly pageName = toSignal(
    inject(ActivatedRoute).data.pipe(map((d) => (d['pageName'] as string | undefined) ?? null)),
    { initialValue: null },
  );

  /** Merkezin etrafındaki 6 petek hücresi (saat yönünde sırayla dolar) */
  readonly cells = [
    { left: 24, top: 0, color: 'bg-brand-500' },
    { left: 72, top: 0, color: 'bg-brand-400' },
    { left: 96, top: 41.55, color: 'bg-brand-300' },
    { left: 72, top: 83.1, color: 'bg-brand-500' },
    { left: 24, top: 83.1, color: 'bg-brand-400' },
    { left: 0, top: 41.55, color: 'bg-brand-300' },
  ];

  back(): void {
    this.location.back();
  }
}
