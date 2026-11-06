import { Injectable, computed, signal } from '@angular/core';
import { DEFAULT_LANG, LANGUAGES, LangCode, LanguageOption, TRANSLATIONS } from './translations';

const STORAGE_KEY = 'lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly languages: LanguageOption[] = LANGUAGES;

  private readonly _lang = signal<LangCode>(this.readInitial());
  readonly lang = this._lang.asReadonly();
  readonly current = computed(
    () => this.languages.find((l) => l.id === this._lang()) ?? this.languages[0],
  );

  constructor() {
    this.applyToDocument(this._lang());
  }

  setLanguage(lang: LangCode): void {
    if (lang === this._lang()) return;
    this._lang.set(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* depolama erişilemezse yalnızca oturum boyunca geçerli olur */
    }
    this.applyToDocument(lang);
  }

  /** Anahtarı aktif dile çevirir; bulunamazsa anahtarın kendisini döndürür. */
  t(key: string): string {
    return TRANSLATIONS[this._lang()][key] ?? key;
  }

  private readInitial(): LangCode {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && this.isSupported(saved)) return saved;
    } catch {
      /* yoksay */
    }
    return DEFAULT_LANG;
  }

  private isSupported(code: string): code is LangCode {
    return LANGUAGES.some((l) => l.id === code);
  }

  private applyToDocument(lang: LangCode): void {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', 'ltr');
  }
}
