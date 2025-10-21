'use client'
import Carousel from '@/components/ui/custom/Carousel'

type Props = { items: string[] }

export default function AboutCarousel({ items }: Props) {
  return (
    <Carousel
      items={items}
      aria-label="Технологии, с которыми я работаю"
      className="relative z-[4] mt-10 sm:mt-14 overflow-hidden"
      trackClassName="whitespace-nowrap flex gap-6 text-white/80 will-change-transform"
      ariaHiddenTrack
      renderItem={(t, i) => (
        <span key={`${t}-${i}`} className="inline-flex items-center gap-2 text-xs uppercase tracking-wider">
          <span className="inline-block h-[6px] w-[6px] rounded-full bg-cyan-500/80" />
          {t}
        </span>
      )}
    />
  )
}
