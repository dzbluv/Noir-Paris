import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCurtainTransition } from './layout/CurtainTransition';

gsap.registerPlugin(ScrollTrigger);

interface SoireeCommenceIciSectionProps {
  onOpenReservation?: (type?: 'bench' | 'dining') => void;
}

export const SoireeCommenceIciSection: React.FC<SoireeCommenceIciSectionProps> = ({
  onOpenReservation,
}) => {
  const { transitionTo } = useCurtainTransition();
  const sectionRef = useRef<HTMLElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const numeralRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const inviteRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect accessibility settings
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Imperceptible breathing / parallax on the background image
      if (bgImgRef.current) {
        gsap.fromTo(
          bgImgRef.current,
          { scale: 1.08, yPercent: -2 },
          {
            scale: 1.01,
            yPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.4,
            },
          }
        );
      }

      // 2. Cinematic entry choreography: slowly slowing down as it reaches center stage
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Stage 1: Ambient darkness clears softly to reveal candlelight and textured shadows
      if (overlayRef.current) {
        tl.to(
          overlayRef.current,
          {
            opacity: 0.58,
            duration: 1.8,
            ease: 'power2.out',
          },
          0
        );
      }

      // Stage 2: Colossal 06 Numeral Dramatic Reveal (Draw + Soft Ethereal Clarification)
      if (numeralRef.current) {
        tl.fromTo(
          numeralRef.current,
          { opacity: 0, scale: 0.92, filter: 'blur(12px)', y: 28 },
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 1.25,
            ease: 'power3.out',
          },
          0.15
        );

        const paths = numeralRef.current.querySelectorAll('.soiree-draw-path');
        paths.forEach((path) => {
          const geom = path as unknown as SVGGeometryElement;
          if (geom && typeof geom.getTotalLength === 'function') {
            const length = geom.getTotalLength();
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            tl.to(
              path,
              { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out' },
              0.2
            );
          }
        });
      }

      // Stage 3: First Title Line (LA SOIRÉE) lifts through vertical mask
      if (line1Ref.current) {
        tl.fromTo(
          line1Ref.current,
          { yPercent: 108 },
          { yPercent: 0, duration: 1.05, ease: 'power3.out' },
          0.35
        );
      }

      // Stage 4: Second Title Line (COMMENCE ICI.) lifts through vertical mask
      if (line2Ref.current) {
        tl.fromTo(
          line2Ref.current,
          { yPercent: 108 },
          { yPercent: 0, duration: 1.05, ease: 'power3.out' },
          0.55
        );
      }

      // Stage 5: Supporting invitation
      if (inviteRef.current) {
        tl.fromTo(
          inviteRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
          0.9
        );
      }

      // Stage 6: Editorial text CTA link
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          1.1
        );
      }

      // Stage 7: Service information & metadata
      if (metaRef.current) {
        tl.fromTo(
          metaRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          1.3
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="soiree-section"
      id="reservation"
      aria-label="La Soirée Commence Ici — Réservation NOIR"
    >
      {/* =======================================================================
          CINEMATIC BACKGROUND LAYER
          Nocturnal atmosphere of the intimate Paris dining room after dusk
          ======================================================================= */}
      <div className="soiree-bg-stage" aria-hidden="true">
        <img
          ref={bgImgRef}
          src="/images/reservation/soiree-commence-ici.jpg"
          alt=""
          className="soiree-bg-img"
          loading="lazy"
        />

        {/* Ambient Darkened Film Veil */}
        <div ref={overlayRef} className="soiree-bg-overlay" />

        {/* Seamless Architectural Gradient Transitions (Top into Noir, Bottom into Footer) */}
        <div className="soiree-bg-gradient" />
      </div>

      {/* =======================================================================
          CENTERED EDITORIAL COMPOSITION
          No boxes, no cards, no borders. Pure typography breathing in darkness.
          ======================================================================= */}
      <div className="soiree-inner">
        {/* Big Dramatic 06 Architectural Numeral Lockup */}
        <div ref={numeralRef} className="soiree-numeral-lockup" aria-hidden="true">
          <svg
            className="soiree-numeral-svg"
            viewBox="0 0 320 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top accent hairline */}
            <line
              className="soiree-draw-path soiree-accent-line"
              x1="38"
              y1="0"
              x2="38"
              y2="42"
              stroke="#a65a44"
              strokeWidth="1.2"
            />
            {/* Primary celestial orbital circle */}
            <circle
              className="soiree-draw-path soiree-arc-primary"
              cx="200"
              cy="100"
              r="82"
              stroke="#a65a44"
              strokeWidth="1"
              opacity="0.5"
            />
            {/* Secondary elliptical orbital sweep */}
            <path
              className="soiree-draw-path soiree-arc-secondary"
              d="M 45,145 A 110,110 0 0,1 280,45"
              stroke="#a65a44"
              strokeWidth="0.8"
              opacity="0.35"
            />
            {/* Horizontal baseline rule */}
            <line
              className="soiree-draw-path soiree-baseline"
              x1="38"
              y1="168"
              x2="125"
              y2="168"
              stroke="#a65a44"
              strokeWidth="1"
              opacity="0.5"
            />
            {/* Colossal Bodoni Moda 06 Numeral */}
            <text
              className="soiree-num"
              x="35"
              y="158"
              fill="#a65a44"
              fontFamily="'Bodoni Moda', Didot, Georgia, serif"
              fontSize="155"
              fontWeight="400"
              letterSpacing="-0.04em"
            >
              06
            </text>
          </svg>
        </div>

        {/* Main Title: Vertical Mask Composition */}
        <h2 className="soiree-title">
          <span className="soiree-title-mask">
            <span ref={line1Ref} className="soiree-title-line line-primary">
              LA SOIRÉE
            </span>
          </span>
          <span className="soiree-title-mask">
            <span ref={line2Ref} className="soiree-title-line line-accent">
              COMMENCE ICI.
            </span>
          </span>
        </h2>

        {/* Supporting Invitation Line */}
        <p ref={inviteRef} className="soiree-invitation">
          Réservez votre table chez NOIR.
        </p>

        {/* Minimal Editorial Reservation CTA */}
        <div className="soiree-cta-wrap">
          <Link
            ref={ctaRef}
            to="/reservation"
            className="soiree-cta"
            aria-label="Réserver une table chez NOIR"
            onClick={(e) => {
              e.preventDefault();
              transitionTo('/reservation');
            }}
          >
            <span className="soiree-cta-label noir-roll-text">
              <span className="noir-roll-item is-main">RÉSERVER UNE TABLE</span>
              <span className="noir-roll-item is-hover" aria-hidden="true">RÉSERVER UNE TABLE</span>
            </span>
            <span className="soiree-cta-arrow" aria-hidden="true">
              →
            </span>
            <span className="soiree-cta-hairline" aria-hidden="true" />
          </Link>
        </div>

        {/* Service Information & Metadata */}
        <div ref={metaRef} className="soiree-meta">
          <p className="soiree-meta-hours">
            <span>MARDI — SAMEDI</span>
            <span className="soiree-meta-sep" aria-hidden="true">
              ·
            </span>
            <span>19:00 — 23:30</span>
          </p>
          <p className="soiree-meta-sub">
            12 TABLES · SERVICE DU SOIR
          </p>
        </div>
      </div>
    </section>
  );
};
