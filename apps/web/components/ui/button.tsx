import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ─── Spinner ─────────────────────────────────────────────────────────────────

function ButtonSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin h-4 w-4', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// ─── Variants ────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-lg text-sm font-medium',
    'ring-offset-background transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlantean-teal focus-visible:ring-offset-2',
    'active:scale-[0.98] active:brightness-[0.95]',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        // PRIMARY — solid teal. The default action.
        default:
          'bg-atlantean-teal text-cosmic-void font-semibold hover:bg-atlantean-teal-light shadow-glow-sm hover:shadow-glow-md',
        // SECONDARY — ghost with border. Secondary actions.
        secondary:
          'border border-cosmic-border bg-cosmic-surface text-text-primary hover:bg-cosmic-raised hover:border-cosmic-border-bright',
        // GHOST — no border, no background. Tertiary / navigation.
        ghost:
          'text-text-secondary hover:bg-cosmic-raised hover:text-text-primary',
        // DESTRUCTIVE — red. Danger only.
        destructive:
          'bg-error text-white hover:bg-error-dark',
        // PREMIUM — gold accent. Upgrade / special actions.
        premium:
          'bg-gold-deep text-cosmic-void font-semibold hover:bg-gold-bright shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.35)]',
        // LINK — inline link style.
        link:
          'text-atlantean-teal underline-offset-4 hover:underline p-0 h-auto',

        // ── Legacy themed variants (kept for backward compat, prefer theme system) ──
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        cosmic:
          'bg-cosmic-surface border border-cosmic-border text-text-primary hover:bg-cosmic-raised hover:border-gold-medium shadow-glow-sm hover:shadow-glow-md',
        atlantean:
          'bg-atlantean-deep border border-atlantean-teal text-text-primary hover:bg-atlantean-primary hover:shadow-atlantean',
        draconic:
          'bg-draconic-crimson-deep border border-draconic-gold text-text-primary hover:bg-draconic-crimson hover:shadow-draconic',
        creation:
          'bg-creation-gold-deep border border-creation-gold text-cosmic-void hover:bg-creation-gold hover:shadow-creation',
        glow:
          'bg-gradient-to-r from-atlantean-teal via-gold-bright to-draconic-crimson text-cosmic-void font-semibold animate-shimmer bg-[length:200%_100%] shadow-glow-lg hover:shadow-glow-xl',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-11 px-8',
        xl: 'h-14 px-10 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Show a loading spinner and disable interaction */
  loading?: boolean;
  /** Icon to render before children */
  iconLeft?: React.ReactNode;
  /** Icon to render after children */
  iconRight?: React.ReactNode;
}

// ─── Component ───────────────────────────────────────────────────────────────

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      iconLeft,
      iconRight,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={isDisabled}
          aria-disabled={isDisabled || undefined}
          aria-busy={loading || undefined}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <ButtonSpinner className={children ? 'mr-0' : ''} />
        ) : iconLeft ? (
          <span className="shrink-0">{iconLeft}</span>
        ) : null}
        {loading && !children ? null : children}
        {!loading && iconRight ? (
          <span className="shrink-0">{iconRight}</span>
        ) : null}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants, ButtonSpinner };
