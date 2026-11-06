import { Injectable, signal } from '@angular/core';

export type PopupType = 'success' | 'error' | 'warning' | 'info';

/* ========== Bildirim (toast) ========== */

export interface ToastOptions {
  type?: PopupType;
  title: string;
  message?: string;
  /** ms; 0 = kullanıcı kapatana kadar kalır. Varsayılan 5000 */
  duration?: number;
}

export interface Toast extends Required<Omit<ToastOptions, 'message'>> {
  id: number;
  message?: string;
}

/* ========== Uyarı / onay penceresi ========== */

export interface DialogOptions {
  type?: PopupType;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  /** Onay butonunu kırmızı (tehlikeli işlem) gösterir */
  danger?: boolean;
}

export interface DialogState extends DialogOptions {
  kind: 'alert' | 'confirm';
  resolve: (result: boolean) => void;
}

/* ========== Duyuru / reklam penceresi ========== */

export interface AnnouncementOptions {
  /** Duyurunun kimliği (takip/kayıt için) */
  id: string;
  /**
   * card  : üstte görsel/banner, altta başlık-metin-butonlar
   * split : solda görsel, sağda içerik (geniş ekran)
   * image : sadece görsel (reklam afişi), tıklanınca bağlantıya gider
   */
  variant?: 'card' | 'split' | 'image';
  image?: string;
  badge?: string;
  title?: string;
  message?: string;
  primaryText?: string;
  primaryUrl?: string;
  secondaryText?: string;
}

/**
 * Uygulama geneli pop-up yönetimi:
 *  - toast()/success()/error()/warning()/info() : köşe bildirimleri
 *  - alert()/confirm()                         : ortada uyarı / onay penceresi
 *  - announce()                               : duyuru / reklam penceresi
 */
@Injectable({ providedIn: 'root' })
export class PopupService {
  readonly toasts = signal<Toast[]>([]);
  readonly dialog = signal<DialogState | null>(null);
  readonly announcement = signal<AnnouncementOptions | null>(null);

  private nextId = 1;
  private timers = new Map<number, ReturnType<typeof setTimeout>>();

  /* ---------- Bildirimler ---------- */

  toast(options: ToastOptions): number {
    const toast: Toast = {
      id: this.nextId++,
      type: options.type ?? 'info',
      title: options.title,
      message: options.message,
      duration: options.duration ?? 5000,
    };
    // En fazla 5 bildirim aynı anda
    this.toasts.update((list) => [...list, toast].slice(-5));
    if (toast.duration > 0) {
      this.timers.set(toast.id, setTimeout(() => this.dismissToast(toast.id), toast.duration));
    }
    return toast.id;
  }

  success(title: string, message?: string) {
    return this.toast({ type: 'success', title, message });
  }
  error(title: string, message?: string) {
    return this.toast({ type: 'error', title, message });
  }
  warning(title: string, message?: string) {
    return this.toast({ type: 'warning', title, message });
  }
  info(title: string, message?: string) {
    return this.toast({ type: 'info', title, message });
  }

  dismissToast(id: number): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  /* ---------- Uyarı / onay ---------- */

  /** Tek butonlu bilgilendirme penceresi. Kapanınca çözülür. */
  alert(options: DialogOptions): Promise<void> {
    return new Promise((resolve) => {
      this.closeDialog(false);
      this.dialog.set({ ...options, kind: 'alert', resolve: () => resolve() });
    });
  }

  /** Onay penceresi. Onaylanırsa true, vazgeçilirse false döner. */
  confirm(options: DialogOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.closeDialog(false);
      this.dialog.set({ type: 'warning', ...options, kind: 'confirm', resolve });
    });
  }

  closeDialog(result: boolean): void {
    const current = this.dialog();
    if (!current) return;
    this.dialog.set(null);
    current.resolve(result);
  }

  /* ---------- Duyuru / reklam ---------- */

  announce(options: AnnouncementOptions): void {
    this.announcement.set({ variant: 'card', ...options });
  }

  closeAnnouncement(): void {
    this.announcement.set(null);
  }
}
