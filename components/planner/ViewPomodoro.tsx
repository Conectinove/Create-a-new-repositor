'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlanner } from '@/lib/planner-context'

type Mode = 'foco' | 'curto' | 'longo'

const MODES: { key: Mode; label: string; mins: number; color: string }[] = [
  { key: 'foco',  label: 'Foco Profundo', mins: 25, color: 'var(--p-accent)'  },
  { key: 'curto', label: 'Pausa Curta',   mins: 5,  color: 'var(--p-accent3)' },
  { key: 'longo', label: 'Pausa Longa',   mins: 15, color: 'var(--p-accent2)' },
]

const CUSTOM_OPTIONS = [15, 20, 25, 30, 45, 60]

export default function ViewPomodoro() {
  const { tasks, showToast } = usePlanner()

  const [mode, setMode] = useState<Mode>('foco')
  const [customMins, setCustomMins] = useState(25)
  const [useCustom, setUseCustom] = useState(false)
  const [secs, setSecs] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [sessionLog, setSessionLog] = useState<{ type: string; completedAt: string }[]>([])
  const [selectedTask, setSelectedTask] = useState<string>('')
  const [autoBreak, setAutoBreak] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getMins = useCallback(() => {
    if (useCustom) return customMins
    return MODES.find(m => m.key === mode)!.mins
  }, [mode, useCustom, customMins])

  const totalSecs = getMins() * 60

  const resetTimer = useCallback((m: Mode, custom?: boolean) => {
    setMode(m)
    if (custom !== undefined) setUseCustom(custom)
    const mins = custom ? customMins : MODES.find(x => x.key === m)!.mins
    setSecs(mins * 60)
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [customMins])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecs(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current!)
          setRunning(false)
          setSessions(p => p + 1)
          const label = MODES.find(m => m.key === mode)?.label || 'Sessao'
          setSessionLog(p => [...p, { type: label, completedAt: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) }])
          showToast(mode === 'foco' ? 'Sessao de foco concluida!' : 'Pausa finalizada!')
          if (autoBreak && mode === 'foco') {
            const nextMode = sessions > 0 && (sessions + 1) % 4 === 0 ? 'longo' : 'curto'
            setTimeout(() => {
              setMode(nextMode)
              setSecs(MODES.find(m => m.key === nextMode)!.mins * 60)
            }, 500)
          }
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [running, mode, showToast, autoBreak, sessions])

  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')
  const progress = ((totalSecs - secs) / totalSecs) * 100
  const circumference = 2 * Math.PI * 70
  const dash = circumference - (progress / 100) * circumference
  const currentMode = MODES.find(m => m.key === mode)!
  const focusSessions = sessionLog.filter(s => s.type === 'Foco Profundo').length
  const totalMinsFocused = focusSessions * 25

  const pendingTasks = tasks.filter(t => !t.completed)

  return (
    <div>
      <div className="p-hero">
        <div>
          <div className="p-kicker">Pomodoro Timer</div>
          <h2 className="p-h-title">Sessoes de Foco</h2>
          <div className="p-h-sub">Tecnica Pomodoro com pausas automaticas, log de sessoes e foco por tarefa.</div>
        </div>
        <div style={{ display: 'flex', gap: '18px', flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '.65rem', color: 'var(--text-sec)', textTransform: 'uppercase', marginBottom: '3px' }}>Sessoes</div>
            <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 900, color: 'var(--p-accent)' }}>{sessions}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '.65rem', color: 'var(--text-sec)', textTransform: 'uppercase', marginBottom: '3px' }}>Min. Foco</div>
            <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 900, color: 'var(--p-accent2)' }}>{totalMinsFocused}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '13px', marginTop: '13px' }}>
        {/* Timer panel */}
        <div style={{ display: 'grid', gap: '13px', alignContent: 'start' }}>
          <div className="p-panel">
            <div className="p-panel-header">
              <span className="p-panel-title">Timer</span>
              <span style={{ fontSize: '.72rem', color: currentMode.color, fontWeight: 700 }}>{currentMode.label}</span>
            </div>
            <div style={{ padding: '20px' }}>
              {/* Mode buttons */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
                {MODES.map(m => (
                  <button key={m.key} onClick={() => resetTimer(m.key, false)}
                    style={{ flex: 1, padding: '8px', borderRadius: '10px', border: `1px solid ${mode === m.key && !useCustom ? m.color : 'var(--p-border)'}`, background: mode === m.key && !useCustom ? `color-mix(in srgb,${m.color} 18%,transparent)` : 'var(--bg-secondary)', color: mode === m.key && !useCustom ? m.color : 'var(--text-sec)', cursor: 'pointer', fontWeight: 700, fontSize: '.7rem', transition: 'var(--p-transition)' }}>
                    {m.label}<br />
                    <span style={{ fontSize: '.65rem', fontFamily: 'monospace' }}>{m.mins}min</span>
                  </button>
                ))}
              </div>

              {/* Ring */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '180px', height: '180px', margin: '0 auto 16px' }}>
                <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
                  <circle cx="90" cy="90" r="70" fill="none" stroke="var(--bg-secondary)" strokeWidth="12" />
                  <circle
                    cx="90" cy="90" r="70" fill="none"
                    stroke={currentMode.color}
                    strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={`${dash}`}
                    transform="rotate(-90 90 90)"
                    style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 8px ${currentMode.color}88)` }}
                  />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '2.6rem', fontWeight: 900, color: 'var(--text-pri)', letterSpacing: '2px', lineHeight: 1 }}>{mm}:{ss}</div>
                  <div style={{ fontSize: '.65rem', color: 'var(--text-sec)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '4px' }}>{currentMode.label}</div>
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button className="p-btn p-btn-primary" onClick={() => setRunning(r => !r)} style={{ flex: 1, justifyContent: 'center', fontSize: '.9rem' }} aria-label={running ? 'Pausar' : 'Iniciar'}>
                  {running ? '⏸ Pausar' : '▶ Iniciar'}
                </button>
                <button className="p-btn" onClick={() => resetTimer(mode)} aria-label="Reiniciar" style={{ padding: '9px 14px' }}>↺</button>
              </div>

              {/* Custom duration */}
              <div style={{ borderTop: '1px solid var(--p-border)', paddingTop: '14px' }}>
                <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--text-sec)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Duracao personalizada</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {CUSTOM_OPTIONS.map(m => (
                    <button key={m} onClick={() => { setCustomMins(m); setUseCustom(true); setSecs(m * 60); setRunning(false) }}
                      style={{ padding: '5px 12px', borderRadius: '8px', border: `1px solid ${useCustom && customMins === m ? 'var(--p-accent)' : 'var(--p-border)'}`, background: useCustom && customMins === m ? 'var(--accent-trans)' : 'transparent', color: useCustom && customMins === m ? 'var(--p-accent)' : 'var(--text-sec)', fontSize: '.73rem', fontWeight: 700, cursor: 'pointer', transition: 'var(--p-transition)' }}>
                      {m}min
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto break toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', padding: '10px 12px', borderRadius: '10px', background: 'var(--bg-glass)', border: '1px solid var(--p-border)' }}>
                <div>
                  <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--text-pri)' }}>Pausa automatica</div>
                  <div style={{ fontSize: '.68rem', color: 'var(--text-sec)' }}>Mudar para pausa ao terminar foco</div>
                </div>
                <button className={`p-toggle${autoBreak ? ' on' : ''}`} onClick={() => setAutoBreak(b => !b)} role="switch" aria-checked={autoBreak} aria-label="Pausa automatica" />
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'grid', gap: '13px', alignContent: 'start' }}>
          {/* Task focus selector */}
          <div className="p-panel">
            <div className="p-panel-header">
              <span className="p-panel-title">Tarefa em Foco</span>
            </div>
            <div style={{ padding: '13px 16px' }}>
              {pendingTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-sec)', fontSize: '.82rem' }}>Nenhuma tarefa pendente</div>
              ) : (
                <div style={{ display: 'grid', gap: '7px' }}>
                  {pendingTasks.map(t => (
                    <button key={t.id} onClick={() => setSelectedTask(t.id === selectedTask ? '' : t.id)}
                      style={{ padding: '10px 13px', borderRadius: '10px', border: `1px solid ${selectedTask === t.id ? 'var(--p-accent)' : 'var(--p-border)'}`, background: selectedTask === t.id ? 'var(--accent-trans)' : 'var(--bg-glass)', color: 'var(--text-pri)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', transition: 'var(--p-transition)' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedTask === t.id ? 'var(--p-accent)' : 'var(--p-border)', flexShrink: 0, transition: 'var(--p-transition)' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '.82rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text}</div>
                        {t.time && <div style={{ fontSize: '.67rem', color: 'var(--text-sec)', marginTop: '1px' }}>{t.time}</div>}
                      </div>
                      {t.priority && <span style={{ fontSize: '.65rem', padding: '2px 8px', borderRadius: '999px', background: t.priority === 'high' ? 'var(--accent5-trans)' : t.priority === 'medium' ? 'var(--accent4-trans)' : 'var(--accent3-trans)', color: t.priority === 'high' ? 'var(--p-accent5)' : t.priority === 'medium' ? 'var(--p-accent4)' : 'var(--p-accent3)', fontWeight: 700 }}>{t.priority === 'high' ? 'Alta' : t.priority === 'medium' ? 'Media' : 'Baixa'}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Session log */}
          <div className="p-panel">
            <div className="p-panel-header">
              <span className="p-panel-title">Historico de Sessoes</span>
              <span style={{ fontSize: '.72rem', color: 'var(--text-sec)' }}>{sessionLog.length} sessoes</span>
            </div>
            <div style={{ padding: '13px 16px', maxHeight: '260px', overflowY: 'auto' }}>
              {sessionLog.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-sec)', fontSize: '.82rem' }}>Nenhuma sessao ainda</div>
              ) : (
                <div style={{ display: 'grid', gap: '6px' }}>
                  {[...sessionLog].reverse().map((s, i) => {
                    const modeData = MODES.find(m => m.label === s.type)
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '9px', background: 'var(--bg-glass)', border: '1px solid var(--p-border)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: modeData?.color || 'var(--p-accent)', flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: '.8rem', color: 'var(--text-pri)' }}>{s.type}</span>
                        <span style={{ fontSize: '.72rem', color: 'var(--text-sec)', fontFamily: 'monospace' }}>{s.completedAt}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Pomodoro stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {[
              { label: 'Total Sessoes', value: sessions, color: 'var(--p-accent)' },
              { label: 'Sessoes Foco', value: focusSessions, color: 'var(--p-accent2)' },
              { label: 'Minutos Foco', value: totalMinsFocused, color: 'var(--p-accent3)' },
            ].map(s => (
              <div key={s.label} className="p-panel" style={{ padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '.65rem', color: 'var(--text-sec)', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
