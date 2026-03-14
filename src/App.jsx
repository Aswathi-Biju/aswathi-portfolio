// ============================================================
// Aswathi Biju — Data Analytics Portfolio
// Single-file React component (no external build needed beyond
// a standard Vite / CRA setup with Tailwind + Framer Motion)
//
// REQUIRED PACKAGES:
//   npm install framer-motion lucide-react
//   (Tailwind already assumed via CDN or PostCSS)
//
// USAGE: Drop this file as src/App.jsx (or wrap it),
//        add Tailwind CDN in index.html for zero-config usage.
// ============================================================

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ─── FONT INJECTION ──────────────────────────────────────────
// DM Sans (body/UI) + Fraunces (hero name only — modern variable display serif)
const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Syne:wght@600;700;800&family=Fraunces:opsz,wght@9..144,800;9..144,900&display=swap');
  *, *::before, *::after { font-family: 'DM Sans', sans-serif; }
  h1, h2, h3 { font-family: 'Syne', sans-serif; letter-spacing: -0.02em; }
  .font-hero-name { font-family: 'Fraunces', serif; font-weight: 900; letter-spacing: -0.03em; font-style: italic; }
`;

// ─── THEME CONTEXT ──────────────────────────────────────────
// Manages dark/light mode state
// ────────────────────────────────────────────────────────────

// ─── DATA ───────────────────────────────────────────────────
const NAV_LINKS = ["Home", "Projects", "Skills", "Resume", "Experience", "Contact"];

const PROJECTS = [
  {
    id: 1,
    title: "Sales Data Analysis",
    emoji: "📊",
    summary: "Revenue trend identification across quarterly sales datasets",
    problem: "A retail company needed to understand which product lines drove growth and where seasonal dips occurred.",
    approach: "Loaded 3 years of sales CSV data into Pandas, performed exploratory analysis, and built time-series visualisations with Matplotlib.",
    insights: ["Q4 consistently outperformed other quarters by 34%", "Top 3 SKUs contributed 61% of total revenue", "Regional disparity identified in South-West markets"],
    tools: ["Python", "Pandas", "Matplotlib", "Jupyter", "Excel"],
    github: "https://github.com/Aswathi-Biju",
    demo: null,
    color: "from-teal-500/20 to-emerald-500/10",
    accent: "#14b8a6",
  },
  {
    id: 2,
    title: "Customer Segmentation",
    emoji: "🎯",
    summary: "Clustering customers into meaningful groups using behavioural data",
    problem: "Marketing team lacked targeted campaign strategy due to treating all customers identically.",
    approach: "Applied K-Means clustering on RFM (Recency, Frequency, Monetary) features; visualised cluster boundaries with Seaborn pair plots.",
    insights: ["Identified 4 distinct customer personas", "High-value segment (12% of users) drove 48% of revenue", "Dormant segment re-engagement potential: ~₹2.1L/month"],
    tools: ["Python", "Scikit-learn", "Seaborn", "Pandas", "NumPy"],
    github: "https://github.com/Aswathi-Biju",
    demo: null,
    color: "from-violet-500/20 to-purple-500/10",
    accent: "#8b5cf6",
  },
  {
    id: 3,
    title: "Business Metrics Dashboard",
    emoji: "📈",
    summary: "Interactive Power BI dashboard surfacing KPIs for leadership",
    problem: "Executives spent hours collecting data from spreadsheets; no single source of truth existed.",
    approach: "Designed a multi-page Power BI report with slicers, drill-throughs, and DAX measures connecting to a MySQL back-end.",
    insights: ["Reduced reporting prep from 6 hrs/week to under 30 mins", "Cost-per-acquisition tracked in real time", "Data freshness latency reduced to 15 minutes"],
    tools: ["Power BI", "DAX", "MySQL", "Excel", "Power Query"],
    github: "https://github.com/Aswathi-Biju",
    demo: null,
    color: "from-amber-500/20 to-yellow-500/10",
    accent: "#f59e0b",
  },
];

const SKILLS = [
  {
    category: "Programming",
    icon: "⌨️",
    items: ["Python", "SQL", "C"],
  },
  {
    category: "Analysis Libraries",
    icon: "🔬",
    items: ["Pandas", "NumPy", "Scikit-learn"],
  },
  {
    category: "Visualisation",
    icon: "📊",
    items: ["Tableau", "Power BI", "Matplotlib", "Seaborn"],
  },
  {
    category: "Databases",
    icon: "🗄️",
    items: ["MySQL", "MongoDB"],
  },
  {
    category: "Tools & Platforms",
    icon: "🛠️",
    items: ["Git", "GitHub", "Excel", "Jupyter Notebook"],
  },
  {
    category: "Version Control",
    icon: "🔀",
    items: ["Git", "GitHub", "GitLab"],
  },
];

const TIMELINE = [
  {
    year: "2024 – 2028",
    title: "Computer Science Student",
    org: "St. Joseph's College of Engineering and Technology, Palai",
    desc: "Pursuing B.Tech in Computer Science with a focus on data structures, databases, and analytics.",
    type: "edu",
  },
  {
    year: "2024",
    title: "Personal Data Analytics Projects",
    org: "Self-directed",
    desc: "Built end-to-end analysis pipelines covering EDA, visualisation, and dashboard creation.",
    type: "work",
  },
  {
    year: "Ongoing",
    title: "Seeking Internship Opportunities",
    org: "Open to collaborations",
    desc: "Actively applying for data analytics internships and open to project collaborations.",
    type: "open",
  },
];

// ─── ANIMATION VARIANTS ──────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── HELPER COMPONENTS ──────────────────────────────────────

// Section wrapper with InView trigger
function Section({ id, children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={`py-24 px-6 max-w-6xl mx-auto ${className}`}
    >
      {children}
    </motion.section>
  );
}

// Animated section heading
function SectionHeading({ label, title, dark }) {
  return (
    <motion.div variants={fadeUp} className="mb-16">
      <p className={`text-xs tracking-[0.2em] uppercase font-semibold mb-3 ${dark ? "text-teal-400" : "text-teal-600"}`}>
        {label}
      </p>
      <h2 className={`text-4xl md:text-5xl font-bold leading-tight ${dark ? "text-white" : "text-gray-900"}`}>
        {title}
      </h2>
    </motion.div>
  );
}

// Pill badge
function Badge({ text, accent }) {
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full border"
      style={{
        borderColor: accent + "55",
        color: accent,
        background: accent + "15",
      }}
    >
      {text}
    </span>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────
function Navbar({ dark, toggleDark }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNav = (link) => {
    setMenuOpen(false);
    document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? dark
            ? "bg-gray-950/90 backdrop-blur-md border-b border-white/10 shadow-xl"
            : "bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#home"
          onClick={(e) => { e.preventDefault(); handleNav("Home"); }}
          whileHover={{ scale: 1.04 }}
          className={`font-bold text-xl tracking-tight ${dark ? "text-white" : "text-gray-900"}`}
        >
          AB<span className="text-teal-500">.</span>
        </motion.a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => handleNav(link)}
              className={`text-sm font-medium transition-colors hover:text-teal-500 ${
                dark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {link}
            </button>
          ))}
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-110 ${
              dark ? "border-white/20 text-yellow-400 hover:bg-white/10" : "border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={toggleDark} className="text-lg">
            {dark ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`text-2xl ${dark ? "text-white" : "text-gray-900"}`}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden px-6 pb-6 border-t ${
              dark ? "bg-gray-950 border-white/10" : "bg-white border-gray-200"
            }`}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => handleNav(link)}
                className={`block w-full text-left py-3 text-sm font-medium border-b transition-colors hover:text-teal-500 ${
                  dark ? "border-white/10 text-gray-300" : "border-gray-100 text-gray-700"
                }`}
              >
                {link}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────
function Hero({ dark }) {
  return (
    <section
      id="home"
      className={`min-h-screen flex items-center relative overflow-hidden ${
        dark ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: dark
            ? "linear-gradient(rgba(20,184,166,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.07) 1px, transparent 1px)"
            : "linear-gradient(rgba(20,184,166,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{ background: dark ? "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)" : "radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative z-10 grid md:grid-cols-2 gap-16 items-center w-full">
        {/* Text */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="mb-4 inline-flex items-center gap-2">
            <span className="w-8 h-px bg-teal-500" />
            <span className={`text-xs tracking-widest uppercase font-semibold ${dark ? "text-teal-400" : "text-teal-600"}`}>
              Data Analytics Enthusiast
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className={`text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 font-hero-name ${dark ? "text-white" : "text-gray-900"}`}
          >
            Aswathi<br />
            <span className="text-teal-500">Biju</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className={`text-base md:text-lg leading-relaxed mb-8 max-w-lg ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            Computer Science student at St. Joseph's College of Engineering and Technology, Palai.
            Passionate about transforming raw data into meaningful insights using Python, SQL, and
            data visualisation platforms. Building skills in dashboard creation, business analytics,
            and exploratory data analysis — with a goal to drive data-driven decisions.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-teal-500 text-white hover:bg-teal-400 transition-colors"
            >
              View Projects →
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href="#"
              className={`px-6 py-3 rounded-xl font-semibold text-sm border transition-colors ${
                dark ? "border-white/20 text-white hover:bg-white/10" : "border-gray-300 text-gray-800 hover:bg-gray-100"
              }`}
            >
              Download Resume
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-colors ${
                dark ? "text-teal-400 hover:bg-teal-400/10" : "text-teal-600 hover:bg-teal-50"
              }`}
            >
              Contact Me
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Profile photo placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex justify-center md:justify-end"
        >
          <div className="relative">
            {/* Decorative rings behind illustration */}
            <div className="absolute inset-0 rounded-full border-2 border-teal-500/20 scale-110" />
            <div className="absolute inset-0 rounded-full border border-teal-500/10 scale-125" />

            {/* Data Analytics Illustration */}
            <div
              className={`w-72 h-72 md:w-96 md:h-96 rounded-full flex items-center justify-center overflow-hidden border-4 ${
                dark ? "border-teal-500/25" : "border-teal-400/30"
              }`}
              style={{ background: dark ? "#0c1a1f" : "#f0fdf9" }}
            >
              <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                  <clipPath id="cc"><circle cx="200" cy="200" r="200"/></clipPath>
                </defs>
                <g clipPath="url(#cc)">

                  {/* ── subtle radial glow BG ── */}
                  <circle cx="200" cy="200" r="200" fill={dark ? "#0c1a1f" : "#f0fdf9"}/>
                  <circle cx="200" cy="200" r="140" fill="#14b8a6" opacity="0.06"/>
                  <circle cx="200" cy="200" r="90"  fill="#14b8a6" opacity="0.07"/>

                  {/* ══════════════════════════════════════════
                      LAPTOP / SCREEN — centrepiece
                  ══════════════════════════════════════════ */}
                  {/* laptop base */}
                  <rect x="90" y="258" width="220" height="14" rx="7" fill="#334155"/>
                  <rect x="82" y="269" width="236" height="8"  rx="4" fill="#1e293b"/>
                  {/* screen outer */}
                  <rect x="104" y="130" width="192" height="134" rx="14" fill="#1e293b"/>
                  {/* screen inner */}
                  <rect x="112" y="138" width="176" height="118" rx="8"  fill="#0f172a"/>
                  {/* screen glow rim */}
                  <rect x="112" y="138" width="176" height="118" rx="8"  fill="none" stroke="#14b8a6" strokeWidth="1" opacity="0.25"/>

                  {/* ══════════════════════════════════════════
                      DASHBOARD ON SCREEN
                  ══════════════════════════════════════════ */}

                  {/* top header bar */}
                  <rect x="112" y="138" width="176" height="20" rx="8" fill="#1e293b"/>
                  <rect x="120" y="144" width="60"  height="6"  rx="3" fill="#14b8a6" opacity="0.9"/>
                  <circle cx="272" cy="147" r="4" fill="#14b8a6" opacity="0.5"/>
                  <circle cx="282" cy="147" r="4" fill="#14b8a6" opacity="0.3"/>

                  {/* ── KPI mini cards row ── */}
                  {[
                    { x: 118, val: "#34d399" },
                    { x: 158, val: "#f59e0b" },
                    { x: 198, val: "#818cf8" },
                    { x: 238, val: "#f472b6" },
                  ].map((k, i) => (
                    <g key={i}>
                      <rect x={k.x} y="164" width="34" height="22" rx="4" fill="#1e3a4a" opacity="0.9"/>
                      <rect x={k.x+4} y="168" width="16" height="3" rx="1.5" fill={k.val} opacity="0.7"/>
                      <rect x={k.x+4} y="175" width="24" height="5"  rx="2" fill={k.val} opacity="0.9"/>
                    </g>
                  ))}

                  {/* ── BAR CHART (left panel) ── */}
                  <rect x="118" y="192" width="80" height="60" rx="5" fill="#0f2233" opacity="0.8"/>
                  {/* axis lines */}
                  <line x1="124" y1="246" x2="192" y2="246" stroke="#334155" strokeWidth="1"/>
                  <line x1="124" y1="246" x2="124" y2="198" stroke="#334155" strokeWidth="1"/>
                  {/* bars */}
                  {[
                    { x: 129, h: 28, c: "#14b8a6" },
                    { x: 141, h: 18, c: "#14b8a6" },
                    { x: 153, h: 38, c: "#f59e0b" },
                    { x: 165, h: 24, c: "#14b8a6" },
                    { x: 177, h: 42, c: "#f59e0b" },
                  ].map((b, i) => (
                    <rect key={i} x={b.x} y={246-b.h} width="9" height={b.h} rx="2" fill={b.c} opacity="0.9"/>
                  ))}

                  {/* ── LINE / AREA CHART (right panel) ── */}
                  <rect x="204" y="192" width="80" height="60" rx="5" fill="#0f2233" opacity="0.8"/>
                  {/* area fill */}
                  <path d="M210 240 L220 228 L232 234 L244 218 L256 222 L268 210 L278 216 L278 246 L210 246 Z"
                    fill="#14b8a6" opacity="0.15"/>
                  {/* line */}
                  <path d="M210 240 L220 228 L232 234 L244 218 L256 222 L268 210 L278 216"
                    stroke="#14b8a6" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  {/* dots on line */}
                  {[
                    [210,240],[220,228],[232,234],[244,218],[256,222],[268,210],[278,216]
                  ].map(([cx,cy],i) => (
                    <circle key={i} cx={cx} cy={cy} r="3" fill="#14b8a6"/>
                  ))}
                  {/* second line amber */}
                  <path d="M210 244 L220 238 L232 242 L244 232 L256 236 L268 228 L278 232"
                    stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>

                  {/* ── DONUT CHART (bottom left) ── */}
                  <rect x="118" y="257" width="56" height="48" rx="5" fill="#0f2233" opacity="0.8"/>
                  {/* donut arcs */}
                  <circle cx="146" cy="281" r="16" fill="none" stroke="#14b8a6"  strokeWidth="10" strokeDasharray="50 100" strokeDashoffset="0"   opacity="0.9"/>
                  <circle cx="146" cy="281" r="16" fill="none" stroke="#f59e0b"  strokeWidth="10" strokeDasharray="30 100" strokeDashoffset="-50"  opacity="0.9"/>
                  <circle cx="146" cy="281" r="16" fill="none" stroke="#818cf8"  strokeWidth="10" strokeDasharray="20 100" strokeDashoffset="-80"  opacity="0.9"/>
                  <circle cx="146" cy="281" r="7"  fill="#0f2233"/>

                  {/* ── STATS / TABLE (bottom right) ── */}
                  <rect x="180" y="257" width="104" height="48" rx="5" fill="#0f2233" opacity="0.8"/>
                  {[0,1,2,3].map(i=>(
                    <g key={i}>
                      <rect x="186" y={263+i*10} width="14" height="4" rx="2" fill="#334155"/>
                      <rect x="206" y={263+i*10} width={[36,28,44,32][i]} height="4" rx="2" fill={["#14b8a6","#f59e0b","#818cf8","#f472b6"][i]} opacity="0.8"/>
                      <rect x="256" y={263+i*10} width="20" height="4" rx="2" fill="#334155" opacity="0.5"/>
                    </g>
                  ))}

                  {/* ══════════════════════════════════════════
                      FLOATING DATA NODES — orbiting
                  ══════════════════════════════════════════ */}

                  {/* node top-left: Python pill */}
                  <rect x="28" y="96" width="72" height="28" rx="14" fill="#1e293b" stroke="#14b8a6" strokeWidth="1.5" opacity="0.95"/>
                  <circle cx="44" cy="110" r="7" fill="#14b8a6" opacity="0.9"/>
                  <rect x="55" y="106" width="38" height="8" rx="4" fill="#14b8a6" opacity="0.4"/>

                  {/* node top-right: SQL */}
                  <rect x="298" y="80" width="76" height="28" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" opacity="0.95"/>
                  <circle cx="314" cy="94" r="7" fill="#f59e0b" opacity="0.9"/>
                  <rect x="325" y="90" width="42" height="8" rx="4" fill="#f59e0b" opacity="0.4"/>

                  {/* node left: bar chart icon */}
                  <rect x="22" y="186" width="52" height="52" rx="12" fill="#1e293b" stroke="#818cf8" strokeWidth="1.5" opacity="0.95"/>
                  <rect x="32" y="222" width="8"  height="10" rx="2" fill="#818cf8" opacity="0.9"/>
                  <rect x="44" y="214" width="8"  height="18" rx="2" fill="#818cf8" opacity="0.7"/>
                  <rect x="56" y="206" width="8"  height="26" rx="2" fill="#818cf8"/>

                  {/* node right: pie / donut icon */}
                  <rect x="328" y="186" width="52" height="52" rx="12" fill="#1e293b" stroke="#f472b6" strokeWidth="1.5" opacity="0.95"/>
                  <circle cx="354" cy="212" r="14" fill="none" stroke="#f472b6"  strokeWidth="8" strokeDasharray="40 88" strokeDashoffset="0"  opacity="0.9"/>
                  <circle cx="354" cy="212" r="14" fill="none" stroke="#14b8a6"  strokeWidth="8" strokeDasharray="28 88" strokeDashoffset="-40" opacity="0.9"/>
                  <circle cx="354" cy="212" r="14" fill="none" stroke="#f59e0b"  strokeWidth="8" strokeDasharray="20 88" strokeDashoffset="-68" opacity="0.9"/>
                  <circle cx="354" cy="212" r="6"  fill="#1e293b"/>

                  {/* node bottom: trend line icon */}
                  <rect x="154" y="312" width="92" height="36" rx="10" fill="#1e293b" stroke="#34d399" strokeWidth="1.5" opacity="0.95"/>
                  <path d="M168 336 L182 325 L196 330 L210 318 L224 322 L236 314"
                    stroke="#34d399" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  {[168,182,196,210,224,236].map((cx,i)=>(
                    <circle key={i} cx={cx} cy={[336,325,330,318,322,314][i]} r="2.5" fill="#34d399"/>
                  ))}

                  {/* ── connector lines from nodes to laptop ── */}
                  <line x1="100" y1="110" x2="140" y2="160" stroke="#14b8a6" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
                  <line x1="298"  y1="94" x2="270" y2="150" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
                  <line x1="74"  y1="212" x2="112" y2="222" stroke="#818cf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
                  <line x1="328" y1="212" x2="288" y2="222" stroke="#f472b6" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
                  <line x1="200" y1="312" x2="200" y2="272" stroke="#34d399" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>

                  {/* ── decorative scattered dots grid ── */}
                  {[50,80,110,140].map(x=>
                    [60,90,120].map(y=>(
                      <circle key={`${x}${y}`} cx={x} cy={y} r="1.5" fill="#14b8a6" opacity="0.12"/>
                    ))
                  )}
                  {[260,290,320,350].map(x=>
                    [280,310,340].map(y=>(
                      <circle key={`${x}${y}`} cx={x} cy={y} r="1.5" fill="#14b8a6" opacity="0.12"/>
                    ))
                  )}

                </g>
              </svg>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className={`absolute -bottom-4 -left-8 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg ${
                dark ? "bg-gray-800 text-teal-400 border border-white/10" : "bg-white text-teal-700 border border-gray-200"
              }`}
            >
              📊 Python · SQL · Power BI
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              className={`absolute -top-4 -right-8 px-3 py-2 rounded-xl text-xs font-semibold shadow-lg ${
                dark ? "bg-gray-800 text-amber-400 border border-white/10" : "bg-white text-amber-700 border border-gray-200"
              }`}
            >
              🎓 CS Student
            </motion.div>
          </div>
        </motion.div>
      </div>


    </section>
  );
}

// ─── PROJECTS ────────────────────────────────────────────────
function Projects({ dark }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div id="projects" className={dark ? "bg-gray-950" : "bg-white"}>
      <Section id="_projects">
        <SectionHeading label="Portfolio" title="Featured Projects" dark={dark} />

        <motion.div variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p) => (
            <motion.div
              key={p.id}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.01 }}
              onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              className={`relative cursor-pointer rounded-2xl border overflow-hidden transition-shadow hover:shadow-2xl ${
                dark ? "border-white/10 bg-gray-900 hover:border-teal-500/40" : "border-gray-200 bg-gray-50 hover:border-teal-300"
              }`}
            >
              {/* Gradient header */}
              <div className={`h-28 bg-gradient-to-br ${p.color} flex items-center px-6`}>
                <span className="text-4xl">{p.emoji}</span>
              </div>
              <div className="p-6">
                <h3 className={`text-lg font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>{p.title}</h3>
                <p className={`text-sm mb-4 leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>{p.summary}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tools.map((t) => (
                    <Badge key={t} text={t} accent={p.accent} />
                  ))}
                </div>

                {/* Expandable details */}
                <AnimatePresence>
                  {expanded === p.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`pt-4 border-t mb-4 ${dark ? "border-white/10" : "border-gray-200"}`}>
                        <p className={`text-xs font-semibold mb-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>PROBLEM</p>
                        <p className={`text-sm leading-relaxed mb-3 ${dark ? "text-gray-300" : "text-gray-700"}`}>{p.problem}</p>
                        <p className={`text-xs font-semibold mb-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>APPROACH</p>
                        <p className={`text-sm leading-relaxed mb-3 ${dark ? "text-gray-300" : "text-gray-700"}`}>{p.approach}</p>
                        <p className={`text-xs font-semibold mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>KEY INSIGHTS</p>
                        <ul className="space-y-1 mb-3">
                          {p.insights.map((ins) => (
                            <li key={ins} className={`text-sm flex gap-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>
                              <span style={{ color: p.accent }}>▸</span> {ins}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`text-xs font-semibold underline hover:no-underline ${dark ? "text-teal-400" : "text-teal-600"}`}
                    >
                      GitHub ↗
                    </a>
                    {p.demo && (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`text-xs font-semibold underline hover:no-underline ${dark ? "text-amber-400" : "text-amber-600"}`}
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                  <span className={`text-xs ${dark ? "text-gray-600" : "text-gray-400"}`}>
                    {expanded === p.id ? "↑ Less" : "↓ More"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Challenges & Learnings */}
        <motion.div
          variants={fadeUp}
          className={`mt-12 rounded-2xl border p-8 ${dark ? "border-white/10 bg-gray-900" : "border-gray-200 bg-gray-50"}`}
        >
          <h3 className={`text-xl font-bold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>
            Challenges & Learnings
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🔍", title: "Data Cleaning", desc: "Messy, inconsistent real-world datasets taught me the importance of robust preprocessing pipelines before any analysis." },
              { icon: "🧠", title: "Choosing the Right Viz", desc: "Selecting the correct chart type to tell a story clearly — a skill I continue refining with each project." },
              { icon: "⚙️", title: "Performance at Scale", desc: "Moving from small CSV files to larger datasets highlighted the value of vectorised operations and efficient SQL queries." },
            ].map((item) => (
              <div key={item.title}>
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className={`text-sm font-semibold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>{item.title}</p>
                <p className={`text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </Section>
    </div>
  );
}

// ─── SKILLS ──────────────────────────────────────────────────
function Skills({ dark }) {
  return (
    <div id="skills" className={dark ? "bg-gray-900" : "bg-gray-50"}>
      <Section id="_skills">
        <SectionHeading label="Expertise" title="Technical Skills" dark={dark} />
        <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SKILLS.map((cat) => (
            <motion.div
              key={cat.category}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className={`rounded-2xl border p-6 transition-all hover:shadow-lg ${
                dark ? "border-white/10 bg-gray-950 hover:border-teal-500/30" : "border-gray-200 bg-white hover:border-teal-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{cat.icon}</span>
                <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{cat.category}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.08 }}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full cursor-default ${
                      dark ? "bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20" : "bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100"
                    }`}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>
    </div>
  );
}

// ─── RESUME ──────────────────────────────────────────────────
function Resume({ dark }) {
  return (
    <div id="resume" className={dark ? "bg-gray-950" : "bg-white"}>
      <Section id="_resume">
        <SectionHeading label="Background" title="Resume" dark={dark} />
        <div className="grid md:grid-cols-2 gap-8">
          {/* Education */}
          <motion.div variants={fadeUp} className={`rounded-2xl border p-6 ${dark ? "border-white/10 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">🎓</span>
              <p className={`font-bold ${dark ? "text-white" : "text-gray-900"}`}>Education</p>
            </div>
            <div className={`pl-4 border-l-2 border-teal-500`}>
              <p className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}>B.Tech — Computer Science</p>
              <p className={`text-sm mt-1 ${dark ? "text-teal-400" : "text-teal-600"}`}>St. Joseph's College of Engineering and Technology, Palai</p>
              <p className={`text-xs mt-1 ${dark ? "text-gray-500" : "text-gray-500"}`}>2024 – 2028</p>
            </div>
          </motion.div>

          {/* Work Experience */}
          <motion.div variants={fadeUp} className={`rounded-2xl border p-6 ${dark ? "border-white/10 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">💼</span>
              <p className={`font-bold ${dark ? "text-white" : "text-gray-900"}`}>Work Experience</p>
            </div>
            <div className={`pl-4 border-l-2 ${dark ? "border-amber-500" : "border-amber-400"}`}>
              <p className={`text-sm leading-relaxed italic ${dark ? "text-gray-400" : "text-gray-600"}`}>
                "Currently seeking internship opportunities in data analytics and actively building real-world projects to demonstrate practical expertise."
              </p>
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div variants={fadeUp} className={`rounded-2xl border p-6 ${dark ? "border-white/10 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">📜</span>
              <p className={`font-bold ${dark ? "text-white" : "text-gray-900"}`}>Certifications</p>
            </div>
            <div className="space-y-3">
              {[
                "Google Data Analytics Certificate (In Progress)",
                "Coursera Python for Everybody (Planned)",
                "Tableau Desktop Specialist (Upcoming)",
              ].map((cert) => (
                <div key={cert} className={`flex items-start gap-2 text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>
                  <span className="text-teal-500 mt-0.5">◉</span> {cert}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div variants={fadeUp} className={`rounded-2xl border p-6 ${dark ? "border-white/10 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">🏆</span>
              <p className={`font-bold ${dark ? "text-white" : "text-gray-900"}`}>Achievements</p>
            </div>
            <div className="space-y-3">
              {[
                "Hackathons and analytics competitions (upcoming)",
                "Personal end-to-end analytics projects",
                "Open source contributions (planned)",
              ].map((ach) => (
                <div key={ach} className={`flex items-start gap-2 text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>
                  <span className="text-amber-500 mt-0.5">★</span> {ach}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Download CTA */}
        <motion.div variants={fadeUp} className="mt-8 flex justify-center">
          <motion.a
            href="#"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-400 transition-colors"
          >
            📄 Download Full Resume (PDF)
          </motion.a>
        </motion.div>
      </Section>
    </div>
  );
}

// ─── EXPERIENCE TIMELINE ─────────────────────────────────────
function Experience({ dark }) {
  return (
    <div id="experience" className={dark ? "bg-gray-900" : "bg-gray-50"}>
      <Section id="_experience">
        <SectionHeading label="Journey" title="Professional Experience" dark={dark} />

        <div className="relative">
          {/* Timeline vertical line */}
          <div className={`absolute left-6 md:left-1/2 top-0 bottom-0 w-px ${dark ? "bg-white/10" : "bg-gray-200"}`} />

          <div className="space-y-12">
            {TIMELINE.map((item, i) => (
              <motion.div key={i} variants={fadeUp} className={`relative flex flex-col md:flex-row gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-teal-500 border-4 border-current -translate-x-1/2 mt-1"
                  style={{ borderColor: dark ? "#030712" : "#f9fafb" }}
                />
                {/* Spacer */}
                <div className="hidden md:block md:w-1/2" />
                {/* Card */}
                <div className={`ml-14 md:ml-0 md:w-1/2 md:px-10`}>
                  <div className={`rounded-xl border p-5 ${dark ? "border-white/10 bg-gray-950" : "border-gray-200 bg-white"}`}>
                    <p className={`text-xs font-semibold mb-1 ${item.type === "edu" ? "text-teal-500" : item.type === "work" ? "text-violet-500" : "text-amber-500"}`}>
                      {item.year}
                    </p>
                    <p className={`font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>{item.title}</p>
                    <p className={`text-sm mb-2 ${dark ? "text-gray-500" : "text-gray-500"}`}>{item.org}</p>
                    <p className={`text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────
function Contact({ dark }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-teal-500/40 ${
    dark ? "bg-gray-900 border-white/10 text-white placeholder-gray-600 focus:border-teal-500/50" : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-teal-400"
  }`;

  return (
    <div id="contact" className={dark ? "bg-gray-950" : "bg-white"}>
      <Section id="_contact">
        <SectionHeading label="Get In Touch" title="Contact" dark={dark} />

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info column */}
          <motion.div variants={fadeUp}>
            <p className={`text-base leading-relaxed mb-8 ${dark ? "text-gray-400" : "text-gray-600"}`}>
              I'm open to internships, project collaborations, and discussions around data analytics. Feel free to reach out!
            </p>
            <div className="space-y-4">
              {[
                { icon: "📧", label: "Email", value: "aswathibiju8118@gmail.com", href: "mailto:aswathibiju8118@gmail.com" },
                { icon: "📞", label: "Phone", value: "+91-9868967399", href: "tel:+919868967399" },
                { icon: "💼", label: "LinkedIn", value: "aswathi-biju", href: "https://www.linkedin.com/in/aswathi-biju/" },
                { icon: "🐙", label: "GitHub", value: "Aswathi-Biju", href: "https://github.com/Aswathi-Biju" },
              ].map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-teal-500/50 ${
                    dark ? "border-white/10 bg-gray-900 hover:bg-gray-900" : "border-gray-200 bg-gray-50 hover:bg-teal-50"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className={`text-xs font-semibold ${dark ? "text-gray-500" : "text-gray-400"}`}>{item.label}</p>
                    <p className={`text-sm font-medium ${dark ? "text-teal-400" : "text-teal-700"}`}>{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Form column */}
          <motion.div variants={fadeUp}>
            <AnimatePresence>
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full gap-4 py-16"
                >
                  <span className="text-5xl">✅</span>
                  <p className={`text-lg font-semibold ${dark ? "text-white" : "text-gray-900"}`}>Message Sent!</p>
                  <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>I'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-semibold mb-2 ${dark ? "text-gray-400" : "text-gray-600"}`}>Name</label>
                    <input
                      type="text" required placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold mb-2 ${dark ? "text-gray-400" : "text-gray-600"}`}>Email</label>
                    <input
                      type="email" required placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold mb-2 ${dark ? "text-gray-400" : "text-gray-600"}`}>Message</label>
                    <textarea
                      rows={5} required placeholder="Tell me about your project or opportunity..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={inputCls + " resize-none"}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3.5 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-400 transition-colors text-sm"
                  >
                    Send Message →
                  </motion.button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────
function Footer({ dark }) {
  return (
    <footer className={`border-t py-12 px-6 ${dark ? "border-white/10 bg-gray-950" : "border-gray-200 bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div>
            <p className={`text-xl font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>
              Aswathi Biju<span className="text-teal-500">.</span>
            </p>
            <p className={`text-sm leading-relaxed ${dark ? "text-gray-500" : "text-gray-500"}`}>
              Data Analytics Enthusiast building real-world solutions from raw data.
            </p>
          </div>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${dark ? "text-gray-500" : "text-gray-400"}`}>Quick Links</p>
            <div className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map((link) => (
                <button
                  key={link}
                  onClick={() => document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
                  className={`text-sm text-left hover:text-teal-500 transition-colors ${dark ? "text-gray-500" : "text-gray-500"}`}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${dark ? "text-gray-500" : "text-gray-400"}`}>Social</p>
            <div className="flex gap-3">
              {[
                { icon: "🐙", href: "https://github.com/Aswathi-Biju", label: "GitHub" },
                { icon: "💼", href: "https://www.linkedin.com/in/aswathi-biju/", label: "LinkedIn" },
                { icon: "📧", href: "mailto:aswathibiju8118@gmail.com", label: "Email" },
              ].map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center text-base transition-all ${
                    dark ? "border-white/10 hover:border-teal-500/40 hover:bg-white/5" : "border-gray-200 hover:border-teal-300 hover:bg-teal-50"
                  }`}
                  title={s.label}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        <div className={`border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-2 ${dark ? "border-white/10" : "border-gray-200"}`}>
          <p className={`text-xs ${dark ? "text-gray-600" : "text-gray-400"}`}>
            © {new Date().getFullYear()} Aswathi Biju. All rights reserved.
          </p>
          <p className={`text-xs ${dark ? "text-gray-600" : "text-gray-400"}`}>
            Built with React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);

  // Sync dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className={dark ? "bg-gray-950 text-white" : "bg-white text-gray-900"}>
      {/* Font injection */}
      <style dangerouslySetInnerHTML={{ __html: fontStyle }} />
      {/* SEO meta tags — add these to your index.html <head> */}
      {/* <meta name="description" content="Aswathi Biju — Data Analytics Portfolio" /> */}
      {/* <meta name="keywords" content="data analytics, python, sql, power bi, tableau" /> */}

      <Navbar dark={dark} toggleDark={() => setDark(!dark)} />
      <Hero dark={dark} />
      <Projects dark={dark} />
      <Skills dark={dark} />
      <Resume dark={dark} />
      <Experience dark={dark} />
      <Contact dark={dark} />
      <Footer dark={dark} />
    </div>
  );
}
