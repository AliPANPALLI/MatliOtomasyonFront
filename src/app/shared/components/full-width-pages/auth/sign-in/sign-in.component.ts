import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../../../../core/i18n/translate.pipe';
import { SignInFormFieldsComponent } from './form.component';

@Component({
  selector: 'app-sign-in-content',
  imports: [
    CommonModule,
    RouterModule,
    TranslatePipe,
    SignInFormFieldsComponent,
  ],
  templateUrl: './sign-in.component.html',
  host: {
    class: 'contents',
  },
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class SignInContentComponent {
  @Input() className: string = '';
}
