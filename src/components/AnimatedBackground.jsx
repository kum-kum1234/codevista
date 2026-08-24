import React, { useRef, useEffect, useCallback } from "react";

// Brand-colored particles for the constellation network.
const NODE_COLORS = ["#8B5CF6", "#1AACDB", "#EC4899", "#1FB671", "#E8A400"];

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d");
    let width, height, dpr;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // density scales with area, capped for performance
      const count = Math.min(70, Math.max(35, Math.floor((width * height) / 16000)));
      particlesRef.current = Array.from({ length: count }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1.4 + Math.random() * 1.8,
        color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const LINK_DIST = 130;
    const MOUSE_DIST = 160;

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // update + draw nodes
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.pulse += 0.02;

        const glow = 0.55 + Math.sin(p.pulse) * 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = glow;
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // links between nearby nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = "#8B5CF6";
            ctx.globalAlpha = (1 - dist / LINK_DIST) * 0.18;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // link to cursor — the "interactive" part
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = "#EC4899";
          ctx.globalAlpha = (1 - dist / MOUSE_DIST) * 0.5;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: "#120C24" }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes aurora-drift-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50%      { transform: translate(6%, -4%) rotate(6deg); }
        }
        @keyframes aurora-drift-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50%      { transform: translate(-5%, 5%) rotate(-5deg); }
        }
        @keyframes aurora-drift-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50%      { transform: translate(4%, 4%) rotate(4deg); }
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.15; }
          50%      { opacity: 0.9; }
        }
        .aurora-ribbon {
          position: absolute;
          filter: blur(80px);
          mix-blend-mode: screen;
          opacity: 0.55;
        }
        .bg-star {
          position: absolute;
          border-radius: 9999px;
          background: #fff;
          animation-name: star-twinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>

      {/* deep navy/plum base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 15% 10%, #241B4E 0%, #120C24 55%), radial-gradient(ellipse 80% 60% at 90% 90%, #1A1235 0%, #120C24 60%)",
        }}
      />

      {/* aurora light ribbons in brand colors, filling empty space with color */}
      <div
        className="aurora-ribbon"
        style={{
          top: "-10%",
          left: "-10%",
          width: "70%",
          height: "60%",
          background: "linear-gradient(135deg, #8B5CF6 0%, transparent 70%)",
          animation: "aurora-drift-1 26s ease-in-out infinite",
        }}
      />
      <div
        className="aurora-ribbon"
        style={{
          top: "10%",
          right: "-15%",
          width: "65%",
          height: "55%",
          background: "linear-gradient(225deg, #1AACDB 0%, transparent 70%)",
          animation: "aurora-drift-2 32s ease-in-out infinite",
        }}
      />
      <div
        className="aurora-ribbon"
        style={{
          bottom: "-15%",
          left: "20%",
          width: "60%",
          height: "55%",
          background: "linear-gradient(45deg, #EC4899 0%, transparent 70%)",
          animation: "aurora-drift-3 30s ease-in-out infinite",
        }}
      />
      <div
        className="aurora-ribbon"
        style={{
          bottom: "5%",
          right: "10%",
          width: "45%",
          height: "45%",
          background: "linear-gradient(45deg, #E8A400 0%, transparent 70%)",
          animation: "aurora-drift-1 24s ease-in-out infinite reverse",
        }}
      />

      {/* tiny twinkling stars scattered through the empty dark space */}
      {Array.from({ length: 30 }).map((_, i) => {
        const seed = i * 149.7;
        return (
          <span
            key={i}
            className="bg-star"
            style={{
              top: `${(seed * 1.9) % 100}%`,
              left: `${seed % 100}%`,
              width: 1 + (i % 3),
              height: 1 + (i % 3),
              animationDuration: `${2 + (i % 5)}s`,
              animationDelay: `${-(i * 0.6)}s`,
            }}
          />
        );
      })}

      {/* interactive constellation network — canvas for performance */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}