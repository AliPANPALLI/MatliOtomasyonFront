import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ThemedChartComponent } from '../../../shared/components/charts/themed-chart/themed-chart.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { gaugeChart, radarCompareChart, radarSingleChart, radialMultiChart } from '../data/chart-configs';

@Component({
  selector: 'app-radial-chart',
  imports: [ComponentCardComponent, PageBreadcrumbComponent, ThemedChartComponent, TranslatePipe],
  template: `
    <app-page-breadcrumb [pageTitle]="'Radial & Radar' | t" />
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <app-component-card [title]="'charts.radialMulti' | t">
        <app-themed-chart [config]="radialMulti" />
      </app-component-card>
      <app-component-card [title]="'charts.gauge' | t">
        <app-themed-chart [config]="gauge" />
      </app-component-card>
      <app-component-card [title]="'charts.radarCompare' | t">
        <app-themed-chart [config]="radarCompare" />
      </app-component-card>
      <app-component-card [title]="'charts.radarSingle' | t">
        <app-themed-chart [config]="radarSingle" />
      </app-component-card>
    </div>
  `,
})
export class RadialChartComponent {
  readonly radialMulti = radialMultiChart;
  readonly gauge = gaugeChart;
  readonly radarCompare = radarCompareChart;
  readonly radarSingle = radarSingleChart;
}
