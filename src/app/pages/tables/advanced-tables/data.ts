/* Gelişmiş tablolar için nötr örnek veri. Gerçek veri bağlanınca değiştirilecek. */

export type RecordStatus = 'active' | 'pending' | 'passive';

export interface SampleRecord {
  id: number;
  code: string;
  name: string;
  category: string;
  owner: string;
  status: RecordStatus;
  date: string; // ISO
  quantity: number;
  amount: number;
}

const CATEGORIES = ['Kategori A', 'Kategori B', 'Kategori C', 'Kategori D', 'Kategori E'];
const STATUSES: RecordStatus[] = ['active', 'pending', 'passive'];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seeded(11);

export const SAMPLE_RECORDS: SampleRecord[] = Array.from({ length: 57 }, (_, i) => {
  const n = i + 1;
  const day = new Date(2026, 0, 1 + Math.floor(rand() * 300));
  return {
    id: n,
    code: 'KYT-' + String(1000 + n),
    name: 'Kayıt ' + n,
    category: CATEGORIES[Math.floor(rand() * CATEGORIES.length)],
    owner: 'Kullanıcı ' + (1 + Math.floor(rand() * 12)),
    status: STATUSES[Math.floor(rand() * STATUSES.length)],
    date: day.toISOString().slice(0, 10),
    quantity: 1 + Math.floor(rand() * 250),
    amount: Math.round(500 + rand() * 49500),
  };
});

/** Durum rozetinin renkleri (TailAdmin rozet stilleri) */
export const STATUS_CLASS: Record<RecordStatus, string> = {
  active: 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500',
  pending: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-orange-400',
  passive: 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-400',
};

/** Ortak tablo sınıfları – mevcut temel tablolarla aynı görünüm */
export const T = {
  wrap: 'overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/[0.03]',
  th: 'px-5 py-3 text-start text-xs font-medium text-gray-500 whitespace-nowrap dark:text-gray-400',
  td: 'px-5 py-3.5 text-sm text-gray-700 whitespace-nowrap dark:text-gray-300',
  tdStrong: 'px-5 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap dark:text-white/90',
  badge: 'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
  checkbox:
    'size-4 cursor-pointer rounded border-gray-300 accent-brand-500 dark:border-gray-700',
  input:
    'h-10 rounded-[10px] border border-gray-300 bg-white px-3.5 text-sm text-gray-800 shadow-theme-xs outline-hidden placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90',
  btn:
    'inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5',
};

export const fmtMoney = (v: number, lang: string) =>
  v.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });

export const fmtDate = (iso: string, lang: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
