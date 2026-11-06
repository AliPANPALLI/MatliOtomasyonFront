import { TranslatePipe } from '../../../../../core/i18n/translate.pipe';
import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../common/component-card/component-card.component';
import { DefaultRadioButtonsComponent } from './default-radio-buttons.component';
import { LabeledRadioButtonsComponent } from './labeled-radio-buttons.component';

@Component({
  selector: 'app-radio-buttons',
  host: { class: 'block' },
  imports: [TranslatePipe, 
    ComponentCardComponent,
    DefaultRadioButtonsComponent,
    LabeledRadioButtonsComponent,
  ],
  templateUrl: './radio-buttons.component.html',
})
export class RadioButtonsComponent {}
