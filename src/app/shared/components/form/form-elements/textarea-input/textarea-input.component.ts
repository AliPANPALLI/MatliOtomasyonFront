import { TranslatePipe } from '../../../../../core/i18n/translate.pipe';
import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../common/component-card/component-card.component';
import { DefaultTextareaComponent } from './default-textarea.component';
import { DisabledTextareaComponent } from './disabled-textarea.component';
import { ErrorTextareaComponent } from './error-textarea.component';
import { InputGroupTextareaComponent } from './input-group-textarea.component';

@Component({
  selector: 'app-textarea-input',
  imports: [TranslatePipe, 
    ComponentCardComponent,
    DefaultTextareaComponent,
    DisabledTextareaComponent,
    ErrorTextareaComponent,
    InputGroupTextareaComponent,
  ],
  host: {
    class: 'block',
  },
  template: `
    <app-component-card [title]="'Textarea input field' | t">
      <div class="space-y-6">
        <app-default-textarea />
        <app-disabled-textarea />
        <app-error-textarea />
        <app-input-group-textarea />
      </div>
    </app-component-card>
  `,
})
export class TextAreaInputComponent {}
