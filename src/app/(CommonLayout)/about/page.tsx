// Filename: app/about/page.tsx

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  Briefcase,
  Code,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --bg-dark: #0f172a;
      --bg-light: #f8fafc;
      --text-dark: #e2e8f0;
      --text-light: #020617;
      --border-color-dark: rgba(51, 65, 85, 0.5);
      --border-color-light: rgba(203, 213, 225, 0.7);
      --highlight-color: #38bdf8;
      --highlight-shadow: rgba(56, 189, 248, 0.5);
    }
    html.dark {
      --bg-main: var(--bg-dark);
      --text-main: var(--text-dark);
      --text-secondary: #94a3b8;
      --bg-card: #1e293b;
      --border-color: var(--border-color-dark);
    }
    html:not(.dark) {
      --bg-main: var(--bg-light);
      --text-main: var(--text-light);
      --text-secondary: #475569;
      --bg-card: #ffffff;
      --border-color: var(--border-color-light);
    }
    body {
      background-color: var(--bg-main);
      color: var(--text-main);
      transition: background-color 0.5s, color 0.5s;
    }
    .center-line {
      background: linear-gradient(to bottom, transparent, var(--highlight-color), transparent);
      animation: flow 6s linear infinite;
    }
    @keyframes flow {
      0% {
        background-position: 0 -100vh;
      }
      100% {
        background-position: 0 100vh;
      }
    }
    .center-line-icon {
      animation: pulse 2.5s infinite ease-in-out;
    }
    .icon-up {
      animation-name: move-up, pulse;
      animation-duration: 5s, 2.5s;
      animation-iteration-count: infinite, infinite;
    }
    .icon-down {
      animation-name: move-down, pulse;
      animation-duration: 5s, 2.5s;
      animation-iteration-count: infinite, infinite;
    }
    @keyframes move-up {
      0% {
        top: 95%;
        opacity: 0;
      }
      25%,
      50% {
        opacity: 1;
      }
      75% {
        top: 5%;
        opacity: 1;
      }
      100% {
        top: 5%;
        opacity: 0;
      }
    }
    @keyframes move-down {
      0% {
        top: 5%;
        opacity: 0;
      }
      25%,
      50% {
        opacity: 1;
      }
      75% {
        top: 95%;
        opacity: 1;
      }
      100% {
        top: 95%;
        opacity: 0;
      }
    }
    @keyframes pulse {
      0%,
      100% {
        transform: translateX(-50%) scale(1);
        box-shadow: 0 0 15px var(--highlight-shadow);
      }
      50% {
        transform: translateX(-50%) scale(1.15);
        box-shadow: 0 0 25px var(--highlight-shadow);
      }
    }
  `}</style>
);

type ContentBlockProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

const ContentBlock = ({ children, className = "", delay = 0 }: ContentBlockProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => setIsVisible(true), delay);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`
        bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 mb-8
        transition-all duration-700 ease-out will-change-transform
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

const CenterLine = () => (
  <div className="center-line relative hidden w-0.5 lg:block">
    <div
      className="center-line-icon icon-down absolute left-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--highlight-color)] text-white"
      style={{ animationDelay: "0s" }}
    >
      <ArrowDown size={16} />
    </div>
    <div
      className="center-line-icon icon-up absolute left-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--highlight-color)] text-white"
      style={{ animationDelay: "2.5s" }}
    >
      <ArrowUp size={16} />
    </div>
  </div>
);

export default function AboutPage() {
  return (
    <>
      <GlobalStyles />
      <main className="max-w-6xl mx-auto min-h-screen overflow-x-hidden px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
          {/* Left Section - CADD CORE */}
          <div className="left-section">
            <ContentBlock delay={0}>
              <h1 className="text-4xl text-center font-bold md:text-6xl lg:text-left">CADD CORE</h1>
            </ContentBlock>

            <ContentBlock delay={100}>
              <div className="flex items-center mb-4">
                <TrendingUp className="w-8 h-8 mr-4 text-sky-400" />
                <h2 className="text-2xl font-semibold">Our Journey</h2>
              </div>
              <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                We started as a small initiative with a big vision. Through dedication and innovation, we have reached where we are today, focusing on Civil, AutoCAD, and professional design training.
              </p>
            </ContentBlock>

            <ContentBlock delay={200}>
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 mr-4 text-sky-400" />
                <h2 className="text-2xl font-semibold">Our Team</h2>
              </div>
              <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                Behind our success is a passionate team of talented individuals including CAD experts, civil engineers, and creative instructors dedicated to real-world technical skills.
              </p>
            </ContentBlock>

           <ContentBlock delay={300}>
  <h3 className="text-xl font-semibold mb-4 flex items-center">
    <Code className="w-6 h-6 mr-3 text-sky-400" />
    Tools & Technologies
  </h3>
  <div className="flex flex-wrap gap-3 items-center">
    {[
      "AutoCAD",
      "Revit",
      "Etabs",
      "SAFE",
      "STAAD.Pro",
      "Tekla Structures",
    ].map((tool) => (
      <span
        key={tool}
        className="rounded-full border border-sky-400/50 bg-sky-400/10 px-3 py-1 text-sm font-medium text-sky-300 transition duration-300 hover:bg-sky-500/20 hover:text-white hover:shadow-md hover:shadow-sky-400/30"
      >
        {tool}
      </span>
    ))}
  </div>
</ContentBlock>

          </div>

          {/* Center Line */}
          <CenterLine />

          {/* Right Section - MAK Consultants */}
          <div className="right-section mt-8 lg:mt-0">
            <ContentBlock delay={50}>
              <h1 className="text-4xl text-center font-bold md:text-6xl lg:text-left">MAK Consultants</h1>
            </ContentBlock>

            <ContentBlock delay={150}>
              <div className="flex items-center mb-4">
                <Lightbulb className="w-8 h-8 mr-4 text-sky-400" />
                <h2 className="text-2xl font-semibold">Engineering & Innovation</h2>
              </div>
              <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                We are committed to improving lives through engineering solutions in civil, architecture, and structural design. Innovation is at the core of our consultancy.
              </p>
            </ContentBlock>

            <ContentBlock delay={250}>
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 mr-4 text-sky-400" />
                <h2 className="text-2xl font-semibold">Future Vision</h2>
              </div>
              <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                Our aim is to expand globally by exploring emerging technologies like AI, BIM, and sustainable design solutions to deliver smarter infrastructure.
              </p>
            </ContentBlock>

            <ContentBlock delay={350}>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Briefcase className="w-6 h-6 mr-3 text-sky-400" />
                Project Highlights
              </h3>
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-[var(--border-color)] bg-black/20">
                <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
                  <p>Video embed placeholder</p>
                </div>
              </div>
            </ContentBlock>
          </div>
        </div>
      </main>
    </>
  );
}
