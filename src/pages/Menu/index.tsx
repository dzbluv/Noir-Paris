import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import {
  FIRST_GESTURES_DISHES,
  PROFONDEUR_DISHES,
  DESSERT_DISHES,
  PAIRINGS_LIST,
  MICRO_VOCABULARY,
  LE_VOCABULAIRE_DE_NOIR,
  CE_SOIR_DATA,
  EditorialDish,
  VocabularyItem
} from '../../data/menu';
import styles from './Menu.module.css';

gsap.registerPlugin(ScrollTrigger);

interface ChapterNumeralProps {
  num: string;
}

const ChapterNumeral: React.FC<ChapterNumeralProps> = ({ num }) => {
  const d0 = num[0] || '0';
  const d1 = num[1] || '1';
  return (
    <div className={`${styles.chapterNumeralLockup} philosophy-numeral-lockup rv`} aria-hidden="true">
      <svg
        className={`${styles.chapterNumeralSvg} philosophy-numeral-svg`}
        viewBox="0 0 380 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vertical accent line — top-left */}
        <line
          className="phil-accent-line"
          x1="32" y1="0" x2="32" y2="52"
          stroke="#a65a44" strokeWidth="1.2" opacity="0.8"
        />

        {/* Primary full orbital circle */}
        <circle
          className="phil-arc-primary"
          cx="220" cy="145" r="115"
          stroke="#a65a44" strokeWidth="1" opacity="0.55"
        />

        {/* Secondary partial arc */}
        <path
          className="phil-arc-secondary"
          d="M 30,210 A 155,155 0 0,1 330,80"
          stroke="#a65a44" strokeWidth="0.9" opacity="0.4"
        />

        {/* Horizontal baseline rule */}
        <line
          className="phil-baseline"
          x1="32" y1="255" x2="130" y2="255"
          stroke="#a65a44" strokeWidth="1" opacity="0.5"
        />

        {/* Large Bodoni numeral first digit */}
        <text
          className="phil-num phil-num-0"
          x="28" y="245"
          fill="#a65a44"
          fontFamily="'Bodoni Moda', Didot, Georgia, serif"
          fontSize="210"
          fontWeight="400"
          letterSpacing="-0.04em"
        >
          {d0}
        </text>

        {/* Large Bodoni numeral second digit */}
        <text
          className="phil-num phil-num-1"
          x="172" y="245"
          fill="#a65a44"
          fontFamily="'Bodoni Moda', Didot, Georgia, serif"
          fontSize="210"
          fontWeight="400"
          letterSpacing="-0.04em"
        >
          {d1}
        </text>
      </svg>
    </div>
  );
};

interface MenuPageProps {
  onOpenReservation?: (type?: 'bench' | 'dining') => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onOpenReservation }) => {
  useScrollReveal();
  const [activeDishId, setActiveDishId] = useState<string | null>('saint-jacques');
  const [activeVocabId, setActiveVocabId] = useState<string>('matiere');

  const rootRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const profondeurParallaxRef = useRef<HTMLSpanElement>(null);
  const soireeBgRef = useRef<HTMLImageElement>(null);
  const vocabTrackRef = useRef<HTMLDivElement>(null);

  // Slide the vocabulary track vertically to the active card
  useEffect(() => {
    const track = vocabTrackRef.current;
    if (!track) return;
    const activeIndex = LE_VOCABULAIRE_DE_NOIR.findIndex((item) => item.id === activeVocabId);
    if (activeIndex < 0) return;

    const cards = track.children;
    if (cards && cards.length > activeIndex) {
      const targetCard = cards[activeIndex] as HTMLElement;
      const targetY = targetCard.offsetTop;
      gsap.to(track, {
        y: -targetY,
        duration: 0.85,
        ease: 'power3.inOut',
      });
    }

    // On mobile, scroll the active horizontal tab into view
    const activeBtn = document.getElementById(`tab-${activeVocabId}`);
    if (activeBtn && window.innerWidth <= 768) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeVocabId]);

  // Recalculate track position on window resize/orientation change
  useEffect(() => {
    const handleResize = () => {
      const track = vocabTrackRef.current;
      if (!track) return;
      const activeIndex = LE_VOCABULAIRE_DE_NOIR.findIndex((item) => item.id === activeVocabId);
      if (activeIndex < 0) return;
      const cards = track.children;
      if (cards && cards.length > activeIndex) {
        const targetCard = cards[activeIndex] as HTMLElement;
        gsap.set(track, { y: -targetCard.offsetTop });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeVocabId]);

  useEffect(() => {
    // 1. SEO Head Updates
    document.title = 'NOIR — La Carte | Cuisine française contemporaine à Paris';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'La Carte de NOIR — restaurant gastronomique contemporain à Paris. Une cuisine pensée autour du produit, du geste et du temps. 12 tables confidentielles.'
      );
    }

    // Scroll to top upon mounting
    window.scrollTo(0, 0);

    // 2. Check Reduced Motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    // 3. GSAP Choreography
    const ctx = gsap.context(() => {
      // Hero Vertical Mask Reveal
      if (heroTitleRef.current) {
        gsap.fromTo(
          heroTitleRef.current,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.3,
            ease: 'power3.out',
            delay: 0.1
          }
        );
      }

      if (heroSubtitleRef.current) {
        gsap.fromTo(
          heroSubtitleRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power2.out',
            delay: 0.45
          }
        );
      }

      if (heroImageRef.current) {
        gsap.fromTo(
          heroImageRef.current,
          { opacity: 0, scale: 0.98 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: 'power2.out',
            delay: 0.3
          }
        );
      }

      // Atmospheric Section Giant Word Parallax Drift for All Sections (Moving slowly right and left on scroll)
      const giantWords = rootRef.current?.querySelectorAll(`.${styles.giantWordProfondeur}`);
      giantWords?.forEach((word, index) => {
        const parentSection = word.closest('section');
        if (parentSection) {
          const isEven = index % 2 === 0;
          gsap.fromTo(
            word,
            { xPercent: isEven ? 7 : -7 },
            {
              xPercent: isEven ? -7 : 7,
              ease: 'none',
              scrollTrigger: {
                trigger: parentSection,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.6
              }
            }
          );
        }
      });

      // Reservation Transition Parallax
      if (soireeBgRef.current) {
        gsap.fromTo(
          soireeBgRef.current,
          { scale: 1.08, yPercent: -3 },
          {
            scale: 1,
            yPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: `.${styles.soireeContinueSection}`,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5
            }
          }
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Handle keyboard navigation for vocabulary
  const handleVocabKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveVocabId(id);
    } else if (e.key === 'Escape') {
      setActiveVocabId('matiere');
    }
  };

  return (
    <div className={styles.pageRoot} ref={rootRef} id="noir-menu-editorial-page">
      {/* Ambient Lighting Orbs */}
      <div className={`${styles.ambientGlow} ${styles.ambientGlowTop}`} aria-hidden="true" />
      <div className={`${styles.ambientGlow} ${styles.ambientGlowMid}`} aria-hidden="true" />
      <div className={`${styles.ambientGlow} ${styles.ambientGlowDeep}`} aria-hidden="true" />

      {/* =========================================================================
          01 / HERO — LA CUISINE
          ========================================================================= */}
      <header className={styles.heroSection} aria-label="La Carte de NOIR">
        {/* Full-bleed Background Image with Dramatic Gradient from Left to Right */}
        <div className={styles.heroBackdrop} aria-hidden="true" ref={heroImageRef}>
          <img
            src="/images/carte/hero-culinary.jpg"
            alt=""
            className={styles.heroBackdropImage}
            loading="eager"
          />
          <div className={styles.heroGradientOverlay} />
          <div className={styles.heroVignetteOverlay} />
        </div>

        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroTextCol}>
              <div className={styles.titleMask}>
                <h1 className={styles.heroTitle} ref={heroTitleRef}>
                  LA <i>CARTE</i>
                </h1>
              </div>
              <p className={styles.heroSubtitle} ref={heroSubtitleRef}>
                Une cuisine française contemporaine, pensée autour du produit, du geste et du temps.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          02 / INTRODUCTION ÉDITORIALE
          ========================================================================= */}
      <section className={styles.introSection} aria-label="Manifeste Culinaire">
        <div className={styles.container}>
          <div className={styles.introLockup}>
            <div className={`${styles.introQuoteMark} rv`} aria-hidden="true">❝</div>
            <div className={`${styles.introLines} rv rv2`}>
              <p className={styles.introLine}>
                Chaque création commence par un{' '}
                <span className={styles.introLineHighlight}>PRODUIT</span>.
              </p>
              <p className={styles.introLine}>
                Puis viennent le{' '}
                <span className={styles.introLineHighlight}>GESTE</span>, la température, le{' '}
                <span className={styles.introLineHighlight}>TEMPS</span>.
              </p>
              <p className={styles.introLine}>
                Rien n&apos;est ajouté sans raison.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          02 / TRANSITION — LES PREMIERS GESTES (Giant Editorial Chapter Break)
          ========================================================================= */}
      <section className={styles.transitionProfondeur} aria-label="Transition Les Premiers Gestes">
        <div className={styles.profondeurWordWrap} aria-hidden="true">
          <span className={styles.giantWordProfondeur}>
            LES PREMIERS GESTES
          </span>
        </div>
        <div className={styles.container}>
          <div className={styles.profondeurLockup}>
            <ChapterNumeral num="02" />
            <span className={`${styles.profondeurChapter} rv rv2`}>LES PREMIERS GESTES</span>
            <p className={`${styles.profondeurLead} rv rv3`}>
              Les premières notes donnent le rythme de la soirée.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          02 / LES PREMIERS GESTES (Entrées & Premières créations)
          ========================================================================= */}
      <section className={styles.gestesSection} id="premiers-gestes" aria-label="Les Premiers Gestes">
        <div className={styles.container}>

          <div className={styles.editorialDishStream}>
            {FIRST_GESTURES_DISHES.map((dish, index) => {
              const isActive = activeDishId === dish.id;
              const variantClass =
                index === 0
                  ? styles.dishSceneVariantA
                  : index === 1
                  ? styles.dishSceneVariantB
                  : styles.dishSceneVariantC;

              const ratioClass =
                dish.aspectRatio === 'vertical'
                  ? styles.dishImageRatioVertical
                  : dish.aspectRatio === 'horizontal'
                  ? styles.dishImageRatioHorizontal
                  : styles.dishImageRatioMacro;

              return (
                <article
                  key={dish.id}
                  className={`${styles.dishScene} ${variantClass} ${
                    isActive ? styles.dishSceneActive : ''
                  }`}
                  onMouseEnter={() => setActiveDishId(dish.id)}
                  onClick={() => setActiveDishId(dish.id)}
                >
                  <div className={`${styles.dishTextCol} rv`}>
                    <span className={styles.dishMetaBadge}>{dish.num}</span>
                    <button
                      type="button"
                      className={styles.dishHeadingButton}
                      onClick={() => setActiveDishId(dish.id)}
                      aria-expanded={isActive}
                      aria-label={`${dish.name} - ${dish.price}`}
                    >
                      <h2 className={styles.dishTitleName}>{dish.name}</h2>
                    </button>
                    <p className={styles.dishDescription}>{dish.description}</p>
                    <div className={styles.dishPriceTag}>
                      <span>{dish.price}</span>
                      <small>SÉQUENCE COMPLÈTE</small>
                    </div>
                    {dish.note && (
                      <p className={styles.dishSecondaryNote}>{dish.note}</p>
                    )}
                  </div>

                  <div className={`${styles.dishVisualWrapper} rv rv2`}>
                    <div className={styles.dishFrame}>
                      <span className={styles.microTagFloat}>{dish.tag}</span>
                      <div className={ratioClass}>
                        <img
                          src={dish.image}
                          alt={dish.alt}
                          className={styles.dishImage}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          03 / TRANSITION — PROFONDEUR (Giant Editorial Chapter Break)
          ========================================================================= */}
      <section className={styles.transitionProfondeur} aria-label="Transition Profondeur">
        <div className={styles.profondeurWordWrap} aria-hidden="true">
          <span className={styles.giantWordProfondeur} ref={profondeurParallaxRef}>
            PROFONDEUR
          </span>
        </div>
        <div className={styles.container}>
          <div className={styles.profondeurLockup}>
            <ChapterNumeral num="03" />
            <span className={`${styles.profondeurChapter} rv rv2`}>PROFONDEUR</span>
            <p className={`${styles.profondeurLead} rv rv3`}>
              La matière s&apos;ancre dans le feu, la concentration des sucs et la lenteur du geste.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          03 / PLATS PRINCIPAUX (Plats)
          ========================================================================= */}
      <section className={styles.platsSection} id="plats" aria-label="Plats Principaux">
        <div className={styles.container}>
          {/* Plat 1: PIGEON (Text Left, Image Right) */}
          <article
            className={`${styles.pigeonScene} ${
              activeDishId === 'pigeon' ? styles.dishSceneActive : ''
            }`}
            onMouseEnter={() => setActiveDishId('pigeon')}
            onClick={() => setActiveDishId('pigeon')}
          >
            <div className={`${styles.dishTextCol} rv`}>
              <span className={styles.dishMetaBadge}>04</span>
              <button
                type="button"
                className={styles.dishHeadingButton}
                onClick={() => setActiveDishId('pigeon')}
              >
                <h2 className={styles.dishTitleName}>PIGEON</h2>
              </button>
              <p className={styles.dishDescription}>
                Betterave fumée · Jus corsé · Cassis
              </p>
              <div className={styles.dishPriceTag}>
                <span>52 €</span>
                <small>PIÈCE D&apos;AUTEUR</small>
              </div>
              <p className={styles.dishSecondaryNote}>
                Pigeon de Bresse cuit rosé sur coffre au charbon de chêne, réduction de sucs 48h.
              </p>
            </div>
            <div className={`${styles.dishVisualWrapper} rv rv2`}>
              <div className={styles.dishFrame}>
                <span className={styles.microTagFloat}>RÉDUIT</span>
                <div className={styles.dishImageRatioHorizontal}>
                  <img
                    src="/images/carte/pigeon.jpg"
                    alt="Pigeon de Bresse, jus corsé et betterave fumée"
                    className={styles.dishImage}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </article>

          {/* Plat 2: HOMARD BLEU (Vertical Image with Overlapping Text Card) */}
          <article
            className={`${styles.homardScene} ${
              activeDishId === 'homard-bleu' ? styles.dishSceneActive : ''
            }`}
            onMouseEnter={() => setActiveDishId('homard-bleu')}
            onClick={() => setActiveDishId('homard-bleu')}
          >
            <div className={styles.homardGrid}>
              <div className={`${styles.homardTextCard} rv`}>
                <span className={styles.dishMetaBadge}>05</span>
                <button
                  type="button"
                  className={styles.dishHeadingButton}
                  onClick={() => setActiveDishId('homard-bleu')}
                >
                  <h2 className={styles.dishTitleName}>HOMARD BLEU</h2>
                </button>
                <p className={styles.dishDescription}>
                  Céleri · Agrume · Beurre fermenté
                </p>
                <div className={styles.dishPriceTag}>
                  <span>64 €</span>
                  <small>EXTRACTION IODÉE</small>
                </div>
                <p className={styles.dishSecondaryNote}>
                  Homard breton au beurre fermenté vivant et céleri rave confit au foin.
                </p>
              </div>

              <div className={`${styles.dishVisualWrapper} rv rv2`}>
                <div className={styles.dishFrame}>
                  <span className={styles.microTagFloat}>INFUSÉ</span>
                  <div className={styles.dishImageRatioVertical}>
                    <img
                      src="/images/carte/homard-bleu.jpg"
                      alt="Homard bleu breton au beurre fermenté et agrumes confits"
                      className={styles.dishImage}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Plat 3: AGNEAU (Centered Typography above a Wide Framing) */}
          <article
            className={`${styles.agneauScene} ${
              activeDishId === 'agneau' ? styles.dishSceneActive : ''
            }`}
            onMouseEnter={() => setActiveDishId('agneau')}
            onClick={() => setActiveDishId('agneau')}
          >
            <header className={`${styles.agneauHeader} rv`}>
              <div className={styles.agneauTitleRow}>
                <div>
                  <span className={styles.dishMetaBadge}>06</span>
                  <button
                    type="button"
                    className={styles.dishHeadingButton}
                    onClick={() => setActiveDishId('agneau')}
                  >
                    <h2 className={styles.dishTitleName}>AGNEAU</h2>
                  </button>
                  <p className={styles.dishDescription}>
                    Artichaut · Olive noire · Jus au thym
                  </p>
                </div>
                <div className={styles.dishPriceTag}>
                  <span>56 €</span>
                  <small>GARRIGUE SAUVAGE</small>
                </div>
              </div>
              <p className={styles.dishSecondaryNote}>
                Selle d&apos;agneau de pré-salé rôtie aux herbes fraîches, artichaut poivrade braisé.
              </p>
            </header>

            <div className={`${styles.agneauFrame} rv rv2`}>
              <span className={styles.microTagFloat}>TORRÉFIÉ</span>
              <div className={styles.agneauImageWrap}>
                <img
                  src="/images/carte/agneau.jpg"
                  alt="Selle d agneau de pré-salé, artichaut poivrade et jus au thym"
                  className={styles.dishImage}
                  loading="lazy"
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* =========================================================================
          04 / TRANSITION — LA DERNIÈRE NOTE (Giant Editorial Chapter Break)
          ========================================================================= */}
      <section className={styles.transitionProfondeur} aria-label="Transition La Dernière Note">
        <div className={styles.profondeurWordWrap} aria-hidden="true">
          <span className={styles.giantWordProfondeur}>
            LA DERNIÈRE NOTE
          </span>
        </div>
        <div className={styles.container}>
          <div className={styles.profondeurLockup}>
            <ChapterNumeral num="04" />
            <span className={`${styles.profondeurChapter} rv rv2`}>LA DERNIÈRE NOTE</span>
            <p className={`${styles.profondeurLead} rv rv3`}>
              Le repas se termine. La sensation demeure.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          04 / LA DERNIÈRE NOTE (Desserts)
          ========================================================================= */}
      <section className={styles.dessertsSection} id="desserts" aria-label="La Dernière Note">
        <div className={styles.container}>
          <div className={styles.dessertsGrid}>
            {DESSERT_DISHES.map((dessert) => {
              const isActive = activeDishId === dessert.id;
              return (
                <article
                  key={dessert.id}
                  className={`${styles.dessertCard} ${isActive ? styles.dishSceneActive : ''}`}
                  onMouseEnter={() => setActiveDishId(dessert.id)}
                  onClick={() => setActiveDishId(dessert.id)}
                >
                  <div className={`${styles.dishFrame} rv`}>
                    <span className={styles.microTagFloat}>{dessert.tag}</span>
                    <div className={styles.dishImageRatioMacro}>
                      <img
                        src={dessert.image}
                        alt={dessert.alt}
                        className={styles.dishImage}
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className={`${styles.dishTextCol} rv rv2`}>
                    <span className={styles.dishMetaBadge}>{dessert.num}</span>
                    <button
                      type="button"
                      className={styles.dishHeadingButton}
                      onClick={() => setActiveDishId(dessert.id)}
                    >
                      <h3 className={styles.dishTitleName}>{dessert.name}</h3>
                    </button>
                    <p className={styles.dishDescription}>{dessert.description}</p>
                    <div className={styles.dishPriceTag}>
                      <span>{dessert.price}</span>
                      <small>ACCORD DOUCEUR</small>
                    </div>
                    {dessert.note && (
                      <p className={styles.dishSecondaryNote}>{dessert.note}</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          05 / TRANSITION — LES ACCORDS (Giant Editorial Chapter Break)
          ========================================================================= */}
      <section className={styles.transitionProfondeur} aria-label="Transition Les Accords">
        <div className={styles.profondeurWordWrap} aria-hidden="true">
          <span className={styles.giantWordProfondeur}>
            LES ACCORDS
          </span>
        </div>
        <div className={styles.container}>
          <div className={styles.profondeurLockup}>
            <ChapterNumeral num="05" />
            <span className={`${styles.profondeurChapter} rv rv2`}>LES ACCORDS</span>
            <p className={`${styles.profondeurLead} rv rv3`}>
              Des vins choisis pour prolonger chaque création.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          05 / LES ACCORDS (Boissons & Terroirs)
          ========================================================================= */}
      <section className={styles.accordsSection} id="accords" aria-label="Les Accords">
        <div className={styles.container}>
          <div className={styles.accordsGrid}>
            <div className={styles.pairingsList}>
              {PAIRINGS_LIST.map((item, idx) => (
                <div key={idx} className={`${styles.pairingRow} rv`}>
                  <div className={styles.pairingRowHeader}>
                    <div className={styles.pairingTitleGroup}>
                      <h3 className={styles.pairingTitle}>{item.title}</h3>
                      <span className={styles.pairingSubtitle}>{item.subtitle}</span>
                    </div>
                    <span className={styles.pairingPrice}>{item.price}</span>
                  </div>
                  <p className={styles.pairingDesc}>{item.description}</p>
                </div>
              ))}
            </div>

            <div className={`${styles.dishVisualWrapper} rv rv2`}>
              <div className={styles.dishFrame}>
                <span className={styles.microTagFloat}>VINS VIVANTS</span>
                <div className={styles.dishImageRatioVertical}>
                  <img
                    src="/images/carte/accords-vin.jpg"
                    alt="Bouteille confidentielle et verrerie artisanale chez NOIR"
                    className={styles.dishImage}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          06 / TRANSITION — LE VOCABULAIRE (Giant Editorial Chapter Break)
          ========================================================================= */}
      <section className={styles.transitionProfondeur} aria-label="Transition Le Vocabulaire">
        <div className={styles.profondeurWordWrap} aria-hidden="true">
          <span className={styles.giantWordProfondeur}>
            VOCABULAIRE
          </span>
        </div>
        <div className={styles.container}>
          <div className={styles.profondeurLockup}>
            <ChapterNumeral num="06" />
            <span className={`${styles.profondeurChapter} rv rv2`}>LE VOCABULAIRE</span>
            <p className={`${styles.profondeurLead} rv rv3`}>
              Les sept piliers sensibles guidant chaque choix de la brigade.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ORIGINAL SIGNATURE FEATURE — LE VOCABULAIRE DE NOIR
          Interactive exploration for TA2B
          ========================================================================= */}
      <section
        className={styles.vocabulaireSection}
        id="vocabulaire"
        aria-label="Le Vocabulaire de NOIR"
      >
        <div className={styles.container}>
          <div className={styles.vocabulaireLayout}>
            {/* Interactive Words Navigation */}
            <div
              className={`${styles.vocabNavList} rv`}
              role="tablist"
              aria-label="Piliers du vocabulaire de NOIR"
            >
              {LE_VOCABULAIRE_DE_NOIR.map((item, idx) => {
                const isSelected = item.id === activeVocabId;
                const numStr = `0${idx + 1}`;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={`tab-${item.id}`}
                    aria-selected={isSelected}
                    aria-controls={`panel-${item.id}`}
                    className={`${styles.vocabNavBtn} ${
                      isSelected ? styles.vocabNavBtnActive : ''
                    }`}
                    onClick={() => setActiveVocabId(item.id)}
                    onMouseEnter={() => setActiveVocabId(item.id)}
                    onKeyDown={(e) => handleVocabKeyDown(e, item.id)}
                  >
                    <span className={styles.vocabNavBtnWord}>{item.word}</span>
                    <span className={styles.vocabNavBtnNum}>{numStr}</span>
                  </button>
                );
              })}
            </div>

            {/* Slider Viewport — clips to show one card at a time */}
            <div className={styles.vocabSliderViewport}>
              {/* Track that holds ALL cards side by side, GSAP translates this */}
              <div className={styles.vocabSliderTrack} ref={vocabTrackRef}>
                {LE_VOCABULAIRE_DE_NOIR.map((item) => (
                  <div
                    key={item.id}
                    className={styles.vocabDisplayCard}
                    role="tabpanel"
                    id={`panel-${item.id}`}
                    aria-labelledby={`tab-${item.id}`}
                    aria-hidden={item.id !== activeVocabId}
                  >
                    {/* Full-bleed background image */}
                    <div className={styles.vocabDisplayVisual}>
                      <img
                        src={item.image}
                        alt={item.alt}
                        className={styles.vocabDisplayImage}
                        loading="lazy"
                      />
                    </div>

                    {/* Gradient overlays */}
                    <div className={styles.vocabDisplayGradientTop} aria-hidden="true" />
                    <div className={styles.vocabDisplayGradientBottom} aria-hidden="true" />

                    {/* Top text — quote in «» */}
                    <div className={styles.vocabDisplayTop}>
                      <span className={styles.vocabDisplayTag}>
                        «{item.word}»
                      </span>
                      <blockquote className={styles.vocabDisplayQuote}>
                        « {item.quote} »
                      </blockquote>
                    </div>

                    {/* Bottom text — detail */}
                    <div className={styles.vocabDisplayBottom}>
                      <p className={styles.vocabDisplayDetail}>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          07 / TRANSITION — CE SOIR - CE SOIR (Giant Editorial Chapter Break)
          ========================================================================= */}
      <section className={styles.transitionProfondeur} aria-label="Transition Ce Soir">
        <div className={styles.profondeurWordWrap} aria-hidden="true">
          <span className={styles.giantWordProfondeur}>
            CE SOIR - CE SOIR
          </span>
        </div>
        <div className={styles.container}>
          <div className={styles.profondeurLockup}>
            <ChapterNumeral num="07" />
            <span className={`${styles.profondeurChapter} rv rv2`}>CE SOIR CHEZ NOIR</span>
            <p className={`${styles.profondeurLead} rv rv3`}>
              {CE_SOIR_DATA.lead || 'Deux partitions nocturnes · 12 tables uniques.'}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          07 / SECTION CE SOIR (Formats & Horaires)
          ========================================================================= */}
      <section className={styles.ceSoirSection} id="ce-soir" aria-label="Ce Soir chez NOIR">
        <div className={styles.container}>
          <div className={styles.ceSoirGrid}>
            <div className={`${styles.formatsContainer} rv`}>
              {CE_SOIR_DATA.formats.map((fmt, idx) => (
                <div key={idx} className={`${styles.formatBlock} rv`}>
                  <div className={styles.formatTopLine}>
                    <div>
                      <h3 className={styles.formatTitle}>{fmt.name}</h3>
                      <span className={styles.formatTempo}>{fmt.tempo}</span>
                    </div>
                    <span className={styles.formatPrice}>{fmt.price}</span>
                  </div>
                  <p className={styles.formatDesc}>{fmt.desc}</p>
                </div>
              ))}
            </div>

            <div className={`${styles.serviceInfoCard} rv rv2`}>
              <div className={styles.serviceInfoList}>
                {CE_SOIR_DATA.serviceInfo.map((info, idx) => (
                  <div key={idx} className={styles.serviceInfoItem}>
                    <span className={styles.serviceInfoLabel}>{info.label}</span>
                    <span className={styles.serviceInfoVal}>{info.val}</span>
                  </div>
                ))}
              </div>

              <div className={styles.seasonalNotice}>
                <p>{CE_SOIR_DATA.seasonalNote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          07 / TRANSITION VERS RÉSERVATION ("LA SOIRÉE CONTINUE.")
          ========================================================================= */}
      <section
        className={styles.soireeContinueSection}
        id="reservation-transition"
        aria-label="Transition vers réservation"
      >
        <div className={styles.soireeBg}>
          <img
            ref={soireeBgRef}
            src="/images/reservation/soiree-commence-ici.jpg"
            alt="Ambiance confidentielle et intime de la salle NOIR"
            className={styles.soireeBgImg}
            loading="lazy"
          />
          <div className={styles.soireeOverlay} />
        </div>

        <div className={styles.container}>
          <div className={styles.soireeInner}>
            <h2 className={`${styles.soireeTitle} rv`}>
              LA SOIRÉE<br />
              <i>CONTINUE.</i>
            </h2>
            <p className={`${styles.soireeLead} rv rv2`}>
              Réservez votre table chez NOIR.
            </p>

            <Link
              to="/reservation"
              className={`${styles.editorialCta} rv rv3`}
              onClick={(e) => {
                if (onOpenReservation) {
                  // Allow direct modal opening or seamless page navigation
                }
              }}
              aria-label="Réserver une table chez NOIR"
            >
              <span>RÉSERVER UNE TABLE</span>
              <span className={styles.editorialCtaArrow} aria-hidden="true">→</span>
              <span className={styles.editorialCtaLine} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
