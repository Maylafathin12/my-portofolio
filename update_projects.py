import re

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # We need to insert the new project before mypitlane
    # mypitlane starts with:
    #   {
    #     id: 'mypitlane',
    
    new_project_en = """  {
    id: 'nexus-hr',
    number: '02',
    title: 'Nexus HR',
    role: 'Solo Front-End Engineer & UI/UX Designer',
    year: 'May - June 2026',
    desc: 'The Spreadsheet-Powered ATS Dashboard. Centralize your hiring pipeline, run structured live interviews, and bridge the gap between HR operations and CEO decisions.',
    tags: ['React.js', 'Tailwind CSS', 'LocalStorage State', 'Google Workspace'],
    link: null,
    isComingSoon: false,
    glow: '#8B5CF6',
    geometry: 'headphones',
    previewImage: null,
    studyCase: "Recruitment in fast-growing teams is usually powered by a messy ecosystem. When it’s time to make a hiring decision, HR and the CEO end up opening 10 tabs per candidate (CV, portfolio, question sheets, and separate feedback docs). Nexus HR was built to solve this exact pain point. By designing the front-end to easily treat Google Sheets as a lightweight data ingestion layer, the application centralizes everything into a beautiful dashboard where raw form data becomes actionable, structured talent profiles.",
    challenges: "The Challenge: Interviews require deep context. Recruiters usually require multiple monitors or constant tab-switching to look at a candidate's CV while simultaneously tracking interview rubrics and typing evaluation notes. Forcing this onto a single screen usually results in an incredibly cluttered, stressful UI.\\n\\nThe Solution: I engineered a strict Split-Screen Interview Interface. The left viewport is a dedicated, distraction-free CV/Portfolio Preview Area. The right viewport guides the interviewer through a structured, 5-step accordion flow (Snapshot ➔ Questions ➔ Ratings ➔ Summary ➔ Final Recommendation). To make this prototype fully interactive as a client-side portfolio, all inputs, question templates, and score calculations persist beautifully across browser refreshes via custom localStorage handling.",
    solutions: "Nexus HR is a collaborative Applicant Tracking System (ATS) prototype built to rescue fast-growing teams from tab-switching fatigue. In small-to-medium teams, recruitment data is heavily fragmented: candidates apply via Google Forms, technical test outputs clog up spreadsheets, and interview notes live in disconnected documents. Nexus HR solves this by acting as a unified front-end ingestion hub. It visualizes raw spreadsheet rows into automated pipeline cards, syncs test links natively, and provides an all-in-one split-screen live interview station.",
    journey: "Week 1: Mapped out the data contract mirroring a Google Form/Sheets structure and wireframed the dual persona workflow (HR Operational vs. CEO Executive).\\nWeek 2: Sliced the core responsive shell and multi-tab filtration system (Kanban & Per Divisi view) using Tailwind CSS.\\nWeek 3: Developed the interview orchestration engine, including reactive step-accordions, numeric rating buttons, and dynamic live scoring states.\\nWeek 4: Integrated the localStorage persistence layer, polished modal configurations (Mulai Interview), and optimized layouts for live deployment.",
    reason: "By providing a tailored, dual-persona interface, the prototype minimizes the friction of collaborative hiring. HR operations can manage granular pipelines via the Kanban or Per Divisi view, while the CEO can access a high-level \\"Ringkasan Hiring\\" screen to immediately review, track critical positions, and approve top candidates in one click.",
    userCount: 'HR Managers, Technical Recruiters, and Startup CEOs',
    impact: "By providing a tailored, dual-persona interface, the prototype minimizes the friction of collaborative hiring. HR operations can manage granular pipelines via the Kanban or Per Divisi view, while the CEO can access a high-level \\"Ringkasan Hiring\\" screen to immediately review, track critical positions, and approve top candidates in one click.",
    learned: "You don't always need a heavy database backend to deliver massive enterprise value. Building Nexus HR taught me how to design strict data contracts on the front-end that align perfectly with lightweight automations (like Google Workspace). It proved that a well-crafted, user-centered interface can transform raw spreadsheet rows into an intuitive SaaS experience.",
    closingLine: "Built by a front-end engineer tired of seeing HR teams suffer from spreadsheet chaos. Just a developer who loves building clean, high-impact business tools.",
    company: 'Personal',
    testimonials: [
      { name: "Tech Recruiter & Alpha Tester", role: "Alpha Tester", text: "Being able to see the candidate's CV on the left while instantly rating and storing question-by-question responses on the right completely replaces the mess of Notion templates and Google Docs we used to use." }
    ]
  },
"""

    new_project_id = """  {
    id: 'nexus-hr',
    number: '02',
    title: 'Nexus HR',
    role: 'Solo Front-End Engineer & UI/UX Designer',
    year: 'Mei - Juni 2026',
    desc: 'Dashboard ATS Berbasis Spreadsheet. Pusatkan pipeline rekrutmen, jalankan wawancara terstruktur, dan jembatani operasi HR dengan keputusan CEO.',
    tags: ['React.js', 'Tailwind CSS', 'LocalStorage State', 'Google Workspace'],
    link: null,
    isComingSoon: false,
    glow: '#8B5CF6',
    geometry: 'headphones',
    previewImage: null,
    studyCase: "Rekrutmen di tim yang berkembang pesat biasanya digerakkan oleh ekosistem yang berantakan. Saatnya membuat keputusan perekrutan, HR dan CEO akhirnya membuka 10 tab per kandidat (CV, portofolio, lembar pertanyaan, dan dokumen feedback terpisah). Nexus HR dibangun untuk memecahkan masalah ini. Dengan merancang front-end untuk dengan mudah memperlakukan Google Sheets sebagai lapisan konsumsi data ringan, aplikasi ini memusatkan segalanya ke dalam dasbor yang indah di mana baris formulir mentah menjadi profil bakat terstruktur yang dapat ditindaklanjuti.",
    challenges: "Tantangan: Wawancara membutuhkan konteks yang dalam. Rekruter biasanya membutuhkan beberapa monitor atau terus-menerus berpindah tab untuk melihat CV kandidat sambil melacak rubrik wawancara dan mengetik catatan evaluasi. Memaksakan ini ke dalam satu layar biasanya menghasilkan UI yang berantakan dan membuat stres.\\n\\nSolusi: Saya merekayasa Antarmuka Wawancara Layar Terpisah yang ketat. Viewport kiri adalah Area Pratinjau CV/Portofolio yang bebas gangguan. Viewport kanan memandu pewawancara melalui alur akordion 5 langkah terstruktur (Snapshot ➔ Questions ➔ Ratings ➔ Summary ➔ Final Recommendation). Untuk membuat prototipe ini sepenuhnya interaktif sebagai portofolio sisi klien, semua input, templat pertanyaan, dan kalkulasi skor dipertahankan dengan indah di seluruh refresh browser melalui penanganan localStorage kustom.",
    solutions: "Nexus HR adalah prototipe Applicant Tracking System (ATS) kolaboratif yang dibangun untuk menyelamatkan tim yang berkembang pesat dari kelelahan berpindah tab. Di tim kecil hingga menengah, data rekrutmen sangat terfragmentasi: kandidat melamar melalui Google Forms, output tes teknis menumpuk di spreadsheet, dan catatan wawancara berada di dokumen terpisah. Nexus HR memecahkan ini dengan bertindak sebagai hub konsumsi front-end terpadu. Ini memvisualisasikan baris spreadsheet mentah menjadi kartu pipeline otomatis, menyinkronkan tautan tes secara native, dan menyediakan stasiun wawancara langsung layar terpisah all-in-one.",
    journey: "Minggu 1: Memetakan kontrak data yang mencerminkan struktur Google Form/Sheets dan merancang alur kerja persona ganda (Operasional HR vs Eksekutif CEO).\\nMinggu 2: Mengiris cangkang responsif inti dan sistem penyaringan multi-tab (tampilan Kanban & Per Divisi) menggunakan Tailwind CSS.\\nMinggu 3: Mengembangkan mesin orkestrasi wawancara, termasuk akordion langkah reaktif, tombol peringkat numerik, dan status penilaian langsung dinamis.\\nMinggu 4: Mengintegrasikan lapisan persistensi localStorage, memoles konfigurasi modal (Mulai Interview), dan mengoptimalkan tata letak untuk penerapan langsung.",
    reason: "Dengan menyediakan antarmuka dua persona yang disesuaikan, prototipe ini meminimalkan gesekan perekrutan kolaboratif. Operasi HR dapat mengelola pipeline granular melalui tampilan Kanban atau Per Divisi, sementara CEO dapat mengakses layar \\"Ringkasan Hiring\\" tingkat tinggi untuk segera meninjau, melacak posisi kritis, dan menyetujui kandidat teratas dalam satu klik.",
    userCount: 'Manajer HR, Rekruter Teknis, dan CEO Startup',
    impact: "Dengan menyediakan antarmuka dua persona yang disesuaikan, prototipe ini meminimalkan gesekan perekrutan kolaboratif. Operasi HR dapat mengelola pipeline granular melalui tampilan Kanban atau Per Divisi, sementara CEO dapat mengakses layar \\"Ringkasan Hiring\\" tingkat tinggi untuk segera meninjau, melacak posisi kritis, dan menyetujui kandidat teratas dalam satu klik.",
    learned: "Anda tidak selalu membutuhkan backend database yang berat untuk memberikan nilai perusahaan yang besar. Membangun Nexus HR mengajari saya cara merancang kontrak data ketat di front-end yang sejajar sempurna dengan otomatisasi ringan (seperti Google Workspace). Ini membuktikan bahwa antarmuka yang dibuat dengan baik dan berpusat pada pengguna dapat mengubah baris spreadsheet mentah menjadi pengalaman SaaS yang intuitif.",
    closingLine: "Dibangun oleh seorang front-end engineer yang lelah melihat tim HR menderita karena kekacauan spreadsheet. Hanya seorang pengembang yang suka membangun alat bisnis berdampak tinggi yang bersih.",
    company: 'Personal',
    testimonials: [
      { name: "Rekruter Teknis & Penguji Alpha", role: "Penguji Alpha", text: "Dapat melihat CV kandidat di sebelah kiri sambil langsung memberi peringkat dan menyimpan tanggapan pertanyaan demi pertanyaan di sebelah kanan sepenuhnya menggantikan kekacauan template Notion dan Google Docs yang biasa kami gunakan." }
    ]
  },
"""

    is_en = 'DataEn' in filepath
    new_project = new_project_en if is_en else new_project_id

    # Find the mypitlane item and insert before it
    parts = content.split("  {\n    id: 'mypitlane',")
    if len(parts) > 1:
        content = parts[0] + new_project + "  {\n    id: 'mypitlane'," + parts[1]

    # Now increment numbers for mypitlane and after
    def increment_number(match):
        num = int(match.group(1))
        if num >= 2:
            return f"number: '{num+1:02d}'"
        return match.group(0)

    # We need to only increment after mypitlane. 
    # But wait, it's easier to just match all and increment if >= 2.
    # But wait! Nexus HR is now 02. If we increment >= 2, Nexus HR becomes 03.
    # Let's do it carefully by splitting from mypitlane onwards.
    
    parts2 = content.split("  {\n    id: 'mypitlane',")
    if len(parts2) > 1:
        after_mypitlane = parts2[1]
        after_mypitlane = re.sub(r"number:\s*'(\d+)'", increment_number, after_mypitlane)
        content = parts2[0] + "  {\n    id: 'mypitlane'," + after_mypitlane

    with open(filepath, 'w') as f:
        f.write(content)

update_file('/Users/maylaaaf/Desktop/Portofolio/mayla-portfolio/src/data/projectsDataEn.js')
update_file('/Users/maylaaaf/Desktop/Portofolio/mayla-portfolio/src/data/projectsDataId.js')
