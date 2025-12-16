"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import type { Skill } from "@/components/types/skills";

interface SkillsPyramid2DProps {
  skills: Skill[];
  isVisible: boolean;
}

/**
 * Состояние куба с анимацией падения
 */
interface CubeState {
  skill: Skill;
  targetY: number; // Финальная Y позиция (0)
  currentY: number; // Анимационная Y позиция (стартует с 12)
}

/**
 * 2D Canvas версия Skills пирамиды с изометрической проекцией
 * Легковесная альтернатива Three.js для мобильных устройств
 *
 * Особенности:
 * - Изометрическая проекция (псевдо-3D через Canvas 2D)
 * - GSAP анимация падения с bounce эффектом
 * - Painter's algorithm для правильного порядка отрисовки
 * - Responsive масштабирование
 * - Поддержка Retina дисплеев
 */
export default function SkillsPyramid2D({ skills, isVisible }: SkillsPyramid2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cubesRef = useRef<CubeState[]>([]);
  const rafRef = useRef<number>(0);
  const isAnimatingRef = useRef(false);
  const iconsRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Проверка prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  /**
   * Вычисление позиции куба в вертикальной сетке (читабельная раскладка)
   */
  const getGridPosition = (
    index: number,
    cubeSize: number,
    canvasWidth: number,
    canvasHeight: number,
    cols: number
  ) => {
    const spacingX = cubeSize * 1.8; // Горизонтальное расстояние между кубами
    const spacingY = cubeSize * 1.5; // Вертикальное расстояние
    const row = Math.floor(index / cols);
    const col = index % cols;

    // Центрируем сетку горизонтально
    const gridWidth = cols * spacingX;
    const startX = (canvasWidth - gridWidth) / 2 + spacingX / 2;

    // Начинаем сверху с отступом
    const startY = 100; // Отступ сверху

    return {
      x: startX + col * spacingX,
      y: startY + row * spacingY,
    };
  };

  /**
   * Отрисовка 2D карточки навыка (простой квадрат)
   */
  const drawCard = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    skill: Skill,
    icon?: HTMLImageElement
  ) => {
    const cardX = x - size / 2;
    const cardY = y;
    const borderRadius = 8;

    ctx.save();

    // === Фон карточки с rounded corners ===
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, size, size, borderRadius);
    ctx.fillStyle = "#0a0a0a";
    ctx.fill();

    // === Border с gradient эффектом ===
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 2;
    ctx.stroke();

    // === Иконка ===
    const iconY = cardY + size * 0.25;
    const iconSize = size * 0.4;

    if (icon) {
      ctx.drawImage(
        icon,
        cardX + (size - iconSize) / 2,
        iconY,
        iconSize,
        iconSize
      );
    } else {
      // Fallback: эмодзи "?" если иконка не загрузилась
      ctx.font = `bold ${size * 0.4}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#666";
      ctx.fillText("?", cardX + size / 2, iconY + iconSize / 2);
    }

    // === Название навыка ===
    const textY = cardY + size * 0.75;
    const fontSize = Math.max(10, size * 0.14);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#22d3ee";
    ctx.fillText(skill.name, cardX + size / 2, textY);

    ctx.restore();
  };

  /**
   * Главный render loop
   */
  const render = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // ВАЖНО: используем логические размеры для координат (без DPR)
    const logicalWidth = parseInt(canvas.style.width) || width;
    const logicalHeight = parseInt(canvas.style.height) || height;

    // Определяем размер куба и количество колонок
    const viewportWidth = window.innerWidth;
    let cubeSize = 100; // Базовый размер для десктопа
    let cols = 5; // Количество колонок

    if (viewportWidth < 480) {
      cubeSize = 70; // Mobile portrait
      cols = 3;
    } else if (viewportWidth < 768) {
      cubeSize = 80; // Mobile landscape
      cols = 4;
    }

    // Рисуем каждую карточку в сетке
    cubesRef.current.forEach((cube, index) => {
      const { x, y } = getGridPosition(index, cubeSize, logicalWidth, logicalHeight, cols);
      const icon = iconsRef.current.get(cube.skill.icon);

      // Применяем анимацию падения (currentY влияет на вертикальное смещение)
      const animatedY = y - cube.currentY * 20; // 20 = множитель для видимого эффекта

      drawCard(ctx, x, animatedY, cubeSize, cube.skill, icon);
    });

    // Продолжаем RAF только если анимация идет
    if (isAnimatingRef.current) {
      rafRef.current = requestAnimationFrame(render);
    }
  };

  /**
   * Загрузка иконок навыков (async)
   */
  const loadIcons = async () => {
    const loadPromises = skills.map((skill) => {
      return new Promise<void>((resolve) => {
        // Пропускаем эмодзи (не пути к файлам)
        const isImagePath = skill.icon.startsWith("/") || skill.icon.startsWith("http");
        if (!isImagePath) {
          resolve();
          return;
        }

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          iconsRef.current.set(skill.icon, img);
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load icon: ${skill.icon}`);
          resolve(); // Продолжаем даже если иконка не загрузилась
        };
        img.src = skill.icon;
      });
    });

    await Promise.all(loadPromises);
  };

  /**
   * Инициализация пирамиды и анимации
   */
  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Setup canvas с учетом Retina
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Инициализация кубов (все навыки в простую сетку)
    cubesRef.current = skills.map((skill) => ({
      skill,
      targetY: 0, // Финальная позиция
      currentY: prefersReducedMotion ? 0 : 12, // Стартовая позиция высоко (для анимации падения)
    }));

    // Загрузка иконок
    loadIcons().then(() => {
      render(); // Первый кадр после загрузки иконок

      // GSAP анимация падения (только если нет prefers-reduced-motion)
      if (!prefersReducedMotion) {
        isAnimatingRef.current = true;

        const tl = gsap.timeline({
          delay: 0.3,
          onStart: () => {
            rafRef.current = requestAnimationFrame(render);
          },
          onComplete: () => {
            isAnimatingRef.current = false;
            render(); // Финальный кадр
          },
        });

        // Анимация по рядам (stagger)
        const rows = [
          cubesRef.current.slice(0, 8), // Ряд 1
          cubesRef.current.slice(8, 13), // Ряд 2
          cubesRef.current.slice(13, 16), // Ряд 3
          cubesRef.current.slice(16, 17), // Ряд 4
        ];

        rows.forEach((row, rowIndex) => {
          row.forEach((cube, cubeIndex) => {
            tl.to(
              cube,
              {
                currentY: cube.targetY,
                duration: 1.2,
                ease: "bounce.out",
              },
              rowIndex * 0.15 + cubeIndex * 0.05
            );
          });
        });
      }
    });

    // Resize handler
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      render();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
      gsap.killTweensOf(cubesRef.current);
    };
  }, [isVisible, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative h-[1000px] w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black sm:h-[1200px] lg:h-[1400px]"
    >
      <canvas ref={canvasRef} className="h-full w-full" />

      {/* Градиент сверху (как в 3D версии) */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-64 bg-gradient-to-b from-transparent via-slate-950/40 to-transparent" />
    </div>
  );
}
