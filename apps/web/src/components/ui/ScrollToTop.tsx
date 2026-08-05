import { AnimatePresence, motion } from "framer-motion";
import { useScroll } from "../../contexts/ScrollContext";

const CIRCUMFERENCE = 2 * Math.PI * 22;

export function ScrollToTop() {
  const { scrollY } = useScroll();
  const visible = scrollY > 400;
  const progress = Math.min(
    scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1),
    1,
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={scrollToTop}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 6px 24px rgba(196,122,30,0.5)",
          }}
          whileTap={{ scale: 0.95 }}
          aria-label="Revenir en haut de la page"
          className="fixed bottom-4 right-4 z-[999] flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full bg-[#C47A1E] shadow-[0_4px_16px_rgba(196,122,30,0.4)] md:bottom-8 md:right-8 md:h-12 md:w-12"
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 48 48"
            aria-hidden
          >
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              animate={{
                strokeDashoffset: CIRCUMFERENCE * (1 - progress),
              }}
              transform="rotate(-90 24 24)"
            />
          </svg>

          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative z-10"
            aria-hidden
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
