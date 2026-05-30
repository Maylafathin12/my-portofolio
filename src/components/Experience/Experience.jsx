import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../../context/LanguageContext'

// Responsive SIZE based on viewport
const getSize = () => {
  if (typeof window === 'undefined') return 260
  if (window.innerWidth < 480) return 180
  if (window.innerWidth < 768) return 220
  return 260
}

const Experience = () => {
  const { t, language } = useLanguage()
  const expData = t('experience')
  const experiences = expData.list
  const N = experiences.length

  const wrapperRef = useRef(null)
  const bgCanvasRef = useRef(null)
  const ringRefs = useRef([])
  const orbitRefs = useRef([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [SIZE, setSIZE] = useState(getSize)
  const activeIdxRef = useRef(0)
  const isVisibleRef = useRef(false)

  // Update SIZE on resize
  useEffect(() => {
    const onResize = () => setSIZE(getSize())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── Starfield ──────────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting
    }, { threshold: 0 })
    if (wrapperRef.current) observer.observe(wrapperRef.current)

    const canvas = bgCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const stars = Array.from({ length: 280 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.1,
      alpha: Math.random() * 0.6 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.012 + 0.006,
    }))
    const shooters = []
    let raf
    const draw = () => {
      raf = requestAnimationFrame(draw)
      if (!isVisibleRef.current) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (Math.random() < 0.004) shooters.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.5, vx: 6 + Math.random() * 8, vy: 2 + Math.random() * 4, life: 1 })
      stars.forEach(s => {
        s.twinkle += s.speed
        const a = s.alpha * (0.5 + 0.5 * Math.sin(s.twinkle))
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232,200,255,${a})`; ctx.fill()
      })
      shooters.forEach((sh, idx) => {
        sh.x += sh.vx; sh.y += sh.vy; sh.life -= 0.025
        if (sh.life <= 0) { shooters.splice(idx, 1); return }
        const g = ctx.createLinearGradient(sh.x - sh.vx * 6, sh.y - sh.vy * 6, sh.x, sh.y)
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, `rgba(255,255,255,${sh.life * 0.8})`)
        ctx.beginPath(); ctx.moveTo(sh.x - sh.vx * 6, sh.y - sh.vy * 6); ctx.lineTo(sh.x, sh.y)
        ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke()
      })
    }
    draw()
    return () => { 
      cancelAnimationFrame(raf); 
      window.removeEventListener('resize', resize) 
      observer.disconnect()
    }
  }, [])

  // ── Ring + orbit spin ──────────────────────────────────────
  useEffect(() => {
    ringRefs.current.forEach(r => { if (!r) return; gsap.to(r, { rotation: 360, duration: 18, ease: 'none', repeat: -1, transformOrigin: '50% 50%' }) })
    orbitRefs.current.forEach((o, i) => { if (!o) return; gsap.to(o, { rotation: 360, duration: 12 + i * 3, ease: 'none', repeat: -1, transformOrigin: '50% 50%' }) })
  }, [])

  // ── STICKY SCROLL DRIVER ──────────────────────────────────
  const animatePlanets = (prev, curr) => {
    const direction = curr > prev ? 1 : -1
    experiences.forEach((_, i) => {
      const el = document.getElementById('xp-planet-' + i)
      const info = document.getElementById('xp-info-' + i)
      if (!el || !info) return

      // Kill any running tweens to prevent overlapping animations
      gsap.killTweensOf([el, info])

      if (i === curr) {
        gsap.fromTo(el,
          { x: direction * window.innerWidth * 0.7, scale: 0.25, opacity: 0, rotationY: direction * 40 },
          { x: 0, scale: 1, opacity: 1, rotationY: 0, duration: 0.9, ease: 'expo.out' }
        )
        gsap.fromTo(info,
          { y: 22, opacity: 0, filter: 'blur(8px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.65, ease: 'power2.out', delay: 0.35 }
        )
      } else if (i === prev) {
        gsap.to(el, { x: -direction * window.innerWidth * 0.7, scale: 0.25, opacity: 0, rotationY: -direction * 40, duration: 0.6, ease: 'expo.in' })
        gsap.to(info, { y: -14, opacity: 0, filter: 'blur(6px)', duration: 0.32, ease: 'power2.in' })
      } else {
        gsap.set(el, { x: i < curr ? -window.innerWidth : window.innerWidth, scale: 0.25, opacity: 0 })
        gsap.set(info, { opacity: 0 })
      }
    })
  }

  useEffect(() => {
    const onScroll = () => {
      const wrapper = wrapperRef.current
      if (!wrapper) return
      const wTop = wrapper.getBoundingClientRect().top
      const scrolledInside = -wTop
      const next = Math.min(N - 1, Math.max(0, Math.round(scrolledInside / window.innerHeight)))
      if (next === activeIdxRef.current) return
      const prev = activeIdxRef.current
      activeIdxRef.current = next
      setActiveIdx(next)
      animatePlanets(prev, next)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [N])

  // Initialize GSAP styles on mount
  useLayoutEffect(() => {
    experiences.forEach((_, i) => {
      const el = document.getElementById('xp-planet-' + i)
      const info = document.getElementById('xp-info-' + i)
      if (!el || !info) return

      if (i === activeIdxRef.current) {
        gsap.set(el, { x: 0, scale: 1, opacity: 1, rotationY: 0 })
        gsap.set(info, { y: 0, opacity: 1, filter: 'blur(0px)' })
      } else {
        gsap.set(el, { x: window.innerWidth, scale: 0.25, opacity: 0, rotationY: 0 })
        gsap.set(info, { opacity: 0 })
      }
    })
  }, [experiences.length])

  const scrollToSlide = (i) => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const wTop = wrapper.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: wTop + i * window.innerHeight, behavior: 'smooth' })
  }

  const current = experiences[activeIdx]

  return (
    <div ref={wrapperRef} style={{ height: `${N * 100}vh`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', background: '#030206', overflow: 'hidden' }}>

        <canvas ref={bgCanvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

        {/* Nebula */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 80% 65% at 50% 42%, ${current.color}60 0%, transparent 65%)`, transition: 'background 1.1s ease' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 50% 40% at 50% 85%, ${current.glow}08 0%, transparent 70%)`, transition: 'background 1.1s ease' }} />

        {/* Header */}
        <div className="xp-header">
          <p className="xp-eyebrow">{expData.eyebrow}</p>
          <p className="xp-subtitle">{expData.subtitle}</p>
        </div>

        {/* Counter */}
        <div className="xp-counter">
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(24px, 4vw, 52px)', fontStyle: 'italic', color: 'rgba(255,255,255,0.06)', margin: 0, lineHeight: 1 }}>
            {String(activeIdx + 1).padStart(2, '0')}
            <span style={{ fontSize: '0.45em', opacity: 0.5 }}> / {String(N).padStart(2, '0')}</span>
          </p>
        </div>

        {/* Center Stage */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          {experiences.map((exp, i) => {
            const r = SIZE / 2
            const svgSize = SIZE + 80
            const cx = svgSize / 2
            const cy = svgSize / 2
            const textR = r + 30
            return (
              <div key={exp.id} style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Planet */}
                <div
                  id={'xp-planet-' + i}
                  style={{ position: 'relative', width: svgSize, height: svgSize, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0 }}
                >
                  <div style={{ position: 'absolute', width: SIZE * 1.5, height: SIZE * 1.5, borderRadius: '50%', border: `1px solid ${exp.glow}18`, animation: 'ripple1 3.5s ease-out infinite', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', width: SIZE * 1.8, height: SIZE * 1.8, borderRadius: '50%', border: `1px solid ${exp.glow}0c`, animation: 'ripple1 3.5s ease-out infinite 0.8s', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', width: SIZE * 1.3, height: SIZE * 1.3, borderRadius: '50%', background: `radial-gradient(circle, ${exp.glow}18 0%, transparent 70%)`, animation: 'pulseGlow 3.5s ease-in-out infinite', pointerEvents: 'none' }} />
                  <div ref={el => orbitRefs.current[exp.id] = el} style={{ position: 'absolute', width: SIZE * 1.25, height: SIZE * 1.25, borderRadius: '50%', pointerEvents: 'none' }}>
                    {Array.from({ length: 6 }).map((_, pi) => {
                      const px = 50 + Math.cos((pi / 6) * Math.PI * 2) * 50
                      const py = 50 + Math.sin((pi / 6) * Math.PI * 2) * 50
                      return <div key={pi} style={{ position: 'absolute', left: `${px}%`, top: `${py}%`, width: pi % 2 === 0 ? 4 : 2.5, height: pi % 2 === 0 ? 4 : 2.5, borderRadius: '50%', background: exp.glow, opacity: pi % 2 === 0 ? 0.55 : 0.3, transform: 'translate(-50%, -50%)' }} />
                    })}
                  </div>
                  <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                    <defs>
                      <radialGradient id={`g-${exp.id}`} cx="36%" cy="30%" r="70%">
                        <stop offset="0%" stopColor={exp.glow} stopOpacity="0.7" />
                        <stop offset="40%" stopColor={exp.color} stopOpacity="1" />
                        <stop offset="100%" stopColor="#000" stopOpacity="1" />
                      </radialGradient>
                      <radialGradient id={`atmo-${exp.id}`} cx="50%" cy="50%" r="50%">
                        <stop offset="80%" stopColor="transparent" />
                        <stop offset="100%" stopColor={exp.glow} stopOpacity="0.15" />
                      </radialGradient>
                      <filter id={`f-${exp.id}`}><feGaussianBlur stdDeviation="16" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                      <filter id={`sharp-${exp.id}`}><feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={exp.glow} floodOpacity="0.3" /></filter>
                      <path id={`tp-${exp.id}`} d={`M ${cx},${cy} m -${textR},0 a ${textR},${textR} 0 1,1 ${textR * 2},0 a ${textR},${textR} 0 1,1 -${textR * 2},0`} fill="none" />
                    </defs>
                    <circle cx={cx} cy={cy} r={r} fill={exp.glow} opacity="0.08" filter={`url(#f-${exp.id})`} />
                    <circle cx={cx} cy={cy} r={r} fill={`url(#g-${exp.id})`} filter={`url(#sharp-${exp.id})`} />
                    <circle cx={cx} cy={cy} r={r} fill={`url(#atmo-${exp.id})`} />
                    <ellipse cx={cx - r * 0.2} cy={cy - r * 0.28} rx={r * 0.28} ry={r * 0.18} fill="white" opacity="0.09" />
                    <ellipse cx={cx - r * 0.1} cy={cy - r * 0.15} rx={r * 0.1} ry={r * 0.06} fill="white" opacity="0.12" />
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke={exp.glow} strokeWidth="1.2" strokeOpacity="0.18" />
                    <text style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, letterSpacing: '0.22em' }} fill={exp.glow} fillOpacity="0.35">
                      <textPath href={`#tp-${exp.id}`} startOffset="3%">{`· ${exp.company}  ·  ${exp.year}  ·  `}</textPath>
                    </text>
                  </svg>
                  {exp.ring && (
                    <>
                      <div ref={el => ringRefs.current[exp.id] = el} style={{ position: 'absolute', width: SIZE * 1.7, height: SIZE * 0.25, border: `2.5px solid ${exp.glow}22`, borderRadius: '50%', pointerEvents: 'none', transform: 'rotateX(74deg)', boxShadow: `0 0 24px ${exp.glow}10` }} />
                      <div style={{ position: 'absolute', width: SIZE * 1.45, height: SIZE * 0.18, border: `1px solid ${exp.glow}12`, borderRadius: '50%', pointerEvents: 'none', transform: 'rotateX(74deg)' }} />
                    </>
                  )}
                  <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', pointerEvents: 'none', padding: '0 1rem' }}>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(12px, 1.6vw, 18px)', fontStyle: 'italic', color: exp.glow, opacity: 0.6, margin: '0 0 6px', letterSpacing: '0.1em' }}>{exp.year}</p>
                    <p style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(11px, 1.4vw, 17px)', fontWeight: 700, color: '#fff', opacity: 1, margin: 0, letterSpacing: '0.03em', lineHeight: 1.3, maxWidth: SIZE * 0.52, textAlign: 'center' }}>{exp.title}</p>
                  </div>
                </div>

                {/* Info */}
                <div id={'xp-info-' + i} style={{ textAlign: 'center', maxWidth: 'min(440px, 88vw)', opacity: 0, marginTop: `calc(-${SIZE * 0.08}px + 1.2rem)`, padding: '0 1.5rem' }}>
                  <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${exp.glow}40, transparent)`, margin: '0 auto 0.85rem' }} />
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: exp.glow, opacity: 0.8, margin: '0 0 0.75rem' }}>{exp.period}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {exp.bullets.map((b, bi) => (
                      <p key={bi} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(11px, 1vw, 13.5px)', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.7 }}>{b}</p>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Side progress (left) */}
        <div className="xp-side-progress">
          {experiences.map((_, i) => (
            <div key={i} onClick={() => scrollToSlide(i)} style={{ width: i === activeIdx ? 2 : 1, height: i === activeIdx ? 28 : 12, borderRadius: 999, background: i === activeIdx ? current.glow : 'rgba(255,255,255,0.12)', transition: 'all 0.4s ease', boxShadow: i === activeIdx ? `0 0 8px ${current.glow}60` : 'none', cursor: 'pointer' }} />
          ))}
        </div>

        {/* Dot nav (bottom) */}
        <div className="xp-dot-nav">
          {experiences.map((_, i) => (
            <div key={i} onClick={() => scrollToSlide(i)} style={{ width: i === activeIdx ? 24 : 5, height: 5, borderRadius: 999, background: i === activeIdx ? current.glow : 'rgba(255,255,255,0.13)', transition: 'all 0.4s cubic-bezier(.4,0,.2,1)', boxShadow: i === activeIdx ? `0 0 10px ${current.glow}50` : 'none', cursor: 'pointer' }} />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="xp-scroll-hint">
          <span style={{ fontFamily: 'DM Sans', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#fff' }}>{activeIdx < N - 1 ? expData.scroll : expData.continue}</span>
          <div style={{ width: 24, height: 1, background: 'rgba(232,200,255,0.5)' }} />
        </div>

        {/* Company label (right) — hidden on small screens */}
        <div className="xp-company-label">
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: current.glow, opacity: 0.5, margin: 0, transition: 'color 0.8s ease' }}>{current.company}</p>
        </div>

        <style>{`
          @keyframes pulseGlow { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
          @keyframes ripple1 { 0%{transform:scale(.85);opacity:.5} 100%{transform:scale(1.15);opacity:0} }

          .xp-header {
            position: absolute;
            top: clamp(3vh, 5vh, 7vh);
            left: clamp(4vw, 6vw, 8vw);
            right: clamp(4vw, 6vw, 8vw);
            z-index: 10;
            max-width: 560px;
          }
          .xp-eyebrow {
            font-family: 'DM Sans', sans-serif;
            font-size: clamp(8px, 0.9vw, 9px);
            letter-spacing: 0.4em;
            text-transform: uppercase;
            color: rgba(232,200,255,0.8);
            margin: 0 0 0.3rem;
          }
          .xp-subtitle {
            font-family: 'Cormorant Garamond', serif;
            font-size: clamp(11px, 1.4vw, 17px);
            font-style: italic;
            color: rgba(255,255,255,0.7);
            margin: 0;
          }

          .xp-counter {
            position: absolute;
            top: clamp(3vh, 5vh, 7vh);
            right: clamp(4vw, 6vw, 8vw);
            z-index: 10;
            text-align: right;
          }

          .xp-side-progress {
            position: absolute;
            left: clamp(1.5vw, 3.5vw, 5vw);
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 0.55rem;
            z-index: 10;
          }

          .xp-dot-nav {
            position: absolute;
            bottom: clamp(3vh, 4.5vh, 6vh);
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 0.6rem;
            z-index: 10;
            align-items: center;
          }

          .xp-scroll-hint {
            position: absolute;
            bottom: clamp(3vh, 4.5vh, 6vh);
            right: clamp(4vw, 6vw, 8vw);
            z-index: 10;
            display: flex;
            align-items: center;
            gap: 8px;
            opacity: 0.18;
          }

          .xp-company-label {
            position: absolute;
            right: clamp(4vw, 5.5vw, 7vw);
            top: 50%;
            transform: translateY(-50%) rotate(90deg);
            z-index: 10;
            transform-origin: center center;
            white-space: nowrap;
          }

          @media (max-width: 480px) {
            .xp-company-label { display: none; }
            .xp-scroll-hint { display: none; }
            .xp-side-progress { left: 1vw; }
          }

          @media (max-width: 767px) {
            .xp-subtitle { display: none; }
          }
        `}</style>
      </div>
    </div>
  )
}

export default Experience