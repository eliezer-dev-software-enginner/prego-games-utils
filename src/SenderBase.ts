//src/SenderBase.ts

import type { Post } from './Post';

export abstract class Sender {
  abstract createBody(post: Post): any;
  abstract sendPost(post: Post): Promise<boolean>;
}
