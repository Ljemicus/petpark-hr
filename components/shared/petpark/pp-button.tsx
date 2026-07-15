import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PetParkButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger' | 'link';
type PetParkButtonSize = 'sm' | 'md' | 'lg';

type PetParkButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: PetParkButtonVariant;
  size?: PetParkButtonSize;
  href?: string;
  children: ReactNode;
};

const variantClasses: Record<PetParkButtonVariant, string> = {
  primary: 'bg-[color:var(--pp-forest)] text-white shadow-[0_18px_40px_rgba(7,63,52,.22)] hover:bg-[color:var(--pp-forest-dark)]',
  secondary: 'border border-[color:var(--pp-line)] bg-[color:var(--pp-warm-white)] text-[color:var(--pp-ink)] shadow-[0_10px_22px_rgba(76,56,31,.055)] hover:bg-white',
  ghost: 'text-[color:var(--pp-muted)] hover:bg-[color:var(--pp-cream)] hover:text-[color:var(--pp-ink)]',
  accent: 'bg-[color:var(--pp-logo-orange)] text-[#052d25] shadow-[0_16px_34px_rgba(255,179,71,.27)] hover:bg-[color:var(--pp-logo-teal)] hover:text-white',
  danger: 'bg-[color:var(--pp-lost-accent)] text-white shadow-[0_16px_34px_rgba(204,108,92,.22)] hover:brightness-95',
  link: 'rounded-none px-0 text-[color:var(--pp-forest)] underline-offset-4 hover:underline',
};

const sizeClasses: Record<PetParkButtonSize, string> = {
  sm: 'min-h-9 px-3 text-xs',
  md: 'min-h-11 px-5 text-sm',
  lg: 'min-h-12 px-6 text-base',
};

export function PetParkButton({
  variant = 'primary',
  size = 'md',
  href,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: PetParkButtonProps) {
  const classes = cn(
    'inline-flex max-w-full items-center justify-center gap-2 whitespace-normal break-words rounded-[18px] text-center font-extrabold leading-tight transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--pp-logo-teal)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    variant !== 'link' && 'w-full active:translate-y-px hover:-translate-y-0.5 sm:w-auto',
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (href && !disabled) {
    return (
      <Link href={href} prefetch={false} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
