import { Injectable, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../i18n/language.service';

/** Hava durumu ikonu türleri (WMO kodlarından türetilir) */
export type WeatherIcon =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunder';

export interface DailyForecast {
  date: string;
  min: number;
  max: number;
  icon: WeatherIcon;
  code: number;
}

export interface WeatherData {
  city: string | null;
  region: string | null;
  temperature: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  code: number;
  icon: WeatherIcon;
  isDay: boolean;
  daily: DailyForecast[];
  updatedAt: number;
}

export type WeatherStatus = 'idle' | 'loading' | 'ready' | 'denied' | 'unsupported' | 'error';

const CACHE_KEY = 'weatherCache';
const CACHE_MS = 30 * 60 * 1000; // 30 dk
const REFRESH_MS = 30 * 60 * 1000;

/** WMO hava kodu → ikon */
export function iconForCode(code: number): WeatherIcon {
  if (code === 0) return 'clear';
  if (code <= 2) return 'partly-cloudy';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'thunder';
  return 'cloudy';
}

/**
 * Tarayıcı konumuna göre güncel hava durumu.
 * - Konum: navigator.geolocation (kullanıcı izni gerekir)
 * - Hava: Open-Meteo (anahtarsız, ücretsiz)
 * - Şehir adı: BigDataCloud reverse-geocode-client (anahtarsız, ücretsiz)
 * Sonuç 30 dk önbelleğe alınır ve 30 dk'da bir yenilenir.
 */
@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly language = inject(LanguageService);

  readonly status = signal<WeatherStatus>('idle');
  readonly data = signal<WeatherData | null>(this.readCache());
  readonly ready = computed(() => this.data() !== null);

  private timer?: ReturnType<typeof setInterval>;

  /** Header açılınca bir kez çağrılır. */
  init(): void {
    if (this.timer) return;
    const cached = this.data();
    if (cached && Date.now() - cached.updatedAt < CACHE_MS) {
      this.status.set('ready');
    } else {
      this.refresh();
    }
    this.timer = setInterval(() => this.refresh(), REFRESH_MS);
  }

  async refresh(): Promise<void> {
    if (!('geolocation' in navigator)) {
      this.status.set('unsupported');
      return;
    }
    this.status.set('loading');
    try {
      const pos = await this.getPosition();
      const { latitude, longitude } = pos.coords;
      const [weather, place] = await Promise.all([
        this.fetchWeather(latitude, longitude),
        this.fetchPlace(latitude, longitude).catch(() => ({ city: null, region: null })),
      ]);
      const data: WeatherData = { ...weather, ...place, updatedAt: Date.now() };
      this.data.set(data);
      this.writeCache(data);
      this.status.set('ready');
    } catch (err: any) {
      // GeolocationPositionError.PERMISSION_DENIED = 1
      this.status.set(err?.code === 1 ? 'denied' : 'error');
    }
  }

  private getPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: CACHE_MS,
      }),
    );
  }

  private async fetchWeather(lat: number, lon: number): Promise<Omit<WeatherData, 'city' | 'region' | 'updatedAt'>> {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day` +
      `&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=4`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('weather ' + res.status);
    const j = await res.json();
    const c = j.current;
    return {
      temperature: Math.round(c.temperature_2m),
      feelsLike: Math.round(c.apparent_temperature),
      humidity: Math.round(c.relative_humidity_2m),
      wind: Math.round(c.wind_speed_10m),
      code: c.weather_code,
      icon: iconForCode(c.weather_code),
      isDay: c.is_day === 1,
      daily: (j.daily.time as string[]).map((date, i) => ({
        date,
        min: Math.round(j.daily.temperature_2m_min[i]),
        max: Math.round(j.daily.temperature_2m_max[i]),
        code: j.daily.weather_code[i],
        icon: iconForCode(j.daily.weather_code[i]),
      })),
    };
  }

  private async fetchPlace(lat: number, lon: number): Promise<{ city: string | null; region: string | null }> {
    const lang = this.language.lang();
    const url =
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat.toFixed(4)}` +
      `&longitude=${lon.toFixed(4)}&localityLanguage=${lang}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('place ' + res.status);
    const j = await res.json();
    return {
      city: j.city || j.locality || null,
      region: j.principalSubdivision || null,
    };
  }

  private readCache(): WeatherData | null {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      return raw ? (JSON.parse(raw) as WeatherData) : null;
    } catch {
      return null;
    }
  }

  private writeCache(data: WeatherData): void {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
      /* yoksay */
    }
  }
}
