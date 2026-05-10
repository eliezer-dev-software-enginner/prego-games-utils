// src/telegram/Notifier.ts
import type { Post } from '../Post';
import { TelegramSender, type TelegramSenderConfig } from './TelegramSender';

export type NotifierConfig = TelegramSenderConfig & {
  numPosts?: number;
  delayMs?: number;
};

export type NotifyResult = {
  ok: number;
  falha: number;
  total: number;
};

export type PostLoader = () => Promise<Post[]>;

export class Notifier {
  private readonly sender: TelegramSender;
  private readonly numPosts: number;
  private readonly delayMs: number;

  constructor(
    private readonly loadPosts: PostLoader,
    config: NotifierConfig,
  ) {
    const { numPosts = 8, delayMs = 1000, ...senderConfig } = config;
    this.sender = new TelegramSender(senderConfig);
    this.numPosts = numPosts;
    this.delayMs = delayMs;
  }

  private selectPosts(posts: Post[]): Post[] {
    const shuffled = [...posts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(this.numPosts, shuffled.length));
  }

  public async notify(): Promise<NotifyResult> {
    const allPosts = await this.loadPosts();
    const postsWithLink = allPosts.filter((p) => p.shortUrl);
    const selected = this.selectPosts(postsWithLink);

    let ok = 0;
    let falha = 0;

    for (const post of selected) {
      const sent = await this.sender.sendPost(post);
      if (sent) ok++;
      else falha++;

      if (this.delayMs > 0) {
        await new Promise((r) => setTimeout(r, this.delayMs));
      }
    }

    return { ok, falha, total: selected.length };
  }
}
