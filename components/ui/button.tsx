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
      ? "border border-foreground/20 bg-transparent text-foreground hover:bg-muted"
      : "bg-foreground text-background hover:bg-foreground/85";
  const classes = `inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors ${variantClass} ${className}`;

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
