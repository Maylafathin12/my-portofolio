import React, { useEffect, useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { useIsMobile } from '../../hooks/useIsMobile'
import sehatImg from '../../assets/sehat.png'
import sahalImg from '../../assets/sahal.png'
import commandImg from '../../assets/command.png'
import yumyImg from '../../assets/yumy.png'
import recycleImg from '../../assets/recycle.png'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    number: '01',
    title: 'EduResearch AI',
    role: 'Front-End Developer',
    year: '2026 (May)',
    desc: 'As the Sole Front-End Engineer, I am crafting the entire visual foundation for an AI-driven research platform specifically for undergraduate students. Currently in development, my focus is on transforming complex AI interactions into a seamless digital experience using React.js and GSAP. I am engineering a modular component architecture and high-performance UI flows—from interactive Title Builders to Methodology Suggesters—ensuring that every step of the thesis journey feels intuitive, responsive, and visually engaging.',
    tags: ['React.js', 'GSAP', 'AI Integration', 'SaaS'],
    link: null,
    isComingSoon: true,
    glow: '#F3E5F5', 
    geometry: 'box',
    previewImage: null,
  },
  {
    number: '02',
    title: 'Global Educativa.id',
    role: 'Front-End Developer',
    year: '2026 (Feb - April)',
    desc: 'As the sole front-end developer in a lean two-person team, I engineered this international platform from scratch in just one month—slashing the original three-month timeline by 66%. Leveraging Three.js, GSAP, and Framer Motion, I architected an immersive interface tailored for professional academic data analysis. I focused on delivering a premium, high-performance experience for global researchers, ensuring that complex data services are accessible through a seamless and visually stunning UI.',
    tags: ['React.js', 'Tailwind CSS', 'Responsive', 'Production'],
    link: 'https://global.educativa.id',
    glow: '#E1BEE7', // Pale Pastel Purple
    geometry: 'sphere',
    previewImage: null,
  },
  {
    number: '03',
    title: 'Kelas Riset by Educativa',
    role: 'Front-End Developer — Revamp',
    year: '2026 (Dec - March)',
    desc: 'I spearheaded the visual redesign and front-end overhaul of the KelasRiset landing page to enhance user engagement and modernize its digital presence. By implementing a cleaner, more intuitive layout and refining the component architecture, I successfully elevated the platforms visual appeal, receiving significant positive feedback on the improved user experience. The revamp focused on aligning the UI with Educativa’s professional identity while maintaining high-performance standards for over 6,985+ active members.',
    tags: ['HTML', 'CSS', 'JavaScript', 'UI Revamp'],
    link: 'https://kelasriset.com',
    glow: '#CE93D8', // Soft Lilac
    geometry: 'torus',
    previewImage: null,
  },
  {
    number: '04',
    title: 'Command Center Kab. Blora',
    role: 'Front-End Developer · DINKOMINFO',
    year: '2024 (Oct - Nov)',
    desc: 'Real-time operations dashboard built for DINKOMINFO Kabupaten Blora — actively used by local government officials to monitor regional data daily.',
    tags: ['PHP', 'LARAVEL', 'Dashboard', 'Government', 'Real-time Data'],
    link: null,
    glow: '#B39DDB', // Muted Lavender
    geometry: 'octahedron',
    previewImage: commandImg,
    noLinkText: 'Proprietary Software',
  },
  {
    number: '05',
    title: 'SAHAL',
    role: 'Web Developer',
    year: '2024 (Feb - Sept)',
    desc: 'Serving as the Chief Technology Officer (CTO), I directed the technical strategy and front-end development for SAHAL, an innovative Arabic language learning platform. I oversaw the deployment of a scalable system that successfully acquired and sustained 500+ active students ranging from elementary to high school levels. My focus was on bridging the gap between classical education and modern digital accessibility, ensuring an engaging and seamless learning experience for a diverse age group.',
    tags: ['WordPress', 'EdTech', '500+ Users', 'SD–SMA'],
    link: null,
    glow: '#9F86C0', // Pastel Deep Lavender
    geometry: 'dodecahedron',
    previewImage: sahalImg,
    noLinkText: 'Proprietary Software',
  },
  {
    number: '06',
    title: 'SEHAT+ App (Mobile)',
    role: 'Mobile App Developer',
    year: '2023 (Jan - Nov)',
    desc: 'AI-powered HIV/AIDS awareness mobile app with integrated chatbot for personalized health advice. Built with Kotlin — won 1st Place National at PKP2 PTMA.',
    tags: ['Flutter', 'DART', 'AI Chatbot', 'Mobile', '🏆 1st Place National'],
    link: null,
    glow: '#6E548E', // Muted Deep Purple
    geometry: 'icosahedron',
    previewImage: sehatImg,
    noLinkText: 'Internal Enterprise System',
  },
  {
    number: '07',
    title: 'SEHAT+ Landing Page',
    role: 'Web Developer',
    year: '2023 (Jan - Nov)',
    desc: 'Build landing page website for SEHAT+ providing accessibility and information about the mobile ecosystem.',
    tags: ['HTML5', 'CSS', 'WEBSITE', '🏆 1st Place National'],
    link: null,
    glow: '#6E548E', // Deep Pastel Violet
    geometry: 'icosahedron',
    previewImage: sehatImg,
    noLinkText: 'Internal Enterprise System',
  },
  {
    number: '08',
    title: 'YUMMY Cafe and Resto',
    role: 'Web Developer',
    year: '2023 (Jan)',
    desc: 'Interactive restaurant website with integrated web-based booking system. Awarded Most Favorited Web Champion — recognized for UX quality and user engagement.',
    tags: ['HTML5', 'CSS', 'Booking System', '🏆 Most Favorited Web'],
    link: null,
    glow: '#6E5B9A', // Dusty Purple
    geometry: 'knot',
    previewImage: yumyImg,
    noLinkText: 'Internal Enterprise System',
  },
  {
    number: '09',
    title: '3Cycle — Recycling Redefined',
    role: 'Mobile App Developer',
    year: '2022 (Sept - Oct)',
    desc: 'Multiplatform waste management app built with Flutter — featuring real-time geospatial mapping and a gamified points system to encourage sustainable habits.',
    tags: ['Flutter', 'Dart', 'Google Maps API', 'Sustainability'],
    link: null,
    glow: '#42326E', // Dark Muted Purple (Paling Gelap)
    geometry: 'dodecahedron',
    previewImage: recycleImg,
    noLinkText: 'Proprietary Software',
  },
];

// ─── THREE.JS HOOK ────────────────────────────────────────────────────────────
const useThreeScene = (canvasRef, geometry, glow, isMobile) => {
  const rafRef = useRef()

  useEffect(() => {
    if (isMobile) return
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.z = 4.5

    scene.add(new THREE.AmbientLight('#ffffff', 0.04))
    const pLight = new THREE.PointLight(glow, 3, 14)
    pLight.position.set(2, 2, 2)
    scene.add(pLight)
    const rim = new THREE.PointLight('#c8b4ff', 1.5, 10)
    rim.position.set(-2, -1, 1)
    scene.add(rim)

    let geo
    if (geometry === 'box') geo = new THREE.BoxGeometry(1.5, 1.5, 1.5)
    else if (geometry === 'sphere') geo = new THREE.SphereGeometry(1.3, 32, 32)
    else if (geometry === 'torus') geo = new THREE.TorusGeometry(1.1, 0.38, 24, 60)
    else if (geometry === 'icosahedron') geo = new THREE.IcosahedronGeometry(1.35, 1)
    else if (geometry === 'octahedron') geo = new THREE.OctahedronGeometry(1.35, 0)
    else if (geometry === 'dodecahedron') geo = new THREE.DodecahedronGeometry(1.3, 0)
    else geo = new THREE.TorusKnotGeometry(0.9, 0.28, 128, 20)

    const wireMesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: new THREE.Color(glow).multiplyScalar(0.22),
      wireframe: true, transparent: true, opacity: 0.6,
    }))
    scene.add(wireMesh)

    const solidMesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({
      color: new THREE.Color('#0d0820'),
      emissive: new THREE.Color(glow).multiplyScalar(0.07),
      transparent: true, opacity: 0.75, shininess: 90,
    }))
    solidMesh.scale.setScalar(0.96)
    scene.add(solidMesh)

    const pN = 220
    const pPos = new Float32Array(pN * 3)
    for (let i = 0; i < pN; i++) {
      const r = 2.0 + Math.random() * 1.3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pPos[i * 3 + 2] = r * Math.cos(phi)
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: new THREE.Color(glow), size: 0.024, transparent: true, opacity: 0.5,
    })))

    const resize = () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', resize)

    let t = 0
    const loop = () => {
      t += 0.006
      wireMesh.rotation.y = t * 0.35
      wireMesh.rotation.x = t * 0.18
      solidMesh.rotation.y = t * 0.35
      solidMesh.rotation.x = t * 0.18
      wireMesh.position.y = Math.sin(t * 0.7) * 0.09
      solidMesh.position.y = Math.sin(t * 0.7) * 0.09
      renderer.render(scene, camera)
      rafRef.current = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      pGeo.dispose()
      geo.dispose()
    }
  }, [geometry, glow, isMobile])
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
const Card = React.forwardRef(({ project }, ref) => {
  const canvasRef = useRef(null)
  const isMobile = useIsMobile(900)
  useThreeScene(canvasRef, project.geometry, project.glow, isMobile)

  // Pisah state: satu untuk hover di title (fixed popup ikut mouse)
  const [titleHovered, setTitleHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX + 20, y: e.clientY - 80 })
  }

  return (
    <div ref={ref} className="pc-card">
      {!isMobile ? (
        <canvas ref={canvasRef} className="pc-canvas" />
      ) : (
        <div className="pc-mobile-fallback">
          <div className="pc-fallback-orb" style={{ '--glow': project.glow }} />
        </div>
      )}
      <div className="pc-glow" style={{ background: `radial-gradient(circle, ${project.glow}22 0%, transparent 68%)` }} />

      {/* Top bar */}
      <div className="pc-topbar">
        <span className="pc-idx">{project.number}</span>
        <div className="pc-topbar-line" />
        {project.isComingSoon && <span className="pc-badge">COMING SOON</span>}
        <span className="pc-yr">{project.year}</span>
      </div>

      {/* Body */}
      <div className="pc-body">
        <div className="pc-left">
          <div className="pc-bgnumber" style={{ color: `${project.glow}10` }}>{project.number}</div>
          <p className="pc-role">{project.role}</p>

          {/* Title dengan hover preview ikut kursor — hanya jika ADA gambar & tidak ada link */}
          <h2
            className="pc-title"
            onMouseEnter={() => project.previewImage && !project.link && setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
            onMouseMove={handleMouseMove}
            style={{ cursor: project.previewImage && !project.link ? 'crosshair' : 'default' }}
          >
            {project.title}

            {/* Fixed popup ikut mouse — hanya tampil di title hover */}
            {project.previewImage && titleHovered && (
              <div style={{
                position: 'fixed',
                left: mousePos.x,
                top: mousePos.y,
                width: '260px',
                borderRadius: '12px',
                overflow: 'hidden',
                zIndex: 9999,
                pointerEvents: 'none',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
                transition: 'opacity 0.2s ease',
              }}>
                <img src={project.previewImage} alt={project.title} style={{ width: '100%', display: 'block' }} />
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(7,5,15,0.95)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.08em',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                  {project.title} · Screenshot Preview
                </div>
              </div>
            )}
          </h2>

          <p className="pc-desc">{project.desc}</p>
          <div className="pc-tags">
            {project.tags.map((tag, t) => (
              <span key={t} className="pc-tag" style={{ '--ac': project.glow }}>{tag}</span>
            ))}
          </div>

          {/* ─── CTA AREA ─────────────────────────────────────────────── */}
          {project.isComingSoon ? (
            // Coming soon badge
            <div className="pc-no-link">
              Development in Progress
            </div>

          ) : project.link ? (
            // Ada live link — tombol View Live
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '10px',
                padding: '4px 12px',
                border: `1px solid ${project.glow}55`,
                borderRadius: '99px',
                color: project.glow,
                letterSpacing: '0.08em',
                textDecoration: 'none',
                display: 'inline-block',
                width: 'fit-content',
                transition: 'background 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = `${project.glow}15`}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              View Live
            </a>

          ) : (
            // Tidak ada link — tampilkan "Not publicly deployed" + tombol Preview jika ada gambar
            <div className="pc-preview-wrapper" style={{ position: 'relative', display: 'inline-block' }}>

              {/* Popup preview muncul di atas tombol */}
              {project.previewImage && (
                <div className="pc-preview-popup"
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 12px)',
                    left: '0',
                    width: '280px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    zIndex: 9999,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)',
                  }}
                >
                  <img
                    src={project.previewImage}
                    alt={project.title}
                    style={{ width: '100%', display: 'block' }}
                  />
                  <div style={{
                    padding: '8px 12px',
                    background: 'rgba(7,5,15,0.95)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.08em',
                    fontFamily: 'DM Sans, sans-serif',
                  }}>
                    {project.title} · Screenshot Preview
                  </div>
                </div>
              )}

              {/* Row: teks + tombol Preview */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <span className="pc-no-link">{project.noLinkText || 'Internal Enterprise System'}</span>

                {/* Tombol Preview — hanya muncul kalau ada gambar */}
                {project.previewImage && (
                  <span
                    className="pc-preview-hover-target"
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '10px',
                      padding: '4px 12px',
                      border: `1px solid ${project.glow}55`,
                      borderRadius: '99px',
                      color: project.glow,
                      cursor: 'pointer',
                      letterSpacing: '0.08em',
                      transition: 'background 0.2s ease, border-color 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = `${project.glow}15`}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    Preview ↗
                  </span>
                )}
              </div>
            </div>
          )}
          {/* ─── END CTA AREA ─────────────────────────────────────────── */}
        </div>
      </div>

      <div className="pc-bottom-rule" style={{ background: `linear-gradient(90deg,transparent,${project.glow}28,transparent)` }} />
    </div>
  )
})

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const Projects = () => {
  const isMobile = useIsMobile(900)
  const [activePreviewMobile, setActivePreviewMobile] = useState(null)
  const wrapperRef = useRef(null)
  const stickyRef = useRef(null)
  const headerRef = useRef(null)
  const progressFillRef = useRef(null)
  const counterRef = useRef(null)
  const cardRefs = useRef([])
  const dotRefs = useRef([])

  useLayoutEffect(() => {
    if (isMobile) return

    let ctx = gsap.context(() => {
      const cards = cardRefs.current
      const dots = dotRefs.current
      const total = cards.length

      cards.forEach((card, i) => {
        gsap.set(card, {
          position: 'absolute', inset: 0,
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 60,
          scale: i === 0 ? 1 : 0.96,
          zIndex: i === 0 ? total : total - i,
          pointerEvents: i === 0 ? 'auto' : 'none',
        })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: `+=${total * 100}vh`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress
            const idx = Math.min(Math.floor(progress * total), total - 1)

            if (counterRef.current) counterRef.current.innerText = `0${idx + 1}`
            if (progressFillRef.current) progressFillRef.current.style.width = `${progress * 100}%`

            dots.forEach((dot, di) => {
              if (di === idx) dot.classList.add('active')
              else dot.classList.remove('active')
            })
          },
        },
      })

      cards.forEach((card, i) => {
        if (i === total - 1) return
        const next = cards[i + 1]

        tl.to(card, {
          opacity: 0,
          y: -100,
          scale: 0.94,
          rotateX: 12,
          filter: 'blur(10px)',
          pointerEvents: 'none',
          duration: 1,
        }, i)

        tl.fromTo(next,
          { opacity: 0, y: 100, scale: 0.92, filter: 'blur(15px)' },
          { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', pointerEvents: 'auto', duration: 1 },
          i
        )
      })
    }, wrapperRef)

    return () => ctx.revert()
  }, [isMobile])

  // ─── MOBILE RENDER (STACKED CARDS) ──────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="w-full bg-[#07050f] py-20 px-6 overflow-hidden">
        <div className="mb-12">
          <p className="font-['DM_Sans'] text-[10px] tracking-[0.3em] uppercase text-[#e8c8ff]/80 mb-3">✦ Selected Works</p>
          <h2 className="font-['Clash_Display'] text-[38px] font-bold text-white tracking-tight leading-[1.1]">
            Featured <br /><span className="bg-gradient-to-br from-[#e8c8ff] to-[#f9b8d4] bg-clip-text text-transparent">Projects</span>
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {projects.map((project, i) => {
            // Ringkas deskripsi: ambil 1-2 kalimat pertama
            const sentences = project.desc.split('.')
            const shortDesc = (sentences[0] + (sentences.length > 1 ? '.' : '')).trim()

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 overflow-hidden flex flex-col"
              >
                {/* Background Glow */}
                <div
                  className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full blur-[45px] opacity-20 pointer-events-none"
                  style={{ background: project.glow }}
                />

                {/* Header (Role, Title, Number) */}
                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div className="flex flex-col pr-4">
                    <span className="font-['DM_Sans'] text-[9px] uppercase tracking-[0.2em] text-white/50 mb-1.5">{project.role}</span>
                    <h3 className="font-['Clash_Display'] text-2xl font-bold text-white leading-[1.2] tracking-[-0.01em]">{project.title}</h3>
                  </div>
                  <span className="font-['Clash_Display'] text-sm font-semibold text-white/30 pt-1">{project.number}</span>
                </div>

                {/* Short Desc */}
                <p className="font-['Cormorant_Garamond'] italic text-[15px] text-white/70 leading-relaxed mb-6 relative z-10">
                  {shortDesc}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-7 relative z-10">
                  {project.tags.map((tag, t) => (
                    <span
                      key={t}
                      className="font-['DM_Sans'] text-[9px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="mt-auto relative z-10 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="font-['DM_Sans'] text-[10px] tracking-wider text-white/30">{project.year.split(' ')[0]}</span>

                  {project.isComingSoon ? (
                    <span className="font-['DM_Sans'] text-[10px] italic text-[#f9b8d4]/60 tracking-wider">In Development</span>
                  ) : project.link ? (
                    <a href={project.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center font-['DM_Sans'] text-[10px] font-medium tracking-[0.1em] uppercase px-5 py-2.5 rounded-full border border-[#e8c8ff]/30 text-[#e8c8ff] hover:bg-[#e8c8ff]/10 transition-colors">
                      View Live ↗
                    </a>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="font-['DM_Sans'] text-[10px] italic text-white/30 tracking-wider">
                        {project.noLinkText || 'Internal Enterprise System'}
                      </span>
                      {project.previewImage && (
                        <div className="relative">
                          <button
                            onClick={() => setActivePreviewMobile(activePreviewMobile === i ? null : i)}
                            className="inline-flex items-center font-['DM_Sans'] text-[9px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border border-white/20 text-white/70 active:bg-white/10 transition-colors"
                          >
                            Preview ↗
                          </button>

                          {/* Popup Preview */}
                          <div
                            className="absolute bottom-[calc(100%+12px)] right-0 w-[220px] rounded-xl overflow-hidden shadow-2xl pointer-events-none transition-all duration-300 origin-bottom-right"
                            style={{
                              opacity: activePreviewMobile === i ? 1 : 0,
                              transform: activePreviewMobile === i ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
                              zIndex: 50,
                              border: '1px solid rgba(255,255,255,0.08)'
                            }}
                          >
                            <img src={project.previewImage} alt={project.title} className="w-full block" />
                            <div className="p-2 bg-[#07050f]/95 backdrop-blur-md text-[9px] text-white/40 tracking-wider font-['DM_Sans'] border-t border-white/10">
                              {project.title}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  // ─── DESKTOP RENDER (3D STACKED) ──────────────────────────────────────────
  return (
    <div ref={wrapperRef} className="projects-wrapper">
      <div ref={stickyRef} className="projects-sticky">

        {/* Header Section */}
        <div ref={headerRef} className="projects-header">
          <div className="ph-left">
            <p className="ph-eyebrow" style={{ color: 'rgba(232,200,255,0.8)' }}>✦ Selected Works</p>
            <h2 className="ph-title">Featured <span className="gradient-text">Projects</span></h2>
          </div>
          <div className="ph-right">
            <div className="ph-counter">
              <span ref={counterRef} className="ph-current">01</span>
              <span className="ph-sep">/</span>
              <span className="ph-total">0{projects.length}</span>
            </div>
            <div className="ph-progress-bg">
              <div ref={progressFillRef} className="ph-progress-fill" />
            </div>
          </div>
        </div>

        {/* Cards Container */}
        <div className="cards-container">
          {projects.map((project, i) => (
            <Card
              key={i}
              project={project}
              ref={el => cardRefs.current[i] = el}
            />
          ))}
        </div>

        {/* Side Pagination */}
        <div className="projects-nav">
          {projects.map((_, i) => (
            <div
              key={i}
              ref={el => dotRefs.current[i] = el}
              className={`nav-dot ${i === 0 ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .projects-wrapper { position: relative; width: 100%; height: auto; background: #07050f; }
        .projects-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
        
        .projects-header { display: flex; justify-content: space-between; align-items: flex-end; padding: clamp(3vh, 6vh, 8vh) clamp(4vw, 6vw, 8vw) clamp(2vh, 4vh, 5vh); z-index: 50; }
        .ph-eyebrow { font-family: 'DM Sans', sans-serif; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(232,200,255,0.4); margin-bottom: 0.5rem; }
        .ph-title { font-family: 'Clash Display', sans-serif; font-size: clamp(24px, 4.5vw, 60px); font-weight: 700; color: #fff; margin: 0; letter-spacing: -0.02em; line-height: 1; }
        .gradient-text { background: linear-gradient(135deg, #e8c8ff 0%, #f9b8d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .ph-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.8rem; }
        .ph-counter { font-family: 'Clash Display', sans-serif; font-size: 24px; font-weight: 600; color: #fff; }
        .ph-sep { color: rgba(255,255,255,0.2); margin: 0 0.4rem; }
        .ph-total { color: rgba(255,255,255,0.3); font-size: 16px; }
        .ph-progress-bg { width: 140px; height: 2px; background: rgba(255,255,255,0.06); position: relative; overflow: hidden; border-radius: 99px; }
        .ph-progress-fill { position: absolute; left: 0; top: 0; height: 100%; width: 0%; background: linear-gradient(90deg, #e8c8ff, #f9b8d4); transition: width 0.2s ease-out; }

        .cards-container { position: relative; flex: 1; margin: 0 clamp(3vw, 6vw, 8vw) clamp(3vh, 6vh, 8vh); perspective: 1500px; }
        
        .pc-card { width: 100%; height: 100%; background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: clamp(1.2rem, 2.5rem, 3rem); display: flex; flex-direction: column; backdrop-filter: blur(12px); transform-style: preserve-3d; }
        .pc-canvas { position: absolute; right: -5%; top: 50%; transform: translateY(-50%); width: 50%; height: 80%; z-index: 1; pointer-events: none; }
        .pc-glow { position: absolute; right: -10%; top: 50%; transform: translateY(-50%); width: 60%; height: 100%; z-index: 0; pointer-events: none; border-radius: 50%; }

        .pc-topbar { display: flex; align-items: center; gap: 1.2rem; margin-bottom: 2rem; z-index: 2; }
        .pc-idx { font-family: 'Clash Display', sans-serif; font-size: 14px; color: #fff; opacity: 0.5; }
        .pc-topbar-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
        .pc-badge { font-family: 'DM Sans', sans-serif; font-size: 8px; letter-spacing: 0.2em; color: #f9b8d4; border: 1px solid rgba(249,184,212,0.3); padding: 3px 8px; border-radius: 4px; background: rgba(249,184,212,0.05); }
        .pc-yr { font-family: 'DM Sans', sans-serif; font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 0.05em; }

        .pc-body { flex: 1; display: flex; flex-direction: column; z-index: 2; position: relative; }
        .pc-left { display: flex; flex-direction: column; position: relative; }
        .pc-bgnumber { position: absolute; left: -1rem; top: -1.5rem; font-family: 'Clash Display', sans-serif; font-size: clamp(80px, 14vw, 180px); font-weight: 700; opacity: 0.1; line-height: 1; z-index: -1; pointer-events: none; }
        .pc-role { font-family: 'DM Sans', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; color: rgba(255,255,255,0.6); margin-bottom: 0.8rem; }
        .pc-title { font-family: 'Clash Display', sans-serif; font-size: clamp(20px, 3.5vw, 44px); font-weight: 700; color: #fff; margin: 0 0 1.2rem; letter-spacing: -0.01em; }
        .pc-desc { font-family: 'Cormorant Garamond', serif; font-size: clamp(20px, 2vw, 20px); font-weight: 500; line-height: 1.35; color: rgba(255,255,255,0.6); margin-bottom: 1rem; max-width: min(664px, 100%); font-style: italic; }
        .pc-tags { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 2.5rem; }
        .pc-tag { font-family: 'DM Sans', sans-serif; font-size: 10px; padding: 6px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 99px; color: rgba(255,255,255,0.5); transition: all 0.3s; }
        .pc-tag:hover { color: var(--ac); border-color: var(--ac); background: rgba(255,255,255,0.06); }

        .pc-link { display: inline-flex; align-items: center; gap: 0.8rem; text-decoration: none; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 10px 24px; border: 1px solid rgba(255,255,255,0.15); border-radius: 99px; transition: all 0.3s; width: fit-content; }
        .pc-link:hover { background: var(--ac); border-color: var(--ac); color: #000; }
        .pc-no-link { font-family: 'DM Sans', sans-serif; font-size: 11px; color: rgba(255,255,255,0.25); letter-spacing: 0.05em; font-style: italic; }
        
        .pc-preview-popup { opacity: 0; transform: translateY(10px); transition: opacity 0.25s ease, transform 0.25s ease; pointer-events: none; }
        .pc-preview-wrapper:hover .pc-preview-popup { opacity: 1; transform: translateY(0); }

        .pc-bottom-rule { position: absolute; bottom: 0; left: 10%; right: 10%; height: 1px; opacity: 0.5; }

        .projects-nav { position: absolute; right: 2.5vw; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 1.5rem; z-index: 100; }
        .nav-dot { width: 4px; height: 4px; background: rgba(255,255,255,0.15); border-radius: 50%; transition: all 0.4s ease; cursor: pointer; }
        .nav-dot.active { height: 24px; background: #e8c8ff; border-radius: 4px; box-shadow: 0 0 10px #e8c8ff; }

        @media (max-width: 900px) {
          .pc-canvas { width: 70%; right: -15%; }
          .ph-right { display: none; }
          .pc-mobile-fallback { position: absolute; right: -5%; top: 50%; transform: translateY(-50%); width: 50%; height: 80%; z-index: 1; display: flex; align-items: center; justify-content: center; pointer-events: none; }
          .pc-fallback-orb { width: 120px; height: 120px; border-radius: 50%; background: var(--glow); filter: blur(40px); opacity: 0.15; animation: pulse 4s ease-in-out infinite; }
          @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.15; } 50% { transform: scale(1.2); opacity: 0.25; } }
          
          /* Hide side nav earlier to prevent overlapping text on tablet */
          .projects-nav { display: none; }
        }

        @media (max-width: 768px) {
          .projects-header { padding: clamp(2vh, 4vh, 6vh) 1.5rem clamp(1.5vh, 3vh, 4vh); }
          .ph-title { font-size: clamp(28px, 6vw, 40px); }
          .cards-container { margin: 0 1.5rem 2rem; }
          .pc-card { padding: 1.25rem; border-radius: 16px; }
          .pc-topbar { margin-bottom: 1rem; gap: 0.8rem; }
          .pc-title { font-size: 22px; margin-bottom: 0.8rem; }
          .pc-desc { font-size: 13px; line-height: 1.45; font-weight: 1000; margin-bottom: 1.25rem; }
          .pc-tags { margin-bottom: 1.5rem; gap: 0.4rem; flex-wrap: wrap; }
          .pc-tag { font-size: 10px; padding: 4px 10px; }
          .pc-bgnumber { top: -0.5rem; left: -0.5rem; font-size: 80px; }
        }

        @media (min-width: 1920px) {
          .cards-container { max-width: 1600px; margin-left: auto; margin-right: auto; }
        }
      `}</style>

    </div>
  )
}

export default Projects
