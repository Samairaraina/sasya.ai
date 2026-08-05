import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { Preloader } from './components/layout/Preloader'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { AuthGate } from './components/layout/AuthGate'
import { AuthProvider } from './lib/auth'
import { LangProvider } from './lib/lang'
import { ChatWidget } from './components/sections/ChatWidget'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { PageTransition } from './components/layout/PageShell'

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })))
const FeaturesPage = lazy(() => import('./pages/FeaturesPage').then((m) => ({ default: m.FeaturesPage })))
const SolutionsPage = lazy(() => import('./pages/SolutionsPage').then((m) => ({ default: m.SolutionsPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const ExpensesPage = lazy(() => import('./pages/ExpensesPage').then((m) => ({ default: m.ExpensesPage })))
const SchemesPage = lazy(() => import('./pages/SchemesPage').then((m) => ({ default: m.SchemesPage })))
const PricingPage = lazy(() => import('./pages/PricingPage').then((m) => ({ default: m.PricingPage })))
const ResourcesPage = lazy(() => import('./pages/ResourcesPage').then((m) => ({ default: m.ResourcesPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })))

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/features" element={<PageTransition><FeaturesPage /></PageTransition>} />
        <Route path="/solutions" element={<PageTransition><SolutionsPage /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
        <Route path="/expenses" element={<PageTransition><ExpensesPage /></PageTransition>} />
        <Route path="/schemes" element={<PageTransition><SchemesPage /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
        <Route path="/resources" element={<PageTransition><ResourcesPage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="*" element={<PageTransition><HomePage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
    })
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  useEffect(() => {
    if (!loaded) {
      document.documentElement.style.overflow = 'hidden'
      return
    }
    document.documentElement.style.overflow = ''
    window.scrollTo(0, 0)
  }, [loaded])

  return (
    <BrowserRouter>
      <AuthProvider>
        <LangProvider>
          <div className="relative min-h-screen bg-forest-900 text-white transition-colors duration-500 dark:bg-[#0a1f1d]">
            <AuthGate>
              <div className="noise" />
              <Preloader onDone={() => setLoaded(true)} />
              {loaded && (
                <Suspense fallback={null}>
                  <ScrollToTop />
                  <Navbar />
                  <main>
                    <AnimatedRoutes />
                  </main>
                  <Footer />
                  <ChatWidget />
                </Suspense>
              )}
            </AuthGate>
          </div>
        </LangProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
