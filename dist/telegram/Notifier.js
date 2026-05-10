import { TelegramSender } from './TelegramSender';
export class Notifier {
    loadPosts;
    sender;
    numPosts;
    delayMs;
    constructor(loadPosts, config) {
        this.loadPosts = loadPosts;
        const { numPosts = 8, delayMs = 1000, ...senderConfig } = config;
        this.sender = new TelegramSender(senderConfig);
        this.numPosts = numPosts;
        this.delayMs = delayMs;
    }
    selectPosts(posts) {
        const shuffled = [...posts].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(this.numPosts, shuffled.length));
    }
    async notify() {
        const allPosts = await this.loadPosts();
        const postsWithLink = allPosts.filter((p) => p.shortUrl);
        const selected = this.selectPosts(postsWithLink);
        let ok = 0;
        let falha = 0;
        for (const post of selected) {
            const sent = await this.sender.sendPost(post);
            if (sent)
                ok++;
            else
                falha++;
            if (this.delayMs > 0) {
                await new Promise((r) => setTimeout(r, this.delayMs));
            }
        }
        return { ok, falha, total: selected.length };
    }
}
//# sourceMappingURL=Notifier.js.map