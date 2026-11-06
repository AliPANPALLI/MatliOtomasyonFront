import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { AdvancedTablesComponent } from './pages/tables/advanced-tables/advanced-tables.component';
import { BlankComponent } from './pages/blank/blank.component';
import { ComingSoonComponent } from './pages/other-page/coming-soon/coming-soon.component';
import { ErrorPageComponent } from './pages/other-page/error-page/error-page.component';
import { AppLayoutComponent } from './layout/shell/app-layout/app-layout.component';
import { InvoiceComponent } from './pages/ecommerce/invoice/invoice.component';
import { LineChartComponent } from './pages/charts/line-chart/line-chart.component';
import { BarChartComponent } from './pages/charts/bar-chart/bar-chart.component';
import { PieChartComponent } from './pages/charts/pie-chart/pie-chart.component';
import { RadialChartComponent } from './pages/charts/radial-chart/radial-chart.component';
import { OtherChartsComponent } from './pages/charts/other-charts/other-charts.component';
import { AlertsComponent } from './pages/ui-elements/alerts/alerts.component';
import { PopupsComponent } from './pages/ui-elements/popups/popups.component';
import { DropdownsComponent } from './pages/ui-elements/dropdowns/dropdowns.component';
import { ModalsComponent } from './pages/ui-elements/modals/modals.component';
import { TabsPageComponent, AccordionPageComponent } from './pages/ui-elements/tabs-accordion/tabs-accordion.component';
import { TooltipsPageComponent, ProgressPageComponent } from './pages/ui-elements/feedback/feedback.component';
import { PaginationPageComponent, StepsPageComponent } from './pages/ui-elements/navigation/navigation.component';
import { CardsPageComponent, ListsPageComponent } from './pages/ui-elements/content/content.component';
import { OtpComponent } from './pages/auth-pages/otp/otp.component';
import { AvatarElementComponent } from './pages/ui-elements/avatars/avatars.component';
import { BadgesComponent } from './pages/ui-elements/badge/badge.component';
import { ButtonsComponent } from './pages/ui-elements/buttons/buttons.component';
import { ImagesComponent } from './pages/ui-elements/images/images.component';
import { VideosComponent } from './pages/ui-elements/videos/videos.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { CompanySelectComponent } from './pages/company-select/company-select.component';
import { ResetPasswordComponent } from './pages/auth-pages/reset-password/reset-password.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
  {
    path:'',
    component:AppLayoutComponent,
    children:[
      {
        path: '',
        component: EcommerceComponent,
        pathMatch: 'full',
        title:
          'Ana Sayfa | Matlı Otomasyon',
      },
      {
        path:'calendar',
        component:CalendarComponent,
        title:'Takvim | Matlı Otomasyon'
      },
      {
        path:'profile',
        component:ProfileComponent,
        title:'Profile | Matlı Otomasyon'
      },
      {
        path:'form-elements',
        component:FormElementsComponent,
        title:'Form Elements | Matlı Otomasyon'
      },
      {
        path:'basic-tables',
        component:BasicTablesComponent,
        title:'Basic Tables | Matlı Otomasyon'
      },
      {
        path:'advanced-tables',
        component:AdvancedTablesComponent,
        title:'Gelişmiş Tablolar | Matlı Otomasyon'
      },
      {
        path:'blank',
        component:BlankComponent,
        title:'Blank | Matlı Otomasyon'
      },
      {
        path:'ayarlar',
        component:SettingsComponent,
        title:'Ayarlar | Matlı Otomasyon'
      },
      {
        path:'hazirlaniyor',
        component:ComingSoonComponent,
        title:'Hazırlanıyor | Matlı Otomasyon'
      },
      // support tickets
      {
        path:'invoice',
        component:InvoiceComponent,
        title:'Invoice Details | Matlı Otomasyon'
      },
      {
        path:'line-chart',
        component:LineChartComponent,
        title:'Line Chart | Matlı Otomasyon'
      },
      {
        path:'bar-chart',
        component:BarChartComponent,
        title:'Bar Chart | Matlı Otomasyon'
      },
      {
        path:'pie-chart',
        component:PieChartComponent,
        title:'Pasta Grafikler | Matlı Otomasyon'
      },
      {
        path:'radial-chart',
        component:RadialChartComponent,
        title:'Radyal & Radar | Matlı Otomasyon'
      },
      {
        path:'other-charts',
        component:OtherChartsComponent,
        title:'Diğer Grafikler | Matlı Otomasyon'
      },
      {
        path:'alerts',
        component:AlertsComponent,
        title:'Alerts | Matlı Otomasyon'
      },
      { path:'dropdowns', component:DropdownsComponent, title:'Dropdown | Matlı Otomasyon' },
      { path:'modals', component:ModalsComponent, title:'Modal | Matlı Otomasyon' },
      { path:'tabs', component:TabsPageComponent, title:'Sekmeler | Matlı Otomasyon' },
      { path:'accordion', component:AccordionPageComponent, title:'Akordeon | Matlı Otomasyon' },
      { path:'tooltips', component:TooltipsPageComponent, title:'Tooltip & Popover | Matlı Otomasyon' },
      { path:'progress', component:ProgressPageComponent, title:'İlerleme & Yükleniyor | Matlı Otomasyon' },
      { path:'pagination', component:PaginationPageComponent, title:'Sayfalama | Matlı Otomasyon' },
      { path:'steps', component:StepsPageComponent, title:'Adımlar & Zaman Çizelgesi | Matlı Otomasyon' },
      { path:'cards', component:CardsPageComponent, title:'Kartlar | Matlı Otomasyon' },
      { path:'lists', component:ListsPageComponent, title:'Liste & Etiketler | Matlı Otomasyon' },
      {
        path:'popups',
        component:PopupsComponent,
        title:'Pop-up & Bildirimler | Matlı Otomasyon'
      },
      {
        path:'avatars',
        component:AvatarElementComponent,
        title:'Avatars | Matlı Otomasyon'
      },
      {
        path:'badge',
        component:BadgesComponent,
        title:'Badges | Matlı Otomasyon'
      },
      {
        path:'buttons',
        component:ButtonsComponent,
        title:'Buttons | Matlı Otomasyon'
      },
      {
        path:'images',
        component:ImagesComponent,
        title:'Images | Matlı Otomasyon'
      },
      {
        path:'videos',
        component:VideosComponent,
        title:'Videos | Matlı Otomasyon'
      },
    ]
  },
  // auth pages
  {
    path:'signin',
    component:SignInComponent,
    title:'Sign In | Matlı Otomasyon'
  },
  {
    path:'signup',
    component:SignUpComponent,
    title:'Sign Up | Matlı Otomasyon'
  },
  { path:'otp', component:OtpComponent, title:'Doğrulama Kodu | Matlı Otomasyon' },
  {
    path:'reset-password',
    component:ResetPasswordComponent,
    title:'Şifremi Unuttum | Matlı Otomasyon'
  },
  // giriş sonrası şirket seçimi
  {
    path:'sirket-secimi',
    component:CompanySelectComponent,
    title:'Şirket Seçimi | Matlı Otomasyon'
  },
  // hata sayfaları
  { path:'error-400', component:ErrorPageComponent, data:{ code:400 }, title:'400 | Matlı Otomasyon' },
  { path:'error-401', component:ErrorPageComponent, data:{ code:401 }, title:'401 | Matlı Otomasyon' },
  { path:'error-403', component:ErrorPageComponent, data:{ code:403 }, title:'403 | Matlı Otomasyon' },
  { path:'error-404', component:ErrorPageComponent, data:{ code:404 }, title:'404 | Matlı Otomasyon' },
  { path:'error-500', component:ErrorPageComponent, data:{ code:500 }, title:'500 | Matlı Otomasyon' },
  { path:'error-503', component:ErrorPageComponent, data:{ code:503 }, title:'503 | Matlı Otomasyon' },
  // bilinmeyen adresler
  { path:'**', component:ErrorPageComponent, data:{ code:404 }, title:'404 | Matlı Otomasyon' },
];
