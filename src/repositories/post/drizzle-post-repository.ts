import { PostModel } from '@/models/post/post-model';
import { PostRepository } from './post-repository';
import { drizzleDb } from '@/db/drizzle';
import { logColor } from '@/utils/log-color';
import { asyncDelay } from '@/utils/async-delay';
import { SIMULATE_WAIT_TIME } from '@/lib/constants';

export class DrizzlePostRepository implements PostRepository {
  async findAllPublic(): Promise<PostModel[]> {
    await asyncDelay(SIMULATE_WAIT_TIME, true);
    logColor('findAllPublic', Date.now());

    const posts = await drizzleDb.query.posts.findMany({
      orderBy: (posts, { desc }) => desc(posts.createdAt),
      where: (posts, { eq }) => eq(posts.published, true),
    });

    return posts;
  }

  async findBySlugPublic(slug: string): Promise<PostModel> {
    await asyncDelay(SIMULATE_WAIT_TIME, true);
    logColor('findBySlugPublic', Date.now(), slug);

    const posts = await drizzleDb.query.posts.findFirst({
      where: (posts, { eq, and }) =>
        and(eq(posts.slug, slug), eq(posts.published, true)),
    });

    if (!posts) {
      throw new Error(`Post with slug ${slug} not found`);
    }

    return posts;
  }

  async findAll(): Promise<PostModel[]> {
    await asyncDelay(SIMULATE_WAIT_TIME, true);
    logColor('findAll', Date.now());

    const posts = await drizzleDb.query.posts.findMany({
      orderBy: (posts, { desc }) => desc(posts.createdAt),
    });

    return posts;
  }

  async findById(id: string): Promise<PostModel> {
    await asyncDelay(SIMULATE_WAIT_TIME, true);
    logColor('findById', Date.now(), id);

    const post = await drizzleDb.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    });

    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }

    return post;
  }
}
