import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

const sizeConfig = {
  sm: {
    nine: 'text-xl',
    x: 'text-sm',
    f: 'text-xl',
    capital: 'text-xl ml-1.5',
  },
  md: {
    nine: 'text-2xl lg:text-3xl',
    x: 'text-base lg:text-xl',
    f: 'text-2xl lg:text-3xl',
    capital: 'text-2xl lg:text-3xl ml-2',
  },
  lg: {
    nine: 'text-4xl',
    x: 'text-2xl',
    f: 'text-4xl',
    capital: 'text-4xl ml-3',
  },
};

export function Logo({ className, size = 'md', href = '/' }: LogoProps) {
  const sizes = sizeConfig[size];
  
  const content = (
    <div 
      className={cn('flex items-baseline text-white', className)} 
      style={{ letterSpacing: '-0.02em' }}
    >
      <span className={cn('font-[family-name:var(--font-manrope)] font-bold leading-none', sizes.nine)}>
        9
      </span>
      <span className={cn('font-[family-name:var(--font-manrope)] font-light leading-none', sizes.x)}>
        x
      </span>
      <span className={cn('font-[family-name:var(--font-marck)] font-medium leading-none', sizes.f)}>
        f
      </span>
      <span className={cn('font-[family-name:var(--font-manrope)] font-semibold tracking-tight', sizes.capital)}>
        Capital
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
