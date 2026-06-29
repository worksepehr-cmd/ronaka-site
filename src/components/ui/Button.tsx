// src/components/ui/Button.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none " +
  "rounded-xl font-medium " +
  "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-[var(--ring)] focus-visible:ring-offset-[var(--color-background)] " +
  "disabled:opacity-50 disabled:pointer-events-none " +
  "transition-[transform,opacity,box-shadow,background-color,border-color,color] motion-base " +
  "active:translate-y-[1px]";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-accent)] text-[var(--color-on-accent)] shadow-soft " +
    "hover:shadow-hover",
  secondary:
    "bg-[var(--color-surface-2)] text-[var(--color-foreground)] border border-[var(--color-border)] " +
    "hover:bg-[var(--color-surface-3)]",
  ghost:
    "bg-transparent text-[var(--color-foreground)] " +
    "hover:bg-[var(--color-surface-2)]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = Boolean(disabled || loading);

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span
              className="inline-block size-4 rounded-full border border-current border-t-transparent animate-spin"
              aria-hidden="true"
            />
            <span className="opacity-90">{children}</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";