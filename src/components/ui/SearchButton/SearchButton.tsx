'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { formatShortDate } from '@/utils/format-datetime';

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
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchPost[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const dialogRef = useRef<HTMLDivElement>(null);
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
    (event: KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;

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
            window.location.href = `/post/${selectedPost.slug}`;
            handleClose();
          }
          break;

        case 'Escape':
          event.preventDefault();
          handleClose();
          break;
      }
    },
    [isOpen, results, selectedIndex, handleClose],
  );

  useEffect(() => {
    if (selectedIndex >= 0 && resultRefs.current[selectedIndex]) {
      resultRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={clsx(
          'p-2 flex items-center justify-center rounded-lg',
          'transition-all duration-200',
          'text-slate-600 dark:text-slate-300',
          'hover:bg-slate-200 dark:hover:bg-slate-800',
        )}
        aria-label='Abrir busca'
      >
        <SearchIcon className='w-7 h-7' />
      </button>

      {isOpen && (
        <>
          <div
            className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm'
            onClick={handleClose}
            aria-hidden='true'
          />

          <div
            ref={dialogRef}
            className='fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl mx-auto px-4'
            role='dialog'
            aria-modal='true'
            aria-labelledby='search-title'
          >
            <div className='bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden'>
              {/* Search Input */}
              <div className='flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700'>
                <SearchIcon className='w-5 h-5 text-slate-400' />
                <input
                  ref={inputRef}
                  type='text'
                  placeholder='Buscar posts por título, resumo ou autor...'
                  value={query}
                  onChange={e => handleSearch(e.target.value)}
                  className={clsx(
                    'flex-1 bg-transparent outline-none',
                    'text-slate-900 dark:text-slate-100',
                    'placeholder-slate-500 dark:placeholder-slate-400',
                  )}
                  aria-autocomplete='list'
                  aria-controls='search-results'
                  aria-activedescendant={
                    selectedIndex >= 0 ? `result-${selectedIndex}` : undefined
                  }
                />

                {query && (
                  <button
                    onClick={() => handleSearch('')}
                    className='p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
                    aria-label='Limpar busca'
                  />
                )}

                <button
                  onClick={handleClose}
                  className='p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
                  aria-label='Fechar busca'
                >
                  <XIcon className='w-5 h-5 text-slate-600 dark:text-slate-400' />
                </button>
              </div>

              <div
                id='search-results'
                className='max-h-96 overflow-y-auto'
                role='listbox'
              >
                {results.length === 0 && query.trim() && (
                  <div className='p-8 text-center text-slate-500 dark:text-slate-400'>
                    Nenhum post encontrado para {`"${query}"`}
                  </div>
                )}

                {results.length > 0 && (
                  <div>
                    <div className='px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-black/50'>
                      {results.length} resultado{results.length > 1 ? 's' : ''}
                    </div>

                    <div className='divide-y divide-slate-200 dark:divide-slate-700'>
                      {results.map((post, index) => (
                        <Link
                          key={post.slug}
                          id={`result-${index}`}
                          ref={el => {
                            resultRefs.current[index] = el;
                          }}
                          href={`/post/${post.slug}`}
                          onClick={handleClose}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={clsx(
                            'block p-4 transition-colors',
                            selectedIndex === index
                              ? 'bg-slate-200 dark:bg-slate-600/50'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-700/30',
                          )}
                          role='option'
                          aria-selected={selectedIndex === index}
                        >
                          <h3 className='font-semibold text-slate-900 dark:text-slate-100 line-clamp-2'>
                            {post.title}
                          </h3>
                          <p className='text-slate-600 dark:text-slate-400 mt-1 line-clamp-2'>
                            {post.excerpt}
                          </p>
                          <div className='flex items-center justify-between mt-2 text-slate-500'>
                            {formatShortDate(post.createdAt)}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {!query.trim() && (
                  <div className='p-8 text-center text-slate-500 dark:text-slate-400'>
                    <p>Digite para buscar posts por título, resumo ou autor</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
