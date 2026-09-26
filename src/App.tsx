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
