import { useSyncExternalStore } from 'react'
import { events, type FestEvent } from './data/events'

const key = 'tfh.event-overrides'
let overrides: Record<string, Partial<FestEvent>> = {}
try { overrides = JSON.parse(localStorage.getItem(key) ?? '{}') } catch { /* Use defaults for invalid local data. */ }
for (const event of events) Object.assign(event, overrides[event.slug] ?? {})
let snapshot = [...events]
const listeners = new Set<() => void>()
const subscribe = (callback: () => void) => { listeners.add(callback); return () => { listeners.delete(callback) } }
export function useEventCatalog() { return useSyncExternalStore(subscribe, () => snapshot) }
export function updateEvent(slug: string, changes: Pick<FestEvent, 'title' | 'venue' | 'fee' | 'status'>) {
  const event = events.find(e => e.slug === slug)
  if (!event) return
  const next = { ...overrides, [slug]: { ...overrides[slug], ...changes } }
  localStorage.setItem(key, JSON.stringify(next))
  overrides = next
  Object.assign(event, changes)
  snapshot = [...events]
  listeners.forEach(callback => callback())
}
