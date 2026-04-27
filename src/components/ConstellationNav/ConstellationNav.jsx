import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const sections = [
  { id: 'hero', label: 'Home', y: 0 },
  { id: 'about', label: 'About', y: 1 },
  { id: 'projects', label: 'Projects', y: 2 },
  { id: 'experience', label: 'Experience', y: 3 },
  { id: 'skills', label: 'Skills', y: 4 },
  { id: 'education', label: 'Education', y: 5 },
  { id: 'contact', label: 'Contact', y: 6 },
]

const ConstellationNav = ({ activeSection }) => {
  const [hovered, setHovered] = useState(null)
  const dotRefs = useRef([])
  const labelRefs = useRef([])
  const lineRef = useRef(null)

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleHover = (i, enter) => {
    const label = labelRefs.current[i]
    const dot = dotRefs.current[i]
    if (!label || !dot) return
    if (enter) {
      setHovered(i)
      gsap.to(label, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' })
      gsap.to(dot, { scale: 1.8, duration: 0.3, ease: 'back.out(2)' })
    } else {
      setHovered(null)
      gsap.to(label, { opacity: 0, x: -8, duration: 0.2 })
      gsap.to(dot, { scale: 1, duration: 0.3, ease: 'power2.out' })
    }
  }

  return (
    <div style={{
      position: 'fixed',
      left: '2.5vw',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0,
    }}>
      {sections.map((sec, i) => {
        const isActive = activeSection === sec.id
        const starSize = isActive ? 8 : 5

        return (
          <div
            key={sec.id}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
          >
            {/* Connecting line above (not for first) */}
            {i > 0 && (
              <div style={{
                width: 1,
                height: 20,
                background: isActive
                  ? 'linear-gradient(to bottom, rgba(232,200,255,0.15), rgba(232,200,255,0.3))'
                  : 'rgba(255,255,255,0.06)',
                transition: 'background 0.4s',
              }} />
            )}

            {/* Star dot */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div
                ref={el => dotRefs.current[i] = el}
                onClick={() => scrollToSection(sec.id)}
                onMouseEnter={() => handleHover(i, true)}
                onMouseLeave={() => handleHover(i, false)}
                style={{
                  width: starSize,
                  height: starSize,
                  borderRadius: '50%',
                  background: isActive ? '#e8c8ff' : 'rgba(255,255,255,0.25)',
                  boxShadow: isActive ? '0 0 10px #e8c8ff, 0 0 20px rgba(232,200,255,0.4)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  transformOrigin: 'center',
                  zIndex: 2,
                }}
              />

              {/* Label */}
              <div
                ref={el => labelRefs.current[i] = el}
                style={{
                  position: 'absolute',
                  left: 16,
                  opacity: 0,
                  transform: 'translateX(-8px)',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}
              >
                <span style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 11,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: isActive ? '#e8c8ff' : 'rgba(255,255,255,0.5)',
                  background: 'rgba(13,10,20,0.8)',
                  padding: '3px 8px',
                  borderRadius: 6,
                  border: '1px solid rgba(232,200,255,0.1)',
                }}>
                  {sec.label}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ConstellationNav