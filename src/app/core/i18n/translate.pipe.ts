import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from './language.service';

/**
 * Kullanım: {{ 'signin.submit' | t }}
 * Dil değiştiğinde yeniden hesaplanması için impure (pure: false).
 */
@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly language = inject(LanguageService);

  transform(key: string | null | undefined): string {
    if (!key) return '';
    // Sinyali okumak, OnPush bileşenlerde de dil değişimini izlemeyi sağlar.
    this.language.lang();
    return this.language.t(key);
  }
}
