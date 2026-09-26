import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { restaurantInfo } from '../../data/restaurant';
import { ExperienceSection } from '../../components/ExperienceSection';
import { LaCarteSection } from '../../components/LaCarteSection';
import { LeMondeDeNoirSection } from '../../components/LeMondeDeNoirSection';
import { TrouverNoirSection } from '../../components/TrouverNoirSection';
import { SoireeCommenceIciSection } from '../../components/SoireeCommenceIciSection';

interface HomePageProps {
  onOpenReservation: () => void;
}

interface LightboxState {
  isOpen: boolean;
  src: string;
  alt: string;
  caption?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenReservation }) => {
  useScrollReveal();
  const location = useLocation();

  // Active state for interactive sections
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    src: '',
    alt: '',
    caption: '',
  });

  // Track initial mount so page load/refresh always starts at the top (0, 0)
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Only smooth scroll to hash anchor if the user clicks an in-page link after mounting
    if (location.hash && location.hash !== '#hero') {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          const lenis = (window as unknown as { lenis?: { scrollTo: (target: HTMLElement, opts?: { duration?: number }) => void } }).lenis;
          if (lenis) {
            lenis.scrollTo(el as HTMLElement, { duration: 1.0 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    }
  }, [location.hash]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightbox.isOpen) {
        setLightbox({ isOpen: false, src: '', alt: '' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.isOpen]);

  // Subtle luxury parallax for philosophy image on scroll
  const philosophyWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (philosophyWrapRef.current) {
            const rect = philosophyWrapRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.bottom >= -100 && rect.top <= windowHeight + 100) {
              const elementCenter = rect.top + rect.height / 2;
              const viewportCenter = windowHeight / 2;
              const distanceFromCenter = elementCenter - viewportCenter;
              // Very subtle, smooth parallax drift (~15-25px range)
              const translateY = distanceFromCenter * 0.045;
              philosophyWrapRef.current.style.setProperty('--parallax-y', `${translateY.toFixed(2)}px`);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="noir-home">
      {/* =========================================================================
          01 — HERO: ESTABLISH THE WORLD OF NOIR
          Identity · Paris · Cuisine Française Contemporaine · Refinement & Mystery
          ========================================================================= */}
      <section className="hero" id="hero" aria-label="NOIR Paris">
        <div className="bg">
          <picture>
            <source
              media="(max-width: 700px)"
              srcSet="/images/hero/hero-moody-dining-700.jpg"
            />
            <source
              media="(max-width: 1600px)"
              srcSet="/images/hero/hero-moody-dining-1600.jpg"
            />
            <img
              src="/images/hero/hero-moody-dining-2400.jpg"
              alt="NOIR Paris dining room with dark charcoal architectural walls, pendant spotlighting, and dark minimalist table settings"
              referrerPolicy="no-referrer"
            />
          </picture>
        </div>

        <div className="grade" aria-hidden="true" />
        <div className="warm" aria-hidden="true" />

        {/* CENTER STAGE: Refined Architectural Layout with Big Mid-Hero Logo Anchor */}
        <div className="hero-stage-center" id="hero-center-stage">
          {/* Reserved anchor space for the big NOIR logo */}
          <div id="hero-logo-anchor" className="hero-logo-anchor" aria-hidden="true" />

          <div className="hero-center-rule" aria-hidden="true" />

          <p className="hero-claim" id="hero-claim">
            <span className="hero-mask-wrap">
              <span className="hero-mask-inner">
                A contemporary expression of French cuisine.
              </span>
            </span>
          </p>
        </div>
      </section>

      {/* =========================================================================
          02 — PHILOSOPHY: L’ESSENCE AVANT TOUT
          Two-column editorial layout: Left image / Right stylized 01 emblem + manifesto
          ========================================================================= */}
      <section className="chapter philosophy-section" id="philosophy">
        <div className="spot left" aria-hidden="true" />
        <div className="inner">
          <div className="philosophy-layout">
            
            {/* LEFT COLUMN: Framed Culinary Image */}
            <div className="philosophy-media-col rv">
              <div className="philosophy-image-frame">
                <div className="philosophy-image-wrap" ref={philosophyWrapRef}>
                  <img
                    src="/images/philosophy/philosophy-essence.jpg"
                    alt="L’Essence avant tout — Gastronomie et création contemporaine chez NOIR"
                    loading="lazy"
                  />
                  <div className="philosophy-image-tint" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Stylized 01 Emblem, Title & Manifesto */}
            <div className="philosophy-content-col">
              
              {/* STYLIZED 01 EMBLEM — Matching reference: large Bodoni numerals, 
                  overlapping orbital arcs, dot accent, vertical hairline.
                  Color: #a65a44 warm terracotta copper */}
              <div className="philosophy-numeral-lockup rv" aria-hidden="true">
                <svg
                  className="philosophy-numeral-svg"
                  viewBox="0 0 380 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Vertical accent line — top-left */}
                  <line
                    className="phil-accent-line"
                    x1="22" y1="0" x2="22" y2="58"
                    stroke="#a65a44" strokeWidth="1.2"
                  />

                  {/* Primary full orbital circle — wraps behind numerals */}
                  <circle
                    className="phil-arc-primary"
                    cx="240" cy="155" r="120"
                    stroke="#a65a44" strokeWidth="1" opacity="0.6"
                  />

                  {/* Secondary partial arc — sweeps from lower-left to upper-right */}
                  <path
                    className="phil-arc-secondary"
                    d="M 30,220 A 160,160 0 0,1 340,85"
                    stroke="#a65a44" strokeWidth="0.9" opacity="0.4"
                  />

                  {/* Horizontal baseline rule under the numeral */}
                  <line
                    className="phil-baseline"
                    x1="22" y1="270" x2="120" y2="270"
                    stroke="#a65a44" strokeWidth="1" opacity="0.5"
                  />

                  {/* Large Bodoni numeral "0" */}
                  <text
                    className="phil-num phil-num-0"
                    x="18" y="260"
                    fill="#a65a44"
                    fontFamily="'Bodoni Moda', Didot, Georgia, serif"
                    fontSize="220"
                    fontWeight="400"
                    letterSpacing="-0.04em"
                  >
                    0
                  </text>

                  {/* Large Bodoni numeral "1" */}
                  <text
                    className="phil-num phil-num-1"
                    x="168" y="260"
                    fill="#a65a44"
                    fontFamily="'Bodoni Moda', Didot, Georgia, serif"
                    fontSize="220"
                    fontWeight="400"
                    letterSpacing="-0.04em"
                  >
                    1
                  </text>
                </svg>
              </div>

              {/* TITLE */}
              <h2 className="philosophy-title rv rv2">
                <span>L’ESSENCE</span> <i>AVANT TOUT</i>
              </h2>
              <div className="h2rule rv rv2" aria-hidden="true" />

              {/* EDITORIAL MANIFESTO */}
              <div className="philosophy-text-group rv rv3">
                <p className="philosophy-para philosophy-lead">
                  La tradition française constitue notre langage, tandis que la technique permet de révéler la nature du{' '}
                  <span className="philosophy-highlight">produit</span>, ses textures, ses températures et ses contrastes. Chaque création est pensée avec précision et retenue, où chaque élément possède une{' '}
                  <span className="philosophy-highlight">raison d’être</span>.
                </p>
                <p className="philosophy-para">
                  Une cuisine contemporaine où l’essentiel n’est jamais ce que l’on{' '}
                  <span className="philosophy-highlight">ajoute</span>, mais ce que l’on parvient à{' '}
                  <span className="philosophy-highlight">révéler</span>. Chaque assiette cherche un équilibre entre simplicité et profondeur, laissant au produit sa place, au geste son importance et à l’émotion le dernier mot.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          04 — THE EXPERIENCE: FIVE MOMENTS. ONE EVENING.
          ARRIVE → OBSERVE → TASTE → DISCOVER → REMEMBER
          Choreographed horizontal storytelling pinned with GSAP ScrollTrigger
          ========================================================================= */}
      <ExperienceSection />

      {/* =========================================================================
          05 — LA CARTE / MENU PREVIEW
          Editorial Photographic Collage · Curated Wall of Selected Creations
          ========================================================================= */}
      <LaCarteSection />

      {/* =========================================================================
          04 — LE MONDE DE NOIR: INTERACTIVE EDITORIAL & PHOTOGRAPHIC ARCHIVE
          TEXT → WORDS → IMAGES → WORDS → TEXT
          Shared-element FLIP transformation across 4 visual chapters:
          LUMIÈRE · MATIÈRE · GESTE · SAVEUR
          ========================================================================= */}
      <LeMondeDeNoirSection />

      {/* =========================================================================
          07 — PRACTICAL INFORMATION / FIND NOIR: TROUVER NOIR
          Warm Ivory / Stone contrast page · Editorial typography · Architecture
          ========================================================================= */}
      <TrouverNoirSection onOpenReservation={onOpenReservation} />

      {/* =========================================================================
          06 / LA SOIRÉE COMMENCE ICI — FINAL CINEMATIC RESERVATION MOMENT
          Atmospheric nocturnal conclusion · GSAP vertical mask typography
          ========================================================================= */}
      <SoireeCommenceIciSection onOpenReservation={onOpenReservation} />

      {/* =========================================================================
          LIGHTBOX MODAL FOR VISUAL ARCHIVE
          ========================================================================= */}
      {lightbox.isOpen && (
        <div
          className="lightbox-backdrop"
          onClick={() => setLightbox({ isOpen: false, src: '', alt: '' })}
          role="dialog"
          aria-label="Image agrandie"
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setLightbox({ isOpen: false, src: '', alt: '' })}
            >
              Close [ESC]
            </button>
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              style={{
                width: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                margin: '0 auto',
                display: 'block',
              }}
            />
            <p
              style={{
                marginTop: '0.8rem',
                fontSize: '0.74rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'var(--linen)',
              }}
            >
              {lightbox.alt}
            </p>
            {lightbox.caption && (
              <p style={{ marginTop: '0.4rem', fontSize: '0.86rem', color: 'var(--soft)' }}>
                {lightbox.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
