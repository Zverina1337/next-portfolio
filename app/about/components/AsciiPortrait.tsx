'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function AsciiPortrait() {
  const containerRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<HTMLDivElement[]>([])

  // ASCII-портрет на основе фото в киберпанк стиле (прямоугольная форма)
  const asciiLines = [
"⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠿⠿⠿⣿⡿⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⣿⣿⣿⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⢠⣤⣶⣶⣾⣿⣷⣤⣄⡀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣄⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⣿⣄⠀⠀⠀⢸⣿⢛⠛⢿⣿⣿⣿⣿⣟⣛⣻⣿⡷⣤⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⣈⠋⠉⠉⠁⠉⠛⠛⠉⠁⠀⠉⠉⢤⡈⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⣿⣿⣷⣰⣆⣿⣶⣷⣾⣤⡞⢰⣷⠘⣠⣷⣾⣶⣿⢳⣷⣿⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⣿⣿⡁⡿⣿⣜⠿⠿⠿⠟⢡⣿⣿⣧⡙⠻⠿⣛⣋⣾⣷⣸⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⣿⣿⣿⣆⢿⣿⣿⣿⣿⣿⡟⢙⣟⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⣿⣿⣿⣿⣞⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⣛⣩⣭⣩⣭⣉⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣤⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⣿⣿⣿⣿⣿⣿⠿⢻⣿⣿⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠛⣿⣿⣦⣄⡀⠀⠁⠀⣀⣴⣿⣿⣿⣣⠈⢿⣿⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⣿⣿⣿⠿⠁⣿⣆⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠈⠻⣿⣿⣿⣿⣿⣿",
"⣿⣿⣿⣿⠿⠋⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠈⠛⠿⣿⣿⣿⣿",
"⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⠿",
"⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
"             ⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
"             ⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
"             ⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
"             ⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
"          ╔═══════════════════════╗             ",
"          ║  ZVERINACODE.DEV  █▓▒░║             ",
"          ╚═══════════════════════╝             ",
  ]

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (prefersReduced) {
      // Показываем всё сразу без анимации
      linesRef.current.forEach(line => {
        if (line) {
          gsap.set(line, { opacity: 1, x: 0 })
        }
      })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'none' } })

      // Scan effect: построчное появление снизу вверх
      linesRef.current.forEach((line, i) => {
        if (!line) return

        tl.fromTo(
          line,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.05,
            ease: 'power1.out'
          },
          i * 0.03 // Небольшая задержка между строками
        )
      })

      // После появления - добавляем glitch эффект на случайные строки
      tl.add(() => {
        const glitchLoop = () => {
          const randomLines = linesRef.current
            .filter(() => Math.random() > 0.85) // 15% шанс glitch для каждой строки
            .slice(0, 3) // Максимум 3 строки одновременно

          randomLines.forEach(line => {
            if (!line) return

            gsap.timeline()
              .to(line, {
                x: gsap.utils.random(-3, 3),
                opacity: 0.7,
                duration: 0.05,
                ease: 'power1.inOut'
              })
              .to(line, {
                x: 0,
                opacity: 1,
                duration: 0.05,
                ease: 'power1.inOut'
              })
          })

          // Повторяем glitch через случайный интервал
          gsap.delayedCall(gsap.utils.random(2, 5), glitchLoop)
        }

        glitchLoop()
      })

      tl.play(0)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      {/* Основной ASCII-портрет */}
      <div className="relative">
        {/* Neon glow фон */}
        <div
          className="absolute inset-0 blur-xl opacity-30 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.6) 0%, rgba(168,85,247,0.4) 50%, transparent 70%)'
          }}
        />

        {/* ASCII текст */}
        <pre
          className="relative text-[8px] sm:text-[10px] md:text-xs lg:text-sm leading-tight font-mono select-none"
          style={{
            fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
            textShadow: '0 0 10px rgba(34,211,238,0.8), 0 0 20px rgba(34,211,238,0.4)'
          }}
        >
          {asciiLines.map((line, i) => (
            <div
              key={i}
              ref={el => {
                if (el) linesRef.current[i] = el
              }}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
              style={{
                opacity: 0,
                whiteSpace: 'pre'
              }}
            >
              {line}
            </div>
          ))}
        </pre>

        {/* Scan line эффект */}
        <div
          className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 pointer-events-none"
          style={{
            animation: 'scan 4s ease-in-out infinite'
          }}
        />
      </div>

      {/* CSS для scan line анимации */}
      <style jsx>{`
        @keyframes scan {
          0%, 100% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          50% {
            transform: translateY(600px);
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
