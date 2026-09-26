import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PageWrapper } from './components/layout/PageWrapper';
import { CurtainTransitionProvider } from './components/layout/CurtainTransition';
import { HomePage } from './pages/Home';
import { MenuPage } from './pages/Menu';
import { AboutPage } from './pages/About';
import { ReservationPage } from './pages/Reservation';
import { ReservationModal } from './components/ReservationModal';

export default function App() {
  const [reservationOpen, setReservationOpen] = useState(false);
  const [reservationType, setReservationType] = useState<'bench' | 'dining'>('dining');

  const openReservation = (type: 'bench' | 'dining' = 'dining') => {
    setReservationType(type);
    setReservationOpen(true);
  };

  useEffect(() => {
    // Lenis smooth scrolling configuration
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Make lenis accessible globally for programmatic scrolling
    (window as unknown as { lenis: Lenis }).lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Always force scroll back to top (0, 0) on page load/refresh
    lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    // If page reloads with a hash, remove hash so browser does not persist scroll position
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    const handleBeforeUnload = () => {
      lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  // Adaptive Text Selection Highlight:
  // Detects if the selected text or its container has a copper/terracotta color
  // and dynamically toggles .selection-copper-active to use champagne gold highlight
  useEffect(() => {
    const parseRgb = (str: string): [number, number, number] | null => {
      const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      return m ? [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)] : null;
    };

    const isCopperLike = (str: string): boolean => {
      const rgb = parseRgb(str);
      if (!rgb) return false;
      const [r, g, b] = rgb;
      const dr = r - 166;
      const dg = g - 90;
      const db = b - 68;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      const isTerracotta = r > g + 25 && g >= b - 15 && r > 120 && r < 245 && b < 120;
      return dist < 65 || isTerracotta;
    };

    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) {
        document.documentElement.classList.remove('selection-copper-active');
        return;
      }

      const range = sel.getRangeAt(0);
      let node: Node | null = range.commonAncestorContainer;
      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentElement;
      }

      let isCopper = false;
      let curr: HTMLElement | null = node as HTMLElement;
      let depth = 0;
      while (curr && depth < 4) {
        if (curr.nodeType === Node.ELEMENT_NODE) {
          const style = window.getComputedStyle(curr);
          if (isCopperLike(style.color) || isCopperLike(style.backgroundColor)) {
            isCopper = true;
            break;
          }
        }
        curr = curr.parentElement;
        depth++;
      }

      if (isCopper) {
        document.documentElement.classList.add('selection-copper-active');
      } else {
        document.documentElement.classList.remove('selection-copper-active');
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.documentElement.classList.remove('selection-copper-active');
    };
  }, []);

  return (
    <BrowserRouter>
      <CurtainTransitionProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--slate)' }}>
          <Navbar onOpenReservation={openReservation} />
          <main style={{ flex: 1 }}>
            <PageWrapper>
              <Routes>
                <Route path="/" element={<HomePage onOpenReservation={openReservation} />} />
                <Route path="/menus" element={<MenuPage onOpenReservation={openReservation} />} />
                <Route path="/menu" element={<Navigate to="/menus" replace />} />
                <Route path="/carte" element={<Navigate to="/menus" replace />} />
                <Route path="/bench" element={<Navigate to="/#bench" replace />} />
                <Route path="/about" element={<AboutPage onOpenReservation={openReservation} />} />
                <Route path="/a-propos" element={<Navigate to="/about" replace />} />
                <Route path="/reservation" element={<ReservationPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PageWrapper>
          </main>
          <Footer />

          {/* Global Reservation Modal */}
          <ReservationModal
            isOpen={reservationOpen}
            onClose={() => setReservationOpen(false)}
            defaultSitting={reservationType}
          />
        </div>
      </CurtainTransitionProvider>
    </BrowserRouter>
  );
}
