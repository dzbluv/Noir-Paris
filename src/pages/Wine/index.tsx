import React, { useEffect } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface WinePageProps {
  onOpenReservation: () => void;
}

export const WinePage: React.FC<WinePageProps> = ({ onOpenReservation }) => {
  useScrollReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page" id="noir-wine-page">
      <div className="inner">
        <p className="label">LA CAVE · NOIR</p>
        <h1 className="title">
          Living Wines &amp; Extractions at <i>NOIR</i>
        </h1>
        <p className="lead">
          Low-intervention viticulture, ancestral terroirs, and botanical distillations curated by Sommelier Marc Delorme.
        </p>

        {/* Sommelier Essay */}
        <div className="essay rv">
          <blockquote className="bd" style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.3, color: 'var(--linen)', marginBottom: '1.5rem' }}>
            « A great wine does not dazzle through power, but through vibration and silence. »
          </blockquote>
          <p className="body" style={{ color: 'var(--soft)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '68ch' }}>
            Our cellar prioritizes winemakers who farm their parcels without chemical synthesis, listening to geology and seasonal rhythm. We look for electric acidity, salinity born from schist and limestone, and pure energetic expression. Alongside 400 references of living French wines, our laboratory develops house cold-pressed botanical extractions from wild mountain plants.
          </p>
          <div className="sign" style={{ marginTop: '1.2rem', fontFamily: 'var(--font-bodoni)', color: 'var(--linen)', fontSize: '1.1rem' }}>
            Marc Delorme · Sommelier de NOIR Paris
          </div>
        </div>

        {/* Pairings Banner */}
        <div style={{ margin: '3.5rem 0', padding: '2rem', background: 'var(--slate-2)', border: '1px solid var(--hair-tan)' }}>
          <p className="label">WINE PAIRINGS · ALONGSIDE THE SEQUENCES</p>
          <div className="pairing" style={{ marginTop: '1rem' }}>
            <div>
              <span className="label dimmed">Accord Vins Vivants</span>
              <b>€85</b>
            </div>
            <div>
              <span className="label dimmed">Prestige Allocations</span>
              <b>€135</b>
            </div>
            <div>
              <span className="label dimmed">Extraction Botanique</span>
              <b>€45</b>
            </div>
          </div>
          <p style={{ color: 'var(--dim)', fontSize: '0.85rem', marginTop: '1.2rem', lineHeight: 1.6 }}>
            Poured sequence-by-sequence to elevate the smoke, salinity, and textural counterpoints crafted by Chef Élise Moreau.
          </p>
        </div>

        {/* 9 Chapters Showcase */}
        <section style={{ marginTop: '4rem' }}>
          <p className="label rv">THE CELLAR ARCHIVE</p>
          <h2 className="bd rv rv2" style={{ fontSize: '2.2rem', fontWeight: 400, marginTop: '0.4rem' }}>
            Nine Cellar Chapters
          </h2>
          <div className="h2rule rv rv2" style={{ margin: '1rem 0 2rem' }} aria-hidden="true" />

          <ol className="chapters rv rv3" style={{ maxWidth: '800px' }}>
            <li>
              <i>01</i>
              <span>Champagnes de Vignerons &amp; Bulles d’Auteur (Zero dosage, biodynamic)</span>
            </li>
            <li>
              <i>02</i>
              <span>Blancs Salins &amp; Minéraux Tranchants (Muscadet de gneiss, Chablis kimméridgien)</span>
            </li>
            <li>
              <i>03</i>
              <span>Chenins &amp; Savagnins de Terroirs Singuliers (Loire &amp; Jura)</span>
            </li>
            <li>
              <i>04</i>
              <span>Grands Blancs de Matière &amp; Macérations Pelliculaires</span>
            </li>
            <li>
              <i>05</i>
              <span>Rouges Fluides, Infusés &amp; Épices Sauvages (Poulsard, Trousseau, Pineau d’Aunis)</span>
            </li>
            <li>
              <i>06</i>
              <span>Noirs Profonds, Silences &amp; Granites (Cornas, Côte-Rôtie, Cahors haute altitude)</span>
            </li>
            <li>
              <i>07</i>
              <span>Vins Sous Voile, Oxydatifs &amp; Vin Jaune de Longue Garde</span>
            </li>
            <li>
              <i>08</i>
              <span>Trésors de Garde &amp; Vieux Millésimes du Patrimoine Français</span>
            </li>
            <li>
              <i>09</i>
              <span>Infusions Sauvages, Verjus Fumé &amp; Extractions Botaniques</span>
            </li>
          </ol>
        </section>

        {/* By the Glass & Curations */}
        <section style={{ marginTop: '5rem', borderTop: '1px solid var(--hair)', paddingTop: '3rem' }}>
          <div className="cols">
            <div className="col rv">
              <span className="big">Glass</span>
              <h3>Au Verre &amp; Coravin</h3>
              <p style={{ marginTop: '0.6rem' }}>
                Each evening, our team opens rare single-vineyard bottles on Coravin, allowing guests to explore mythical cuvées without committing to a whole bottle.
              </p>
            </div>

            <div className="col rv rv2">
              <span className="big">Cider</span>
              <h3>Cidres Poirés Vivants</h3>
              <p style={{ marginTop: '0.6rem' }}>
                Native yeast ferments from ancient Normandy and Breton orchards, offering dry astringency and delicate tannins paired with our smoked root courses.
              </p>
            </div>

            <div className="col rv rv3">
              <span className="big">Botanica</span>
              <h3>Non-Alcoholic Extractions</h3>
              <p style={{ marginTop: '0.6rem' }}>
                Cold-brewed infusions of charred French oak, mountain juniper, and meadowsweet crafted daily in our culinary laboratory.
              </p>
            </div>
          </div>
        </section>

        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <button
            type="button"
            className="reserve"
            style={{ position: 'static', display: 'inline-block' }}
            onClick={() => onOpenReservation()}
          >
            Reserve Your Table at NOIR
          </button>
        </div>
      </div>
    </div>
  );
};
