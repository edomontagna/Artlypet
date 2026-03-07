import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-violet-500/20 text-violet-300',
        secondary:
          'border-transparent bg-white/10 text-gray-300',
        success:
          'border-transparent bg-emerald-500/20 text-emerald-300',
        destructive:
          'border-transparent bg-red-500/20 text-red-300',
        outline: 'border-white/20 text-gray-300',
        premium:
          'border-transparent bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
