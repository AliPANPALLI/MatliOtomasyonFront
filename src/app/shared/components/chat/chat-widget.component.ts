import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ChatService } from '../../../core/chat/chat.service';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

type Mode = 'closed' | 'panel' | 'full';

/** Sağ alttaki sohbet butonu + yapay zeka sohbet paneli / tam ekran mesajlaşma görünümü */
@Component({
  selector: 'app-chat-widget',
  imports: [TranslatePipe],
  templateUrl: './chat-widget.component.html',
  styles: `
    @keyframes dot { 0%, 80%, 100% { opacity: .25; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
    .typing-dot { animation: dot 1.2s infinite ease-in-out; }
  `,
})
export class ChatWidgetComponent implements OnInit, OnDestroy {
  readonly chat = inject(ChatService);
  private readonly language = inject(LanguageService);

  readonly mode = signal<Mode>('closed');
  readonly draft = signal('');
  /** Tam ekranda mobilde sohbet listesi açık mı */
  readonly listOpen = signal(false);

  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  private readonly input = viewChild<ElementRef<HTMLTextAreaElement>>('input');

  constructor() {
    // Yeni mesaj / sohbet değişince en alta kaydır
    effect(() => {
      this.chat.active()?.messages.length;
      this.chat.sending();
      this.mode();
      queueMicrotask(() => {
        const el = this.scroller()?.nativeElement;
        if (el) el.scrollTop = el.scrollHeight;
      });
    });
    // Dışarıdan açma isteği (sidebar kartındaki "Asistana sor")
    effect(() => {
      if (this.chat.openRequest() > 0) untracked(() => this.open());
    });
    // Tam ekranda arka sayfa kaymasın
    effect(() => {
      document.body.style.overflow = this.mode() === 'full' ? 'hidden' : '';
    });
  }

  ngOnInit(): void {
    // "Yukarı çık" butonunun chat butonunun üstüne kayması için
    document.body.classList.add('has-chat');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('has-chat');
    document.body.style.overflow = '';
  }

  open(): void {
    this.mode.set('panel');
    this.focusInput();
  }

  close(): void {
    this.mode.set('closed');
    this.listOpen.set(false);
  }

  toggleFull(): void {
    this.mode.update((m) => (m === 'full' ? 'panel' : 'full'));
    this.listOpen.set(false);
    this.focusInput();
  }

  newChat(): void {
    this.chat.newConversation();
    this.listOpen.set(false);
    this.focusInput();
  }

  selectChat(id: string): void {
    this.chat.select(id);
    this.listOpen.set(false);
  }

  async send(): Promise<void> {
    const text = this.draft();
    if (!text.trim()) return;
    this.draft.set('');
    this.resize();
    await this.chat.send(text);
    this.focusInput();
  }

  onKeydown(e: KeyboardEvent): void {
    // Enter: gönder, Shift+Enter: yeni satır
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      this.send();
    }
  }

  onInput(e: Event): void {
    this.draft.set((e.target as HTMLTextAreaElement).value);
    this.resize();
  }

  time(ts: number): string {
    const locale = this.language.lang() === 'tr' ? 'tr-TR' : 'en-US';
    return new Date(ts).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }

  date(ts: number): string {
    const locale = this.language.lang() === 'tr' ? 'tr-TR' : 'en-US';
    return new Date(ts).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  }

  /** Mesaj kutusunu içeriğe göre büyüt (en fazla ~6 satır) */
  private resize(): void {
    const el = this.input()?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }

  private focusInput(): void {
    setTimeout(() => this.input()?.nativeElement.focus(), 50);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.mode() === 'full') this.mode.set('panel');
    else if (this.mode() === 'panel') this.close();
  }
}
