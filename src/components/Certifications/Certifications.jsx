import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'

const achievements = [
  { id: 'a0', name: 'Best Mentor — UI/UX & Front-End', org: 'Educativa.id', year: '2026', x: 15, y: 18 },
  { id: 'a1', name: 'Most Growth Mindset', org: 'Educativa.id', year: '2026', x: 30, y: 12 },
  { id: 'a2', name: '1st Place National — PKP2 PTMA (SEHAT+ App)', org: 'PKM Karsa Cipta', year: '2023', x: 50, y: 16 },
  { id: 'a3', name: '1st Place National — PKP2 PTMA (SEHAT Website)', org: 'PKM Karsa Cipta', year: '2023', x: 68, y: 11 },
  { id: 'a4', name: 'Most Favorited Web Champion — YUMMY', org: 'Web Competition', year: '2023', x: 82, y: 18 },
  { id: 'a5', name: 'Bangkit Academy Graduate', org: 'Google, GoTo & Traveloka', year: '2024', x: 45, y: 8 },
]

const achievementConnections = [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [5, 2], [0, 5]]

const courses = [
  { id: 0, name: 'Belajar Dasar Pemrograman Web', level: 'Dasar', hours: 45, category: 'frontend', link: 'https://www.dicoding.com/academies/123', x: 12, y: 45 },
  { id: 1, name: 'Belajar Membuat Front-End Web untuk Pemula', level: 'Pemula', hours: 45, category: 'frontend', link: 'https://www.dicoding.com/academies/315', x: 22, y: 38 },
  { id: 2, name: 'Belajar Dasar Pemrograman JavaScript', level: 'Dasar', hours: 46, category: 'frontend', link: 'https://www.dicoding.com/academies/256', x: 32, y: 45 },
  { id: 3, name: 'Belajar Back-End Pemula dengan JavaScript', level: 'Pemula', hours: 50, category: 'frontend', link: 'https://www.dicoding.com/academies/261', x: 42, y: 38 },
  { id: 4, name: 'Belajar Prinsip Pemrograman SOLID', level: 'Menengah', hours: 15, category: 'frontend', link: 'https://www.dicoding.com/academies/169', x: 52, y: 44 },
  { id: 5, name: 'Memulai Pemrograman dengan Kotlin', level: 'Dasar', hours: 50, category: 'mobile', link: 'https://www.dicoding.com/academies/80', x: 14, y: 62 },
  { id: 6, name: 'Belajar Membuat Aplikasi Android untuk Pemula', level: 'Pemula', hours: 60, category: 'mobile', link: 'https://www.dicoding.com/academies/51', x: 24, y: 70 },
  { id: 7, name: 'Belajar Fundamental Aplikasi Android', level: 'Menengah', hours: 140, category: 'mobile', link: 'https://www.dicoding.com/academies/14', x: 35, y: 62 },
  { id: 8, name: 'Belajar Pengembangan Aplikasi Android Intermediate', level: 'Mahir', hours: 150, category: 'mobile', link: 'https://www.dicoding.com/academies/352', x: 46, y: 70 },
  { id: 9, name: 'Menjadi Android Developer Expert', level: 'Profesional', hours: 90, category: 'mobile', link: 'https://www.dicoding.com/academies/165', x: 57, y: 62 },
  { id: 10, name: 'Belajar Dasar AI', level: 'Dasar', hours: 10, category: 'ai', link: 'https://www.dicoding.com/academies/653', x: 62, y: 50 },
  { id: 11, name: 'Belajar Penerapan Machine Learning untuk Android', level: 'Mahir', hours: 60, category: 'ai', link: 'https://www.dicoding.com/academies/663', x: 70, y: 58 },
  { id: 12, name: 'Belajar Dasar Google Cloud', level: 'Dasar', hours: 12, category: 'ai', link: 'https://www.dicoding.com/academies/337', x: 78, y: 48 },
  { id: 13, name: 'Belajar Dasar Cloud dan Gen AI di AWS', level: 'Dasar', hours: 18, category: 'ai', link: 'https://www.dicoding.com/academies/251', x: 86, y: 58 },
  { id: 14, name: 'Belajar Dasar Visualisasi Data', level: 'Dasar', hours: 16, category: 'data', link: 'https://www.dicoding.com/academies/177', x: 62, y: 38 },
  { id: 15, name: 'Belajar Dasar Data Science', level: 'Dasar', hours: 11, category: 'data', link: 'https://www.dicoding.com/academies/615', x: 72, y: 34 },
  { id: 16, name: 'Belajar Dasar Structured Query Language (SQL)', level: 'Dasar', hours: 11, category: 'data', link: 'https://www.dicoding.com/academies/600', x: 82, y: 40 },
  { id: 17, name: 'Memulai Pemrograman dengan Python', level: 'Dasar', hours: 60, category: 'data', link: 'https://www.dicoding.com/academies/86', x: 75, y: 70 },
  { id: 18, name: 'Belajar Pemrograman Prosedural dengan Python', level: 'Pemula', hours: 33, category: 'data', link: 'https://www.dicoding.com/academies/620', x: 85, y: 76 },
  { id: 19, name: 'Pengenalan ke Logika Pemrograman', level: 'Dasar', hours: 6, category: 'foundation', link: 'https://www.dicoding.com/academies/302', x: 6, y: 52 },
  { id: 20, name: 'Memulai Dasar Pemrograman untuk Pengembang Software', level: 'Dasar', hours: 9, category: 'foundation', link: 'https://www.dicoding.com/academies/237', x: 6, y: 68 },
  { id: 21, name: 'Belajar Dasar Git dengan GitHub', level: 'Dasar', hours: 15, category: 'foundation', link: 'https://www.dicoding.com/academies/317', x: 92, y: 44 },
  { id: 22, name: 'Belajar Dasar Manajemen Proyek', level: 'Dasar', hours: 11, category: 'foundation', link: 'https://www.dicoding.com/academies/570', x: 92, y: 68 },
  { id: 23, name: 'Belajar Strategi Pengembangan Diri', level: 'Dasar', hours: 12, category: 'foundation', link: 'https://www.dicoding.com/academies/697', x: 48, y: 56 },
]

const constellations = {
  frontend: { label: 'Frontend', color: '#e8c8ff', connections: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 2]] },
  mobile: { label: 'Mobile', color: '#f9b8d4', connections: [[5, 6], [6, 7], [7, 8], [8, 9], [5, 7]] },
  ai: { label: 'AI & Cloud', color: '#b8f5e8', connections: [[10, 11], [11, 12], [12, 13], [10, 12]] },
  data: { label: 'Data & Python', color: '#ffd6a5', connections: [[14, 15], [15, 16], [17, 18], [14, 16]] },
  foundation: { label: 'Foundation', color: '#c8b4ff', connections: [[19, 20], [21, 22]] },
}

const levelSize = { 'Dasar': 6, 'Pemula': 7, 'Menengah': 9, 'Mahir': 11, 'Profesional': 14 }
const levelColor = { 'Dasar': '#c8b4ff', 'Pemula': '#e8c8ff', 'Menengah': '#f9b8d4', 'Mahir': '#ffd6a5', 'Profesional': '#b8f5b0' }

export default function Certifications() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const starsRef = useRef([])
  const achiefsRef = useRef([])
  const [hovered, setHovered] = useState(null)
  const [hoveredAchiev, setHoveredAchiev] = useState(null)
  const [visible, setVisible] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // ─── Entrance animation ──────────────────────────────────────────────────────
  const triggerEntrance = useCallback(() => {
    setVisible(true)
    const allEls = [...achiefsRef.current, ...starsRef.current].filter(Boolean)
    allEls.forEach((el, i) => {
      gsap.fromTo(
        el,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)', delay: i * 0.025 }
      )
    })
  }, [])

  useEffect(() => {
    let triggered = false

    const run = () => {
      if (triggered) return
      triggered = true
      triggerEntrance()
    }

    // IntersectionObserver — fire as soon as even 5% is visible
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) run() },
      { threshold: 0.05 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)

    // Fallback: if section is already fully visible on mount (localhost / no scroll)
    const fallback = setTimeout(run, 600)

    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [triggerEntrance])

  // ─── Canvas (background stars + constellation lines) ─────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const bgStars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 0.7 + 0.1,
      alpha: Math.random() * 0.3 + 0.05,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.002,
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background twinkling stars
      bgStars.forEach(s => {
        s.twinkle += s.speed
        const a = s.alpha * (0.5 + 0.5 * Math.sin(s.twinkle))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232,200,255,${a})`
        ctx.fill()
      })



      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [activeFilter])

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      className="lg:min-h-screen pb-12 lg:pb-0"
      style={{
        position: 'relative',
        background: '#07040f',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Header ── */}
      <div style={{ padding: 'clamp(4vh,8vh,10vh) clamp(4vw,8vw,10vw) 0', position: 'relative', zIndex: 50 }}>
        <p style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: 10, letterSpacing: '0.35em',
          textTransform: 'uppercase', color: 'rgba(232,200,255,0.8)', margin: '0 0 0.5rem',
        }}>✦ Achievements & Certifications</p>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{
            fontFamily: 'Clash Display, sans-serif',
            fontSize: 'clamp(28px, 4.5vw, 58px)',
            fontWeight: 700, color: '#fff', margin: 0,
            letterSpacing: '-0.02em', lineHeight: 0.95,
          }}>
            Constellation of
            <span style={{
              display: 'block',
              background: 'linear-gradient(120deg, #e8c8ff 0%, #f9b8d4 50%, #c8b4ff 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Knowledge & Glory
            </span>
          </h2>

          {/* Filter buttons (Desktop) */}
          <div className="hidden lg:flex flex-wrap gap-[0.4rem] max-w-full">
            {[
              { key: 'all', label: 'All' },
              { key: 'achievements', label: '🏆 Awards', color: 'rgba(255,255,255,0.7)' },
              ...Object.entries(constellations).map(([k, v]) => ({ key: k, label: v.label, color: v.color })),
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: 10,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: activeFilter === f.key ? (f.color || '#fff') : 'rgba(255,255,255,0.28)',
                  background: activeFilter === f.key ? (f.color ? f.color + '15' : 'rgba(255,255,255,0.06)') : 'transparent',
                  border: '1px solid ' + (activeFilter === f.key ? (f.color || 'rgba(255,255,255,0.3)') + '50' : 'rgba(255,255,255,0.07)'),
                  borderRadius: 999, padding: '5px 12px', cursor: 'pointer', transition: 'all 0.3s',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Custom Dropdown (Mobile) */}
          <div className="block lg:hidden w-full mt-4 relative z-50">
            <div className="relative w-full max-w-[240px]">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-all active:scale-[0.98]"
              >
                <span className="font-['DM_Sans'] text-[11px] font-medium tracking-[0.15em] uppercase text-white flex items-center gap-2">
                  {activeFilter === 'all' && 'All Categories'}
                  {activeFilter === 'achievements' && '🏆 Awards'}
                  {activeFilter !== 'all' && activeFilter !== 'achievements' && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: constellations[activeFilter]?.color, boxShadow: `0 0 5px ${constellations[activeFilter]?.color}` }} />
                      {constellations[activeFilter]?.label}
                    </>
                  )}
                </span>
                <svg className={`w-4 h-4 text-white/50 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-[calc(100%+8px)] left-0 w-full p-2 rounded-xl border border-white/10 bg-[#120e23]/95 backdrop-blur-xl transition-all duration-300 origin-top shadow-2xl ${isDropdownOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'
                  }`}
              >
                {[
                  { key: 'all', label: 'All Categories', color: '#fff' },
                  { key: 'achievements', label: '🏆 Awards', color: '#fff' },
                  ...Object.entries(constellations).map(([k, v]) => ({ key: k, label: v.label, color: v.color }))
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setActiveFilter(opt.key);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-3 rounded-lg transition-all text-left font-['DM_Sans'] text-[10px] tracking-wider uppercase mb-1 last:mb-0 ${activeFilter === opt.key ? 'bg-white/10 text-white font-semibold' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <span style={{ color: activeFilter === opt.key ? opt.color : 'inherit', flex: 1 }}>{opt.label}</span>
                    {activeFilter === opt.key && (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: opt.color }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Zone legend dots */}
        <div className="hidden lg:flex" style={{ gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', boxShadow: '0 0 8px rgba(255,255,255,0.5)' }} />
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Achievements</span>
          </div>
          {Object.entries(constellations).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: v.color, boxShadow: `0 0 5px ${v.color}` }} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>{v.label}</span>
            </div>
          ))}
        </div>

        <p className="hidden lg:block" style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 'clamp(12px, 1.3vw, 15px)', color: 'rgba(255,255,255,0.5)', margin: '0.5rem 0 0' }}>
          ✦ white stars = awards · colored stars = certifications · hover to explore · click to open
        </p>
      </div>

      {/* ── Canvas (Desktop Only) ── */}
      <canvas
        ref={canvasRef}
        className="hidden lg:block"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
      />

      {/* ── Mobile List Container (Tablet & Below) ── */}
      <div className="block lg:hidden relative z-10 px-[5vw] py-[2vh] w-full max-w-3xl mx-auto mb-8">
        <div className="grid grid-cols-2 gap-3">
          {/* Mobile Achievements */}
          {achievements
            .filter(ach => activeFilter === 'all' || activeFilter === 'achievements')
            .map(ach => (
              <div key={ach.id} className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-col gap-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 blur-[20px] rounded-full pointer-events-none" />
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: '0 0 4px' }}>🏆 Achievement</p>
                <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: '#fff', margin: '0 0 2px', lineHeight: 1.4 }}>{ach.name}</h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{ach.org} · {ach.year}</p>
              </div>
            ))}

          {/* Mobile Courses */}
          {courses
            .filter(c => activeFilter === 'all' || activeFilter === c.category)
            .map(course => {
              const cat = constellations[course.category]
              return (
                <a
                  key={course.id}
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl border bg-[#0a0815] backdrop-blur-md flex flex-col relative overflow-hidden transition-all active:scale-[0.98]"
                  style={{ borderColor: `${cat.color}30` }}
                >
                  <div className="absolute -top-4 -right-4 w-20 h-20 blur-[24px] rounded-full pointer-events-none" style={{ background: `${cat.color}20` }} />
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: cat.color, opacity: 0.8, margin: '0 0 6px' }}>{cat.label}</p>
                  <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, color: '#fff', margin: '0 0 10px', lineHeight: 1.4 }}>{course.name}</h3>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{
                      fontFamily: 'DM Sans, sans-serif', fontSize: 9,
                      color: levelColor[course.level],
                      background: levelColor[course.level] + '15',
                      border: '1px solid ' + levelColor[course.level] + '30',
                      borderRadius: 999, padding: '2px 8px',
                    }}>{course.level}</span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{course.hours} jam</span>
                  </div>
                </a>
              )
            })}
        </div>
      </div>

      {/* ── Stars container (Desktop Only) ── */}
      <div className="hidden lg:block relative flex-1 min-h-[70vh] z-5">

        {/* ACHIEVEMENT STARS — top zone */}
        {achievements.map((ach, i) => {
          const isFiltered = activeFilter !== 'all' && activeFilter !== 'achievements'
          const isHov = hoveredAchiev === ach.id
          return (
            <div
              key={ach.id}
              ref={el => { achiefsRef.current[i] = el }}
              onMouseEnter={() => { if (!isFiltered) setHoveredAchiev(ach.id) }}
              onMouseLeave={() => setHoveredAchiev(null)}
              style={{
                position: 'absolute',
                left: `${ach.x}%`, top: `${ach.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'default',
                // FIX: opacity driven by visible state, not hardcoded 0
                opacity: isFiltered ? 0.05 : (visible ? 1 : 0),
                transition: 'opacity 0.4s',
                zIndex: isHov ? 20 : 5,
              }}
            >
              {/* Gold pulse glow */}
              {isHov && (
                <div style={{
                  position: 'absolute', inset: -24, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                  pointerEvents: 'none', animation: 'starPulse 1.5s ease-in-out infinite',
                }} />
              )}

              {/* Diamond star shape */}
              <div style={{
                width: isHov ? 18 : 14,
                height: isHov ? 18 : 14,
                background: isHov ? '#ffffff' : 'rgba(255,255,255,0.85)',
                borderRadius: '2px',
                transform: `rotate(${isHov ? 15 : 45}deg)`,
                boxShadow: isHov
                  ? '0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.2)'
                  : '0 0 8px rgba(255,255,255,0.4)',
                transition: 'all 0.3s ease',
              }} />

              {/* Tooltip */}
              {isHov && (
                <div style={{
                  position: 'absolute', bottom: '130%', left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(10,8,15,0.96)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 12, padding: '12px 16px', width: 'min(220px, calc(100vw - 2rem))',
                  backdropFilter: 'blur(16px)', pointerEvents: 'none', zIndex: 30,
                }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: '0 0 5px' }}>🏆 Achievement</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: '#fff', margin: '0 0 5px', lineHeight: 1.4 }}>{ach.name}</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{ach.org} · {ach.year}</p>
                </div>
              )}
            </div>
          )
        })}

        {/* COURSE STARS — bottom zone */}
        {courses.map((course, i) => {
          const cat = constellations[course.category]
          const isFiltered = activeFilter !== 'all' && activeFilter !== course.category
          const isHov = hovered === course.id
          const size = levelSize[course.level]
          return (
            <div
              key={course.id}
              ref={el => { starsRef.current[i] = el }}
              onClick={() => { if (!isFiltered) window.open(course.link, '_blank') }}
              onMouseEnter={() => { if (!isFiltered) setHovered(course.id) }}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'absolute',
                left: `${course.x}%`, top: `${course.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: isFiltered ? 'default' : 'pointer',
                // FIX: opacity driven by visible state, not hardcoded 0
                opacity: isFiltered ? 0.06 : (visible ? 1 : 0),
                transition: 'opacity 0.4s',
                zIndex: isHov ? 20 : 5,
              }}
            >
              {isHov && (
                <div style={{
                  position: 'absolute', inset: -16, borderRadius: '50%',
                  background: `radial-gradient(circle, ${cat.color}35 0%, transparent 70%)`,
                  pointerEvents: 'none', animation: 'starPulse 1.5s ease-in-out infinite',
                }} />
              )}

              <div style={{
                width: size,
                height: size,
                borderRadius: '50%',
                background: isHov ? cat.color : cat.color + '90',
                boxShadow: isHov
                  ? `0 0 ${size * 3}px ${cat.color}, 0 0 ${size * 5}px ${cat.color}40`
                  : `0 0 ${size}px ${cat.color}50`,
                transition: 'all 0.3s ease',
                transform: isHov ? 'scale(1.7)' : 'scale(1)',
              }} />

              {isHov && (
                <div style={{
                  position: 'absolute', bottom: '130%', left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(10,8,15,0.96)', border: `1px solid ${cat.color}25`,
                  borderRadius: 12, padding: '10px 14px', width: 'min(210px, calc(100vw - 2rem))',
                  backdropFilter: 'blur(16px)', pointerEvents: 'none', zIndex: 30,
                }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: cat.color, opacity: 0.6, margin: '0 0 4px' }}>{cat.label}</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500, color: '#fff', margin: '0 0 6px', lineHeight: 1.4 }}>{course.name}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{
                      fontFamily: 'DM Sans, sans-serif', fontSize: 9,
                      color: levelColor[course.level],
                      background: levelColor[course.level] + '15',
                      border: '1px solid ' + levelColor[course.level] + '30',
                      borderRadius: 999, padding: '2px 8px',
                    }}>{course.level}</span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>{course.hours} jam</span>
                  </div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: cat.color, opacity: 0.5, margin: 0, letterSpacing: '0.1em' }}>click to open course ↗</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Bottom legend ── */}
      <div className="hidden lg:flex" style={{
        padding: 'clamp(1vh,2vh,3vh) clamp(4vw,8vw,10vw) clamp(3vh,6vh,8vh)', position: 'relative', zIndex: 10,
        alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase', marginRight: 4 }}>Level:</span>
          {Object.entries(levelColor).map(([level, color]) => (
            <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: levelSize[level], height: levelSize[level], borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{level}</span>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
          Dicoding Indonesia · 24 Certified Courses
        </p>
      </div>

      <style>{`
        @keyframes starPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.12); }
        }
      `}</style>
    </section>
  )
}