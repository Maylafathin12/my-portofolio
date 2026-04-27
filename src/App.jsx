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
import ConstellationNav from './components/ConstellationNav/ConstellationNav'
import Certifications from './components/Certifications/Certifications'

function App() {
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const lenisRef = useRef(null)

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
    const sectionIds = ['hero', 'about', 'projects', 'experience', 'skills', 'certifications', 'education', 'contact']
    const observers = sectionIds.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.4 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o && o.disconnect())
  }, [preloaderDone])

  return (
    <main>
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

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
    </main>
  )
}

export default App