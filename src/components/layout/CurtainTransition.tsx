import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';

interface CurtainContextType {
  transitionTo: (url: string) => void;
  isTransitioning: boolean;
}

const CurtainContext = createContext<CurtainContextType>({
  transitionTo: () => {},
  isTransitioning: false,
});

export const useCurtainTransition = () => useContext(CurtainContext);

// Prevent browser from auto-scrolling during SPA route changes
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

interface CurtainTransitionProviderProps {
  children: React.ReactNode;
}

export const CurtainTransitionProvider: React.FC<CurtainTransitionProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const containerRef = useRef<HTMLDivElement>(null);
  const panelTopRef = useRef<HTMLDivElement>(null);
  const panelBottomRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const isTransitioningRef = useRef(false);
  // Render the homepage curtain closed on the very first React commit. This
  // prevents the ready hero from painting before the intro effect takes over.
  const [isInitialIntroVisible, setIsInitialIntroVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname === '/' || window.location.pathname === '';
  });

  // Helper to instantly reset all scroll containers to (0, 0)
  const forceScrollTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, opts: { immediate: boolean; force?: boolean }) => void; reset?: () => void } }).lenis;
    if (lenis) {
      if (typeof lenis.reset === 'function') lenis.reset();
      lenis.scrollTo(0, { immediate: true, force: true });
    }
  };

  // Core programmatic transition function (Close curtains -> Navigate + Scroll to top -> Open curtains)
  const transitionTo = useCallback((targetUrl: string) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);

    const panelTop = panelTopRef.current;
    const panelBottom = panelBottomRef.current;
    const container = containerRef.current;
    const badge = badgeRef.current;
    const siteHeader = document.getElementById('site-header');

    if (!panelTop || !panelBottom || !container) {
      navigate(targetUrl);
      forceScrollTop();
      isTransitioningRef.current = false;
      setIsTransitioning(false);
      document.body.classList.remove('noir-route-transition-active');
      return;
    }

    container.classList.add('is-visible', 'is-transitioning');

    const tl = gsap.timeline();

    // 1. SLIDE PANELS CLOSED
    tl.fromTo(
      panelTop,
      { yPercent: -100 },
      { yPercent: 0, duration: 0.36, ease: 'power3.inOut' },
      0
    );
    tl.fromTo(
      panelBottom,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.36, ease: 'power3.inOut' },
      0
    );

    // Fade in center transition badge
    if (badge) {
      tl.fromTo(
        badge,
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' },
        0.15
      );
    }

    // 2. MIDPOINT: Navigate and reset scroll to top immediately behind closed dark curtains
    tl.add(() => {
      // Keep the navbar visible while the panels physically close over it.
      // Only hide it once the screen is fully covered for the route swap.
      document.body.classList.add('noir-route-transition-active');
      navigate(targetUrl);
      forceScrollTop();
      window.dispatchEvent(new Event('noir-sync-logo'));
    });

    // Hold for 110ms behind closed curtains
    tl.to({}, { duration: 0.11 });

    tl.add(() => {
      forceScrollTop();
      window.dispatchEvent(new Event('noir-sync-logo'));
      // The header has been hidden behind the closed curtains. Release the
      // route-transition rule while keeping it transparent so it can return
      // with the opening panels instead of popping in after they finish.
      document.body.classList.remove('noir-route-transition-active');
      if (siteHeader) gsap.set(siteHeader, { autoAlpha: 0 });
    });

    // 3. FADE OUT BADGE & SLIDE PANELS OPEN
    if (badge) {
      tl.to(
        badge,
        { opacity: 0, scale: 1.06, duration: 0.18, ease: 'power2.in' },
        '+=0.02'
      );
    }

    tl.to(
      panelTop,
      { yPercent: -100, duration: 0.78, ease: 'power3.inOut' },
      badge ? '<' : '+=0.02'
    );
    tl.to(
      panelBottom,
      { yPercent: 100, duration: 0.78, ease: 'power3.inOut' },
      '<'
    );
    if (siteHeader) {
      tl.to(
        siteHeader,
        { autoAlpha: 1, duration: 0.32, ease: 'power2.out' },
        '<+=0.18'
      );
    }

    tl.add(() => {
      container.classList.remove('is-visible', 'is-transitioning');
      if (siteHeader) gsap.set(siteHeader, { clearProps: 'opacity,visibility' });
      isTransitioningRef.current = false;
      setIsTransitioning(false);
      document.body.classList.remove('noir-route-transition-active');
      forceScrollTop();
      window.dispatchEvent(new Event('noir-sync-logo'));
      window.dispatchEvent(new Event('noir-preloader-done'));
    });
  }, [navigate]);

  // Initial mount: Full cinematic NOIR logo intro on home page
  useLayoutEffect(() => {
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '';
    const panelTop = panelTopRef.current;
    const panelBottom = panelBottomRef.current;
    const container = containerRef.current;
    const badge = badgeRef.current;

    // SCENARIO A: Opening directly on non-homepage
    if (!isHomePage) {
      document.body.classList.add('noir-intro-done');
      document.documentElement.classList.add('noir-intro-done');
      document.body.classList.remove('noir-preloader-active');
      document.documentElement.classList.remove('noir-preloader-active');
      document.body.style.overflow = '';

      if (container) container.classList.remove('is-visible', 'is-transitioning', 'is-intro');
      setIsInitialIntroVisible(false);
      if (panelTop) gsap.set(panelTop, { yPercent: -100 });
      if (panelBottom) gsap.set(panelBottom, { yPercent: 100 });
      if (badge) gsap.set(badge, { opacity: 0 });

      forceScrollTop();
      const lenis = (window as unknown as { lenis?: { start: () => void } }).lenis;
      if (lenis) lenis.start();
      window.dispatchEvent(new Event('noir-sync-logo'));
      window.dispatchEvent(new Event('noir-preloader-done'));
      return;
    }

    // SCENARIO B: Opening Homepage (Full Cinematic NOIR Logo Intro with the REAL elements)
    let isCancelled = false;
    let ctx: gsap.Context | null = null;
    let failsafeTimer: ReturnType<typeof setTimeout> | null = null;

    const preventScroll = (e: Event) => e.preventDefault();
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    document.body.classList.add('noir-preloader-active');
    document.documentElement.classList.add('noir-preloader-active');
    document.body.style.overflow = 'hidden';

    // Close both halves before the overlay becomes visible. This prevents a
    // single-frame flash of the ready hero before the title-card sequence.
    if (panelTop) gsap.set(panelTop, { yPercent: 0 });
    if (panelBottom) gsap.set(panelBottom, { yPercent: 0 });
    if (container) {
      container.classList.add('is-visible', 'is-intro');
    }
    if (badge) {
      gsap.set(badge, { opacity: 0 });
    }

    const stopLenis = () => {
      const lenis = (window as unknown as { lenis?: { stop: () => void } }).lenis;
      if (lenis) lenis.stop();
    };
    stopLenis();
    const lenisCheck = setTimeout(stopLenis, 80);

    // Global failsafe timeout: Guarantee that after 4.0s, the curtains ALWAYS open
    failsafeTimer = setTimeout(() => {
      document.body.classList.add('noir-intro-done');
      document.documentElement.classList.add('noir-intro-done');
      document.body.classList.remove('noir-preloader-active');
      document.documentElement.classList.remove('noir-preloader-active');
      document.body.style.overflow = '';
      setIsInitialIntroVisible(false);

      if (panelTop) gsap.to(panelTop, { yPercent: -100, duration: 0.5, ease: 'power3.out' });
      if (panelBottom) gsap.to(panelBottom, { yPercent: 100, duration: 0.5, ease: 'power3.out' });
      if (container) {
        setTimeout(() => {
          container.classList.remove('is-visible', 'is-intro');
        }, 520);
      }
      const lenis = (window as unknown as { lenis?: { start: () => void } }).lenis;
      if (lenis) lenis.start();
      window.dispatchEvent(new Event('noir-preloader-done'));
      window.dispatchEvent(new Event('noir-sync-logo'));
    }, 4000);

    const runIntro = () => {
      if (isCancelled) return;

      const brandWrap = document.getElementById('noir-brand-animator');
      const brandText = document.getElementById('noir-brand-text');
      const heroStage = document.getElementById('hero-center-stage');
      const heroAnchor = document.getElementById('hero-logo-anchor');
      const heroRule = document.querySelector('.hero-center-rule') as HTMLElement | null;
      const heroClaim = document.getElementById('hero-claim');
      const claimInner = heroClaim?.querySelector('.hero-mask-inner') as HTMLElement | null;
      const chars = brandText?.querySelectorAll('.noir-char') || brandWrap?.querySelectorAll('.noir-char');

      if (!brandWrap || !heroRule || !heroClaim || !claimInner || !chars || chars.length === 0 || !panelTop || !panelBottom || !container) {
        requestAnimationFrame(runIntro);
        return;
      }

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Calculate the logo's real, resting location in the hero. This is also
      // the transform used by the navbar's scroll choreography at scroll position 0.
      const currentAnchor = heroAnchor || heroStage;
      const currentHeader = document.getElementById('noir-header-brand-wrap') || document.getElementById('site-header');
      let deltaToHero = window.innerHeight * 0.44 - 36;
      if (currentAnchor && currentHeader) {
        const aRect = currentAnchor.getBoundingClientRect();
        const hRect = currentHeader.getBoundingClientRect();
        if (aRect.height > 10) {
          const aCenterDocY = aRect.top + (window.scrollY || 0) + aRect.height / 2;
          const hCenterDocY = hRect.top + (window.scrollY || 0) + hRect.height / 2;
          deltaToHero = aCenterDocY - hCenterDocY;
        }
      }

      // Capture each element at its actual responsive final position, then use
      // transform-only offsets to place the same DOM nodes in the title card.
      // Nothing is cloned and no layout coordinates are changed.
      gsap.set(brandWrap, { x: 0, y: deltaToHero, scale: 1, opacity: 1, transformOrigin: 'center center' });
      gsap.set(heroRule, { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, transformOrigin: 'center center' });
      gsap.set(heroClaim, { x: 0, y: 0, scale: 1, opacity: 1, transformOrigin: 'center center' });
      gsap.set(claimInner, { x: 0, y: 0, opacity: 1, clipPath: 'inset(0 0 0 0)' });

      const brandFinal = brandWrap.getBoundingClientRect();
      const ruleFinal = heroRule.getBoundingClientRect();
      const claimFinal = heroClaim.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const titleBrandY = window.innerHeight * 0.42;
      const titleRuleY = titleBrandY + brandFinal.height * 0.64 + Math.min(34, window.innerHeight * 0.04);
      const titleClaimY = titleRuleY + Math.max(34, claimFinal.height * 1.35);
      const offsetTo = (rect: DOMRect, x: number, y: number) => ({
        x: x - (rect.left + rect.width / 2),
        y: y - (rect.top + rect.height / 2),
      });
      const brandOffset = offsetTo(brandFinal, centerX, titleBrandY);
      const ruleOffset = offsetTo(ruleFinal, centerX, titleRuleY);
      const claimOffset = offsetTo(claimFinal, centerX, titleClaimY);

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            clearTimeout(lenisCheck);
            if (failsafeTimer) clearTimeout(failsafeTimer);
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);

            document.body.classList.add('noir-intro-done');
            document.documentElement.classList.add('noir-intro-done');
            document.body.classList.remove('noir-preloader-active');
            document.documentElement.classList.remove('noir-preloader-active');
            document.body.style.overflow = '';
            setIsInitialIntroVisible(false);

            // Return shared hero nodes to their normal DOM state. The navbar
            // resumes ownership of the logo's regular scroll transform.
            gsap.set(chars, { clearProps: 'transform,opacity,filter' });
            gsap.set(heroRule, { clearProps: 'transform,opacity' });
            gsap.set(heroClaim, { clearProps: 'transform,opacity' });
            gsap.set(claimInner, { clearProps: 'transform,opacity,filter,clipPath' });
            gsap.set(brandWrap, { x: 0, y: deltaToHero, scale: 1, opacity: 1 });

            container.classList.remove('is-visible', 'is-intro');

            const currentLenis = (window as unknown as { lenis?: { start: () => void } }).lenis;
            if (currentLenis) currentLenis.start();

            window.dispatchEvent(new Event('noir-preloader-done'));
            window.dispatchEvent(new Event('noir-sync-logo'));
          },
        });

        // Reduced motion reveals the ready hero immediately and never leaves a
        // visitor behind a curtain.
        if (reducedMotion) {
          tl.set([panelTop, panelBottom], { yPercent: 0 })
            .set(chars, { opacity: 1, yPercent: 0 })
            .set(heroRule, { opacity: 1, clearProps: 'transform' })
            .set(heroClaim, { opacity: 1, clearProps: 'transform' })
            .set(claimInner, { opacity: 1, clearProps: 'transform,filter,clipPath' })
            .to(panelTop, { yPercent: -100, duration: 0.12, ease: 'none' })
            .to(panelBottom, { yPercent: 100, duration: 0.12, ease: 'none' }, '<');
          return;
        }

        // 1. INITIAL STATE: black curtains and the same hero DOM nodes in a
        // temporary, 115% centered title-card composition.
        tl.set([panelTop, panelBottom], { yPercent: 0 });
        tl.set(brandWrap, {
          x: brandOffset.x,
          y: deltaToHero + brandOffset.y,
          scale: 1.15,
          transformOrigin: 'center center',
          opacity: 1,
        });
        tl.set(chars, {
          yPercent: 120,
          opacity: 0,
        });
        tl.set(heroRule, {
          x: ruleOffset.x,
          y: ruleOffset.y,
          scaleX: 0,
          scaleY: 1.15,
          opacity: 0,
          transformOrigin: 'center center',
        });
        tl.set(heroClaim, {
          x: claimOffset.x,
          y: claimOffset.y,
          scale: 1.15,
          opacity: 1,
          transformOrigin: 'center center',
        });
        tl.set(claimInner, {
          yPercent: 42,
          opacity: 0,
          clipPath: 'inset(0 0 100% 0)',
          transformOrigin: 'center center',
        });
        tl.set(['.noir-header-left', '.noir-header-right'], {
          opacity: 0,
          y: 0,
        });

        // 2. CINEMATIC APPEAR PHASE (Middle of the page, everything black, 15% bigger)
        // Letters of #noir-brand-text reveal upward with a restrained stagger.
        tl.to(
          chars,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.09,
            ease: 'power3.out',
          },
          0.2
        );

        // #hero-center-stage > div.hero-center-rule expands outward from center
        tl.to(
          heroRule,
          {
            scaleX: 1.15,
            scaleY: 1.15,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
          },
          0.6
        );

        // #hero-claim > span > span reveals upward from its existing mask.
        tl.to(
          claimInner,
          {
            yPercent: 0,
            opacity: 1,
            clipPath: 'inset(0 0 0% 0)',
            duration: 0.8,
            ease: 'power3.out',
          },
          0.95
        );

        // 3. SPLIT & SETTLE PHASE
        // "then when they appear they go back to their original size while the black background splits into two,
        // upper side and lower side, both slides smoothly so the home page appears behind them and the logo Noir
        // and the text goes to their place in the hero in a smooth way"
        // The claim completes at 1.75s, then the all-black title card holds
        // before the text return and panel split begin on the same frame.
        const splitTime = 2.08;
        const splitDuration = 0.92;

        // Upper black background slides up
        tl.to(
          panelTop,
          {
            yPercent: -100,
            duration: splitDuration,
            ease: 'power3.inOut',
          },
          splitTime
        );

        // Lower black background slides down
        tl.to(
          panelBottom,
          {
            yPercent: 100,
            duration: splitDuration,
            ease: 'power3.inOut',
          },
          splitTime
        );

        // Logo NOIR goes back from 1.15 to original size (1.0) and settles into hero
        tl.to(
          brandWrap,
          {
            x: 0,
            scale: 1.0,
            y: deltaToHero,
            duration: splitDuration,
            ease: 'power3.inOut',
          },
          splitTime
        );

        // Rule goes back from 1.15 to original size (1.0)
        tl.to(
          heroRule,
          {
            x: 0,
            y: 0,
            scaleX: 1.0,
            scaleY: 1.0,
            duration: splitDuration,
            ease: 'power3.inOut',
          },
          splitTime
        );

        // Claim physically returns to its original hero position and scale.
        tl.to(
          heroClaim,
          {
            x: 0,
            y: 0,
            scale: 1.0,
            duration: splitDuration,
            ease: 'power3.inOut',
          },
          splitTime
        );

        // Header controls fade in
        tl.to(
          ['.noir-header-left', '.noir-header-right'],
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
          },
          splitTime + 0.35
        );
      });
    };

    requestAnimationFrame(runIntro);

    return () => {
      isCancelled = true;
      clearTimeout(lenisCheck);
      if (failsafeTimer) clearTimeout(failsafeTimer);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      if (ctx) ctx.revert();
    };
  }, []);

  // Global interceptor for all internal <a> and <Link> clicks across the application
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Allow default behavior if modifier key is held (new tab, new window)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      // Allow download links and target="_blank"
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const rawHref = anchor.getAttribute('href');
      if (!rawHref) return;
      if (rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('javascript:')) return;

      try {
        const dest = new URL(anchor.href, window.location.origin);
        // Only intercept same-origin navigation
        if (dest.origin !== window.location.origin) return;

        // Same page with same hash: do not close curtains
        if (dest.pathname === location.pathname && dest.search === location.search) {
          if (dest.hash) {
            // Let smooth-scroll handler deal with in-page hashes
            return;
          }
          // Exact same route, prevent re-navigation
          e.preventDefault();
          return;
        }

        // Prevent standard instantaneous React Router jump
        e.preventDefault();

        // Perform seamless curtain transition
        const targetPath = dest.pathname + dest.search + dest.hash;
        transitionTo(targetPath);
      } catch {
        // Fallback to default browser handling
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => document.removeEventListener('click', handleDocumentClick, { capture: true });
  }, [location.pathname, location.search, transitionTo]);

  // Handle browser Back / Forward history navigation
  useEffect(() => {
    const handlePopState = () => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      setIsTransitioning(true);

      const panelTop = panelTopRef.current;
      const panelBottom = panelBottomRef.current;
      const container = containerRef.current;
      const badge = badgeRef.current;
      const siteHeader = document.getElementById('site-header');

      if (!panelTop || !panelBottom || !container) {
        forceScrollTop();
        isTransitioningRef.current = false;
        setIsTransitioning(false);
        document.body.classList.remove('noir-route-transition-active');
        return;
      }

      container.classList.add('is-visible', 'is-transitioning');

      const tl = gsap.timeline({
        onComplete: () => {
          container.classList.remove('is-visible', 'is-transitioning');
          if (siteHeader) gsap.set(siteHeader, { clearProps: 'opacity,visibility' });
          isTransitioningRef.current = false;
          setIsTransitioning(false);
          document.body.classList.remove('noir-route-transition-active');
          forceScrollTop();
          window.dispatchEvent(new Event('noir-preloader-done'));
          window.dispatchEvent(new Event('noir-sync-logo'));
        },
      });

      tl.fromTo(panelTop, { yPercent: -100 }, { yPercent: 0, duration: 0.3, ease: 'power2.in' }, 0);
      tl.fromTo(panelBottom, { yPercent: 100 }, { yPercent: 0, duration: 0.3, ease: 'power2.in' }, 0);
      if (badge) {
        tl.fromTo(badge, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.2 }, 0.12);
      }
      tl.add(() => {
        forceScrollTop();
        document.body.classList.add('noir-route-transition-active');
      });
      tl.to({}, { duration: 0.08 });
      tl.add(() => {
        document.body.classList.remove('noir-route-transition-active');
        if (siteHeader) gsap.set(siteHeader, { autoAlpha: 0 });
      });
      if (badge) {
        tl.to(badge, { opacity: 0, scale: 1.05, duration: 0.18 }, '+=0.02');
      }
      tl.to(panelTop, { yPercent: -100, duration: 0.78, ease: 'power3.inOut' }, badge ? '<' : '+=0.02');
      tl.to(panelBottom, { yPercent: 100, duration: 0.78, ease: 'power3.inOut' }, '<');
      if (siteHeader) {
        tl.to(siteHeader, { autoAlpha: 1, duration: 0.32, ease: 'power2.out' }, '<+=0.18');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <CurtainContext.Provider value={{ transitionTo, isTransitioning }}>
      {children}

      {/* FULLSCREEN EDITORIAL DUAL BLACK CURTAINS & TRANSITION BADGE */}
      <div
        ref={containerRef}
        id="noir-cinematic-preloader"
        className={`noir-preloader${
          isInitialIntroVisible ? ' is-visible is-intro' : ''
        }${isTransitioning ? ' is-visible is-transitioning' : ''}`}
        aria-label="NOIR Paris Curtain Transition"
        role="status"
      >
        <div ref={panelTopRef} className="noir-preloader-panel panel-top intro-panel-top" />
        <div ref={panelBottomRef} className="noir-preloader-panel panel-bottom intro-panel-bottom" />

        {/* Central Transition Badge (Visible during page transitions between routes) */}
        <div ref={badgeRef} className="noir-transition-badge" aria-hidden="true">
          <span className="noir-transition-badge-word">NOIR</span>
          <span className="noir-transition-badge-sub">PARIS</span>
        </div>
      </div>
    </CurtainContext.Provider>
  );
};
