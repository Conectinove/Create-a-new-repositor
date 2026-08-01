'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlanner } from '@/lib/planner-context'

type Mode = 'foco' | 'curto' | 'longo'
const MODES: { key: Mode; label: string; mins: number }[] = [
  { key: 'foco',  label: 'Foco',         mins: 25 },
  { key: 'curto', label: 'Pausa Curta',   mins: 5  },
  { key: 'longo', label: 'Pausa Longa',   mins: 15 },
]

export default function ViewFocus() {
  const { notes, addNote, deleteNote, habits, toggleHabit, addHabit, deleteHabit, showToast } = usePlanner()

  // Timer
  const [mode, setMode] = useState<Mode>('foco')
  const [secs, setSecs] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalSecs = MODES.find(m => m.key === mode)!.mins * 60

  const resetTimer = useCallback((m: Mode) => {
    setMode(m)
    setSecs(MODES.find(x => x.key === m)!.mins * 60)
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecs(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current!)
          setRunning(false)
          setSessions(p => p + 1)
          showToast(mode === 'foco' ? 'Sessao de foco concluida!' : 'Pausa finalizada!')
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [running, mode, showToast])

  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')
  const progress = ((totalSecs - secs) / totalSecs) * 100
  const circumference = 2 * Math.PI * 58
  const dash = circumference - (progress / 100) * circumference

  // Notes
  const [noteText, setNoteText] = useState('')

  // Add habit modal
  const [habitName, setHabitName] = useState('')

  const submitNote = () => {
    if (!noteText.trim()) return
    addNote(noteText.trim())
    setNoteText('')
    showToast('Nota salva!')
  }

  const submitHabit = () => {
    if (!habitName.trim()) return
    addHabit(habitName.trim())
    setHabitName('')
    showToast('Habito adicionado!')
  }

  return (
    <div>
      <div className="p-hero">
        <div>
          <div className="p-kicker">Foco e Notas</div>
          <h2 className="p-h-title">Modo de Concentracao</h2>
          <div className="p-h-sub">Timer Pomodoro, habitos diarios e notas rapidas em um unico lugar.</div>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '.65rem', color: 'var(--text-sec)', textTransform: 'uppercase', marginBottom: '3px' }}>Sessoes</div>
            <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 900, color: 'var(--p-accent)' }}>{sessions}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '.65rem', color: 'var(--text-sec)', textTransform: 'uppercase', marginBottom: '3px' }}>Notas</div>
            <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 900, color: 'var(--p-accent2)' }}>{notes.length}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '13px', marginTop: '13px' }}>
        {/* Timer */}
        <div style={{ display: 'grid', gap: '13px' }}>
          <div className="p-panel">
            <div className="p-panel-header">
              <span className="p-panel-title">Timer Pomodoro</span>
              <span style={{ fontSize: '.72rem', color: 'var(--text-sec)' }}>{sessions} sessoes</span>
            </div>
            <div style={{ padding: '20px' }}>
              {/* Mode selector */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                {MODES.map(m => (
                  <button
                    key={m.key}
                    onClick={() => resetTimer(m.key)}
                    style={{
                      flex: 1, padding: '7px', borderRadius: '9px', border: '1px solid var(--p-border)',
                      background: mode === m.key ? 'var(--grad1)' : 'var(--bg-secondary)',
                      color: mode === m.key ? '#000' : 'var(--text-sec)',
                      cursor: 'pointer', fontWeight: 700, fontSize: '.7rem', transition: 'var(--p-transition)',
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Ring */}
              <div className="p-timer-ring">
                <svg width="150" height="150" viewBox="0 0 150 150" aria-hidden="true">
                  <circle cx="75" cy="75" r="58" fill="none" stroke="var(--bg-secondary)" strokeWidth="10" />
                  <circle
                    cx="75" cy="75" r="58" fill="none"
                    stroke="url(#timerGrad)" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={`${dash}`}
                    transform="rotate(-90 75 75)"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                  <defs>
                    <linearGradient id="timerGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="var(--p-accent)" />
                      <stop offset="100%" stopColor="var(--p-accent2)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div className="p-timer-display">{mm}:{ss}</div>
                  <div style={{ fontSize: '.67rem', color: 'var(--text-sec)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{MODES.find(m => m.key === mode)!.label}</div>
                </div>
              </div>

              {/* Controls */}
              <div className="p-timer-actions">
                <button
                  className="p-btn p-btn-primary"
                  onClick={() => setRunning(r => !r)}
                  style={{ minWidth: '100px', justifyContent: 'center' }}
                  aria-label={running ? 'Pausar timer' : 'Iniciar timer'}
                >
                  {running ? '⏸ Pausar' : '▶ Iniciar'}
                </button>
                <button
                  className="p-btn"
                  onClick={() => resetTimer(mode)}
                  aria-label="Reiniciar timer"
                >
                  ↺ Reiniciar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'grid', gap: '13px', alignContent: 'start' }}>
          {/* Habits */}
          <div className="p-panel">
            <div className="p-panel-header">
              <span className="p-panel-title">Habitos Diarios</span>
              <span style={{ fontSize: '.72rem', color: 'var(--text-sec)' }}>{habits.filter(h => h.done).length}/{habits.length}</span>
            </div>
            <div style={{ padding: '13px' }}>
              {habits.map(h => (
                <div key={h.id} className={`p-habit${h.done ? ' done' : ''}`} onClick={() => { toggleHabit(h.id); showToast(h.done ? 'Habito desmarcado' : 'Habito concluido!') }}>
                  <div
                    className={`p-habit-check${h.done ? ' done' : ''}`}
                    style={{ borderColor: h.color || 'var(--p-accent)' }}
                    aria-hidden="true"
                  >
                    {h.done ? '✓' : ''}
                  </div>
                  <span className="p-habit-name">{h.name}</span>
                  <span className="p-habit-streak">{h.streak}d</span>
                  <button
                    className="p-note-del"
                    onClick={e => { e.stopPropagation(); deleteHabit(h.id); showToast('Habito removido') }}
                    aria-label={`Remover habito ${h.name}`}
                    style={{ opacity: 0.6 }}
                  >✕</button>
                </div>
              ))}

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <input
                  className="p-form-input"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '.82rem' }}
                  value={habitName}
                  onChange={e => setHabitName(e.target.value)}
                  placeholder="Novo habito..."
                  onKeyDown={e => !e.nativeEvent.isComposing && e.key === 'Enter' && submitHabit()}
                />
                <button className="p-btn p-btn-primary" onClick={submitHabit} style={{ padding: '8px 14px' }}>+</button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="p-panel">
            <div className="p-panel-header">
              <span className="p-panel-title">Notas Rapidas</span>
              <span style={{ fontSize: '.72rem', color: 'var(--text-sec)' }}>{notes.length} notas</span>
            </div>
            <div style={{ padding: '13px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <textarea
                  className="p-note-input"
                  style={{ flex: 1, minHeight: '70px', resize: 'none' }}
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Escreva uma nota rapida..."
                  onKeyDown={e => !e.nativeEvent.isComposing && e.key === 'Enter' && e.ctrlKey && submitNote()}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button className="p-btn p-btn-primary" onClick={submitNote} style={{ flex: 1, justifyContent: 'center' }}>Salvar Nota</button>
                <span style={{ fontSize: '.67rem', color: 'var(--text-sec)', alignSelf: 'center' }}>Ctrl+Enter</span>
              </div>

              <div className="p-note-list">
                {notes.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-sec)', fontSize: '.8rem', padding: '10px 0' }}>Nenhuma nota ainda</div>
                ) : (
                  notes.slice().reverse().map(n => (
                    <div key={n.id} className="p-note-item">
                      <span>{n.text}</span>
                      <button
                        className="p-note-del"
                        onClick={() => { deleteNote(n.id); showToast('Nota removida') }}
                        aria-label="Remover nota"
                      >✕</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
