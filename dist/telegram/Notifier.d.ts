import type { Post } from '../Post';
import { type TelegramSenderConfig } from './TelegramSender';
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
export declare class Notifier {
    private readonly loadPosts;
    private readonly sender;
    private readonly numPosts;
    private readonly delayMs;
    constructor(loadPosts: PostLoader, config: NotifierConfig);
    private selectPosts;
    notify(): Promise<NotifyResult>;
}
//# sourceMappingURL=Notifier.d.ts.map