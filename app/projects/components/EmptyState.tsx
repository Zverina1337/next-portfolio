'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import для Sphere - оптимизация bundle size
const Sphere = dynamic(() => import('@/components/ui/custom/3D/Sphere'), {
  ssr: false,
})

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* 3D Sphere */}
      <div className="w-64 h-64 mb-8">
        <Suspense fallback={<div className="w-full h-full bg-cyan-500/10 rounded-full animate-pulse" />}>
          <Sphere />
        </Suspense>
      </div>

      {/* Текст */}
      <div className="text-center max-w-md space-y-3">
        <h3 className="text-2xl font-bold text-white">Проекты не найдены</h3>
        <p className="text-white/60 text-sm leading-relaxed">
          Попробуйте изменить параметры фильтрации или поиска, чтобы найти интересующие вас проекты.
        </p>

        {/* Декоративные элементы */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-cyan-500/70 animate-pulse delay-75" />
          <div className="w-2 h-2 rounded-full bg-cyan-500/40 animate-pulse delay-150" />
        </div>
      </div>
    </div>
  )
}
