# Matlı Otomasyon – Ön Yüz (Front-end)

Matlı Otomasyon Yönetim Paneli'nin Angular ön yüzü. [TailAdmin Angular](https://github.com/TailAdmin/free-angular-tailwind-dashboard) (MIT) şablonu temel alınarak Matlı kurumsal kimliğine (mavi tema, petek deseni, logolar) göre uyarlanmıştır.

> **Durum:** Arayüz hazır, **backend bağlı değil.** Giriş, şifre sıfırlama, OTP, şifre değiştirme ve yapay zeka sohbeti şu an örnek davranışla çalışır (aşağıdaki [Backend entegrasyonu](#backend-entegrasyonu) bölümüne bakın).

## Teknolojiler

- Angular 22 (standalone bileşenler, signals)
- Tailwind CSS v4
- ApexCharts (`ng-apexcharts`), FullCalendar, Flatpickr, Swiper
- Node.js 22 önerilir (`.nvmrc`), Node 24 ile de derleniyor

## Kurulum ve çalıştırma

```bash
npm install
npm start          # http://localhost:4200
npm run build      # üretim derlemesi → dist/
```

## Sayfalar

| Alan | Adres |
|---|---|
| Giriş / Kayıt / Şifremi unuttum / OTP | `/signin`, `/signup`, `/reset-password`, `/otp` |
| Şirket seçimi (giriş sonrası) | `/sirket-secimi` |
| Ayarlar (tema, dil, şifre) | `/ayarlar` |
| Hazırlanıyor sayfası | `/hazirlaniyor` |
| Hata sayfaları | `/error-400`, `401`, `403`, `404`, `500`, `503` (bilinmeyen adresler 404'e düşer) |
| Grafikler | `/line-chart`, `/bar-chart`, `/pie-chart`, `/radial-chart`, `/other-charts` |
| Tablolar | `/basic-tables`, `/advanced-tables` |
| Formlar | `/form-elements` |
| Arayüz elemanları | `/alerts`, `/popups`, `/dropdowns`, `/modals`, `/tabs`, `/accordion`, `/tooltips`, `/progress`, `/pagination`, `/steps`, `/cards`, `/lists`, `/avatars`, `/badge`, `/buttons`, `/images`, `/videos` |

Demo sayfalarındaki veriler nötr örnek verilerdir ("Kayıt 1", "Kategori A" vb.).

## Proje yapısı (önemli klasörler)

```
src/app/
  core/
    i18n/            Dil servisi, `t` pipe'ı, TR/EN sözlük (translations.ts)
    popup/           Bildirim, uyarı/onay ve duyuru pencereleri servisi
    chat/            Yapay zeka sohbet servisi ve backend arayüzü
    services/        Tema, sidebar, şirket seçimi, hava durumu
    data/            Şirket listesi (companies.ts)
  layout/            Header, sidebar, footer, giriş sayfası düzeni
  pages/             Sayfalar
  shared/components/ Ortak bileşenler (grafik, chat, popup, form elemanları...)
public/images/matli/ Grup şirketi logoları
public/videos/       Giriş sayfası tanıtım videosu
```

## Geliştirme notları

### Dil (TR / EN)

Varsayılan dil Türkçe; seçim `localStorage`'da saklanır. Yeni metin eklerken:

```html
{{ 'anahtar' | t }}
```

```ts
inject(LanguageService).t('anahtar')
```

Çeviriler `src/app/core/i18n/translations.ts` içindedir. Sözlükte olmayan anahtar ekranda aynen görünür.

### Tema ve marka renkleri

- Ana renk logodaki mavi `#2A7CB6`; Tailwind `brand-*` tonları `src/styles.css` içinde tanımlı.
- Petek deseni ve tema uyumlu yardımcı sınıflar (`styles.css` sonu):
  `bg-honeycomb`, `bg-honeycomb-white`, `bg-honeycomb-adaptive`, `clip-hex`, `bg-matli-gradient`, `matli-fg`, `matli-fg-muted`, `matli-glass`.
- Ekran boyutuna göre genel ölçek (`html` font-size) yine `styles.css` sonunda; dizüstü ekranlarda arayüz orantılı küçülür.
- **Logoların renkleri değiştirilmemelidir** (filtre, ters çevirme, yeniden renklendirme yok).

### Bildirim / onay / duyuru pencereleri

```ts
const popup = inject(PopupService);
popup.success('Başlık', 'Mesaj');
const ok = await popup.confirm({ title: 'Emin misiniz?', danger: true });
popup.announce({ id: 'duyuru-1', variant: 'card', title: 'Başlık', message: 'Metin' });
```

Örnekler: `/popups` sayfası.

### Grafikler

Yeni grafikler `ThemedChartComponent` ile eklenir; açık/koyu tema renklerini otomatik ayarlar. Örnek tanımlar: `src/app/pages/charts/data/chart-configs.ts`.

## Backend entegrasyonu

Aşağıdaki noktalar `TODO` ile işaretlidir ve API'ye bağlanmalıdır:

| Özellik | Dosya |
|---|---|
| Giriş (sicil no + şifre) | `shared/components/full-width-pages/auth/sign-in/form.component.ts` |
| Şifre sıfırlama | `pages/auth-pages/reset-password/reset-password.component.ts` |
| OTP doğrulama / tekrar gönderme | `pages/auth-pages/otp/otp.component.ts` |
| Şifre değiştirme | `pages/settings/settings.component.ts` |
| Yetkili şirket listesi | `core/data/companies.ts` → `core/services/company.service.ts` |
| Yapay zeka sohbeti | `core/chat/chat.service.ts` – `AI_CHAT_BACKEND` token'ına kendi sınıfınızı verin |

Notlar:

- **Yapay zeka:** API anahtarı tarayıcıya konmamalı; bağlantı backend üzerinden yapılmalıdır.
- **Yetkilendirme:** Henüz rota koruması (guard) yok; giriş yapılmadan panele girilebiliyor.
- **Hava durumu:** Konum tarayıcıdan alınır; veri [Open-Meteo](https://open-meteo.com), şehir adı [BigDataCloud](https://www.bigdatacloud.com) üzerinden gelir (anahtarsız). İstenirse `core/services/weather.service.ts` backend'e yönlendirilebilir.
- **Giriş akışı:** Şu an giriş → şirket seçimi. OTP sayfası hazır ama akışa bağlı değil.

## Lisans

Temel şablon TailAdmin, MIT lisanslıdır (`LICENSE.md`).
