"use client";

import { Suspense, useMemo } from "react";
import dynamic from "next/dynamic";
import type { Skill } from "@/components/types/skills";
import { useDeviceCapabilities } from "@/components/hooks/useDeviceCapabilities";
import PyramidLoadingSpinner from "./PyramidLoadingSpinner";

/**
 * Props для Skills пирамиды
 */
interface SkillsPyramidProps {
  skills: Skill[];
  isVisible: boolean;
}

// Dynamic imports с отключенным SSR (Canvas/WebGL работают только на клиенте)
const SkillsPyramid3D = dynamic(() => import("./SkillsPyramid"), {
  loading: () => <PyramidLoadingSpinner />,
  ssr: false,
});

const SkillsPyramid2D = dynamic(() => import("./SkillsPyramid2D"), {
  loading: () => <PyramidLoadingSpinner />,
  ssr: false,
});

const SkillsPyramidFallback = dynamic(() => import("./SkillsPyramidFallback"), {
  loading: () => <PyramidLoadingSpinner />,
  ssr: false,
});

/**
 * Умный wrapper для Skills пирамиды
 * Выбирает оптимальную версию на основе возможностей устройства:
 * - Desktop/сильные устройства → 3D версия (Three.js)
 * - Mobile/слабые устройства → 2D версия (Canvas)
 * - Древние браузеры → Fallback версия (CSS Grid)
 *
 * @param {Skill[]} skills - Массив навыков для отображения (17 элементов)
 * @param {boolean} isVisible - Видна ли секция (для запуска анимаций)
 */
export default function SkillsPyramidWrapper({ skills, isVisible }: SkillsPyramidProps) {
  const { shouldUse2D, isChecking } = useDeviceCapabilities();

  // Проверка поддержки Canvas 2D (для fallback)
  const canvasSupported = useMemo(() => {
    if (typeof window === "undefined") return true;
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext && canvas.getContext("2d"));
  }, []);

  // Показываем loading state во время проверки устройства
  if (isChecking) {
    return <PyramidLoadingSpinner />;
  }

  // Fallback для древних браузеров без Canvas 2D
  if (!canvasSupported && shouldUse2D) {
    return (
      <Suspense fallback={<PyramidLoadingSpinner />}>
        <SkillsPyramidFallback skills={skills} />
      </Suspense>
    );
  }

  // Выбираем 2D или 3D версию
  if (shouldUse2D) {
    return (
      <Suspense fallback={<PyramidLoadingSpinner />}>
        <SkillsPyramid2D skills={skills} isVisible={isVisible} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<PyramidLoadingSpinner />}>
      <SkillsPyramid3D skills={skills} isVisible={isVisible} />
    </Suspense>
  );
}
