import { forwardRef, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

type ButtonVariant = 'solid' | 'outline';
type ButtonColor = 'cyan' | 'white' | 'gray';

interface ButtonProps {
  variant?: ButtonVariant;
  color?: ButtonColor;
  className?: string;
  href?: string;
}

type Props = ButtonProps & (AnchorHTMLAttributes<HTMLAnchorElement> & ButtonHTMLAttributes<HTMLButtonElement>);

const baseStyles = {
  solid:
    'inline-flex justify-center rounded-lg py-2 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-colors',
  outline:
    'inline-flex justify-center rounded-lg border py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-sm outline-2 outline-offset-2 transition-colors',
}

const variantStyles = {
  solid: {
    cyan: 'relative overflow-hidden bg-cyan-500 text-white before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-cyan-600 active:text-white/80 before:transition-colors',
    white:
      'bg-white text-cyan-900 hover:bg-white/90 active:bg-white/90 active:text-cyan-900/70',
    gray: 'bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-800 active:text-white/80',
  },
  outline: {
    gray: 'border-gray-300 text-gray-700 hover:border-gray-400 active:bg-gray-100 active:text-gray-700/80',
  },
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  function Button({ variant = 'solid', color = 'gray', className, href, ...props }, ref) {
    className = clsx(
      baseStyles[variant],
      (variantStyles[variant] as Record<ButtonColor, string>)[color],
      className
    )

    if (href) {
      return (
        <Link href={href} passHref ref={ref as React.Ref<HTMLAnchorElement>} className={className} {...props as AnchorHTMLAttributes<HTMLAnchorElement>} />
        
      )
    } else {
      return (
        <button ref={ref as React.Ref<HTMLButtonElement>} className={className} {...props as ButtonHTMLAttributes<HTMLButtonElement>} />
      )
    }
  }
)
