import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from './core/i18n/language.service';
import { PopupHostComponent } from './shared/components/popup/popup-host.component';
import { ScrollToTopComponent } from './shared/components/common/scroll-to-top/scroll-to-top.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    PopupHostComponent,
    ScrollToTopComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Matlı Otomasyon';

  /** Uygulama açılırken kayıtlı dili (varsayılan: Türkçe) <html lang> özniteliğine uygular. */
  private readonly language = inject(LanguageService);
}
