import { Component, HostListener, effect, signal } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { ICON, UI } from '../ui-kit';

type ModalKind = 'sm' | 'md' | 'lg' | 'full' | 'form' | 'scroll' | 'drawer-right' | 'drawer-left';

@Component({
  selector: 'app-modals',
  imports: [ComponentCardComponent, PageBreadcrumbComponent, TranslatePipe],
  template: `
    <app-page-breadcrumb [pageTitle]="'Modals' | t" />
    <div class="space-y-6">
      <app-component-card [title]="'ui.modal.sizes' | t">
        <div class="flex flex-wrap gap-3">
          <button type="button" [class]="UI.btn + ' ' + UI.primary" (click)="show('sm')">{{ 'ui.modal.small' | t }}</button>
          <button type="button" [class]="UI.btn + ' ' + UI.primary" (click)="show('md')">{{ 'ui.modal.default' | t }}</button>
          <button type="button" [class]="UI.btn + ' ' + UI.primary" (click)="show('lg')">{{ 'ui.modal.large' | t }}</button>
          <button type="button" [class]="UI.btn + ' ' + UI.primary" (click)="show('full')">{{ 'ui.modal.full' | t }}</button>
        </div>
      </app-component-card>
      <app-component-card [title]="'ui.modal.content' | t">
        <div class="flex flex-wrap gap-3">
          <button type="button" [class]="UI.btn + ' ' + UI.outline" (click)="show('form')">{{ 'ui.modal.form' | t }}</button>
          <button type="button" [class]="UI.btn + ' ' + UI.outline" (click)="show('scroll')">{{ 'ui.modal.scroll' | t }}</button>
        </div>
      </app-component-card>
      <app-component-card [title]="'ui.modal.drawers' | t">
        <div class="flex flex-wrap gap-3">
          <button type="button" [class]="UI.btn + ' ' + UI.outline" (click)="show('drawer-right')">{{ 'ui.modal.drawerRight' | t }}</button>
          <button type="button" [class]="UI.btn + ' ' + UI.outline" (click)="show('drawer-left')">{{ 'ui.modal.drawerLeft' | t }}</button>
        </div>
      </app-component-card>
    </div>

    @if (open(); as kind) {
      @let drawer = kind === 'drawer-right' || kind === 'drawer-left';
      <div class="fixed inset-0 z-99999 flex overflow-y-auto" [class]="drawer ? '' : 'items-center justify-center p-4'">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200" (click)="close()"></div>

        <div
          role="dialog"
          aria-modal="true"
          class="relative z-10 flex flex-col border border-gray-200 bg-white shadow-theme-xl dark:border-gray-800 dark:bg-[#1E2635]"
          [class]="panelClass(kind)"
        >
          <!-- Başlık -->
          <div class="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">{{ 'ui.modal.title' | t }}</h3>
              <p [class]="UI.text">{{ 'ui.sampleText' | t }}</p>
            </div>
            <button type="button" (click)="close()" [attr.aria-label]="'popup.close' | t" class="flex size-9 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/5 dark:hover:text-white">
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path [attr.d]="ICON.x" /></svg>
            </button>
          </div>

          <!-- İçerik -->
          <div class="custom-scrollbar flex-1 overflow-y-auto px-6 py-5">
            @switch (kind) {
              @case ('form') {
                <form class="grid grid-cols-1 gap-4 sm:grid-cols-2" (submit)="$event.preventDefault(); close()">
                  @for (f of ['ui.field.first', 'ui.field.second', 'ui.field.third', 'ui.field.fourth']; track f) {
                    <label class="flex flex-col gap-1.5">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-400">{{ f | t }}</span>
                      <input type="text" class="h-11 rounded-[10px] border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs outline-hidden focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
                    </label>
                  }
                  <label class="flex flex-col gap-1.5 sm:col-span-2">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-400">{{ 'ui.field.note' | t }}</span>
                    <textarea rows="3" class="rounded-[10px] border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs outline-hidden focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"></textarea>
                  </label>
                </form>
              }
              @case ('scroll') {
                @for (p of paragraphs; track p) {
                  <p class="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{{ 'ui.paragraph' | t }} {{ p }}. {{ 'ui.longText' | t }}</p>
                }
              }
              @default {
                <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{{ 'ui.longText' | t }}</p>
              }
            }
          </div>

          <!-- Alt -->
          <div class="flex justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
            <button type="button" [class]="UI.btn + ' ' + UI.outline" (click)="close()">{{ 'popup.cancel' | t }}</button>
            <button type="button" [class]="UI.btn + ' ' + UI.primary" (click)="close()">{{ 'table.save' | t }}</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ModalsComponent {
  readonly UI = UI;
  readonly ICON = ICON;
  readonly open = signal<ModalKind | null>(null);
  readonly paragraphs = Array.from({ length: 12 }, (_, i) => i + 1);

  constructor() {
    effect(() => {
      document.body.style.overflow = this.open() ? 'hidden' : '';
    });
  }

  show(k: ModalKind) {
    this.open.set(k);
  }
  close() {
    this.open.set(null);
  }

  panelClass(k: ModalKind): string {
    const anim = 'animate-in fade-in duration-200';
    switch (k) {
      case 'sm': return `${anim} zoom-in-95 my-auto w-full max-w-sm rounded-3xl`;
      case 'lg': return `${anim} zoom-in-95 my-auto w-full max-w-4xl rounded-3xl`;
      case 'full': return `${anim} zoom-in-95 h-[calc(100vh-2rem)] w-full rounded-3xl`;
      case 'scroll': return `${anim} zoom-in-95 my-auto max-h-[85vh] w-full max-w-2xl rounded-3xl`;
      case 'drawer-right': return `${anim} slide-in-from-right h-full w-full max-w-md ltr:ml-auto rtl:mr-auto`;
      case 'drawer-left': return `${anim} slide-in-from-left h-full w-full max-w-md ltr:mr-auto rtl:ml-auto`;
      default: return `${anim} zoom-in-95 my-auto w-full max-w-xl rounded-3xl`;
    }
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.close();
  }
}
