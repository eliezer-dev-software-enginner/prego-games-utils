import type { Post } from "../Post";
import { Sender } from "../SenderBase";
export type TelegramSenderConfig = {
    botToken: string;
    channelId: string;
    siteUrl: string;
};
export declare class TelegramSender extends Sender {
    private readonly config;
    constructor(config: TelegramSenderConfig);
    createBody(post: Post): {
        endpoint: string;
        payload: {
            chat_id: string;
            photo: string;
            caption: string;
            parse_mode: string;
            reply_markup: {
                inline_keyboard: {
                    text: string;
                    url: string;
                }[][];
            };
            text?: never;
        };
    } | {
        endpoint: string;
        payload: {
            chat_id: string;
            text: string;
            parse_mode: string;
            reply_markup: {
                inline_keyboard: {
                    text: string;
                    url: string;
                }[][];
            };
            photo?: never;
            caption?: never;
        };
    };
    sendPost(post: Post): Promise<boolean>;
}
//# sourceMappingURL=TelegramSender.d.ts.map