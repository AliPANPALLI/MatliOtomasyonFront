/* Arayüz elemanı örnek sayfalarında kullanılan ortak sınıflar (TailAdmin görünümüyle uyumlu). */

export const UI = {
  btn: 'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium shadow-theme-xs transition-colors',
  primary: 'bg-brand-500 text-white hover:bg-brand-600',
  outline:
    'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5',
  /** Açılır menü paneli */
  menu: 'absolute z-40 mt-2 min-w-52 rounded-xl border border-gray-200 bg-white p-1.5 shadow-theme-lg animate-in fade-in zoom-in-95 duration-100 dark:border-gray-800 dark:bg-[#1E2635]',
  menuItem:
    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-start text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white',
  menuLabel: 'px-3 pt-2 pb-1 text-xs font-medium tracking-wide text-gray-400 uppercase',
  divider: 'my-1.5 h-px bg-gray-100 dark:bg-gray-800',
  text: 'text-sm text-gray-500 dark:text-gray-400',
  heading: 'text-sm font-semibold text-gray-800 dark:text-white/90',
  box: 'rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]',
};

/** Basit SVG ikon yolları (stroke) */
export const ICON = {
  chevronDown: 'M6 9l6 6 6-6',
  check: 'M20 6L9 17l-5-5',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z',
  copy: 'M9 9h10v10H9zM5 15V5h10',
  share: 'M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v14',
  trash: 'M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4h6v3',
  user: 'M20 21v-1a5 5 0 00-5-5H9a5 5 0 00-5 5v1M12 11a4 4 0 100-8 4 4 0 000 8z',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z',
  logout: 'M4 12h7.75M8 8l-4 4 4 4M9.75 5V4.25a1.5 1.5 0 011.5-1.5h6a1.5 1.5 0 011.5 1.5v15.5a1.5 1.5 0 01-1.5 1.5h-6a1.5 1.5 0 01-1.5-1.5V19',
  dots: 'M12 6h.01M12 12h.01M12 18h.01',
  info: 'M12 11v5.5M12 7.8h.01M21.25 12a9.25 9.25 0 11-18.5 0 9.25 9.25 0 0118.5 0z',
  star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z',
  x: 'M18 6L6 18M6 6l12 12',
  plus: 'M12 5v14M5 12h14',
  file: 'M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8zM14 3v5h5',
  folder: 'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  bell: 'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0',
};
