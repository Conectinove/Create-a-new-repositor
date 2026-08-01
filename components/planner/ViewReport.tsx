'use client'

import { usePlanner } from '@/lib/planner-context'

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const DAYS_LABEL = ['Seg','Ter','Qua','Qui','Sex','Sab','Dom']

export default function ViewReport() {
  const { tasks, habits, habitRecords, goals, projects, meetings, calendarEvents } = usePlanner()

  const completedTasks = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const doneHabits = habitRecords.filter(h => h.done).length
  const habitRate = habitRecords.length > 0 ? Math.round((doneHabits / habitRecords.length) * 100) : 0

  const avgGoalProgress = goals.length > 0 ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length) : 0

  const activeProjects = projects.filter(p => p.status === 'active').length
  const avgProjectProgress = projects.length > 0 ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0

  const pendingActions = meetings.reduce((acc, m) => acc + m.actions.filter(a => !a.done).length, 0)

  const upcomingEvents = calendarEvents.filter(e => e.date >= new Date().toISOString().slice(0, 10)).length

  // Tasks by priority
  const highPriority = tasks.filter(t => t.priority === 'high')
  const medPriority = tasks.filter(t => t.priority === 'medium')
  const lowPriority = tasks.filter(t => t.priority === 'low')

  // Tasks by day of week
  const tasksByDay = DAYS_LABEL.map((_, i) => tasks.filter(t => t.day === i).length)
  const maxTasksDay = Math.max(...tasksByDay, 1)

  // Top habits by streak
  const topHabits = [...habitRecords].sort((a, b) => b.streak - a.streak).slice(0, 5)

  const exportCSV = () => {
    const rows = [
      ['Metrica', 'Valor'],
      ['Tarefas Concluidas', completedTasks],
      ['Total de Tarefas', totalTasks],
      ['Taxa de Conclusao (%)', taskRate],
      ['Habitos Feitos Hoje', doneHabits],
      ['Total de Habitos', habitRecords.length],
      ['Taxa de Habitos (%)', habitRate],
      ['Progresso Medio Metas (%)', avgGoalProgress],
      ['Projectos Activos', activeProjects],
      ['Progresso Medio Projectos (%)', avgProjectProgress],
      ['Accoes Pendentes', pendingActions],
      ['Eventos Proximos', upcomingEvents],
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'relatorio-planner360.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const StatBlock = ({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) => (
    <div className="p-stat">
      <div className="p-stat-label">{label}</div>
      <div className="p-stat-value" style={color ? { color } : {}}>{value}</div>
      {sub && <div className="p-stat-sub">{sub}</div>}
    </div>
  )

  return (
    <div>
      <div className="p-hero">
        <div>
          <div className="p-kicker">Relatorio e Exportacao</div>
          <h2 className="p-h-title">Relatorio Geral</h2>
          <div className="p-h-sub">Visao consolidada do seu desempenho, progressos e metricas.</div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <button className="p-btn p-btn-primary" onClick={exportCSV}>
            ↓ Exportar CSV
          </button>
        </div>
      </div>

      {/* Top stats */}
      <div className="p-stats" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '13px' }}>
        <StatBlock label="Tarefas" value={`${completedTasks}/${totalTasks}`} sub={`${taskRate}% concluidas`} color="var(--p-accent)" />
        <StatBlock label="Habitos Hoje" value={`${doneHabits}/${habitRecords.length}`} sub={`${habitRate}% feitos`} color="var(--p-accent3)" />
        <StatBlock label="Progresso Metas" value={`${avgGoalProgress}%`} sub={`${goals.length} metas activas`} color="var(--p-accent2)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '13px', marginBottom: '13px' }}>
        {/* Tasks by day bar chart */}
        <div className="p-panel">
          <div className="p-panel-header"><span className="p-panel-title">Tarefas por Dia da Semana</span></div>
          <div style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '100px' }}>
              {tasksByDay.map((count, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '.65rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--p-accent)' }}>{count}</span>
                  <div style={{ width: '100%', background: 'var(--bg-glass)', borderRadius: '6px 6px 0 0', height: `${Math.round((count / maxTasksDay) * 72)}px`, background: `linear-gradient(180deg, var(--p-accent), var(--p-accent2))`, minHeight: count > 0 ? '4px' : '0', transition: 'height 0.5s ease' }} />
                  <span style={{ fontSize: '.62rem', color: 'var(--text-sec)', fontWeight: 700 }}>{DAYS_LABEL[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priorities */}
        <div className="p-panel">
          <div className="p-panel-header"><span className="p-panel-title">Distribuicao de Prioridades</span></div>
          <div style={{ padding: '18px 20px', display: 'grid', gap: '12px' }}>
            {[
              { label: 'Alta Prioridade', tasks: highPriority, color: 'var(--p-accent5)' },
              { label: 'Media Prioridade', tasks: medPriority, color: 'var(--p-accent4)' },
              { label: 'Baixa Prioridade', tasks: lowPriority, color: 'var(--p-accent3)' },
            ].map(({ label, tasks: t, color }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '.78rem', color: 'var(--text-sec)' }}>{label}</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '.78rem', color }}>{t.length} ({t.filter(x => x.completed).length} concluidas)</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${totalTasks > 0 ? (t.length / totalTasks) * 100 : 0}%`, background: color, borderRadius: '999px', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '13px', marginBottom: '13px' }}>
        {/* Top habits by streak */}
        <div className="p-panel">
          <div className="p-panel-header">
            <span className="p-panel-title">Top Habitos (Streak)</span>
          </div>
          <div style={{ padding: '13px 16px', display: 'grid', gap: '8px' }}>
            {topHabits.length === 0 && <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-sec)', fontSize: '.8rem' }}>Nenhum habito ainda</div>}
            {topHabits.map((h, idx) => (
              <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '10px', background: 'var(--bg-glass)', border: '1px solid var(--p-border)' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '.85rem', color: 'var(--text-sec)', width: '16px', textAlign: 'center' }}>{idx + 1}</span>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: h.color || 'var(--p-accent)', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '.82rem', color: 'var(--text-pri)', fontWeight: 500 }}>{h.name}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '.85rem', color: h.color || 'var(--p-accent)' }}>{h.streak}d</span>
              </div>
            ))}
          </div>
        </div>

        {/* Projects overview */}
        <div className="p-panel">
          <div className="p-panel-header">
            <span className="p-panel-title">Projectos</span>
            <span style={{ fontSize: '.72rem', color: 'var(--text-sec)' }}>Media: {avgProjectProgress}%</span>
          </div>
          <div style={{ padding: '13px 16px', display: 'grid', gap: '10px' }}>
            {projects.length === 0 && <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-sec)', fontSize: '.8rem' }}>Nenhum projecto</div>}
            {projects.map(p => (
              <div key={p.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '.8rem', color: 'var(--text-pri)', fontWeight: 600 }}>{p.name}</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '.78rem', color: p.color || 'var(--p-accent)' }}>{p.progress}%</span>
                </div>
                <div style={{ height: '5px', background: 'var(--bg-secondary)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.progress}%`, background: p.color || 'var(--p-accent)', borderRadius: '999px', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goals progress */}
      <div className="p-panel" style={{ marginBottom: '13px' }}>
        <div className="p-panel-header"><span className="p-panel-title">Progresso das Metas</span></div>
        <div style={{ padding: '16px 18px', display: 'grid', gap: '14px' }}>
          {goals.length === 0 && <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-sec)', fontSize: '.85rem' }}>Nenhuma meta definida</div>}
          {goals.map(g => (
            <div key={g.id} style={{ display: 'grid', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--text-pri)' }}>{g.title}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--text-sec)' }}>{g.description}</div>
                </div>
                <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.1rem', color: g.color || 'var(--p-accent)' }}>{g.progress}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${g.progress}%`, background: g.color || 'var(--p-accent)', borderRadius: '999px', transition: 'width 0.6s ease' }} />
              </div>
              {g.deadline && <div style={{ fontSize: '.68rem', color: 'var(--text-sec)' }}>Prazo: {new Date(g.deadline + 'T00:00:00').toLocaleDateString('pt-PT')}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Summary tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '13px' }}>
        <div className="p-panel" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '.68rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--p-accent4)', fontWeight: 800, marginBottom: '6px' }}>Accoes Pendentes</div>
          <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 900, color: 'var(--text-pri)', lineHeight: 1 }}>{pendingActions}</div>
          <div style={{ fontSize: '.72rem', color: 'var(--text-sec)', marginTop: '4px' }}>em {meetings.length} reunioes</div>
        </div>
        <div className="p-panel" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '.68rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--p-accent2)', fontWeight: 800, marginBottom: '6px' }}>Eventos Proximos</div>
          <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 900, color: 'var(--text-pri)', lineHeight: 1 }}>{upcomingEvents}</div>
          <div style={{ fontSize: '.72rem', color: 'var(--text-sec)', marginTop: '4px' }}>no calendario</div>
        </div>
        <div className="p-panel" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '.68rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--p-accent3)', fontWeight: 800, marginBottom: '6px' }}>Projectos Activos</div>
          <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 900, color: 'var(--text-pri)', lineHeight: 1 }}>{activeProjects}</div>
          <div style={{ fontSize: '.72rem', color: 'var(--text-sec)', marginTop: '4px' }}>media {avgProjectProgress}% progresso</div>
        </div>
      </div>
    </div>
  )
}
