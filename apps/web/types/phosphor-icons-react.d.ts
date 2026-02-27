declare module '@phosphor-icons/react' {
  import type { ComponentType, SVGProps } from 'react';

  export type PhosphorIcon = ComponentType<
    SVGProps<SVGSVGElement> & {
      size?: number | string;
      weight?: string;
      mirrored?: boolean;
    }
  >;

  export const IconContext: {
    Provider: ComponentType<{
      value?: Record<string, unknown>;
      children?: import('react').ReactNode;
    }>;
  };

  export const Icon: PhosphorIcon;
  export const List: PhosphorIcon;
  export const X: PhosphorIcon;
  export const Sparkles: PhosphorIcon;
  export const Palette: PhosphorIcon;
  export const BookOpen: PhosphorIcon;
  export const GraduationCap: PhosphorIcon;
  export const Info: PhosphorIcon;
  export const Brain: PhosphorIcon;
  export const TreeStructure: PhosphorIcon;
  export const PhSparkle: PhosphorIcon;
  export const PhArrowRight: PhosphorIcon;
  export const PhCircleNotch: PhosphorIcon;
  export const PhBooks: PhosphorIcon;
  export const PhPaintBrush: PhosphorIcon;
  export const PhHouse: PhosphorIcon;
  export const PhDatabase: PhosphorIcon;
  export const PhGraphNetwork: PhosphorIcon;
  export const PhCode: PhosphorIcon;
  export const PhLink: PhosphorIcon;
  export const PhChatCircleText: PhosphorIcon;
  export const PhBookOpen: PhosphorIcon;
  export const PhBrain: PhosphorIcon;
  export const PhPaintBrush: PhosphorIcon;
  export const PhSparkle: PhosphorIcon;

  const fallback: Record<string, PhosphorIcon>;
  export default fallback;
}

declare module '@phosphor-icons/react/dist/ssr' {
  export * from '@phosphor-icons/react';
}

