import { useRef, useEffect } from "react";
import "./AsciiPortrait.scss";

interface AsciiPortraitProps {
  imageSrc: string;
  fontSize?: number;
  /** Radius (in pixels on canvas) within which characters react to mouse */
  hoverRadius?: number;
}

// ASCII density ramp — lightest to darkest
const ASCII_CHARS = " .':^\",-~;!><+=*?/\\|(){}[]#&$@";

// Color constants (outside component to avoid re-renders)
const ACCENT_COLOR = "#7c5ce7";
const BASE_COLOR = "rgba(180, 180, 190, 0.85)";
const DIM_COLOR = "rgba(100, 100, 110, 0.5)";

interface Particle {
  homeX: number;
  homeY: number;
  offsetX: number;
  offsetY: number;
  vx: number;
  vy: number;
  char: string;
  brightness: number;
  highlighted: boolean;
  opacity: number;
}

const AsciiPortrait: React.FC<AsciiPortraitProps> = ({
  imageSrc,
  fontSize = 7,
  hoverRadius = 100,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    const buildParticles = (canvasWidth: number, canvasHeight: number) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = canvasWidth;
      offscreen.height = canvasHeight;
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      // Calculate image draw dimensions — fill canvas width, align to TOP
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = canvasWidth / canvasHeight;

      let drawWidth: number,
        drawHeight: number,
        drawX: number,
        drawY: number;

      if (imgAspect > canvasAspect) {
        // Image is wider — fit height, center horizontally
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgAspect;
        drawX = (canvasWidth - drawWidth) / 2;
        drawY = 0;
      } else {
        // Image is taller — fit width, ALIGN TO TOP (not center)
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgAspect;
        drawX = 0;
        drawY = 0; // Top-aligned so the head is visible
      }

      offCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      const imageData = offCtx.getImageData(0, 0, canvasWidth, canvasHeight);
      const data = imageData.data;

      const particles: Particle[] = [];
      const cellWidth = fontSize * 0.6;
      const cellHeight = fontSize;

      const cols = Math.floor(canvasWidth / cellWidth);
      const rows = Math.floor(canvasHeight / cellHeight);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const sampleX = Math.floor(col * cellWidth + cellWidth / 2);
          const sampleY = Math.floor(row * cellHeight + cellHeight / 2);

          if (sampleX >= canvasWidth || sampleY >= canvasHeight) continue;

          const idx = (sampleY * canvasWidth + sampleX) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];

          // Skip transparent pixels
          if (a < 30) continue;

          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

          // Skip very bright pixels (white background)
          if (brightness > 0.92 && a < 200) continue;

          const charIndex = Math.floor(
            (1 - brightness) * (ASCII_CHARS.length - 1)
          );
          const char = ASCII_CHARS[Math.min(charIndex, ASCII_CHARS.length - 1)];

          if (char === " ") continue;

          particles.push({
            homeX: col * cellWidth,
            homeY: row * cellHeight,
            offsetX: (Math.random() - 0.5) * 40,
            offsetY: (Math.random() * 40) + 10,
            vx: 0,
            vy: 0,
            char,
            brightness,
            highlighted: false,
            opacity: 0,
          });
        }
      }

      particlesRef.current = particles;
    };

    const animate = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = canvas;
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const spring = 0.03;
      const friction = 0.85;
      const pushForce = 10;

      ctx.font = `${fontSize}px "Courier New", monospace`;
      ctx.textBaseline = "top";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mouse.active) {
          const dx = p.homeX + p.offsetX - mouse.x;
          const dy = p.homeY + p.offsetY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < hoverRadius && dist > 0) {
            const force = ((hoverRadius - dist) / hoverRadius) * pushForce;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
            p.highlighted = true;
          } else {
            p.highlighted = false;
          }
        } else {
          p.highlighted = false;
        }

        // Spring physics
        p.vx -= p.offsetX * spring;
        p.vy -= p.offsetY * spring;
        p.vx *= friction;
        p.vy *= friction;
        p.offsetX += p.vx;
        p.offsetY += p.vy;

        // Entry animation (fade in)
        if (p.opacity < 1) {
          p.opacity += 0.015 + Math.random() * 0.015;
          if (p.opacity > 1) p.opacity = 1;
        }

        ctx.globalAlpha = p.opacity;

        // Color
        if (p.highlighted) {
          ctx.fillStyle = ACCENT_COLOR;
        } else if (p.brightness < 0.3) {
          ctx.fillStyle = BASE_COLOR;
        } else {
          ctx.fillStyle = DIM_COLOR;
        }

        ctx.fillText(p.char, p.homeX + p.offsetX, p.homeY + p.offsetY);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    const init = () => {
      const rect = container.getBoundingClientRect();
      const newWidth = Math.floor(rect.width);
      const newHeight = Math.floor(rect.height);

      // Only rebuild particles if width has changed significantly
      // Height changes (like mobile address bar) shouldn't reset the whole animation
      const widthChanged = Math.abs(canvas.width - newWidth) > 5;
      const noParticles = particlesRef.current.length === 0;

      if (widthChanged || noParticles) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        buildParticles(canvas.width, canvas.height);
      } else {
        // Just update canvas dimensions if height changed slightly, don't reset particles
        canvas.width = newWidth;
        canvas.height = newHeight;
      }

      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    img.onload = init;

    // If already loaded (cached), init immediately
    if (img.complete && img.naturalWidth > 0) {
      init();
    }

    // Interaction tracking
    const handleMove = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: x - rect.left,
        y: y - rect.top,
        active: true,
      };
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
        // Prevent scrolling while interacting with the ASCII art
        if (e.cancelable) e.preventDefault();
      }
    };

    const handleLeave = () => {
      mouseRef.current = { ...mouseRef.current, active: false };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("touchstart", handleTouchMove, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleLeave);

    // Resize handler
    const handleResize = () => {
      if (img.complete) init();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleLeave);
      canvas.removeEventListener("touchstart", handleTouchMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleLeave);
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [imageSrc, fontSize, hoverRadius]);

  return (
    <div className="ascii-portrait" ref={containerRef}>
      <canvas ref={canvasRef} className="ascii-canvas" />
    </div>
  );
};

export default AsciiPortrait;
