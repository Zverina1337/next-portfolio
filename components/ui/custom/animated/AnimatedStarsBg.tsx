'use client'
import { useEffect } from "react";

type CanvasBackgroundProps = {
  containerRef: React.RefObject<HTMLDivElement|null>;
  canvasRef: React.RefObject<HTMLCanvasElement|null>;
};

const CanvasBackground = ({ containerRef, canvasRef }: CanvasBackgroundProps) => {
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const numStars = 100;
    const stars = Array.from({ length: numStars }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      targetOpacity: Math.random() * 0.5 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 1.5);
      grad.addColorStop(0, 'rgba(34,211,238,0.08)');
      grad.addColorStop(0.5, 'rgba(34,211,238,0.02)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      stars.forEach((s) => {
        s.x += s.dx;
        s.y += s.dy;
        if (s.x < 0 || s.x > width) s.dx *= -1;
        if (s.y < 0 || s.y > height) s.dy *= -1;
        s.opacity += (s.targetOpacity - s.opacity) * 0.02;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < stars.length; i++) {
        let minDist = Infinity;
        let closest = null;
        for (let j = 0; j < stars.length; j++) {
          if (i === j) continue;
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = dx * dx + dy * dy;
          if (dist < minDist) {
            minDist = dist;
            closest = stars[j];
          }
        }
        if (closest && minDist < 150 * 150) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(closest.x, closest.y);
          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      requestAnimationFrame(draw);
    };
    draw();

    const handleResize = () => {
      width = containerRef.current?.clientWidth || width;
      height = containerRef.current?.clientHeight || height;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasRef, containerRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />;
};

export default CanvasBackground;
