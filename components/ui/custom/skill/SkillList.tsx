import { memo, useMemo } from 'react'
import SkillBar from './SkillBar'

type SkillWithVal   = { label: string; val: number }
type SkillWithValue = { label: string; value: number }
type InputSkill = SkillWithVal | SkillWithValue

type Props = { items: ReadonlyArray<InputSkill> }

function SkillListBase({ items }: Props) {
  const normalized = useMemo(
    () =>
      items.map((s) => {
        const raw = 'val' in s ? s.val : s.value
        const value = Math.max(0, Math.min(100, raw))
        return { label: s.label, value }
      }),
    [items]
  )

  return (
    <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 md:space-y-5">
      {normalized.map((s) => (
        <SkillBar key={s.label} label={s.label} value={s.value} />
      ))}
    </div>
  )
}

export default memo(SkillListBase)
