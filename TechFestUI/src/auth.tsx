import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

// Front-end demo only: accounts, sessions and registrations live in this browser's localStorage.
export type Registration = { slug: string; regId: string; registeredOn: string; status: 'Confirmed' | 'Cancelled' }
type StoredUser = { name: string; email: string; department: string; password: string; role?: 'student' | 'admin' }
export type User = Omit<StoredUser, 'password'>

export const DEMO_CREDENTIALS = { email: 'aarav@college.edu', password: 'Utsav@2026' }
export const ADMIN_CREDENTIALS = { email: 'admin@techfesthub.demo', password: 'ArenaAdmin@2026' }
const ADMIN_USER: StoredUser = { name: 'Festival Admin', department: 'Festival Office', role: 'admin', ...ADMIN_CREDENTIALS }
const DEMO_USER: StoredUser = { name: 'Aarav Sharma', department: 'Computer Science', ...DEMO_CREDENTIALS }
const DEMO_REGISTRATIONS: Registration[] = [
  { slug: 'codestorm', regId: 'REG-000124', registeredOn: '12 Oct 2026', status: 'Confirmed' },
  { slug: 'brainwave-quiz-league', regId: 'REG-000131', registeredOn: '14 Oct 2026', status: 'Confirmed' },
  { slug: 'roborumble', regId: 'REG-000148', registeredOn: '15 Oct 2026', status: 'Confirmed' },
  { slug: 'figma-frenzy', regId: 'REG-000152', registeredOn: '16 Oct 2026', status: 'Cancelled' },
]
const KEYS = { users: 'tfh.users', session: 'tfh.session', registrations: 'tfh.registrations' }

function read<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback } catch { return fallback }
}
const write = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value))
const normalise = (email: string) => email.trim().toLowerCase()

function loadUsers() {
  const users = read<StoredUser[]>(KEYS.users, [])
  if (!users.some(u => u.email === DEMO_USER.email)) { users.unshift(DEMO_USER); write(KEYS.users, users) }
  if (!users.some(u => u.email === ADMIN_USER.email)) { users.push(ADMIN_USER); write(KEYS.users, users) }
  return users
}
function loadRegistrations() {
  const regs = read<Record<string, Registration[]>>(KEYS.registrations, {})
  if (!regs[DEMO_USER.email]) { regs[DEMO_USER.email] = DEMO_REGISTRATIONS; write(KEYS.registrations, regs) }
  return regs
}
const strip = ({ password: _password, ...user }: StoredUser): User => user

type AuthValue = {
  user: User | null
  registrations: Registration[]
  login: (email: string, password: string) => boolean
  signup: (data: StoredUser) => 'ok' | 'exists'
  logout: () => void
  register: (slug: string) => 'ok' | 'exists' | 'auth'
  isRegistered: (slug: string) => boolean
  students: User[]
  adminRegistrations: (Registration & { email: string; name: string })[]
}
const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState(loadUsers)
  const [allRegs, setAllRegs] = useState(loadRegistrations)
  const [sessionEmail, setSessionEmail] = useState<string | null>(() => read<string | null>(KEYS.session, null))
  const stored = users.find(u => u.email === sessionEmail) ?? null
  const user = stored ? strip(stored) : null
  const registrations = useMemo(() => (sessionEmail && allRegs[sessionEmail]) || [], [allRegs, sessionEmail])

  const startSession = (email: string) => { setSessionEmail(email); write(KEYS.session, email) }
  const login = useCallback((email: string, password: string) => {
    const found = users.find(u => u.email === normalise(email) && u.password === password)
    if (found) startSession(found.email)
    return Boolean(found)
  }, [users])
  const signup = useCallback((data: StoredUser) => {
    const email = normalise(data.email)
    if (users.some(u => u.email === email)) return 'exists'
    const next = [...users, { ...data, role: 'student' as const, email, name: data.name.trim(), department: data.department.trim() }]
    setUsers(next); write(KEYS.users, next); startSession(email)
    return 'ok'
  }, [users])
  const logout = useCallback(() => { setSessionEmail(null); localStorage.removeItem(KEYS.session) }, [])
  const isRegistered = useCallback((slug: string) => registrations.some(r => r.slug === slug && r.status === 'Confirmed'), [registrations])
  const register = useCallback((slug: string) => {
    if (!sessionEmail) return 'auth'
    if (isRegistered(slug)) return 'exists'
    const all = Object.values(allRegs).flat().length
    const reg: Registration = { slug, regId: `REG-${String(200 + all).padStart(6, '0')}`, registeredOn: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), status: 'Confirmed' }
    const next = { ...allRegs, [sessionEmail]: [reg, ...registrations.filter(r => r.slug !== slug)] }
    setAllRegs(next); write(KEYS.registrations, next)
    return 'ok'
  }, [allRegs, isRegistered, registrations, sessionEmail])

  const students = user?.role === 'admin' ? users.filter(u => u.role !== 'admin').map(strip) : []
  const adminRegistrations = user?.role === 'admin' ? Object.entries(allRegs).flatMap(([email, regs]) => regs.map(r => ({ ...r, email, name: users.find(u => u.email === email)?.name ?? email }))) : []
  const value = { user, registrations, login, signup, logout, register, isRegistered, students, adminRegistrations }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
