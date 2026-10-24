import { useNavigate } from 'react-router'
import { useAuth } from './auth'

// Registration happens in the event wizard; logged-out users log in first and return to it.
export function useRegisterFlow() {
  const { user } = useAuth()
  const navigate = useNavigate()
  return (slug: string) => {
    const target = `/events/${slug}/register`
    navigate(user ? target : `/login?next=${encodeURIComponent(target)}`)
  }
}
