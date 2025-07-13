"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { 
    ArrowDown, 
    ArrowUp, 
    Briefcase, 
    GraduationCap, 
    Award, 
    Wrench, 
    ClipboardList, 
    Mail,
    Phone,
    Linkedin,
    User
} from "lucide-react";

// Type definitions for content items
interface ExperienceItem {
    title: string;
    company: string;
    period: string;
    description: string;
}

interface EducationItem {
    degree: string;
    institution: string;
    period: string;
    details: string;
}

interface ProjectItem {
    description: string;
}

interface CertificationItem {
    title?: string;
    org?: string;
    year?: string;
}

type ContentItem = ExperienceItem | EducationItem | ProjectItem | CertificationItem;

interface AboutSection {
    side: "left" | "right";
    icon: ReactNode;
    title: string;
    description?: string;
    imageUrl?: string;
    imagePosition?: "top" | "bottom";
    videoUrl?: string;
    tags?: string[];
    content?: ContentItem[];
}

// Data for the sections. 
// You can add 'imageUrl' and 'imagePosition' ('top' or 'bottom') for images,
// or 'videoUrl' for YouTube videos to any section object.
const aboutSections: AboutSection[] = [
    {
        side: "left",
        icon: <User className="mr-3 h-7 w-7 text-[var(--highlight-color)]" />,
        title: "About Me",
        description: "I am a professional structural engineer specializing in the analysis, design, and detailing of complex structures. Since 2014, I have applied my skills to a wide range of projects, ensuring safety, compliance, and efficiency from conception to completion. My academic pursuits, culminating in a Master's in Disaster Risk Reduction Engineering from BUET, have solidified my focus on creating resilient infrastructure. Beyond my engineering work, I am a well-known professional trainer, having mentored over 2,000 students and engineers. As an Autodesk and Microsoft Certified Trainer, I develop and deliver high-impact training programs that foster career growth and technical proficiency in the civil engineering community.",
    },
    {
        side: "right",
        icon: <Briefcase className="mr-3 h-7 w-7 text-[var(--highlight-color)]" />,
        title: "Professional Experience",
        // Example of adding a video to a section
        videoUrl: "https://www.youtube.com/embed/dGz4q6hC1T4", // Sample video about structural engineering
        content: [
            {
                title: "Building Consultant (Sr. Structural Engineer)",
                company: "MAK Consultants",
                period: "March 2015 - Present",
                description: "I manage the day-to-day operations for multiple engineering projects, from initial concept through to final design. My role involves leading project teams, managing client relationships, and liaising with regulatory bodies to ensure seamless project execution."
            },
            {
                title: "Faculty Member, Structural Engineering Dept.",
                company: "CADD CORE Training Institute",
                period: "December 2014 - Present",
                description: "As a lead instructor and team leader for over 50 engineers, I have trained more than 2,000 individuals. I am the author of official training guides for critical engineering software like ETABS and STAAD.Pro."
            },
            {
                title: "Support Engineer (Construction Dept.)",
                company: "Bangladesh Building Systems Limited",
                period: "March 2013 – November 2015",
                description: "I was responsible for the construction and erection of pre-engineered steel buildings, coordinating between functional units, the corporate office, and production to ensure projects met their time schedules and targets."
            }
        ]
    },
    {
        side: "left",
        icon: <GraduationCap className="mr-3 h-7 w-7 text-[var(--highlight-color)]" />,
        title: "Education",
        content: [
            {
                degree: "MEngg in Disaster Risk Reduction Engineering",
                institution: "JIDPUS, Bangladesh University of Engineering & Technology (BUET)",
                period: "2023-2025",
                details: "CGPA: 3.20/4.00 (30 Credit completed)"
            },
            {
                degree: "BSc in Civil Engineering",
                institution: "IUBAT - International University of Engineering and Technology",
                period: "2010-2014",
                details: "CGPA: 3.39/4.00"
            }
        ]
    },
    {
        side: "right",
        icon: <Wrench className="mr-3 h-7 w-7 text-[var(--highlight-color)]" />,
        title: "Core Expertise",
        tags: [
            "Structural Analysis & Design",
            "Disaster Resilient Engineering",
            "Finite Element Modeling",
            "Project Management",
            "ETABS",
            "STAAD.Pro",
            "AutoCAD",
            "Revit",
            "Professional Training"
        ],
    },
    {
        side: "left",
        icon: <ClipboardList className="mr-3 h-7 w-7 text-[var(--highlight-color)]" />,
        title: "Key Projects",
        // Example of adding an image to a section
        imageUrl: "https://placehold.co/600x400/1e293b/e2e8f0?text=Project+Highlight",
        imagePosition: "top",
        content: [
            { description: "Detail Engineering Assessment for KNIT Concern Group: Led the structural assessment of 110 industrial buildings covering approximately 500,000 sq. ft." },
            { description: "Detail Engineering Assessment for Palmal Group: Conducted comprehensive structural evaluations for a major industrial client." },
            { description: "Design of 15-Storied Multipurpose Building: Delivered the complete structural design for a high-rise building in Chittagong." },
        ]
    },
    {
        side: "right",
        icon: <Award className="mr-3 h-7 w-7 text-[var(--highlight-color)]" />,
        title: "Licenses & Certifications",
        content: [
            { title: "Corporate Member", org: "Institution of Engineers, Bangladesh (IEB)" },
            { title: "Member", org: "American Society of Civil Engineers (ASCE)" },
            { title: "Member", org: "American Concrete Institute (ACI)" },
            { title: "Assessor", org: "Bangladesh Technical Education Board (BTEB)" },
            { title: "Microsoft Certified Trainer", org: "", year: "2021" },
            { title: "Autodesk Certified Instructor", org: "", year: "2017" },
            { title: "Autodesk Certified Professional: AutoCAD & Revit", org: "", year: "2017" },
            { title: "Certified Assessor (Pedagogy Level-4)", org: "BTEB", year: "2018" }
        ]
    }
];

// Type guard functions
const isExperienceItem = (item: ContentItem): item is ExperienceItem => {
    return 'title' in item && 'company' in item && 'period' in item && 'description' in item;
};

const isEducationItem = (item: ContentItem): item is EducationItem => {
    return 'degree' in item && 'institution' in item && 'period' in item && 'details' in item;
};

const isProjectItem = (item: ContentItem): item is ProjectItem => {
    return 'description' in item && !('degree' in item) && !('title' in item);
};

const isCertificationItem = (item: ContentItem): item is CertificationItem => {
    return 'org' in item || ('title' in item && 'year' in item && !('company' in item));
};

const Banner = () => (
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-main)]">Md. Hachnayen Ahmed, MIEB, GMICE</h1>
        <p className="text-xl md:text-2xl text-[var(--text-secondary)] mt-2">Structural Engineer | Trainer | Disaster Prevention Specialist</p>
        <div className="flex justify-center items-center gap-6 mt-6 flex-wrap">
            <a href="mailto:hachnayen@gmail.com" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--highlight-color)] transition-colors">
                <Mail size={18} />
                hachnayen@gmail.com
            </a>
            <a href="tel:+8801711486779" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--highlight-color)] transition-colors">
                <Phone size={18} />
                +8801711486779
            </a>
            <a href="https://www.linkedin.com/in/Hachnayen" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--highlight-color)] transition-colors">
                <Linkedin size={18} />
                LinkedIn: Hachnayen
            </a>
        </div>
    </div>
);

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

// SectionRenderer now handles images and videos.
const SectionRenderer = ({ side }: { side: "left" | "right" }) => {
  return (
    <> 
      {aboutSections
        .filter((section) => section.side === side)
        .map((block, index) => (
          <ContentBlock key={index} delay={index * 100}>
            {block.imageUrl && block.imagePosition === "top" && (
                <img src={block.imageUrl} alt={block.title} className="w-full mb-4 rounded-lg" />
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
            
            {block.content && Array.isArray(block.content) && (
                <ul className="space-y-4 mt-4">
                    {block.content.map((item, i) => (
                        <li key={i} className="text-[var(--text-secondary)] border-l-2 border-[var(--highlight-color)] pl-4">
                            {/* Experience Item */}
                            {isExperienceItem(item) && (
                                <>
                                    <h3 className="font-semibold text-[var(--text-main)] text-lg">{item.title}</h3>
                                    <p className="text-sm font-medium">{item.company}</p>
                                    <p className="text-xs opacity-75 mb-1">{item.period}</p>
                                    <p>{item.description}</p>
                                </>
                            )}
                            
                            {/* Education Item */}
                            {isEducationItem(item) && (
                                <>
                                    <h3 className="font-semibold text-[var(--text-main)] text-lg">{item.degree}</h3>
                                    <p className="text-sm font-medium">{item.institution}</p>
                                    <p className="text-xs opacity-75 mb-1">{item.period}</p>
                                    <p className="text-xs opacity-75">{item.details}</p>
                                </>
                            )}
                            
                            {/* Project Item */}
                            {isProjectItem(item) && (
                                <p>{item.description}</p>
                            )}
                            
                            {/* Certification Item */}
                            {isCertificationItem(item) && (
                                <p>
                                    <span className="font-semibold text-[var(--text-main)]">
                                        {item.title || 'Certification'}:
                                    </span>
                                    {item.org && ` ${item.org}`}
                                    {item.year && ` (${item.year})`}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {block.videoUrl && (
                <div className="aspect-video w-full rounded-lg overflow-hidden border border-[var(--border-color)] bg-black/20 mt-4">
                    <iframe
                        src={block.videoUrl}
                        title={block.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}

            {block.imageUrl && block.imagePosition === "bottom" && (
                <img src={block.imageUrl} alt={block.title} className="w-full mt-4 rounded-lg" />
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

export default function App() {
  // Toggle dark mode for demonstration
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <>
      <GlobalStyles />
      <main className="max-w-6xl mx-auto min-h-screen overflow-x-hidden px-4 py-12 md:py-24">
        <Banner />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
          <div className="left-section">
            <SectionRenderer side="left" />
          </div>

          <CenterLine />

          <div className="right-section mt-8 lg:mt-0">
            <SectionRenderer side="right" />
          </div>
        </div>
      </main>
    </>
  );
}
