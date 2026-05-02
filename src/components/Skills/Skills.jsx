import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const skillGroups = [
  { category: 'Core Web', color: '#e8c8ff', skills: ['HTML5', 'CSS3', 'JavaScript ES6+', 'TypeScript'] },
  { category: 'Frameworks', color: '#b8f5e8', skills: ['React.js', 'Next.js', 'Vue.js', 'Tailwind CSS'] },
  { category: 'Creative & Animation', color: '#f9b8d4', skills: ['Three.js', 'GSAP', 'Framer Motion', 'Canvas 2D'] },
  {
    category: 'Engineering Principle',
    color: '#f9e0d9',
    skills: [
      'Scalable Architecture',
      'Performance Optimization',
      'Component-Driven Development',
      'Clean Code'
    ]
  },
  { category: 'Mobile', color: '#b8f5b0', skills: ['Kotlin', 'Dart'] },
  { category: 'Design & Tools', color: '#c8b4ff', skills: ['Figma', 'Framer', 'UI/UX', 'Design Systems', 'Prototyping'] },
  { category: 'Languages', color: '#ffd6a5', skills: ['Indonesian (Native)', 'English (Professional)'] },
]

const softSkills = ['Mentoring', 'Knowledge Sharing', 'Growth Mindset', 'Problem Solving', 'Fast Learner', 'Cross-functional Collaboration', 'Creative Thinking']
const allTags = skillGroups.flatMap(g => g.skills.map(s => ({ label: s, color: g.color })))

const Skills = () => {
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const tagRefs = useRef([])
  const engineRef = useRef(null)
  const rafRef = useRef(null)
  const resizeRef = useRef(null)

  // ── Always init Matter.js (desktop + mobile) ────────────────────────────
  const initMatter = async () => {
    if (engineRef.current) return

    const Matter = await import('matter-js')
    const { Engine, Runner, Bodies, Body, World, Mouse, MouseConstraint, Events } = Matter

    const container = containerRef.current
    if (!container) return

    // Wait for tags to render so we can measure widths
    await new Promise(r => setTimeout(r, 60))

    const W = container.offsetWidth
    const H = container.offsetHeight

    const engine = Engine.create({ gravity: { y: 1.6 } })
    engineRef.current = engine
    const runner = Runner.create()
    Runner.run(runner, engine)

    // Walls: floor + left + right
    const walls = [
      Bodies.rectangle(W / 2, H + 25, W * 3, 50, { isStatic: true }),
      Bodies.rectangle(-25, H / 2, 50, H * 3, { isStatic: true }),
      Bodies.rectangle(W + 25, H / 2, 50, H * 3, { isStatic: true }),
    ]
    World.add(engine.world, walls)

    const TAG_H = 34
    const maxAngle = 0.38

    const bodies = allTags.map((_, i) => {
      const el = tagRefs.current[i]
      const w = el ? el.offsetWidth + 2 : 120
      const x = W * 0.06 + Math.random() * (W * 0.88)
      const y = -60 - i * 22

      const body = Bodies.rectangle(x, y, w, TAG_H, {
        restitution: 0.45,
        friction: 0.12,
        frictionAir: 0.018,
        chamfer: { radius: 17 },
        label: 'tag-' + i,
      })

      Body.setAngle(body, (Math.random() - 0.5) * 0.35)

      Events.on(engine, 'beforeUpdate', () => {
        if (body.angle > maxAngle) {
          Body.setAngle(body, maxAngle)
          Body.setAngularVelocity(body, 0)
        } else if (body.angle < -maxAngle) {
          Body.setAngle(body, -maxAngle)
          Body.setAngularVelocity(body, 0)
        }
      })
      return body
    })

    World.add(engine.world, bodies)

    // ── Mouse / Touch constraint ──────────────────────────────────────────
    const mouse = Mouse.create(container)

    // Prevent touch from scrolling page while dragging tags
    mouse.element.removeEventListener('touchstart', mouse.touchstart)
    mouse.element.removeEventListener('touchmove', mouse.touchmove)
    mouse.element.removeEventListener('touchend', mouse.touchend)

    // Re-add with passive:false so we can preventDefault
    mouse.element.addEventListener('touchstart', mouse.touchstart, { passive: false })
    mouse.element.addEventListener('touchmove', mouse.touchmove, { passive: false })
    mouse.element.addEventListener('touchend', mouse.touchend, { passive: false })

    // Prevent default scroll only when a body is grabbed
    let isGrabbing = false
    Events.on(engine, 'afterUpdate', () => {
      if (mc.body) {
        isGrabbing = true
      } else {
        isGrabbing = false
      }
    })
    container.addEventListener('touchmove', (e) => {
      if (isGrabbing) e.preventDefault()
    }, { passive: false })

    // Remove wheel listeners that block scrolling
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel)
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)

    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    })
    World.add(engine.world, mc)

    // ── DOM sync loop ─────────────────────────────────────────────────────
    const sync = () => {
      bodies.forEach((body, i) => {
        const el = tagRefs.current[i]
        if (!el) return
        const { x, y } = body.position
        const w = el.offsetWidth
        el.style.left = (x - w / 2) + 'px'
        el.style.top = (y - TAG_H / 2) + 'px'
        el.style.transform = `rotate(${body.angle}rad)`
        el.style.opacity = '1'
      })
      rafRef.current = requestAnimationFrame(sync)
    }
    sync()

    // ── Handle Resize ─────────────────────────────────────────────────────
    const handleResize = () => {
      if (!containerRef.current || !engineRef.current) return

      const newW = containerRef.current.offsetWidth
      const newH = containerRef.current.offsetHeight

      // Reposition walls
      Body.setPosition(walls[0], { x: newW / 2, y: newH + 25 })
      Body.setPosition(walls[1], { x: -25, y: newH / 2 })
      Body.setPosition(walls[2], { x: newW + 25, y: newH / 2 })

      // Keep tags inside new bounds
      bodies.forEach(body => {
        let { x, y } = body.position
        let needsMove = false

        if (x > newW) { x = newW - 50; needsMove = true }
        if (x < 0) { x = 50; needsMove = true }
        if (y > newH) { y = newH - 50; needsMove = true }

        if (needsMove) {
          Body.setPosition(body, { x, y })
          Body.setVelocity(body, { x: 0, y: 0 })
        }
      })
    }

    window.addEventListener('resize', handleResize)
    resizeRef.current = handleResize
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) initMatter() },
      { threshold: 0.05 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => {
      observer.disconnect()
      if (resizeRef.current) window.removeEventListener('resize', resizeRef.current)
      cancelAnimationFrame(rafRef.current)
      if (engineRef.current) {
        const { Engine } = require('matter-js')
        Engine.clear(engineRef.current)
        engineRef.current = null
      }
    }
  }, [])

  const handleHover = (i, enter) => {
    const el = tagRefs.current[i]
    if (!el) return
    gsap.to(el, { scale: enter ? 1.1 : 1, duration: 0.18, ease: enter ? 'back.out(2)' : 'power2.out' })
  }

  return (
    <section ref={sectionRef} className="skills-section">
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(100,50,180,0.1) 0%, transparent 70%)' }} />

      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(232,200,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(232,200,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 85% 85% at 50% 40%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 40%, black 40%, transparent 100%)',
      }} />

      {/* Header */}
      <div className="skills-header">
        <p className="skills-eyebrow">✦ Skills</p>
        <h2 className="skills-title">
          How <span className="skills-gradient">I Work</span>
        </h2>
        <p className="skills-desc">The tools I build with. The habits I bring to every team.</p>
      </div>

      {/* Category Legend */}
      <div className="skills-legend">
        {skillGroups.map((g, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 7, height: 7,
              borderRadius: '50%',
              background: g.color,
              boxShadow: `0 0 6px ${g.color}`,
              flexShrink: 0,
            }} />
            <span className="skills-legend-label">{g.category}</span>
          </div>
        ))}
      </div>

      {/* Hint for mobile users */}
      <p className="skills-touch-hint">✦ drag the tags around</p>

      {/* Physics container — always absolute positioned tags */}
      <div
        ref={containerRef}
        className="skills-container"
        style={{ touchAction: 'pan-y' }}
      >
        {allTags.map((tag, i) => (
          <div
            key={i}
            ref={el => tagRefs.current[i] = el}
            onMouseEnter={() => handleHover(i, true)}
            onMouseLeave={() => handleHover(i, false)}
            className="skills-tag"
            style={{
              background: tag.color + '12',
              border: '1px solid ' + tag.color + '35',
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: tag.color, opacity: 0.75, flexShrink: 0 }} />
            <span className="skills-tag-label" style={{ color: tag.color }}>{tag.label}</span>
          </div>
        ))}
      </div>

      {/* Soft Skills */}
      <div className="skills-soft">
        <p className="skills-soft-label">✦ Soft Skills</p>
        <div className="skills-soft-wrap">
          {softSkills.map((s, i) => (
            <span
              key={i}
              className="skills-soft-tag"
              onMouseEnter={e => { e.currentTarget.style.color = '#f9b8d4'; e.currentTarget.style.borderColor = 'rgba(249,184,212,0.3)'; e.currentTarget.style.background = 'rgba(249,184,212,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .skills-section {
          background: #0a0812;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .skills-header {
          padding: clamp(5vh, 8vh, 10vh) clamp(5vw, 8vw, 10vw) clamp(1vh, 2vh, 3vh);
          z-index: 2;
          position: relative;
          flex-shrink: 0;
        }
        .skills-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(232,200,255,0.8);
          margin: 0 0 0.4rem;
        }
        .skills-title {
          font-family: 'Clash Display', sans-serif;
          font-size: clamp(28px, 5vw, 64px);
          font-weight: 700;
          color: #fff;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 0.95;
        }
        .skills-gradient {
          background: linear-gradient(135deg, #e8c8ff, #f9b8d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .skills-desc {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(13px, 1.4vw, 17px);
          font-style: italic;
          color: rgba(255,255,255,0.7);
          margin: 0.6rem 0 0;
        }

        .skills-legend {
          padding: 0 clamp(5vw, 8vw, 10vw) clamp(0.5vh, 1vh, 1.5vh);
          z-index: 2;
          position: relative;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 0.8rem;
          flex-shrink: 0;
        }
        .skills-legend-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        /* Mobile touch hint */
        .skills-touch-hint {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(232,200,255,0.25);
          padding: 0 clamp(5vw, 8vw, 10vw);
          margin: 0 0 0.5rem;
          z-index: 2;
          position: relative;
        }
        @media (min-width: 769px) {
          .skills-touch-hint { display: none; }
        }

        /* ── Physics container ── */
        .skills-container {
          position: relative;
          flex: 1;
          min-height: 52vh;
          margin: 0 2vw;
          z-index: 2;
          overflow: hidden;
        }

        /* Tags — always absolute (positioned by Matter.js) */
        .skills-tag {
          position: absolute;
          opacity: 0;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          border-radius: 999px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          cursor: grab;
          user-select: none;
          white-space: nowrap;
          transform-origin: center center;
          will-change: transform;
        }
        .skills-tag:active { cursor: grabbing; }
        .skills-tag-label {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(11px, 1.2vw, 12px);
          font-weight: 500;
          letter-spacing: 0.06em;
        }

        /* Soft skills */
        .skills-soft {
          padding: clamp(2vh, 3vh, 4vh) clamp(5vw, 8vw, 10vw) clamp(5vh, 8vh, 10vh);
          z-index: 5;
          position: relative;
          flex-shrink: 0;
        }
        .skills-soft-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(232,200,255,0.7);
          margin: 0 0 1rem;
        }
        .skills-soft-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .skills-soft-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(12px, 1.3vw, 13px);
          color: rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 999px;
          padding: 6px 16px;
          letter-spacing: 0.06em;
          cursor: default;
          transition: all 0.3s;
        }

        @media (max-width: 480px) {
          .skills-container { min-height: 58vh; }
          .skills-tag { padding: 6px 11px; }
          .skills-tag-label { font-size: 11px; }
        }
      `}</style>
    </section>
  )
}

export default Skills