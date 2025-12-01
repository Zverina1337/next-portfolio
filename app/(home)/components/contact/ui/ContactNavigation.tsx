import NavigationLinks from '@/components/navigation/ui/NavigationLinks'

export type NavLink = {
  label: string
  href: string
}

export type ContactNavigationProps = {
  links: NavLink[]
  accent: string
}

/**
 * ContactNavigation — навигационные ссылки с разделителями для ContactBlock
 * Обертка над переиспользуемым компонентом NavigationLinks
 */
export default function ContactNavigation({ links, accent }: ContactNavigationProps) {
  return (
    <NavigationLinks
      links={links}
      accent={accent}
      showDivider={true}
      className="mb-8 sm:mb-10 justify-center"
    />
  )
}
