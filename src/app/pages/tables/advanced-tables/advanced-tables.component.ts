import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { DataTableComponent } from './data-table.component';
import {
  EditableTableComponent,
  ExpandableTableComponent,
  GroupedTableComponent,
  SelectableTableComponent,
  StickyTableComponent,
  StyledTableComponent,
} from './table-variants.component';

@Component({
  selector: 'app-advanced-tables',
  imports: [
    PageBreadcrumbComponent,
    ComponentCardComponent,
    TranslatePipe,
    DataTableComponent,
    SelectableTableComponent,
    StyledTableComponent,
    ExpandableTableComponent,
    StickyTableComponent,
    GroupedTableComponent,
    EditableTableComponent,
  ],
  host: { class: 'block' },
  template: `
    <app-page-breadcrumb [pageTitle]="'Advanced Tables' | t" />
    <div class="space-y-6">
      <app-component-card [title]="'table.type.data' | t" [desc]="'table.type.dataDesc' | t">
        <app-data-table />
      </app-component-card>
      <app-component-card [title]="'table.type.selectable' | t" [desc]="'table.type.selectableDesc' | t">
        <app-selectable-table />
      </app-component-card>
      <app-component-card [title]="'table.type.styled' | t" [desc]="'table.type.styledDesc' | t">
        <app-styled-table />
      </app-component-card>
      <div class="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        <app-component-card [title]="'table.type.expandable' | t" [desc]="'table.type.expandableDesc' | t">
          <app-expandable-table />
        </app-component-card>
        <app-component-card [title]="'table.type.grouped' | t" [desc]="'table.type.groupedDesc' | t">
          <app-grouped-table />
        </app-component-card>
      </div>
      <app-component-card [title]="'table.type.sticky' | t" [desc]="'table.type.stickyDesc' | t">
        <app-sticky-table />
      </app-component-card>
      <app-component-card [title]="'table.type.editable' | t" [desc]="'table.type.editableDesc' | t">
        <app-editable-table />
      </app-component-card>
    </div>
  `,
})
export class AdvancedTablesComponent {}
