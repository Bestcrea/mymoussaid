import type { ReactNode } from "react";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
}

export const SECTION_CONTAINER =
  "mx-auto w-full max-w-7xl px-6 lg:px-12";

export function SectionContainer({ children, className = "" }: SectionContainerProps) {
  return <div className={`${SECTION_CONTAINER} ${className}`.trim()}>{children}</div>;
}
