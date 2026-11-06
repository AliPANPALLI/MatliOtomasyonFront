import { Component, inject } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PopupService, PopupType } from '../../../core/popup/popup.service';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

/** Bildirim, uyarı/onay ve duyuru pencerelerinin örnek sayfası */
@Component({
  selector: 'app-popups',
  imports: [ComponentCardComponent, PageBreadcrumbComponent, TranslatePipe],
  template: `
    <app-page-breadcrumb [pageTitle]="'Popups & Notifications' | t" />

    <div class="space-y-6">
      <!-- Bildirimler -->
      <app-component-card [title]="'popupDemo.toasts' | t" [desc]="'popupDemo.toastsDesc' | t">
        <div class="flex flex-wrap gap-3">
          @for (type of types; track type) {
            <button type="button" (click)="showToast(type)" [class]="btn + ' ' + typeBtn[type]">
              {{ 'popupDemo.type.' + type | t }}
            </button>
          }
        </div>
        <pre class="mt-5 overflow-x-auto rounded-xl bg-gray-50 p-4 text-xs text-gray-700 dark:bg-white/[0.03] dark:text-gray-300"><code>{{ toastCode }}</code></pre>
      </app-component-card>

      <!-- Uyarı / onay -->
      <app-component-card [title]="'popupDemo.dialogs' | t" [desc]="'popupDemo.dialogsDesc' | t">
        <div class="flex flex-wrap gap-3">
          @for (type of types; track type) {
            <button type="button" (click)="showAlert(type)" [class]="btn + ' ' + typeBtn[type]">
              {{ 'popupDemo.type.' + type | t }}
            </button>
          }
          <button type="button" (click)="showConfirm()" [class]="btn + ' ' + outlineBtn">
            {{ 'popupDemo.confirm' | t }}
          </button>
          <button type="button" (click)="showDangerConfirm()" [class]="btn + ' ' + typeBtn.error">
            {{ 'popupDemo.dangerConfirm' | t }}
          </button>
        </div>
        <pre class="mt-5 overflow-x-auto rounded-xl bg-gray-50 p-4 text-xs text-gray-700 dark:bg-white/[0.03] dark:text-gray-300"><code>{{ dialogCode }}</code></pre>
      </app-component-card>

      <!-- Duyuru / reklam -->
      <app-component-card [title]="'popupDemo.announcements' | t" [desc]="'popupDemo.announcementsDesc' | t">
        <div class="flex flex-wrap gap-3">
          <button type="button" (click)="showAnnouncement('card')" [class]="btn + ' ' + typeBtn.info">
            {{ 'popupDemo.variant.card' | t }}
          </button>
          <button type="button" (click)="showAnnouncement('split')" [class]="btn + ' ' + typeBtn.info">
            {{ 'popupDemo.variant.split' | t }}
          </button>
          <button type="button" (click)="showAnnouncement('image')" [class]="btn + ' ' + typeBtn.info">
            {{ 'popupDemo.variant.image' | t }}
          </button>
        </div>
        <pre class="mt-5 overflow-x-auto rounded-xl bg-gray-50 p-4 text-xs text-gray-700 dark:bg-white/[0.03] dark:text-gray-300"><code>{{ announceCode }}</code></pre>
      </app-component-card>
    </div>
  `,
})
export class PopupsComponent {
  private readonly popup = inject(PopupService);
  private readonly lang = inject(LanguageService);

  readonly types: PopupType[] = ['success', 'error', 'warning', 'info'];

  readonly btn =
    'inline-flex h-11 items-center justify-center rounded-[10px] px-5 text-sm font-medium shadow-theme-xs transition-colors';
  readonly outlineBtn =
    'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5';
  readonly typeBtn: Record<PopupType, string> = {
    success: 'bg-success-500 text-white hover:bg-success-600',
    error: 'bg-error-500 text-white hover:bg-error-600',
    warning: 'bg-warning-500 text-white hover:bg-warning-600',
    info: 'bg-brand-500 text-white hover:bg-brand-600',
  };

  readonly toastCode = `popup.success('Başlık', 'Mesaj');
popup.error('Başlık', 'Mesaj');
popup.toast({ type: 'warning', title: 'Başlık', message: 'Mesaj', duration: 0 }); // 0 = otomatik kapanmaz`;

  readonly dialogCode = `await popup.alert({ type: 'success', title: 'Başlık', message: 'Mesaj' });
const ok = await popup.confirm({ title: 'Emin misiniz?', message: 'Mesaj', danger: true });`;

  readonly announceCode = `popup.announce({ id: 'duyuru-1', variant: 'card' | 'split' | 'image', image: '/images/...',
  badge: 'Etiket', title: 'Başlık', message: 'Metin', primaryText: 'Buton', primaryUrl: '/hedef' });`;

  private t(key: string) {
    return this.lang.t(key);
  }

  showToast(type: PopupType): void {
    this.popup.toast({
      type,
      title: this.t('popupDemo.sampleTitle.' + type),
      message: this.t('popupDemo.sampleMessage'),
    });
  }

  showAlert(type: PopupType): void {
    this.popup.alert({
      type,
      title: this.t('popupDemo.sampleTitle.' + type),
      message: this.t('popupDemo.sampleMessage'),
    });
  }

  async showConfirm(): Promise<void> {
    const ok = await this.popup.confirm({
      type: 'info',
      title: this.t('popupDemo.confirmTitle'),
      message: this.t('popupDemo.sampleMessage'),
    });
    this.popup.toast({
      type: ok ? 'success' : 'info',
      title: this.t(ok ? 'popupDemo.confirmed' : 'popupDemo.cancelled'),
    });
  }

  async showDangerConfirm(): Promise<void> {
    const ok = await this.popup.confirm({
      type: 'error',
      danger: true,
      title: this.t('popupDemo.confirmTitle'),
      message: this.t('popupDemo.dangerMessage'),
      confirmText: this.t('popupDemo.delete'),
    });
    if (ok) this.popup.success(this.t('popupDemo.confirmed'));
  }

  showAnnouncement(variant: 'card' | 'split' | 'image'): void {
    this.popup.announce({
      id: 'demo-' + variant,
      variant,
      image: variant === 'card' ? undefined : variant === 'split' ? '/images/carousel/carousel-02.png' : '/images/carousel/carousel-01.png',
      badge: this.t('popupDemo.badge'),
      title: this.t('popupDemo.announceTitle'),
      message: this.t('popupDemo.announceMessage'),
      primaryText: this.t('popupDemo.primary'),
      secondaryText: this.t('popupDemo.later'),
    });
  }

}
