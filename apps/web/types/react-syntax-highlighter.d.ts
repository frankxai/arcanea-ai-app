declare module 'react-syntax-highlighter' {
  import { ComponentType } from 'react';

  interface SyntaxHighlighterProps {
    children?: string;
    style?: Record<string, React.CSSProperties>;
    language?: string;
    showLineNumbers?: boolean;
    wrapLines?: boolean;
    wrapLongLines?: boolean;
    customStyle?: React.CSSProperties;
    codeTagProps?: React.HTMLAttributes<HTMLElement>;
    PreTag?: string | ComponentType;
    CodeTag?: string | ComponentType;
    className?: string;
    [key: string]: unknown;
  }

  export const Prism: ComponentType<SyntaxHighlighterProps>;
  export const Light: ComponentType<SyntaxHighlighterProps>;
  const SyntaxHighlighter: ComponentType<SyntaxHighlighterProps>;
  export default SyntaxHighlighter;
}

declare module 'react-syntax-highlighter/dist/esm/prism' {
  import { ComponentType } from 'react';

  interface SyntaxHighlighterProps {
    children?: string;
    style?: Record<string, React.CSSProperties>;
    language?: string;
    showLineNumbers?: boolean;
    wrapLines?: boolean;
    wrapLongLines?: boolean;
    customStyle?: React.CSSProperties;
    codeTagProps?: React.HTMLAttributes<HTMLElement>;
    PreTag?: string | ComponentType;
    CodeTag?: string | ComponentType;
    className?: string;
    [key: string]: unknown;
  }

  const SyntaxHighlighter: ComponentType<SyntaxHighlighterProps>;
  export default SyntaxHighlighter;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  const vscDarkPlus: Record<string, React.CSSProperties>;
  const oneDark: Record<string, React.CSSProperties>;
  const materialDark: Record<string, React.CSSProperties>;
  const dracula: Record<string, React.CSSProperties>;
  export { vscDarkPlus, oneDark, materialDark, dracula };
}

declare module 'react-syntax-highlighter/dist/cjs/styles/prism' {
  const vscDarkPlus: Record<string, React.CSSProperties>;
  const oneDark: Record<string, React.CSSProperties>;
  const materialDark: Record<string, React.CSSProperties>;
  const dracula: Record<string, React.CSSProperties>;
  export { vscDarkPlus, oneDark, materialDark, dracula };
}
