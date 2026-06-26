import { useEffect, useMemo, useState } from "react";

export function useTypewriter(text: string, speed: number, instant: boolean) {
  const [visibleCount, setVisibleCount] = useState(instant ? text.length : 0);

  useEffect(() => {
    setVisibleCount(instant ? text.length : 0);
  }, [text, instant]);

  useEffect(() => {
    if (instant || visibleCount >= text.length) return;

    const delay = Math.max(8, 70 - speed);
    const timer = window.setTimeout(() => {
      setVisibleCount((count) => Math.min(text.length, count + 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [instant, speed, text.length, visibleCount]);

  const visibleText = useMemo(() => text.slice(0, visibleCount), [text, visibleCount]);

  return {
    visibleText,
    isComplete: visibleCount >= text.length,
    complete: () => setVisibleCount(text.length),
  };
}
