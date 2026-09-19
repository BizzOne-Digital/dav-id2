"use client";

import Link from "next/link";
import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  primary:
    "bg-gold text-charcoal hover:bg-gold/90 shadow-[0_4px_24px_rgba(242,182,50,0.35)] border border-gold/80",
  secondary:
    "bg-transparent text-cream border-2 border-cream/40 hover:border-gold hover:text-gold",
  ghost: "bg-transparent text-cream/90 hover:bg-cream/10 hover:text-cream",
} as const;

export type ButtonVariant = keyof typeof variantStyles;

type ButtonBaseProps = {
  variant?: ButtonVariant;
  magnetic?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-50";

export function Button(props: ButtonProps) {
  const { variant = "primary", magnetic = false, className, children } = props;
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const onMouseLeave = () => {
    if (!magnetic || !ref.current) return;
    ref.current.style.transform = "";
  };

  const classes = cn(
    baseStyles,
    variantStyles[variant],
    magnetic && "magnetic-hover will-change-transform",
    className
  );

  if ("href" in props && props.href) {
    const { href, target, rel, onClick } = props;
    return (
      <Link
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={classes}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </Link>
    );
  }

  const { type = "button", disabled, onClick, ...rest } = props as ButtonAsButton;

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      {...rest}
    >
      {children}
    </button>
  );
}
