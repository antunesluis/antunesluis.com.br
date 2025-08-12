import { deletePostAction } from '@/actions/post/delete-post';
import { findAllPostsAdmin } from '@/lib/post/queries/admin';
import { DeletePostButton } from '../DeletePostButton';
import clsx from 'clsx';
import Link from 'next/link';

export default async function PostListAdmin() {
  const posts = await findAllPostsAdmin();

  return (
    <div className='mb-16'>
      {posts.map(post => {
        return (
          <div
            className={clsx(
              'py-2 px-2',
              !post.published && 'bg-slate-300',
              'flex gap-2 items-center justify-between',
            )}
            key={post.id}
          >
            <Link href={`/admin/post/${post.id}`}>{post.title}</Link>

            {!post.published && (
              <span className='text-xs text-slate-600 italic ml-2'>
                (Draft)
              </span>
            )}

            <DeletePostButton title={post.title} id={post.id} />
          </div>
        );
      })}

      <div
        className={clsx(
          'fixed z-50 inset-0 bg-black/50 backdrop-blur-xs',
          'flex items-center justify-center',
        )}
      >
        <div
          className={clsx(
            'bg-slate-100 p-6 mx-6 rounded-lg max-w-2xl',
            'flex flex-col gap-6',
            'shadow-lg shadow-black/30 text-center',
          )}
        >
          <h3 className={clsx('text-2xl font-extrabold')}>Excluir Post</h3>
          <p>Tem certeza que deseja excluir este post?</p>
          <div className='flex items-center justify-around'>
            <button
              className={clsx(
                'bg-slate-300 hover:bg-slate-400 text-slate-950 transition',
                'flex items-center justify-center',
                'px-4 py-2 rounded-lg cursor-pointer',
              )}
              autoFocus
            >
              Cancelar
            </button>
            <button
              className={clsx(
                'bg-blue-500 hover:bg-blue-600 text-blue-50 transition',
                'flex items-center justify-center',
                'px-4 py-2 rounded-lg cursor-pointer',
              )}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
