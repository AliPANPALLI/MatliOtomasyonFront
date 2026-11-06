import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import {
  TableOneComponent,
  TableTwoComponent,
  TableThreeComponent,
  TableFourComponent,
  TableFiveComponent,
} from '../components/basic-tables';

@Component({
  selector: 'app-basic-tables',
  imports: [
    PageBreadcrumbComponent,
    ComponentCardComponent,
    TranslatePipe,
    TableOneComponent,
    TableTwoComponent,
    TableThreeComponent,
    TableFourComponent,
    TableFiveComponent,
  ],
  host: {
    class: 'block',
  },
  template: `
    <div>
      <app-page-breadcrumb [pageTitle]="'Basic Tables' | t" />
      <div class="space-y-6">
        <app-component-card [title]="('table.basic' | t) + ' 1'">
          <app-table-one />
        </app-component-card>
        <app-component-card [title]="('table.basic' | t) + ' 2'">
          <app-table-two />
        </app-component-card>
        <app-component-card [title]="('table.basic' | t) + ' 3'">
          <app-table-three />
        </app-component-card>
        <app-component-card [title]="('table.basic' | t) + ' 4'">
          <app-table-four />
        </app-component-card>
        <app-component-card [title]="('table.basic' | t) + ' 5'">
          <app-table-five />
        </app-component-card>
      </div>
    </div>
  `,
})
export class BasicTablesComponent {}
