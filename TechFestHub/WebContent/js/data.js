// TechFest Events Data & Metadata Rules
const about = (lead, extra) => [lead, extra, 'Bring your college ID and arrive 20 minutes early for check-in at the venue desk.'];

export const DEFAULT_EVENTS = [
  { slug: 'codestorm', title: 'CodeStorm — 24-Hour Hackathon', category: 'Hackathon', cardDate: 'Sat 14 Nov · 10:00 AM', longDate: 'Sat, 14 Nov 2026 · 10:00 AM', passDate: '14 Nov 2026 · 10:00 AM', day: '14', venue: 'Main Auditorium', fee: '₹250', status: 'Open', angle: '120deg', deadline: 'Thu, 12 Nov 2026 · 6:00 PM', capacity: 120, about: ['CodeStorm is a 24-hour build marathon where teams of up to four turn an idea into a working product.', 'Mentors from the department will be on call through the night, with checkpoints at 6, 12 and 18 hours.', 'Bring a laptop, a charger and a big idea. Food and caffeine are on us.'] },
  { slug: 'brainwave-quiz-league', title: 'BrainWave Quiz League', category: 'Quiz', cardDate: 'Mon 16 Nov · 2:00 PM', longDate: 'Mon, 16 Nov 2026 · 2:00 PM', passDate: '16 Nov 2026 · 2:00 PM', day: '16', venue: 'Seminar Hall 2', fee: 'Free', status: 'Open', angle: '155deg', deadline: 'Sat, 14 Nov 2026 · 6:00 PM', capacity: 80, about: about('BrainWave is a fast-paced quiz league covering technology, science and Indian innovation.', 'Teams of two battle through a written prelim before six teams reach the live stage final.') },
  { slug: 'roborumble', title: 'RoboRumble', category: 'Robotics', cardDate: 'Sat 21 Nov · 9:30 AM', longDate: 'Sat, 21 Nov 2026 · 9:30 AM', passDate: '21 Nov 2026 · 9:30 AM', day: '21', venue: 'Mech Block Arena', fee: '₹150', status: 'Open', angle: '200deg', deadline: 'Thu, 19 Nov 2026 · 6:00 PM', capacity: 40, about: about('RoboRumble pits manually controlled bots against an obstacle arena and each other.', 'Bots must fit a 30 × 30 cm footprint and weigh under 5 kg. Full rules are shared after registration.') },
  { slug: 'pixelpulse-game-jam', title: 'PixelPulse Game Jam', category: 'Gaming', cardDate: 'Sun 22 Nov · 11:00 AM', longDate: 'Sun, 22 Nov 2026 · 11:00 AM', passDate: '22 Nov 2026 · 11:00 AM', day: '22', venue: 'Computer Lab 3', fee: '₹100', status: 'Open', angle: '95deg', deadline: 'Fri, 20 Nov 2026 · 6:00 PM', capacity: 60, about: about('PixelPulse is a 10-hour game jam with a theme revealed at the opening bell.', 'Any engine is welcome. Builds are play-tested by judges and fellow participants at the end of the day.') },
  { slug: 'figma-frenzy', title: 'Figma Frenzy', category: 'Design', cardDate: 'Tue 24 Nov · 1:00 PM', longDate: 'Tue, 24 Nov 2026 · 1:00 PM', passDate: '24 Nov 2026 · 1:00 PM', day: '24', venue: 'Design Studio', fee: 'Free', status: 'Open', angle: '170deg', deadline: 'Sun, 22 Nov 2026 · 6:00 PM', capacity: 50, about: about('Figma Frenzy is a three-hour product design sprint on a real campus problem.', 'Solo designers present a clickable prototype to a panel in a five-minute pitch.') },
  { slug: 'codesprint', title: 'CodeSprint', category: 'Coding', cardDate: 'Wed 25 Nov · 10:00 AM', longDate: 'Wed, 25 Nov 2026 · 10:00 AM', passDate: '25 Nov 2026 · 10:00 AM', day: '25', venue: 'CS Lab 1', fee: '₹50', status: 'Open', angle: '135deg', deadline: 'Mon, 23 Nov 2026 · 6:00 PM', capacity: 100, about: about('CodeSprint is a two-hour competitive programming contest with eight problems of rising difficulty.', 'Solve in C++, Java or Python. The live leaderboard is shown in the lab throughout.') },
  { slug: 'ai-spark-summit', title: 'AI Spark Summit', category: 'AI-ML', cardDate: 'Fri 27 Nov · 3:00 PM', longDate: 'Fri, 27 Nov 2026 · 3:00 PM', passDate: '27 Nov 2026 · 3:00 PM', day: '27', venue: 'Auditorium Annex', fee: 'Free', status: 'Closed', angle: '75deg', deadline: 'Tue, 10 Nov 2026 · 6:00 PM', capacity: 150, about: about('AI Spark Summit brings together student researchers to demo machine-learning projects.', 'Registration has closed, but the demo hall opens to visitors on the day.') },
  { slug: 'hack-the-hustle', title: 'Hack the Hustle', category: 'Hackathon', cardDate: 'Sat 3 Oct · 10:00 AM', longDate: 'Sat, 3 Oct 2026 · 10:00 AM', passDate: '3 Oct 2026 · 10:00 AM', day: '03', venue: 'Main Auditorium', fee: '₹200', status: 'Completed', angle: '120deg', deadline: 'Thu, 1 Oct 2026 · 6:00 PM', capacity: 100, about: about('Hack the Hustle was a 12-hour hackathon focused on tools for student entrepreneurs.', 'Thank you to every team that took part. Results are shared with participants by email.') },
  { slug: 'circuit-quest', title: 'Circuit Quest', category: 'Robotics', cardDate: 'Sun 4 Oct · 9:00 AM', longDate: 'Sun, 4 Oct 2026 · 9:00 AM', passDate: '4 Oct 2026 · 9:00 AM', day: '04', venue: 'ECE Block', fee: 'Free', status: 'Completed', angle: '200deg', deadline: 'Fri, 2 Oct 2026 · 6:00 PM', capacity: 60, about: about('Circuit Quest was a hands-on electronics challenge of debugging and building circuits against the clock.', 'The event has ended. Watch this space for next season’s edition.') },
];

export const featuredSlugs = ['codestorm', 'brainwave-quiz-league', 'roborumble'];

const teamSizes = {
  Hackathon: [2, 4],
  Robotics: [2, 4],
  Gaming: [3, 5],
  Quiz: [2, 2],
  Coding: [1, 1],
  Design: [1, 1],
  'AI-ML': [1, 3]
};

const tracks = {
  Hackathon: ['AI for Campus Life', 'Sustainable Bharat', 'HealthTech & Wellbeing', 'FinTech & Digital Trust', 'Smart Mobility', 'Open Innovation'],
  Robotics: ['Obstacle Sprint', 'Bot Combat', 'Autonomous Line Follow', 'Open Build'],
  Gaming: ['Tactical Shooter', 'Battle Royale', 'Sports Sim', 'Indie Showcase'],
  Quiz: ['Tech & Science', 'Indian Innovation', 'Pop Culture of Tech', 'Open Mix'],
  Coding: ['Algorithms', 'Data Structures', 'Speed Round', 'Open Category'],
  Design: ['Campus Services', 'Accessibility', 'Festival Experience', 'Open Brief'],
  'AI-ML': ['Computer Vision', 'Language Models', 'Responsible AI', 'Open Research'],
};

export const teamSize = (e) => teamSizes[e.category] ?? [1, 1];
export const tracksFor = (e) => tracks[e.category] ?? ['Open Category'];
export const needsProject = (e) => ['Hackathon', 'Design', 'AI-ML', 'Robotics'].includes(e.category);

export function importantDates(e) {
  const day = e.longDate.split(' · ')[0];
  const closing = e.deadline.split(' · ')[0];
  const done = e.status === 'Completed';
  const closed = e.status !== 'Open';
  return [
    { label: 'Registrations open', date: 'Mon, 2 Nov 2026', note: 'Create your profile and register your team or solo entry.', phase: 'done' },
    { label: 'Registration closes', date: e.deadline, note: 'Last moment to submit or edit your registration.', phase: closed ? 'done' : 'live' },
    { label: needsProject(e) ? 'Shortlist announced' : 'Participant briefing', date: closing.replace(/^\w+, /, 'Within 24h of '), note: needsProject(e) ? 'Shortlisted entries receive a confirmation email.' : 'Rules, slots and reporting time are shared by email.', phase: done ? 'done' : 'upcoming' },
    { label: 'Event day', date: e.longDate, note: `Report at ${e.venue} 20 minutes before start with your college ID.`, phase: done ? 'done' : 'upcoming' },
    { label: 'Results & certificates', date: done ? 'Published' : `Within 7 days of ${day}`, note: 'Winners are announced on stage; certificates arrive by email.', phase: done ? 'done' : 'upcoming' },
  ];
}
