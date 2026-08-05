import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  light?: boolean;
  align?: "left" | "center";
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  light = false,
  align = "center",
  className = "",
}: SectionTitleProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={[
        align === "center" ? "text-center" : "text-left",
        className,
      ].join(" ")}
    >
      <h2
        className={[
          "mb-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl",
          light ? "text-white" : "text-neutral-900",
        ].join(" ")}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={[
            "mb-6 max-w-2xl text-base sm:text-lg",
            align === "center" ? "mx-auto" : "",
            light ? "text-neutral-300" : "text-neutral-500",
          ].join(" ")}
        >
          {subtitle}
        </p>
      )}
      <div
        className={[
          "mb-12 h-1 w-16 rounded-full bg-brand-500",
          align === "center" ? "mx-auto" : "",
        ].join(" ")}
      />
    </motion.div>
  );
}
