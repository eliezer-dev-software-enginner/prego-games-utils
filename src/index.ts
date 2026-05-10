// src/index.ts
export type { Post } from './Post';
export { Sender } from './SenderBase';
export {
  Notifier,
  type NotifierConfig,
  type NotifyResult,
  type PostLoader,
} from './telegram/Notifier';
export {
  TelegramSender,
  type TelegramSenderConfig,
} from './telegram/TelegramSender';
