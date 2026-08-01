'use client'

import { useEffect } from 'react'
import { usePlanner } from '@/lib/planner-context'
import Sidebar from './Sidebar'
import ViewDashboard from './ViewDashboard'
import ViewPlanner from './ViewPlanner'
import ViewCalendar from './ViewCalendar'
import ViewAnalytics from './ViewAnalytics'
import ViewReview from './ViewReview'
import ViewFocus from './ViewFocus'
import ViewGoals from './ViewGoals'
import ViewBudget from './ViewBudget'
import ViewResources from './ViewResources'
import ViewSections from './ViewSections'
import ViewProjects from './ViewProjects'
import ViewMeetings from './ViewMeetings'
import ViewHabits from './ViewHabits'
import ViewReport from './ViewReport'
import ViewPomodoro from './ViewPomodoro'
import SettingsPanel from './SettingsPanel'
import ToastFab from './ToastFab'

const VIEW_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  planner:   'Planejador Semanal',
  calendar:  'Calendario Mensal',
  analytics: 'Analise e Progresso',
  review:    'Revisao de IA',
  focus:     'Foco e Notas',
  goals:     'Metas e Roteiro',
  budget:    'Financas',
  resources: 'Recursos',
  sections:  'Seccoes Personalizadas',
  projects:  'Projectos',
  meetings:  'Reunioes e Actas',
  habits:    'Habitos',
  report:    'Relatorio e Exportar',
  pomodoro:  'Pomodoro Timer',
}

export default function AppShell() {
  const { view, sidebarOpen, setSidebarOpen } = usePlanner()

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.classList.toggle('menu-open', sidebarOpen)
    return () => document.body.classList.remove('menu-open')
  }, [sidebarOpen])

  return (
    <div className="p-app-shell">
      {/* Sidebar overlay (mobile) */}
      <div
        className={`p-sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`p-sidebar${sidebarOpen ? ' open' : ''}`}
        aria-label="Menu lateral"
      >
        <Sidebar />
      </aside>

      {/* Mobile header */}
      <header className="p-mobile-header">
        <div className="p-mobile-inner">
          <button
            className="p-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={sidebarOpen}
          >
            <span />
            <span />
            <span />
          </button>
          <span className="p-mobile-title">{VIEW_TITLES[view] || 'Planner 360'}</span>
          <div style={{ width: '44px' }} />
        </div>
      </header>

      {/* Main content */}
      <main className="p-main" id="main-content">
        <div className={`p-view${view === 'dashboard' ? ' active' : ''}`} aria-hidden={view !== 'dashboard'}>
          {view === 'dashboard' && <ViewDashboard />}
        </div>
        <div className={`p-view${view === 'planner' ? ' active' : ''}`} aria-hidden={view !== 'planner'}>
          {view === 'planner' && <ViewPlanner />}
        </div>
        <div className={`p-view${view === 'calendar' ? ' active' : ''}`} aria-hidden={view !== 'calendar'}>
          {view === 'calendar' && <ViewCalendar />}
        </div>
        <div className={`p-view${view === 'analytics' ? ' active' : ''}`} aria-hidden={view !== 'analytics'}>
          {view === 'analytics' && <ViewAnalytics />}
        </div>
        <div className={`p-view${view === 'review' ? ' active' : ''}`} aria-hidden={view !== 'review'}>
          {view === 'review' && <ViewReview />}
        </div>
        <div className={`p-view${view === 'focus' ? ' active' : ''}`} aria-hidden={view !== 'focus'}>
          {view === 'focus' && <ViewFocus />}
        </div>
        <div className={`p-view${view === 'goals' ? ' active' : ''}`} aria-hidden={view !== 'goals'}>
          {view === 'goals' && <ViewGoals />}
        </div>
        <div className={`p-view${view === 'budget' ? ' active' : ''}`} aria-hidden={view !== 'budget'}>
          {view === 'budget' && <ViewBudget />}
        </div>
        <div className={`p-view${view === 'resources' ? ' active' : ''}`} aria-hidden={view !== 'resources'}>
          {view === 'resources' && <ViewResources />}
        </div>
        <div className={`p-view${view === 'sections' ? ' active' : ''}`} aria-hidden={view !== 'sections'}>
          {view === 'sections' && <ViewSections />}
        </div>
        <div className={`p-view${view === 'projects' ? ' active' : ''}`} aria-hidden={view !== 'projects'}>
          {view === 'projects' && <ViewProjects />}
        </div>
        <div className={`p-view${view === 'meetings' ? ' active' : ''}`} aria-hidden={view !== 'meetings'}>
          {view === 'meetings' && <ViewMeetings />}
        </div>
        <div className={`p-view${view === 'habits' ? ' active' : ''}`} aria-hidden={view !== 'habits'}>
          {view === 'habits' && <ViewHabits />}
        </div>
        <div className={`p-view${view === 'report' ? ' active' : ''}`} aria-hidden={view !== 'report'}>
          {view === 'report' && <ViewReport />}
        </div>
        <div className={`p-view${view === 'pomodoro' ? ' active' : ''}`} aria-hidden={view !== 'pomodoro'}>
          {view === 'pomodoro' && <ViewPomodoro />}
        </div>
      </main>

      {/* Global overlays */}
      <SettingsPanel />
      <ToastFab />
    </div>
  )
}
