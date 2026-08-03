import type { ComponentProps } from "react";

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`rounded-xl border border-black/10 border-t-green-700/60 bg-white/90 shadow-sm transition-shadow hover:shadow-md ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`space-y-2 p-6 ${className}`} {...props} />;
}

export function CardTitle({ className = "", ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  );
}

export function CardDescription({
  className = "",
  ...props
}: ComponentProps<"p">) {
  return <p className={`text-sm text-muted-foreground ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
}
