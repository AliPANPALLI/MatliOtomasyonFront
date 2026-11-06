import { Component, ElementRef, OnDestroy, computed, signal, viewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { AuthPageLayoutComponent } from '../../../layout/shell/auth-page-layout/auth-page-layout.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

const LENGTH = 6;
const RESEND_SECONDS = 60;

/** İki adımlı doğrulama (OTP) – 6 haneli kod */
@Component({
  selector: 'app-otp',
  imports: [AuthPageLayoutComponent, RouterModule, TranslatePipe],
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

          <div class="mb-6 text-center">
            <span class="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
              <svg class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 018 0v3M12 14.5v2.5" /></svg>
            </span>
            <h1 class="text-title-sm sm:text-title-lg font-semibold text-gray-800 dark:text-white/90">{{ 'otp.title' | t }}</h1>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ 'otp.subtitle' | t }}</p>
          </div>

          <form (submit)="$event.preventDefault(); verify()" novalidate>
            <div class="flex justify-center gap-2 sm:gap-3" (paste)="onPaste($event)">
              @for (d of digits(); track $index; let i = $index) {
                <input
                  #box
                  type="text"
                  inputmode="numeric"
                  autocomplete="one-time-code"
                  maxlength="1"
                  [value]="d"
                  (input)="onInput(i, $event)"
                  (keydown)="onKeydown(i, $event)"
                  (focus)="$any($event.target).select()"
                  [attr.aria-label]="('otp.digit' | t) + ' ' + (i + 1)"
                  class="size-12 rounded-xl border bg-white text-center text-xl font-semibold text-gray-800 shadow-theme-xs outline-hidden transition-colors focus:border-brand-400 focus:ring-3 focus:ring-brand-500/20 sm:size-14 sm:text-2xl dark:bg-gray-900 dark:text-white/90"
                  [class]="error() ? 'border-red-500' : d ? 'border-brand-300 dark:border-brand-500/50' : 'border-gray-300 dark:border-gray-700'"
                />
              }
            </div>

            @if (error()) {
              <p role="alert" class="mt-3 text-center text-sm text-red-500 dark:text-red-400">{{ 'otp.incomplete' | t }}</p>
            }

            <button
              type="submit"
              [disabled]="verifying()"
              class="mt-6 inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-brand-500 px-5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-200 dark:disabled:bg-brand-800"
            >
              {{ (verifying() ? 'otp.verifying' : 'otp.verify') | t }}
            </button>
          </form>

          <p class="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
            {{ 'otp.noCode' | t }}
            @if (remaining() > 0) {
              <span class="font-medium text-gray-700 tabular-nums dark:text-gray-300">{{ 'otp.resendIn' | t }} {{ countdown() }}</span>
            } @else {
              <button type="button" (click)="resend()" class="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400">{{ 'otp.resend' | t }}</button>
            }
          </p>
        </div>
      </div>
    </app-auth-page-layout>
  `,
})
export class OtpComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly boxes = viewChildren<ElementRef<HTMLInputElement>>('box');

  readonly digits = signal<string[]>(Array(LENGTH).fill(''));
  readonly verifying = signal(false);
  readonly error = signal(false);
  readonly remaining = signal(RESEND_SECONDS);
  readonly countdown = computed(() => {
    const s = this.remaining();
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  });
  private timer = this.startTimer();

  onInput(i: number, e: Event): void {
    const input = e.target as HTMLInputElement;
    const v = input.value.replace(/\D/g, '').slice(-1);
    input.value = v;
    this.setDigit(i, v);
    if (v && i < LENGTH - 1) this.focus(i + 1);
  }

  onKeydown(i: number, e: KeyboardEvent): void {
    if (e.key === 'Backspace' && !this.digits()[i] && i > 0) {
      this.setDigit(i - 1, '');
      this.focus(i - 1);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && i > 0) {
      this.focus(i - 1);
    } else if (e.key === 'ArrowRight' && i < LENGTH - 1) {
      this.focus(i + 1);
    }
  }

  onPaste(e: ClipboardEvent): void {
    const text = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, LENGTH);
    if (!text) return;
    e.preventDefault();
    this.digits.set(Array.from({ length: LENGTH }, (_, k) => text[k] ?? ''));
    this.error.set(false);
    this.focus(Math.min(text.length, LENGTH - 1));
  }

  verify(): void {
    if (this.digits().some((d) => !d)) {
      this.error.set(true);
      return;
    }
    this.verifying.set(true);
    // TODO: Backend bağlanınca kod doğrulama API çağrısı yapılacak.
    setTimeout(() => {
      this.verifying.set(false);
      this.router.navigateByUrl('/sirket-secimi');
    }, 600);
  }

  resend(): void {
    // TODO: Backend bağlanınca kodu yeniden gönderme API çağrısı yapılacak.
    this.digits.set(Array(LENGTH).fill(''));
    this.remaining.set(RESEND_SECONDS);
    clearInterval(this.timer);
    this.timer = this.startTimer();
    this.focus(0);
  }

  private setDigit(i: number, v: string) {
    this.digits.update((arr) => arr.map((d, k) => (k === i ? v : d)));
    this.error.set(false);
  }

  private focus(i: number) {
    setTimeout(() => this.boxes()[i]?.nativeElement.focus());
  }

  private startTimer() {
    return setInterval(() => this.remaining.update((s) => Math.max(0, s - 1)), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
