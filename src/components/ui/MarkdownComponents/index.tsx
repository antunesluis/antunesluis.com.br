import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { type ComponentPropsWithoutRef } from 'react';

const syntaxHighlighterStyle = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: 'transparent',
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: 'transparent',
  },
};

function CodeBlock({
  inline,
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
  const match = /language-(\w+)/.exec(className || '');

  if (!inline && match) {
    return (
      <div className='text-lg'>
        <SyntaxHighlighter
          style={syntaxHighlighterStyle}
          language={match[1]}
          PreTag='div'
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

function ResponsiveTable({
  children,
  ...props
}: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-[600px]' {...props}>
        {children}
      </table>
    </div>
  );
}

export const markdownComponents = {
  code: CodeBlock,
  table: ResponsiveTable,
};
