import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyService } from '../../../core/services/company.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

/** Header'da seçili şirketi gösterir; tıklanınca şirket seçim sayfasına gider. */
@Component({
  selector: 'app-company-chip',
  imports: [RouterModule, TranslatePipe],
  template: `
    @let company = companyService.selected();
    @if (company) {
      <!-- Seçili şirket: logo büyük ve kırpılmadan, "Aktif şirket" etiketi + kalın ad -->
      <a
        routerLink="/sirket-secimi"
        [title]="'company.change' | t"
        class="group flex h-12 items-center gap-3 rounded-xl border-2 border-brand-200 bg-brand-25 py-1 ltr:pl-1.5 ltr:pr-3 rtl:pr-1.5 rtl:pl-3 shadow-theme-xs transition-colors hover:border-brand-400 hover:bg-brand-50 dark:border-brand-500/40 dark:bg-brand-500/10 dark:hover:border-brand-400 dark:hover:bg-brand-500/15"
      >
        <span class="flex h-full w-16 shrink-0 items-center justify-center rounded-lg px-1.5 dark:bg-brand-100 sm:w-20">
          <img [src]="'/images/matli/' + company.logo" [alt]="company.name" class="max-h-full max-w-full object-contain" />
        </span>
        <span class="hidden min-w-0 flex-col leading-tight sm:flex xl:hidden 2xl:flex">
          <span class="flex items-center gap-1 text-[11px] font-medium text-brand-600 dark:text-brand-400">
            <span class="size-1.5 rounded-full bg-success-500"></span>
            {{ 'company.active' | t }}
          </span>
          <span class="max-w-40 truncate text-sm font-semibold text-gray-800 dark:text-white/90">{{ company.name }}</span>
        </span>
        <svg class="size-4 shrink-0 text-brand-500 transition-transform group-hover:scale-110 dark:text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
        </svg>
      </a>
    } @else {
      <!-- Şirket seçilmemiş: dikkat çeken uyarı butonu -->
      <a
        routerLink="/sirket-secimi"
        class="flex h-11 items-center gap-2 rounded-xl border-2 border-dashed border-warning-300 bg-warning-50 px-3 text-sm font-medium text-warning-700 transition-colors hover:bg-warning-100 dark:border-warning-500/40 dark:bg-warning-500/10 dark:text-orange-400"
      >
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4" /></svg>
        {{ 'company.title' | t }}
      </a>
    }
  `,
})
export class CompanyChipComponent {
  readonly companyService = inject(CompanyService);
}
