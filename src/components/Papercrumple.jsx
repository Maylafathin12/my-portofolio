import { useRef, forwardRef, useImperativeHandle } from 'react'
import gsap from 'gsap'

const PaperCrumple = forwardRef(({ onComplete }, ref) => {
  const overlayRef = useRef(null)
  const ballRef = useRef(null)

  useImperativeHandle(ref, () => ({
    play: () => {
      const overlay = overlayRef.current
      const ball = ballRef.current
      if (!overlay || !ball) return

      gsap.set(overlay, { display: 'flex', opacity: 1 })

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(overlay, {
            opacity: 0, duration: 0.4, ease: 'power2.out',
            onComplete: () => {
              gsap.set(overlay, { display: 'none' })
              if (onComplete) onComplete()
            }
          })
        }
      })

      // Phase 1 — full screen
      tl.set(overlay, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' })

      // Phase 2 — corners crumple
      tl.to(overlay, { clipPath: 'polygon(8% 8%, 92% 5%, 95% 92%, 5% 95%)', duration: 0.35, ease: 'power2.in' })
      tl.to(overlay, { clipPath: 'polygon(18% 15%, 82% 12%, 85% 85%, 15% 88%)', duration: 0.25, ease: 'power2.in' })
      tl.to(overlay, { clipPath: 'polygon(30% 28%, 70% 25%, 72% 72%, 28% 74%)', duration: 0.2, ease: 'power2.in' })

      // Phase 3 — shrink to circle
      tl.to(overlay, { clipPath: 'circle(8% at 50% 50%)', duration: 0.3, ease: 'power3.in' })

      // Phase 4 — ball bounce
      tl.to(ball, { scale: 1.35, duration: 0.1, ease: 'power2.out' })
      tl.to(ball, { scale: 0.85, duration: 0.09, ease: 'power2.in' })
      tl.to(ball, { scale: 1.15, duration: 0.09, ease: 'power2.out' })
      tl.to(ball, { scale: 1, duration: 0.08, ease: 'power2.in' })

      // Phase 5 — disappear
      tl.to(overlay, { clipPath: 'circle(0% at 50% 50%)', duration: 0.3, ease: 'power3.in' })
    }
  }))

  return (
    <div
      ref={overlayRef}
      style={{
        display: 'none',
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        background: 'linear-gradient(135deg, #1a1030 0%, #0d0820 50%, #150d28 100%)',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      }}
    >
      {/* Crumple texture */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}>
        <filter id="cf2">
          <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="4" seed="8" />
          <feDisplacementMap in="SourceGraphic" scale="40" />
        </filter>
        <rect width="100%" height="100%" fill="rgba(232,200,255,0.4)" filter="url(#cf2)" />
      </svg>

      {/* Fold lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }}>
        {['M20%,0 L50%,50%','M80%,0 L50%,50%','M100%,20% L50%,50%','M100%,80% L50%,50%',
          'M80%,100% L50%,50%','M20%,100% L50%,50%','M0,80% L50%,50%','M0,20% L50%,50%',
          'M35%,10% L65%,45%','M10%,35% L45%,65%','M65%,10% L35%,45%','M90%,35% L60%,65%'
        ].map((d, i) => (
          <path key={i} d={d} stroke="rgba(232,200,255,0.7)" strokeWidth="0.8" fill="none" />
        ))}
      </svg>

      {/* Corner shadows */}
      {[
        { top:0, left:0, background:'radial-gradient(circle at 0% 0%, rgba(0,0,0,0.6), transparent 60%)' },
        { top:0, right:0, background:'radial-gradient(circle at 100% 0%, rgba(0,0,0,0.6), transparent 60%)' },
        { bottom:0, left:0, background:'radial-gradient(circle at 0% 100%, rgba(0,0,0,0.6), transparent 60%)' },
        { bottom:0, right:0, background:'radial-gradient(circle at 100% 100%, rgba(0,0,0,0.6), transparent 60%)' },
      ].map((s, i) => (
        <div key={i} style={{ position:'absolute', width:'35%', height:'35%', pointerEvents:'none', ...s }} />
      ))}

      {/* Ball */}
      <div
        ref={ballRef}
        style={{
          width: 70,
          height: 70,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,200,255,0.35) 0%, rgba(100,50,180,0.5) 50%, rgba(13,10,20,0.9) 100%)',
          boxShadow: '0 0 30px rgba(232,200,255,0.4), 0 0 60px rgba(100,50,180,0.3)',
          position: 'relative',
          zIndex: 2,
        }}
      />
    </div>
  )
})

export default PaperCrumple