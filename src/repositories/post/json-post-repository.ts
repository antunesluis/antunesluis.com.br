import { PostModel } from '@/models/post/post-model';
import { resolve } from 'path';
import { PostRepository } from './post-repository';
import { readFile } from 'fs/promises';

const ROOT_DIR = process.cwd();
const JSON_POSTS_FILE_PATH = resolve(
  ROOT_DIR,
  'src',
  'db',
  'seed',
  'posts.json',
);
const SIMULATE_WAIT_TIME = 0;

export class JsonPostRepository implements PostRepository {
  private async simulateWait() {
    if (SIMULATE_WAIT_TIME <= 0) return;

    await new Promise(resolve => setTimeout(resolve, SIMULATE_WAIT_TIME));
  }

  private async readFromDisk(): Promise<PostModel[]> {
    const jsonData = await readFile(JSON_POSTS_FILE_PATH, 'utf-8');
    const parsedJson = JSON.parse(jsonData);
    const { posts } = parsedJson;
    return posts;
  }

  async findAll(): Promise<PostModel[]> {
    await this.simulateWait();

    return this.readFromDisk();
  }

  async findById(id: string): Promise<PostModel> {
    await this.simulateWait();

    const posts = await this.findAll();
    const post = posts.find(post => post.id === id);
    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }
    return post;
  }
}
