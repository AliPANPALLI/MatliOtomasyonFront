import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignUpFormFieldsComponent } from './form.component';
import { SignUpHeaderComponent } from './header.component';

@Component({
  selector: 'app-sign-up-content',
  imports: [
    CommonModule,
    RouterModule,
    SignUpHeaderComponent,
    SignUpFormFieldsComponent,
  ],
  templateUrl: './sign-up.component.html',
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
export class SignUpContentComponent {
  @Input() className: string = '';
}
