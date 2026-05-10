import type { Post } from './Post';
export declare abstract class Sender {
    abstract createBody(post: Post): any;
    abstract sendPost(post: Post): Promise<boolean>;
}
//# sourceMappingURL=SenderBase.d.ts.map