import { ChartConfig } from '../../../shared/components/charts/themed-chart/themed-chart.component';

/*
 * Grafik sayfaları için nötr örnek (demo) veriler.
 * Gerçek veriler bağlandığında bu dosyadaki diziler değiştirilecek.
 */

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const CATEGORIES = ['Kategori A', 'Kategori B', 'Kategori C', 'Kategori D', 'Kategori E'];

/** Tekrarlanabilir sözde-rastgele sayı (her açılışta aynı demo veri). */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/* ======================= PASTA & HALKA ======================= */

export const donutChart: ChartConfig = {
  chart: { type: 'donut', height: 340 },
  series: [38, 24, 18, 12, 8],
  labels: CATEGORIES,
  plotOptions: {
    pie: {
      donut: {
        size: '68%',
        labels: {
          show: true,
          name: { fontSize: '14px' },
          value: { fontSize: '26px', fontWeight: 600 },
          total: { show: true, label: 'Toplam' },
        },
      },
    },
  },
};

export const pieChart: ChartConfig = {
  chart: { type: 'pie', height: 340 },
  series: [42, 31, 25, 18, 12],
  labels: CATEGORIES,
  dataLabels: { enabled: true, style: { fontSize: '12px', fontWeight: 500 }, dropShadow: { enabled: false } },
};

export const polarAreaChart: ChartConfig = {
  chart: { type: 'polarArea', height: 340 },
  series: [86, 72, 64, 91, 58, 77],
  labels: ['Kategori A', 'Kategori B', 'Kategori C', 'Kategori D', 'Kategori E', 'Kategori F'],
  fill: { opacity: 0.85 },
  yaxis: { show: false },
};

export const semiDonutChart: ChartConfig = {
  chart: { type: 'donut', height: 300 },
  series: [44, 26, 18, 12],
  labels: ['Kategori A', 'Kategori B', 'Kategori C', 'Kategori D'],
  plotOptions: { pie: { startAngle: -90, endAngle: 90, offsetY: 10, donut: { size: '62%' } } },
  grid: { padding: { bottom: -110 } },
};

/* ======================= RADYAL & RADAR ======================= */

export const radialMultiChart: ChartConfig = {
  chart: { type: 'radialBar', height: 360 },
  series: [82, 67, 91, 58],
  labels: ['Seri 1', 'Seri 2', 'Seri 3', 'Seri 4'],
  plotOptions: {
    radialBar: {
      hollow: { size: '32%' },
      dataLabels: {
        name: { fontSize: '14px' },
        value: { fontSize: '22px', fontWeight: 600, formatter: (v: number) => `%${v}` },
        total: { show: true, label: 'Ortalama', formatter: () => '%75' },
      },
    },
  },
  stroke: { lineCap: 'round' },
  legend: { show: true },
};

export const gaugeChart: ChartConfig = {
  chart: { type: 'radialBar', height: 340 },
  series: [76],
  labels: ['Oran'],
  colors: ['#2a7cb6'],
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      hollow: { size: '68%' },
      dataLabels: {
        name: { offsetY: 28, fontSize: '14px' },
        value: { offsetY: -12, fontSize: '36px', fontWeight: 600, formatter: (v: number) => `%${v}` },
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: { shade: 'light', type: 'horizontal', gradientToColors: ['#22ad4b'], stops: [0, 100] },
  },
  stroke: { lineCap: 'round' },
};

export const radarCompareChart: ChartConfig = {
  chart: { type: 'radar', height: 360 },
  series: [
    { name: 'Seri 1', data: [88, 72, 90, 76, 64] },
    { name: 'Seri 2', data: [70, 90, 68, 84, 82] },
  ],
  xaxis: { categories: CATEGORIES },
  yaxis: { show: false, max: 100 },
  fill: { opacity: 0.2 },
  stroke: { width: 2 },
  markers: { size: 4 },
  legend: { show: true },
};

export const radarSingleChart: ChartConfig = {
  chart: { type: 'radar', height: 360 },
  series: [{ name: 'Seri 1', data: [42, 56, 49, 71, 65, 38, 54] }],
  xaxis: { categories: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'] },
  yaxis: { show: false },
  colors: ['#22ad4b'],
  fill: { opacity: 0.35 },
  stroke: { width: 2 },
  markers: { size: 4 },
};

/* ======================= DİĞER GRAFİKLER ======================= */

export const mixedChart: ChartConfig = {
  chart: { type: 'line', height: 350 },
  series: [
    { name: 'Seri 1', type: 'column', data: [320, 345, 390, 410, 435, 420, 398, 442, 461, 480, 465, 492] },
    { name: 'Seri 2', type: 'line', data: [78, 80, 82, 81, 84, 83, 80, 85, 86, 88, 87, 89] },
  ],
  xaxis: { categories: MONTHS },
  yaxis: [{}, { opposite: true, min: 60, max: 100 }],
  stroke: { width: [0, 3], curve: 'smooth' },
  plotOptions: { bar: { columnWidth: '45%', borderRadius: 5, borderRadiusApplication: 'end' } },
  markers: { size: 4 },
  legend: { show: true, position: 'top', horizontalAlign: 'left' },
};

export const stackedAreaChart: ChartConfig = {
  chart: { type: 'area', height: 350, stacked: true },
  series: [
    { name: 'Seri 1', data: [42, 45, 48, 51, 49, 53, 56, 58, 55, 60, 63, 66] },
    { name: 'Seri 2', data: [18, 20, 19, 22, 24, 23, 25, 27, 26, 28, 29, 31] },
    { name: 'Seri 3', data: [12, 13, 15, 14, 16, 18, 19, 18, 20, 21, 22, 24] },
  ],
  xaxis: { categories: MONTHS },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.5, opacityTo: 0.05 } },
  legend: { show: true, position: 'top', horizontalAlign: 'left' },
};

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const HOURS = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
const heatRand = seeded(7);
export const heatmapChart: ChartConfig = {
  chart: { type: 'heatmap', height: 350 },
  series: DAYS.slice()
    .reverse()
    .map((day) => ({
      name: day,
      data: HOURS.map((h) => ({ x: `${h}:00`, y: Math.round(5 + heatRand() * 50) })),
    })),
  colors: ['#2a7cb6'],
  plotOptions: { heatmap: { radius: 4, shadeIntensity: 0.6 } },
};

const scatterRand = seeded(21);
export const scatterChart: ChartConfig = {
  chart: { type: 'scatter', height: 350, zoom: { enabled: false } },
  series: [
    { name: 'Seri 1', data: Array.from({ length: 18 }, () => [+(10 + scatterRand() * 40).toFixed(1), Math.round(20 + scatterRand() * 60)]) },
    { name: 'Seri 2', data: Array.from({ length: 18 }, () => [+(30 + scatterRand() * 40).toFixed(1), Math.round(40 + scatterRand() * 60)]) },
  ],
  xaxis: { type: 'numeric', tickAmount: 8, labels: { formatter: (v: string) => (+v).toFixed(0) } },
  markers: { size: 6 },
  legend: { show: true, position: 'top', horizontalAlign: 'left' },
};

export const bubbleChart: ChartConfig = {
  chart: { type: 'bubble', height: 350 },
  series: [
    { name: 'Seri 1', data: [[12, 68, 42], [18, 74, 30], [25, 61, 55]] },
    { name: 'Seri 2', data: [[8, 52, 28], [15, 47, 38], [30, 58, 22]] },
    { name: 'Seri 3', data: [[10, 35, 18], [22, 40, 26], [28, 31, 14]] },
  ],
  xaxis: { type: 'numeric', min: 0, max: 36, tickAmount: 6 },
  yaxis: { min: 20, max: 85 },
  fill: { opacity: 0.75 },
  legend: { show: true, position: 'top', horizontalAlign: 'left' },
};

export const treemapChart: ChartConfig = {
  chart: { type: 'treemap', height: 350 },
  series: [
    {
      data: [
        { x: 'A', y: 218 },
        { x: 'B', y: 149 },
        { x: 'C', y: 96 },
        { x: 'D', y: 74 },
        { x: 'E', y: 61 },
        { x: 'F', y: 48 },
        { x: 'G', y: 42 },
        { x: 'H', y: 31 },
        { x: 'I', y: 19 },
        { x: 'J', y: 12 },
      ],
    },
  ],
  plotOptions: { treemap: { distributed: true, enableShades: false } },
  dataLabels: { enabled: true, style: { fontSize: '13px', fontWeight: 500 }, offsetY: -3 },
  legend: { show: false },
};

const d = (s: string) => new Date(s).getTime();
export const timelineChart: ChartConfig = {
  chart: { type: 'rangeBar', height: 350 },
  series: [
    {
      data: [
        { x: 'Görev 1', y: [d('2026-01-05'), d('2026-01-24')] },
        { x: 'Görev 2', y: [d('2026-01-20'), d('2026-02-14')] },
        { x: 'Görev 3', y: [d('2026-02-10'), d('2026-04-18')] },
        { x: 'Görev 4', y: [d('2026-04-06'), d('2026-05-02')] },
        { x: 'Görev 5', y: [d('2026-04-27'), d('2026-05-23')] },
        { x: 'Görev 6', y: [d('2026-05-25'), d('2026-06-06')] },
      ],
    },
  ],
  plotOptions: { bar: { horizontal: true, distributed: true, borderRadius: 6, barHeight: '55%' } },
  xaxis: { type: 'datetime', labels: { datetimeUTC: false } },
  legend: { show: false },
};

const candleRand = seeded(42);
let last = 100;
export const candlestickChart: ChartConfig = {
  chart: { type: 'candlestick', height: 350 },
  series: [
    {
      name: 'Seri 1',
      data: Array.from({ length: 30 }, (_, i) => {
        const open = last;
        const close = +(open + (candleRand() - 0.47) * 5).toFixed(2);
        const high = +(Math.max(open, close) + candleRand() * 2.5).toFixed(2);
        const low = +(Math.min(open, close) - candleRand() * 2.5).toFixed(2);
        last = close;
        return { x: new Date(2026, 9, i + 1).getTime(), y: [open, high, low, close] };
      }),
    },
  ],
  xaxis: { type: 'datetime', labels: { datetimeUTC: false } },
  yaxis: { tooltip: { enabled: true }, labels: { formatter: (v: number) => v.toFixed(0) } },
  plotOptions: { candlestick: { colors: { upward: '#22ad4b', downward: '#f04438' } } },
};

export const funnelChart: ChartConfig = {
  chart: { type: 'bar', height: 350 },
  series: [{ name: 'Değer', data: [1380, 1100, 860, 610, 420, 290] }],
  xaxis: { categories: ['Aşama 1', 'Aşama 2', 'Aşama 3', 'Aşama 4', 'Aşama 5', 'Aşama 6'] },
  plotOptions: { bar: { horizontal: true, isFunnel: true, distributed: true, borderRadius: 0, barHeight: '80%' } },
  dataLabels: {
    enabled: true,
    formatter: (val: number, opt: any) => `${opt.w.globals.labels[opt.dataPointIndex]}: ${val}`,
    style: { fontSize: '12px', fontWeight: 500 },
    dropShadow: { enabled: false },
  },
  legend: { show: false },
};

export const boxPlotChart: ChartConfig = {
  chart: { type: 'boxPlot', height: 350 },
  series: [
    {
      name: 'Seri 1',
      type: 'boxPlot',
      data: [
        { x: 'A', y: [10, 20, 25, 30, 50] },
        { x: 'B', y: [15, 20, 30, 35, 60] },
        { x: 'C', y: [20, 30, 35, 45, 70] },
        { x: 'D', y: [20, 25, 35, 40, 65] },
        { x: 'E', y: [25, 35, 40, 50, 80] },
        { x: 'F', y: [30, 40, 50, 60, 90] },
      ],
    },
  ],
  plotOptions: { boxPlot: { colors: { upper: '#2a7cb6', lower: '#a9cdea' } }, bar: { columnWidth: '45%' } },
  stroke: { colors: ['#6B7280'] },
};
