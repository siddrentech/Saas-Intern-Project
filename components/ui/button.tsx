import { cloneElement, isValidElement } from "react";
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline";
};

export function Button({
  asChild,
  children,
  className = "",
  variant = "default",
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "outline"
      ? "border border-black/20 bg-white/70 text-foreground hover:border-red-300 hover:bg-red-50 hover:text-red-800"
      : "bg-red-700 text-white shadow-sm hover:bg-red-800";
  const classes = `inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition-all hover:-translate-y-0.5 ${variantClass} ${className}`;

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;

    return cloneElement(child, {
      className: `${classes} ${child.props.className ?? ""}`,
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
