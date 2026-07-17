import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function LinkButton({ href, children, variant = "primary", className }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors duration-200 ease-earth focus-visible:outline-none";
  const styles = {
    primary: "bg-action-primary text-warm-white hover:bg-action-primary-hover",
    secondary:
      "border border-soil/30 text-soil hover:bg-soil/5",
  };

  return (
    <Link href={href} className={cn(base, styles[variant], className)}>
      {children}
    </Link>
  );
}
