import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { ThemeService, Theme } from '../../core/services/theme.service';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { PopupService } from '../../core/popup/popup.service';

/** Hesap ayarları: görünüm (tema), dil ve şifre değiştirme */
@Component({
  selector: 'app-settings',
  imports: [PageBreadcrumbComponent, ComponentCardComponent, TranslatePipe],
  template: `
    <app-page-breadcrumb [pageTitle]="'Settings' | t" />

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <!-- Görünüm -->
      <app-component-card [title]="'settings.appearance' | t" [desc]="'settings.appearanceDesc' | t">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          @for (opt of themeOptions; track opt.id) {
            @let active = theme() === opt.id;
            <button
              type="button"
              (click)="themeService.setTheme(opt.id)"
              [attr.aria-pressed]="active"
              class="group flex flex-col items-center gap-3 rounded-xl border-2 p-4 text-sm font-medium transition-colors"
              [class]="active ? 'border-brand-500 bg-brand-25 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300' : 'border-gray-200 text-gray-700 hover:border-brand-300 dark:border-gray-800 dark:text-gray-300'"
            >
              <!-- Mini önizleme -->
              <span class="flex h-16 w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                @switch (opt.id) {
                  @case ('light') {
                    <span class="w-1/3 bg-white"></span><span class="flex-1 bg-gray-100 p-1.5"><span class="block h-2 w-3/4 rounded bg-brand-300"></span></span>
                  }
                  @case ('dark') {
                    <span class="w-1/3 bg-gray-900"></span><span class="flex-1 bg-gray-800 p-1.5"><span class="block h-2 w-3/4 rounded bg-brand-500"></span></span>
                  }
                  @default {
                    <span class="w-1/2 bg-white"></span><span class="w-1/2 bg-gray-900"></span>
                  }
                }
              </span>
              {{ opt.label | t }}
            </button>
          }
        </div>
      </app-component-card>

      <!-- Dil -->
      <app-component-card [title]="'settings.language' | t" [desc]="'settings.languageDesc' | t">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          @for (l of language.languages; track l.id) {
            @let active = language.lang() === l.id;
            <button
              type="button"
              (click)="language.setLanguage(l.id)"
              [attr.aria-pressed]="active"
              class="flex items-center gap-3 rounded-xl border-2 p-4 text-start transition-colors"
              [class]="active ? 'border-brand-500 bg-brand-25 dark:bg-brand-500/10' : 'border-gray-200 hover:border-brand-300 dark:border-gray-800'"
            >
              <img [src]="'/images/icons/' + l.flag" alt="" class="size-8 rounded-full object-cover" />
              <span class="flex-1">
                <span class="block text-sm font-semibold text-gray-800 dark:text-white/90">{{ l.name }}</span>
                <span class="block text-xs text-gray-500 dark:text-gray-400">{{ l.shortName }}</span>
              </span>
              @if (active) {
                <svg class="size-5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              }
            </button>
          }
        </div>
      </app-component-card>

      <!-- Şifre değiştir -->
      <app-component-card class="xl:col-span-2" [title]="'settings.password' | t" [desc]="'settings.passwordDesc' | t">
        <form (submit)="$event.preventDefault(); changePassword()" class="grid max-w-3xl grid-cols-1 gap-5 md:grid-cols-3" novalidate>
          @for (f of passwordFields; track f.key) {
            <div class="flex flex-col gap-1.5">
              <label [for]="f.key" class="text-sm font-medium text-gray-700 dark:text-gray-400">{{ f.label | t }}</label>
              <input
                [id]="f.key"
                type="password"
                [attr.autocomplete]="f.key === 'current' ? 'current-password' : 'new-password'"
                [value]="pw()[f.key]"
                (input)="setPw(f.key, $any($event.target).value)"
                class="h-11 w-full rounded-[10px] border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs outline-hidden focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
          }
          <div class="md:col-span-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-sm" [class]="pwError() ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'">
              {{ (pwError() ?? 'settings.pwHint') | t }}
            </p>
            <button
              type="submit"
              class="inline-flex h-11 items-center justify-center rounded-[10px] bg-brand-500 px-5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600"
            >
              {{ 'settings.updatePassword' | t }}
            </button>
          </div>
        </form>
      </app-component-card>
    </div>
  `,
})
export class SettingsComponent {
  readonly themeService = inject(ThemeService);
  readonly language = inject(LanguageService);
  private readonly popup = inject(PopupService);

  readonly theme = toSignal(this.themeService.theme$, { initialValue: 'light' as Theme });

  readonly themeOptions: { id: Theme; label: string }[] = [
    { id: 'light', label: 'settings.theme.light' },
    { id: 'dark', label: 'settings.theme.dark' },
    { id: 'auto', label: 'settings.theme.auto' },
  ];

  readonly passwordFields = [
    { key: 'current', label: 'settings.pw.current' },
    { key: 'next', label: 'settings.pw.new' },
    { key: 'confirm', label: 'settings.pw.confirm' },
  ] as const;

  readonly pw = signal({ current: '', next: '', confirm: '' });
  private readonly submitted = signal(false);

  readonly pwError = computed<string | null>(() => {
    if (!this.submitted()) return null;
    const { current, next, confirm } = this.pw();
    if (!current || !next || !confirm) return 'settings.pwErr.required';
    if (next.length < 8) return 'settings.pwErr.length';
    if (next !== confirm) return 'settings.pwErr.match';
    return null;
  });

  setPw(key: 'current' | 'next' | 'confirm', value: string) {
    this.pw.update((p) => ({ ...p, [key]: value }));
  }

  changePassword(): void {
    this.submitted.set(true);
    if (this.pwError()) return;
    // TODO: Backend bağlanınca şifre değiştirme API çağrısı yapılacak.
    this.popup.warning(this.language.t('settings.pwNotConnected'));
  }
}
