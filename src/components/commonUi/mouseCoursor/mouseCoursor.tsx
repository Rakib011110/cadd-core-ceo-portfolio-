import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ParticleCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      color: string;
      life: number;
    }>
  >([]);
  const [hoverState, setHoverState] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Create new particles along the trail
      if (Math.random() > 0.7) {
        const newParticle = {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 4 + 2,
          color: `hsl(${Math.random() * 60 + 200}, 80%, 60%)`,
          life: 100,
        };
        setParticles((prev) => [...prev.slice(-15), newParticle]);
      }
    };

    const handleHover = () => setHoverState(true);
    const handleHoverEnd = () => setHoverState(false);

    window.addEventListener("mousemove", handleMouseMove);

    const hoverables = document.querySelectorAll("[data-cursor-hover]");
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", handleHoverEnd);
    });

    // Particle animation loop
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({ ...p, life: p.life - 2 })).filter((p) => p.life > 0)
      );
    }, 30);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", handleHoverEnd);
      });
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="fixed rounded-full pointer-events-none z-[9998]"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life / 100,
            transform: `translate(-50%, -50%) scale(${particle.life / 100})`,
          }}
        />
      ))}

      {/* Main cursor */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
        }}>
        <motion.div
          className="rounded-full bg-gradient-to-br from-blue-400 to-purple-500"
          animate={{
            width: hoverState ? 30 : 20,
            height: hoverState ? 30 : 20,
            opacity: hoverState ? 1 : 0.8,
          }}
          transition={{ type: "spring", stiffness: 500 }}>
          {hoverState && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.div>
      </div>
    </>
  );
}
