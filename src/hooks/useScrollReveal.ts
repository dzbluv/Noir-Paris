import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    document.documentElement.classList.add('js');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('on');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    const elements = document.querySelectorAll(
      '.rv, .num, .h2rule, .cols .col, .chapters li, .ladder, .ledger, .hours div, .notes p'
    );
    elements.forEach((el) => observer.observe(el));

    // Also trigger initial elements in viewport immediately
    const checkViewport = () => {
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) {
          el.classList.add('on');
        }
      });
    };

    const t1 = setTimeout(checkViewport, 100);
    const t2 = setTimeout(checkViewport, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      observer.disconnect();
    };
  }, []);
}
