"use client";

import React, { useEffect, useRef, useState } from "react";

export const ConstellationBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initial check
    setIsDark(document.documentElement.classList.contains("dark"));

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Adaptive sapphire color based on theme
    const themeColor = isDark ? "92, 157, 255" : "79, 70, 229"; 
    
    // Responsive particle count
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 40;
    const connectionDistance = isMobile ? 80 : 150;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Very slow drift
        this.vx = (Math.random() - 0.5) * (prefersReducedMotion ? 0 : 0.015);
        this.vy = (Math.random() - 0.5) * (prefersReducedMotion ? 0 : 0.015);
        this.size = Math.random() * 2 + 1;
      }

      update(width: number, height: number) {
        if (prefersReducedMotion) return;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // Node opacity (10%)
        ctx.fillStyle = `rgba(${themeColor}, 0.10)`;
        ctx.fill();
      }
    }

    const init = () => {
      // Use window dimensions to ensure full coverage
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }

      // If reduced motion, draw once and stop
      if (prefersReducedMotion) {
        draw();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].draw(ctx);

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            // Line opacity: 6% max (within spec of 5-8%)
            const opacity = 0.06 * (1 - distance / connectionDistance);
            ctx.strokeStyle = `rgba(${themeColor}, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      draw();
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(canvas.width, canvas.height);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener("resize", handleResize);
    init();

    let observer: IntersectionObserver;
    if (!prefersReducedMotion) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!animationFrameId) {
                animate();
              }
            } else {
              if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = 0;
              }
            }
          });
        },
        { rootMargin: "100px" }
      );

      if (canvasRef.current) {
        observer.observe(canvasRef.current);
      }
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (observer) observer.disconnect();
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{
        // Fade out toward bottom - starts fading at 60% and fully transparent at 100%
        maskImage:
          "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
      }}
      aria-hidden="true"
    />
  );
};
