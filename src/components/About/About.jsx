import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const words = [
  { text: 'I', highlight: false },
  { text: 'WRITE', highlight: false },
  { text: 'CODE', highlight: true },
  { text: 'THAT', highlight: false },
  { text: 'THINKS', highlight: true },
  { text: 'LIKE', highlight: false },
  { text: 'A', highlight: false },
  { text: 'DESIGNER.', highlight: true },
  { text: 'I', highlight: false },
  { text: 'DESIGN', highlight: false },
  { text: 'SYSTEMS', highlight: true },
  { text: 'THAT', highlight: false },
  { text: 'THINK', highlight: true },
  { text: 'LIKE', highlight: false },
  { text: 'AN', highlight: false },
  { text: 'ENGINEER.', highlight: true },
]

const About = () => {
  const sectionRef = useRef(null)
  const wordsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      wordsRef.current.forEach((word, i) => {
        if (!word) return
        gsap.fromTo(word,
          { opacity: 0.12, color: 'rgba(255,255,255,0.12)' },
          {
            opacity: 1,
            color: word.dataset.highlight === 'true'
              ? '#e8c8ff'
              : 'rgba(255,255,255,0.95)',
            duration: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: word,
              start: 'top 72%',
              end: 'top 40%',
              scrub: 1,
            }
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        background: '#0d0a14',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10vh 8vw',
      }}
    >
      {/* Small label */}
      <p style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 11,
        letterSpacing: '0.35em',
        textTransform: 'uppercase',
        color: 'rgba(232,200,255,0.8)',
        marginBottom: '4rem',
        alignSelf: 'flex-start',
      }}>
        ✦ About me
      </p>

      {/* Big text */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.4em 0.5em',
        maxWidth: 1100,
        alignSelf: 'flex-start',
      }}>
        {words.map((w, i) => (
          <span
            key={i}
            ref={el => wordsRef.current[i] = el}
            data-highlight={w.highlight}
            style={{
              fontFamily: 'Clash Display, sans-serif',
              fontSize: 'clamp(36px, 5.5vw, 80px)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'rgba(255,255,255,0.12)',
              transition: 'color 0.3s',
              cursor: 'default',
            }}
          >
            {w.text}
          </span>
        ))}
      </div>

      {/* Sub info — muncul di bawah */}
      <div style={{
        marginTop: '6rem',
        alignSelf: 'flex-end',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.5rem',
        opacity: 0,
        animation: 'fadeInUp 1s ease forwards',
        animationDelay: '0.5s',
      }}>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(16px, 2vw, 24px)',
          fontStyle: 'italic',
          color: 'rgba(249,184,212,0.7)',
          letterSpacing: '0.05em',
        }}>
          "I care about the gap between how something looks and how it feels to use — and I close it with code."
        </p>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 12,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)',
        }}>
          - Mayla, 2025
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}

export default About