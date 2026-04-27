import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useIsMobile } from '../../hooks/useIsMobile'

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
  { category: 'Design & Tools', color: '#c8b4ff', skills: ['Scalable Architecture', 'Performance Optimization', 'Component-Driven Development', 'Clean Code'] },
  { category: 'Languages', color: '#ffd6a5', skills: ['Indonesian (Native)', 'English (Professional)'] },
]

const softSkills = ['Mentoring', 'Knowledge Sharing', 'Growth Mindset', 'Cross-functional Collaboration', 'Problem Solving', 'Fast Learner', 'Creative Thinking']
const allTags = skillGroups.flatMap(g => g.skills.map(s => ({ label: s, color: g.color })))

const Skills = () => {
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const tagRefs = useRef([])
  const engineRef = useRef(null)
  const isMobile = useIsMobile(768)

  const initMatter = async () => {
    if (engineRef.current || isMobile) return

    const Matter = await import('matter-js')
    const { Engine, Render, Runner, Bodies, Body, World, Mouse, MouseConstraint, Events } = Matter

    const container = containerRef.current
    if (!container) return
    const W = container.offsetWidth
    const H = container.offsetHeight

    const engine = Engine.create({ gravity: { y: 1.4 } })
    engineRef.current = engine
    const runner = Runner.create()

    Runner.run(runner, engine)

    // Walls & floor
    const walls = [
      Bodies.rectangle(W / 2, H + 25, W * 3, 50, { isStatic: true }),
      Bodies.rectangle(-25, H / 2, 50, H * 3, { isStatic: true }),
      Bodies.rectangle(W + 25, H / 2, 50, H * 3, { isStatic: true }),
    ]
    World.add(engine.world, walls)

    // Create bodies for each tag
    const bodies = allTags.map((_, i) => {
      const el = tagRefs.current[i]
      const w = el ? el.offsetWidth : 130
      const h = 36
      const x = W * 0.08 + Math.random() * (W * 0.84)
      const y = -50 - i * 20
      const body = Bodies.rectangle(x, y, w, h, {
        restitution: 0.5,
        friction: 0.15,
        frictionAir: 0.02,
        chamfer: { radius: 18 },
        label: 'tag-' + i,
      })

      // Batasi rotation maksimal ±25 derajat supaya text tidak terbalik
      const maxAngle = 0.44 // ~25 derajat dalam radian
      Body.setAngle(body, (Math.random() - 0.5) * 0.4)

      // Clamp angle setiap frame supaya tidak melebihi batas
      Matter.Events.on(engine, 'beforeUpdate', () => {
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

    const mouse = Mouse.create(container)
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel)
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)
    mouse.element.removeEventListener('touchstart', mouse.touchstart)
    mouse.element.removeEventListener('touchmove', mouse.touchmove)
    mouse.element.removeEventListener('touchend', mouse.touchend)

    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.25, render: { visible: false } },
    })
    World.add(engine.world, mc)

    const sync = () => {
      bodies.forEach((body, i) => {
        const el = tagRefs.current[i]
        if (!el) return
        const { x, y } = body.position
        const w = el.offsetWidth
        el.style.left = (x - w / 2) + 'px'
        el.style.top = (y - (36 / 2)) + 'px'
        el.style.transform = `rotate(${body.angle}rad)`
        el.style.opacity = '1'
      })
      requestAnimationFrame(sync)
    }
    sync()
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) initMatter() },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleHover = (i, enter) => {
    const el = tagRefs.current[i]
    if (!el) return
    gsap.to(el, { scale: enter ? 1.12 : 1, duration: 0.2, ease: enter ? 'back.out(2)' : 'power2.out' })
  }

  return (
    <section
      ref={sectionRef}
      style={{ background: '#0a0812', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(100,50,180,0.1) 0%, transparent 70%)' }} />
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: -1,
        backgroundImage: `
    linear-gradient(rgba(232,200,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(232,200,255,0.04) 1px, transparent 1px)
  `,
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 85% 85% at 50% 40%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 40%, black 40%, transparent 100%)',
      }} />

      {/* Dot accents di pojok-pojok grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5,
        backgroundImage: 'radial-gradient(circle, rgba(232,200,255,0.12) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 70% 70% at 50% 30%, black 20%, transparent 90%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 30%, black 20%, transparent 90%)',
      }} />
      {/* Header */}
      <div style={{ padding: '8vh 8vw 2vh', zIndex: 2, position: 'relative' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(232,200,255,0.8)', margin: '0 0 0.4rem' }}>✦ Skills</p>
        <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em', lineHeight: 0.95 }}>
          How <span style={{ background: 'linear-gradient(135deg, #e8c8ff, #f9b8d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>I Work</span>
        </h2>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(13px, 1.4vw, 17px)', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', margin: '0.6rem 0 0' }}>
          The tools I build with. The habits I bring to every team.
        </p>
      </div>

      {/* Category Legend */}
      <div style={{
        padding: '0 8vw 2vh',
        zIndex: 2,
        position: 'relative',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        {skillGroups.map((g, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 7, height: 7,
              borderRadius: '50%',
              background: g.color,
              boxShadow: `0 0 6px ${g.color}`,
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 10,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
            }}>
              {g.category}
            </span>
          </div>
        ))}
      </div>

      {/* Matter.js container */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          flex: 1,
          minHeight: '55vh',
          margin: '0 3vw',
          zIndex: 2,
          touchAction: 'pan-y',
          overscrollBehavior: 'none',
          ...(isMobile ? {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem 1rem'
          } : {})
        }}
      >
        {allTags.map((tag, i) => (
          <div
            key={i}
            ref={el => tagRefs.current[i] = el}
            onMouseEnter={() => handleHover(i, true)}
            onMouseLeave={() => handleHover(i, false)}
            style={{
              position: 'absolute',
              opacity: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '8px 16px',
              borderRadius: 999,
              background: tag.color + '12',
              border: '1px solid ' + tag.color + '35',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              cursor: 'grab',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              transformOrigin: 'center center',
              willChange: 'transform',
              ...(isMobile ? {
                position: 'relative',
                opacity: 1,
                top: 'auto',
                left: 'auto',
                transform: 'none',
                cursor: 'default'
              } : {})
            }}
            onMouseDown={e => { if (!isMobile) e.currentTarget.style.cursor = 'grabbing' }}
            onMouseUp={e => { if (!isMobile) e.currentTarget.style.cursor = 'grab' }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: tag.color, opacity: 0.75, flexShrink: 0 }} />
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500, color: tag.color, letterSpacing: '0.06em' }}>
              {tag.label}
            </span>
          </div>
        ))}
      </div>

      {/* Soft Skills */}
      <div style={{ padding: '3vh 8vw 8vh', zIndex: 5, position: 'relative' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(232,200,255,0.7)', margin: '0 0 1rem' }}>✦ Soft Skills</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {softSkills.map((s, i) => (
            <span
              key={i}
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 999, padding: '6px 16px', letterSpacing: '0.06em', cursor: 'default', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f9b8d4'; e.currentTarget.style.borderColor = 'rgba(249,184,212,0.3)'; e.currentTarget.style.background = 'rgba(249,184,212,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills