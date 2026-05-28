// src/telegram/TelegramSender.ts

import type { Post } from '../Post';
import { Sender } from '../SenderBase';

export type TelegramSenderConfig = {
  botToken: string;
  channelId: string;
  siteUrl: string;
};

export class TelegramSender extends Sender {
  constructor(private readonly config: TelegramSenderConfig) {
    super();
  }

  createBody(post: Post) {
    const { channelId, siteUrl } = this.config;

    const idioma = post.dublado
      ? 'Dublado'
      : post.traduzido
        ? 'Legendado'
        : 'Original';

    const precoFormatado = `R$ ${post.preco?.toFixed(2)}`;
    let comprarUrl;
    if(post.isRom) {
      comprarUrl = `${siteUrl}/roms/${post.id}`;
    } else {
      comprarUrl = `${siteUrl}/packs/${post.id}`;
    }

    const MAX_DESC = 200;
    const descricaoTruncada =
      post.descricao && post.descricao.length > MAX_DESC
        ? post.descricao.slice(0, MAX_DESC).trimEnd() + '…'
        : post.descricao;

    const caption = [
      `🕹️ *${post.titulo}*`,
      descricaoTruncada ? `\n${descricaoTruncada}` : '',
      `\n📦 Plataforma: *${post.type}*`,
      `🌐 Idioma: *${idioma}*`,
      `💰 Preço: *${precoFormatado}*`,
    ]
      .filter(Boolean)
      .join('\n');

    const inline_keyboard = [
      [{ text: '⚡ Baixar grátis', url: post.shortUrl }],
      [{ text: '🛒 Comprar acesso vitalício', url: comprarUrl }],
    ];

    const reply_markup = { inline_keyboard };

    if (post.capaRef) {
      return {
        endpoint: 'sendPhoto',
        payload: {
          chat_id: channelId,
          photo: post.capaRef,
          caption,
          parse_mode: 'Markdown',
          reply_markup,
        },
      };
    }

    return {
      endpoint: 'sendMessage',
      payload: {
        chat_id: channelId,
        text: caption,
        parse_mode: 'Markdown',
        reply_markup,
      },
    };
  }

  async sendPost(post: Post): Promise<boolean> {
    const { botToken } = this.config;
    const { endpoint, payload } = this.createBody(post);

    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/${endpoint}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    const data = (await res.json()) as { ok: boolean; description?: string };

    if (!data.ok) {
      console.error(
        `[TelegramSender] Erro ao enviar "${post.titulo}":`,
        data.description,
      );
    }

    return data.ok as boolean;
  }
}
