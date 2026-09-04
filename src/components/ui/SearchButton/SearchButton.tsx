'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { SearchIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { formatShortDate } from '@/lib/utils';

type SearchPost = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
};

function normalizeSearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

interface SearchButtonProps {
  posts: SearchPost[];
}

export function SearchButton({ posts }: SearchButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchPost[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);
      setSelectedIndex(-1);

      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      const normalizedQuery = normalizeSearchText(searchQuery);
      const filtered = posts.filter(
        post =>
          normalizeSearchText(post.title).includes(normalizedQuery) ||
          normalizeSearchText(post.excerpt).includes(normalizedQuery) ||
          normalizeSearchText(post.author).includes(normalizedQuery),
      );

      setResults(filtered);
      setSelectedIndex(filtered.length > 0 ? 0 : -1);
    },
    [posts],
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (results.length === 0) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev =>
            prev < results.length - 1 ? prev + 1 : prev,
          );
          break;

        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
          break;

        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            const selectedPost = results[selectedIndex];
            router.push(`/blog/${selectedPost.slug}`);
            handleClose();
          }
          break;
      }
    },
    [results, selectedIndex, handleClose, router],
  );

  function handleOpenChange(open: boolean) {
    if (open) {
      setIsOpen(true);
      return;
    }

    handleClose();
  }

  useEffect(() => {
    if (selectedIndex >= 0 && resultRefs.current[selectedIndex]) {
      const prefersReducedMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      resultRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [selectedIndex]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger
        render={
          <button
            type='button'
            className={clsx(
              'flex size-11 items-center justify-center rounded-lg',
              'transition-all duration-200',
              'motion-reduce:transition-none',
              'text-foreground',
              'hover:bg-muted hover:text-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            )}
            aria-label='Abrir busca'
          >
            <SearchIcon className='w-6 h-6' />
          </button>
        }
      />

      <Dialog.Portal>
        <Dialog.Backdrop
          className={clsx(
            'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm',
            'transition-opacity duration-200 motion-reduce:transition-none',
            'data-starting-style:opacity-0 data-ending-style:opacity-0',
          )}
        />
        <Dialog.Viewport className='fixed inset-0 z-50 pointer-events-none'>
          <Dialog.Popup
            initialFocus={inputRef}
            className={clsx(
              'pointer-events-auto fixed top-4 left-1/2 w-full max-w-2xl -translate-x-1/2 px-3 sm:top-20 sm:px-4',
              'transition-opacity duration-200 motion-reduce:transition-none',
              'data-starting-style:opacity-0 data-ending-style:opacity-0',
            )}
          >
            <Dialog.Title className='sr-only'>Buscar posts</Dialog.Title>
            <div className='overflow-hidden rounded-xl border border-border bg-card shadow-xl'>
              <div className='flex items-center gap-3 border-b border-border p-3 sm:p-4'>
                <SearchIcon className='size-5 shrink-0 text-muted-foreground' />
                <input
                  ref={inputRef}
                  type='text'
                  placeholder='Buscar posts por título, resumo ou autor...'
                  value={query}
                  onChange={e => handleSearch(e.target.value)}
                  className={clsx(
                    'min-w-0 flex-1 bg-transparent outline-none',
                    'text-foreground',
                    'placeholder:text-muted-foreground',
                  )}
                  onKeyDown={handleKeyDown}
                  role='combobox'
                  aria-label='Buscar posts'
                  aria-autocomplete='list'
                  aria-controls='search-results'
                  aria-expanded={isOpen}
                  aria-activedescendant={
                    selectedIndex >= 0 ? `result-${selectedIndex}` : undefined
                  }
                />

                <Dialog.Close
                  render={
                    <button
                      type='button'
                      className='group flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card motion-reduce:transition-none'
                      aria-label='Fechar busca'
                    >
                      <XIcon className='size-5 text-muted-foreground transition-colors group-hover:text-foreground motion-reduce:transition-none' />
                    </button>
                  }
                />
              </div>

              <div className='max-h-[min(24rem,calc(100dvh-6.5rem))] overflow-y-auto overscroll-contain sm:max-h-[min(24rem,calc(100dvh-10.5rem))]'>
                {results.length === 0 && query.trim() && (
                  <p
                    className='px-6 py-10 text-center text-sm leading-6 text-muted-foreground'
                    role='status'
                  >
                    Nenhum post encontrado para {`"${query.trim()}"`}
                  </p>
                )}

                {results.length > 0 && (
                  <div
                    className='border-b border-border px-4 py-2 text-xs font-medium text-muted-foreground'
                    aria-live='polite'
                  >
                    {results.length} resultado{results.length > 1 ? 's' : ''}
                  </div>
                )}

                <div
                  id='search-results'
                  className='divide-y divide-border'
                  role='listbox'
                  aria-label='Resultados da busca'
                >
                  {results.map((post, index) => (
                    <Link
                      key={post.slug}
                      id={`result-${index}`}
                      ref={el => {
                        resultRefs.current[index] = el;
                      }}
                      href={`/blog/${post.slug}`}
                      onClick={handleClose}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={clsx(
                        'block p-4 transition-colors',
                        selectedIndex === index
                          ? 'bg-primary/10 border-l-2 border-l-primary'
                          : 'hover:bg-muted',
                        'focus-visible:outline-none focus-visible:bg-primary/10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                      )}
                      role='option'
                      aria-selected={selectedIndex === index}
                    >
                      <h3 className='line-clamp-2 font-semibold text-foreground'>
                        {post.title}
                      </h3>
                      <p className='mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground'>
                        {post.excerpt}
                      </p>
                      <time
                        dateTime={post.createdAt}
                        className='mt-2 block text-sm tabular-nums text-muted-foreground'
                      >
                        {formatShortDate(post.createdAt)}
                      </time>
                    </Link>
                  ))}
                </div>

                {!query.trim() && (
                  <p className='px-6 py-10 text-center text-sm leading-6 text-muted-foreground'>
                    Digite para buscar posts por título, resumo ou autor
                  </p>
                )}
              </div>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
