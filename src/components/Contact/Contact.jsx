import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'
import { useIsMobile } from '../../hooks/useIsMobile'

const contacts = [
  { label: 'Email', value: 'maylafaat@gmail.com', href: 'mailto:maylafaat@gmail.com', icon: '✉', desc: 'Drop a message' },
  { label: 'LinkedIn', value: 'maylafathinnadhifaulya', href: 'https://linkedin.com/in/maylafathinnadhifaulya', icon: '↗', desc: "Let's connect professionally" },
  { label: 'GitHub', value: 'Maylafathin12', href: 'https://github.com/Maylafathin12', icon: '↗', desc: 'See my code' },
  { label: 'Phone', value: '+62 882-0086-99254', href: 'tel:+6288200869254', icon: '✆', desc: 'Call or WhatsApp' },
]

const Contact = () => {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const titleRef = useRef(null)
  const charsRef = useRef([])
  const itemRefs = useRef([])
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const cursorTextRef = useRef(null)
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [visible, setVisible] = useState(false)
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const threeRef = useRef({})
  const isMobile = useIsMobile(768)

  // ── Three.js particle field ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || isMobile) return

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.z = 5

    const N = 900
    const positions = new Float32Array(N * 3)
    const colors = new Float32Array(N * 3)
    const sizes = new Float32Array(N)
    const speeds = new Float32Array(N)

    const palette = [
      new THREE.Color('#4a2e6e'),
      new THREE.Color('#3d1f50'),
      new THREE.Color('#2a1840'),
      new THREE.Color('#6b4090'),
      new THREE.Color('#5c3070'),
      new THREE.Color('#6b4289'),
      new THREE.Color('#5c3040'),
    ]

    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6
      const col = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
      sizes[i] = Math.random() * 1.2 + 0.3
      speeds[i] = Math.random() * 0.2 + 0.05
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.ShaderMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(0, 0) } },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float uTime;
        uniform vec2 uMouse;
        void main() {
          vColor = color;
          vec3 pos = position;
          float wave = sin(pos.x * 0.3 + uTime * 0.6) * 0.25 + cos(pos.y * 0.4 + uTime * 0.4) * 0.2;
          pos.z += wave;
          vec4 projected = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          vec2 ndc = projected.xy / projected.w;
          vec2 diff = ndc - uMouse;
          float d = length(diff);
          if (d < 0.35) {
            float strength = (0.35 - d) / 0.35;
            pos.xy += normalize(diff.xy) * strength * 0.8;
          }
          gl_PointSize = size * (300.0 / -( modelViewMatrix * vec4(pos, 1.0)).z);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.15, 0.5, d);
          gl_FragColor = vec4(vColor, alpha * 0.28);
        }
      `,
    })

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    const gridGeo = new THREE.BufferGeometry()
    const gridVerts = []
    for (let x = -9; x <= 9; x += 3) { gridVerts.push(x, -6, -2, x, 6, -2) }
    for (let y = -6; y <= 6; y += 3) { gridVerts.push(-9, y, -2, 9, y, -2) }
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridVerts, 3))
    const gridMat = new THREE.LineBasicMaterial({ color: '#0d0818', transparent: true, opacity: 0.2 })
    scene.add(new THREE.LineSegments(gridGeo, gridMat))

    threeRef.current = { renderer, scene, camera, mat, geo, positions, speeds, N }

    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', resize)

    let t = 0
    let raf
    const loop = () => {
      t += 0.008
      mat.uniforms.uTime.value = t

      const pos = geo.attributes.position.array
      for (let i = 0; i < N; i++) {
        pos[i * 3 + 1] += speeds[i] * 0.0015
        if (pos[i * 3 + 1] > 6) pos[i * 3 + 1] = -6
      }
      geo.attributes.position.needsUpdate = true

      camera.position.x = Math.sin(t * 0.15) * 0.3
      camera.position.y = Math.cos(t * 0.1) * 0.15

      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      geo.dispose()
      mat.dispose()
      gridGeo.dispose()
      gridMat.dispose()
    }
  }, [isMobile])

  // ── Mouse tracking for Three.js + custom cursor ──────────────────────────
  useEffect(() => {
    if (isMobile) return
    const onMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (threeRef.current.mat) {
        threeRef.current.mat.uniforms.uMouse.value.set(
          (e.clientX / window.innerWidth) * 2 - 1,
          -((e.clientY / window.innerHeight) * 2 - 1)
        )
      }
    }
    window.addEventListener('mousemove', onMove)

    let rafId
    const cursorLoop = () => {
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.12
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.12
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x - 24}px, ${cursorPos.current.y - 24}px)`
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${mousePos.current.x - 3}px, ${mousePos.current.y - 3}px)`
      }
      rafId = requestAnimationFrame(cursorLoop)
    }
    cursorLoop()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [isMobile])

  // ── Intersection + split-char reveal ─────────────────────────────────────
  const [hasRevealed, setHasRevealed] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
      if (entry.isIntersecting && !hasRevealed) {
        setHasRevealed(true)
        charsRef.current.forEach((el, i) => {
          if (!el) return
          gsap.fromTo(el,
            { opacity: 0, y: 80, rotateX: -90, filter: 'blur(8px)' },
            { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 1, ease: 'expo.out', delay: 0.1 + i * 0.04 }
          )
        })
        itemRefs.current.forEach((el, i) => {
          if (!el) return
          gsap.fromTo(el,
            { opacity: 0, x: -40, filter: 'blur(6px)' },
            { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out', delay: 0.9 + i * 0.12 }
          )
        })
      }
    }, { threshold: 0.15 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [hasRevealed])

  // ── Magnetic card effect ──────────────────────────────────────────────────
  const handleMouseMove = useCallback((e, i) => {
    const el = itemRefs.current[i]
    if (!el || isMobile) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * 0.1
    const dy = (e.clientY - cy) * 0.1
    const rx = ((e.clientY - cy) / rect.height) * -14
    const ry = ((e.clientX - cx) / rect.width) * 14
    gsap.to(el, { x: dx, y: dy, rotateX: rx, rotateY: ry, duration: 0.4, ease: 'power2.out' })
    const px = ((e.clientX - rect.left) / rect.width) * 100
    const py = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mx', `${px}%`)
    el.style.setProperty('--my', `${py}%`)
  }, [isMobile])

  const handleMouseLeave = useCallback((i) => {
    gsap.to(itemRefs.current[i], { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
    setHoveredIdx(null)
  }, [])

  const lines = ["LET'S BUILD", 'SOMETHING', "THAT'S", 'WORTH', 'SHOWING', 'OFF']

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Cormorant+Garamond:ital,wght@1,300;1,400;1,500;1,600&display=swap');

        ${!isMobile ? 'body { cursor: none !important; }' : ''}

        .contact-section {
          background: #07040f;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(6vh, 10vh, 12vh) clamp(4vw, 6vw, 8vw);
          position: relative;
          overflow: hidden;
          perspective: 1000px;
        }

        .three-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        .vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background: radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(7,4,15,0.7) 100%);
        }

        .glow-bottom {
          position: absolute;
          bottom: -100px;
          left: 50%;
          transform: translateX(-50%);
          width: 60vw;
          height: 300px;
          background: radial-gradient(ellipse at 50% 100%, rgba(155,114,207,0.2) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }

        /* ── CURSOR ── */
        .cursor-ring {
          position: fixed;
          top: 0; left: 0;
          width: 48px; height: 48px;
          border: 1px solid rgba(232,200,255,0.6);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transition: width 0.3s, height 0.3s, border-color 0.3s, background 0.3s;
          mix-blend-mode: difference;
        }
        .cursor-ring.hovered {
          width: 80px; height: 80px;
          border-color: rgba(249,184,212,0.9);
          background: rgba(249,184,212,0.05);
          margin: -16px 0 0 -16px;
        }
        .cursor-dot {
          position: fixed;
          top: 0; left: 0;
          width: 6px; height: 6px;
          background: #f9b8d4;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
        }
        .cursor-label {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 0.1em;
          color: #fff;
          opacity: 0;
          white-space: nowrap;
          transition: opacity 0.3s;
        }
        .cursor-ring.hovered .cursor-label { opacity: 1; }

        /* ── SUBTITLE ── */
        .eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(232,200,255,0.8);
          margin: 0 0 2rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .eyebrow::before, .eyebrow::after {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: rgba(232,200,255,0.25);
        }

        /* ── TITLE CHARS ── */
        .title-wrap {
          text-align: center;
          margin-bottom: clamp(3rem, 5rem, 6rem);
          position: relative;
          z-index: 2;
          width: 100%;
        }
        .title-line {
          display: block;
          overflow: visible;
          line-height: 0.88;
        }
        .title-char {
          display: inline-block;
          opacity: 0;
          font-family: 'Clash Display', 'Arial Black', sans-serif;
          font-size: clamp(32px, 8vw, 108px);
          font-weight: 700;
          letter-spacing: -0.03em;
          transform-origin: bottom center;
          will-change: transform, opacity;
        }

        .subtitle-italic {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 600;
          font-size: clamp(16px, 2vw, 21px);
          color: rgba(255,255,255,0.8);
          margin: 1.2rem 0 0;
          letter-spacing: 0.02em;
          max-width: min(560px, 90vw);
          margin-left: auto;
          margin-right: auto;
        }

        /* ── NUMBER DECORATION ── */
        .contact-number {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          color: rgba(232,200,255,0.2);
          letter-spacing: 0.1em;
          margin-right: auto;
          padding-right: 1rem;
          min-width: 28px;
          flex-shrink: 0;
        }

        /* ── CARDS ── */
        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          width: 100%;
          max-width: min(640px, 92vw);
          position: relative;
          z-index: 2;
        }

        .contact-card {
          display: flex;
          align-items: center;
          padding: clamp(1rem, 1.4rem, 1.8rem) clamp(1.2rem, 1.8rem, 2rem);
          border-radius: 18px;
          background: rgba(255,255,255,0.018);
          border: 1px solid rgba(232,200,255,0.07);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          text-decoration: none;
          cursor: none;
          opacity: 0;
          transition: border-color 0.3s, background 0.3s;
          will-change: transform;
          transform-style: preserve-3d;
          position: relative;
          overflow: hidden;
          --mx: 50%;
          --my: 50%;
        }

        @media (hover: none) {
          .contact-card { cursor: pointer; }
        }

        .contact-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle 120px at var(--mx) var(--my), rgba(232,200,255,0.08) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: inherit;
          pointer-events: none;
        }
        .contact-card:hover::before { opacity: 1; }
        .contact-card:hover {
          background: rgba(232,200,255,0.045);
          border-color: rgba(232,200,255,0.2);
        }

        .contact-card::after {
          content: '';
          position: absolute;
          left: 0; top: 20%; bottom: 20%;
          width: 2px;
          border-radius: 2px;
          background: linear-gradient(180deg, transparent, #e8c8ff, transparent);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .contact-card:hover::after { opacity: 1; }

        .card-meta { flex: 1; min-width: 0; }

        .card-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(232,200,255,0.7);
          margin: 0 0 4px;
        }

        .card-value {
          font-family: 'Clash Display', 'Arial Black', sans-serif;
          font-size: clamp(12px, 1.9vw, 20px);
          font-weight: 600;
          color: rgba(255,255,255,0.65);
          margin: 0 0 2px;
          letter-spacing: -0.01em;
          transition: color 0.3s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .contact-card:hover .card-value { color: #fff; }

        .card-desc {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin: 0;
          transition: color 0.3s;
        }
        .contact-card:hover .card-desc { color: rgba(249,184,212,0.5); }

        .card-icon {
          font-size: 17px;
          color: rgba(255,255,255,0.4);
          transition: color 0.3s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
          margin-left: 1rem;
          flex-shrink: 0;
        }
        .contact-card:hover .card-icon {
          color: #f9b8d4;
          transform: scale(1.4) rotate(-8deg);
        }

        /* ── FOOTER ── */
        .footer-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.4);
          margin-top: 4rem;
          position: relative;
          z-index: 2;
          text-transform: uppercase;
          text-align: center;
        }

        .deco-line {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: min(640px, 92vw);
          height: 1px;
          margin-bottom: 2.5rem;
          background: linear-gradient(90deg, transparent, rgba(232,200,255,0.15) 30%, rgba(249,184,212,0.15) 70%, transparent);
        }

        /* ── Mobile tweaks ── */
        @media (max-width: 480px) {
          .contact-number { display: none; }
          .card-value { font-size: clamp(11px, 3.5vw, 15px); }
        }

        @media (min-width: 1920px) {
          .contact-section { max-width: 1400px; margin: 0 auto; }
        }
      `}</style>

      {/* Custom Cursor — desktop only */}
      {!isMobile && (
        <>
          <div
            ref={cursorRef}
            className={`cursor-ring ${hoveredIdx !== null ? 'hovered' : ''}`}
            style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }}
          >
            <span ref={cursorTextRef} className="cursor-label">
              {hoveredIdx !== null ? contacts[hoveredIdx].label.toUpperCase() : ''}
            </span>
          </div>
          <div ref={cursorDotRef} className="cursor-dot" />
        </>
      )}

      <section ref={sectionRef} className="contact-section">
        {/* Three.js canvas */}
        {!isMobile && <canvas ref={canvasRef} className="three-canvas" />}

        {/* Overlays */}
        <div className="noise-overlay" />
        <div className="vignette" />
        <div className="glow-bottom" />

        {/* Title */}
        <div ref={titleRef} className="title-wrap" style={{ position: 'relative', zIndex: 2 }}>
          <p className="eyebrow">Let's Connect</p>

          {lines.map((line, li) => {
            const isGradientWord = li === 1 || li === 3
            return (
              <span className="title-line group cursor-default" key={li}>
                {line.split('').map((ch, ci) => {
                  const globalIdx = lines.slice(0, li).join('').length + ci
                  return (
                    <span
                      key={ci}
                      className={`title-char ${isGradientWord ? 'bg-gradient-to-br from-[#e8c8ff] via-[#f9b8d4] to-[#c8b4ff] bg-clip-text text-transparent transition-[filter] duration-300 ease-out group-hover:saturate-[1.2]' : 'text-white'}`}
                      ref={el => charsRef.current[globalIdx] = el}
                      style={{ whiteSpace: ch === ' ' ? 'pre' : undefined }}
                    >
                      {ch}
                    </span>
                  )
                })}
              </span>
            )
          })}

          <p className="subtitle-italic">
            I'm open to full-time roles and selective freelance projects — particularly in product-focused teams where design and engineering work closely together.
          </p>
        </div>

        {/* Deco line */}
        <div className="deco-line" style={{ position: 'relative', zIndex: 2 }} />

        {/* Contact cards */}
        <div className="contact-list">
          {contacts.map((c, i) => (
            <a
              key={i}
              ref={el => itemRefs.current[i] = el}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="contact-card"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseMove={e => handleMouseMove(e, i)}
              onMouseLeave={() => handleMouseLeave(i)}
            >
              <span className="contact-number">0{i + 1}</span>
              <div className="card-meta">
                <p className="card-label">{c.label}</p>
                <p className="card-value">{c.value}</p>
                <p className="card-desc">{c.desc}</p>
              </div>
              <span className="card-icon">{c.icon}</span>
            </a>
          ))}
        </div>

        {/* Footer */}
        <p className="footer-text">
          Designed & Built by Mayla Fathin Nadhifa Ulya · 2026
        </p>
      </section>
    </>
  )
}

export default Contact