'use client';

import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { useId } from 'react';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
});

type MarkdownEditorProps = {
  labelText?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  textAreaName: string;
  disabled?: boolean;
};

export function MarkdownEditor({
  labelText = '',
  value,
  setValue,
  textAreaName,
  disabled = false,
}: MarkdownEditorProps) {
  const id = useId();
  const { resolvedTheme } = useTheme();

  return (
    <div className='flex flex-col gap-2'>
      {labelText && (
        <label className='text-sm text-foreground' htmlFor={id}>
          {labelText}
        </label>
      )}

      <div data-color-mode={resolvedTheme} suppressHydrationWarning>
        <MDEditor
          className='whitespace-pre-wrap'
          value={value}
          onChange={value => {
            if (value === undefined) return;
            setValue(value);
          }}
          height={400}
          extraCommands={[]}
          preview='edit'
          hideToolbar={disabled}
          textareaProps={{
            id,
            name: textAreaName,
            disabled: disabled,
          }}
        />
      </div>
    </div>
  );
}
