"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ============ ENCODED CONTACT CONSTANTS ============
const ENCODED_CONTACTS = {
  whatsapp: "KzI1Njc4NDg0NjE2MQ==",
  recruitEmail: "Y3liZXJkZWZlbnNldWdhbmRhQGdtYWlsLmNvbQ==",
  sponsorEmail: "Y3liZXJkZWZlbnNldWdhbmRhQGdtYWlsLmNvbQ==",
  partnerEmail: "Y3liZXJkZWZlbnNldWdhbmRhQGdtYWlsLmNvbQ==",
  awarenessEmail: "Y3liZXJkZWZlbnNldWdhbmRhQGdtYWlsLmNvbQ==",
};

function decode(encoded: string): string {
  try { return atob(encoded); } catch { return encoded; }
}

const CONTACTS = {
  whatsapp: decode(ENCODED_CONTACTS.whatsapp),
  recruitEmail: decode(ENCODED_CONTACTS.recruitEmail),
  sponsorEmail: decode(ENCODED_CONTACTS.sponsorEmail),
  partnerEmail: decode(ENCODED_CONTACTS.partnerEmail),
  awarenessEmail: decode(ENCODED_CONTACTS.awarenessEmail),
};

function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${CONTACTS.whatsapp}?text=${encodeURIComponent(message)}`;
}

function getEmailUrl(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ============ TYPES ============
interface ContactMethod {
  title: string;
  scrollable?: boolean;
  content: React.ReactNode;
}

// ============ COMPONENTS ============

// Hacker Card
function HackerCard({ children, onClick, className = "" }: { 
  children: React.ReactNode; onClick?: () => void; className?: string;
}) {
  return (
    <div onClick={onClick} className={`group relative border border-green-500/20 bg-black/80 transition-all duration-300 active:scale-[0.98] md:hover:scale-[1.02] hover:border-green-500/60 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] cursor-pointer overflow-hidden ${className}`}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-400 to-transparent animate-border-scan"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-400 to-transparent animate-border-scan-reverse"></div>
      </div>
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-500/0 group-hover:bg-green-500/20 rounded-full blur-sm transition-all duration-300"></div>
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500/0 group-hover:bg-green-500/20 rounded-full blur-sm transition-all duration-300"></div>
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-500/0 group-hover:bg-green-500/20 rounded-full blur-sm transition-all duration-300"></div>
      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500/0 group-hover:bg-green-500/20 rounded-full blur-sm transition-all duration-300"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Typewriter that stays
function TypewriterStay({ text, speed = 50, className = "" }: { text: string; speed?: number; className?: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted) setHasStarted(true);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted || isComplete) return;
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [displayedText, hasStarted, isComplete, text, speed]);

  return (
    <div ref={ref} className={className}>
      <span>{displayedText}</span>
      {!isComplete && <span className="animate-pulse text-green-400">|</span>}
    </div>
  );
}

// Typewriter Loop
function TypewriterLoop({ texts, speed = 60, eraseSpeed = 30, pauseTime = 2000 }: { 
  texts: string[]; speed?: number; eraseSpeed?: number; pauseTime?: number;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) { const p = setTimeout(() => setIsPaused(false), pauseTime); return () => clearTimeout(p); }
    const ct = texts[textIndex];
    if (!isErasing && charIndex < ct.length) {
      const t = setTimeout(() => { setDisplayedText(p => p + ct[charIndex]); setCharIndex(p => p + 1); }, speed);
      return () => clearTimeout(t);
    }
    if (!isErasing && charIndex === ct.length) { const t = setTimeout(() => setIsErasing(true), pauseTime); return () => clearTimeout(t); }
    if (isErasing && charIndex > 0) {
      const t = setTimeout(() => { setDisplayedText(p => p.slice(0, -1)); setCharIndex(p => p - 1); }, eraseSpeed);
      return () => clearTimeout(t);
    }
    if (isErasing && charIndex === 0) { setIsErasing(false); setTextIndex(p => (p + 1) % texts.length); }
  }, [charIndex, isErasing, isPaused, textIndex, texts, speed, eraseSpeed, pauseTime]);

  return <span>{displayedText}<span className="animate-pulse text-green-400">|</span></span>;
}

// Single Typewriter
function TypewriterOnce({ text, speed = 80, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (index < text.length) {
      const t = setTimeout(() => { setDisplayedText(p => p + text[index]); setIndex(p => p + 1); }, speed);
      return () => clearTimeout(t);
    } else if (onComplete) onComplete();
  }, [index, text, speed, onComplete]);
  return <span>{displayedText}<span className="animate-pulse">|</span></span>;
}

// Sequential Typewriter for items (Desktop only)
function SequentialTypewriter({ items, speed = 30, onAllComplete }: { 
  items: string[]; speed?: number; onAllComplete?: () => void;
}) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted) setHasStarted(true);
    }, { threshold: 0.2 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted || isComplete) return;
    
    const currentItem = items[currentItemIndex];
    
    if (displayedText.length < currentItem.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentItem.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      if (currentItemIndex < items.length - 1) {
        const timeout = setTimeout(() => {
          setCurrentItemIndex(prev => prev + 1);
          setDisplayedText("");
        }, 400);
        return () => clearTimeout(timeout);
      } else {
        setIsComplete(true);
        if (onAllComplete) onAllComplete();
      }
    }
  }, [displayedText, currentItemIndex, hasStarted, isComplete, items, speed, onAllComplete]);

  return (
    <div ref={containerRef} className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <span className="text-green-500 flex-shrink-0">{String(index + 1).padStart(2, '0')}.</span>
          <span className="flex-1">
            {index < currentItemIndex ? (
              <span>{item}</span>
            ) : index === currentItemIndex ? (
              <span>
                {displayedText}
                {!isComplete && <span className="animate-pulse text-green-400">|</span>}
              </span>
            ) : (
              <span className="opacity-0">{item}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

// Count Up
function CountUp({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !hasStarted) setHasStarted(true); }, { threshold: 0.5 });
    if (elRef.current) obs.observe(elRef.current);
    return () => obs.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let st: number | null = null;
    const anim = (ts: number) => {
      if (!st) st = ts;
      const prog = Math.min((ts - st) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - prog, 3)) * end));
      if (prog < 1) animRef.current = requestAnimationFrame(anim);
      else setCount(end);
    };
    animRef.current = requestAnimationFrame(anim);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [hasStarted, end, duration]);

  return (
    <div ref={elRef} className="text-2xl sm:text-3xl md:text-4xl font-black text-green-400">
      <span className="group relative">
        <span className="relative z-10">{count}{suffix}</span>
      </span>
    </div>
  );
}

// Glitch Text
function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`group relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute left-0 top-0 text-red-500 opacity-0 group-hover:opacity-70 group-hover:animate-glitch-1 select-none">{text}</span>
      <span className="absolute left-0 top-0 text-blue-500 opacity-0 group-hover:opacity-70 group-hover:animate-glitch-2 select-none">{text}</span>
    </span>
  );
}

// Fly-in Section
function FlyInSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => setIsVisible(true), delay); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}>{children}</div>;
}

// Collapsible Header with green blinking box indicator
function CollapsibleHeader({ title, isOpen, onToggle, isMobile }: { title: string; isOpen: boolean; onToggle: () => void; isMobile: boolean }) {
  return (
    <div 
      onClick={isMobile ? onToggle : undefined}
      className={`flex items-center gap-2 md:gap-3 mb-4 md:mb-6 ${isMobile ? 'cursor-pointer active:opacity-70 select-none' : ''}`}
    >
      {/* Green blinking box instead of arrow */}
      <span className={`inline-block w-3 h-3 md:w-4 md:h-4 ${isOpen ? 'bg-green-500' : 'bg-green-500/30'} animate-pulse flex-shrink-0`}></span>
      <h2 className="text-lg md:text-2xl font-black text-green-300 tracking-wider flex-1">
        <GlitchText text={title} />
      </h2>
      {isMobile && (
        <span className={`text-green-400 text-sm transition-transform duration-300 ml-auto ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      )}
    </div>
  );
}

// Card Modal
function CardModal({ isOpen, onClose, title, children, scrollable = false }: { 
  isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; scrollable?: boolean;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center animate-fadeIn">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full md:max-w-lg bg-black border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)] max-h-[85vh] md:max-h-[80vh] flex flex-col rounded-t-xl md:rounded-none">
        <div className="flex items-center justify-between border-b border-green-500/30 p-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span></span>
            <span className="text-green-400 font-bold text-sm tracking-wider">{title}</span>
          </div>
          <button onClick={onClose} className="text-green-500/60 hover:text-green-400 text-xl transition-colors">✕</button>
        </div>
        <div className={`p-4 md:p-6 ${scrollable ? 'overflow-y-auto flex-1' : ''}`}>{children}</div>
      </div>
    </div>
  );
}

// Navbar in its own frame with margin
function Navbar({ onJoin, onPartner }: { onJoin: () => void; onPartner: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const hs = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", hs);
    return () => window.removeEventListener("scroll", hs);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 pt-2 sm:pt-3">
      <nav className={`border border-green-500/30 transition-all duration-300 mx-auto max-w-5xl rounded-sm ${
        scrolled 
          ? 'bg-black/95 border-green-500/50 backdrop-blur-sm shadow-[0_0_20px_rgba(34,197,94,0.1)]' 
          : 'bg-black/80 border-green-500/20'
      }`}>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg md:text-xl font-black tracking-tight"><GlitchText text="CDEF.UG" className="text-green-400" /></span>
            <span className="flex items-center gap-1.5">
              <span className="text-green-500 text-sm inline-block animate-spin-slow">🛰️</span>
              <span className="text-green-600/50 text-xs tracking-[0.15em] font-bold hidden sm:inline">UGANDA</span>
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={onJoin} className="border border-green-500/50 px-3 py-1.5 text-xs md:text-sm text-green-400 hover:bg-green-500/10 hover:border-green-400 active:scale-95 transition-all uppercase tracking-wider rounded-sm">Join</button>
            <button onClick={onPartner} className="border border-green-500/30 px-3 py-1.5 text-xs md:text-sm text-green-500/70 hover:bg-green-500/5 hover:text-green-400 hover:border-green-500/50 active:scale-95 transition-all uppercase tracking-wider rounded-sm">Partner</button>
          </div>
        </div>
      </nav>
    </div>
  );
}

// Scroll Arrow Component
function ScrollArrow() {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-green-500/60 text-xs tracking-widest mb-2">SCROLL</span>
      <div className="w-5 h-5 border-r-2 border-b-2 border-green-500 rotate-45 animate-scroll-bounce"></div>
    </div>
  );
}

// Binary Stream Component - Client-side only to avoid hydration issues
function BinaryStream() {
  const [binary, setBinary] = useState<string[]>([]);
  
  useEffect(() => {
    // Generate deterministic but random-looking binary pattern
    const pattern = [];
    for (let i = 0; i < 40; i++) {
      // Use a deterministic pattern based on index
      pattern.push((i * 7 + i * 3) % 2 === 0 ? '1' : '0');
    }
    setBinary(pattern);
  }, []);

  return (
    <div className="flex justify-center gap-1 text-[6px] text-green-500/20 font-mono overflow-hidden">
      {binary.map((bit, i) => (
        <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
          {bit}
        </span>
      ))}
    </div>
  );
}

// ============ MAIN COMPONENT ============
export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loaderLines, setLoaderLines] = useState<string[]>([]);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [footerComplete, setFooterComplete] = useState(false);
  const [aboutComplete, setAboutComplete] = useState(false);
  const [manifestoComplete, setManifestoComplete] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  
  const [philosophyOpen, setPhilosophyOpen] = useState(false);
  const [operationsOpen, setOperationsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fancy loader with progress bar and percentage
  useEffect(() => {
    const seq = [
      "Initializing secure connection...",
      "Establishing encrypted tunnel...",
      "Connecting to UG-KLA-01 node...",
      "Verifying PGP signatures...",
      "Loading Cyber Defence Uganda protocol...",
      "System ready."
    ];
    let cl = 0;
    let progress = 0;
    
    const iv = setInterval(() => {
      if (cl < seq.length) {
        setLoaderLines(p => [...p, `[${String(cl + 1).padStart(2, '0')}] ${seq[cl]}`]);
        progress = Math.round(((cl + 1) / seq.length) * 100);
        setLoaderProgress(progress);
        cl++;
      } else {
        clearInterval(iv);
        // Add a small delay before hiding loader
        setTimeout(() => {
          setShowLoader(false);
        }, 800);
      }
    }, 500);
    
    return () => clearInterval(iv);
  }, []);

  const typingTexts = [
    "FORTIFYING UGANDA'S DIGITAL FRONTIER",
    "DEFENDING CYBERSPACE. ONE BYTE AT A TIME.",
    "BUILDING THE NEXT GENERATION OF CYBER WARRIORS",
    "SECURING UGANDA'S DIGITAL SOVEREIGNTY",
    "INNOVATE. DEFEND. PROTECT. REPEAT.",
  ];

  const aboutText = "Cyber Defence Uganda (CDEF.UG) is an independent collective of cybersecurity team [ethical hackers, programmers, and digital forensics] united by a singular mission: building cyber skills to protect Uganda's digital ecosystem. We operate at the intersection of offensive and defensive security, constantly probing systems, educating stakeholders, and building resilient infrastructure that can withstand modern cyber threats.";

  // Split about text into sentences for sequential typewriter
  const aboutSentences = aboutText.match(/[^.!?]+[.!?]+/g) || [aboutText];

  const operationsDetails = [
    { title: "🛡️ Red Teaming", details: ["Full-spectrum adversarial simulation", "APT emulation", "Social engineering campaigns", "Physical security assessments", "Custom payload development", "Evasion techniques testing"] },
    { title: "🔍 Threat Intelligence", details: ["Dark web monitoring & analysis", "Threat actor profiling", "IoC collection", "Real-time threat feeds", "Geopolitical cyber threat analysis", "Early warning systems"] },
    { title: "🏗️ Security Architecture", details: ["Zero Trust architecture design", "Network segmentation", "Cloud security posture", "IAM implementation", "SIEM deployment", "Compliance frameworks"] },
    { title: "📡 Incident Response", details: ["24/7 response team", "Breach containment", "Digital forensics", "Malware analysis", "Root cause analysis", "Post-incident reporting"] },
    { title: "🎓 Training Academy", details: ["Beginner to advanced tracks", "CTF challenges", "Virtual lab environments", "Mentorship programs", "Certification prep", "Simulation exercises"] },
    { title: "🔐 Penetration Testing", details: ["Web application security", "Mobile assessment", "Network penetration testing", "API security testing", "Cloud infrastructure testing", "IoT security"] },
    { title: "💣 Exploit Development", details: ["Zero-day research", "Custom exploit creation", "Shellcode development", "Privilege escalation", "Antivirus evasion", "Payload obfuscation"] },
    { title: "🌐 OSINT Operations", details: ["Open source intelligence", "Social media reconnaissance", "Domain intelligence", "Breach analysis", "Geospatial intelligence", "Footprint mapping"] }
  ];

  const contactMethods: Record<string, ContactMethod> = {
    join: {
      title: "JOIN THE COLLECTIVE",
      content: (
        <div className="space-y-4 text-sm">
          <p className="text-green-400/80">Ready to become part of Uganda&apos;s cyber defense force?</p>
          <div className="space-y-3">
            <a href={getEmailUrl(CONTACTS.recruitEmail, "JOIN CDEF.UG", "Background:%0A")} className="flex items-center gap-3 border border-green-500/40 p-4 hover:bg-green-500/10 transition-all">
              <span className="text-2xl">📧</span><div><p className="text-green-400 font-bold">Encrypted Email</p><p className="text-green-500/60 text-xs break-all">{CONTACTS.recruitEmail}</p></div>
            </a>
            <button onClick={() => window.open(getWhatsAppUrl("Hello CDEF.UG! I'm interested in joining."), '_blank')} className="w-full flex items-center gap-3 border border-green-500/40 p-4 hover:bg-green-500/10 transition-all">
              <span className="text-2xl">💬</span><div className="text-left"><p className="text-green-400 font-bold">WhatsApp</p><p className="text-green-500/60 text-xs">{CONTACTS.whatsapp}</p></div>
            </button>
          </div>
        </div>
      )
    },
    support: {
      title: "SUPPORT THE MISSION",
      content: (
        <div className="space-y-4 text-sm">
          <div className="space-y-3">
            <button onClick={() => window.open(getWhatsAppUrl("Sponsorship inquiry"), '_blank')} className="w-full border border-green-500/40 p-4 hover:bg-green-500/10 transition-all text-left">
              <span className="text-2xl">💰</span> <span className="text-green-400 font-bold ml-2">Financial Sponsorship</span>
            </button>
            <a href={getEmailUrl(CONTACTS.sponsorEmail, "SPONSORSHIP", "Organization:%0A")} className="flex items-center gap-3 border border-green-500/40 p-4 hover:bg-green-500/10 transition-all">
              <span className="text-2xl">🤝</span><div><p className="text-green-400 font-bold">Corporate</p><p className="text-green-500/60 text-xs break-all">{CONTACTS.sponsorEmail}</p></div>
            </a>
          </div>
        </div>
      )
    },
    learn: {
      title: "LEARNING PATHWAYS",
      scrollable: true,
      content: (
        <div className="space-y-4 text-sm">
          {[
            { level: "🔰 Beginner Track", items: ["Month 1-2: Networking, Linux, Python basics", "Month 3-4: Cybersecurity concepts, Cryptography", "Month 5-6: CTF challenges, Home lab setup"], color: "border-green-500/30" },
            { level: "⚡ Intermediate Track", items: ["Network Penetration Testing", "Web App Security (OWASP Top 10)", "Active Directory Attacks & Defense", "Privilege Escalation", "Cloud Security Basics"], color: "border-yellow-500/30" },
            { level: "💀 Advanced Track", items: ["Exploit Development & Shellcoding", "Malware Analysis & Reverse Engineering", "Red Team Infrastructure & C2", "APT Simulation", "AI/ML Security Research"], color: "border-red-500/30" },
          ].map((track, i) => (
            <div key={i} className={`border ${track.color} p-4 bg-green-500/[0.02]`}>
              <h3 className="text-green-300 font-bold mb-2">{track.level}</h3>
              <ul className="space-y-1.5 text-xs text-green-400/60">
                {track.items.map((item, j) => <li key={j} className="flex items-start gap-2"><span className="text-green-600 mt-0.5">▸</span>{item}</li>)}
              </ul>
            </div>
          ))}
          <button onClick={() => window.open(getWhatsAppUrl("Learning inquiry"), '_blank')} className="w-full border border-green-500 py-3 text-green-400 font-bold hover:bg-green-500/10 transition-all text-sm">Start Learning → WhatsApp</button>
        </div>
      )
    },
    partner: {
      title: "PARTNER WITH US",
      content: (
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            {["Universities", "Financial Institutions", "Government", "Tech Companies", "NGOs", "Healthcare"].map((p, i) => (
              <div key={i} className="border border-green-500/20 p-3 text-center text-xs text-green-400/60 hover:border-green-500/50 transition-all">{p}</div>
            ))}
          </div>
          <a href={getEmailUrl(CONTACTS.partnerEmail, "PARTNERSHIP", "")} className="flex items-center gap-3 border border-green-500/40 p-4 hover:bg-green-500/10 transition-all">
            <span className="text-2xl">📧</span><div><p className="text-green-400 font-bold">Email Proposal</p><p className="text-green-500/60 text-xs break-all">{CONTACTS.partnerEmail}</p></div>
          </a>
        </div>
      )
    },
    awareness: {
      title: "AWARENESS PROGRAMS",
      content: (
        <div className="space-y-4 text-sm">
          <div className="border border-green-500/30 p-4">
            <h3 className="text-green-300 font-bold mb-2">📢 Available Workshops:</h3>
            <ul className="space-y-1.5 text-xs text-green-400/60">
              <li>• Phishing Simulation & Defense</li><li>• Password Security Best Practices</li><li>• Social Engineering Awareness</li><li>• Mobile Money Security (Uganda-specific)</li><li>• Ransomware Prevention</li>
            </ul>
          </div>
          <button onClick={() => window.open(getWhatsAppUrl("Schedule session"), '_blank')} className="w-full border border-green-500 p-4 hover:bg-green-500/10 transition-all text-green-400 font-bold text-sm">Schedule via WhatsApp</button>
        </div>
      )
    },
    operation: {
      title: "OPERATION DETAILS",
      scrollable: true,
      content: (
        <div className="space-y-4 text-sm">
          {operationsDetails.map((op, i) => (
            <div key={i} className="border border-green-500/20 p-4">
              <h3 className="text-green-300 font-bold mb-2">{op.title}</h3>
              <ul className="space-y-1.5 text-xs text-green-400/60">{op.details.map((d, j) => <li key={j} className="flex gap-2"><span className="text-green-600">▸</span>{d}</li>)}</ul>
            </div>
          ))}
        </div>
      )
    }
  };

  // Manifesto items
  const manifestoItems = [
    "Cybersecurity is a fundamental right, not a privilege.",
    "We defend Uganda's digital infrastructure with unwavering resolve.",
    "We share knowledge freely to empower our community.",
    "We innovate relentlessly—stagnation is vulnerability.",
    "We operate with integrity, transparency, and ethical purpose.",
    "We mentor the next generation—our greatest asset.",
    "We never stop learning; the adversary never stops adapting.",
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden" style={{ fontFamily: "'Courier New', 'Fira Code', 'Source Code Pro', 'Consolas', 'Monaco', 'Lucida Console', monospace" }}>
      
      {/* Fancy Loader - Card Style with Progress Bar */}
      {showLoader && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-fadeIn">
          <div className="border border-green-500/30 bg-black/95 p-6 w-[92vw] max-w-lg rounded-sm shadow-[0_0_50px_rgba(34,197,94,0.1)]">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 border-b border-green-500/20 pb-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span className="text-green-400 text-xs tracking-wider">CDEF SECURE BOOT // v1.0.1</span>
              <span className="ml-auto text-green-500/50 text-xs animate-pulse">● ACTIVE</span>
            </div>
            
            {/* Terminal Lines */}
            <div ref={loaderRef} className="h-40 overflow-y-auto text-xs text-green-400/80 space-y-1.5 mb-4 font-mono">
              {loaderLines.map((line, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-green-600/50">[{String(i + 1).padStart(2, '0')}]</span>
                  <span className="text-green-400/90">{line}</span>
                  {i === loaderLines.length - 1 && loaderLines.length < 6 && (
                    <span className="animate-pulse text-green-400">▌</span>
                  )}
                </div>
              ))}
              {loaderLines.length === 6 && (
                <div className="flex gap-2 text-green-500 font-bold mt-2">
                  <span className="text-green-600/50">[OK]</span>
                  <span>System initialized successfully!</span>
                </div>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-green-500/60">INITIALIZING SYSTEM</span>
                <span className="text-green-400 font-bold">{loaderProgress}%</span>
              </div>
              <div className="relative w-full h-1.5 bg-green-500/10 overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-600 via-green-400 to-green-600 transition-all duration-300 ease-out"
                  style={{ width: `${loaderProgress}%` }}
                >
                  {/* Scanning line effect */}
                  <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-green-400/50 to-transparent animate-pulse"></div>
                </div>
                {/* Glitch dots */}
                <div className="absolute top-0 left-0 w-full h-full flex justify-between px-1">
                  {[...Array(20)].map((_, i) => (
                    <span key={i} className="w-px h-full bg-green-500/5"></span>
                  ))}
                </div>
              </div>
              {/* Decorative binary - using client-only component */}
              <BinaryStream />
            </div>
          </div>
        </div>
      )}

      {/* Background */}
      <div className="fixed inset-0 opacity-[0.04] md:opacity-[0.06]">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(34,197,94,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.15) 1px, transparent 1px)`, backgroundSize: '32px 32px' }}></div>
      </div>
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.01] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzIiBoZWlnaHQ9IjMiPjxyZWN0IHdpZHRoPSIzIiBoZWlnaHQ9IjMiIGZpbGw9IiNmZmYiIC8+PC9zdmc+')]"></div>

      {/* Modals */}
      {Object.entries(contactMethods).map(([key, modal]) => (
        <CardModal key={key} isOpen={activeModal === key} onClose={() => setActiveModal(null)} title={modal.title} scrollable={modal.scrollable ?? false}>
          {modal.content}
        </CardModal>
      ))}

      {/* Navbar */}
      <Navbar onJoin={() => setActiveModal('join')} onPartner={() => setActiveModal('partner')} />

      {/* Floating Chat */}
      <div className="fixed bottom-5 right-4 z-[60] flex flex-col items-end gap-2">
        {showChat && (
          <div className="animate-slideUp bg-black border border-green-500/40 rounded-xl p-4 w-[80vw] max-w-[280px] shadow-[0_0_20px_rgba(34,197,94,0.2)] backdrop-blur-sm mb-2">
            <div className="flex justify-between items-center mb-3">
              <span className="text-green-400 text-sm font-bold">💬 CDEF UGANDA</span>
              <button onClick={() => setShowChat(false)} className="text-green-500/60 hover:text-green-400">✕</button>
            </div>
            <div className="space-y-2">
              <button onClick={() => { setShowChat(false); setActiveModal('join'); }} className="w-full text-left text-sm text-green-400/80 hover:text-green-300 hover:bg-green-500/10 p-2.5 rounded-lg border border-green-500/20 transition-all">🔰 Join the team</button>
              <button onClick={() => { setShowChat(false); setActiveModal('learn'); }} className="w-full text-left text-sm text-green-400/80 hover:text-green-300 hover:bg-green-500/10 p-2.5 rounded-lg border border-green-500/20 transition-all">📚 Learning paths</button>
              <button onClick={() => { setShowChat(false); setActiveModal('support'); }} className="w-full text-left text-sm text-green-400/80 hover:text-green-300 hover:bg-green-500/10 p-2.5 rounded-lg border border-green-500/20 transition-all">💰 Support us</button>
            </div>
          </div>
        )}
        <button onClick={() => setShowChat(!showChat)} className="relative bg-green-500/20 border-2 border-green-500/50 rounded-full w-12 h-12 flex items-center justify-center text-xl hover:bg-green-500/30 hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all active:scale-95">
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span><span>💬</span>
        </button>
      </div>

      {/* Main Content - Hidden until loader completes */}
      {!showLoader && (
        <div className="relative z-10 pt-20 md:pt-24">
          
          {/* Hero Section - Moved up, compact */}
          <div className="relative flex flex-col items-center justify-center px-4 pt-2 md:pt-8 pb-15 min-h-[90svh] md:min-h-[85vh]">
            <div className="text-center max-w-4xl w-full flex-1 flex flex-col justify-center">
              {/* Secure connection text - moved up on mobile */}
              <div className="inline-block border border-green-500/40 px-2 md:px-3 py-1 md:py-1.5 mb-10 md:mb-6">
                <span className="text-green-500 text-[10px] md:text-sm tracking-[0.2em]">[ CYBER RECRUITMENT OPERATION 2026 ]</span>
              </div>
              
              <div className="relative mb-5 md:mb-1">
                {/* Enlarged on mobile */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
                  <span className="text-green-400 block glitch-text mb-1">CYBER DEFENCE</span>
                  <span className="text-green-400 block glitch-text text-3xl sm:text-5xl md:text-7xl lg:text-8xl">= UGANDA =</span>
                </h1>
                <div className="absolute -inset-4 bg-green-500/[0.03] blur-3xl -z-10"></div>
              </div>
              
              <p className="text-green-500/80 text-sm md:text-xl tracking-[0.15em] mb-10 md:mb-6 h-6 md:h-10 flex items-center justify-center">
                <TypewriterLoop texts={typingTexts} speed={40} eraseSpeed={25} pauseTime={1800} />
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => setActiveModal('join')} className="relative group border border-green-500 px-6 py-3.5 text-sm md:text-base text-green-400 hover:bg-green-500/10 hover:shadow-[0_0_25px_rgba(34,197,94,0.3)] transition-all uppercase tracking-widest active:scale-95 overflow-hidden w-full sm:w-auto rounded-sm">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-400 to-transparent animate-border-scan"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-400 to-transparent animate-border-scan-reverse"></div>
                  </div>
                  <span className="relative z-10">Join The Collective</span>
                </button>
                <button onClick={() => setActiveModal('support')} className="relative group border border-green-500/50 px-6 py-3.5 text-sm md:text-base text-green-500/70 hover:bg-green-500/5 hover:text-green-400 hover:shadow-[0_0_25px_rgba(34,197,94,0.3)] transition-all uppercase tracking-widest active:scale-95 overflow-hidden w-full sm:w-auto rounded-sm">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-400 to-transparent animate-border-scan"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-400 to-transparent animate-border-scan-reverse"></div>
                  </div>
                  <span className="relative z-10">Support The Mission</span>
                </button>
              </div>
            </div>

            {/* Scroll Arrow - Positioned at the bottom of hero */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <ScrollArrow />
            </div>
          </div>

          {/* Stats - Below the fold */}
          <FlyInSection className="border-y border-green-500/20 py-5 px-4">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div><CountUp end={500} suffix="+" /><div className="text-green-500/50 text-xs md:text-sm tracking-wider mt-1">Threats Neutralized</div></div>
              <div><CountUp end={200} suffix="+" /><div className="text-green-500/50 text-xs md:text-sm tracking-wider mt-1">Trained Operatives</div></div>
              <div><CountUp end={50} suffix="+" /><div className="text-green-500/50 text-xs md:text-sm tracking-wider mt-1">Organizations Secured</div></div>
              <div><div className="text-2xl sm:text-3xl md:text-4xl font-black text-green-400">24/7</div><div className="text-green-500/50 text-xs md:text-sm tracking-wider mt-1">Monitoring</div></div>
            </div>
          </FlyInSection>

          {/* Main Card - Now matches navbar width (max-w-5xl) */}
          <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
            <div className="relative border border-green-500/30 bg-black/95 p-4 md:p-8 lg:p-10 backdrop-blur">
              {/* Corner accents */}
              <div className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-green-500"></div>
              <div className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-green-500"></div>
              <div className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-green-500"></div>
              <div className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-green-500"></div>

              <div className="border-b border-green-500/20 pb-3 mb-6 md:mb-8 flex items-center gap-2 text-xs md:text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <span className="text-green-500/60">[SECURE CHANNEL]</span>
                <span className="hidden md:inline text-green-500/30">//</span>
                <span className="hidden md:inline text-green-500/40">NODE: UG-KLA-01</span>
              </div>

              <div className="space-y-10 md:space-y-14 text-green-400">
                
                {/* About with Typewriter on Mobile */}
                <FlyInSection>
                  <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
                    {/* Green blinking box instead of arrow */}
                    <span className="inline-block w-3 h-3 md:w-4 md:h-4 bg-green-500 animate-pulse flex-shrink-0"></span>
                    <h2 className="text-lg md:text-2xl font-black text-green-300 tracking-wider">
                      <GlitchText text="ABOUT CYBER DEFENCE UGANDA" />
                      {aboutComplete && <span className="ml-2 text-green-500 text-xs animate-pulse hidden md:inline">[LOADED]</span>}
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div className="border-l-2 border-green-500/30 pl-4 space-y-3 text-sm md:text-base text-green-400/80 leading-relaxed">
                      {isMobile ? (
                        // Mobile: Typewriter effect for about text
                        <div>
                          <TypewriterStay text={aboutText} speed={20} className="text-green-400/80" />
                        </div>
                      ) : (
                        <SequentialTypewriter 
                          items={aboutSentences} 
                          speed={15} 
                          onAllComplete={() => setAboutComplete(true)}
                        />
                      )}
                    </div>
                    <div className="border border-green-500/20 p-4 space-y-2 text-sm md:text-base">
                      <p className="text-green-300 font-bold text-base md:text-lg">🎯 Core Focus:</p>
                      <p className="text-green-400/70">→ Critical Infrastructure Protection</p>
                      <p className="text-green-400/70">→ Financial Sector Security</p>
                      <p className="text-green-400/70">→ Government Digital Transformation</p>
                      <p className="text-green-400/70">→ SME Cyber Resilience</p>
                      <p className="text-green-400/70">→ Public Awareness & Education</p>
                    </div>
                  </div>
                </FlyInSection>

                {/* Philosophy - Collapsible on Mobile */}
                <FlyInSection delay={100}>
                  <CollapsibleHeader 
                    title="OUR PHILOSOPHY" 
                    isOpen={philosophyOpen} 
                    onToggle={() => setPhilosophyOpen(!philosophyOpen)} 
                    isMobile={isMobile} 
                  />
                  {(philosophyOpen || !isMobile) && (
                    <div className="space-y-4 md:space-y-5 animate-fadeIn">
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        {[
                          { icon: "🧠", title: "Think Different", desc: "We reject conventional wisdom. We create novel attack vectors to understand how systems can be broken, then architect defenses that anticipate the unexpected." },
                          { icon: "🔮", title: "Anticipate Threats", desc: "Predictive threat intelligence. We stay ahead of adversaries by thinking like them. In cyberspace, reaction is failure; anticipation is victory." },
                          { icon: "⚡", title: "Move Fast, Stay Silent", desc: "Agile response units deploy within minutes. Operations remain classified; results speak publicly. Surgical precision over brute force." },
                        ].map((item, i) => (
                          <HackerCard key={i} className="p-4">
                            <div className="text-2xl mb-2 group-hover:animate-bounce">{item.icon}</div>
                            <h3 className="text-green-300 font-bold text-base md:text-lg mb-2">{item.title}</h3>
                            <p className="text-green-500/60 text-sm md:text-base leading-relaxed">{item.desc}</p>
                          </HackerCard>
                        ))}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                        {[
                          { icon: "🎯", title: "Offensive Mindset, Defensive Purpose", desc: "We train operatives to think like attackers. Adversarial perspective informs every defensive measure we implement." },
                          { icon: "🌍", title: "Uganda-First Approach", desc: "Solutions tailored to Uganda's unique digital landscape. Global knowledge, local application, national impact." },
                          { icon: "📚", title: "Knowledge Democratization", desc: "Cybersecurity knowledge should not be gatekept. Security through education is a fortress against digital threats." },
                          { icon: "🔬", title: "Continuous Evolution", desc: "The threat landscape evolves daily. Our techniques must evolve faster. Yesterday's defenses cannot stop tomorrow's attacks." },
                        ].map((item, i) => (
                          <div key={i} className="border border-green-500/20 p-4 space-y-2 hover:border-green-500/40 transition-all">
                            <h3 className="text-green-300 font-bold text-sm md:text-base flex items-center gap-2"><span>{item.icon}</span>{item.title}</h3>
                            <p className="text-sm md:text-base text-green-400/70">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </FlyInSection>

                {/* THE CDEF MANIFESTO - Independent Section with Typewriter on Mobile */}
                <FlyInSection delay={150}>
                  <div className="border border-green-500/30 bg-green-500/[0.02] p-4 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
                      {/* Green blinking box instead of arrow */}
                      <span className="inline-block w-3 h-3 md:w-4 md:h-4 bg-green-500 animate-pulse flex-shrink-0"></span>
                      <h2 className="text-lg md:text-2xl font-black text-green-300 tracking-wider">
                        <GlitchText text="THE CDEF MANIFESTO" />
                        {manifestoComplete && <span className="ml-2 text-green-500 text-xs animate-pulse hidden md:inline">[COMPLETE]</span>}
                      </h2>
                    </div>
                    <div className="text-sm md:text-base text-green-400/70">
                      {isMobile ? (
                        // Mobile: Typewriter effect for manifesto items
                        <div className="space-y-2">
                          <TypewriterStay 
                            text={manifestoItems.join(" ")} 
                            speed={15} 
                            className="text-green-400/70 leading-relaxed"
                          />
                        </div>
                      ) : (
                        <SequentialTypewriter 
                          items={manifestoItems} 
                          speed={25} 
                          onAllComplete={() => setManifestoComplete(true)}
                        />
                      )}
                    </div>
                  </div>
                </FlyInSection>

                {/* Join */}
                <FlyInSection delay={200}>
                  <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
                    {/* Green blinking box instead of arrow */}
                    <span className="inline-block w-3 h-3 md:w-4 md:h-4 bg-green-500 animate-pulse flex-shrink-0"></span>
                    <h2 className="text-lg md:text-2xl font-black text-green-300 tracking-wider"><GlitchText text="JOIN THE COLLECTIVE" /></h2>
                  </div>
                  <p className="text-sm md:text-base text-green-400/80 border-l-2 border-green-500/30 pl-4 mb-5 md:mb-6">
                    <span className="text-green-300 font-bold">// OPEN RECRUITMENT:</span> Seeking innovative minds who challenge assumptions, break boundaries, and think beyond the obvious.
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                    <HackerCard onClick={() => setActiveModal('join')} className="p-4">
                      <h3 className="text-green-300 font-bold text-base md:text-lg mb-3">🔰 Beginners & Enthusiasts</h3>
                      <ul className="space-y-2 text-sm md:text-base text-green-400/70">
                        <li className="flex gap-2"><span className="text-green-600">▸</span>No experience required</li>
                        <li className="flex gap-2"><span className="text-green-600">▸</span>Structured mentorship</li>
                        <li className="flex gap-2"><span className="text-green-600">▸</span>Virtual labs & CTF challenges</li>
                      </ul>
                      <p className="text-green-400 text-sm mt-3 group-hover:text-green-300">[ Click to Apply ] →</p>
                    </HackerCard>
                    <HackerCard onClick={() => setActiveModal('join')} className="p-4">
                      <h3 className="text-green-300 font-bold text-base md:text-lg mb-3">⚡ Experienced Operators</h3>
                      <ul className="space-y-2 text-sm md:text-base text-green-400/70">
                        <li className="flex gap-2"><span className="text-green-600">▸</span>Red/Blue team operations</li>
                        <li className="flex gap-2"><span className="text-green-600">▸</span>Zero-day research</li>
                        <li className="flex gap-2"><span className="text-green-600">▸</span>Lead workshops & training</li>
                      </ul>
                      <p className="text-green-400 text-sm mt-3 group-hover:text-green-300">[ Click to Apply ] →</p>
                    </HackerCard>
                  </div>
                  <div className="text-center mt-5 md:mt-6">
                    <button onClick={() => setActiveModal('learn')} className="group border-2 border-green-500/50 px-6 md:px-8 py-3.5 md:py-4 hover:bg-green-500/10 hover:border-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all w-full md:w-auto">
                      <span className="text-green-400 font-bold text-sm md:text-base tracking-widest group-hover:text-green-300">📚 Explore Learning Pathways</span>
                    </button>
                  </div>
                </FlyInSection>

                {/* Operations - Collapsible on Mobile */}
                <FlyInSection delay={200}>
                  <CollapsibleHeader 
                    title="OPERATIONS & CAPABILITIES" 
                    isOpen={operationsOpen} 
                    onToggle={() => setOperationsOpen(!operationsOpen)} 
                    isMobile={isMobile} 
                  />
                  {(operationsOpen || !isMobile) && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 animate-fadeIn">
                      {[
                        { icon: "🛡️", title: "Red Teaming", desc: "Adversarial simulation" },
                        { icon: "🔍", title: "Threat Intel", desc: "Dark web monitoring" },
                        { icon: "🏗️", title: "Architecture", desc: "Resilient systems" },
                        { icon: "📡", title: "Response", desc: "Rapid containment" },
                        { icon: "🎓", title: "Training", desc: "Cyber warriors" },
                        { icon: "🔐", title: "Pen Testing", desc: "Web, mobile, network" },
                        { icon: "💣", title: "Exploit Dev", desc: "Custom tooling" },
                        { icon: "🌐", title: "OSINT", desc: "Intel gathering" },
                      ].map((op, i) => (
                        <HackerCard key={i} onClick={() => setActiveModal('operation')} className="p-3 md:p-4">
                          <div className="text-xl md:text-2xl mb-2 group-hover:scale-110 transition-transform">{op.icon}</div>
                          <h3 className="text-green-300 font-bold text-sm md:text-base">{op.title}</h3>
                          <p className="text-green-500/50 text-xs md:text-sm">{op.desc}</p>
                        </HackerCard>
                      ))}
                    </div>
                  )}
                </FlyInSection>

                {/* Support */}
                <FlyInSection delay={300}>
                  <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
                    {/* Green blinking box instead of arrow */}
                    <span className="inline-block w-3 h-3 md:w-4 md:h-4 bg-green-500 animate-pulse flex-shrink-0"></span>
                    <h2 className="text-lg md:text-2xl font-black text-green-300 tracking-wider"><GlitchText text="SUPPORT THE MISSION" /></h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                    <HackerCard onClick={() => setActiveModal('support')} className="p-5 md:p-6 space-y-4">
                      <h3 className="text-green-300 font-bold text-base md:text-lg">💰 FUND OPERATIONS</h3>
                      <p className="text-green-400/70 text-sm md:text-base">Cyber defense requires resources. Support tools, infrastructure, and research.</p>
                      <p className="text-green-400 text-sm group-hover:text-green-300">[ Click to Support ] →</p>
                    </HackerCard>
                    <HackerCard onClick={() => setActiveModal('partner')} className="p-5 md:p-6 space-y-4">
                      <h3 className="text-green-300 font-bold text-base md:text-lg">🤝 PARTNER WITH US</h3>
                      <p className="text-green-400/70 text-sm md:text-base">Collaborate for a secure digital Uganda.</p>
                      <p className="text-green-400 text-sm group-hover:text-green-300">[ Click to Partner ] →</p>
                    </HackerCard>
                  </div>
                </FlyInSection>

                {/* Final CTA */}
                <div className="text-center border-t border-green-500/20 pt-8 md:pt-10">
                  <p className="text-green-400 text-base md:text-2xl tracking-wider mb-4">
                    <span className="text-green-600">root@cdef.ug:~$ </span><span className="animate-pulse">_</span>
                  </p>
                  <button onClick={() => setActiveModal('join')} className="relative group border-2 border-green-500 px-8 md:px-10 py-4 md:py-5 text-base md:text-xl font-black uppercase tracking-[0.2em] text-green-400 hover:bg-green-500/10 hover:shadow-[0_0_50px_rgba(34,197,94,0.5)] transition-all active:scale-95 overflow-hidden w-full md:w-auto">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent animate-border-scan"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent animate-border-scan-reverse"></div>
                    </div>
                    <span className="relative z-10">Join The Resistance</span>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-green-500/20 mt-8 md:mt-10 pt-4 text-center space-y-2">
                <p className="text-green-600/40 text-xs tracking-[0.3em]">[ END TRANSMISSION ]</p>
                <p className="text-green-500/30 text-xs">CYBER DEFENCE UGANDA // CLASSIFIED</p>
                <p className="text-green-500/20 text-sm h-6 flex items-center justify-center">
                  <span className="mr-1">🇺🇬</span>
                  {footerComplete ? (
                    <span className="animate-pulse-slow">Protecting Uganda&apos;s Digital Sovereignty</span>
                  ) : (
                    <TypewriterOnce text="Protecting Uganda's Digital Sovereignty" speed={60} onComplete={() => setFooterComplete(true)} />
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes glitch{0%,100%{transform:none;opacity:1}7%{transform:skew(-.5deg,-.9deg);opacity:.75}10%{transform:none;opacity:1}27%{transform:none;opacity:1}30%{transform:skew(.8deg,-.1deg);opacity:.75}35%{transform:none;opacity:1}52%{transform:none;opacity:1}55%{transform:skew(-1deg,.2deg);opacity:.75}60%{transform:none;opacity:1}72%{transform:none;opacity:1}75%{transform:skew(.4deg,1deg);opacity:.75}80%{transform:none;opacity:1}100%{transform:none;opacity:1}}
        @keyframes glitch-1{0%,100%{transform:none}20%{transform:translate(-2px,2px)}40%{transform:translate(-1px,-1px)}60%{transform:translate(2px,1px)}80%{transform:translate(1px,-2px)}}
        @keyframes glitch-2{0%,100%{transform:none}20%{transform:translate(2px,-1px)}40%{transform:translate(1px,2px)}60%{transform:translate(-2px,-1px)}80%{transform:translate(-1px,1px)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulseSlow{0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes borderScan{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        @keyframes borderScanReverse{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}
        @keyframes scrollBounce{0%,100%{transform:rotate(45deg) translateY(0);opacity:0.4}50%{transform:rotate(45deg) translateY(8px);opacity:1}}
        .glitch-text:hover{animation:glitch 1s infinite linear alternate-reverse}
        .animate-glitch-1{animation:glitch-1 .3s infinite linear alternate-reverse}
        .animate-glitch-2{animation:glitch-2 .4s infinite linear alternate-reverse}
        .animate-fadeIn{animation:fadeIn .3s ease-out}
        .animate-slideUp{animation:slideUp .3s ease-out}
        .animate-spin-slow{animation:spinSlow 8s linear infinite}
        .animate-pulse-slow{animation:pulseSlow 2s ease-in-out infinite}
        .animate-border-scan{animation:borderScan 2s linear infinite}
        .animate-border-scan-reverse{animation:borderScanReverse 2s linear infinite}
        .animate-scroll-bounce{animation:scrollBounce 2s ease-in-out infinite}
      `}</style>
    </div>
  );
}