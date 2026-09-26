import React, { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SENSORY_WORDS = [
  'RAFFINEMENT',
  'SUBTILITÉ',
  'ONCTUOSITÉ',
  'PROFONDEUR',
  'PERSISTANCE',
  'DÉLICATESSE',
  'PRÉCISION',
  'INTENSITÉ',
  'HARMONIE',
  'CONTRASTE',
  'TEMPÉRATURE',
  'COMPOSITION',
  'MATURATION',
  'MINÉRALITÉ',
  'TEXTURE',
  'FRAGRANCE',
  'SENSUALITÉ',
  'ÉQUILIBRE',
  'RÉSONANCE',
  'ÉVANESCENCE',
  'CONCENTRATION',
  'TRANSPARENCE',
  'CONTEMPLATION',
  'DISTINCTION',
  'SINGULARITÉ',
];

/**
 * Splits a word into individual <span> letter elements inside a container.
 */
function renderLetters(container: HTMLElement, word: string) {
  container.innerHTML = '';
  for (const char of word) {
    const span = document.createElement('span');
    span.className = 'noir-lexicon-letter';
    span.textContent = char;
    container.appendChild(span);
  }
}

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const indexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const cycleWord = useCallback(() => {
    const container = wordRef.current;
    if (!container || isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const letters = container.querySelectorAll('.noir-lexicon-letter');

    // === EXIT: all letters dissolve together, fast (0.3s) ===
    gsap.to(letters, {
      opacity: 0,
      y: -6,
      filter: 'blur(4px)',
      duration: 0.3,
      ease: 'power3.in',
      stagger: 0.015,
      onComplete: () => {
        // Advance to next word
        indexRef.current = (indexRef.current + 1) % SENSORY_WORDS.length;
        renderLetters(container, SENSORY_WORDS[indexRef.current]);
        const newLetters = container.querySelectorAll('.noir-lexicon-letter');

        // === ENTER: letters cascade in one-by-one, fast stagger ===
        gsap.fromTo(
          newLetters,
          {
            opacity: 0,
            y: 10,
            filter: 'blur(6px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.35,
            stagger: 0.025,
            ease: 'power2.out',
            onComplete: () => {
              isAnimatingRef.current = false;
            },
          }
        );
      },
    });
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || !footerRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Subtle scroll scrub for the giant signature
      if (signatureRef.current) {
        gsap.fromTo(
          signatureRef.current,
          { yPercent: 6 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 1.2,
            },
          }
        );
      }

      // 2. Staggered editorial reveal sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      if (dividerRef.current) {
        tl.fromTo(
          dividerRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: 'power2.out' },
          0
        );
      }

      if (linksRef.current) {
        const linkItems = linksRef.current.children;
        tl.fromTo(
          linkItems,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.06,
            ease: 'power2.out',
          },
          0.2
        );
      }

      if (copyRef.current) {
        tl.fromTo(
          copyRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.7, ease: 'power2.out' },
          0.45
        );
      }

      if (signatureRef.current) {
        tl.fromTo(
          signatureRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.4, ease: 'power3.out' },
          0.3
        );
      }

      // 3. Initial word: render letters and stagger them in
      if (wordRef.current) {
        renderLetters(wordRef.current, SENSORY_WORDS[0]);
        const initialLetters = wordRef.current.querySelectorAll('.noir-lexicon-letter');
        gsap.fromTo(
          initialLetters,
          { opacity: 0, y: 12, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.4,
            stagger: 0.03,
            delay: 1.0,
            ease: 'power2.out',
          }
        );
      }
    }, footerRef);

    // Word cycling interval
    const interval = setInterval(cycleWord, 3400);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, [cycleWord]);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      const lenis = (window as unknown as { lenis?: { scrollTo: (target: number | string | HTMLElement, opts?: { immediate?: boolean }) => void } }).lenis;
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <footer
      ref={footerRef}
      className="noir-footer"
      id="site-footer"
      aria-label="Informations légales et signature NOIR"
    >
      {/* Top subtle hairline divider */}
      <div ref={dividerRef} className="noir-footer-divider" aria-hidden="true" />

      {/* Layer 1: Information Area */}
      <div className="noir-footer-info">
        <div className="noir-footer-lower">
          <nav
            ref={linksRef}
            className="noir-footer-nav"
            aria-label="Navigation secondaire"
          >
            <Link to="/" className="noir-footer-link">
              <span className="noir-link-text">Accueil</span>
              <span className="noir-link-line" aria-hidden="true" />
            </Link>

            <Link to="/menus" className="noir-footer-link">
              <span className="noir-link-text">Menu</span>
              <span className="noir-link-line" aria-hidden="true" />
            </Link>

            <Link to="/reservation" className="noir-footer-link">
              <span className="noir-link-text">Réservation</span>
              <span className="noir-link-line" aria-hidden="true" />
            </Link>

            <Link to="/about" className="noir-footer-link">
              <span className="noir-link-text">À propos</span>
              <span className="noir-link-line" aria-hidden="true" />
            </Link>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="noir-footer-link"
            >
              <span className="noir-link-text">Facebook</span>
              <span className="noir-link-line" aria-hidden="true" />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="noir-footer-link"
            >
              <span className="noir-link-text">Instagram</span>
              <span className="noir-link-line" aria-hidden="true" />
            </a>
          </nav>

          <div ref={copyRef} className="noir-footer-copyright">
            <p>© NOIR {new Date().getFullYear()} · Tous droits réservés</p>
          </div>
        </div>
      </div>

      {/* Layer 2: Giant NOIR + Single Sensory Word Overlay */}
      <div
        ref={signatureRef}
        className="noir-footer-signature"
        aria-hidden="true"
      >
        <span className="noir-footer-giant-text">NOIR</span>

        {/* One word at a time — letters cascade in/out */}
        <div className="noir-footer-lexicon">
          <span ref={wordRef} className="noir-lexicon-word" />
        </div>
      </div>
    </footer>
  );
};
