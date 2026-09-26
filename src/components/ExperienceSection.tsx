import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface ExperienceMoment {
  number: string;
  title: string;
  subtitle: string;
  text: string;
  image: string;
  alt: string;
  locationTag: string;
}

export const experienceMoments: ExperienceMoment[] = [
  {
    number: '01',
    title: 'LE SEUIL',
    subtitle: 'La ville disparaît derrière vous.',
    text: 'Franchir la porte, quitter le tumulte et entrer dans un autre rythme.',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=85',
    alt: 'Le Seuil — Franchir la porte et entrer dans un autre rythme',
    locationTag: 'SEUIL NOCTURNE · PALAIS-ROYAL'
  },
  {
    number: '02',
    title: 'LE SILENCE',
    subtitle: 'La salle se révèle peu à peu.',
    text: 'La lumière, la pierre, le bois et les ombres composent l’atmosphère avant le premier service.',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=85',
    alt: 'Le Silence — Lumière, pierre et ombres avant le premier service',
    locationTag: 'DOUZE TABLES · OMBRE ET SILENCE'
  },
  {
    number: '03',
    title: 'LA PREMIÈRE NOTE',
    subtitle: 'Le goût devient découverte.',
    text: 'Des ingrédients familiers prennent une nouvelle forme, entre précision, texture et contraste.',
    image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1600&q=85',
    alt: 'La Première Note — Des ingrédients familiers sous une nouvelle forme',
    locationTag: 'EXTRACTION · MATIÈRE BRUTE'
  },
  {
    number: '04',
    title: 'LE GESTE',
    subtitle: 'Chaque détail a son importance.',
    text: 'Derrière chaque assiette, des gestes précis, des températures maîtrisées et une attention invisible.',
    image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=1600&q=85',
    alt: 'Le Geste — Gestes précis et températures maîtrisées',
    locationTag: 'LE GESTE · TERROIRS INVISIBLES'
  },
  {
    number: '05',
    title: 'L’EMPREINTE',
    subtitle: 'L’instant demeure après le dernier plat.',
    text: 'Une saveur, une lumière, une sensation. Le souvenir d’une soirée qui continue.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=85',
    alt: 'L’Empreinte — Le souvenir d’une soirée qui continue',
    locationTag: 'RÉSONANCE · APRÈS MINUIT'
  }
];

const AUTOPLAY_DURATION_MS = 10000; // 10 seconds

export const ExperienceSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'exit' | 'enter'>('idle');

  const sectionRef = useRef<HTMLElement>(null);

  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const lastTickTimeRef = useRef<number>(performance.now());
  const elapsedRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);
  const selectMomentRef = useRef<(index: number) => void>(() => {});

  // Switch to specific index with silky out-in crossfade
  const selectMoment = useCallback((index: number) => {
    if (index === activeIndexRef.current) return;

    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
    }
    if (finishTimerRef.current !== null) {
      window.clearTimeout(finishTimerRef.current);
    }

    const current = activeIndexRef.current;
    setPrevIndex(current);
    elapsedRef.current = 0;

    // Phase 1: Dissolve & upward glide current moment
    setTransitionPhase('exit');

    // Phase 2: Midway through exit (200ms), swap data and cascade enter
    transitionTimerRef.current = window.setTimeout(() => {
      setActiveIndex(index);
      setTransitionPhase('enter');

      // Phase 3: Settle into idle state after entrance completes
      finishTimerRef.current = window.setTimeout(() => {
        setTransitionPhase('idle');
      }, 520);
    }, 200);
  }, []);

  selectMomentRef.current = selectMoment;

  // 10s Autoplay timer loop
  useEffect(() => {
    lastTickTimeRef.current = performance.now();

    const loop = (currentTime: number) => {
      const delta = currentTime - lastTickTimeRef.current;
      lastTickTimeRef.current = currentTime;

      if (!isPausedRef.current) {
        elapsedRef.current += delta;

        if (elapsedRef.current >= AUTOPLAY_DURATION_MS) {
          elapsedRef.current = 0;
          const next = (activeIndexRef.current + 1) % experienceMoments.length;
          selectMomentRef.current(next);
        }
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
      if (finishTimerRef.current !== null) {
        window.clearTimeout(finishTimerRef.current);
      }
    };
  }, []);

  const activeMoment = experienceMoments[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="chapter experience-section"
      id="experience"
      aria-label="The NOIR Experience: Five Moments"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ATMOSPHERIC BACKGROUND LAYER: Smooth Cinematic Crossfade */}
      <div className="experience-ambient-bg" aria-hidden="true">
        {experienceMoments.map((moment, idx) => {
          const isActive = idx === activeIndex;
          const isPrev = idx === prevIndex && !isActive;
          return (
            <div
              key={moment.number}
              className={`exp-bg-slide ${isActive ? 'is-active' : ''} ${isPrev ? 'is-prev' : ''}`}
            >
              <img
                src={moment.image}
                alt=""
                className="exp-bg-slide-img"
              />
              <div className="exp-bg-slide-vignette" />
            </div>
          );
        })}
      </div>

      {/* TOP DECAYING BLACK SCRIM: Behind the title for crystal clarity */}
      <div className="experience-top-decay-scrim" aria-hidden="true" />

      <div className="spot right" aria-hidden="true" />
      <div className="inner">
        
        {/* Section Header Row — Big Title with Number 02 Emblem to the Left */}
        <div className="experience-header-block">
          <div className="experience-header-meta">
            <div className="experience-main-title-lockup">
              {/* Stylized 02 SVG Numeral Emblem on the Left side of the Title */}
              <div className="experience-numeral-lockup rv" aria-hidden="true">
                <svg
                  className="experience-numeral-svg"
                  viewBox="0 0 280 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line className="exp-accent-line" x1="16" y1="0" x2="16" y2="40" stroke="#a65a44" strokeWidth="1.2" />
                  <circle className="exp-arc-primary" cx="170" cy="100" r="75" stroke="#a65a44" strokeWidth="1" opacity="0.5" />
                  <path className="exp-arc-secondary" d="M 22,140 A 100,100 0 0,1 240,45" stroke="#a65a44" strokeWidth="0.8" opacity="0.35" />
                  <line className="exp-baseline" x1="16" y1="165" x2="95" y2="165" stroke="#a65a44" strokeWidth="1" opacity="0.5" />
                  <text
                    className="exp-num"
                    x="14"
                    y="158"
                    fill="#a65a44"
                    fontFamily="'Bodoni Moda', Didot, Georgia, serif"
                    fontSize="140"
                    fontWeight="400"
                    letterSpacing="-0.04em"
                  >
                    02
                  </text>
                </svg>
              </div>

              <div className="experience-title-text-wrap">
                <h2 className="experience-title rv rv2">
                  <span>L’</span><i>EXPÉRIENCE</i>
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="h2rule rv rv2" aria-hidden="true" />

        {/* Concept 2 Layout: Left Dossier Cards + Right Expanded Vitrine Showcase */}
        <div className="experience-dossier-layout rv rv3">
          
          {/* LEFT COLUMN: Contiguous Dossier Cards (Sticking to each other, title and number only) */}
          <div className="experience-cards-col">
            <div className="experience-cards-stack" role="tablist" aria-label="Moments de l’expérience">
              {experienceMoments.map((moment, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={moment.number}
                    type="button"
                    role="tab"
                    id={`exp-tab-${moment.number}`}
                    aria-selected={isActive}
                    aria-controls={`exp-panel-${moment.number}`}
                    className={`exp-dossier-card ${isActive ? 'is-active' : ''}`}
                    onClick={() => selectMoment(idx)}
                  >
                    {/* Darkened Image Preview with strong black gradient on left disappearing on right */}
                    <div className="exp-card-bg-wrap" aria-hidden="true">
                      <img
                        src={moment.image}
                        alt=""
                        className="exp-card-bg-img"
                      />
                      <div className="exp-card-bg-overlay" />
                    </div>

                    {/* Card Content: ONLY Number and Title */}
                    <div className="exp-card-content">
                      <div className="exp-card-num-lockup">
                        <span className="exp-card-num">{moment.number}</span>
                        <span className="exp-card-title">{moment.title}</span>
                      </div>
                      <span className="exp-card-indicator" aria-hidden="true">
                        <span className="exp-card-dot" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Pure Editorial Typography Showcase (No image frame, title & text only) */}
          <div
            className="experience-showcase-col"
            role="tabpanel"
            id={`exp-panel-${activeMoment.number}`}
            aria-labelledby={`exp-tab-${activeMoment.number}`}
          >
            <div className={`experience-showcase-details phase-${transitionPhase}`}>
              <div className="experience-detail-header">
                <div className="experience-title-wrap">
                  <h3 className="experience-moment-display-title">
                    <span className="exp-title-num">{activeMoment.number}</span>
                    <span className="exp-sep">—</span>
                    <i className="exp-title-name">{activeMoment.title}</i>
                  </h3>
                </div>
              </div>

              {/* Accent Line */}
              <div className="experience-h2rule" aria-hidden="true" />

              {/* Evocative Manifesto Statement */}
              <div className="experience-statement-box">
                <p className="experience-lead-statement">
                  « {activeMoment.text} »
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
