import { Component } from '@angular/core';
import { ThemeToggleTwoComponent } from '../../../shared/components/common/theme-toggle-two/theme-toggle-two.component';
import { LanguageSwitcherComponent } from '../../../shared/components/common/language-switcher/language-switcher.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { COMPANIES } from '../../../core/data/companies';

@Component({
  selector: 'app-auth-page-layout',
  imports: [
    ThemeToggleTwoComponent,
    LanguageSwitcherComponent,
    TranslatePipe,
  ],
  templateUrl: './auth-page-layout.component.html',
  styles: `
    .marquee-track {
      animation: marquee 40s linear infinite;
    }
    .marquee-mask:hover .marquee-track {
      animation-play-state: paused;
    }
    .marquee-mask {
      mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
    }
    /* Videonun dört kenarını yumuşakça şeffaflaştırıp mavi zemine karıştırır */
    .video-fade {
      -webkit-mask-image:
        linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%),
        linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%);
      -webkit-mask-composite: source-in;
      mask-image:
        linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%),
        linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%);
      mask-composite: intersect;
    }
    @keyframes marquee {
      from { transform: translateX(0); }
      to { transform: translateX(calc(-50% - 0.5rem)); }
    }
    @media (prefers-reduced-motion: reduce) {
      .marquee-track { animation: none; }
    }
  `
})
export class AuthPageLayoutComponent {
  // Ana şirket (Matlı Yem) dışındaki şirketler bantta gösterilir.
  readonly companyLogos = COMPANIES.filter((c) => c.id !== 'matli');

  /** Kesintisiz kayma için liste iki kez arka arkaya basılır. */
  readonly marqueeLogos = [...this.companyLogos, ...this.companyLogos];
}
