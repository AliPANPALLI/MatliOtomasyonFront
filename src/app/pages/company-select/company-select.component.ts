import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CompanyService } from '../../core/services/company.service';
import { Company } from '../../core/data/companies';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { LanguageSwitcherComponent } from '../../shared/components/common/language-switcher/language-switcher.component';
import { ThemeToggleTwoComponent } from '../../shared/components/common/theme-toggle-two/theme-toggle-two.component';

@Component({
  selector: 'app-company-select',
  imports: [RouterModule, TranslatePipe, LanguageSwitcherComponent, ThemeToggleTwoComponent],
  templateUrl: './company-select.component.html',
})
export class CompanySelectComponent {
  private readonly router = inject(Router);
  readonly companyService = inject(CompanyService);

  readonly query = signal('');

  /** Arama: Türkçe karakterleri de doğru eşleştirecek şekilde büyük/küçük harf duyarsız. */
  readonly filtered = computed<Company[]>(() => {
    const q = this.query().trim().toLocaleLowerCase('tr');
    if (!q) return this.companyService.companies;
    return this.companyService.companies.filter((c) =>
      c.name.toLocaleLowerCase('tr').includes(q),
    );
  });

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  select(company: Company): void {
    this.companyService.select(company.id);
    this.router.navigateByUrl('/');
  }

  signOut(): void {
    this.companyService.clear();
    this.router.navigateByUrl('/signin');
  }
}
