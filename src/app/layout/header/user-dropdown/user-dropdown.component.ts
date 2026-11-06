import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { DropdownService } from '../../../core/services/dropdown.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { LangCode, LanguageOption } from '../../../core/i18n/translations';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports: [ButtonComponent, CommonModule, RouterModule, TranslatePipe]
})
export class UserDropdownComponent implements OnInit, OnDestroy {
  readonly dropdownId = 'user-dropdown';
  isOpen = false;
  subDropdownOpen = false;

  private sub = new Subscription();

  constructor(
    private elementRef: ElementRef,
    private dropdownService: DropdownService,
    private cdr: ChangeDetectorRef,
    private language: LanguageService
  ) {}

  get currentLocale(): LangCode {
    return this.language.lang();
  }

  get languages(): LanguageOption[] {
    return this.language.languages;
  }

  get currentLang(): LanguageOption {
    return this.language.current();
  }

  ngOnInit(): void {
    this.sub.add(
      this.dropdownService.activeDropdown$.subscribe((activeId) => {
        this.isOpen = activeId === this.dropdownId;
        if (!this.isOpen) {
          this.subDropdownOpen = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.clearSubCloseTimer();
    this.sub.unsubscribe();
  }

  toggleDropdown(event?: Event): void {
    event?.stopPropagation();
    this.dropdownService.toggle(this.dropdownId);
  }

  closeDropdown(): void {
    this.dropdownService.close(this.dropdownId);
  }

  private subCloseTimer?: ReturnType<typeof setTimeout>;

  toggleSubDropdown(event: Event): void {
    event.stopPropagation();
    this.clearSubCloseTimer();
    this.subDropdownOpen = !this.subDropdownOpen;
  }

  /** Dil alt menüsü fareyle üzerine gelince açılır. */
  openSubDropdown(): void {
    this.clearSubCloseTimer();
    this.subDropdownOpen = true;
  }

  /** Fare başka bir menü öğesine geçince alt menüyü hemen kapatır. */
  closeSubDropdown(): void {
    this.clearSubCloseTimer();
    if (this.subDropdownOpen) {
      this.subDropdownOpen = false;
      this.cdr.detectChanges();
    }
  }

  /** İmlecin alt menüye geçebilmesi için kısa gecikme. */
  scheduleCloseSubDropdown(): void {
    this.clearSubCloseTimer();
    this.subCloseTimer = setTimeout(() => {
      this.subDropdownOpen = false;
      this.cdr.detectChanges();
    }, 120);
  }

  private clearSubCloseTimer(): void {
    if (this.subCloseTimer) {
      clearTimeout(this.subCloseTimer);
      this.subCloseTimer = undefined;
    }
  }

  selectLanguage(id: LangCode, event?: Event): void {
    event?.stopPropagation();
    this.language.setLanguage(id);
    this.closeDropdown();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
}
