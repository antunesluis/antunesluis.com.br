import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { markdownComponents } from '../MarkdownComponents';

type SafeMarkdownProps = {
  markdown: string;
};

const containerClasses = clsx(
  'prose prose-slate',
  'w-full max-w-none',
  'overflow-hidden',
  'prose-a:text-blue-500 prose-a:hover:text-blue-700',
  'prose-a:transition prose-a:no-underline prose-a:hover:underline',
  'prose-img:mx-auto',
  'lg:prose-lg',
);

export function SafeMarkdown({ markdown }: SafeMarkdownProps) {
  return (
    <div className={containerClasses}>
      <ReactMarkdown
        rehypePlugins={[rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
