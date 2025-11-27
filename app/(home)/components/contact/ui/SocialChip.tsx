import clsx from 'clsx'

export type SocialChipProps = {
  href: string
  children: React.ReactNode
}

/**
 * SocialChip — кнопка-чип для социальных ссылок
 * С анимированным hover эффектом и accent цветом
 */
export default function SocialChip({ href, children }: SocialChipProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={clsx(
        'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs tracking-wide',
        'border-2 border-white/15 text-slate-200 hover:text-white',
        'hover:border-[color:var(--accent)]/60 hover:bg-[color:var(--accent)]/10',
        'transition-colors'
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
      {children}
    </a>
  )
}
