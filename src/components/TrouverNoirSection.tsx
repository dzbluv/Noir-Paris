import React from 'react';

interface TrouverNoirSectionProps {
  onOpenReservation?: () => void;
}

export const TrouverNoirSection: React.FC<TrouverNoirSectionProps> = () => {
  return (
    <section className="chapter noir-find-section" id="practical" aria-label="Trouver NOIR — Adresse, Horaires & Contact">
      {/* Background Architectural Layer: Nocturnal Paris + Strong Black Gradient */}
      <div className="noir-find-bg-layer" aria-hidden="true">
        <img
          src="/images/trouver/paris-night-bg.jpg"
          alt=""
          className="noir-find-bg-img"
          loading="lazy"
        />
        <div className="noir-find-bg-gradient" />
      </div>

      <div className="inner noir-find-inner">
        <div className="noir-find-grid">
          
          {/* LEFT: Typographic Composition directly matching the editorial reference */}
          <div className="noir-find-content rv">
            
            {/* Big Architectural 05 Numeral Lockup */}
            <div className="noir-find-numeral-lockup rv" aria-hidden="true">
              <svg
                className="noir-find-numeral-svg"
                viewBox="0 0 280 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line className="find-accent-line" x1="16" y1="0" x2="16" y2="38" stroke="#a65a44" strokeWidth="1.2" />
                <circle className="find-arc-primary" cx="170" cy="90" r="72" stroke="#a65a44" strokeWidth="1" opacity="0.5" />
                <path className="find-arc-secondary" d="M 22,130 A 90,90 0 0,1 236,40" stroke="#a65a44" strokeWidth="0.8" opacity="0.35" />
                <line className="find-baseline" x1="16" y1="154" x2="95" y2="154" stroke="#a65a44" strokeWidth="1" opacity="0.5" />
                <text
                  className="find-num"
                  x="14"
                  y="148"
                  fill="#a65a44"
                  fontFamily="'Bodoni Moda', Didot, Georgia, serif"
                  fontSize="135"
                  fontWeight="400"
                  letterSpacing="-0.04em"
                >
                  05
                </text>
              </svg>
            </div>

            {/* Large Editorial Headline: Upright Serif + Italic Gold Accent */}
            <h2 className="noir-find-title">
              Trouver NOIR,{' '}
              <i className="noir-find-title-italic">à quelques pas du tumulte.</i>
            </h2>

            {/* Accent Gold Rule */}
            <div className="noir-find-rule" aria-hidden="true" />

            {/* Opening Hours Ledger Rows */}
            <div className="noir-find-ledger">
              <div className="noir-find-row">
                <span className="noir-find-row-label">Dîner</span>
                <span className="noir-find-row-val">Mardi au Samedi · 19:00 — 23:30</span>
              </div>
              <div className="noir-find-row">
                <span className="noir-find-row-label">Fermé</span>
                <span className="noir-find-row-val">Dimanche et Lundi</span>
              </div>
            </div>

            {/* Address & Contact Info */}
            <div className="noir-find-meta">
              <p className="noir-find-address">
                12 Rue Fictive, 75001 Paris, Palais-Royal
              </p>
              <div className="noir-find-contact">
                <a
                  href="tel:+33142680000"
                  className="noir-find-phone"
                  aria-label="Téléphone : +33 1 42 68 00 00"
                >
                  <span className="noir-roll-text">
                    <span className="noir-roll-item is-main">+33 1 42 68 00 00</span>
                    <span className="noir-roll-item is-hover" aria-hidden="true">+33 1 42 68 00 00</span>
                  </span>
                </a>
                <span className="noir-find-sep" aria-hidden="true">·</span>
                <a
                  href="mailto:reservations@noir-paris.fr"
                  className="noir-find-email"
                  aria-label="Email : reservations@noir-paris.fr"
                >
                  <span className="noir-roll-text">
                    <span className="noir-roll-item is-main">reservations@noir-paris.fr</span>
                    <span className="noir-roll-item is-hover" aria-hidden="true">reservations@noir-paris.fr</span>
                  </span>
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT: Real Google Maps showing Restaurant Location (Permanent Dark Mode) */}
          <div className="noir-find-map-col rv rv2">
            <figure className="noir-find-figure">
              {/* Map Frame */}
              <div className="noir-find-map-frame">
                <iframe
                  title="Google Maps — Emplacement du restaurant NOIR à Paris 1er"
                  src="https://maps.google.com/maps?q=48.8634,2.3364&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="noir-find-map-iframe"
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              {/* Minimal Caption below map */}
              <figcaption className="noir-find-figcaption">
                <span className="noir-fig-loc">12 Rue Fictive · 75001 Paris · Palais-Royal</span>
                <a
                  href="https://maps.google.com/maps?q=48.8634,2.3364"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="noir-fig-link"
                  aria-label="Ouvrir dans Google Maps (nouvel onglet)"
                >
                  <span>OUVRIR DANS GOOGLE MAPS</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </figcaption>
            </figure>
          </div>

        </div>
      </div>
    </section>
  );
};
