'use client'

import { useState } from 'react'
import { usePlanner, HabitRecord } from '@/lib/planner-context'

const CATEGORIES: { key: HabitRecord['category']; label: string; color: string }[] = [
  { key: 'saude', label: 'Saude', color: '#22c55e' },
  { key: 'trabalho', label: 'Trabalho', color: '#7c3aed' },
  { key: 'pessoal', label: 'Pessoal', color: '#ff6b8b' },
  { key: 'aprendizado', label: 'Aprendizado', color: '#f59e0b' },
]

const FREQ_LABEL: Record<HabitRecord['frequency'], string> = {
  diario: 'Diario',
  semanal: 'Semanal',
}

// Generate last 7 days
function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().slice(0, 10)
  })
}

const DOW_SHORT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

export default function ViewHabits() {
  const { habitRecords, toggleHabitRecord, addHabitRecord, deleteHabitRecord, showToast } = usePlanner()

  const [filterCat, setFilterCat] = useState<HabitRecord['category'] | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'saude' as HabitRecord['category'], frequency: 'diario' as HabitRecord['frequency'], color: '#22c55e' })

  const days7 = getLast7Days()
  const filtered = filterCat === 'all' ? habitRecords : habitRecords.filter(h => h.category === filterCat)
  const totalDone = habitRecords.filter(h => h.done).length
  const maxStreak = habitRecords.reduce((max, h) => Math.max(max, h.streak), 0)

  const submit = () => {
    if (!form.name.trim()) return
    addHabitRecord({ name: form.name.trim(), category: form.category, frequency: form.frequency, color: form.color })
    setForm({ name: '', category: 'saude', frequency: 'diario', color: '#22c55e' })
    setShowForm(false)
    showToast('Habito adicionado!')
  }

  return (
    <div>
      <div className="p-hero">
        <div>
          <div className="p-kicker">Rastreador de Habitos</div>
          <h2 className="p-h-title">Habitos</h2>
          <div className="p-h-sub">Construa consistencia com rastreamento diario e visualizacao de streaks.</div>
        </div>
        <div style={{ display: 'flex', gap: '18px', flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '.65rem', color: 'var(--text-sec)', textTransform: 'uppercase', marginBottom: '3px' }}>Hoje</div>
            <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 900, color: 'var(--p-accent3)' }}>{totalDone}/{habitRecords.length}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '.65rem', color: 'var(--text-sec)', textTransform: 'uppercase', marginBottom: '3px' }}>Maior Streak</div>
            <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 900, color: 'var(--p-accent4)' }}>{maxStreak}d</div>
          </div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="p-panel" style={{ marginBottom: '13px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--text-pri)' }}>Progresso de hoje</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '.9rem', color: 'var(--p-accent)' }}>{habitRecords.length > 0 ? Math.round((totalDone / habitRecords.length) * 100) : 0}%</span>
        </div>
        <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${habitRecords.length > 0 ? (totalDone / habitRecords.length) * 100 : 0}%`, background: 'var(--grad3)', borderRadius: '999px', transition: 'width 0.6s ease' }} />
        </div>
      </div>

      {/* Filters + add button */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '13px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setFilterCat('all')} style={{ padding: '6px 16px', borderRadius: '999px', border: `1px solid ${filterCat === 'all' ? 'var(--p-accent)' : 'var(--p-border)'}`, background: filterCat === 'all' ? 'var(--accent-trans)' : 'transparent', color: filterCat === 'all' ? 'var(--p-accent)' : 'var(--text-sec)', fontSize: '.75rem', fontWeight: 700, cursor: 'pointer', transition: 'var(--p-transition)' }}>Todos</button>
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setFilterCat(c.key)}
            style={{ padding: '6px 16px', borderRadius: '999px', border: `1px solid ${filterCat === c.key ? c.color : 'var(--p-border)'}`, background: filterCat === c.key ? `color-mix(in srgb,${c.color} 15%,transparent)` : 'transparent', color: filterCat === c.key ? c.color : 'var(--text-sec)', fontSize: '.75rem', fontWeight: 700, cursor: 'pointer', transition: 'var(--p-transition)' }}>
            {c.label}
          </button>
        ))}
        <button className="p-btn p-btn-primary" onClick={() => setShowForm(f => !f)} style={{ marginLeft: 'auto' }}>
          {showForm ? '✕ Cancelar' : '+ Novo Habito'}
        </button>
      </div>

      {showForm && (
        <div className="p-panel" style={{ marginBottom: '13px', padding: '16px 18px' }}>
          <div style={{ display: 'grid', gap: '10px' }}>
            <input className="p-form-input" placeholder="Nome do habito..." value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => !e.nativeEvent.isComposing && e.key === 'Enter' && submit()} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <select className="p-form-select" style={{ flex: 1 }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as HabitRecord['category'] }))}>
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
              <select className="p-form-select" style={{ flex: 1 }} value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value as HabitRecord['frequency'] }))}>
                <option value="diario">Diario</option>
                <option value="semanal">Semanal</option>
              </select>
              <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ width: '44px', height: '44px', border: '1px solid var(--p-border)', borderRadius: '10px', background: 'transparent', cursor: 'pointer', padding: '2px' }} />
            </div>
            <button className="p-btn p-btn-primary" onClick={submit} style={{ justifyContent: 'center' }}>Adicionar Habito</button>
          </div>
        </div>
      )}

      {/* Habits table */}
      <div className="p-panel">
        <div className="p-panel-header">
          <span className="p-panel-title">Rastreador — Ultimos 7 dias</span>
          <span style={{ fontSize: '.72rem', color: 'var(--text-sec)' }}>{filtered.length} habitos</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--p-border)' }}>
                <th style={{ padding: '10px 18px', textAlign: 'left', fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-sec)', width: '40%' }}>Habito</th>
                {days7.map(d => {
                  const dayNum = new Date(d + 'T00:00:00').getDay()
                  const date = new Date(d + 'T00:00:00').getDate()
                  return (
                    <th key={d} style={{ padding: '10px 6px', textAlign: 'center', fontSize: '.68rem', color: 'var(--text-sec)', fontWeight: 700, minWidth: '36px' }}>
                      <div>{DOW_SHORT[dayNum]}</div>
                      <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '.75rem', color: 'var(--text-pri)' }}>{date}</div>
                    </th>
                  )
                })}
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-sec)' }}>Streak</th>
                <th style={{ padding: '10px 12px', width: '36px' }} />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-sec)', fontSize: '.85rem' }}>Nenhum habito nesta categoria</td>
                </tr>
              )}
              {filtered.map(h => {
                const catColor = CATEGORIES.find(c => c.key === h.category)?.color || h.color || 'var(--p-accent)'
                return (
                  <tr key={h.id} style={{ borderBottom: '1px solid var(--p-border)' }}>
                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: catColor, flexShrink: 0, boxShadow: `0 0 8px ${catColor}88` }} />
                        <div>
                          <div style={{ fontSize: '.83rem', fontWeight: 600, color: 'var(--text-pri)' }}>{h.name}</div>
                          <div style={{ fontSize: '.65rem', color: 'var(--text-sec)', marginTop: '1px' }}>{CATEGORIES.find(c => c.key === h.category)?.label} · {FREQ_LABEL[h.frequency]}</div>
                        </div>
                      </div>
                    </td>
                    {days7.map((d, idx) => {
                      const isToday = idx === 6
                      const isDone = isToday ? h.done : h.history.includes(d)
                      return (
                        <td key={d} style={{ textAlign: 'center', padding: '8px 6px' }}>
                          <button
                            onClick={isToday ? () => { toggleHabitRecord(h.id); showToast(h.done ? 'Desmarcado' : 'Habito concluido!') } : undefined}
                            style={{
                              width: '26px', height: '26px', borderRadius: '8px', border: `1.5px solid ${isDone ? catColor : 'var(--p-border)'}`,
                              background: isDone ? `color-mix(in srgb,${catColor} 22%,transparent)` : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: isToday ? 'pointer' : 'default',
                              transition: 'var(--p-transition)',
                              margin: '0 auto',
                            }}
                            aria-label={isToday ? (h.done ? 'Desmarcar habito' : 'Marcar habito') : ''}
                          >
                            {isDone && <span style={{ fontSize: '.62rem', color: catColor, fontWeight: 900 }}>✓</span>}
                          </button>
                        </td>
                      )
                    })}
                    <td style={{ textAlign: 'center', padding: '8px 12px' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '.85rem', color: catColor }}>{h.streak}d</span>
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <button className="p-note-del" onClick={() => { deleteHabitRecord(h.id); showToast('Habito removido') }} aria-label="Remover habito" style={{ opacity: 0.6 }}>✕</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '13px', marginTop: '13px' }}>
        {CATEGORIES.map(c => {
          const catHabits = habitRecords.filter(h => h.category === c.key)
          const doneCat = catHabits.filter(h => h.done).length
          return (
            <div key={c.key} className="p-panel" style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: '.68rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: c.color, fontWeight: 800, marginBottom: '6px' }}>{c.label}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-pri)', lineHeight: 1 }}>{doneCat}/{catHabits.length}</div>
              <div style={{ fontSize: '.72rem', color: 'var(--text-sec)', marginTop: '4px' }}>concluidos hoje</div>
              <div style={{ height: '4px', background: 'var(--bg-secondary)', borderRadius: '999px', marginTop: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${catHabits.length > 0 ? (doneCat / catHabits.length) * 100 : 0}%`, background: c.color, borderRadius: '999px', transition: 'width 0.6s ease' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
