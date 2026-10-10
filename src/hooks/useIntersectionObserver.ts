import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverArgs {
  threshold?: number;
  rootMargin?: string;
}

export function useIntersectionObserver({
  threshold = 0,
  rootMargin = '0px',
}: UseIntersectionObserverArgs = {}): [RefObject<HTMLDivElement | null>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return [ref, isIntersecting];
}
