import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * PRELOADER — "Void Bloom"
 *
 * Phase 1 · CONVERGE  — Hundreds of violet/rose/blue particles scattered
 *                        across dark canvas slowly drift & converge into
 *                        the shape of the letter M.  Ambient dust floats
 *                        through the void the whole time.
 *
 * Phase 2 · TRACE     — A soft spark traces the M stroke-by-stroke,
 *                        leaving a dim lavender line. No blinding white—
 *                        everything stays in the dark-purple palette.
 *
 * Phase 3 · BLOOM     — The M "exhales": particles radiate outward in a
 *                        gentle bloom explosion, then fade to nothing.
 *
 * Phase 4 · REVEAL    — "introducing you to" + "Mayla" drift up from the
 *                        bottom with Playfair Display, gradient muted-violet,
 *                        then float off and the canvas fades to transparent.
 */

// ─── Palette (no pure white anywhere) ────────────────────────────────────────
const P = {
  bg: '#07040f',
  p1: '#9b72cf',   // violet
  p2: '#c084a0',   // muted rose
  p3: '#6b8fd4',   // dusty blue
  core: '#d8c8f8',   // pale lavender — replaces white
  trail: '#e8b8d0',  // blush
}

const hexRgba = (hex, a) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}
const rand = (lo, hi) => Math.random() * (hi - lo) + lo
const easeOutCubic = t => 1 - Math.pow(1 - t, 3)
const easeInOutQuad = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

const getMPath = (cx, cy, sz) => {
  const w = sz * 1.2; // lebar logo
  const h = sz * 1.0; // tinggi logo

  return [
    { x: cx - w, y: cy + h },     // 1. Kiri bawah
    { x: cx - w, y: cy - h },     // 2. Kiri atas
    { x: cx, y: cy + h * 0.1 }, // 3. Tengah (lekukan M - agak menggantung)
    { x: cx + w, y: cy - h },     // 4. Kanan atas
    { x: cx + w, y: cy + h },     // 5. Kanan bawah
  ];
};

const interpolatePath = (path, steps = 80) => {
  const pts = []
  for (let i = 0; i < path.length - 1; i++) {
    for (let t = 0; t < steps; t++) {
      const f = t / steps
      pts.push({
        x: path[i].x + (path[i + 1].x - path[i].x) * f,
        y: path[i].y + (path[i + 1].y - path[i].y) * f,
      })
    }
  }
  pts.push(path[path.length - 1])
  return pts
}

// ─── Component ────────────────────────────────────────────────────────────────
const Preloader = ({ onComplete }) => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const introRef = useRef(null)
  const nameRef = useRef(null)
  const [phase, setPhase] = useState('converge')

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const W = canvas.width, H = canvas.height
    const cx = W / 2, cy = H / 2
    const sz = Math.min(W, H) * 0.115

    const mPath = getMPath(cx, cy, sz)
    const mPts = interpolatePath(mPath, 90)

    // ── Particles — one per M-point, start scattered ──
    const colors = [P.p1, P.p2, P.p3]
    const particles = mPts.map((target, i) => ({
      x: rand(cx - W * 0.46, cx + W * 0.46),
      y: rand(cy - H * 0.46, cy + H * 0.46),
      tx: target.x, ty: target.y,
      r: rand(0.5, 1.7),
      color: colors[Math.floor(Math.random() * 3)],
      alpha: rand(0.18, 0.52),
      delay: (i / mPts.length) * 0.5 + rand(0, 0.1),
      spd: rand(0.75, 1.0),
      // bloom velocity (filled later)
      vx: 0, vy: 0,
      bx: target.x, by: target.y,   // bloom start pos
    }))

    // ── Ambient dust (decorative only) ──
    const dust = Array.from({ length: 150 }, () => ({
      x: rand(0, W), y: rand(0, H),
      r: rand(0.2, 1.0),
      alpha: rand(0.04, 0.18),
      color: Math.random() > 0.5 ? P.p1 : P.p3,
      dx: rand(-0.07, 0.07), dy: rand(-0.06, 0.06),
      tw: rand(0, Math.PI * 2), tws: rand(0.01, 0.024),
    }))

    const moveDust = () => dust.forEach(d => {
      d.x += d.dx; d.y += d.dy; d.tw += d.tws
      if (d.x < 0) d.x = W; if (d.x > W) d.x = 0
      if (d.y < 0) d.y = H; if (d.y > H) d.y = 0
    })

    const drawDust = (alphaScale = 1) => dust.forEach(d => {
      const a = d.alpha * (0.5 + 0.5 * Math.sin(d.tw)) * alphaScale
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
      ctx.fillStyle = hexRgba(d.color, a); ctx.fill()
    })

    const drawBg = () => {
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H)
    }

    let raf

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 1 · CONVERGE
    // ─────────────────────────────────────────────────────────────────────────
    const CONV_DUR = 3400
    let convStart = null

    const convergeFrame = (ts) => {
      if (!convStart) convStart = ts
      const prog = Math.min((ts - convStart) / CONV_DUR, 1)

      drawBg()

      // Subtle center aura
      const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, sz * 4)
      aura.addColorStop(0, `rgba(100,60,180,${0.09 * prog})`)
      aura.addColorStop(1, 'transparent')
      ctx.fillStyle = aura; ctx.fillRect(0, 0, W, H)

      moveDust(); drawDust()

      // Ghost M (barely visible)
      const gAlpha = Math.min(prog * 1.8, 1) * 0.08
      if (gAlpha > 0.005) {
        ctx.beginPath(); ctx.moveTo(mPath[0].x, mPath[0].y)
        mPath.forEach((p, i) => { if (i > 0) ctx.lineTo(p.x, p.y) })
        ctx.strokeStyle = hexRgba(P.p1, gAlpha)
        ctx.lineWidth = 16; ctx.lineJoin = 'miter'; ctx.miterLimit = 10; ctx.lineCap = 'square'
        ctx.stroke()
      }

      // Converging particles
      particles.forEach(p => {
        const lp = Math.max(0, Math.min((prog - p.delay) / (1 - p.delay) * p.spd, 1))
        const e = easeOutCubic(lp)
        const px = p.x + (p.tx - p.x) * e
        const py = p.y + (p.ty - p.y) * e
        const a = p.alpha * (0.3 + 0.7 * e) * (0.8 + 0.2 * Math.sin(prog * 7 + p.delay * 18))

        if (lp > 0.55) {
          const pg = ctx.createRadialGradient(px, py, 0, px, py, p.r * 6)
          pg.addColorStop(0, hexRgba(p.color, a * 0.35))
          pg.addColorStop(1, 'transparent')
          ctx.beginPath(); ctx.arc(px, py, p.r * 6, 0, Math.PI * 2)
          ctx.fillStyle = pg; ctx.fill()
        }
        ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2)
        ctx.fillStyle = hexRgba(p.color, a); ctx.fill()
      })

      if (prog < 1) {
        raf = requestAnimationFrame(convergeFrame)
      } else {
        setTimeout(startTrace, 180)
      }
    }
    raf = requestAnimationFrame(convergeFrame)

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 2 · TRACE
    // ─────────────────────────────────────────────────────────────────────────
    const startTrace = () => {
      setPhase('trace')
      const tracePts = interpolatePath(mPath, 75)
      let idx = 0, trail = []
      const TRAIL = 20

      const traceFrame = () => {
        if (idx >= tracePts.length) { setTimeout(startBloom, 320); return }

        drawBg()

        // Center aura
        const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, sz * 4.5)
        aura.addColorStop(0, 'rgba(90,50,160,0.09)')
        aura.addColorStop(1, 'transparent')
        ctx.fillStyle = aura; ctx.fillRect(0, 0, W, H)

        moveDust(); drawDust(0.5)

        // Particles fully converged (dim)
        particles.forEach(p => {
          ctx.beginPath(); ctx.arc(p.tx, p.ty, p.r, 0, Math.PI * 2)
          ctx.fillStyle = hexRgba(p.color, p.alpha * 0.28); ctx.fill()
        })

        // Ghost M
        ctx.beginPath(); ctx.moveTo(mPath[0].x, mPath[0].y)
        mPath.forEach((p, i) => { if (i > 0) ctx.lineTo(p.x, p.y) })
        ctx.strokeStyle = 'rgba(155,114,207,0.07)'
        ctx.lineWidth = 18; ctx.lineJoin = 'miter'; ctx.miterLimit = 10; ctx.lineCap = 'square'
        ctx.stroke()



        // Di dalam traceFrame:
        if (idx > 1) {
          const drawStroke = (color, width) => {
            ctx.beginPath();
            ctx.moveTo(tracePts[0].x, tracePts[0].y)
            for (let i = 1; i <= idx; i++) ctx.lineTo(tracePts[i].x, tracePts[i].y)
            ctx.strokeStyle = color;
            ctx.lineWidth = width; // Pertebal bagian ini jika ingin lebih solid
            ctx.lineJoin = 'miter';
            ctx.stroke()
          }
          // Contoh menebalkan:
          drawStroke('rgba(140,100,200,0.1)', 35) // Glow luar
          drawStroke('rgba(210,185,250,0.8)', 4)  // Garis inti
        }

        // Trail
        trail.push(tracePts[idx])
        if (trail.length > TRAIL) trail.shift()
        trail.forEach((p, i) => {
          const a = (i / trail.length) * 0.65
          ctx.beginPath(); ctx.arc(p.x, p.y, (i / trail.length) * 3, 0, Math.PI * 2)
          ctx.fillStyle = hexRgba(P.trail, a); ctx.fill()
        })

        // Spark head (no white — pale lavender only)
        const cur = tracePts[idx]
        const sg = ctx.createRadialGradient(cur.x, cur.y, 0, cur.x, cur.y, 16)
        sg.addColorStop(0, 'rgba(210,190,255,0.82)')
        sg.addColorStop(0.45, 'rgba(180,140,220,0.38)')
        sg.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.arc(cur.x, cur.y, 16, 0, Math.PI * 2)
        ctx.fillStyle = sg; ctx.fill()

        ctx.beginPath(); ctx.arc(cur.x, cur.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = P.core; ctx.fill()

        idx += 2
        raf = requestAnimationFrame(traceFrame)
      }
      raf = requestAnimationFrame(traceFrame)
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 3 · BLOOM
    // ─────────────────────────────────────────────────────────────────────────
    const startBloom = () => {
      setPhase('bloom')

      // Reset particle positions to M, assign outward velocities
      particles.forEach((p, i) => {
        p.bx = p.tx; p.by = p.ty
        const angle = Math.atan2(p.ty - cy, p.tx - cx) + rand(-0.7, 0.7)
        const spd = rand(0.35, 2.0)
        p.vx = Math.cos(angle) * spd
        p.vy = Math.sin(angle) * spd
      })

      let bloomStart = null
      const BLOOM_DUR = 1200

      const bloomFrame = (ts) => {
        if (!bloomStart) bloomStart = ts
        const bp = Math.min((ts - bloomStart) / BLOOM_DUR, 1)
        const e = easeInOutQuad(bp)

        drawBg()

        // Fading center aura
        const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, sz * 6)
        aura.addColorStop(0, `rgba(110,65,190,${0.16 * (1 - e)})`)
        aura.addColorStop(1, 'transparent')
        ctx.fillStyle = aura; ctx.fillRect(0, 0, W, H)

        moveDust(); drawDust(0.4 * (1 - e * 0.6))

        // Fading M stroke
        if (1 - e > 0.02) {
          const fa = 1 - e
          ctx.beginPath(); ctx.moveTo(mPath[0].x, mPath[0].y)
          mPath.forEach((p, i) => { if (i > 0) ctx.lineTo(p.x, p.y) })
          ctx.strokeStyle = `rgba(140,100,200,${0.07 * fa})`
          ctx.lineWidth = 28; ctx.lineJoin = 'miter'; ctx.miterLimit = 10; ctx.lineCap = 'square'
          ctx.stroke()

          ctx.beginPath(); ctx.moveTo(mPath[0].x, mPath[0].y)
          mPath.forEach((p, i) => { if (i > 0) ctx.lineTo(p.x, p.y) })
          ctx.strokeStyle = `rgba(210,185,250,${0.78 * fa})`
          ctx.lineWidth = 2.6; ctx.lineJoin = 'miter'; ctx.miterLimit = 10; ctx.lineCap = 'square'
          ctx.stroke()
        }

        // Bloom particles
        particles.forEach(p => {
          p.bx += p.vx; p.by += p.vy
          p.vx *= 0.975; p.vy *= 0.975
          const pa = p.alpha * (1 - e * 0.92)
          ctx.beginPath(); ctx.arc(p.bx, p.by, p.r * (1 + e * 0.6), 0, Math.PI * 2)
          ctx.fillStyle = hexRgba(p.color, pa); ctx.fill()
        })

        if (bp < 1) {
          raf = requestAnimationFrame(bloomFrame)
        } else {
          setPhase('reveal')
        }
      }
      raf = requestAnimationFrame(bloomFrame)
    }

    return () => cancelAnimationFrame(raf)
  }, [])

  // ─── PHASE 4 · REVEAL ─────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'reveal') return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = P.bg
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    gsap.timeline()
      .to(introRef.current, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.15,
      })
      .to(nameRef.current, {
        opacity: 1, y: 0, duration: 1.4, ease: 'power4.out',
      }, '-=0.45')
      .to({}, { duration: 2.4 })
      .to(nameRef.current, {
        y: -56, opacity: 0, scale: 0.9,
        duration: 1.2, ease: 'power3.inOut',
      })
      .to(introRef.current, {
        opacity: 0, duration: 0.55,
      }, '-=1.05')
      .to(canvasRef.current, {
        opacity: 0, duration: 0.9, ease: 'power2.inOut',
      }, '-=0.75')
      .to(containerRef.current, {
        opacity: 0, duration: 0.65, ease: 'power2.inOut',
        onComplete: () => { if (onComplete) onComplete() },
      }, '-=0.45')
  }, [phase])

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: P.bg }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Text — bottom-anchored so M stays as focal centre */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <p
          ref={introRef}
          style={{
            opacity: 0, transform: 'translateY(16px)',
            fontFamily: '"Cormorant Garamond",Georgia,serif',
            fontSize: 'clamp(10px,1.25vw,13px)',
            letterSpacing: '0.52em',
            color: 'rgba(185,145,215,0.48)',
            textTransform: 'uppercase',
            fontStyle: 'italic',
            marginBottom: '20px',
            textAlign: 'center',
            lineHeight: 2.2,
          }}
        >
          she builds. &nbsp; she designs. &nbsp; she codes.
        </p>

        <h1
          ref={nameRef}
          style={{
            opacity: 0, transform: 'translateY(22px)',
            fontFamily: '"Playfair Display",Didot,"Bodoni MT",Georgia,serif',
            fontSize: 'clamp(24px,4.5vw,62px)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            background: 'linear-gradient(155deg,#caaff0 0%,#deb8d4 42%,#a8a0e0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.25,
            textAlign: 'center',
            padding: '0 2rem',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          MAYLA<br />
          FATHIN<br />
          NADHIFA ULYA
        </h1>
      </div>
    </div>
  )
}

export default Preloader