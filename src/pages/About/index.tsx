import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { chefProfile } from '../../data/chef';
import { restaurantInfo } from '../../data/restaurant';
import styles from './About.module.css';

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
          x1="32"
          y1="0"
          x2="32"
          y2="52"
          stroke="#a65a44"
          strokeWidth="1.2"
          opacity="0.8"
        />

        {/* Primary full orbital circle */}
        <circle
          className="phil-arc-primary"
          cx="220"
          cy="145"
          r="115"
          stroke="#a65a44"
          strokeWidth="1"
          opacity="0.55"
        />

        {/* Secondary partial arc */}
        <path
          className="phil-arc-secondary"
          d="M 30,210 A 155,155 0 0,1 330,80"
          stroke="#a65a44"
          strokeWidth="0.9"
          opacity="0.4"
        />

        {/* Horizontal baseline rule */}
        <line
          className="phil-baseline"
          x1="32"
          y1="255"
          x2="130"
          y2="255"
          stroke="#a65a44"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Large Bodoni numeral first digit */}
        <text
          className="phil-num phil-num-0"
          x="28"
          y="245"
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
          x="172"
          y="245"
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

interface AboutPageProps {
  onOpenReservation?: (type?: 'bench' | 'dining') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenReservation }) => {
  useScrollReveal();

  const rootRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const soireeBgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // 1. SEO Head Updates
    document.title = 'NOIR — La Maison | Entre la Matière et l’Ombre';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'La Maison NOIR Paris. Découvrez la genèse, la cheffe Élise Moreau, la philosophie du temps suspendu et l’architecture acoustique de nos 12 tables confidentielles au Palais-Royal.'
      );
    }

    // Always scroll to top upon mounting
    window.scrollTo(0, 0);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    // 2. GSAP Choreography
    const ctx = gsap.context(() => {
      // Hero Vertical Mask Reveal
      if (heroTitleRef.current) {
        gsap.fromTo(
          heroTitleRef.current,
          { yPercent: 40, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.25,
            ease: 'power3.out',
            delay: 0.15,
          }
        );
      }

      if (heroSubtitleRef.current) {
        gsap.fromTo(
          heroSubtitleRef.current,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power2.out',
            delay: 0.45,
          }
        );
      }

      if (heroImageRef.current) {
        gsap.fromTo(
          heroImageRef.current,
          { scale: 1.08, opacity: 0.7 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.8,
            ease: 'power2.out',
          }
        );
      }

      // Parallax on bottom reservation transition
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
              scrub: 1.5,
            },
          }
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.pageRoot} ref={rootRef} id="noir-about-editorial-page">
      {/* Ambient Lighting Orbs */}
      <div className={`${styles.ambientGlow} ${styles.ambientGlowTop}`} aria-hidden="true" />
      <div className={`${styles.ambientGlow} ${styles.ambientGlowMid}`} aria-hidden="true" />
      <div className={`${styles.ambientGlow} ${styles.ambientGlowDeep}`} aria-hidden="true" />

      {/* =========================================================================
          01 / HERO — LA MAISON NOIR
          ========================================================================= */}
      <header className={styles.heroSection} aria-label="À propos de NOIR">
        <div className={styles.heroBackdrop} aria-hidden="true" ref={heroImageRef}>
          <img
            src="/images/hero/hero-moody-dining-1600.jpg"
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
              <span className={styles.chapterLabel}>À PROPOS DE NOIR · PARIS 1ER</span>
              <div className={styles.titleMask}>
                <h1 className={styles.heroTitle} ref={heroTitleRef}>
                  ENTRE LA MATIÈRE<br />
                  <i>& L’OMBRE</i>
                </h1>
              </div>
              <p className={styles.heroSubtitle} ref={heroSubtitleRef}>
                Une quête sans compromis au cœur de la gastronomie française contemporaine, de l’intimité acoustique et de la soustraction radicale.
              </p>

              <div className={styles.heroMetaRow}>
                <div className={styles.heroMetaItem}>
                  <span className={styles.heroMetaLabel}>LIEU</span>
                  <span className={styles.heroMetaVal}>Paris 1er · Palais-Royal</span>
                </div>
                <div className={styles.heroMetaItem}>
                  <span className={styles.heroMetaLabel}>TABLES</span>
                  <span className={styles.heroMetaVal}>12 Tables Confidentielles</span>
                </div>
                <div className={styles.heroMetaItem}>
                  <span className={styles.heroMetaLabel}>RYTHME</span>
                  <span className={styles.heroMetaVal}>Un Seul Service par Soir</span>
                </div>
                <div className={styles.heroMetaItem}>
                  <span className={styles.heroMetaLabel}>DIRECTION</span>
                  <span className={styles.heroMetaVal}>Élise Moreau</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          02 / MANIFESTE D’INTRODUCTION
          ========================================================================= */}
      <section className={styles.introSection} aria-label="Manifeste de la Maison NOIR">
        <div className={styles.container}>
          <div className={styles.introLockup}>
            <div className={`${styles.introQuoteMark} rv`} aria-hidden="true">❝</div>
            <div className={`${styles.introLines} rv rv2`}>
              <p className={styles.introLine}>
                Le luxe n&apos;est ni la dorure, ni la mise en scène théâtrale.
              </p>
              <p className={styles.introLine}>
                Le luxe est une <span className={styles.introLineHighlight}>ATTENTION</span>, une table baignée d&apos;une{' '}
                <span className={styles.introLineHighlight}>LUMIÈRE</span> ciblée,
              </p>
              <p className={styles.introLine}>
                et une cuisine qui grave une{' '}
                <span className={styles.introLineHighlight}>MÉMOIRE</span> plutôt qu&apos;un artifice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 01 BREAK — HISTOIRE
          ========================================================================= */}
      <section className={styles.chapterTransitionSection} aria-label="Transition Chapitre 01 Histoire">
        <div className={styles.transitionWordWrap} aria-hidden="true">
          <span className={styles.giantWordWatermark}>HISTOIRE</span>
        </div>
        <div className={styles.container}>
          <div className={styles.chapterLockup}>
            <ChapterNumeral num="01" />
            <span className={`${styles.chapterBreakTitle} rv rv2`}>01 — HISTOIRE</span>
            <p className={`${styles.chapterBreakLead} rv rv3`}>
              Les fondations souterraines d’un sanctuaire gastronomique au cœur de Paris.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 01 — HISTOIRE : LA GENÈSE DANS LA PIERRE
          ========================================================================= */}
      <section className={styles.chapterSection} id="chapter-history" aria-label="La Genèse dans la Pierre">
        <div className={styles.container}>
          <div className={styles.editorialSplitGrid}>
            <div className={`${styles.editorialTextCol} rv`}>
              <span className={styles.chapterLabel}>01 — HISTOIRE</span>
              <h2 className={styles.sectionTitle}>
                La Genèse<br />
                <i>dans la Pierre</i>
              </h2>
              <div className={`${styles.sectionRule} h2rule`} aria-hidden="true" />
              <p className={styles.narrativeParagraph}>
                NOIR a été imaginé en 2023 non comme une salle de restaurant conventionnelle, mais comme un sanctuaire sensoriel. Derrière une façade discrète du XVIIIe siècle dans le 1er arrondissement de Paris, le lieu s’ancre dans les fondations voûtées d’anciennes réserves vinicoles historiques du Palais-Royal.
              </p>
              <p className={styles.narrativeParagraph}>
                Les fondateurs ont souhaité questionner les excès décoratifs de la haute gastronomie actuelle. Plutôt que des lustres clinquants et un cérémonial pesant, NOIR a été conçu comme un <strong>vide architectural</strong> où la conversation, le toucher des grès bruts et la concentration culinaire s’épanouissent sans bruit parasite.
              </p>

              <div className={styles.milestoneLedger}>
                <div className={styles.milestoneRow}>
                  <span className={styles.milestoneYear}>2023</span>
                  <span className={styles.milestoneText}>
                    Restauration minutieuse des voûtes en calcaire lutétien, Paris 1er.
                  </span>
                </div>
                <div className={styles.milestoneRow}>
                  <span className={styles.milestoneYear}>2024</span>
                  <span className={styles.milestoneText}>
                    Conception sur-mesure du double foyer au charbon blanc Binchotan de Kishu.
                  </span>
                </div>
                <div className={styles.milestoneRow}>
                  <span className={styles.milestoneYear}>2025</span>
                  <span className={styles.milestoneText}>
                    Inauguration de NOIR Paris — 12 tables confidentielles, service unique.
                  </span>
                </div>
              </div>
            </div>

            <div className={`${styles.editorialVisualCol} rv rv2`}>
              <div className={styles.imageFrame}>
                <div className={`${styles.imageWrap} ${styles.imageWrapPortrait}`}>
                  <img
                    src="/images/trouver/facade-noir.jpg"
                    alt="Façade discrète et pierre voûtée de NOIR Paris au crépuscule"
                    className={styles.framedImage}
                    loading="lazy"
                  />
                  <div className={styles.imageTint} aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 02 BREAK — LA CHEFFE
          ========================================================================= */}
      <section className={styles.chapterTransitionSection} aria-label="Transition Chapitre 02 Cheffe">
        <div className={styles.transitionWordWrap} aria-hidden="true">
          <span className={styles.giantWordWatermark}>LA CHEFFE</span>
        </div>
        <div className={styles.container}>
          <div className={styles.chapterLockup}>
            <ChapterNumeral num="02" />
            <span className={`${styles.chapterBreakTitle} rv rv2`}>02 — LA CHEFFE</span>
            <p className={`${styles.chapterBreakLead} rv rv3`}>
              Une cuisine d’auteur pensée comme une architecture de réduction.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 02 — LA CHEFFE : ÉLISE MOREAU
          ========================================================================= */}
      <section className={styles.chapterSectionAlt} id="chapter-chef" aria-label="Élise Moreau, Cheffe & Fondatrice">
        <div className={styles.container}>
          <div className={`${styles.editorialSplitGrid} ${styles.editorialSplitGridReverse}`}>
            <div className={`${styles.editorialVisualCol} rv`}>
              <div className={styles.imageFrame}>
                <div className={`${styles.imageWrap} ${styles.imageWrapPortrait}`}>
                  <img
                    src={chefProfile.image}
                    alt={chefProfile.portraitAlt}
                    className={styles.framedImage}
                    loading="lazy"
                  />
                  <div className={styles.imageTint} aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className={`${styles.editorialTextCol} rv rv2`}>
              <span className={styles.chapterLabel}>02 — LA CHEFFE</span>
              <h2 className={styles.sectionTitle}>
                {chefProfile.name}<br />
                <i>Cheffe & Fondatrice</i>
              </h2>
              <div className={`${styles.sectionRule} h2rule`} aria-hidden="true" />

              <div className={styles.quoteCard}>
                <blockquote className={styles.chefQuoteText}>
                  « {chefProfile.quote} »
                </blockquote>
              </div>

              <p className={styles.narrativeParagraph}>
                {chefProfile.biography}
              </p>
              <p className={styles.narrativeParagraph}>
                Son parcours au sein des brigades les plus exigeantes de la capitale a forgé une obsession absolue pour la netteté du trait, la réduction des jus et la tension des contrastes thermiques. Chez NOIR, chaque assiette incarne cette synthèse rare entre maîtrise classique française et soustraction radicale.
              </p>

              {/* Editorial Pillars Ledger */}
              <div className={styles.chefPillarsLedger}>
                {chefProfile.values.map((v, i) => (
                  <div key={i} className={styles.chefPillarItem}>
                    <div className={styles.chefPillarHead}>
                      <span className={styles.chefPillarNumeral}>0{i + 1}</span>
                      <span className={styles.chefPillarTitle}>{v.title}</span>
                    </div>
                    <p className={styles.chefPillarText}>{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 03 BREAK — LA CUISINE
          ========================================================================= */}
      <section className={styles.chapterTransitionSection} aria-label="Transition Chapitre 03 Cuisine">
        <div className={styles.transitionWordWrap} aria-hidden="true">
          <span className={styles.giantWordWatermark}>LA CUISINE</span>
        </div>
        <div className={styles.container}>
          <div className={styles.chapterLockup}>
            <ChapterNumeral num="03" />
            <span className={`${styles.chapterBreakTitle} rv rv2`}>03 — LA CUISINE</span>
            <p className={`${styles.chapterBreakLead} rv rv3`}>
              Rien n’est ajouté sans raison. La matière s’exprime par le feu et la lenteur.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 03 — LA CUISINE : DISTILLATION RADICALE
          ========================================================================= */}
      <section className={styles.chapterSection} id="chapter-cuisine" aria-label="Distillation Radicale">
        <div className={styles.container}>
          <div className={`${styles.wideEditorialHeader} rv`}>
            <span className={styles.chapterLabel}>03 — LA CUISINE</span>
            <h2 className={styles.wideTitle}>
              Distillation<br />
              <i>Radicale</i>
            </h2>
            <div className={`${styles.sectionRule} h2rule`} aria-hidden="true" />
            <p className={styles.wideLead}>
              Notre cuisine rejette les stabilisateurs industriels, les émulsions grasses masquantes et les micro-pousses décoratives. Chaque élément déposé sur la pierre possède une nécessité vitale.
            </p>
          </div>

          {/* Architectural Triptych */}
          <div className={styles.cuisineTriptych}>
            <div className={`${styles.cuisineTriptychCol} rv rv1`}>
              <div className={styles.triptychNumeralWrap}>
                <span className={styles.triptychNum}>01</span>
                <span className={styles.triptychLine} aria-hidden="true" />
              </div>
              <h3 className={styles.triptychTitle}>L’Extraction</h3>
              <p className={styles.triptychLead}>La pureté du jus & l’absence de gras saturé</p>
              <p className={styles.triptychText}>
                Des sauces élaborées à partir de réductions d’os torréfiés, de bouillons de coquillages clarifiés et d’infusions botaniques à froid. Aucun beurre d’artifice : nos jus sont limpides, concentrés et vibrants.
              </p>
            </div>

            <div className={`${styles.cuisineTriptychCol} rv rv2`}>
              <div className={styles.triptychNumeralWrap}>
                <span className={styles.triptychNum}>02</span>
                <span className={styles.triptychLine} aria-hidden="true" />
              </div>
              <h3 className={styles.triptychTitle}>Le Binchotan</h3>
              <p className={styles.triptychLead}>La flamme invisible à 1 000°C</p>
              <p className={styles.triptychText}>
                Cuisson au charbon de chêne blanc Kishu importé de la préfecture de Wakayama. Ces braises brûlent sans flamme ni fumée, saisissant la chair à cœur pour en sceller instantanément l’eau de constitution.
              </p>
            </div>

            <div className={`${styles.cuisineTriptychCol} rv rv3`}>
              <div className={styles.triptychNumeralWrap}>
                <span className={styles.triptychNum}>03</span>
                <span className={styles.triptychLine} aria-hidden="true" />
              </div>
              <h3 className={styles.triptychTitle}>Le Vivant</h3>
              <p className={styles.triptychLead}>La vérité des sols sans chimie</p>
              <p className={styles.triptychText}>
                Une carte des vins engagée qui célèbre les terroirs libres et la biodynamie. Notre Chef Sommelier défend des vignerons artisans travaillant sans intrants chimiques ni levures exogènes.
              </p>
            </div>
          </div>

          <div className={`${styles.wideVisualWrapper} rv`}>
            <div className={styles.imageFrame}>
              <div className={`${styles.imageWrap} ${styles.imageWrapWide}`}>
                <img
                  src="/images/carte/saint-jacques.jpg"
                  alt="Composition de Saint-Jacques nacrée avec topinambour et huile de noisette du Piémont"
                  className={styles.framedImage}
                  loading="lazy"
                />
                <div className={styles.imageTint} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 04 BREAK — PHILOSOPHIE
          ========================================================================= */}
      <section className={styles.chapterTransitionSection} aria-label="Transition Chapitre 04 Philosophie">
        <div className={styles.transitionWordWrap} aria-hidden="true">
          <span className={styles.giantWordWatermark}>PHILOSOPHIE</span>
        </div>
        <div className={styles.container}>
          <div className={styles.chapterLockup}>
            <ChapterNumeral num="04" />
            <span className={`${styles.chapterBreakTitle} rv rv2`}>04 — PHILOSOPHIE</span>
            <p className={`${styles.chapterBreakLead} rv rv3`}>
              Le temps suspendu et le silence protecteur du service unique.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 04 — PHILOSOPHIE : LE TEMPS SUSPENDU
          ========================================================================= */}
      <section className={styles.chapterSectionAlt} id="chapter-philosophy" aria-label="Philosophie du Temps Suspendu">
        <div className={styles.container}>
          <div className={styles.editorialSplitGrid}>
            <div className={`${styles.editorialTextCol} rv`}>
              <span className={styles.chapterLabel}>04 — PHILOSOPHIE</span>
              <h2 className={styles.sectionTitle}>
                Le Temps<br />
                <i>Suspendu</i>
              </h2>
              <div className={`${styles.sectionRule} h2rule`} aria-hidden="true" />
              <p className={styles.narrativeParagraph}>
                {restaurantInfo.philosophyText}
              </p>

              {/* Monograph Pull-Quote & Spatial Protocol */}
              <div className={styles.philosophyManifestoBlock}>
                <div className={styles.manifestoQuoteWrap}>
                  <blockquote className={styles.manifestoBigQuote}>
                    « Prendre place chez NOIR, c’est accepter que le temps s’arrête. <em>Aucune rotation</em>, aucune pression d’horloge : seulement la nuit, la lumière et la table. »
                  </blockquote>
                </div>

                <div className={styles.spatialProtocolRow}>
                  <span className={styles.protocolNum}>12</span>
                  <div className={styles.protocolTextCol}>
                    <span className={styles.protocolLabel}>Protocole spatial & temporel</span>
                    <span className={styles.protocolStatement}>
                      Douze tables uniques · Un seul service par soir · Aucune rotation
                    </span>
                  </div>
                </div>
              </div>

              <p className={styles.narrativeParagraph}>
                Nous appliquons une politique intangible : nous ne réassignons jamais une table au cours d’une même soirée. Dès votre arrivée, votre table reste la vôtre jusqu’à la conclusion de la nuit. Vous êtes invités à prolonger la conversation et laisser le monde extérieur s’effacer.
              </p>
            </div>

            <div className={`${styles.editorialVisualCol} rv rv2`}>
              <div className={styles.imageFrame}>
                <div className={`${styles.imageWrap} ${styles.imageWrapPortrait}`}>
                  <img
                    src="/images/carte/accords-vin.jpg"
                    alt="Service du vin dans une verrerie d'art sous un halo feutré"
                    className={styles.framedImage}
                    loading="lazy"
                  />
                  <div className={styles.imageTint} aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 05 BREAK — LE LIEU
          ========================================================================= */}
      <section className={styles.chapterTransitionSection} aria-label="Transition Chapitre 05 Le Lieu">
        <div className={styles.transitionWordWrap} aria-hidden="true">
          <span className={styles.giantWordWatermark}>LE LIEU</span>
        </div>
        <div className={styles.container}>
          <div className={styles.chapterLockup}>
            <ChapterNumeral num="05" />
            <span className={`${styles.chapterBreakTitle} rv rv2`}>05 — LE LIEU</span>
            <p className={`${styles.chapterBreakLead} rv rv3`}>
              Quatre matières brutes sculptées pour l’acoustique et la pénombre.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 05 — LE LIEU : INSTRUMENT ARCHITECTURAL
          ========================================================================= */}
      <section className={styles.chapterSection} id="chapter-place" aria-label="Un Instrument Architectural">
        <div className={styles.container}>
          <div className={`${styles.wideEditorialHeader} rv`}>
            <span className={styles.chapterLabel}>05 — LE LIEU</span>
            <h2 className={styles.wideTitle}>
              Un Instrument<br />
              <i>Architectural</i>
            </h2>
            <div className={`${styles.sectionRule} h2rule`} aria-hidden="true" />
            <p className={styles.wideLead}>
              Conçu par le duo d&apos;architectes parisiens Moreau & Vasseur, chaque surface tactile a été choisie pour ses vertus d&apos;absorption sonore et sa retenue visuelle.
            </p>
          </div>

          {/* Architectural Matériauthèque Ledger */}
          <div className={styles.materialsMonograph}>
            <div className={`${styles.materialEntry} rv rv1`}>
              <div className={styles.materialHeader}>
                <span className={styles.materialNumeral}>01</span>
                <span className={styles.materialDividerLine} aria-hidden="true" />
              </div>
              <h3 className={styles.materialTitle}>Basalte Volcanique</h3>
              <span className={styles.materialOrigin}>Auvergne · Dalles adoucies</span>
              <p className={styles.materialNarrative}>
                Dalles de sol adouci absorbant les réverbérations des pas et ancrant la salle dans une gravité tellurique minérale.
              </p>
            </div>

            <div className={`${styles.materialEntry} rv rv2`}>
              <div className={styles.materialHeader}>
                <span className={styles.materialNumeral}>02</span>
                <span className={styles.materialDividerLine} aria-hidden="true" />
              </div>
              <h3 className={styles.materialTitle}>Chêne Brûlé Yakisugi</h3>
              <span className={styles.materialOrigin}>Forêt de Tronçais · Chêne français</span>
              <p className={styles.materialNarrative}>
                Murs habillés de chêne français brûlé à cœur selon la technique japonaise ancestrale, offrant une profondeur texturée d&apos;un noir absolu.
              </p>
            </div>

            <div className={`${styles.materialEntry} rv rv3`}>
              <div className={styles.materialHeader}>
                <span className={styles.materialNumeral}>03</span>
                <span className={styles.materialDividerLine} aria-hidden="true" />
              </div>
              <h3 className={styles.materialTitle}>Optiques 12 Degrés</h3>
              <span className={styles.materialOrigin}>Sur-mesure · Faisceau sculpté</span>
              <p className={styles.materialNarrative}>
                Faisceaux optiques étroits taillés sur-mesure qui éclairent uniquement la nappe et l’assiette, plongeant le reste de l’espace dans un crépuscule apaisant.
              </p>
            </div>

            <div className={`${styles.materialEntry} rv rv4`}>
              <div className={styles.materialHeader}>
                <span className={styles.materialNumeral}>04</span>
                <span className={styles.materialDividerLine} aria-hidden="true" />
              </div>
              <h3 className={styles.materialTitle}>Grès Non Émaillé</h3>
              <span className={styles.materialOrigin}>Drôme · Terres brutes ferrugineuses</span>
              <p className={styles.materialNarrative}>
                Toutes les pièces de service sont tournées à la main par le céramiste Jean-Marc Martin en terre brute de la Drôme, riche en oxydes de fer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          07 / TRANSITION VERS RÉSERVATION ("LA SOIRÉE CONTINUE.")
          Identique à la page Menu et Accueil
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
              Douze tables confidentielles. Réservez votre place chez NOIR.
            </p>

            <Link
              to="/reservation"
              className={`${styles.editorialCta} rv rv3`}
              onClick={() => {
                if (onOpenReservation) {
                  // Optional modal trigger
                }
              }}
              aria-label="Réserver une table chez NOIR"
              id="about-reserve-cta-btn"
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
