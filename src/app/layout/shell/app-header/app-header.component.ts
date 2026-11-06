import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeToggleButtonComponent } from '../../../shared/components/common/theme-toggle/theme-toggle-button.component';
import { NotificationDropdownComponent } from '../../header/notification-dropdown/notification-dropdown.component';
import { UserDropdownComponent } from '../../header/user-dropdown/user-dropdown.component';
import { CompanyChipComponent } from '../../header/company-chip/company-chip.component';
import { WeatherWidgetComponent } from '../../header/weather-widget/weather-widget.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { SidebarService } from '../../../core/services/sidebar.service';

import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputDirective } from '../../../shared/components/ui/input/input.directive';

@Component({
  selector: 'app-header',
  imports: [InputDirective, ButtonComponent, 
    CommonModule,
    RouterModule,
    ThemeToggleButtonComponent,
    NotificationDropdownComponent,
    UserDropdownComponent,
    CompanyChipComponent,
    WeatherWidgetComponent,
    TranslatePipe,
  ],
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  isApplicationMenuOpen = false;
  readonly isMobileOpen$;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(public sidebarService: SidebarService, private host: ElementRef<HTMLElement>) {
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  handleToggle() {
    if (window.innerWidth >= 1280) {
      this.sidebarService.toggleExpanded();
    } else {
      this.sidebarService.toggleMobileOpen();
    }
  }

  toggleApplicationMenu() {
    this.isApplicationMenuOpen = !this.isApplicationMenuOpen;
  }

  /** Header yüksekliğini --header-h CSS değişkenine yazar (dar ekranda sidebar bunun altından başlar). */
  private headerObserver?: ResizeObserver;

  ngAfterViewInit() {
    document.addEventListener('keydown', this.handleKeyDown);
    const header = this.host.nativeElement.querySelector('header') as HTMLElement | null;
    if (header) {
      this.headerObserver = new ResizeObserver(() =>
        document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px'),
      );
      this.headerObserver.observe(header);
    }
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.headerObserver?.disconnect();
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.searchInput?.nativeElement.focus();
    }
  };
}
