import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ThemedChartComponent } from '../../../shared/components/charts/themed-chart/themed-chart.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import {
  boxPlotChart,
  bubbleChart,
  candlestickChart,
  funnelChart,
  heatmapChart,
  mixedChart,
  scatterChart,
  stackedAreaChart,
  timelineChart,
  treemapChart,
} from '../data/chart-configs';

@Component({
  selector: 'app-other-charts',
  imports: [ComponentCardComponent, PageBreadcrumbComponent, ThemedChartComponent, TranslatePipe],
  template: `
    <app-page-breadcrumb [pageTitle]="'Other Charts' | t" />
    <div class="space-y-6">
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <app-component-card [title]="'charts.mixed' | t">
          <app-themed-chart [config]="mixed" />
        </app-component-card>
        <app-component-card [title]="'charts.stackedArea' | t">
          <app-themed-chart [config]="stackedArea" />
        </app-component-card>
      </div>

      <app-component-card [title]="'charts.heatmap' | t">
        <app-themed-chart [config]="heatmap" />
      </app-component-card>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <app-component-card [title]="'charts.treemap' | t">
          <app-themed-chart [config]="treemap" />
        </app-component-card>
        <app-component-card [title]="'charts.funnel' | t">
          <app-themed-chart [config]="funnel" />
        </app-component-card>
        <app-component-card [title]="'charts.scatter' | t">
          <app-themed-chart [config]="scatter" />
        </app-component-card>
        <app-component-card [title]="'charts.bubble' | t">
          <app-themed-chart [config]="bubble" />
        </app-component-card>
      </div>

      <app-component-card [title]="'charts.timeline' | t">
        <app-themed-chart [config]="timeline" />
      </app-component-card>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <app-component-card [title]="'charts.candlestick' | t">
          <app-themed-chart [config]="candlestick" />
        </app-component-card>
        <app-component-card [title]="'charts.boxPlot' | t">
          <app-themed-chart [config]="boxPlot" />
        </app-component-card>
      </div>
    </div>
  `,
})
export class OtherChartsComponent {
  readonly mixed = mixedChart;
  readonly stackedArea = stackedAreaChart;
  readonly heatmap = heatmapChart;
  readonly treemap = treemapChart;
  readonly funnel = funnelChart;
  readonly scatter = scatterChart;
  readonly bubble = bubbleChart;
  readonly timeline = timelineChart;
  readonly candlestick = candlestickChart;
  readonly boxPlot = boxPlotChart;
}
