import { useState, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import Preloader from './components/Preloader/Preloader'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Projects from './components/Projects/Projects'
import Experience from './components/Experience/Experience'
import Skills from './components/Skills/Skills'
import Education from './components/Education/Education'
import Contact from './components/Contact/Contact'
import { Routes, Route, useLocation } from 'react-router-dom'
import ConstellationNav from './components/ConstellationNav/ConstellationNav'
import Certifications from './components/Certifications/Certifications'
import ProjectDetail from './components/ProjectDetail/ProjectDetail'
import LanguageToggle from './components/LanguageToggle/LanguageToggle'

function Home({ preloaderDone, activeSection }) {
  return (
    <div style={{ opacity: preloaderDone ? 1 : 0, transition: 'opacity 0.8s ease' }}>
      <ConstellationNav activeSection={activeSection} />
      <section id="hero"><Hero /></section>
      <section id="about"><About /></section>
      <section id="projects"><Projects /></section>
      <section id="experience"><Experience /></section>
      <section id="skills"><Skills /></section>
      <section id="certifications"><Certifications /></section>
      <section id="education"><Education /></section>
      <section id="contact"><Contact /></section>
    </div>
  )
}

function App() {
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const lenisRef = useRef(null)
  const location = useLocation()

  // Scroll to top or hash on route change
  useEffect(() => {
    if (location.hash) {
      // Small timeout to ensure DOM is ready after route transition
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          // If lenis is initialized, use its scrollTo, otherwise fallback to native
          if (lenisRef.current) {
            lenisRef.current.scrollTo(el);
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  // Lenis smooth scroll
  useEffect(() => {
    if (!preloaderDone) return

    const lenis = new Lenis({
      duration: 1.4,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
    })
    lenisRef.current = lenis

    const raf = (time) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [preloaderDone])

  // Active section tracker
  useEffect(() => {
    if (!preloaderDone) return
    const sectionIds = ['hero', 'about', 'projects', 'experience', 'skills', 'certifications', 'education', 'contact']
    
    const handleScroll = () => {
      const center = window.innerHeight / 2
      let currentId = 'hero'

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          // If the middle of the screen is within this element's bounds
          if (rect.top <= center && rect.bottom >= center) {
            currentId = id
            break
          }
        }
      }
      
      // Prevent unnecessary state updates
      setActiveSection((prev) => (prev !== currentId ? currentId : prev))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [preloaderDone])

  return (
    <main>
      <LanguageToggle />
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
      
      <Routes>
        <Route path="/" element={<Home preloaderDone={preloaderDone} activeSection={activeSection} />} />
        <Route path="/project/:id" element={
          <div style={{ opacity: preloaderDone ? 1 : 0, transition: 'opacity 0.8s ease' }}>
            <ProjectDetail />
          </div>
        } />
      </Routes>
    </main>
  )
}

export default App