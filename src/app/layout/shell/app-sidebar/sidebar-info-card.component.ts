import { Component, OnDestroy, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyService } from '../../../core/services/company.service';
import { ChatService } from '../../../core/chat/chat.service';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

/**
 * Sidebar'ın altındaki bilgi kartı (yalnızca gerçek veriler):
 * canlı tarih/saat, aktif şirket ve yapay zeka asistanına kısayol.
 */
@Component({
  selector: 'app-sidebar-info-card',
  imports: [RouterModule, TranslatePipe],
  template: `
    <div
      class="relative mb-6 overflow-hidden rounded-2xl p-4 matli-fg shadow-theme-md bg-matli-gradient"
    >
      <div class="pointer-events-none absolute inset-0 bg-honeycomb-adaptive"></div>
      <div class="pointer-events-none absolute -top-5 -right-3 h-16 w-14 clip-hex bg-brand-500/10 dark:bg-white/10"></div>

      <!-- Tarih & saat -->
      <div class="relative">
        <p class="text-xs font-medium matli-fg-muted capitalize">{{ dateText() }}</p>
        <p class="mt-0.5 text-3xl font-semibold tracking-tight tabular-nums">{{ timeText() }}</p>
      </div>

      <!-- Aktif şirket -->
      <a
        routerLink="/sirket-secimi"
        class="relative mt-4 flex items-center gap-3 rounded-xl p-2.5 backdrop-blur-sm transition-colors matli-glass"
        [title]="'company.change' | t"
      >
        @if (company.selected(); as c) {
          <span class="flex h-9 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-100 p-1">
            <img [src]="'/images/matli/' + c.logo" [alt]="c.name" class="max-h-full max-w-full object-contain" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-[11px] matli-fg-muted">{{ 'company.active' | t }}</span>
            <span class="block truncate text-sm font-semibold">{{ c.name }}</span>
          </span>
        } @else {
          <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 dark:bg-white/15">
            <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4" /></svg>
          </span>
          <span class="min-w-0 flex-1 text-sm font-semibold">{{ 'company.title' | t }}</span>
        }
        <svg class="size-4 shrink-0 matli-fg-muted rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg>
      </a>

      <!-- Asistan kısayolu -->
      <button
        type="button"
        (click)="chat.requestOpen()"
        class="relative mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 text-sm font-semibold text-white shadow-theme-xs transition-colors hover:bg-brand-600 dark:bg-white/10 dark:ring-1 dark:ring-white/15 dark:hover:bg-white/15"
      >
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.4 8.4 0 01-9 8.4 9.3 9.3 0 01-3.9-.9L3 20.5l1.5-4.2A8 8 0 013 11.5 8.4 8.4 0 0112 3a8.4 8.4 0 019 8.5z" />
        </svg>
        {{ 'sidebar.askAssistant' | t }}
      </button>
    </div>
  `,
})
export class SidebarInfoCardComponent implements OnDestroy {
  readonly company = inject(CompanyService);
  readonly chat = inject(ChatService);
  private readonly language = inject(LanguageService);

  private readonly now = signal(new Date());
  private readonly timer = setInterval(() => this.now.set(new Date()), 15_000);

  private locale() {
    return this.language.lang() === 'tr' ? 'tr-TR' : 'en-US';
  }

  dateText(): string {
    return this.now().toLocaleDateString(this.locale(), { weekday: 'long', day: 'numeric', month: 'long' });
  }

  timeText(): string {
    return this.now().toLocaleTimeString(this.locale(), { hour: '2-digit', minute: '2-digit' });
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
