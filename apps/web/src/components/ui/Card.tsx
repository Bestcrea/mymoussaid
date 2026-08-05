import type { ReactNode } from "react";
import { motion } from "framer-motion";

type CardVariant = "default" | "gold" | "dark";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  hover?: boolean;
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default: "bg-white border-neutral-200 text-neutral-900",
  gold: "bg-brand-500 border-brand-600 text-white",
  dark: "bg-neutral-900 border-neutral-700 text-white",
};

export function Card({
  children,
  variant = "default",
  className = "",
  hover = true,
}: CardProps) {
  return (
    <motion.div
      {...(hover
        ? { whileHover: { y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" } }
        : {})}
      transition={{ duration: 0.3 }}
      className={[
        "rounded-2xl border p-6 shadow-sm transition-colors duration-300",
        VARIANT_CLASSES[variant],
        hover && variant === "dark" ? "hover:border-brand-500" : "",
        hover && variant === "default" ? "hover:border-brand-300" : "",
        className,
      ].join(" ")}
    >
      {children}
    </motion.div>
  );
}
