'use client'

type SocialLink = {
  name: string
  url: string
  icon: React.ReactNode
  color: string // Tailwind color class
  hoverColor: string
}

const socialLinks: SocialLink[] = [
  {
    name: 'Telegram',
    url: 'https://t.me/zverina1337',
    color: 'text-blue-400',
    hoverColor: 'hover:text-blue-300',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
      </svg>
    ),
  },
  {
    name: 'Email',
    url: 'mailto:danii.zvorugin@gmail.com',
    color: 'text-cyan-400',
    hoverColor: 'hover:text-cyan-300',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    name: 'hh.ru',
    url: 'https://tomsk.hh.ru/resume/eed62117ff0ba6ae0e0039ed1f36704c687551',
    color: 'text-red-400',
    hoverColor: 'hover:text-red-300',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M14.5 3h-5C8.7 3 8 3.7 8 4.5v15c0 .8.7 1.5 1.5 1.5h5c.8 0 1.5-.7 1.5-1.5v-15c0-.8-.7-1.5-1.5-1.5zm-3 16h-1v-8h1v8zm0-10h-1V6h1v3zm3 10h-1v-3.5h1V19zm0-5h-1v-2h1v2zm0-3.5h-1V8h1v2.5z"/>
      </svg>
    ),
  },
  {
    name: 'GitHub',
    url: 'https://github.com/Zverina1337',
    color: 'text-purple-400',
    hoverColor: 'hover:text-purple-300',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
      </svg>
    ),
  },
]

export default function SocialLinks() {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap" data-social-links>
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target={link.url.startsWith('mailto:') ? '_self' : '_blank'}
          rel={link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
          className={`
            group relative inline-flex items-center gap-2.5 px-5 py-3 rounded-xl
            bg-white/5 border border-white/10 backdrop-blur-sm
            transition-all duration-300 ease-out
            hover:bg-white/10 hover:border-white/20 hover:scale-105
            ${link.color} ${link.hoverColor}
          `}
          aria-label={link.name}
        >
          {/* Иконка */}
          <span className="relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            {link.icon}
          </span>

          {/* Текст */}
          <span className="relative z-10 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
            {link.name}
          </span>

          {/* Glow эффект при hover */}
          <span
            className={`
              absolute inset-0 rounded-xl opacity-0 blur-xl
              transition-opacity duration-500 group-hover:opacity-30
              ${link.color.replace('text-', 'bg-')}
            `}
            aria-hidden="true"
          />

          {/* Блик сверху */}
          <span
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-hidden="true"
          />
        </a>
      ))}
    </div>
  )
}
