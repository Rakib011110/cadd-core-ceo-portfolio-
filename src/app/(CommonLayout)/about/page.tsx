"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { aboutSections } from "@/pages/About/aboutdata";



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


const ContentBlock = ({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 mb-8 transition-all duration-700 ease-out will-change-transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const SectionRenderer = ({ side }: { side: "left" | "right" }) => {
  return (
    <> 
    <div>
        <GlobalStyles />
    </div>
      {aboutSections
        .filter((section) => section.side === side)
        .map((block, index) => (
          <ContentBlock key={index} delay={index * 100}>
            {block.imageUrl && block.imagePosition === "top" && (
              <img
                src={block.imageUrl}
                alt="section-img"
                className="w-full mb-4 rounded-md"
              />
            )}

            <div className="flex items-center mb-4">{block.icon}<h2 className="text-2xl font-semibold">{block.title}</h2></div>

            {block.description && (
              <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                {block.description}
              </p>
            )}

            {block.tags && (
              <div className="flex flex-wrap gap-3 mt-4">
                {block.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full border border-sky-400/50 bg-sky-400/10 px-3 py-1 text-sm font-medium text-sky-300 transition duration-300 hover:bg-sky-500/20 hover:text-white hover:shadow-md hover:shadow-sky-400/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {block.isVideo && (
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-[var(--border-color)] bg-black/20 mt-4">
                <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
                    <iframe
                        src={`https://www.youtube.com/embed/XiC4hIKsjIY?si=V_1xle3dsUrFcNTx`}
                        title={block.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
              </div>
            )}

            {block.imageUrl && block.imagePosition === "bottom" && (
              <img
                src={block.imageUrl}
                alt="section-img"
                className="w-full mt-4 rounded-md"
              />
            )}
          </ContentBlock>
        ))}
    </>
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
    <main className="max-w-6xl mx-auto min-h-screen overflow-x-hidden px-4 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
        <div className="left-section">
          <ContentBlock delay={0}>
            <h1 className="text-3xl text-center font-bold md:text-6xl lg:text-left">CADD CORE</h1>
          </ContentBlock>
          <SectionRenderer side="left" />
        </div>

        <CenterLine />

        <div className="right-section mt-8 lg:mt-0">
          <ContentBlock delay={50}>
            <h1 className="text-5xl text-center font-bold md:text-5xl lg:text-left">MAK Consultants</h1>
          </ContentBlock>
          <SectionRenderer side="right" />
        </div>
      </div>
    </main>
  );
}
