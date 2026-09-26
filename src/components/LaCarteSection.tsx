import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCurtainTransition } from './layout/CurtainTransition';

interface DishData {
  id: string;
  num: string;
  name: string;
  subtitle: string;
  price: string;
  tag: string;
  image: string;
  alt: string;
}

const DISHES: Record<string, DishData> = {
  'saint-jacques': {
    id: 'saint-jacques',
    num: '01',
    name: 'Saint-Jacques',
    subtitle: 'Topinambour fumé · Noisette torréfiée · Huile de persil',
    price: '48 €',
    tag: '01 / MER',
    image: '/images/carte/saint-jacques.jpg',
    alt: 'Saint-Jacques — Topinambour fumé, noisette torréfiée, huile de persil',
  },
  'pigeon': {
    id: 'pigeon',
    num: '02',
    name: 'Pigeon',
    subtitle: 'Betterave fumée · Jus corsé · Cassis',
    price: '52 €',
    tag: '02 / ROST',
    image: '/images/carte/pigeon.jpg',
    alt: 'Pigeon — Betterave fumée, jus corsé, cassis',
  },
  'homard-bleu': {
    id: 'homard-bleu',
    num: '03',
    name: 'Homard bleu',
    subtitle: 'Céleri · Agrume · Beurre fermenté',
    price: '64 €',
    tag: '03 / IODE',
    image: '/images/carte/homard-bleu.jpg',
    alt: 'Homard bleu — Céleri, agrume, beurre fermenté',
  },
  'chocolat-noir': {
    id: 'chocolat-noir',
    num: '04',
    name: 'Chocolat noir',
    subtitle: 'Sarrasin · Café · Fleur de sel',
    price: '18 €',
    tag: '04 / NUIT',
    image: '/images/carte/chocolat-noir.jpg',
    alt: 'Chocolat noir — Sarrasin, café, fleur de sel',
  },
};

export const LaCarteSection: React.FC = () => {
  const { transitionTo } = useCurtainTransition();
  const [activeDishId, setActiveDishId] = useState<string | null>(null);

  const activeDish = activeDishId ? DISHES[activeDishId] : null;

  return (
    <section className="chapter carte-mosaic-chapter" id="menu" aria-label="Sur La Table NOIR">
      {/* Background ambient lighting accents */}
      <div className="spot top" aria-hidden="true" />

      <div className="inner">
        {/* =========================================================================
            SECTION HEADER
            03 / SUR LA TABLE
            ========================================================================= */}
        <header className="carte-mosaic-header">
          <div className="table-main-title-lockup">
            <div className="table-title-text-wrap">
              <h2 className="table-title rv rv2">
                <span>SUR LA</span> <i>TABLE</i>
              </h2>
            </div>

            {/* Stylized 03 SVG Numeral Emblem on the Right side of the Title */}
            <div className="table-numeral-lockup rv" aria-hidden="true">
              <svg
                className="table-numeral-svg"
                viewBox="0 0 280 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line className="tab-accent-line" x1="16" y1="0" x2="16" y2="40" stroke="#a65a44" strokeWidth="1.2" />
                <circle className="tab-arc-primary" cx="170" cy="100" r="75" stroke="#a65a44" strokeWidth="1" opacity="0.5" />
                <path className="tab-arc-secondary" d="M 22,140 A 100,100 0 0,1 240,45" stroke="#a65a44" strokeWidth="0.8" opacity="0.35" />
                <line className="tab-baseline" x1="16" y1="165" x2="95" y2="165" stroke="#a65a44" strokeWidth="1" opacity="0.5" />
                <text
                  className="tab-num"
                  x="14"
                  y="158"
                  fill="#a65a44"
                  fontFamily="'Bodoni Moda', Didot, Georgia, serif"
                  fontSize="140"
                  fontWeight="400"
                  letterSpacing="-0.04em"
                >
                  03
                </text>
              </svg>
            </div>
          </div>

          <div className="h2rule rv rv2" aria-hidden="true" />

          <p className="carte-mosaic-subheading rv rv3">
            Quelques créations pour commencer la soirée.
          </p>
        </header>

        {/* =========================================================================
            EDITORIAL MOSAIC COLLAGE — COMBINATION 02
            Strictly follows the Codrops grid-area specification:
            grid-area: row-start / column-start / row-end / column-end
            - Inverted grand vitrine on the right (Homard Bleu)
            - Anchored hero portrait on the left (Pigeon)
            - Overlapping center typography: SUR LA TABLE 03
            ========================================================================= */}
        <div className="carte-mosaic-cluster">

          {/* 1. TOP-LEFT SOLID BLOCK with arrow */}
          <div
            className="mosaic-tile tile-solid-top"
            title="LE MENU"
            role="link"
            tabIndex={0}
            onClick={() => transitionTo('/menus')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                transitionTo('/menus');
              }
            }}
          >
            <span className="mosaic-arrow-left">←</span>
            <span className="mosaic-solid-label noir-roll-text">
              <span className="noir-roll-item is-main">LE MENU</span>
              <span className="noir-roll-item is-hover" aria-hidden="true">LE MENU</span>
            </span>
          </div>

          {/* 2. TOP-CENTER-LEFT: SAINT-JACQUES */}
          <div
            className={`mosaic-tile tile-dish tile-saint-jacques ${activeDishId === 'saint-jacques' ? 'is-active' : ''}`}
            onMouseEnter={() => setActiveDishId('saint-jacques')}
            onMouseLeave={() => setActiveDishId(null)}
          >
            <img
              src={DISHES['saint-jacques'].image}
              alt={DISHES['saint-jacques'].alt}
              loading="lazy"
              className="mosaic-img"
            />
            <div className="mosaic-tile-overlay">
              <span className="mosaic-dish-tag">{DISHES['saint-jacques'].name}</span>
            </div>
          </div>

          {/* 3. TOP-CENTER-RIGHT: LA CAVE VIVANTE */}
          <div className="mosaic-tile tile-texture-top">
            <img
              src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=85"
              alt="La Cave Vivante — Flacons et ombres chez NOIR"
              loading="lazy"
              className="mosaic-img"
            />
            <div className="mosaic-tile-overlay">
              <span className="mosaic-dish-tag">La Cave Vivante</span>
            </div>
          </div>

          {/* 4. TOP-RIGHT: ARCHITECTURE MINÉRALE */}
          <div className="mosaic-tile tile-mosaic-pattern">
            <img
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=85"
              alt="Architecture minérale de la salle"
              loading="lazy"
              className="mosaic-img"
            />
            <div className="mosaic-tile-overlay">
              <span className="mosaic-dish-tag">Architecture Minérale</span>
            </div>
          </div>

          {/* 5. FAR-LEFT OUTLIER: BRAISES DE BINCHOTAN */}
          <div className="mosaic-tile tile-outlier-left">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=85"
              alt="Braises de Binchotan"
              loading="lazy"
              className="mosaic-img"
            />
            <div className="mosaic-tile-overlay">
              <span className="mosaic-dish-tag">Braises de Binchotan</span>
            </div>
          </div>

          {/* 6. BIG HERO TILE CENTER-LEFT: PIGEON */}
          <div
            className={`mosaic-tile tile-dish tile-hero-pigeon ${activeDishId === 'pigeon' ? 'is-active' : ''}`}
            onMouseEnter={() => setActiveDishId('pigeon')}
            onMouseLeave={() => setActiveDishId(null)}
          >
            <img
              src={DISHES['pigeon'].image}
              alt={DISHES['pigeon'].alt}
              loading="lazy"
              className="mosaic-img"
            />
            <div className="mosaic-tile-overlay">
              <span className="mosaic-dish-tag">{DISHES['pigeon'].name}</span>
            </div>
          </div>

          {/* 7. GIANT CENTER OVERLAPPING TYPOGRAPHY */}
          <div className="mosaic-center-brand-lockup" aria-hidden="true">
            <span className="mosaic-brand-line1">SUR LA</span>
            <span className="mosaic-brand-line2"><i>TABLE</i></span>
          </div>

          {/* 8. CENTER-MIDDLE: HOMARD BLEU */}
          <div
            className={`mosaic-tile tile-dish tile-homard ${activeDishId === 'homard-bleu' ? 'is-active' : ''}`}
            onMouseEnter={() => setActiveDishId('homard-bleu')}
            onMouseLeave={() => setActiveDishId(null)}
          >
            <img
              src={DISHES['homard-bleu'].image}
              alt={DISHES['homard-bleu'].alt}
              loading="lazy"
              className="mosaic-img"
            />
            <div className="mosaic-tile-overlay">
              <span className="mosaic-dish-tag">{DISHES['homard-bleu'].name}</span>
            </div>
          </div>

          {/* 9. CENTER-RIGHT: LE GESTE CULINAIRE */}
          <div className="mosaic-tile tile-chef-hands">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=85"
              alt="Précision et gestes du chef"
              loading="lazy"
              className="mosaic-img"
            />
            <div className="mosaic-tile-overlay">
              <span className="mosaic-dish-tag">Le Geste Culinaire</span>
            </div>
          </div>

          {/* 10. BOTANIQUE & FLORE (SWAPPED WITH EDITORIAL TEXT) */}
          <div className="mosaic-tile tile-narrow-vertical">
            <img
              src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=85"
              alt="Herbes sauvages et racines"
              loading="lazy"
              className="mosaic-img"
            />
            <div className="mosaic-tile-overlay">
              <span className="mosaic-dish-tag">Flore & Botanique</span>
            </div>
          </div>

          {/* 11. BOTTOM-LEFT: SALLE DU RESTAURANT */}
          <div className="mosaic-tile tile-dining-room">
            <img
              src="/images/hero/hero-moody-dining-700.jpg"
              alt="Salle du restaurant NOIR"
              loading="lazy"
              className="mosaic-img"
            />
            <div className="mosaic-tile-overlay">
              <span className="mosaic-dish-tag">Atmosphère de Salle</span>
            </div>
          </div>

          {/* 12. BOTTOM-CENTER-LEFT: CHOCOLAT NOIR */}
          <div
            className={`mosaic-tile tile-dish tile-chocolat ${activeDishId === 'chocolat-noir' ? 'is-active' : ''}`}
            onMouseEnter={() => setActiveDishId('chocolat-noir')}
            onMouseLeave={() => setActiveDishId(null)}
          >
            <img
              src={DISHES['chocolat-noir'].image}
              alt={DISHES['chocolat-noir'].alt}
              loading="lazy"
              className="mosaic-img"
            />
            <div className="mosaic-tile-overlay">
              <span className="mosaic-dish-tag">{DISHES['chocolat-noir'].name}</span>
            </div>
          </div>

          {/* 13. SOLID ACCENT CTA BLOCK with arrow */}
          <Link
            to="/menus"
            className="mosaic-tile tile-solid-cta"
            title="DÉCOUVRIR LE MENU"
            onClick={(e) => {
              e.preventDefault();
              transitionTo('/menus');
            }}
          >
            <span className="tile-cta-label noir-roll-text">
              <span className="noir-roll-item is-main">DÉCOUVRIR LE MENU</span>
              <span className="noir-roll-item is-hover" aria-hidden="true">DÉCOUVRIR LE MENU</span>
            </span>
            <span className="mosaic-arrow-right">→</span>
          </Link>

          {/* 14. EXTRACTION & JUS CORSÉ */}
          <div className="mosaic-tile tile-emulsion">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=85"
              alt="Extraction et matière première"
              loading="lazy"
              className="mosaic-img"
            />
            <div className="mosaic-tile-overlay">
              <span className="mosaic-dish-tag">Extraction & Jus Corsé</span>
            </div>
          </div>

          {/* 15. BOTTOM-FAR-RIGHT: EDITORIAL PARAGRAPH BLOCK */}
          <div className="mosaic-tile tile-editorial-text">
            <p className="mosaic-editorial-para">
              Quelques créations pour commencer la soirée.
              <br /><br />
              Entrées · Plats
              <br />
              Desserts · Vins
              <br /><br />
              75001 Paris
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
