import { Injectable, InjectionToken, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../i18n/language.service';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  /** Yanıt alınamadıysa true (tekrar denenebilir) */
  error?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

/**
 * Yapay zeka bağlantısı. Gerçek entegrasyon backend üzerinden yapılmalı
 * (API anahtarı tarayıcıya konmamalı). Bağlamak için bu token'a kendi
 * sınıfınızı verin, örn. app.config.ts:
 *   { provide: AI_CHAT_BACKEND, useClass: HttpAiChatBackend }
 */
export interface AiChatBackend {
  /** Konuşma geçmişini alır, asistanın cevabını döndürür. */
  reply(history: ChatMessage[]): Promise<string>;
}

export const AI_CHAT_BACKEND = new InjectionToken<AiChatBackend>('AI_CHAT_BACKEND', {
  providedIn: 'root',
  factory: () => new NotConfiguredBackend(inject(LanguageService)),
});

/** Varsayılan: henüz AI bağlı değil bilgisini döner. */
class NotConfiguredBackend implements AiChatBackend {
  constructor(private language: LanguageService) {}
  async reply(): Promise<string> {
    await new Promise((r) => setTimeout(r, 700));
    return this.language.t('chat.notConfigured');
  }
}

const STORAGE_KEY = 'chatConversations';
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

/** Sohbetleri tutar (tarayıcıda saklanır) ve mesaj gönderir. */
@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly backend = inject(AI_CHAT_BACKEND);

  readonly conversations = signal<Conversation[]>(this.read());
  readonly activeId = signal<string | null>(this.conversations()[0]?.id ?? null);
  readonly sending = signal(false);

  /** Başka bir yerden (ör. sidebar) sohbet panelini açma isteği; her istekte artar. */
  readonly openRequest = signal(0);
  requestOpen(): void {
    this.openRequest.update((n) => n + 1);
  }

  readonly active = computed(() => this.conversations().find((c) => c.id === this.activeId()) ?? null);
  readonly sorted = computed(() => [...this.conversations()].sort((a, b) => b.updatedAt - a.updatedAt));

  newConversation(): void {
    // Zaten boş bir sohbet açıksa yenisini oluşturma
    const current = this.active();
    if (current && current.messages.length === 0) return;
    const conv: Conversation = { id: uid(), title: '', messages: [], updatedAt: Date.now() };
    this.conversations.update((list) => [conv, ...list]);
    this.activeId.set(conv.id);
    this.save();
  }

  select(id: string): void {
    this.activeId.set(id);
  }

  delete(id: string): void {
    this.conversations.update((list) => list.filter((c) => c.id !== id));
    if (this.activeId() === id) this.activeId.set(this.sorted()[0]?.id ?? null);
    this.save();
  }

  async send(text: string): Promise<void> {
    const content = text.trim();
    if (!content || this.sending()) return;
    if (!this.active()) this.newConversation();
    const convId = this.activeId()!;

    this.push(convId, { id: uid(), role: 'user', content, createdAt: Date.now() });
    await this.requestReply(convId);
  }

  /** Hatalı son cevabı silip yeniden ister. */
  async retry(): Promise<void> {
    const conv = this.active();
    if (!conv || this.sending()) return;
    const last = conv.messages[conv.messages.length - 1];
    if (last?.error) this.patch(conv.id, (c) => ({ ...c, messages: c.messages.slice(0, -1) }));
    await this.requestReply(conv.id);
  }

  private async requestReply(convId: string): Promise<void> {
    this.sending.set(true);
    try {
      const history = this.conversations().find((c) => c.id === convId)?.messages ?? [];
      const answer = await this.backend.reply(history);
      this.push(convId, { id: uid(), role: 'assistant', content: answer, createdAt: Date.now() });
    } catch {
      this.push(convId, { id: uid(), role: 'assistant', content: '', createdAt: Date.now(), error: true });
    } finally {
      this.sending.set(false);
    }
  }

  private push(convId: string, msg: ChatMessage): void {
    this.patch(convId, (c) => ({
      ...c,
      // Başlık: ilk kullanıcı mesajının başı
      title: c.title || (msg.role === 'user' ? msg.content.slice(0, 48) : c.title),
      messages: [...c.messages, msg],
      updatedAt: Date.now(),
    }));
  }

  private patch(convId: string, fn: (c: Conversation) => Conversation): void {
    this.conversations.update((list) => list.map((c) => (c.id === convId ? fn(c) : c)));
    this.save();
  }

  private read(): Conversation[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.conversations()));
    } catch {
      /* yoksay */
    }
  }
}
