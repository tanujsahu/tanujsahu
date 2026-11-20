import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-cyan-200 text-slate-950 hover:bg-cyan-100 shadow-[0_8px_30px_rgba(103,232,249,0.18)]",
  secondary:
    "border border-white/15 bg-white/5 text-white hover:border-cyan-200/40 hover:bg-white/10",
  ghost: "text-slate-100 hover:bg-white/10",
  icon: "grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-slate-950/55 text-slate-100 backdrop-blur hover:border-cyan-200/50",
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
