import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../../core/i18n/language.service';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

/** Kompakt TR / EN dil seçici (giriş sayfası vb. için). */
@Component({
  selector: 'app-language-switcher',
  imports: [TranslatePipe],
  template: `
    <div
      role="group"
      [attr.aria-label]="'common.language' | t"
      class="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900"
    >
      @for (lang of language.languages; track lang.id) {
        <button
          type="button"
          (click)="language.setLanguage(lang.id)"
          [attr.aria-pressed]="language.lang() === lang.id"
          [title]="lang.name"
          class="flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors"
          [class]="
            language.lang() === lang.id
              ? 'bg-brand-500 text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
          "
        >
          <img [src]="'/images/icons/' + lang.flag" [alt]="" class="size-4 rounded-full object-cover" />
          {{ lang.shortName }}
        </button>
      }
    </div>
  `,
})
export class LanguageSwitcherComponent {
  readonly language = inject(LanguageService);
}
