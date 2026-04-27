import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import maylaPhoto from '../../assets/may.png'
import { useIsMobile } from '../../hooks/useIsMobile'

const Hero = () => {
  const sectionRef = useRef(null)
  const figureRef = useRef(null)
  const canvasRef = useRef(null)
  const nameRef = useRef(null)
  const roleRef = useRef(null)
  const leftInfoRef = useRef(null)
  const rightInfoRef = useRef(null)
  const badgeRef = useRef(null)
  const gridRef = useRef(null)
  const rafRef = useRef(null)
  const isMobile = useIsMobile(768)

  useEffect(() => {
    // ── Particle canvas ──────────────────────────────
    const canvas = canvasRef.current
    if (isMobile) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.35 + 0.05,
      speed: Math.random() * 0.2 + 0.05,
      drift: (Math.random() - 0.5) * 0.1,
    }))

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232,200,255,${p.alpha})`
        ctx.fill()
        p.y -= p.speed
        p.x += p.drift
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width }
      })
      rafRef.current = requestAnimationFrame(drawParticles)
    }
    drawParticles()

    // ── Entrance animations ──────────────────────────
    const tl = gsap.timeline({ delay: 0.3 })

    tl.fromTo(gridRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: 'power2.out' }
    )
    tl.fromTo(figureRef.current,
      { opacity: 0, y: 40, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power3.out' },
      '-=1.5'
    )
    tl.fromTo(badgeRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.8'
    )
    tl.fromTo(nameRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      '-=0.6'
    )
    tl.fromTo(roleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    )
    tl.fromTo(leftInfoRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    )
    tl.fromTo(rightInfoRef.current,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.8'
    )

    // ── Mouse parallax on figure ─────────────────────
    const onMouse = (e) => {
      if (isMobile) return
      const dx = (e.clientX / window.innerWidth - 0.5) * 18
      const dy = (e.clientY / window.innerHeight - 0.5) * 10
      gsap.to(figureRef.current, { x: dx, y: dy, duration: 1.4, ease: 'power2.out' })
    }
    if (!isMobile) window.addEventListener('mousemove', onMouse)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#0a0814',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      {/* Particles */}
      {!isMobile && <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />}

      {/* Subtle grid lines — like Vibrant Wellness */}
      <div ref={gridRef} style={{
        position: 'absolute', inset: 0, zIndex: 1, opacity: 0, pointerEvents: 'none',
      }}>
        {/* Vertical center line */}
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, rgba(232,200,255,0.06) 20%, rgba(232,200,255,0.06) 80%, transparent)' }} />
        {/* Horizontal mid line */}
        <div style={{ position: 'absolute', top: '52%', left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(232,200,255,0.06) 20%, rgba(232,200,255,0.06) 80%, transparent)' }} />
        {/* Bottom line */}
        <div style={{ position: 'absolute', bottom: '14%', left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(232,200,255,0.08) 20%, rgba(232,200,255,0.08) 80%, transparent)' }} />
      </div>

      {/* Ambient glow behind figure */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '50vw', height: '70vh',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(155,114,207,0.2) 0%, rgba(200,150,255,0.08) 40%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* ── LEFT INFO ─────────────────────────────── */}
      <div ref={leftInfoRef} style={{
        position: 'absolute',
        left: '6vw', top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 8, opacity: 0,
        display: 'flex', flexDirection: 'column', gap: '2rem',
      }}>
        {/* Stat 1 */}
        <div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(232,200,255,0.8)', margin: '0 0 4px' }}> Project Experience</p>
          <p style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: '#fff', margin: '0 0 2px', lineHeight: 1, letterSpacing: '-0.02em' }}>3+</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: 0 }}>years building</p>
        </div>
        {/* Divider */}
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(232,200,255,0.5), transparent)', marginLeft: 2 }} />
        {/* Stat 2 */}
        <div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(232,200,255,0.8)', margin: '0 0 4px' }}>Awards</p>
          <p style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: '#fff', margin: '0 0 2px', lineHeight: 1, letterSpacing: '-0.02em' }}>6✦</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>national wins</p>
        </div>
        {/* Divider */}
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(232,200,255,0.5), transparent)', marginLeft: 2 }} />
        {/* Stat  stat 3 */}
        <div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(232,200,255,0.8)', margin: '0 0 4px' }}>Based in</p>
          <p style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(14px, 1.8vw, 20px)', fontWeight: 700, color: '#fff', margin: '0 0 2px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>Yogyakarta</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.)', margin: 0 }}>Indonesia 🇮🇩</p>
        </div>
      </div>

      {/* ── RIGHT INFO ────────────────────────────── */}
      <div ref={rightInfoRef} style={{
        position: 'absolute',
        right: '6vw', top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 8, opacity: 0,
        display: 'flex', flexDirection: 'column', gap: '1.2rem',
        alignItems: 'flex-end',
      }}>
        {[
          { label: 'Stack', value: 'React · Next.js · Vue' },
          { label: 'Creative', value: 'Three.js · GSAP · Framer-Motion' },
          { label: 'Mobile', value: 'Flutter · Kotlin' },
          { label: 'Design', value: 'Figma · UI/UX' },
          { label: 'Open to', value: 'Full-time & Freelance' },
        ].map((item, i) => (
          <div key={i} style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(232,200,255,0.5)', margin: '0 0 2px' }}>{item.label}</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 500, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* ── FIGURE ────────────────────────────────── */}
      <div
        ref={figureRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
          width: 'clamp(280px, 38vw, 560px)',
          opacity: 0,
        }}
      >
        <img
          src={maylaPhoto}
          alt="Mayla"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            objectPosition: 'top center',
            display: 'block',
            // Remove bg effect — fade bottom to transparent
            maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
            filter: 'drop-shadow(0 0 40px rgba(155,114,207,0.5))',
          }}
        />
      </div>

      {/* ── NAME + ROLE bottom ─────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: '13%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.4rem',
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        {/* Available badge */}
        <div ref={badgeRef} style={{
          opacity: 0,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(184,245,176,0.05)',
          border: '1px solid rgba(184,245,176,0.2)',
          borderRadius: 999, padding: '4px 14px', marginBottom: '0.5rem',
          fontFamily: 'DM Sans, sans-serif', fontSize: 10, letterSpacing: '0.15em',
          color: 'rgba(184,245,176,0.7)',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#b8f5b0', display: 'inline-block', boxShadow: '0 0 6px #b8f5b0' }} />
          Available for full-time opportunities
        </div>

        {/* Name */}
        <h1 ref={nameRef} style={{
          opacity: 0,
          fontFamily: 'Clash Display, sans-serif',
          fontSize: 'clamp(36px, 5.5vw, 76px)',
          fontWeight: 700, lineHeight: 0.9,
          letterSpacing: '-0.03em', margin: 0,
        }}>
          <span style={{ color: '#fff', display: 'block' }}>MAYLA FATHIN </span>
          <span style={{
            display: 'block',
            background: 'linear-gradient(135deg, #e8c8ff 0%, #f9b8d4 55%, #c8b4ff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>NADHIFA ULYA</span>
        </h1>

        {/* Role */}
        <div ref={roleRef} style={{
          opacity: 0, marginTop: '0.5rem',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 'clamp(10px, 1.1vw, 13px)',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.8)',
        }}>
          <span>Design Engineer</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(232,200,255,0.5)', display: 'inline-block' }} />
          <span>Front-End Developer</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(232,200,255,0.5)', display: 'inline-block' }} />
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        zIndex: 9, opacity: 0, animation: 'fadeInUp 1s 3.5s forwards',
      }}>
        <span style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.15)', fontFamily: 'DM Sans' }}>scroll</span>
        <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(232,200,255,0.5), transparent)', animation: 'scrollPulse 2s ease-in-out infinite' }} />
      </div>

      {/* CV Download button */}

      <a href="/cv-mayla.pdf"
        download
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          right: '6vw',
          zIndex: 9,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 10,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(232,200,255,0.8)',
          textDecoration: 'none',
          border: '1px solid rgba(232,200,255,0.3)',
          borderRadius: 999,
          padding: '8px 18px',
          background: 'rgba(232,200,255,0.05)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.3s ease',
          animation: 'fadeInUp 1s 3.5s forwards',
          opacity: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#e8c8ff'
          e.currentTarget.style.borderColor = 'rgba(232,200,255,0.35)'
          e.currentTarget.style.background = 'rgba(232,200,255,0.08)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'rgba(232,200,255,0.5)'
          e.currentTarget.style.borderColor = 'rgba(232,200,255,0.12)'
          e.currentTarget.style.background = 'rgba(232,200,255,0.04)'
        }}
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M6 1v7M3 5l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Download CV
      </a>

      <style>{`
        @keyframes scrollPulse { 0%,100%{opacity:0.3;} 50%{opacity:1;} }
        @keyframes fadeInUp { from{opacity:0;transform:translateX(-50%) translateY(10px);} to{opacity:1;transform:translateX(-50%) translateY(0);} }
      `}</style>
    </section>
  )
}

export default Hero