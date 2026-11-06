import { Component, HostListener, signal } from '@angular/core';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

/** Sayfa aşağı kaydırılınca sağ altta beliren "yukarı çık" butonu (app kökünde bir kez kullanılır). */
@Component({
  selector: 'app-scroll-to-top',
  imports: [TranslatePipe],
  template: `
    <button
      type="button"
      (click)="toTop()"
      [attr.aria-label]="'scrollTop' | t"
      [title]="'scrollTop' | t"
      [attr.tabindex]="visible() ? 0 : -1"
      style="bottom: calc(1.5rem + var(--footer-offset, 0px))"
      class="fixed z-[99990] flex size-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-theme-lg transition-[opacity,transform,background-color,color] duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-600 focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-brand-500/30 ltr:right-6 rtl:left-6 ltr:[body.has-chat_&]:right-[5.25rem] rtl:[body.has-chat_&]:left-[5.25rem] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-brand-400"
      [class]="visible() ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'"
    >
      <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  `,
})
export class ScrollToTopComponent {
  /** Bu kadar piksel kaydırılınca görünür olur */
  private readonly threshold = 300;
  readonly visible = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.visible.set(window.scrollY > this.threshold);
  }

  toTop(): void {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }
}
