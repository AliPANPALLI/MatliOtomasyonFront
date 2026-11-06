import { Component, HostListener, computed, effect, inject } from '@angular/core';
import { PopupService, PopupType } from '../../../core/popup/popup.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { NgTemplateOutlet } from '@angular/common';

/** Tür bazlı renk sınıfları (TailAdmin durum renkleri + Matlı mavisi) */
const TONE: Record<PopupType, { icon: string; soft: string; bar: string; button: string }> = {
  success: {
    icon: 'text-success-600 dark:text-success-500',
    soft: 'bg-success-50 dark:bg-success-500/15',
    bar: 'bg-success-500',
    button: 'bg-success-500 hover:bg-success-600',
  },
  error: {
    icon: 'text-error-600 dark:text-error-500',
    soft: 'bg-error-50 dark:bg-error-500/15',
    bar: 'bg-error-500',
    button: 'bg-error-500 hover:bg-error-600',
  },
  warning: {
    icon: 'text-warning-600 dark:text-orange-400',
    soft: 'bg-warning-50 dark:bg-warning-500/15',
    bar: 'bg-warning-500',
    button: 'bg-warning-500 hover:bg-warning-600',
  },
  info: {
    icon: 'text-brand-500 dark:text-brand-400',
    soft: 'bg-brand-50 dark:bg-brand-500/15',
    bar: 'bg-brand-500',
    button: 'bg-brand-500 hover:bg-brand-600',
  },
};

/**
 * Uygulamanın kökünde bir kez kullanılır (app.component.html).
 * PopupService'teki bildirim, uyarı/onay ve duyuru pencerelerini çizer.
 */
@Component({
  selector: 'app-popup-host',
  imports: [TranslatePipe, NgTemplateOutlet],
  templateUrl: './popup-host.component.html',
  styles: `
    @keyframes toast-progress { from { transform: scaleX(1); } to { transform: scaleX(0); } }
    .toast-progress { transform-origin: left; animation-name: toast-progress; animation-timing-function: linear; animation-fill-mode: forwards; }
    :host-context([dir='rtl']) .toast-progress { transform-origin: right; }
  `,
})
export class PopupHostComponent {
  readonly popup = inject(PopupService);
  readonly tone = TONE;

  readonly anyModalOpen = computed(() => !!this.popup.dialog() || !!this.popup.announcement());

  constructor() {
    // Pencere açıkken arka sayfa kaymasın
    effect(() => {
      document.body.style.overflow = this.anyModalOpen() ? 'hidden' : '';
    });
  }

  closeAnnouncement(): void {
    this.popup.closeAnnouncement();
  }

  primaryAction(): void {
    const url = this.popup.announcement()?.primaryUrl;
    this.closeAnnouncement();
    if (url) window.open(url, url.startsWith('http') ? '_blank' : '_self', 'noopener');
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.popup.announcement()) this.closeAnnouncement();
    else if (this.popup.dialog()) this.popup.closeDialog(false);
  }
}
