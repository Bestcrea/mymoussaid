import { useEffect, useState } from "react";
import { animate, useMotionValue } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = "",
  duration = 2,
  className = "",
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  const motionValue = useMotionValue(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return controls.stop;
  }, [inView, value, duration, motionValue]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
