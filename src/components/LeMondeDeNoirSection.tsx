import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';

export type CategoryKey = 'LUMIÈRE' | 'MATIÈRE' | 'GESTE' | 'SAVEUR';

export interface PhotoArchiveItem {
  id: string;
  image: string;
  alt: string;
  caption: string;
  subcaption: string;
  role: 'dominant' | 'secondary' | 'detail-1' | 'detail-2';
  aspectRatio: string;
}

export interface LeMondeDeNoirSectionProps {
  onOpenLightbox?: (item: { src: string; alt: string; caption?: string }) => void;
}

const CATEGORIES: CategoryKey[] = ['LUMIÈRE', 'MATIÈRE', 'GESTE', 'SAVEUR'];

const CATEGORY_DATA: Record<CategoryKey, {
  mood: string;
  description: string;
  photos: PhotoArchiveItem[];
}> = {
  'LUMIÈRE': {
    mood: 'Clair-obscur · Architecture · Pénombre',
    description: 'La nuit parisienne s’infiltre par les verrières. Des faisceaux précis sculptent les tables et les silences.',
    photos: [
      {
        id: 'lum-1',
        image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=85',
        alt: 'Douze tables sous faisceaux suspendus dans la salle sombre de NOIR Paris',
        caption: '01 / LA SALLE — PARIS, 21:14',
        subcaption: 'Clair-obscur architectural sous faisceaux suspendus',
        role: 'dominant',
        aspectRatio: '16/11'
      },
      {
        id: 'lum-2',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85',
        alt: 'Cave voûtée éclairée à la bougie et flacons de vin nature',
        caption: '02 / LE CELLIER — LUMIÈRE TAMISÉE',
        subcaption: 'Ombre et conservation des flacons vivants',
        role: 'secondary',
        aspectRatio: '3/4'
      },
      {
        id: 'lum-3',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=85',
        alt: 'Pavés de Paris la nuit sous la lumière d’un réverbère près du Palais-Royal',
        caption: '03 / PARIS 1ER — MINUIT',
        subcaption: 'L’éclat des réverbères sur le pavé humide',
        role: 'detail-1',
        aspectRatio: '4/5'
      },
      {
        id: 'lum-4',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=85',
        alt: 'Braises incandescentes de charbon binchotan dans la pénombre',
        caption: '04 / LES BRAISES — OMBRE & FEU',
        subcaption: 'Luminescence minérale du binchotan',
        role: 'detail-2',
        aspectRatio: '16/10'
      }
    ]
  },
  'MATIÈRE': {
    mood: 'Texture · Minéralité · Éléments Bruts',
    description: 'Racines sauvages, écorces, herbes cueillies à l’aube et textures préservées dans leur vérité première.',
    photos: [
      {
        id: 'mat-1',
        image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1400&q=85',
        alt: 'Botanique sauvage, racines anciennes et aiguilles de pin sur ardoise sombre',
        caption: '01 / BOTANIQUE SAUVAGE — À L’AUBE',
        subcaption: 'Oseille des bois, racines et aiguilles de pin',
        role: 'dominant',
        aspectRatio: '16/11'
      },
      {
        id: 'mat-2',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1400&q=85',
        alt: 'Légumes anciens et textures brutes de terroir',
        caption: '02 / LA TERRE — L’ÉLÉMENT BRUT',
        subcaption: 'Topinambour, betterave crapaudine et fleur de sel',
        role: 'secondary',
        aspectRatio: '3/4'
      },
      {
        id: 'mat-3',
        image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1400&q=85',
        alt: 'Chocolat noir Guanaja pur et sarrasin torréfié',
        caption: '03 / LE GRAIN — MINÉRALITÉ',
        subcaption: 'Cristaux de sel et cabosse torréfiée',
        role: 'detail-1',
        aspectRatio: '4/5'
      },
      {
        id: 'mat-4',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=85',
        alt: 'Sel marin pur et minéralité côtière',
        caption: '04 / EXTRACTION — TERROIR PUR',
        subcaption: 'Cristallisation saline et fenouil de roche',
        role: 'detail-2',
        aspectRatio: '16/10'
      }
    ]
  },
  'GESTE': {
    mood: 'Précision · Savoir-faire · Tension',
    description: 'La millimétrie du couteau, la maîtrise du feu et le rituel silencieux répété avant chaque service.',
    photos: [
      {
        id: 'ges-1',
        image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1400&q=85',
        alt: 'Chef Élise Moreau dressant à la pince avec concentration',
        caption: '01 / AVANT SERVICE — ÉLISE MOREAU',
        subcaption: 'Discipline millimétrique et tension de la pince',
        role: 'dominant',
        aspectRatio: '16/11'
      },
      {
        id: 'ges-2',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85',
        alt: 'Mains du sommelier ouvrant délicatement un grand cru',
        caption: '02 / LE SERVICE — RITUEL SILENCIEUX',
        subcaption: 'Mouvement mesuré du flacon vers le cristal',
        role: 'secondary',
        aspectRatio: '3/4'
      },
      {
        id: 'ges-3',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=85',
        alt: 'Découpe nette d’ingrédients au couteau d’artisan',
        caption: '03 / L’INCISION — LAME JAPONAISE',
        subcaption: 'La coupe nette qui préserve la texture de la chair',
        role: 'detail-1',
        aspectRatio: '4/5'
      },
      {
        id: 'ges-4',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
        alt: 'Cuisson contrôlée sur braises incandescentes',
        caption: '04 / LA JUSTE CUISSON — INSTANT UNIQUE',
        subcaption: 'Saisir la fumée avant le repos sous cloche',
        role: 'detail-2',
        aspectRatio: '16/10'
      }
    ]
  },
  'SAVEUR': {
    mood: 'Harmonies · Contrastes · Mémoire',
    description: 'Une architecture de saveurs où l’acidité réveille le gras, l’amertume structure la douceur, et la nuit reste gravée.',
    photos: [
      {
        id: 'sav-1',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85',
        alt: 'Saint-Jacques d’Erquy nacrée, topinambour et noisette',
        caption: '01 / PREMIER SERVICE — COQUILLES SAINT-JACQUES',
        subcaption: 'Nacrée à cœur, noisette du Piémont et émulsion',
        role: 'dominant',
        aspectRatio: '16/11'
      },
      {
        id: 'sav-2',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=85',
        alt: 'Pigeon de Bresse cuit rosé sur braises et jus concentré',
        caption: '02 / PLATS — PIGEON DE BRESSE',
        subcaption: 'Jus concentré au genièvre, chicorée laquée',
        role: 'secondary',
        aspectRatio: '3/4'
      },
      {
        id: 'sav-3',
        image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1400&q=85',
        alt: 'Ganache Guanaja 75% et sorbet café froid',
        caption: '03 / ÉPILOGUE — GUANAJA & SARRASIN',
        subcaption: 'Amertume du cacao et fraîcheur du café infusé',
        role: 'detail-1',
        aspectRatio: '4/5'
      },
      {
        id: 'sav-4',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=85',
        alt: 'Poisson de ligne et extraction d’iode',
        caption: '04 / L’EMPREINTE — TRACE DE LA NUIT',
        subcaption: 'Longueur en bouche et salinité persistante',
        role: 'detail-2',
        aspectRatio: '16/10'
      }
    ]
  }
};

export const LeMondeDeNoirSection: React.FC<LeMondeDeNoirSectionProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('LUMIÈRE');
  const [isCrossFading, setIsCrossFading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // References for FLIP shared-element coordinates
  const sectionRef = useRef<HTMLElement>(null);
  const inlineRefs = useRef<Record<CategoryKey, HTMLElement | null>>({
    'LUMIÈRE': null,
    'MATIÈRE': null,
    'GESTE': null,
    'SAVEUR': null
  });
  const dockedRefs = useRef<Record<CategoryKey, HTMLElement | null>>({
    'LUMIÈRE': null,
    'MATIÈRE': null,
    'GESTE': null,
    'SAVEUR': null
  });

  // Track initial measurements for FLIP invert
  const pendingFlip = useRef<'OPEN' | null>(null);
  const cachedRects = useRef<Record<CategoryKey, DOMRect | null>>({
    'LUMIÈRE': null,
    'MATIÈRE': null,
    'GESTE': null,
    'SAVEUR': null
  });

  /**
   * REVERSE FLIP TRANSFORMATION: IMAGES → WORDS → TEXT
   * Triggered when clicking the central circle ◯, the already active word, or pressing Escape
   */
  const closeArchive = useCallback(() => {
    if (!isOpen || isExiting) return;

    // 1. Measure FIRST state (docked column coordinates on the left side)
    CATEGORIES.forEach(word => {
      const el = dockedRefs.current[word];
      if (el) {
        cachedRects.current[word] = el.getBoundingClientRect();
      }
    });

    // 2. Play smooth disappearing animation on the images
    setIsExiting(true);

    // 3. Simultaneously animate inline words from docked left positions back to inline sentence positions
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      CATEGORIES.forEach(word => {
        const first = cachedRects.current[word];
        const inlineEl = inlineRefs.current[word];
        if (first && inlineEl) {
          const last = inlineEl.getBoundingClientRect();
          const dx = first.left - last.left;
          const dy = first.top - last.top;

          // Invert
          inlineEl.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
          inlineEl.style.transition = 'none';

          // Force reflow
          void inlineEl.offsetHeight;

          // Play
          requestAnimationFrame(() => {
            inlineEl.style.transition = 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
            inlineEl.style.transform = 'translate3d(0px, 0px, 0)';
          });

          // Clean up transform style after completion
          setTimeout(() => {
            if (inlineEl) {
              inlineEl.style.transform = '';
              inlineEl.style.transition = '';
            }
          }, 950);
        }
      });
    }

    // 4. Wait for exit animation to complete smoothly before fully switching state
    setTimeout(() => {
      setIsOpen(false);
      setIsExiting(false);
    }, 750);
  }, [isOpen, isExiting]);

  /**
   * FLIP TRANSFORMATION: TEXT → WORDS → IMAGES
   * Triggered when clicking any of the 4 highlighted words
   * If clicking the already selected word: closes archive and returns to original text!
   */
  const openCategory = useCallback((category: CategoryKey) => {
    if (isExiting) return;

    if (isOpen && activeCategory === category) {
      // User clicked on the already selected word -> return to original text!
      closeArchive();
      return;
    }

    if (!isOpen) {
      // 1. Measure FIRST state (inline sentence coordinates)
      CATEGORIES.forEach(word => {
        const el = inlineRefs.current[word];
        if (el) {
          cachedRects.current[word] = el.getBoundingClientRect();
        }
      });

      pendingFlip.current = 'OPEN';
      setActiveCategory(category);
      setAnimKey(k => k + 1);
      setIsOpen(true);
    } else {
      // Already open: switch category smoothly with disappearing fade on old images & description
      setIsCrossFading(true);
      setTimeout(() => {
        setActiveCategory(category);
        setAnimKey(k => k + 1);
        setIsCrossFading(false);
      }, 240);
    }
  }, [isOpen, activeCategory, isExiting, closeArchive]);

  /**
   * Keyboard Navigation (Escape to close)
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isExiting) {
        closeArchive();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isExiting, closeArchive]);

  /**
   * FLIP EXECUTION in useLayoutEffect:
   * Measures LAST coordinates, calculates invert vector (dx, dy), and plays 60fps GPU transition
   */
  useLayoutEffect(() => {
    if (!pendingFlip.current) return;
    pendingFlip.current = null;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Animate docked words from inline sentence positions to docked left column positions
    CATEGORIES.forEach(word => {
      const first = cachedRects.current[word];
      const dockedEl = dockedRefs.current[word];
      if (first && dockedEl) {
        const last = dockedEl.getBoundingClientRect();
        const dx = first.left - last.left;
        const dy = first.top - last.top;

        // Invert
        dockedEl.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        dockedEl.style.transition = 'none';

        // Force reflow
        void dockedEl.offsetHeight;

        // Play
        requestAnimationFrame(() => {
          dockedEl.style.transition = 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), color 0.4s ease';
          dockedEl.style.transform = 'translate3d(0px, 0px, 0)';
        });
      }
    });
  }, [isOpen]);

  const currentCategoryData = CATEGORY_DATA[activeCategory];

  return (
    <section
      ref={sectionRef}
      className={`chapter monde-section ${isOpen && !isExiting ? 'is-archive-mode' : 'is-text-mode'}`}
      id="gallery"
      aria-label="04 / Le Monde de NOIR"
    >
      {/* Ambient background atmosphere */}
      <div className="spot top" aria-hidden="true" />
      <div className="monde-subtle-glow" aria-hidden="true" />

      <div className="inner monde-inner">
        {/* =========================================================================
            SECTION HEADER: 04 / LE MONDE DE NOIR
            Title with Stylized 04 SVG Numeral Emblem on the Left Side
            ========================================================================= */}
        <header className="monde-header">
          <div className="monde-main-title-lockup">
            {/* Stylized 04 SVG Numeral Emblem on the Left side of the Title */}
            <div className="monde-numeral-lockup rv" aria-hidden="true">
              <svg
                className="monde-numeral-svg"
                viewBox="0 0 280 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line className="monde-accent-line" x1="16" y1="0" x2="16" y2="40" stroke="#a65a44" strokeWidth="1.2" />
                <circle className="monde-arc-primary" cx="170" cy="100" r="75" stroke="#a65a44" strokeWidth="1" opacity="0.5" />
                <path className="monde-arc-secondary" d="M 22,140 A 100,100 0 0,1 240,45" stroke="#a65a44" strokeWidth="0.8" opacity="0.35" />
                <line className="monde-baseline" x1="16" y1="165" x2="95" y2="165" stroke="#a65a44" strokeWidth="1" opacity="0.5" />
                <text
                  className="monde-num"
                  x="14"
                  y="158"
                  fill="#a65a44"
                  fontFamily="'Bodoni Moda', Didot, Georgia, serif"
                  fontSize="140"
                  fontWeight="400"
                  letterSpacing="-0.04em"
                >
                  04
                </text>
              </svg>
            </div>

            <div className="monde-title-text-wrap">
              <h2 className="monde-section-title rv rv2">
                <span>Le Monde</span> <i>de NOIR.</i>
              </h2>
            </div>
          </div>
          <div className="h2rule rv rv2" aria-hidden="true" />
        </header>

        {/* =========================================================================
            STAGES CONTAINER: SINGLE-CELL CSS GRID OVERLAY
            Both text stage and archive stage share the same grid area!
            Zero height collapse, zero sudden jump, ultra-smooth cross-dissolve
            ========================================================================= */}
        <div className="monde-stages-container">
          {/* STATE 1: INITIAL EDITORIAL TEXT COMPOSITION */}
          <div
            className={`monde-text-stage ${isOpen && !isExiting ? 'monde-stage-dissolved' : 'monde-stage-active'} ${isExiting ? 'is-stage-returning' : ''}`}
            aria-hidden={isOpen && !isExiting}
          >
            <div className="monde-editorial-container">
              <p className="monde-editorial-para">
                <span className="monde-ghost-text">La </span>
                <button
                  type="button"
                  ref={el => { inlineRefs.current['LUMIÈRE'] = el; }}
                  className="monde-keyword-trigger"
                  onClick={() => openCategory('LUMIÈRE')}
                  aria-label="Ouvrir le monde photographique de la LUMIÈRE"
                >
                  LUMIÈRE
                </button>
                <span className="monde-ghost-text">
                  {' '}révèle ce que l’ombre cherche à préserver. Dans chaque assiette, la{' '}
                </span>
                <button
                  type="button"
                  ref={el => { inlineRefs.current['MATIÈRE'] = el; }}
                  className="monde-keyword-trigger"
                  onClick={() => openCategory('MATIÈRE')}
                  aria-label="Ouvrir le monde photographique de la MATIÈRE"
                >
                  MATIÈRE
                </button>
                <span className="monde-ghost-text">
                  {' '}devient langage, guidée par le{' '}
                </span>
                <button
                  type="button"
                  ref={el => { inlineRefs.current['GESTE'] = el; }}
                  className="monde-keyword-trigger"
                  onClick={() => openCategory('GESTE')}
                  aria-label="Ouvrir le monde photographique du GESTE"
                >
                  GESTE
                </button>
                <span className="monde-ghost-text">
                  {' '}précis de ceux qui la travaillent. Les textures, les températures et les contrastes composent une expérience où chaque{' '}
                </span>
                <button
                  type="button"
                  ref={el => { inlineRefs.current['SAVEUR'] = el; }}
                  className="monde-keyword-trigger"
                  onClick={() => openCategory('SAVEUR')}
                  aria-label="Ouvrir le monde photographique de la SAVEUR"
                >
                  SAVEUR
                </button>
                <span className="monde-ghost-text">
                  {' '}trouve sa place, avant de laisser derrière elle une sensation, un souvenir, une trace de la nuit.
                </span>
              </p>
            </div>
          </div>

          {/* STATE 2: SELECTED STATE / PHOTOGRAPHIC ARCHIVE */}
          <div
            className={`monde-archive-stage ${isOpen ? 'monde-archive-active' : 'monde-archive-hidden'} ${isExiting ? 'is-stage-exiting' : ''}`}
            aria-hidden={!isOpen}
          >
            <div className="monde-archive-grid">
              {/* LEFT: DOCKED WORD NAVIGATION */}
              <nav className={`monde-nav-col ${isExiting ? 'is-exiting' : ''}`} aria-label="Chapitres photographiques">
                <ul className="monde-nav-list" role="tablist">
                  {CATEGORIES.map(word => {
                    const isActive = activeCategory === word;
                    return (
                      <li key={word} className="monde-nav-item" role="presentation">
                        <button
                          type="button"
                          ref={el => { dockedRefs.current[word] = el; }}
                          role="tab"
                          aria-selected={isActive}
                          tabIndex={isOpen ? 0 : -1}
                          className={`monde-docked-word ${isActive ? 'is-active' : ''}`}
                          onClick={() => openCategory(word)}
                          title={isActive ? 'Cliquer pour fermer et revenir au texte' : `Ouvrir le chapitre ${word}`}
                        >
                          <span className="monde-docked-indicator" aria-hidden="true" />
                          <span className="monde-docked-text">{word}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Active Category Description / Mood Note */}
                <div
                  className={`monde-category-info ${isCrossFading ? 'is-crossfading' : ''}`}
                  aria-live="polite"
                >
                  <p className="monde-category-mood">{currentCategoryData.mood}</p>
                  <p className="monde-category-desc">{currentCategoryData.description}</p>
                  <div className="monde-category-rule" aria-hidden="true" />
                </div>
              </nav>

              {/* RIGHT: ASYMMETRIC PHOTOGRAPHIC COMPOSITION (Framed like Philosophy) */}
              <div
                className={`monde-photos-cluster ${isCrossFading ? 'is-crossfading' : ''} ${isExiting ? 'is-exiting' : ''}`}
              >
                {isOpen && currentCategoryData.photos.map((photo) => (
                  <div
                    key={`${photo.id}-${animKey}`}
                    className={`monde-photo-card card-${photo.role}`}
                    aria-hidden="true"
                  >
                    <div className="monde-photo-frame">
                      <div
                        className="monde-photo-wrap"
                        style={{ aspectRatio: photo.aspectRatio }}
                      >
                        <img
                          src={photo.image}
                          alt={photo.alt}
                          loading="lazy"
                          className="monde-photo-img"
                        />
                        <div className="monde-photo-tint" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
