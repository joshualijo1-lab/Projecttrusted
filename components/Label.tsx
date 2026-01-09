import type { LabelHTMLAttributes } from 'react';
import { cn } from '@/components/classnames';

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('text-sm font-semibold text-slate-700', className)} {...props} />;
}
