
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ScrollRevealOptions {
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  once?: boolean;
}

export const useScrollReveal = (options: ScrollRevealOptions = {}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const {
      delay = 0,
      duration = 0.8,
      distance = 60,
      direction = 'up',
      once = true
    } = options;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fromProps: any = { opacity: 0 };
            const toProps: any = { opacity: 1, duration, delay, ease: 'power3.out' };

            switch (direction) {
              case 'up':
                fromProps.y = distance;
                toProps.y = 0;
                break;
              case 'down':
                fromProps.y = -distance;
                toProps.y = 0;
                break;
              case 'left':
                fromProps.x = distance;
                toProps.x = 0;
                break;
              case 'right':
                fromProps.x = -distance;
                toProps.x = 0;
                break;
            }

            gsap.fromTo(element, fromProps, toProps);

            if (once) {
              observer.unobserve(element);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return elementRef;
};
