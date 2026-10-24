import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export const paths = {
  home: '/',
  events: '/events',
  passes: '/registrations',
  account: '/login',
  signup: '/signup',
  handoff: '/handoff',
  foundations: '/design/foundations',
  buttons: '/design/buttons',
  forms: '/design/inputs',
  cards: '/design/cards',
  patterns: '/design/patterns',
} as const
export type PageName = keyof typeof paths

export function useGo() {
  const navigate = useNavigate()
  return (page: PageName) => navigate(paths[page])
}

export function useScrolled(offset = 24) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > offset)
    update(); window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [offset])
  return scrolled
}

export function useIsMobile(query = '(max-width: 720px)') {
  const [mobile, setMobile] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMobile(mq.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])
  return mobile
}
