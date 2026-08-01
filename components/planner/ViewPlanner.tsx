'use client'

import { useState, useEffect } from 'react'
import { usePlanner, Task } from '@/lib/planner-context'

const DAY_NAMES = ['Segunda','Terca','Quarta','Quinta','Sexta','Sabado','Domingo']
const DAY_SHORT = ['SEG','TER','QUA','QUI','SEX','SAB','DOM']

function getWeekDates(offset: number) {
  const now = new Date()
  const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek + offset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

interface TaskModalProps {
  open: boolean
  onClose: () => void
  dayIndex: number
  editTask?: Task
}

function TaskModal({ open, onClose, dayIndex, editTask }: TaskModalProps) {
  const { addTask, editTask: updateTask, showToast } = usePlanner()
  const [text, setText] = useState(editTask?.text || '')
  const [time, setTime] = useState(editTask?.time || '')
  const [priority, setPriority] = useState<Task['priority']>(editTask?.priority || 'medium')
  const [day, setDay] = useState(editTask?.day ?? dayIndex)

  if (!open) return null

  const submit = () => {
    if (!text.trim()) return
    if (editTask) {
      updateTask(editTask.id, { text: text.trim(), time, priority, day })
      showToast('Tarefa atualizada!')
    } else {
      addTask({ text: text.trim(), time, day, priority })
      showToast('Tarefa adicionada!')
    }
    onClose()
  }

  return (
    <div className="p-modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="p-modal" role="dialog" aria-modal="true" aria-label={editTask ? 'Editar tarefa' : 'Nova tarefa'}>
        <div className="p-modal-title">
          <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--grad1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '.9rem' }}>◫</span>
          {editTask ? 'Editar Tarefa' : 'Nova Tarefa'}
        </div>

        <div className="p-form-group">
          <label className="p-form-label" htmlFor="task-text">Descricao</label>
          <input
            id="task-text"
            className="p-form-input"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="O que voce precisa fazer?"
            onKeyDown={e => !e.nativeEvent.isComposing && e.key === 'Enter' && submit()}
            autoFocus
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="p-form-group">
            <label className="p-form-label" htmlFor="task-time">Horario</label>
            <input id="task-time" type="time" className="p-form-input" value={time} onChange={e => setTime(e.target.value)} />
          </div>
          <div className="p-form-group">
            <label className="p-form-label" htmlFor="task-day">Dia</label>
            <select id="task-day" className="p-form-select" value={day} onChange={e => setDay(Number(e.target.value))}>
              {DAY_NAMES.map((n, i) => <option key={i} value={i}>{n}</option>)}
            </select>
          </div>
        </div>

        <div className="p-form-group">
          <label className="p-form-label">Prioridade</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['high','medium','low'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                style={{
                  flex: 1, padding: '8px', borderRadius: '10px', border: '1px solid var(--p-border)',
                  background: priority === p ? 'var(--grad1)' : 'var(--bg-secondary)',
                  color: priority === p ? '#000' : 'var(--text-sec)',
                  cursor: 'pointer', fontWeight: 700, fontSize: '.78rem',
                }}
              >
                {p === 'high' ? 'Alta' : p === 'medium' ? 'Media' : 'Baixa'}
              </button>
            ))}
          </div>
        </div>

        <div className="p-modal-actions">
          <button className="p-btn" onClick={onClose}>Cancelar</button>
          <button className="p-btn p-btn-primary" onClick={submit}>{editTask ? 'Salvar' : 'Adicionar'}</button>
        </div>
      </div>
    </div>
  )
}

export default function ViewPlanner() {
  const { tasks, weekOffset, changeWeek, toggleTask, deleteTask, clearCompleted, showToast } = usePlanner()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalDay, setModalDay] = useState(0)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  const [todayIdx, setTodayIdx] = useState(-1)
  const [todayDate, setTodayDate] = useState<Date | null>(null)

  useEffect(() => {
    const t = new Date()
    const d = t.getDay()
    setTodayIdx(d === 0 ? 6 : d - 1)
    setTodayDate(t)
  }, [])

  const dates = getWeekDates(weekOffset)

  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [showCompleted, setShowCompleted] = useState(true)

  const weekTasks = tasks.filter(t => t.weekOffset === weekOffset)
  const weekStart = dates[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  const weekEnd   = dates[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })

  const openAdd = (day: number) => { setModalDay(day); setEditingTask(undefined); setModalOpen(true) }
  const openEdit = (t: Task) => { setEditingTask(t); setModalOpen(true) }

  const PRIORITY_COLOR: Record<string, string> = { high: 'var(--p-accent5)', medium: 'var(--p-accent)', low: 'var(--p-accent3)' }

  const filterTask = (t: Task) => {
    if (!showCompleted && t.completed) return false
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
    return true
  }

  return (
    <div>
      <div className="p-hero">
        <div>
          <div className="p-kicker">Planejador Semanal</div>
          <h2 className="p-h-title">Semana {weekStart} — {weekEnd}</h2>
          <div className="p-h-sub">
            {weekTasks.filter(t => t.completed).length} de {weekTasks.length} tarefas concluidas esta semana.
          </div>
          <div className="p-hero-actions">
            <button className="p-btn" onClick={() => changeWeek(-1)}>← Anterior</button>
            <button className="p-btn p-btn-primary" onClick={() => openAdd(todayIdx)}>+ Nova Tarefa</button>
            <button className="p-btn" onClick={() => changeWeek(1)}>Proxima →</button>
            {weekTasks.some(t => t.completed) && (
              <button className="p-btn" onClick={() => { clearCompleted(); showToast('Concluidas removidas!') }}>
                Limpar concluidas
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '.68rem', color: 'var(--text-sec)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginRight: '2px' }}>Filtrar:</span>
            {(['all','high','medium','low'] as const).map(p => (
              <button key={p} onClick={() => setPriorityFilter(p)}
                style={{ padding: '4px 12px', borderRadius: '999px', border: `1px solid ${priorityFilter === p ? 'var(--p-accent)' : 'var(--p-border)'}`, background: priorityFilter === p ? 'var(--accent-trans)' : 'transparent', color: priorityFilter === p ? 'var(--p-accent)' : 'var(--text-sec)', fontSize: '.7rem', fontWeight: 700, cursor: 'pointer', transition: 'var(--p-transition)' }}>
                {p === 'all' ? 'Todas' : p === 'high' ? 'Alta' : p === 'medium' ? 'Media' : 'Baixa'}
              </button>
            ))}
            <button onClick={() => setShowCompleted(s => !s)}
              style={{ padding: '4px 12px', borderRadius: '999px', border: `1px solid ${!showCompleted ? 'var(--p-accent2)' : 'var(--p-border)'}`, background: !showCompleted ? 'var(--accent2-trans)' : 'transparent', color: !showCompleted ? 'var(--p-accent2)' : 'var(--text-sec)', fontSize: '.7rem', fontWeight: 700, cursor: 'pointer', transition: 'var(--p-transition)', marginLeft: 'auto' }}>
              {showCompleted ? 'Ocultar Concluidas' : 'Mostrar Concluidas'}
            </button>
          </div>
        </div>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '.65rem', color: 'var(--text-sec)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Progresso</div>
          <div style={{ fontFamily: 'monospace', fontSize: '2.4rem', fontWeight: 900, color: 'var(--p-accent)', lineHeight: 1 }}>
            {weekTasks.length > 0 ? Math.round((weekTasks.filter(t => t.completed).length / weekTasks.length) * 100) : 0}%
          </div>
        </div>
      </div>

      <div className="p-panel" style={{ marginTop: '13px', overflow: 'visible' }}>
        <div className="p-days-grid">
          {dates.map((date, i) => {
            const dayTasks = weekTasks.filter(t => t.day === i).filter(filterTask)
            const isToday = weekOffset === 0 && i === todayIdx
            const isPast = todayDate ? date < new Date(todayDate.toDateString()) && weekOffset <= 0 : false

            return (
              <div key={i} className={`p-day-col${isToday ? ' today' : ''}`}>
                <div className="p-day-header">
                  <div className="p-day-name">{DAY_SHORT[i]}</div>
                  <div className="p-day-date" style={{ color: isPast ? 'var(--text-mut)' : undefined }}>
                    {date.getDate()}
                  </div>
                  {dayTasks.length > 0 && (
                    <div style={{ fontSize: '.58rem', color: 'var(--text-sec)', marginTop: '1px' }}>
                      {dayTasks.filter(t => t.completed).length}/{dayTasks.length}
                    </div>
                  )}
                </div>
                <div className="p-tasks-box">
                  {dayTasks.map(t => (
                    <div key={t.id} className={`p-task${t.completed ? ' done' : ''}`}>
                      <div className="p-task-text">{t.text}</div>
                      {t.time && <div className="p-task-time">{t.time}</div>}
                      {t.priority && (
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: PRIORITY_COLOR[t.priority] || 'var(--p-accent)', marginTop: '3px' }} />
                      )}
                      <div className="p-task-actions">
                        <button className="p-task-btn check" onClick={() => { toggleTask(t.id); showToast(t.completed ? 'Tarefa reaberta' : 'Concluida!') }} title="Concluir" aria-label="Concluir tarefa">✓</button>
                        <button className="p-task-btn edit" onClick={() => openEdit(t)} title="Editar" aria-label="Editar tarefa">✎</button>
                        <button className="p-task-btn del" onClick={() => { deleteTask(t.id); showToast('Tarefa removida') }} title="Excluir" aria-label="Excluir tarefa">✕</button>
                      </div>
                    </div>
                  ))}
                  <button className="p-add-task-btn" onClick={() => openAdd(i)} aria-label={`Adicionar tarefa em ${DAY_NAMES[i]}`}>
                    + Adicionar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="p-ring-legend" style={{ marginTop: '10px' }}>
        <span style={{ fontSize: '.7rem', color: 'var(--text-sec)', marginRight: '4px' }}>Prioridade:</span>
        {[['Alta', 'var(--p-accent5)'], ['Media', 'var(--p-accent)'], ['Baixa', 'var(--p-accent3)']].map(([l, c]) => (
          <div key={l} className="p-legend-item">
            <div className="p-legend-dot" style={{ background: c }} />
            {l}
          </div>
        ))}
      </div>

      {modalOpen && (
        <TaskModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          dayIndex={modalDay}
          editTask={editingTask}
        />
      )}
    </div>
  )
}
