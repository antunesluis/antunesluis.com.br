import { PostModel } from '@/models/post/post-model';
import { resolve } from 'path';
import { PostRepository } from './post-repository';
import { readFile } from 'fs/promises';
import { SIMULATE_WAIT_TIME } from '@/lib/constants';
import { asyncDelay } from '@/utils/async-delay';

const ROOT_DIR = process.cwd();
const JSON_POSTS_FILE_PATH = resolve(
  ROOT_DIR,
  'src',
  'db',
  'seed',
  'posts.json',
);

export class JsonPostRepository implements PostRepository {
  private async readFromDisk(): Promise<PostModel[]> {
    const jsonData = await readFile(JSON_POSTS_FILE_PATH, 'utf-8');
    const parsedJson = JSON.parse(jsonData);
    const { posts } = parsedJson;
    return posts;
  }

  async findAllPublic(): Promise<PostModel[]> {
    await asyncDelay(SIMULATE_WAIT_TIME, true);

    const posts = await this.readFromDisk();
    return posts.filter(post => post.published);
  }

  async findAll(): Promise<PostModel[]> {
    await asyncDelay(SIMULATE_WAIT_TIME, true);

    const posts = await this.readFromDisk();
    return posts;
  }

  async findById(id: string): Promise<PostModel> {
    const posts = await this.findAllPublic();
    const post = posts.find(post => post.id === id);

    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }
    return post;
  }

  async findBySlugPublic(slug: string): Promise<PostModel> {
    const posts = await this.findAllPublic();
    const post = posts.find(post => post.slug === slug);

    if (!post) {
      throw new Error(`Post with slug ${slug} not found`);
    }
    return post;
  }
}
