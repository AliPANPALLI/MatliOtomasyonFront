import { Location } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { LanguageSwitcherComponent } from '../../../shared/components/common/language-switcher/language-switcher.component';
import { ThemeToggleTwoComponent } from '../../../shared/components/common/theme-toggle-two/theme-toggle-two.component';

export type ErrorCode = 400 | 401 | 403 | 404 | 500 | 503;

/** Her kod için gösterilecek ek buton */
const ACTIONS: Record<ErrorCode, 'signin' | 'retry' | null> = {
  400: null,
  401: 'signin',
  403: null,
  404: null,
  500: 'retry',
  503: 'retry',
};

/**
 * Ortak hata sayfası. Rota verisiyle kod verilir:
 *   { path: 'error-500', component: ErrorPageComponent, data: { code: 500 } }
 * Kod verilmezse 404 gösterilir.
 */
@Component({
  selector: 'app-error-page',
  imports: [RouterModule, TranslatePipe, LanguageSwitcherComponent, ThemeToggleTwoComponent],
  host: { class: 'block w-full' },
  template: `
    <div class="relative flex min-h-screen flex-col bg-gray-50 bg-honeycomb dark:bg-gray-900">
      <!-- Üst bar -->
      <header class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <a routerLink="/">
          <img class="h-10 w-auto sm:h-12" src="/images/logo/matli-otomasyon-logo.png" alt="Matlı Otomasyon" width="178" height="48" />
        </a>
        <div class="flex items-center gap-2">
          <app-language-switcher />
          <div class="hidden sm:block"><app-theme-toggle-two /></div>
        </div>
      </header>

      <main class="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10">
        <!-- Dekoratif altıgenler -->
        <div class="pointer-events-none absolute left-[8%] top-[18%] h-24 w-[84px] clip-hex bg-brand-500/10"></div>
        <div class="pointer-events-none absolute right-[10%] top-[28%] h-16 w-14 clip-hex bg-brand-300/20"></div>
        <div class="pointer-events-none absolute bottom-[14%] left-[16%] h-12 w-[42px] clip-hex bg-brand-400/15"></div>
        <div class="pointer-events-none absolute bottom-[20%] right-[18%] h-28 w-24 clip-hex bg-brand-500/10"></div>
        <div class="pointer-events-none absolute left-1/2 top-1/3 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-brand-400/10 blur-3xl"></div>

        <div class="relative z-1 mx-auto flex max-w-xl flex-col items-center text-center">
          <!-- Kod -->
          <p
            class="bg-gradient-to-br from-brand-400 via-brand-500 to-brand-800 bg-clip-text text-[96px] leading-none font-bold tracking-tight text-transparent sm:text-[140px]"
            aria-hidden="true"
          >
            {{ code() }}
          </p>

          <span class="mt-4 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
            {{ 'error.label' | t }} {{ code() }}
          </span>

          <h1 class="mt-4 text-2xl font-bold text-gray-800 sm:text-3xl dark:text-white/90">
            {{ 'error.' + code() + '.title' | t }}
          </h1>
          <p class="mt-3 text-base text-gray-500 sm:text-lg dark:text-gray-400">
            {{ 'error.' + code() + '.message' | t }}
          </p>

          <div class="mt-10 flex flex-col gap-3 sm:flex-row">
            @switch (action()) {
              @case ('signin') {
                <a routerLink="/signin" [class]="primaryBtn">{{ 'error.signin' | t }}</a>
              }
              @case ('retry') {
                <button type="button" (click)="retry()" [class]="primaryBtn">{{ 'error.retry' | t }}</button>
              }
            }
            <a routerLink="/" [class]="action() ? secondaryBtn : primaryBtn">{{ 'comingSoon.home' | t }}</a>
            @if (action() !== 'retry') {
              <button type="button" (click)="back()" [class]="secondaryBtn">
              <svg class="size-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
              {{ 'comingSoon.back' | t }}
            </button>
            }
          </div>
        </div>
      </main>

      <footer class="pb-6 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {{ year }} - Matlı Otomasyon
      </footer>
    </div>
  `,
})
export class ErrorPageComponent {
  private readonly location = inject(Location);

  readonly code = toSignal(
    inject(ActivatedRoute).data.pipe(map((d) => (d['code'] as ErrorCode | undefined) ?? 404)),
    { initialValue: 404 as ErrorCode },
  );
  readonly action = computed(() => ACTIONS[this.code()] ?? null);
  readonly year = new Date().getFullYear();

  readonly primaryBtn =
    'inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-brand-500 px-5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600';
  readonly secondaryBtn =
    'inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5';

  retry(): void {
    // Hata sayfasına gelmeden önceki sayfayı yeniden dene
    this.location.back();
  }

  back(): void {
    this.location.back();
  }
}
