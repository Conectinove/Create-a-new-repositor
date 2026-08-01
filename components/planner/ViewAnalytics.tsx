'use client'

import { usePlanner } from '@/lib/planner-context'

const MONTHS_SHORT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

const MONTHLY_TREND = [62, 71, 58, 84, 77, 88, 72, 91, 85, 78, 93, 87]

function LineChart({ data, color = 'var(--p-accent)' }: { data: number[]; color?: string }) {
  const max = Math.max(...data) || 1
  const w = 300
  const h = 120
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - (v / max) * h * 0.85 - 8,
  }))
  const pathD = pts.reduce((acc, p, i) =>
    i === 0 ? `M${p.x},${p.y}` : `${acc} C${pts[i-1].x + 24},${pts[i-1].y} ${p.x - 24},${p.y} ${p.x},${p.y}`, '')
  const areaD = `${pathD} L${pts[pts.length-1].x},${h} L${pts[0].x},${h} Z`

  return (
    <div className="p-line-card">
      <svg viewBox={`0 0 ${w} ${h}`} className="p-line-svg" aria-hidden="true">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#lineGrad)" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" className="p-line-glow" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={color} stroke="var(--bg-card)" strokeWidth="2"
            className={i === pts.length - 1 ? 'p-dot-pulse' : ''} />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px' }}>
        {MONTHS_SHORT.map((m, i) => (
          <span key={m} style={{ fontSize: '.6rem', color: 'var(--text-mut)' }}>{m}</span>
        ))}
      </div>
    </div>
  )
}

function Bar3D({ label, value, color, delay, maxVal }: { label: string; value: number; color: string; delay: string; maxVal: number }) {
  const h = Math.max(20, Math.round((value / maxVal) * 155))
  return (
    <div className="p3d" style={{ '--h': `${h}px`, '--c': color, '--d': delay } as React.CSSProperties}>
      <div className="f" />
      <div className="t" />
      <div className="s" />
      <div className="v">{value}%</div>
      <div className="l">{label}</div>
    </div>
  )
}

export default function ViewAnalytics() {
  const { tasks, habits, goals } = usePlanner()

  const done = tasks.filter(t => t.completed).length
  const total = tasks.length
  const habitsDone = habits.filter(h => h.done).length
  const avgGoal = goals.length ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0
  const taskPct = total > 0 ? Math.round((done / total) * 100) : 0
  const habitPct = habits.length > 0 ? Math.round((habitsDone / habits.length) * 100) : 0

  const bars3d = [
    { label: 'Jan', value: 72, color: '#7c3aed' },
    { label: 'Fev', value: 85, color: '#ff6b8b' },
    { label: 'Mar', value: 63, color: '#22c55e' },
    { label: 'Abr', value: 91, color: '#f59e0b' },
    { label: 'Mai', value: 78, color: '#7c3aed' },
    { label: 'Jun', value: 88, color: '#ff6b8b' },
  ]

  const weekBars = [
    { label: 'Seg', pct: 82 }, { label: 'Ter', pct: 65 }, { label: 'Qua', pct: 90 },
    { label: 'Qui', pct: 48 }, { label: 'Sex', pct: 73 }, { label: 'Sab', pct: 57 }, { label: 'Dom', pct: 38 },
  ]

  const waffle = Array.from({ length: 50 }, (_, i) => i < Math.round(avgGoal / 2))

  return (
    <div>
      <div className="p-hero">
        <div>
          <div className="p-kicker">Analise e Progresso</div>
          <h2 className="p-h-title">Visao Completa</h2>
          <div className="p-h-sub">Acompanhe tendencias, habitos, metas e desempenho em tempo real.</div>
        </div>
        <div className="p-kpi-row" style={{ flex: 'none' }}>
          {[
            { label: 'Tarefas', val: `${taskPct}%` },
            { label: 'Habitos', val: `${habitPct}%` },
            { label: 'Metas', val: `${avgGoal}%` },
            { label: 'Score', val: `${Math.round((taskPct + habitPct + avgGoal) / 3)}` },
          ].map(k => (
            <div key={k.label} className="p-kpi">
              <b>{k.val}</b>
              <span>{k.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trend line + Waffle */}
      <div className="p-pro-grid" style={{ marginTop: '13px' }}>
        <div className="p-dash-section">
          <div className="p-dash-head">
            <div>
              <div className="p-dash-kicker">Tendencia Anual</div>
              <div className="p-dash-title">Produtividade Mensal</div>
              <div className="p-dash-sub">Taxa media de conclusao ao longo dos ultimos 12 meses.</div>
            </div>
            <div className="p-dash-chip">2026</div>
          </div>
          <LineChart data={MONTHLY_TREND} />
        </div>

        <div style={{ display: 'grid', gap: '13px' }}>
          <div className="p-dash-section">
            <div className="p-dash-kicker">Progresso Geral</div>
            <div className="p-dash-title" style={{ marginBottom: '8px' }}>Mapa de Progresso</div>
            <div className="p-waffle-grid">
              {waffle.map((filled, i) => (
                <div key={i} className={`p-waffle-cell${filled ? ' filled' : ''}`} title={filled ? 'Concluido' : 'Pendente'} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.69rem', color: 'var(--text-sec)' }}>
              <span>0%</span>
              <span style={{ color: 'var(--p-accent)', fontWeight: 700 }}>{avgGoal}% medio</span>
              <span>100%</span>
            </div>
          </div>

          <div className="p-dash-section">
            <div className="p-dash-kicker">Dia a dia</div>
            <div className="p-dash-title" style={{ marginBottom: '11px' }}>Semana Atual</div>
            <div className="p-bar-inner">
              {weekBars.map((b, i) => (
                <div key={b.label} className="p-bar-wrap">
                  <div className="p-bar-track" style={{ height: '90px' }}>
                    <div className={`p-bar-fill c${(i % 4) + 1}`} style={{ height: `${b.pct}%`, animationDelay: `${i * 0.08}s` }} />
                  </div>
                  <div className="p-bar-pct">{b.pct}%</div>
                  <div className="p-bar-label">{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Bars */}
      <div className="p-3d-panel" style={{ marginTop: '13px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '.65rem', color: 'var(--p-accent)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '3px' }}>Graficos 3D</div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-pri)' }}>Desempenho Semestral</div>
          </div>
          <div className="p-waveform" aria-hidden="true">
            {Array.from({length:10}).map((_,i) => <div key={i} className="p-wave-bar" style={{ animationDelay: `${i*0.07}s`, height: `${7 + (i%4)*6}px` }} />)}
          </div>
        </div>
        <div className="p-3d-stage">
          {bars3d.map((b, i) => (
            <Bar3D key={b.label} label={b.label} value={b.value} color={b.color} delay={`${i * 0.12}s`} maxVal={100} />
          ))}
        </div>
      </div>

      {/* Analytics row */}
      <div className="p-analytics-row">
        {/* By day */}
        <div className="p-panel">
          <div className="p-panel-header"><span className="p-panel-title">Por Dia da Semana</span></div>
          <div style={{ padding: '14px' }}>
            <div className="p-stacked">
              {weekBars.map(b => (
                <div key={b.label} className="p-stack-row">
                  <div className="p-stack-label">{b.label}</div>
                  <div className="p-stack-track">
                    <i style={{ '--w': `${b.pct}%`, '--c': `var(--p-accent)` } as React.CSSProperties} />
                    <i style={{ '--w': `${Math.round(b.pct * 0.3)}%`, '--c': `var(--p-accent2)` } as React.CSSProperties} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results timeline */}
        <div className="p-panel">
          <div className="p-panel-header"><span className="p-panel-title">Timeline de Resultados</span></div>
          <div style={{ padding: '14px' }}>
            {weekBars.map((b, i) => (
              <div key={b.label} className="p-result-row">
                <div className="p-result-day">{b.label}</div>
                <div className="p-result-bar"><i style={{ '--w': `${b.pct}%`, '--c': i % 2 === 0 ? 'var(--grad1)' : 'var(--grad3)' } as React.CSSProperties} /></div>
                <div className="p-result-val">{b.pct}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Habits donut */}
        <div className="p-panel">
          <div className="p-panel-header"><span className="p-panel-title">Habitos Hoje</span></div>
          <div style={{ padding: '14px' }}>
            <div className="p-donut-wrap">
              <div className="p-donut" style={{ background: `conic-gradient(var(--p-accent3) 0% ${habitPct}%,var(--bg-secondary) ${habitPct}% 100%)`, boxShadow: `0 0 36px color-mix(in srgb, var(--p-accent3) 24%,transparent)` }}>
                <div className="p-donut-inner">
                  <b style={{ color: 'var(--p-accent3)' }}>{habitPct}%</b>
                  <span>Habitos</span>
                </div>
              </div>
            </div>
            <div className="p-ring-legend" style={{ justifyContent: 'center', marginTop: '8px' }}>
              <div className="p-legend-item"><div className="p-legend-dot" style={{ background: 'var(--p-accent3)' }} />Concluidos ({habitsDone})</div>
              <div className="p-legend-item"><div className="p-legend-dot" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--p-border)' }} />Pendentes ({habits.length - habitsDone})</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
