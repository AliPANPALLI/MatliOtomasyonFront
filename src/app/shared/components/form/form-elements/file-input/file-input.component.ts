import { TranslatePipe } from '../../../../../core/i18n/translate.pipe';
import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../common/component-card/component-card.component';
import { DefaultFileInputComponent } from './default-file-input.component';

@Component({
  selector: 'app-file-input',
  imports: [TranslatePipe, ComponentCardComponent, DefaultFileInputComponent],
  host: {
    class: 'block',
  },
  template: `
    <app-component-card [title]="'File Input' | t">
      <div class="space-y-6">
        <app-default-file-input />
      </div>
    </app-component-card>
  `,
})
export class FileInputComponent {}
