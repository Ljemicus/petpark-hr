import { PetParkLogo } from '@/components/shared/brand';

type BrandLogoProps = {
  variant?: 'horizontal' | 'mark';
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  className?: string;
};

const dimensions = {
  sm: { width: 116, height: 28, className: 'h-7 w-auto' },
  md: { width: 148, height: 36, className: 'h-9 w-auto' },
  lg: { width: 211, height: 51, className: 'h-12 w-auto' },
} as const;

export function BrandLogo({
  variant = 'horizontal',
  size = 'md',
  className,
}: BrandLogoProps) {
  const logo = dimensions[size];

  return (
    <PetParkLogo
      width={logo.width}
      height={logo.height}
      className={`${logo.className}${variant === 'mark' ? ' max-w-[3rem] object-contain object-left' : ''}${className ? ` ${className}` : ''}`}
    />
  );
}
