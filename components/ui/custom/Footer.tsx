'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Copyright */}
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Zverinacode. Код портфолио под{' '}
            <Link
              href="https://github.com/zverinacode/portfolio/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors underline"
            >
              MIT License
            </Link>
          </p>

          {/* Дисклеймер */}
          <p className="text-xs text-white/40 max-w-2xl leading-relaxed">
            Упоминания коммерческих проектов приведены для демонстрации технических навыков.
            Все изображения обезличены и используются исключительно в образовательных целях.
            Не является партнерством, рекламой или официальным представительством компаний.
          </p>
        </div>
      </div>
    </footer>
  )
}