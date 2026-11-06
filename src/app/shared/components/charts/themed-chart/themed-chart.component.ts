import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { ThemeService } from '../../../../core/services/theme.service';

/** Tek bir grafiğin tanımı: veri + ApexCharts seçenekleri. Tema renkleri otomatik eklenir. */
export interface ChartConfig {
  series: any;
  chart: ApexChart;
  colors?: string[];
  labels?: string[];
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  plotOptions?: ApexPlotOptions;
  dataLabels?: ApexDataLabels;
  stroke?: ApexStroke;
  fill?: ApexFill;
  legend?: ApexLegend;
  markers?: ApexMarkers;
  tooltip?: ApexTooltip;
  grid?: ApexGrid;
}

/** Matlı paleti: logodaki mavi + küpün yeşilleri + destek renkleri. */
export const MATLI_PALETTE = ['#2a7cb6', '#22ad4b', '#8cc63f', '#75b0dc', '#f79009', '#1b5583', '#0f5a32', '#a9cdea'];

const FONT = 'Outfit, sans-serif';

/** Karta göre ayarlanan tema renkleri */
const THEME = {
  light: { text: '#6B7280', grid: '#F3F4F6', surface: '#ffffff', ring: '#E5E7EB', fill: '#F9FAFB' },
  dark: { text: '#94A3B8', grid: '#1E2640', surface: '#171f2e', ring: '#1E2640', fill: '#131a28' },
};

/**
 * ApexCharts sarmalayıcısı: açık/karanlık temaya göre yazı, ızgara,
 * dilim kenarlığı ve radar/polar çizgilerini otomatik ayarlar.
 */
@Component({
  selector: 'app-themed-chart',
  imports: [NgApexchartsModule],
  template: `
    @let c = themed();
    <apx-chart
      [series]="c.series"
      [chart]="c.chart"
      [colors]="c.colors"
      [labels]="c.labels"
      [xaxis]="c.xaxis"
      [yaxis]="c.yaxis"
      [plotOptions]="c.plotOptions"
      [dataLabels]="c.dataLabels"
      [stroke]="c.stroke"
      [fill]="c.fill"
      [legend]="c.legend"
      [markers]="c.markers"
      [tooltip]="c.tooltip"
      [grid]="c.grid"
    ></apx-chart>
  `,
  styles: `:host { display: block; }`,
})
export class ThemedChartComponent {
  readonly config = input.required<ChartConfig>();

  private readonly isDark = toSignal(inject(ThemeService).isDarkMode$, { initialValue: false });

  readonly themed = computed<ChartConfig>(() => {
    const c = this.config();
    const t = this.isDark() ? THEME.dark : THEME.light;
    const type = c.chart.type ?? 'line';
    const sliced = ['pie', 'donut', 'polarArea', 'treemap', 'heatmap'].includes(type);

    const plotOptions: ApexPlotOptions = { ...c.plotOptions };
    if (type === 'radar') {
      plotOptions.radar = {
        ...plotOptions.radar,
        polygons: { strokeColors: t.ring, connectorColors: t.ring, fill: { colors: [t.fill, t.surface] } },
      };
    }
    if (type === 'polarArea') {
      plotOptions.polarArea = {
        ...plotOptions.polarArea,
        rings: { strokeWidth: 1, strokeColor: t.ring },
        spokes: { strokeWidth: 1, connectorColors: t.ring },
      };
    }
    if (type === 'radialBar') {
      plotOptions.radialBar = {
        ...plotOptions.radialBar,
        track: { background: t.ring, ...plotOptions.radialBar?.track },
      };
    }

    return {
      ...c,
      colors: c.colors ?? MATLI_PALETTE,
      chart: {
        fontFamily: FONT,
        background: 'transparent',
        ...c.chart,
        foreColor: t.text,
        toolbar: { show: false, ...c.chart.toolbar },
      },
      plotOptions,
      grid: { strokeDashArray: 0, ...c.grid, borderColor: t.grid },
      stroke: sliced ? { width: 2, ...c.stroke, colors: [t.surface] } : c.stroke,
      legend: { fontFamily: FONT, position: 'bottom', ...c.legend },
      dataLabels: { enabled: false, ...c.dataLabels },
      tooltip: { ...c.tooltip, theme: this.isDark() ? 'dark' : 'light' },
    };
  });
}
