"use client";

import { useState, useEffect } from "react";

/**
 * Результаты проверки возможностей устройства
 */
export interface DeviceCapabilities {
  /** Нужно ли использовать 2D версию вместо 3D */
  shouldUse2D: boolean;
  /** Идет ли проверка возможностей (SSR safe) */
  isChecking: boolean;
  /** Причина выбора 2D версии (для дебага) */
  reason?: string;
}

/**
 * Детали проверок устройства
 */
interface DeviceChecks {
  isMobile: boolean;
  noWebGL: boolean;
  screenWidth: number;
}

/**
 * Хук для определения оптимальной версии Skills пирамиды (3D vs 2D)
 *
 * Упрощенные критерии для 2D версии:
 * - Мобильное устройство (< 768px) → ВСЕГДА 2D Canvas
 * - Десктоп (>= 768px) → 3D если есть WebGL, иначе 2D
 *
 * @returns {DeviceCapabilities} Результаты проверки
 *
 * @example
 * const { shouldUse2D, isChecking } = useDeviceCapabilities()
 * if (isChecking) return <Loading />
 * return shouldUse2D ? <Pyramid2D /> : <Pyramid3D />
 */
export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    shouldUse2D: false,
    isChecking: true,
  });

  useEffect(() => {
    // Проверка возможностей только на клиенте
    // Дополнительная проверка для типобезопасности (хотя useEffect гарантирует наличие window)
    if (typeof window === 'undefined') {
      setCapabilities({ shouldUse2D: true, isChecking: false, reason: 'ssr' });
      return;
    }

    const checks: DeviceChecks = {
      screenWidth: window.innerWidth,
      isMobile: window.innerWidth < 768,
      noWebGL: false,
    };

    // Проверка WebGL (только для десктопов)
    if (!checks.isMobile) {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      if (!gl) {
        checks.noWebGL = true;
      } else {
        // Проверка на software renderer (SwiftShader)
        const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (renderer && (renderer.toLowerCase().includes("swiftshader") || renderer.toLowerCase().includes("software"))) {
            checks.noWebGL = true;
          }
        }
      }
    }

    // УПРОЩЕННАЯ логика:
    // - Mobile (< 768px) → ВСЕГДА 2D
    // - Desktop (>= 768px) → 3D если есть WebGL, иначе 2D
    const reasons: string[] = [];
    let shouldUse2D = false;

    if (checks.isMobile) {
      shouldUse2D = true;
      reasons.push("mobile");
    } else if (checks.noWebGL) {
      shouldUse2D = true;
      reasons.push("no-webgl");
    }

    // Дебаг лог (всегда показываем)
    console.log("[DeviceCapabilities] 🎨", {
      shouldUse2D,
      version: shouldUse2D ? "2D Canvas" : "3D Three.js",
      reasons: reasons.join(", ") || "3D (desktop + WebGL)",
      checks,
    });

    setCapabilities({
      shouldUse2D,
      isChecking: false,
      reason: reasons.join(", ") || undefined,
    });
  }, []);

  return capabilities;
}
