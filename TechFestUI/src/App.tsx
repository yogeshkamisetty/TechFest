import { useEffect, type ReactNode } from 'react'
import { BrowserRouter, Navigate, NavLink, Outlet, Route, Routes, useLocation } from 'react-router'
import { AuthProvider, useAuth } from './auth'
import HomePage, { HomeNavbar } from './HomePage'
import EventsPage from './EventsPage'
import EventDetailPage from './EventDetailPage'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import RegistrationsPage from './RegistrationsPage'
import RegisterPage from './RegisterPage'
import HandoffPage from './HandoffPage'
import Foundations from './Foundations'
import ButtonSet, { DSButton } from './ButtonSet'
import FormSet from './FormSet'
import CardSet from './CardSet'
import PatternSet, { Footer } from './PatternSet'
import { useGo } from './router'
import AdminPage, { AdminLayout } from './AdminPage'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) { requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })); return }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { pathname } = useLocation()
  return user ? children : <Navigate to={`/login?next=${encodeURIComponent(pathname)}`} replace />
}

function DesignLayout() {
  const boards = [['/design/foundations', 'Foundations'], ['/design/buttons', 'Buttons'], ['/design/inputs', 'Inputs & tags'], ['/design/cards', 'Cards'], ['/design/patterns', 'Patterns'], ['/handoff', 'Handoff']]
  return <div className="design-shell">
    <HomeNavbar />
    <nav className="design-nav" aria-label="Design system">{boards.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav>
    <Outlet />
  </div>
}

function NotFound() {
  const go = useGo()
  return <div className="home-frame"><div className="page-wash" aria-hidden="true" /><HomeNavbar /><main className="home-container"><section className="events-empty not-found"><span className="login-eyebrow">404</span><div role="heading" aria-level={1}>This page wandered off the mela</div><p>The link may be broken or the page may have moved.</p><DSButton size="L" label="Back to home" onClick={() => go('home')} /></section></main><div className="home-footer"><Footer /></div></div>
}

export default function App() {
  return <BrowserRouter>
    <AuthProvider>
      <ScrollManager />
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:slug" element={<EventDetailPage />} />
          <Route path="/events/:slug/register" element={<RequireAuth><RegisterPage /></RequireAuth>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin/login" element={<Navigate to="/login?next=/admin" replace />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminPage />} />
            <Route path="events" element={<AdminPage key="events" section="events" />} />
            <Route path="registrations" element={<AdminPage key="registrations" section="registrations" />} />
            <Route path="students" element={<AdminPage key="students" section="students" />} />
          </Route>
          <Route path="/registrations" element={<RequireAuth><RegistrationsPage /></RequireAuth>} />
          <Route path="/registration" element={<Navigate to="/registrations" replace />} />
          <Route element={<DesignLayout />}>
            <Route path="/design" element={<Navigate to="/design/foundations" replace />} />
            <Route path="/design/foundations" element={<Foundations />} />
            <Route path="/design/buttons" element={<ButtonSet />} />
            <Route path="/design/inputs" element={<FormSet />} />
            <Route path="/design/cards" element={<CardSet />} />
            <Route path="/design/patterns" element={<PatternSet />} />
            <Route path="/handoff" element={<HandoffPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  </BrowserRouter>
}
