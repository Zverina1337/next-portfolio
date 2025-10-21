import StatCard from './StatCard'

type Stat = { n: string; s?: string; title: string; text: string }
type Props = { items: ReadonlyArray<Stat> }

export default function StatsGrid({ items }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
      {items.map((c, i) => (
        <StatCard
          key={`${c.title}-${i}`}
          highlight={c.n}
          suffix={c.s ?? ''}
          title={c.title}
          text={c.text}
          extra={i === 2 ? 'DX' : undefined}
        />
      ))}
    </div>
  )
}
