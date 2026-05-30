import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useLanguage } from '../../context/LanguageContext'

// ── Split-flap character set ──────────────────────────────────────────────────
const CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@./-+'

function useSplitFlap(target, delay = 0) {
  const [display, setDisplay] = useState(() => ' '.repeat(target.length))
  const rafRef = useRef(null)
  const startRef = useRef(null)
  const DURATION = 1200

  const start = useCallback(() => {
    startRef.current = performance.now() + delay
    const animate = (now) => {
      if (now < startRef.current) { rafRef.current = requestAnimationFrame(animate); return }
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / DURATION, 1)
      const revealed = Math.floor(progress * target.length)
      let result = ''
      for (let i = 0; i < target.length; i++) {
        if (i < revealed) {
          result += target[i]
        } else if (i === revealed) {
          result += CHARS[Math.floor(Math.random() * CHARS.length)]
        } else {
          result += ' '
        }
      }
      setDisplay(result)
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
      else setDisplay(target)
    }
    rafRef.current = requestAnimationFrame(animate)
  }, [target, delay])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])
  return [display, start]
}

// ── Single contact row with split-flap ───────────────────────────────────────
function ContactRow({ data, index, onReveal }) {
  const [flapped, startFlap] = useSplitFlap(data.label, index * 180)
  const [hovered, setHovered] = useState(false)
  const rowRef = useRef(null)
  const panelRef = useRef(null)
  const isMobile = useIsMobile(768)

  useEffect(() => {
    if (onReveal) onReveal(index, startFlap)
  }, [])

  const handleEnter = () => {
    setHovered(true)
    if (panelRef.current) {
      gsap.fromTo(panelRef.current,
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, duration: 0.45, ease: 'expo.out' }
      )
    }
  }

  const handleLeave = () => {
    setHovered(false)
    if (panelRef.current) {
      gsap.to(panelRef.current, { scaleY: 0, transformOrigin: 'top center', duration: 0.3, ease: 'power2.in' })
    }
  }

  return (
    <a
      ref={rowRef}
      href={data.href}
      target={data.href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="signal-row"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ '--row-color': data.color, '--row-accent': data.accent }}
    >
      {/* Row number */}
      <span className="row-num">0{index + 1}</span>

      {/* Channel badge */}
      <span className="row-channel">{data.channel}</span>

      {/* Flap display */}
      <span className="row-flap" aria-label={data.label}>
        {flapped.split('').map((ch, i) => (
          <span key={i} className="flap-char" style={{ animationDelay: `${i * 0.03}s` }}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </span>

      {/* Status dot */}
      <span className="row-dot" />

      {/* Hover panel - drops down like a flap opening */}
      <div ref={panelRef} className="row-panel" style={{ transform: 'scaleY(0)' }}>
        <span className="panel-cta">{data.cta}</span>
        <span className="panel-note">{data.note}</span>
      </div>
    </a>
  )
}

// ── Ink canvas ────────────────────────────────────────────────────────────────
function InkCanvas() {
  const canvasRef = useRef(null)
  const ctx = useRef(null)
  const splats = useRef([])
  const rafRef = useRef(null)
  const lastPos = useRef({ x: -999, y: -999 })

  useEffect(() => {
    const canvas = canvasRef.current
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    ctx.current = canvas.getContext('2d')

    const colors = ['rgba(232,200,255,', 'rgba(249,184,212,', 'rgba(191,219,254,', 'rgba(187,247,208,']

    const onMove = (e) => {
      const mx = e.clientX, my = e.clientY
      const dx = mx - lastPos.current.x, dy = my - lastPos.current.y
      const speed = Math.sqrt(dx * dx + dy * dy)
      if (speed > 8) {
        const col = colors[Math.floor(Math.random() * colors.length)]
        for (let k = 0; k < Math.min(3, Math.floor(speed / 12)); k++) {
          splats.current.push({
            x: mx + (Math.random() - 0.5) * 20,
            y: my + (Math.random() - 0.5) * 20,
            r: Math.random() * 18 + 6,
            alpha: Math.random() * 0.12 + 0.04,
            color: col,
            life: 1,
            decay: 0.012 + Math.random() * 0.008,
          })
        }
        lastPos.current = { x: mx, y: my }
      }
    }
    window.addEventListener('mousemove', onMove)

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      const c = ctx.current
      c.clearRect(0, 0, canvas.width, canvas.height)
      splats.current = splats.current.filter(s => s.life > 0)
      splats.current.forEach(s => {
        s.life -= s.decay
        const a = s.alpha * s.life
        const grad = c.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r)
        grad.addColorStop(0, s.color + a + ')')
        grad.addColorStop(0.5, s.color + (a * 0.4) + ')')
        grad.addColorStop(1, s.color + '0)')
        c.beginPath()
        c.arc(s.x, s.y, s.r * (2 - s.life), 0, Math.PI * 2)
        c.fillStyle = grad
        c.fill()
      })
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, mixBlendMode: 'screen' }}
    />
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
const Contact = () => {
  const { t } = useLanguage()
  const contactData = t('contact')
  const contacts = contactData.contacts

  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const rowRevealFns = useRef({})
  const [hasRevealed, setHasRevealed] = useState(false)
  const isMobile = useIsMobile(768)

  const registerReveal = useCallback((idx, fn) => {
    rowRevealFns.current[idx] = fn
  }, [])

  // Breathing title
  useEffect(() => {
    if (!titleRef.current) return
    gsap.to(titleRef.current, {
      y: -8,
      duration: 3.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
  }, [])

  // Intersection observer — triggers flap animations
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasRevealed) {
        setHasRevealed(true)
        // Stagger the row entrance then trigger flaps
        Object.entries(rowRevealFns.current).forEach(([idx, fn]) => {
          setTimeout(() => fn(), 400 + Number(idx) * 150)
        })
      }
    }, { threshold: 0.2 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [hasRevealed])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

        /* ── Section shell ── */
        .contact-section {
          background: #05030c;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(8vh, 12vh, 15vh) clamp(5vw, 8vw, 10vw);
          position: relative;
          overflow: hidden;
        }

        /* ── Ambient glows ── */
        .contact-glow-1 {
          position: absolute; pointer-events: none; z-index: 0;
          width: 60vw; height: 60vw;
          top: -20%; left: -15%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(120,40,180,0.07) 0%, transparent 70%);
          animation: ambientDrift 14s ease-in-out infinite alternate;
        }
        .contact-glow-2 {
          position: absolute; pointer-events: none; z-index: 0;
          width: 50vw; height: 50vw;
          bottom: -10%; right: -10%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(249,100,160,0.06) 0%, transparent 70%);
          animation: ambientDrift 18s ease-in-out infinite alternate-reverse;
        }
        @keyframes ambientDrift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(3vw, 2vh) scale(1.08); }
        }

        /* ── Scanlines overlay ── */
        .scanlines {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
        }

        /* ── Inner container ── */
        .contact-inner {
          position: relative; z-index: 2;
          width: 100%;
          max-width: min(900px, 94vw);
          display: flex;
          flex-direction: column;
          gap: clamp(2.5rem, 5vh, 4rem);
        }

        /* ── Header ── */
        .contact-header {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .contact-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: clamp(9px, 0.9vw, 11px);
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(232,200,255,0.5);
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .contact-eyebrow::before {
          content: '';
          display: block; width: 32px; height: 1px;
          background: rgba(232,200,255,0.2);
        }

        .contact-title-wrap {
          display: block;
          will-change: transform;
        }
        .contact-title {
          font-family: 'Clash Display', 'Arial Black', sans-serif;
          font-size: clamp(40px, 9vw, 130px);
          font-weight: 700;
          line-height: 0.88;
          letter-spacing: -0.04em;
          color: #fff;
          margin: 0;
        }
        .contact-title .grad {
          background: linear-gradient(130deg, #e8c8ff 0%, #f9b8d4 50%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .contact-subtitle {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-size: clamp(14px, 1.6vw, 19px);
          color: rgba(255,255,255,0.55);
          margin: 1rem 0 0;
          max-width: 480px;
          line-height: 1.6;
        }

        /* ── Board container ── */
        .signal-board {
          width: 100%;
          border: 1px solid rgba(232,200,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          background: rgba(255,255,255,0.015);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          position: relative;
        }
        .signal-board::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(232,200,255,0.2), rgba(249,184,212,0.2), transparent);
        }

        /* ── Board header row ── */
        .board-header {
          display: grid;
          grid-template-columns: 40px 110px 1fr 16px;
          gap: 0 1.5rem;
          padding: 0.7rem clamp(1rem, 2rem, 2.5rem);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          align-items: center;
        }
        .board-header span {
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(232,200,255,0.25);
        }

        /* ── Signal row ── */
        .signal-row {
          display: grid;
          grid-template-columns: 40px 110px 1fr 16px;
          gap: 0 1.5rem;
          padding: clamp(1rem, 1.5rem, 2rem) clamp(1rem, 2rem, 2.5rem);
          border-bottom: 1px solid rgba(255,255,255,0.03);
          text-decoration: none;
          position: relative;
          align-items: center;
          cursor: pointer;
          transition: background 0.3s;
          overflow: visible;
        }
        .signal-row:last-child { border-bottom: none; }
        .signal-row:hover {
          background: rgba(255,255,255,0.025);
        }
        .signal-row::before {
          content: '';
          position: absolute; left: 0; top: 15%; bottom: 15%;
          width: 2px; border-radius: 2px;
          background: linear-gradient(180deg, transparent, var(--row-accent), transparent);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .signal-row:hover::before { opacity: 1; }

        /* ── Row cells ── */
        .row-num {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: rgba(232,200,255,0.2);
          letter-spacing: 0.1em;
        }

        .row-channel {
          font-family: 'DM Mono', monospace;
          font-size: clamp(9px, 0.9vw, 11px);
          letter-spacing: 0.25em;
          color: var(--row-color);
          opacity: 0.7;
          text-transform: uppercase;
          transition: opacity 0.3s;
        }
        .signal-row:hover .row-channel { opacity: 1; }

        /* ── Flap display ── */
        .row-flap {
          font-family: 'DM Mono', monospace;
          font-size: clamp(13px, 1.8vw, 22px);
          font-weight: 500;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.75);
          transition: color 0.3s;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .signal-row:hover .row-flap { color: #fff; }

        .flap-char {
          display: inline-block;
          transition: transform 0.12s ease, opacity 0.12s;
        }

        /* ── Status dot ── */
        .row-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--row-accent);
          opacity: 0.4;
          transition: opacity 0.3s, transform 0.3s;
          justify-self: end;
          flex-shrink: 0;
        }
        .signal-row:hover .row-dot {
          opacity: 1;
          transform: scale(1.5);
          box-shadow: 0 0 8px var(--row-accent);
        }

        /* ── Hover reveal panel ── */
        .row-panel {
          position: absolute;
          left: 0; right: 0;
          top: 100%;
          z-index: 10;
          background: rgba(10, 5, 20, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(232,200,255,0.06);
          border-left: 2px solid var(--row-accent);
          padding: 0.85rem clamp(1rem, 2rem, 2.5rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          transform-origin: top center;
        }
        .panel-cta {
          font-family: 'DM Mono', monospace;
          font-size: clamp(10px, 1.2vw, 14px);
          color: var(--row-color);
          letter-spacing: 0.08em;
        }
        .panel-note {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(11px, 1.1vw, 13px);
          color: rgba(255,255,255,0.4);
        }

        /* ── Footer strip ── */
        .contact-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .footer-sig {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
        }
        .footer-blink {
          width: 6px; height: 14px;
          background: rgba(232,200,255,0.4);
          border-radius: 1px;
          animation: blink 1.1s step-end infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* ── Mobile ── */
        @media (max-width: 600px) {
          .board-header { display: none; }
          .signal-row {
            grid-template-columns: 32px 80px 1fr 12px;
            gap: 0 0.8rem;
          }
          .row-flap { font-size: 12px; }
          .row-channel { font-size: 8px; letter-spacing: 0.15em; }
          .panel-note { display: none; }
          .contact-footer { flex-direction: column; gap: 0.8rem; align-items: flex-start; }
        }
      `}</style>

      {/* Ink splat cursor layer */}
      {!isMobile && <InkCanvas />}

      <section ref={sectionRef} className="contact-section">
        <div className="contact-glow-1" />
        <div className="contact-glow-2" />
        <div className="scanlines" />

        <div className="contact-inner">

          {/* ── Header ── */}
          <div className="contact-header">
            <p className="contact-eyebrow">{contactData.eyebrow}</p>
            <div ref={titleRef} className="contact-title-wrap">
              <h2 className="contact-title">
                {contactData.title1}<br />
                <span className="grad">{contactData.title2}</span><br />
                {contactData.title3}
              </h2>
              <p className="contact-subtitle">
                {contactData.subtitle}
              </p>
            </div>
          </div>

          {/* ── Departure board ── */}
          <div className="signal-board">
            <div className="board-header">
              <span>#</span>
              <span>{contactData.channel}</span>
              <span>{contactData.address}</span>
              <span />
            </div>
            {contacts.map((c, i) => (
              <ContactRow
                key={c.id}
                data={c}
                index={i}
                onReveal={registerReveal}
              />
            ))}
          </div>

          {/* ── Footer ── */}
          <div className="contact-footer">
            <span className="footer-sig">
              {contactData.footer}
            </span>
            <div className="footer-blink" />
          </div>

        </div>
      </section>
    </>
  )
}

export default Contact