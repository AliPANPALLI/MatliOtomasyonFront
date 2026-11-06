import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthPageLayoutComponent } from '../../../layout/shell/auth-page-layout/auth-page-layout.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

/** Şifremi unuttum: sicil no ile sıfırlama talebi (giriş sayfasıyla aynı düzen) */
@Component({
  selector: 'app-reset-password',
  imports: [AuthPageLayoutComponent, ReactiveFormsModule, RouterModule, TranslatePipe],
  template: `
    <app-auth-page-layout>
      <div class="flex w-full flex-1 flex-col lg:w-1/2">
        <div class="mx-auto mb-5 w-full max-w-md sm:pt-10">
          <a routerLink="/signin" class="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <svg class="size-6 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            {{ 'reset.backToSignin' | t }}
          </a>
        </div>

        <div class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <div class="mb-8 flex justify-center">
            <img class="h-20 w-auto" src="/images/logo/matli-otomasyon-logo.png" alt="Matlı Otomasyon" width="296" height="80" />
          </div>

          @if (!sent()) {
            <div class="mb-6">
              <h1 class="text-title-sm sm:text-title-lg font-semibold text-gray-800 dark:text-white/90">{{ 'reset.title' | t }}</h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ 'reset.subtitle' | t }}</p>
            </div>

            <form (ngSubmit)="submit()" class="space-y-5" novalidate>
              <div class="flex flex-col gap-1.5">
                <label for="sicil" class="text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ 'signin.sicilNo' | t }} <span class="text-red-500">*</span>
                </label>
                <input
                  id="sicil"
                  type="text"
                  autocomplete="username"
                  [formControl]="sicilNo"
                  [placeholder]="'signin.sicilNoPlaceholder' | t"
                  class="h-11 w-full rounded-[10px] border bg-white px-4 text-sm text-gray-800 shadow-theme-xs outline-hidden placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500"
                  [class]="invalid() ? 'border-red-500 ring-3 ring-red-500/20' : 'border-gray-300 dark:border-gray-700'"
                />
                @if (invalid()) {
                  <p role="alert" class="text-sm text-red-500 dark:text-red-400">{{ 'signin.sicilNoRequired' | t }}</p>
                }
              </div>

              <button
                type="submit"
                [disabled]="submitting()"
                class="inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-brand-500 px-5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-200 dark:disabled:bg-brand-800"
              >
                {{ (submitting() ? 'reset.sending' : 'reset.submit') | t }}
              </button>
            </form>
          } @else {
            <!-- Talep alındı -->
            <div class="text-center animate-in fade-in zoom-in-95">
              <span class="mx-auto flex size-16 items-center justify-center rounded-full bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
                <svg class="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.25" /><path d="M8 12.5l2.7 2.7L16.2 9.5" /></svg>
              </span>
              <h1 class="mt-5 text-title-sm font-semibold text-gray-800 dark:text-white/90">{{ 'reset.sentTitle' | t }}</h1>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ 'reset.sentMessage' | t }}</p>
              <a routerLink="/signin" class="mt-8 inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-brand-500 px-5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600">
                {{ 'reset.backToSignin' | t }}
              </a>
            </div>
          }
        </div>
      </div>
    </app-auth-page-layout>
  `,
})
export class ResetPasswordComponent {
  readonly sicilNo = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly submitting = signal(false);
  readonly sent = signal(false);
  private readonly touched = signal(false);

  invalid() {
    return this.touched() && this.sicilNo.invalid;
  }

  submit(): void {
    this.touched.set(true);
    if (this.sicilNo.invalid) return;
    this.submitting.set(true);
    // TODO: Backend bağlanınca şifre sıfırlama API çağrısı yapılacak.
    setTimeout(() => {
      this.submitting.set(false);
      this.sent.set(true);
    }, 600);
  }
}
