import type { FestEvent } from './events'

export type DatePhase = 'done' | 'live' | 'upcoming'
export type ImportantDate = { label: string; date: string; note: string; phase: DatePhase }

const teamSizes: Record<string, [number, number]> = { Hackathon: [2, 4], Robotics: [2, 4], Gaming: [3, 5], Quiz: [2, 2], Coding: [1, 1], Design: [1, 1], 'AI-ML': [1, 3] }
const tracks: Record<string, string[]> = {
  Hackathon: ['AI for Campus Life', 'Sustainable Bharat', 'HealthTech & Wellbeing', 'FinTech & Digital Trust', 'Smart Mobility', 'Open Innovation'],
  Robotics: ['Obstacle Sprint', 'Bot Combat', 'Autonomous Line Follow', 'Open Build'],
  Gaming: ['Tactical Shooter', 'Battle Royale', 'Sports Sim', 'Indie Showcase'],
  Quiz: ['Tech & Science', 'Indian Innovation', 'Pop Culture of Tech', 'Open Mix'],
  Coding: ['Algorithms', 'Data Structures', 'Speed Round', 'Open Category'],
  Design: ['Campus Services', 'Accessibility', 'Festival Experience', 'Open Brief'],
  'AI-ML': ['Computer Vision', 'Language Models', 'Responsible AI', 'Open Research'],
}

export const teamSize = (e: FestEvent) => teamSizes[e.category] ?? [1, 1]
export const tracksFor = (e: FestEvent) => tracks[e.category] ?? ['Open Category']
export const needsProject = (e: FestEvent) => ['Hackathon', 'Design', 'AI-ML', 'Robotics'].includes(e.category)

// Dates are derived from each event's own schedule so every event gets a timeline.
export function importantDates(e: FestEvent): ImportantDate[] {
  const day = e.longDate.split(' · ')[0]
  const closing = e.deadline.split(' · ')[0]
  const done = e.status === 'Completed'
  const closed = e.status !== 'Open'
  return [
    { label: 'Registrations open', date: 'Mon, 2 Nov 2026', note: 'Create your profile and register your team or solo entry.', phase: 'done' },
    { label: 'Registration closes', date: e.deadline, note: 'Last moment to submit or edit your registration.', phase: closed ? 'done' : 'live' },
    { label: needsProject(e) ? 'Shortlist announced' : 'Participant briefing', date: closing.replace(/^\w+, /, 'Within 24h of '), note: needsProject(e) ? 'Shortlisted entries receive a confirmation email.' : 'Rules, slots and reporting time are shared by email.', phase: done ? 'done' : 'upcoming' },
    { label: 'Event day', date: e.longDate, note: `Report at ${e.venue} 20 minutes before start with your college ID.`, phase: done ? 'done' : 'upcoming' },
    { label: 'Results & certificates', date: done ? 'Published' : `Within 7 days of ${day}`, note: 'Winners are announced on stage; certificates arrive by email.', phase: done ? 'done' : 'upcoming' },
  ]
}
