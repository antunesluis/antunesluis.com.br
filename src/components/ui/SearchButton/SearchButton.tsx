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

      const lowerQuery = searchQuery.toLowerCase();
      const filtered = posts.filter(
        post =>
          post.title.toLowerCase().includes(lowerQuery) ||
          post.excerpt.toLowerCase().includes(lowerQuery) ||
          post.author.toLowerCase().includes(lowerQuery),
      );

      setResults(filtered);
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
      resultRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
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
        <Dialog.Backdrop className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm' />
        <Dialog.Viewport className='fixed inset-0 z-50 pointer-events-none'>
          <Dialog.Popup
            initialFocus={inputRef}
            className='pointer-events-auto fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-auto px-4'
          >
            <Dialog.Title className='sr-only'>Buscar posts</Dialog.Title>
            <div className='bg-card rounded-lg shadow-2xl border border-border overflow-hidden'>
              {/* Search Input */}
              <div className='flex items-center gap-3 p-4 border-b border-border'>
                <SearchIcon className='w-5 h-5 text-muted-foreground' />
                <input
                  ref={inputRef}
                  type='text'
                  placeholder='Buscar posts por título, resumo ou autor...'
                  value={query}
                  onChange={e => handleSearch(e.target.value)}
                  className={clsx(
                    'flex-1 bg-transparent outline-none',
                    'text-foreground',
                    'placeholder:text-muted-foreground',
                  )}
                  onKeyDown={handleKeyDown}
                  role='combobox'
                  aria-autocomplete='list'
                  aria-controls='search-results'
                  aria-expanded={isOpen}
                  aria-activedescendant={
                    selectedIndex >= 0 ? `result-${selectedIndex}` : undefined
                  }
                />

                {query && (
                  <button
                    type='button'
                    onClick={() => handleSearch('')}
                    className='p-1 rounded hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    aria-label='Limpar busca'
                  >
                    <XIcon className='w-5 h-5 text-muted-foreground' />
                  </button>
                )}

                <Dialog.Close
                  render={
                    <button
                      type='button'
                      className='p-1 rounded hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                      aria-label='Fechar busca'
                    >
                      <XIcon className='w-5 h-5 text-muted-foreground hover:text-foreground' />
                    </button>
                  }
                />
              </div>

              {/* Resultados */}
              <div
                id='search-results'
                className='max-h-96 overflow-y-auto'
                role='listbox'
              >
                {/* Sem resultados */}
                {results.length === 0 && query.trim() && (
                  <div className='p-8 text-center text-muted-foreground'>
                    Nenhum post encontrado para {`"${query}"`}
                  </div>
                )}

                {/* Com resultados */}
                {results.length > 0 && (
                  <div>
                    {/* Header dos resultados */}
                    <div className='px-4 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider bg-muted'>
                      {results.length} resultado{results.length > 1 ? 's' : ''}
                    </div>

                    {/* Lista de resultados */}
                    <div className='divide-y divide-border'>
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
                          <h3 className='font-semibold text-foreground line-clamp-2'>
                            {post.title}
                          </h3>
                          <p className='text-muted-foreground mt-1 line-clamp-2'>
                            {post.excerpt}
                          </p>
                          <div className='flex items-center justify-between mt-2 text-sm text-muted-foreground'>
                            {formatShortDate(post.createdAt)}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Estado inicial (sem busca) */}
                {!query.trim() && (
                  <div className='p-8 text-center text-muted-foreground'>
                    <p>Digite para buscar posts por título, resumo ou autor</p>
                  </div>
                )}
              </div>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
