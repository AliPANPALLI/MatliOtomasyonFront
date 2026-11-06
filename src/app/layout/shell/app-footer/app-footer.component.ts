import { Component, ElementRef, HostListener, OnDestroy, afterNextRender, inject } from '@angular/core';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

/**
 * Panel sayfalarının altındaki footer.
 * Ekranda görünen yüksekliğini --footer-offset CSS değişkenine yazar; sağ alttaki
 * yüzen butonlar (chat, yukarı çık) bu değer kadar yukarı kayarak footer'ı kapatmaz.
 */
@Component({
  selector: 'app-footer',
  imports: [TranslatePipe],
  host: { class: 'block mt-auto' },
  template: `
    <footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div
        class="mx-auto flex w-full max-w-(--breakpoint-2xl) flex-col items-center justify-between gap-3 px-4 py-4 text-sm text-gray-500 sm:flex-row md:px-6 dark:text-gray-400"
      >
        <p class="text-center sm:text-start">
          &copy; {{ year }} Matlı Otomasyon. {{ 'footer.rights' | t }}
        </p>
        <div class="flex items-center gap-2">
          <img src="/images/logo/matli-icon.png" alt="" class="h-5 w-5 object-contain" />
          <span class="font-medium text-gray-700 dark:text-gray-300">{{ 'app.panelName' | t }}</span>
        </div>
      </div>
    </footer>
  `,
})
export class AppFooterComponent implements OnDestroy {
  readonly year = new Date().getFullYear();
  private readonly host = inject(ElementRef<HTMLElement>);
  private resizeObserver?: ResizeObserver;

  constructor() {
    afterNextRender(() => {
      this.resizeObserver = new ResizeObserver(() => this.updateOffset());
      this.resizeObserver.observe(this.host.nativeElement);
      this.resizeObserver.observe(document.body);
      this.updateOffset();
    });
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  updateOffset(): void {
    const top = this.host.nativeElement.getBoundingClientRect().top;
    const visible = Math.max(0, Math.round(window.innerHeight - top));
    document.documentElement.style.setProperty('--footer-offset', visible + 'px');
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    document.documentElement.style.setProperty('--footer-offset', '0px');
  }
}
