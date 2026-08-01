'use client'

import { useState } from 'react'
import { usePlanner, Goal } from '@/lib/planner-context'

const COLORS = ['#7c3aed','#ff6b8b','#22c55e','#f59e0b','#ef4444','#06b6d4','#8b5cf6','#ec4899']

export default function ViewGoals() {
  const { goals, addGoal, deleteGoal, showToast } = usePlanner()
  const [modalOpen, setModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [progress, setProgress] = useState(0)
  const [deadline, setDeadline] = useState('')
  const [color, setColor] = useState(COLORS[0])

  const submit = () => {
    if (!title.trim()) return
    addGoal({ title: title.trim(), description: desc, progress, deadline, color })
    setTitle(''); setDesc(''); setProgress(0); setDeadline(''); setColor(COLORS[0])
    setModalOpen(false)
    showToast('Meta adicionada!')
  }

  const avgProgress = goals.length ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0

  const daysUntil = (deadline?: string) => {
    if (!deadline) return null
    const diff = new Date(deadline).getTime() - Date.now()
    const days = Math.ceil(diff / 86400000)
    return days
  }

  return (
    <div>
      <div className="p-hero">
        <div>
          <div className="p-kicker">Roteiro de Metas</div>
          <h2 className="p-h-title">Suas Metas</h2>
          <div className="p-h-sub">{goals.length} meta{goals.length !== 1 ? 's' : ''} ativa{goals.length !== 1 ? 's' : ''} — media de {avgProgress}% de progresso.</div>
          <div className="p-hero-actions">
            <button className="p-btn p-btn-primary" onClick={() => setModalOpen(true)}>+ Nova Meta</button>
          </div>
        </div>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div className="p-donut-wrap" style={{ margin: 0 }}>
            <div className="p-donut" style={{ background: `conic-gradient(var(--p-accent) 0% ${avgProgress}%,var(--bg-secondary) ${avgProgress}% 100%)` }}>
              <div className="p-donut-inner">
                <b>{avgProgress}%</b>
                <span>Media</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-roadmap">
        {goals.length === 0 ? (
          <div className="p-roadmap-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.5 }}>◆</div>
            <div style={{ color: 'var(--text-sec)', fontSize: '.9rem' }}>Nenhuma meta ainda. Adicione sua primeira meta!</div>
          </div>
        ) : (
          goals.map((g, i) => {
            const days = daysUntil(g.deadline)
            const urgency = days !== null && days <= 7

            return (
              <div key={g.id} className="p-roadmap-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', flex: 1 }}>
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '50%', background: g.color || 'var(--p-accent)',
                      boxShadow: `0 0 10px ${g.color || 'var(--p-accent)'}55`, flexShrink: 0, marginTop: '4px'
                    }} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '.92rem', color: 'var(--text-pri)', marginBottom: '3px' }}>{g.title}</div>
                      <div style={{ fontSize: '.76rem', color: 'var(--text-sec)', lineHeight: 1.45 }}>{g.description}</div>
                    </div>
                  </div>
                  <button
                    className="p-note-del"
                    onClick={() => { deleteGoal(g.id); showToast('Meta removida') }}
                    aria-label={`Remover meta ${g.title}`}
                  >✕</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{ fontSize: '.72rem', color: 'var(--text-sec)' }}>Progresso</span>
                  <span style={{ fontSize: '.78rem', fontFamily: 'monospace', fontWeight: 900, color: g.color || 'var(--p-accent)' }}>{g.progress}%</span>
                </div>
                <div className="p-progress-line">
                  <span style={{ width: `${g.progress}%`, background: g.color || 'var(--p-accent)' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '9px' }}>
                  {g.deadline && (
                    <div style={{
                      fontSize: '.69rem', padding: '3px 9px', borderRadius: '999px',
                      background: urgency ? 'var(--accent5-trans)' : 'var(--bg-glass)',
                      color: urgency ? 'var(--p-accent5)' : 'var(--text-sec)',
                      border: `1px solid ${urgency ? 'rgba(239,68,68,0.3)' : 'var(--p-border)'}`,
                    }}>
                      {days !== null && days >= 0 ? `${days} dias restantes` : days !== null ? 'Vencida' : ''}
                    </div>
                  )}
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
                    {[0,25,50,75,100].map(v => (
                      <div key={v} style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: g.progress >= v ? (g.color || 'var(--p-accent)') : 'var(--bg-secondary)',
                        border: '1px solid var(--p-border)',
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            )
          })
        )}

        {/* Add card */}
        <button
          className="p-roadmap-card"
          onClick={() => setModalOpen(true)}
          style={{
            cursor: 'pointer', border: '2px dashed var(--p-border)', background: 'transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '10px', minHeight: '180px',
          }}
          aria-label="Adicionar nova meta"
        >
          <div style={{ fontSize: '2rem', opacity: 0.4 }}>+</div>
          <div style={{ fontSize: '.82rem', color: 'var(--text-sec)' }}>Nova Meta</div>
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="p-modal-overlay open" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="p-modal" role="dialog" aria-modal="true" aria-label="Nova meta">
            <div className="p-modal-title">
              <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--grad1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>◆</span>
              Nova Meta
            </div>

            <div className="p-form-group">
              <label className="p-form-label" htmlFor="goal-title">Titulo</label>
              <input id="goal-title" className="p-form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nome da meta..." autoFocus />
            </div>

            <div className="p-form-group">
              <label className="p-form-label" htmlFor="goal-desc">Descricao</label>
              <textarea id="goal-desc" className="p-form-textarea" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descreva sua meta..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="p-form-group">
                <label className="p-form-label" htmlFor="goal-progress">Progresso inicial (%)</label>
                <input id="goal-progress" type="number" min="0" max="100" className="p-form-input" value={progress} onChange={e => setProgress(Number(e.target.value))} />
              </div>
              <div className="p-form-group">
                <label className="p-form-label" htmlFor="goal-deadline">Prazo</label>
                <input id="goal-deadline" type="date" className="p-form-input" value={deadline} onChange={e => setDeadline(e.target.value)} />
              </div>
            </div>

            <div className="p-form-group">
              <label className="p-form-label">Cor</label>
              <div className="p-color-picker">
                {COLORS.map(c => (
                  <button
                    key={c}
                    className={`p-color-dot${color === c ? ' selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => setColor(c)}
                    aria-label={`Cor ${c}`}
                    aria-pressed={color === c}
                  />
                ))}
              </div>
            </div>

            <div className="p-modal-actions">
              <button className="p-btn" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button className="p-btn p-btn-primary" onClick={submit}>Adicionar Meta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
