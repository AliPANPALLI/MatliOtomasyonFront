import { Injectable, computed, signal } from '@angular/core';
import { COMPANIES, Company } from '../data/companies';

const STORAGE_KEY = 'selectedCompany';

/** Kullanıcının çalıştığı (seçili) şirketi tutar. */
@Injectable({ providedIn: 'root' })
export class CompanyService {
  readonly companies: Company[] = COMPANIES;

  private readonly _selectedId = signal<string | null>(this.readInitial());
  readonly selectedId = this._selectedId.asReadonly();
  readonly selected = computed<Company | null>(
    () => this.companies.find((c) => c.id === this._selectedId()) ?? null,
  );

  select(id: string): void {
    this._selectedId.set(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* depolama erişilemezse yalnızca oturum boyunca geçerli olur */
    }
  }

  clear(): void {
    this._selectedId.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* yoksay */
    }
  }

  private readInitial(): string | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved && COMPANIES.some((c) => c.id === saved) ? saved : null;
    } catch {
      return null;
    }
  }
}
