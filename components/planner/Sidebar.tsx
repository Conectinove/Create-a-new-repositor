'use client'

import { usePlanner, View, Theme } from '@/lib/planner-context'

type NavGroup = { label: string; items: { view: View; icon: string; label: string }[] }

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Principal',
    items: [
      { view: 'dashboard',  icon: '⬡', label: 'Dashboard' },
      { view: 'planner',   icon: '◫', label: 'Planejador Semanal' },
      { view: 'calendar',  icon: '◷', label: 'Calendario Mensal' },
    ]
  },
  {
    label: 'Produtividade',
    items: [
      { view: 'pomodoro',  icon: '◎', label: 'Pomodoro Timer' },
      { view: 'focus',     icon: '◉', label: 'Foco e Notas' },
      { view: 'habits',    icon: '◆', label: 'Habitos' },
    ]
  },
  {
    label: 'Gestao',
    items: [
      { view: 'projects',  icon: '◈', label: 'Projectos' },
      { view: 'meetings',  icon: '◐', label: 'Reunioes e Actas' },
      { view: 'goals',     icon: '◑', label: 'Metas e Roteiro' },
    ]
  },
  {
    label: 'Analise',
    items: [
      { view: 'analytics', icon: '◧', label: 'Analise e Progresso' },
      { view: 'report',    icon: '⬡', label: 'Relatorio e Exportar' },
      { view: 'review',    icon: '◈', label: 'Revisao IA' },
    ]
  },
  {
    label: 'Outros',
    items: [
      { view: 'budget',    icon: '◐', label: 'Financas' },
      { view: 'resources', icon: '◑', label: 'Recursos' },
      { view: 'sections',  icon: '◧', label: 'Seccoes Custom' },
    ]
  },
]

const THEMES: { key: Theme; label: string; color: string }[] = [
  { key: 'default',  label: 'Cosmos',   color: 'linear-gradient(135deg,#7c3aed,#ff6b8b)' },
  { key: 'midnight', label: 'Midnight', color: 'linear-gradient(135deg,#3b82f6,#06b6d4)' },
  { key: 'rose',     label: 'Rose',     color: 'linear-gradient(135deg,#ff6b8b,#ec4899)' },
  { key: 'emerald',  label: 'Emerald',  color: 'linear-gradient(135deg,#10b981,#34d399)' },
  { key: 'pearl',    label: 'Pearl',    color: 'linear-gradient(135deg,#94a3b8,#e2e8f0)' },
  { key: 'ocean',    label: 'Ocean',    color: 'linear-gradient(135deg,#38bdf8,#818cf8)' },
  { key: 'sunset',   label: 'Sunset',   color: 'linear-gradient(135deg,#f97316,#eab308)' },
  { key: 'nordic',   label: 'Nordic',   color: 'linear-gradient(135deg,#64748b,#94a3b8)' },
  { key: 'amber',    label: 'Amber',    color: 'linear-gradient(135deg,#d97706,#f59e0b)' },
]

export default function Sidebar() {
  const { view, theme, setView, setSidebarOpen, setSettingsOpen, setTheme, showToast } = usePlanner()

  const navigate = (v: View) => {
    setView(v)
    setSidebarOpen(false)
  }

  const cycleTheme = () => {
    const keys = THEMES.map(t => t.key)
    const next = keys[(keys.indexOf(theme) + 1) % keys.length]
    setTheme(next)
    showToast(`Tema: ${THEMES.find(t => t.key === next)?.label}`)
  }

  return (
    <>
      {/* Brand */}
      <div className="p-brand">
        <div className="p-brand-icon" aria-hidden="true">✦</div>
        <div className="p-brand-text">
          <div className="p-brand-title">Planner 360</div>
          <div className="p-brand-sub">Sistema de Produtividade</div>
        </div>
        <button className="p-menu-close" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">✕</button>
      </div>

      {/* Navigation */}
      <nav className="p-menu" aria-label="Navegacao principal">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <div style={{ fontSize: '.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-mut)', padding: '8px 11px 4px', marginTop: '4px' }}>{group.label}</div>
            {group.items.map(item => (
              <button
                key={item.view}
                className={`p-nav-item${view === item.view ? ' active' : ''}`}
                onClick={() => navigate(item.view)}
                aria-current={view === item.view ? 'page' : undefined}
              >
                <span className="p-nav-icon" aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ))}

        <div style={{ height: '1px', background: 'var(--p-border)', margin: '6px 0' }} />

        <button className="p-nav-item" onClick={() => setSettingsOpen(true)}>
          <span className="p-nav-icon" aria-hidden="true">⊛</span>
          <span>Configuracoes</span>
        </button>
      </nav>

      {/* Theme switcher footer */}
      <div className="p-sidebar-footer">
        <div className="p-sidebar-footer-title">Temas Rapidos</div>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '8px' }}>
          {THEMES.map(t => (
            <button
              key={t.key}
              title={t.label}
              onClick={() => { setTheme(t.key); showToast(`Tema: ${t.label}`) }}
              style={{
                width: '26px', height: '26px', borderRadius: '8px', border: 'none',
                background: t.color, cursor: 'pointer', transition: 'var(--p-transition)',
                outline: theme === t.key ? '2px solid var(--text-pri)' : '2px solid transparent',
                outlineOffset: '2px',
              }}
              aria-label={`Tema ${t.label}`}
              aria-pressed={theme === t.key}
            />
          ))}
        </div>
        <button
          className="p-btn"
          onClick={cycleTheme}
          style={{ width: '100%', justifyContent: 'center', marginTop: '10px', borderRadius: '10px', fontSize: '.76rem' }}
        >
          ↺ Proximo Tema
        </button>
      </div>
    </>
  )
}
