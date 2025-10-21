type StatCardProps = {
  highlight: string
  suffix?: string
  title: string
  text: string
  extra?: string // например DX
}

export default function StatCard({ highlight, suffix = '', title, text, extra }: StatCardProps) {
  return (
    <div className="about-card relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
      <div className="relative z-10">
        <div className="text-2xl sm:text-3xl font-extrabold text-cyan-500">
          {highlight}{suffix}{extra ? ` ${extra}` : ''}
        </div>
        <div className="mt-1 text-[9px] sm:text-xs uppercase tracking-wider text-white/70">{title}</div>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/80">{text}</p>
      </div>
    </div>
  )
}
