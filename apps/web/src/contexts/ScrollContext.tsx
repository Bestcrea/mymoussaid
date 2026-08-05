import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface ScrollContextType {
  topBarVisible: boolean;
  scrollY: number;
}

const ScrollContext = createContext<ScrollContextType>({
  topBarVisible: true,
  scrollY: 0,
});

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [topBarVisible, setTopBarVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = Math.max(window.scrollY, 0);
      setScrollY(current);

      if (current < 10) {
        setTopBarVisible(true);
      } else if (current > lastScrollY.current && current > 40) {
        setTopBarVisible(false);
      } else if (current < lastScrollY.current) {
        setTopBarVisible(true);
      }

      lastScrollY.current = current;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ScrollContext.Provider value={{ topBarVisible, scrollY }}>
      {children}
    </ScrollContext.Provider>
  );
}

export const useScroll = () => useContext(ScrollContext);
