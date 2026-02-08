import { findAllPublicPostsCached } from '@/features/blog';
import { SearchButton } from './SearchButton';

export async function SearchButtonServer() {
  const posts = await findAllPublicPostsCached();

  if (!posts || posts.length === 0) return null;

  const searchPosts = posts.map(post => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    author: post.author,
    createdAt: post.createdAt,
  }));

  return <SearchButton posts={searchPosts} />;
}

export { SearchButtonServer as SearchButton };
