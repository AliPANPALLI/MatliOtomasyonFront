import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ThemedChartComponent } from '../../../shared/components/charts/themed-chart/themed-chart.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { donutChart, pieChart, polarAreaChart, semiDonutChart } from '../data/chart-configs';

@Component({
  selector: 'app-pie-chart',
  imports: [ComponentCardComponent, PageBreadcrumbComponent, ThemedChartComponent, TranslatePipe],
  template: `
    <app-page-breadcrumb [pageTitle]="'Pie Chart' | t" />
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <app-component-card [title]="'charts.donut' | t">
        <app-themed-chart [config]="donut" />
      </app-component-card>
      <app-component-card [title]="'charts.pie' | t">
        <app-themed-chart [config]="pie" />
      </app-component-card>
      <app-component-card [title]="'charts.polar' | t">
        <app-themed-chart [config]="polar" />
      </app-component-card>
      <app-component-card [title]="'charts.semiDonut' | t">
        <app-themed-chart [config]="semiDonut" />
      </app-component-card>
    </div>
  `,
})
export class PieChartComponent {
  readonly donut = donutChart;
  readonly pie = pieChart;
  readonly polar = polarAreaChart;
  readonly semiDonut = semiDonutChart;
}
