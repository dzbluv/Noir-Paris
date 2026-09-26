import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash && hash !== '#hero') {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => {
          const lenis = (window as unknown as { lenis?: { scrollTo: (target: HTMLElement, opts?: { duration?: number }) => void } }).lenis;
          if (lenis) {
            lenis.scrollTo(el as HTMLElement, { duration: 1.0 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, opts: { immediate: boolean; force?: boolean }) => void; reset?: () => void } }).lenis;
    if (lenis) {
      if (typeof lenis.reset === 'function') lenis.reset();
      lenis.scrollTo(0, { immediate: true, force: true });
    }
  }, [pathname, hash]);

  return <div key={pathname}>{children}</div>;
};
