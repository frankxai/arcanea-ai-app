/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
