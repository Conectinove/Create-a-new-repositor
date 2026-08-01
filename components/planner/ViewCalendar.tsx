'use client'

import { useState, useEffect } from 'react'
import { usePlanner, CalendarEvent } from '@/lib/planner-context'

const MONTHS = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const DOW = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab']

const EVENT_TYPES: CalendarEvent['type'][] = ['work','deadline','content','money','personal','health','education','travel','social']
const EVENT_LABEL: Record<CalendarEvent['type'], string> = {
  work: 'Trabalho', deadline: 'Prazo', content: 'Conteudo', money: 'Financas', personal: 'Pessoal',
  health: 'Saude', education: 'Educacao', travel: 'Viagem', social: 'Social',
}
const EVENT_COLOR: Partial<Record<CalendarEvent['type'], string>> = {
  deadline: 'var(--p-accent5)', money: 'var(--p-accent3)', personal: 'var(--p-accent4)',
  content: 'var(--p-accent2)', health: '#22d3ee', education: '#a78bfa', travel: '#fb923c', social: '#f472b6',
}

function getMonthDays(year: number, month: number) {
  const first = new Date(year, month, 1)
  const last  = new Date(year, month + 1, 0)
  const cells: { date: Date; other: boolean }[] = []

  // pad start
  for (let i = 0; i < first.getDay(); i++) {
    const d = new Date(year, month, -first.getDay() + 1 + i)
    cells.push({ date: d, other: true })
  }
  for (let i = 1; i <= last.getDate(); i++) cells.push({ date: new Date(year, month, i), other: false })
  // pad end
  while (cells.length < 42) {
    const d = new Date(year, month + 1, cells.length - last.getDate() - first.getDay() + 1)
    cells.push({ date: d, other: true })
  }
  return cells
}

function getLocalDateStr(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function ViewCalendar() {
  const { calendarEvents, addCalendarEvent, deleteCalendarEvent, showToast } = usePlanner()
  const [todayStr, setTodayStr] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth())
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newType, setNewType] = useState<CalendarEvent['type']>('work')

  useEffect(() => {
    const today = new Date()
    const str = getLocalDateStr(today)
    setTodayStr(str)
    setNewDate(str)
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }, [])

  const cells = getMonthDays(year, month)

  const eventsInMonth = calendarEvents.filter(e => {
    const d = new Date(e.date)
    return d.getFullYear() === year && d.getMonth() === month
  })

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const addEvent = () => {
    if (!newTitle.trim() || !newDate) return
    addCalendarEvent({ title: newTitle.trim(), date: newDate, type: newType })
    setNewTitle('')
    showToast('Evento adicionado!')
  }

  const upcoming = [...calendarEvents]
    .filter(e => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6)

  return (
    <div>
      <div className="p-hero">
        <div>
          <div className="p-kicker">Calendario Mensal</div>
          <h2 className="p-h-title">{MONTHS[month]} {year}</h2>
          <div className="p-h-sub">{eventsInMonth.length} evento{eventsInMonth.length !== 1 ? 's' : ''} este mes.</div>
        </div>
        <div className="p-cal-stat-grid" style={{ flex: 'none', minWidth: '200px' }}>
          <div className="p-cal-stat"><b>{eventsInMonth.length}</b><span>Eventos</span></div>
          <div className="p-cal-stat"><b>{eventsInMonth.filter(e => e.type === 'deadline').length}</b><span>Prazos</span></div>
          <div className="p-cal-stat"><b>{upcoming.length}</b><span>Proximos</span></div>
          <div className="p-cal-stat"><b>{eventsInMonth.filter(e => e.type === 'work').length}</b><span>Trabalho</span></div>
        </div>
      </div>

      <div className="p-cal-shell">
        {/* Calendar grid */}
        <div className="p-panel" style={{ overflow: 'hidden' }}>
          <div className="p-month-toolbar">
            <div className="p-month-nav">
              <button className="p-btn p-btn-icon" onClick={prevMonth} aria-label="Mes anterior">‹</button>
              <button className="p-btn" onClick={() => { const t = new Date(); setMonth(t.getMonth()); setYear(t.getFullYear()) }} style={{ fontSize: '.75rem' }}>Hoje</button>
              <button className="p-btn p-btn-icon" onClick={nextMonth} aria-label="Proximo mes">›</button>
            </div>
            <div className="p-month-title">{MONTHS[month]} {year}</div>
          </div>

          <div className="p-month-grid">
            {DOW.map(d => <div key={d} className="p-month-dow">{d}</div>)}
            {cells.map((cell, idx) => {
              const dateStr = cell.date.toISOString().slice(0, 10)
              const dayEvents = calendarEvents.filter(e => e.date === dateStr)
              const isToday = dateStr === todayStr
              const hasEvent = dayEvents.length > 0

              return (
                <div
                  key={idx}
                  className={`p-month-day${cell.other ? ' other' : ''}${isToday ? ' today' : ''}${hasEvent ? ' has-event' : ''}`}
                  style={{ animationDelay: `${idx * 0.008}s` }}
                  role="gridcell"
                  aria-label={`${cell.date.toLocaleDateString('pt-BR')}${hasEvent ? `, ${dayEvents.length} evento(s)` : ''}`}
                >
                  <div className="p-month-num">
                    <span>{cell.date.getDate()}</span>
                    {dayEvents.length > 0 && <span>{dayEvents.length}</span>}
                  </div>
                  <div className="p-month-events">
                    {dayEvents.slice(0, 2).map(ev => (
                      <div
                        key={ev.id}
                        className={`p-month-event${ev.type === 'deadline' ? ' deadline' : ev.type === 'money' ? ' money' : ev.type === 'personal' ? ' personal' : ''}`}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div style={{ fontSize: '.58rem', color: 'var(--text-sec)' }}>+{dayEvents.length - 2} mais</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'grid', gap: '13px', alignContent: 'start' }}>
          {/* Add event */}
          <div className="p-panel">
            <div className="p-panel-header">
              <span className="p-panel-title">+ Novo Evento</span>
            </div>
            <div style={{ padding: '14px' }}>
              <div className="p-cal-form">
                <input
                  className="p-form-input"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Titulo do evento..."
                  onKeyDown={e => !e.nativeEvent.isComposing && e.key === 'Enter' && addEvent()}
                />
                <input
                  type="date"
                  className="p-form-input"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                />
                <select className="p-form-select" value={newType} onChange={e => setNewType(e.target.value as CalendarEvent['type'])}>
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{EVENT_LABEL[t]}</option>)}
                </select>
                <button className="p-btn p-btn-primary" onClick={addEvent} style={{ justifyContent: 'center' }}>Adicionar Evento</button>
              </div>
            </div>
          </div>

          {/* Upcoming */}
          <div className="p-panel">
            <div className="p-panel-header">
              <span className="p-panel-title">Proximos Eventos</span>
            </div>
            <div style={{ padding: '12px' }}>
              {upcoming.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-sec)', fontSize: '.8rem', padding: '12px 0' }}>Nenhum evento proximo</div>
              ) : (
                <div className="p-agenda-list">
                  {upcoming.map(ev => {
                    const d = new Date(ev.date + 'T00:00:00')
                    return (
                      <div key={ev.id} className="p-agenda-item">
                        <div className="p-agenda-date">
                          <div>{d.getDate()}</div>
                          <div>{MONTHS[d.getMonth()].slice(0, 3)}</div>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="p-agenda-title">{ev.title}</div>
                          <div className="p-agenda-sub">{EVENT_LABEL[ev.type]}</div>
                        </div>
                        <button
                          className="p-note-del"
                          onClick={() => { deleteCalendarEvent(ev.id); showToast('Evento removido') }}
                          aria-label="Remover evento"
                        >✕</button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="p-panel">
            <div className="p-panel-header"><span className="p-panel-title">Legenda</span></div>
            <div style={{ padding: '12px', display: 'grid', gap: '7px' }}>
              {EVENT_TYPES.map(t => (
                <div key={t} className="p-legend-item" style={{ padding: '6px 10px', background: 'var(--bg-glass)', borderRadius: '8px', border: '1px solid var(--p-border)' }}>
                  <div className="p-legend-dot" style={{ background: EVENT_COLOR[t] || 'var(--p-accent)' }} />
                  <span style={{ fontSize: '.78rem', color: 'var(--text-pri)' }}>{EVENT_LABEL[t]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
