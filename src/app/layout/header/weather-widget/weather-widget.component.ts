import { Component, ElementRef, HostListener, OnInit, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { WeatherService } from '../../../core/services/weather.service';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

/** Header'daki hava durumu & konum göstergesi */
@Component({
  selector: 'app-weather-widget',
  imports: [NgTemplateOutlet, TranslatePipe],
  template: `
    <!-- ===== İkonlar ===== -->
    <ng-template #wIcon let-icon let-day="day" let-size="size">
      <svg [attr.class]="size ?? 'size-6'" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        @switch (icon) {
          @case ('clear') {
            @if (day !== false) {
              <circle cx="12" cy="12" r="4.2" class="fill-warning-400 stroke-warning-500" />
              <path class="stroke-warning-500" d="M12 2.5v2M12 19.5v2M4.6 4.6L6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" />
            } @else {
              <path class="fill-brand-200 stroke-brand-400" d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />
            }
          }
          @case ('partly-cloudy') {
            <circle cx="9" cy="8.5" r="3.2" class="fill-warning-400 stroke-warning-500" />
            <path class="stroke-warning-500" d="M9 2.8v1.2M3.3 8.5h1.2M5 4.5l.8.8M13 4.5l-.8.8" />
            <path class="fill-white stroke-gray-400 dark:fill-gray-300" d="M8.5 19.5h9a3.5 3.5 0 000-7 5 5 0 00-9.6 1.2A2.9 2.9 0 008.5 19.5z" />
          }
          @case ('fog') {
            <path class="fill-gray-200 stroke-gray-400 dark:fill-gray-400" d="M7 13.5h10a3.5 3.5 0 000-7 5 5 0 00-9.6 1.2A2.9 2.9 0 007 13.5z" />
            <path class="stroke-gray-400" d="M4 17h16M6 20.5h12" />
          }
          @case ('drizzle') {
            <path class="fill-gray-200 stroke-gray-400 dark:fill-gray-400" d="M7 14h10a3.5 3.5 0 000-7 5 5 0 00-9.6 1.2A2.9 2.9 0 007 14z" />
            <path class="stroke-brand-400" d="M9 17.5v1M13 17.5v1M17 17.5v1M11 20.5v1M15 20.5v1" />
          }
          @case ('rain') {
            <path class="fill-gray-300 stroke-gray-500 dark:fill-gray-400" d="M7 13.5h10a3.5 3.5 0 000-7 5 5 0 00-9.6 1.2A2.9 2.9 0 007 13.5z" />
            <path class="stroke-brand-500" d="M8.5 16.5l-1 3M12.5 16.5l-1 3M16.5 16.5l-1 3" />
          }
          @case ('snow') {
            <path class="fill-gray-200 stroke-gray-400 dark:fill-gray-300" d="M7 13.5h10a3.5 3.5 0 000-7 5 5 0 00-9.6 1.2A2.9 2.9 0 007 13.5z" />
            <path class="stroke-brand-300" d="M8.5 17v3M7 18.5h3M15.5 17v3M14 18.5h3M12 19v2.5" />
          }
          @case ('thunder') {
            <path class="fill-gray-300 stroke-gray-500 dark:fill-gray-400" d="M7 13h10a3.5 3.5 0 000-7 5 5 0 00-9.6 1.2A2.9 2.9 0 007 13z" />
            <path class="fill-warning-400 stroke-warning-500" d="M12.5 14l-2.5 4h3l-1.5 4 4-5.5h-3l1.5-2.5z" />
          }
          @default {
            <path class="fill-gray-200 stroke-gray-400 dark:fill-gray-400" d="M7 18h10a4 4 0 000-8 5.5 5.5 0 00-10.6 1.4A3.3 3.3 0 007 18z" />
          }
        }
      </svg>
    </ng-template>

    <div class="relative">
      <!-- ===== Tetikleyici ===== -->
      <button
        type="button"
        (click)="toggle($event)"
        [attr.aria-expanded]="open()"
        [title]="'weather.title' | t"
        class="flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:border-brand-300 hover:bg-brand-25 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-brand-500/40 dark:hover:bg-white/5"
      >
        @switch (weather.status()) {
          @case ('denied') {
            <svg class="size-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /><path d="M4 4l16 16" /></svg>
            <span class="hidden sm:inline">{{ 'weather.locationOff' | t }}</span>
          }
          @default {
            @if (weather.data(); as w) {
              <ng-container *ngTemplateOutlet="wIcon; context: { $implicit: w.icon, day: w.isDay }" />
              <span class="font-semibold text-gray-800 dark:text-white/90">{{ w.temperature }}°</span>
              @if (w.city) {
                <span class="hidden max-w-32 truncate text-gray-500 lg:inline xl:hidden 2xl:inline dark:text-gray-400">{{ w.city }}</span>
              }
            } @else {
              <span class="size-5 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></span>
              <span class="h-3 w-10 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></span>
            }
          }
        }
      </button>

      <!-- ===== Açılır panel ===== -->
      @if (open()) {
        <div
          class="absolute top-[calc(100%+12px)] z-99 w-80 rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-lg animate-in fade-in slide-in-from-top-1 duration-150 ltr:right-0 rtl:left-0 max-sm:fixed max-sm:inset-x-4 max-sm:top-20 max-sm:w-auto dark:border-gray-800 dark:bg-[#1E2635]"
        >
          @switch (weather.status()) {
            @case ('denied') {
              <ng-container *ngTemplateOutlet="notice; context: { $implicit: 'weather.deniedMessage' }" />
            }
            @case ('unsupported') {
              <ng-container *ngTemplateOutlet="notice; context: { $implicit: 'weather.unsupported' }" />
            }
            @case ('error') {
              @if (!weather.data()) {
                <ng-container *ngTemplateOutlet="notice; context: { $implicit: 'weather.errorMessage' }" />
              }
            }
          }

          @if (weather.data(); as w) {
            <!-- Konum -->
            <div class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></svg>
              <span class="truncate">{{ w.city ?? ('weather.currentLocation' | t) }}{{ w.region && w.region !== w.city ? ', ' + w.region : '' }}</span>
            </div>

            <!-- Güncel -->
            <div class="mt-3 flex items-center justify-between">
              <div>
                <p class="text-4xl font-semibold text-gray-800 dark:text-white/90">{{ w.temperature }}°</p>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">{{ 'weather.code.' + w.icon | t }}</p>
              </div>
              <ng-container *ngTemplateOutlet="wIcon; context: { $implicit: w.icon, day: w.isDay, size: 'size-16' }" />
            </div>

            <!-- Detaylar -->
            <div class="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-gray-50 p-3 text-center dark:bg-white/[0.03]">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ 'weather.feelsLike' | t }}</p>
                <p class="mt-0.5 text-sm font-semibold text-gray-800 dark:text-white/90">{{ w.feelsLike }}°</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ 'weather.humidity' | t }}</p>
                <p class="mt-0.5 text-sm font-semibold text-gray-800 dark:text-white/90">%{{ w.humidity }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ 'weather.wind' | t }}</p>
                <p class="mt-0.5 text-sm font-semibold text-gray-800 dark:text-white/90">{{ w.wind }} km/s</p>
              </div>
            </div>

            <!-- Günlük tahmin -->
            <ul class="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
              @for (d of w.daily; track d.date; let i = $index) {
                <li class="flex items-center justify-between py-2 text-sm">
                  <span class="w-20 text-gray-600 dark:text-gray-300">{{ i === 0 ? ('weather.today' | t) : dayName(d.date) }}</span>
                  <ng-container *ngTemplateOutlet="wIcon; context: { $implicit: d.icon, size: 'size-6' }" />
                  <span class="w-20 text-end">
                    <span class="font-semibold text-gray-800 dark:text-white/90">{{ d.max }}°</span>
                    <span class="ms-1.5 text-gray-400">{{ d.min }}°</span>
                  </span>
                </li>
              }
            </ul>

            <div class="mt-2 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400 dark:border-gray-800">
              <span>{{ 'weather.updated' | t }} {{ time(w.updatedAt) }}</span>
              <button
                type="button"
                (click)="weather.refresh()"
                [disabled]="weather.status() === 'loading'"
                class="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-brand-500 hover:bg-brand-50 disabled:opacity-50 dark:hover:bg-brand-500/10"
              >
                <svg class="size-3.5" [class.animate-spin]="weather.status() === 'loading'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 10-2.3 5.7M20 4v7h-7" /></svg>
                {{ 'weather.refresh' | t }}
              </button>
            </div>
          } @else if (weather.status() === 'loading' || weather.status() === 'idle') {
            <div class="space-y-3">
              <div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div class="h-10 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div class="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5"></div>
            </div>
          }
        </div>
      }
    </div>

    <!-- Bilgi / izin mesajı -->
    <ng-template #notice let-key>
      <div class="mb-1 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300">{{ key | t }}</p>
        <button
          type="button"
          (click)="weather.refresh()"
          class="mt-3 inline-flex h-9 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600"
        >
          {{ 'weather.retry' | t }}
        </button>
      </div>
    </ng-template>
  `,
})
export class WeatherWidgetComponent implements OnInit {
  readonly weather = inject(WeatherService);
  private readonly language = inject(LanguageService);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly open = signal(false);

  ngOnInit(): void {
    this.weather.init();
  }

  toggle(event: Event): void {
    event.stopPropagation();
    this.open.update((v) => !v);
  }

  dayName(iso: string): string {
    const locale = this.language.lang() === 'tr' ? 'tr-TR' : 'en-US';
    return new Date(iso + 'T12:00:00').toLocaleDateString(locale, { weekday: 'long' });
  }

  time(ts: number): string {
    const locale = this.language.lang() === 'tr' ? 'tr-TR' : 'en-US';
    return new Date(ts).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(e.target as Node)) this.open.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.open.set(false);
  }
}
