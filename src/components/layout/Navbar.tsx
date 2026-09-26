import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';
import { useCurtainTransition } from './CurtainTransition';

interface NavbarProps {
  onOpenReservation: () => void;
}

interface NavItem {
  id: string;
  num: string;
  label: string;
  href?: string;
  to?: string;
  isHash?: boolean;
  image: string;
  tag: string;
  caption: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'hero',
    num: '01',
    label: 'Accueil',
    href: '#hero',
    isHash: true,
    image: '/images/hero/hero-moody-dining-1600.jpg',
    tag: 'SALLE DES LUMIÈRES',
    caption: '12 Tables Confidentielles · Palais-Royal',
  },
  {
    id: 'philosophy',
    num: '02',
    label: 'Philosophie',
    href: '#philosophy',
    isHash: true,
    image: '/images/philosophy/philosophy-essence.jpg',
    tag: 'L’ESSENCE AVANT TOUT',
    caption: 'Chef Antonin Laurent & La Brigade',
  },
  {
    id: 'experience',
    num: '03',
    label: 'L’Expérience',
    href: '#experience',
    isHash: true,
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=85',
    tag: 'CHORÉGRAPHIE EN 5 TEMPS',
    caption: 'Du Seuil à l’Empreinte · Voyage Immersif',
  },
  {
    id: 'menu',
    num: '04',
    label: 'Le Menu',
    href: '#menu',
    isHash: true,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=85',
    tag: 'SUR LA TABLE',
    caption: 'Créations Éphémères & Produits d’Exception',
  },
  {
    id: 'gallery',
    num: '05',
    label: 'Le Monde de NOIR',
    href: '#gallery',
    isHash: true,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1400&q=85',
    tag: 'ARCHIVE VISUELLE',
    caption: 'Lumière, Matière, Geste & Saveur',
  },
  {
    id: 'practical',
    num: '06',
    label: 'Trouver NOIR',
    href: '#practical',
    isHash: true,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85',
    tag: 'PALAIS-ROYAL · PARIS 1ER',
    caption: '12 Rue Fictive · Du Mardi au Samedi',
  },
  {
    id: 'reservation',
    num: '07',
    label: 'Réservation',
    href: '#reservation',
    isHash: true,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=85',
    tag: 'LA SOIRÉE COMMENCE ICI',
    caption: '12 Tables Uniques · Service du Soir',
  },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenReservation }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transitionTo } = useCurtainTransition();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [isPhoneCopied, setIsPhoneCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const brandWrapRef = useRef<HTMLDivElement>(null);
  const brandSubRef = useRef<HTMLSpanElement>(null);

  const isHome = location.pathname === '/';

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  // Monitor scroll position to adapt navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const scrolledThreshold = isHome ? Math.min(window.innerHeight * 0.45, 300) : 24;
      setIsScrolled(window.scrollY > scrolledThreshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  // Smooth Hero-to-Navbar Logo Animation & Coordination
  useEffect(() => {
    const brandWrap = brandWrapRef.current;
    const brandSub = brandSubRef.current;

    if (!isHome) {
      // Non-homepage routes: Keep logo docked in navbar
      const heroFontSize = Math.min(Math.max(window.innerWidth * 0.125, 72), 152);
      const navbarFontSize = window.innerWidth < 768 ? 19 : 23;
      const scaleTarget = navbarFontSize / heroFontSize;
      const subOpticalOffset = heroFontSize * 0.09 * scaleTarget;

      if (brandWrap) {
        brandWrap.style.transform = `translate3d(0, 0, 0) scale(${scaleTarget.toFixed(4)})`;
      }
      if (brandSub) {
        brandSub.style.opacity = '1';
        brandSub.style.transform = `translateX(calc(-50% + ${subOpticalOffset.toFixed(2)}px)) translateY(0)`;
      }
      return;
    }

    let rafId: number | null = null;
    let initialMeasureFrame: number | null = null;
    let lastProgress = -1;
    let maxDeltaY = Math.max(window.innerHeight * 0.44 - 20, 280);
    let scaleTarget = 1;
    let heroFontSize = Math.min(Math.max(window.innerWidth * 0.125, 72), 152);
    let threshold = Math.min(window.innerHeight * 0.48, 380);
    let heroCenterStage = document.getElementById('hero-center-stage');

    // Measuring layout during every Lenis tick forces synchronous reflow. The
    // hero and fixed header geometry only changes after a route/font/resize
    // change, so cache it and refresh only on those events.
    const refreshLogoMetrics = () => {
      const anchor = document.getElementById('hero-logo-anchor');
      const headerCenter = document.getElementById('noir-header-brand-wrap');
      heroCenterStage = document.getElementById('hero-center-stage');

      heroFontSize = Math.min(Math.max(window.innerWidth * 0.125, 72), 152);
      const navbarFontSize = window.innerWidth < 768 ? 19 : 23;
      scaleTarget = navbarFontSize / heroFontSize;
      threshold = Math.min(window.innerHeight * 0.48, 380);
      maxDeltaY = Math.max(window.innerHeight * 0.44 - (headerCenter?.getBoundingClientRect().height ?? 40) / 2, 280);

      if (anchor) {
        const anchorRect = anchor.getBoundingClientRect();
        if (anchorRect.height > 10) {
          const headerRect = headerCenter?.getBoundingClientRect();
          const headerCenterY = headerRect ? headerRect.top + headerRect.height / 2 : 36;
          // Add the current scroll once so this stays a document-space value.
          maxDeltaY = Math.max(220, anchorRect.top + window.scrollY + anchorRect.height / 2 - headerCenterY);
        }
      }
    };

    const updateLogoPosition = () => {
      rafId = null;
      const isIntroDone =
        document.body.classList.contains('noir-intro-done') ||
        document.documentElement.classList.contains('noir-intro-done');

      const hasActivePreloader =
        !isIntroDone &&
        (document.body.classList.contains('noir-preloader-active') ||
          document.documentElement.classList.contains('noir-preloader-active'));

      if (hasActivePreloader) {
        return;
      }

      if (!brandWrap) return;

      const scrollY = Math.max(0, window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0);

      // Scroll threshold: complete transition smoothly as user scrolls towards next section
      const rawProgress = Math.min(1, Math.max(0, scrollY / threshold));

      // Lenis can emit a final duplicate tick once it has settled.
      if (rawProgress === lastProgress) return;
      lastProgress = rawProgress;

      // EaseInOutCubic luxury easing
      const ease = rawProgress < 0.5
        ? 4 * rawProgress * rawProgress * rawProgress
        : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

      const currentY = maxDeltaY * (1 - ease);
      const currentScale = scaleTarget + (1 - scaleTarget) * (1 - ease);
      // The wordmark has a 0.18em optical tracking offset. Its visible glyph
      // center therefore sits 0.09em to the right of the animator's center.
      // Match the PARIS label to that center after the wordmark scale is applied.
      const subOpticalOffset = heroFontSize * 0.09 * currentScale;

      brandWrap.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0) scale(${currentScale.toFixed(4)})`;

      if (brandSub) {
        const subProgress = Math.max(0, (rawProgress - 0.7) / 0.3);
        brandSub.style.opacity = subProgress.toFixed(3);
        brandSub.style.transform = `translateX(calc(-50% + ${subOpticalOffset.toFixed(2)}px)) translateY(${(1 - subProgress) * 4}px)`;
      }

      if (heroCenterStage) {
        const heroOpacity = Math.max(0, 1 - rawProgress * 2.0);
        const heroTranslate = -rawProgress * 24;
        heroCenterStage.style.opacity = heroOpacity.toFixed(3);
        heroCenterStage.style.transform = `translate3d(0, ${heroTranslate.toFixed(1)}px, 0)`;
      }
    };

    const handleScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(updateLogoPosition);
    };

    const refreshAndUpdate = () => {
      refreshLogoMetrics();
      lastProgress = -1;
      handleScroll();
    };

    refreshLogoMetrics();
    handleScroll();
    initialMeasureFrame = requestAnimationFrame(refreshAndUpdate);
    const timer = setTimeout(refreshAndUpdate, 180);

    const lenis = (window as unknown as { lenis?: { on: (ev: string, cb: () => void) => void; off: (ev: string, cb: () => void) => void } }).lenis;
    if (lenis) {
      lenis.on('scroll', handleScroll);
    } else {
      // Lenis has not initialized yet on the first application mount.
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('resize', refreshAndUpdate, { passive: true });
    window.addEventListener('noir-preloader-done', refreshAndUpdate);
    window.addEventListener('noir-sync-logo', refreshAndUpdate);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (initialMeasureFrame !== null) cancelAnimationFrame(initialMeasureFrame);
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', refreshAndUpdate);
      window.removeEventListener('noir-preloader-done', refreshAndUpdate);
      window.removeEventListener('noir-sync-logo', refreshAndUpdate);
      if (lenis) {
        lenis.off('scroll', handleScroll);
      }
    };
  }, [isHome]);

  // Prevent background scrolling while the drawer is open & handle Escape key
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Stop Lenis smooth scroll if present
      if (typeof window !== 'undefined' && (window as unknown as { lenis?: { stop: () => void } }).lenis) {
        (window as unknown as { lenis: { stop: () => void } }).lenis.stop();
      }
    } else {
      document.body.style.overflow = '';
      if (typeof window !== 'undefined' && (window as unknown as { lenis?: { start: () => void } }).lenis) {
        (window as unknown as { lenis: { start: () => void } }).lenis.start();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    if (!isMenuOpen) return;
    setIsMenuOpen(false);
    triggerRef.current?.focus();
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    closeMenu();
    setTimeout(() => {
      if (hash === '#hero') {
        if (location.pathname !== '/') {
          transitionTo('/');
        } else {
          const lenis = (window as unknown as { lenis?: { scrollTo: (target: number | string | HTMLElement, opts?: { duration?: number }) => void } }).lenis;
          if (lenis) {
            lenis.scrollTo(0, { duration: 1.2 });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          if (window.location.hash) {
            window.history.pushState(null, '', '/');
          }
        }
        return;
      }

      if (location.pathname !== '/') {
        transitionTo('/' + hash);
      } else {

        const target = document.querySelector(hash);
        if (target) {
          const lenis = (window as unknown as { lenis?: { scrollTo: (target: number | string | HTMLElement, opts?: { duration?: number }) => void } }).lenis;
          if (lenis) {
            lenis.scrollTo(target as HTMLElement, { duration: 1.2 });
          } else {
            target.scrollIntoView({ behavior: 'smooth' });
          }
          window.history.pushState(null, '', hash);
        }
      }
    }, 280);
  };

  const handleRouteClick = (e: React.MouseEvent, to: string) => {
    e.preventDefault();
    closeMenu();
    setTimeout(() => {
      transitionTo(to);
    }, 120);
  };

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
  };

  const handlePhoneClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const phoneNumber = '+33 1 42 68 00 00';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(phoneNumber).catch(() => {
        fallbackCopyText(phoneNumber);
      });
    } else {
      fallbackCopyText(phoneNumber);
    }

    setIsPhoneCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => {
      setIsPhoneCopied(false);
    }, 2000);
  };

  const handleReserveClick = () => {
    if (isMenuOpen) closeMenu();
    transitionTo('/reservation');
  };

  const activeItem = NAV_ITEMS[activeItemIndex] || NAV_ITEMS[0];

  return (
    <>
      {/* FIXED SITE HEADER */}
      <header
        id="site-header"
        className={`noir-header ${isScrolled ? 'noir-header--scrolled' : ''} ${
          isMenuOpen ? 'noir-header--menu-active' : ''
        }`}
        role="banner"
      >
        <div className="noir-header-container">
          {/* LEFT ZONE: Architectural Menu / Close Toggle Button */}
          <div className="noir-header-left">
            <button
              ref={triggerRef}
              type="button"
              id="btn-menu-trigger"
              className={`noir-menu-btn ${isMenuOpen ? 'is-active' : ''}`}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
              aria-controls="noir-architectural-menu"
            >
              <span className="noir-menu-mark" aria-hidden="true">
                <span className="noir-mark-track line-1">
                  <span className="noir-mark-runner" />
                </span>
                <span className="noir-mark-track line-2">
                  <span className="noir-mark-runner" />
                </span>
              </span>
              <span className="noir-menu-label" aria-hidden="true">
                <span className="noir-menu-label-text is-main">
                  {isMenuOpen ? 'Close' : 'Menu'}
                </span>
                <span className="noir-menu-label-text is-hover">
                  {isMenuOpen ? 'Close' : 'Menu'}
                </span>
              </span>
            </button>
          </div>

          {/* CENTER ZONE: Centered Brand Wordmark with Smooth Hero-to-Navbar Motion */}
          <div className="noir-header-center" id="noir-header-brand-wrap">
            <Link
              to="/"
              className="noir-brand-link"
              aria-label="NOIR Paris — Return to homepage"
              onClick={(e) => {
                if (isMenuOpen) closeMenu();
                if (location.pathname === '/') {
                  e.preventDefault();
                  const lenis = (window as unknown as { lenis?: { scrollTo: (target: number, opts?: { duration?: number }) => void } }).lenis;
                  if (lenis) {
                    lenis.scrollTo(0, { duration: 1.2 });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }
              }}
            >
              <div
                ref={brandWrapRef}
                className="noir-brand-animator"
                id="noir-brand-animator"
              >
                <span className="noir-brand-text" id="noir-brand-text">
                  <span className="noir-char-mask">
                    <span className="noir-char">N</span>
                  </span>
                  <span className="noir-char-mask">
                    <span className="noir-char">O</span>
                  </span>
                  <span className="noir-char-mask">
                    <span className="noir-char">I</span>
                  </span>
                  <span className="noir-char-mask">
                    <span className="noir-char">R</span>
                  </span>
                </span>
              </div>
              <span
                ref={brandSubRef}
                className="noir-brand-sub"
                style={{
                  opacity: isHome ? 0 : 1,
                }}
              >
                PARIS
              </span>
            </Link>
          </div>

          {/* RIGHT ZONE: Phone Direct Line & Reserve Button */}
          <div className="noir-header-right">
            <a
              href="tel:+33142680000"
              className="noir-phone-btn"
              onClick={handlePhoneClick}
              aria-label="Call NOIR Paris at +33 1 42 68 00 00 or copy number"
              title={isPhoneCopied ? 'Numéro copié dans le presse-papier !' : '+33 (0)1 42 68 00 00'}
            >
              <svg
                className="noir-phone-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="noir-phone-text noir-roll-text">
                <span className="noir-roll-item is-main">{isPhoneCopied ? 'NUMÉRO COPIÉ' : '+33 1 42 68 00 00'}</span>
                <span className="noir-roll-item is-hover" aria-hidden="true">{isPhoneCopied ? 'NUMÉRO COPIÉ' : '+33 1 42 68 00 00'}</span>
              </span>
            </a>

            <button
              type="button"
              id="btn-reserve-nav"
              className="noir-reserve-cta"
              onClick={handleReserveClick}
              aria-label="Reserve a table at NOIR Paris"
            >
              <span className="noir-cta-full noir-roll-text">
                <span className="noir-roll-item is-main">RESERVE A TABLE</span>
                <span className="noir-roll-item is-hover" aria-hidden="true">RESERVE A TABLE</span>
              </span>
              <span className="noir-cta-short noir-roll-text">
                <span className="noir-roll-item is-main">RESERVE</span>
                <span className="noir-roll-item is-hover" aria-hidden="true">RESERVE</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ARCHITECTURAL EDITORIAL NAVIGATION CURTAIN OVERLAY */}
      <div
        id="noir-architectural-menu"
        className={`noir-curtain-overlay ${isMenuOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal={isMenuOpen}
        aria-hidden={!isMenuOpen}
        aria-label="Editorial Navigation Menu"
      >
        {/* Atmospheric Backdrop (preserves restaurant ambiance underneath) */}
        <div
          className="noir-curtain-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />

        {/* Architectural Stage Container */}
        <div
          ref={panelRef}
          className="noir-curtain-stage"
        >
          {/* PRIMARY EDITORIAL PANEL */}
          <div className="noir-panel-editorial">
            {/* Top Bar with Minimal Rule + CLOSE */}
            <div className="noir-editorial-topbar">
              <button
                type="button"
                id="btn-editorial-close"
                className="noir-editorial-close-btn"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <span className="close-line close-line-track" aria-hidden="true">
                  <span className="close-line-runner" />
                </span>
                <span className="close-txt" aria-hidden="true">
                  <span className="close-txt-roll is-main">CLOSE</span>
                  <span className="close-txt-roll is-hover">CLOSE</span>
                </span>
              </button>
            </div>

            {/* Main Editorial Column */}
            <div className="noir-editorial-grid">
              <div className="noir-editorial-nav-col">
                <div className="noir-col-eyebrow">MENU</div>

                <nav className="noir-editorial-nav" aria-label="Main navigation">
                  {NAV_ITEMS.map((item, index) => {
                    const isActive =
                      (item.isHash &&
                        location.pathname === '/' &&
                        (location.hash === item.href || (!location.hash && item.href === '#hero'))) ||
                      (!item.isHash && location.pathname === item.to);
                    const isHovered = activeItemIndex === index;

                    return (
                      <div
                        key={item.id}
                        className="noir-nav-item-wrap"
                        onMouseEnter={() => setActiveItemIndex(index)}
                        onFocus={() => setActiveItemIndex(index)}
                      >
                        {item.isHash ? (
                          <a
                            href={`/${item.href}`}
                            className={`noir-editorial-link ${
                              isActive ? 'is-current' : ''
                            } ${isHovered ? 'is-selected' : ''}`}
                            onClick={(e) => handleNavClick(e, item.href!)}
                          >
                            <span className="link-text">{item.label}</span>
                          </a>
                        ) : (
                          <Link
                            to={item.to!}
                            className={`noir-editorial-link ${
                              isActive ? 'is-current' : ''
                            } ${isHovered ? 'is-selected' : ''}`}
                            onClick={(e) => handleRouteClick(e, item.to!)}
                          >
                            <span className="link-text">{item.label}</span>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </nav>

                {/* INFO section matching reference structure */}
                <div className="noir-editorial-info">
                  <div className="noir-info-eyebrow">INFO</div>
                  <div className="noir-info-body">
                    <p className="noir-info-lead">Cuisine Française Contemporaine</p>
                    <p>12 Rue Fictive, 75001 Paris · Palais-Royal</p>
                    <p className="noir-info-contact">
                      <a href="tel:+33142680000">+33 (0)1 42 68 00 00</a>
                      <br />
                      <a href="mailto:reservations@noir-paris.fr">reservations@noir-paris.fr</a>
                    </p>
                  </div>

                  {/* Social links with icons and labels */}
                  <div className="noir-editorial-socials">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="noir-social-link-btn"
                      aria-label="Facebook"
                      title="Facebook"
                    >
                      <span className="noir-social-circle" aria-hidden="true">
                        <Facebook size={12} />
                      </span>
                      <span className="noir-social-name">Facebook</span>
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="noir-social-link-btn"
                      aria-label="Instagram"
                      title="Instagram"
                    >
                      <span className="noir-social-circle" aria-hidden="true">
                        <Instagram size={12} />
                      </span>
                      <span className="noir-social-name">Instagram</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT-SIDE ATMOSPHERIC IMAGE PANEL */}
          <div className="noir-panel-visual" aria-hidden="true">
            <div className="noir-visual-stage">
              {NAV_ITEMS.map((item, index) => {
                const isCur = activeItemIndex === index;
                return (
                  <div
                    key={item.id}
                    className={`noir-visual-layer ${isCur ? 'is-active' : ''}`}
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="noir-visual-layer-img"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
