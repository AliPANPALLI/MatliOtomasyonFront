import { Component, HostListener, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { ICON, UI } from '../ui-kit';

@Component({
  selector: 'app-dropdowns',
  imports: [ComponentCardComponent, PageBreadcrumbComponent, TranslatePipe, NgTemplateOutlet],
  template: `
    <ng-template #ico let-d><svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="d" /></svg></ng-template>

    <app-page-breadcrumb [pageTitle]="'Dropdowns' | t" />
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <!-- 1. Temel -->
      <app-component-card [title]="'ui.dd.basic' | t">
        <div class="relative inline-block min-h-48">
          <button type="button" [class]="UI.btn + ' ' + UI.primary" (click)="toggle('basic', $event)">
            {{ 'ui.options' | t }}
            <svg class="size-4 transition-transform" [class.rotate-180]="open() === 'basic'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path [attr.d]="ICON.chevronDown" /></svg>
          </button>
          @if (open() === 'basic') {
            <div [class]="UI.menu + ' ltr:left-0 rtl:right-0'">
              @for (n of [1, 2, 3]; track n) {
                <button type="button" [class]="UI.menuItem" (click)="close()">{{ 'ui.item' | t }} {{ n }}</button>
              }
            </div>
          }
        </div>
      </app-component-card>

      <!-- 2. İkonlu + ayraç -->
      <app-component-card [title]="'ui.dd.icons' | t">
        <div class="relative inline-block min-h-56">
          <button type="button" [class]="UI.btn + ' ' + UI.outline" (click)="toggle('icons', $event)">
            {{ 'ui.actions' | t }}
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path [attr.d]="ICON.chevronDown" /></svg>
          </button>
          @if (open() === 'icons') {
            <div [class]="UI.menu + ' ltr:left-0 rtl:right-0'">
              <button type="button" [class]="UI.menuItem" (click)="close()"><ng-container *ngTemplateOutlet="ico; context: { $implicit: ICON.edit }" />{{ 'table.edit' | t }}</button>
              <button type="button" [class]="UI.menuItem" (click)="close()"><ng-container *ngTemplateOutlet="ico; context: { $implicit: ICON.copy }" />{{ 'ui.duplicate' | t }}</button>
              <button type="button" [class]="UI.menuItem" (click)="close()"><ng-container *ngTemplateOutlet="ico; context: { $implicit: ICON.share }" />{{ 'ui.share' | t }}</button>
              <div [class]="UI.divider"></div>
              <button type="button" [class]="UI.menuItem + ' !text-error-600 hover:!bg-error-50 dark:!text-error-400 dark:hover:!bg-error-500/10'" (click)="close()"><ng-container *ngTemplateOutlet="ico; context: { $implicit: ICON.trash }" />{{ 'table.delete' | t }}</button>
            </div>
          }
        </div>
      </app-component-card>

      <!-- 3. Başlıklı (kullanıcı menüsü) -->
      <app-component-card [title]="'ui.dd.header' | t">
        <div class="relative inline-block min-h-64">
          <button type="button" (click)="toggle('user', $event)" class="flex items-center gap-2 rounded-full border border-gray-200 py-1 ps-1 pe-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/5">
            <span class="flex size-8 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">KA</span>
            {{ 'ui.userName' | t }}
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path [attr.d]="ICON.chevronDown" /></svg>
          </button>
          @if (open() === 'user') {
            <div [class]="UI.menu + ' w-64 ltr:left-0 rtl:right-0'">
              <div class="px-3 py-2.5">
                <p [class]="UI.heading">{{ 'ui.userName' | t }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">kullanici&#64;ornek.com</p>
              </div>
              <div [class]="UI.divider"></div>
              <button type="button" [class]="UI.menuItem" (click)="close()"><ng-container *ngTemplateOutlet="ico; context: { $implicit: ICON.user }" />{{ 'User Profile' | t }}</button>
              <button type="button" [class]="UI.menuItem" (click)="close()"><ng-container *ngTemplateOutlet="ico; context: { $implicit: ICON.settings }" />{{ 'Settings' | t }}</button>
              <div [class]="UI.divider"></div>
              <button type="button" [class]="UI.menuItem" (click)="close()"><ng-container *ngTemplateOutlet="ico; context: { $implicit: ICON.logout }" />{{ 'user.signOut' | t }}</button>
            </div>
          }
        </div>
      </app-component-card>

      <!-- 4. Bölünmüş buton -->
      <app-component-card [title]="'ui.dd.split' | t">
        <div class="relative inline-flex min-h-48">
          <button type="button" class="inline-flex h-10 items-center rounded-s-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600">{{ 'table.save' | t }}</button>
          <button type="button" (click)="toggle('split', $event)" [attr.aria-label]="'ui.options' | t" class="inline-flex h-10 items-center rounded-e-lg border-s border-brand-400 bg-brand-500 px-2.5 text-white hover:bg-brand-600">
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path [attr.d]="ICON.chevronDown" /></svg>
          </button>
          @if (open() === 'split') {
            <div [class]="UI.menu + ' top-10 ltr:left-0 rtl:right-0'">
              <button type="button" [class]="UI.menuItem" (click)="close()">{{ 'ui.saveAndNew' | t }}</button>
              <button type="button" [class]="UI.menuItem" (click)="close()">{{ 'ui.saveAsDraft' | t }}</button>
            </div>
          }
        </div>
      </app-component-card>

      <!-- 5. Çoklu seçim -->
      <app-component-card [title]="'ui.dd.multi' | t">
        <div class="relative inline-block min-h-60">
          <button type="button" [class]="UI.btn + ' ' + UI.outline" (click)="toggle('multi', $event)">
            {{ 'ui.filter' | t }}
            @if (multi().size) {
              <span class="rounded-full bg-brand-500 px-1.5 text-xs text-white">{{ multi().size }}</span>
            }
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path [attr.d]="ICON.chevronDown" /></svg>
          </button>
          @if (open() === 'multi') {
            <div [class]="UI.menu + ' ltr:left-0 rtl:right-0'" (click)="$event.stopPropagation()">
              <p [class]="UI.menuLabel">{{ 'table.col.category' | t }}</p>
              @for (c of cats; track c) {
                <label [class]="UI.menuItem + ' cursor-pointer'">
                  <input type="checkbox" class="size-4 accent-brand-500" [checked]="multi().has(c)" (change)="toggleMulti(c)" />
                  {{ c }}
                </label>
              }
            </div>
          }
        </div>
      </app-component-card>

      <!-- 6. Tekli seçim -->
      <app-component-card [title]="'ui.dd.single' | t">
        <div class="relative inline-block min-h-56">
          <button type="button" (click)="toggle('single', $event)" class="flex h-10 w-56 items-center justify-between rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            {{ single() ?? ('ui.select' | t) }}
            <svg class="size-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path [attr.d]="ICON.chevronDown" /></svg>
          </button>
          @if (open() === 'single') {
            <div [class]="UI.menu + ' w-56 ltr:left-0 rtl:right-0'">
              @for (c of cats; track c) {
                <button type="button" [class]="UI.menuItem + ' justify-between'" [class.!text-brand-600]="single() === c" (click)="single.set(c); close()">
                  {{ c }}
                  @if (single() === c) {
                    <svg class="size-4 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="ICON.check" /></svg>
                  }
                </button>
              }
            </div>
          }
        </div>
      </app-component-card>

      <!-- 7. Üç nokta + 8. Yukarı açılan -->
      <app-component-card [title]="'ui.dd.kebab' | t">
        <div class="flex min-h-48 items-end justify-between gap-6">
          <div class="relative self-start">
            <button type="button" (click)="toggle('kebab', $event)" [attr.aria-label]="'ui.options' | t" class="flex size-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5">
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path [attr.d]="ICON.dots" /></svg>
            </button>
            @if (open() === 'kebab') {
              <div [class]="UI.menu + ' ltr:left-0 rtl:right-0'">
                <button type="button" [class]="UI.menuItem" (click)="close()">{{ 'table.view' | t }}</button>
                <button type="button" [class]="UI.menuItem" (click)="close()">{{ 'table.edit' | t }}</button>
                <button type="button" [class]="UI.menuItem" (click)="close()">{{ 'table.delete' | t }}</button>
              </div>
            }
          </div>
          <div class="relative">
            <button type="button" [class]="UI.btn + ' ' + UI.outline" (click)="toggle('up', $event)">
              {{ 'ui.dd.up' | t }}
              <svg class="size-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path [attr.d]="ICON.chevronDown" /></svg>
            </button>
            @if (open() === 'up') {
              <div [class]="UI.menu + ' bottom-12 ltr:right-0 rtl:left-0'">
                @for (n of [1, 2, 3]; track n) {
                  <button type="button" [class]="UI.menuItem" (click)="close()">{{ 'ui.item' | t }} {{ n }}</button>
                }
              </div>
            }
          </div>
        </div>
      </app-component-card>
    </div>
  `,
})
export class DropdownsComponent {
  readonly UI = UI;
  readonly ICON = ICON;
  readonly cats = ['Kategori A', 'Kategori B', 'Kategori C', 'Kategori D'];

  readonly open = signal<string | null>(null);
  readonly multi = signal<Set<string>>(new Set(['Kategori A']));
  readonly single = signal<string | null>(null);

  toggle(id: string, e: Event) {
    e.stopPropagation();
    this.open.update((cur) => (cur === id ? null : id));
  }
  close() {
    this.open.set(null);
  }
  toggleMulti(c: string) {
    this.multi.update((s) => {
      const n = new Set(s);
      n.has(c) ? n.delete(c) : n.add(c);
      return n;
    });
  }

  @HostListener('document:click')
  onDoc() {
    // Tetikleyiciler ve çoklu seçim paneli tıklamayı durdurur; geri kalan her tıklama kapatır
    if (this.open()) this.close();
  }
  @HostListener('document:keydown.escape')
  onEsc() {
    this.close();
  }
}
