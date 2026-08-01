'use client'

import { usePlanner } from '@/lib/planner-context'

const INSIGHTS = [
  { icon: '◎', title: 'Pico de Produtividade', body: 'Seu melhor desempenho ocorre entre 09h–11h. Reserve este periodo para tarefas criticas.' },
  { icon: '◆', title: 'Consistencia de Habitos', body: 'Voce manteve 3 de 5 habitos por mais de 14 dias consecutivos. Excelente consistencia!' },
  { icon: '◈', title: 'Gestao de Metas', body: 'Meta "Lancamento" esta 78% concluida. Aumente o ritmo nas proximas 48h para cumprir o prazo.' },
  { icon: '◉', title: 'Equilibrio Semanal', body: 'Segundas e quartas sao seus dias mais produtivos. Domingos podem ser melhorados.' },
]

function OrbitChart({ score }: { score: number }) {
  return (
    <div className="p-orbit-chart">
      <div className="p-orbit-center">{score}</div>
      {['◫','◉','◆','◈'].map((icon, i) => (
        <div key={i} className="p-orbit-dot" style={{ animationDelay: `${-i * 2}s` }}>
          <span style={{ fontSize: '.85rem' }}>{icon}</span>
        </div>
      ))}
    </div>
  )
}

export default function ViewReview() {
  const { tasks, habits, goals } = usePlanner()

  const done  = tasks.filter(t => t.completed).length
  const total = tasks.length
  const habitsDone = habits.filter(h => h.done).length
  const avgGoal = goals.length ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0

  const taskPct  = total > 0 ? Math.round((done / total) * 100) : 0
  const habitPct = habits.length > 0 ? Math.round((habitsDone / habits.length) * 100) : 0
  const focusPct = 82
  const score    = Math.round((taskPct + habitPct + avgGoal + focusPct) / 4)

  const metrics = [
    { label: 'Foco',         val: focusPct, c: 'var(--p-accent)' },
    { label: 'Consistencia', val: habitPct, c: 'var(--p-accent2)' },
    { label: 'Metas',        val: avgGoal,  c: 'var(--p-accent3)' },
    { label: 'Tarefas',      val: taskPct,  c: 'var(--p-accent4)' },
  ]

  return (
    <div>
      <div className="p-hero">
        <div>
          <div className="p-kicker">Revisao Inteligente</div>
          <h2 className="p-h-title">Analise de IA</h2>
          <div className="p-h-sub">Insights automaticos baseados em seus dados de produtividade e comportamento.</div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: '.65rem', color: 'var(--text-sec)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px', textAlign: 'center' }}>Score Geral</div>
          <div className="p-ai-score" style={{ fontSize: '3.5rem' }}>{score}</div>
          <div style={{ fontSize: '.7rem', color: 'var(--text-sec)', textAlign: 'center' }}>/ 100</div>
        </div>
      </div>

      <div className="p-ai-grid">
        {/* Left: metrics + insights */}
        <div style={{ display: 'grid', gap: '13px' }}>
          <div className="p-ai-card">
            <div style={{ marginBottom: '14px' }}>
              <div className="p-dash-kicker">Metricas Detalhadas</div>
              <div className="p-dash-title">Indicadores de Performance</div>
            </div>

            {metrics.map(m => (
              <div key={m.label} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--text-pri)' }}>{m.label}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '.8rem', fontWeight: 900, color: m.c }}>{m.val}%</span>
                </div>
                <div className="p-meter">
                  <i style={{ '--w': `${m.val}%`, background: m.c } as React.CSSProperties} />
                </div>
              </div>
            ))}

            <div style={{ marginTop: '16px', display: 'grid', gap: '8px' }}>
              <div className="p-dash-kicker">Insights da IA</div>
              {INSIGHTS.map(ins => (
                <div key={ins.title} className="p-ai-insight">
                  <div className="p-ai-icon">{ins.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '.8rem', marginBottom: '2px', color: 'var(--text-pri)' }}>
                      <b>{ins.title}</b>
                    </div>
                    <div style={{ fontSize: '.74rem', color: 'var(--text-sec)', lineHeight: 1.5 }}>{ins.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: orbit + donut */}
        <div style={{ display: 'grid', gap: '13px', alignContent: 'start' }}>
          <div className="p-3d-panel">
            <div className="p-dash-kicker">Score Visual</div>
            <div className="p-dash-title" style={{ marginBottom: '4px' }}>Radar de Performance</div>
            <OrbitChart score={score} />
            <div className="p-ring-legend" style={{ justifyContent: 'center' }}>
              {metrics.map(m => (
                <div key={m.label} className="p-legend-item">
                  <div className="p-legend-dot" style={{ background: m.c }} />
                  {m.label}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3d-panel">
            <div className="p-dash-kicker">Distribuicao</div>
            <div className="p-dash-title" style={{ marginBottom: '4px' }}>Por Categoria</div>
            <div className="p-donut-wrap">
              <div className="p-donut" style={{ background: `conic-gradient(var(--p-accent) 0% ${taskPct}%,var(--p-accent3) ${taskPct}% ${taskPct + avgGoal / 2}%,var(--p-accent2) ${taskPct + avgGoal / 2}% ${taskPct + avgGoal / 2 + habitPct / 3}%,var(--bg-secondary) ${taskPct + avgGoal / 2 + habitPct / 3}% 100%)` }}>
                <div className="p-donut-inner">
                  <b>{score}</b>
                  <span>Score</span>
                </div>
              </div>
            </div>
            <div className="p-ring-legend" style={{ justifyContent: 'center', marginTop: '6px' }}>
              <div className="p-legend-item"><div className="p-legend-dot" style={{ background: 'var(--p-accent)' }} />Tarefas</div>
              <div className="p-legend-item"><div className="p-legend-dot" style={{ background: 'var(--p-accent3)' }} />Metas</div>
              <div className="p-legend-item"><div className="p-legend-dot" style={{ background: 'var(--p-accent2)' }} />Habitos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
