type SkillBarProps = {
  label: string
  value: number
}

export default function SkillBar({ label, value }: SkillBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px] sm:text-xs md:text-sm text-white/75">
        <span>{label}</span>
        <span>{clamped}%</span>
      </div>
      <div className="h-1 sm:h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="skill-fill h-full rounded-full"
          data-value={clamped}
          style={{
            width: 0,
            background: 'linear-gradient(90deg, rgba(34,211,238,0.35), rgba(34,211,238,1))',
            boxShadow: '0 0 8px rgba(34,211,238,0.35) inset',
          }}
        />
      </div>
    </div>
  )
}
