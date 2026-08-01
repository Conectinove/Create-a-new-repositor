'use client'

import { useState, useEffect } from 'react'
import { usePlanner } from '@/lib/planner-context'

const DAYS = ['Seg','Ter','Qua','Qui','Sex','Sab','Dom']

function SaasBar({ label, pct, c, delay }: { label: string; pct: number; c: string; delay: string }) {
  const height = `${(pct / 100) * 176}px`
  return (
    <div className="p-saas-col">
      <div className="p-saas-fw">
        <div
          className={`p-saas-fill ${c}`}
          style={{ height, animationDelay: delay }}
        >
          <span className="p-saas-val">{pct}%</span>
        </div>
      </div>
      <span className="p-saas-bar-lbl">{label}</span>
      <div className="p-saas-tooltip">{label}: {pct}%</div>
    </div>
  )
}

export default function ViewDashboard() {
  const { tasks, habits, goals, notes, setView, showToast } = usePlanner()

  const done = tasks.filter(t => t.completed).length
  const total = tasks.length
  const habitsDone = habits.filter(h => h.done).length
  const avgGoal = goals.length ? Math.round(goals.reduce((a,g) => a + g.progress, 0) / goals.length) : 0
  const streak = habits.reduce((a,h) => a + h.streak, 0)

  const weekData = [
    { label: 'Seg', pct: 82, c: 'c1' },
    { label: 'Ter', pct: 65, c: 'c2' },
    { label: 'Qua', pct: 90, c: 'c3' },
    { label: 'Qui', pct: 48, c: 'c4' },
    { label: 'Sex', pct: 73, c: 'c5' },
    { label: 'Sab', pct: 57, c: 'c1' },
    { label: 'Dom', pct: 38, c: 'c2' },
  ]

  const [dateStr, setDateStr] = useState('')
  useEffect(() => {
    const now = new Date()
    const str = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
    setDateStr(str.charAt(0).toUpperCase() + str.slice(1))
  }, [])

  return (
    <div>
      {/* Hero */}
      <div className="p-hero">
        <div>
          <div className="p-kicker">Painel Principal</div>
          <h1 className="p-h-title">Bem-vindo de volta!</h1>
          <div className="p-h-sub">{dateStr ? `${dateStr} — Seu progresso esta incrivel hoje.` : ''}</div>
          <div className="p-hero-actions">
            <button className="p-btn p-btn-primary" onClick={() => setView('planner')}>+ Nova Tarefa</button>
            <button className="p-btn" onClick={() => setView('focus')}>▶ Modo Foco</button>
            <button className="p-btn" onClick={() => setView('analytics')}>Ver Analise</button>
          </div>
        </div>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div className="p-donut-wrap" style={{ margin: 0 }}>
            <div className="p-donut" style={{ background: `conic-gradient(var(--p-accent) 0% ${avgGoal}%,var(--bg-secondary) ${avgGoal}% 100%)` }}>
              <div className="p-donut-inner">
                <b>{avgGoal}%</b>
                <span>Metas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick jumps */}
      <div className="p-jump-row">
        {(['planner','calendar','analytics','focus','goals','budget'] as const).map(v => (
          <button key={v} className="p-jump" onClick={() => setView(v)}>
            {v === 'planner' ? '◫ Planejador' : v === 'calendar' ? '◷ Calendario' : v === 'analytics' ? '◈ Analise' : v === 'focus' ? '◎ Foco' : v === 'goals' ? '◆ Metas' : '◐ Financas'}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="p-stats">
        <div className="p-stat">
          <div className="p-stat-label">Tarefas Feitas</div>
          <div className="p-stat-value" style={{ color: 'var(--p-accent)' }}>{done}</div>
          <div className="p-stat-sub">de {total} total</div>
          <div className="p-stat-icon" style={{ background: 'var(--accent-trans)' }}>◫</div>
        </div>
        <div className="p-stat">
          <div className="p-stat-label">Habitos Hoje</div>
          <div className="p-stat-value" style={{ color: 'var(--p-accent3)' }}>{habitsDone}</div>
          <div className="p-stat-sub">de {habits.length} habitos</div>
          <div className="p-stat-icon" style={{ background: 'var(--accent3-trans)' }}>◉</div>
        </div>
        <div className="p-stat">
          <div className="p-stat-label">Media Metas</div>
          <div className="p-stat-value" style={{ color: 'var(--p-accent2)' }}>{avgGoal}%</div>
          <div className="p-stat-sub">{goals.length} metas ativas</div>
          <div className="p-stat-icon" style={{ background: 'var(--accent2-trans)' }}>◆</div>
        </div>
        <div className="p-stat">
          <div className="p-stat-label">Dias de Streak</div>
          <div className="p-stat-value" style={{ color: 'var(--p-accent4)' }}>{streak}</div>
          <div className="p-stat-sub">dias acumulados</div>
          <div className="p-stat-icon" style={{ background: 'var(--accent4-trans)' }}>▲</div>
        </div>
      </div>

      {/* Main grid */}
      <div className="p-pro-grid">
        {/* Bar chart panel */}
        <div className="p-dash-section">
          <div className="p-dash-head">
            <div>
              <div className="p-dash-kicker">Desempenho Semanal</div>
              <div className="p-dash-title">Produtividade por Dia</div>
              <div className="p-dash-sub">Taxa de conclusao de tarefas em cada dia da semana.</div>
            </div>
            <div className="p-dash-chip">Esta semana</div>
          </div>
          <div className="p-saas-container">
            <div className="p-saas-gridlines">
              {[100,75,50,25].map((v, i) => (
                <div key={v} className="p-saas-gridline" style={{ top: `${i * 25}%` }}>
                  <span className="p-saas-lbl">{v}</span>
                </div>
              ))}
            </div>
            <div className="p-saas-bars">
              {weekData.map((d, i) => (
                <SaasBar key={d.label} label={d.label} pct={d.pct} c={d.c} delay={`${i * 0.08}s`} />
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'grid', gap: '13px' }}>
          {/* Habits */}
          <div className="p-panel">
            <div className="p-panel-header">
              <span className="p-panel-title">◉ Habitos Hoje</span>
              <button className="p-btn" style={{ padding: '5px 10px', fontSize: '.72rem' }} onClick={() => setView('focus')}>Ver todos</button>
            </div>
            <div style={{ padding: '13px' }}>
              {habits.slice(0, 4).map(h => (
                <div key={h.id} className="p-habit" style={{ cursor: 'default' }}>
                  <div className={`p-habit-check${h.done ? ' done' : ''}`} style={{ borderColor: h.color || 'var(--p-accent)' }}>
                    {h.done ? '✓' : ''}
                  </div>
                  <span className="p-habit-name">{h.name}</span>
                  <span className="p-habit-streak">{h.streak}d</span>
                </div>
              ))}
            </div>
          </div>

          {/* Goals quick */}
          <div className="p-panel">
            <div className="p-panel-header">
              <span className="p-panel-title">◆ Metas Ativas</span>
              <button className="p-btn" style={{ padding: '5px 10px', fontSize: '.72rem' }} onClick={() => setView('goals')}>Ver todos</button>
            </div>
            <div style={{ padding: '13px', display: 'grid', gap: '10px' }}>
              {goals.map(g => (
                <div key={g.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--text-pri)' }}>{g.title}</span>
                    <span style={{ fontSize: '.75rem', fontFamily: 'monospace', color: g.color || 'var(--p-accent)', fontWeight: 900 }}>{g.progress}%</span>
                  </div>
                  <div className="p-meter"><i style={{ '--w': `${g.progress}%`, background: g.color } as React.CSSProperties} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="p-ticker">
        <div className="p-ticker-lbl">AO VIVO</div>
        <div className="p-ticker-track">
          <div className="p-ticker-inner">
            {[
              { k: 'Tarefas da semana', v: `${total}` },
              { k: 'Habitos ativos', v: `${habits.length}` },
              { k: 'Metas em progresso', v: `${goals.length}` },
              { k: 'Notas salvas', v: `${notes.length}` },
              { k: 'Progresso geral', v: `${avgGoal}%` },
              { k: 'Streak total', v: `${streak} dias` },
            ].map(item => (
              <span key={item.k} className="p-ticker-item">
                {item.k}: <span>{item.v}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Features row */}
      <div className="p-features-row">
        <div className="p-feature-card">
          <div className="p-feature-head">
            <div>
              <div className="p-feature-title">Analise de Produtividade</div>
              <div className="p-feature-sub">Acompanhe tendencias e padroes ao longo do tempo</div>
            </div>
            <button className="p-btn p-btn-primary" style={{ fontSize: '.75rem', padding: '7px 13px', flexShrink: 0 }} onClick={() => setView('analytics')}>Abrir</button>
          </div>
          <div className="p-mini-progress-row">
            {[
              { label: 'Tarefas', val: total > 0 ? Math.round((done/total)*100) : 0, unit: '%' },
              { label: 'Habitos', val: habits.length > 0 ? Math.round((habitsDone/habits.length)*100) : 0, unit: '%' },
              { label: 'Metas', val: avgGoal, unit: '%' },
            ].map(item => (
              <div key={item.label} className="p-mini-pcard">
                <b>{item.val}{item.unit}</b>
                <span>{item.label}</span>
                <div className="p-meter"><i style={{ '--w': `${item.val}%` } as React.CSSProperties} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-feature-card">
          <div className="p-feature-head">
            <div>
              <div className="p-feature-title">Revisao de IA</div>
              <div className="p-feature-sub">Score inteligente e insights personalizados</div>
            </div>
            <button className="p-btn p-btn-primary" style={{ fontSize: '.75rem', padding: '7px 13px', flexShrink: 0 }} onClick={() => setView('review')}>Abrir</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px' }}>
            <div>
              <div style={{ fontSize: '.65rem', color: 'var(--text-sec)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>Score Geral</div>
              <div className="p-ai-score">{avgGoal + 5 > 100 ? 100 : avgGoal + 5}</div>
            </div>
            <div style={{ flex: 1, display: 'grid', gap: '6px' }}>
              {['Foco', 'Consistencia', 'Equilibrio'].map((label, i) => {
                const vals = [82, 74, 68]
                return (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.67rem', color: 'var(--text-sec)', marginBottom: '2px' }}>
                      <span>{label}</span><span style={{ fontFamily: 'monospace', color: 'var(--p-accent)' }}>{vals[i]}%</span>
                    </div>
                    <div className="p-meter"><i style={{ '--w': `${vals[i]}%` } as React.CSSProperties} /></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
