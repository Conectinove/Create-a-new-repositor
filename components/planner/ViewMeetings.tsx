'use client'

import { useState } from 'react'
import { usePlanner } from '@/lib/planner-context'

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export default function ViewMeetings() {
  const { meetings, addMeeting, deleteMeeting, addMeetingAction, toggleMeetingAction, showToast } = usePlanner()

  const [form, setForm] = useState({ title: '', date: new Date().toISOString().slice(0, 10), participants: '', notes: '' })
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<string | null>(meetings[0]?.id || null)
  const [actionInput, setActionInput] = useState('')

  const submit = () => {
    if (!form.title.trim()) return
    addMeeting({ title: form.title.trim(), date: form.date, participants: form.participants.trim(), notes: form.notes.trim() })
    setForm({ title: '', date: new Date().toISOString().slice(0, 10), participants: '', notes: '' })
    setShowForm(false)
    showToast('Reuniao registada!')
  }

  const submitAction = () => {
    if (!selected || !actionInput.trim()) return
    addMeetingAction(selected, actionInput.trim())
    setActionInput('')
    showToast('Accao adicionada!')
  }

  const selectedMeeting = meetings.find(m => m.id === selected)
  const totalActions = meetings.reduce((acc, m) => acc + m.actions.length, 0)
  const pendingActions = meetings.reduce((acc, m) => acc + m.actions.filter(a => !a.done).length, 0)

  return (
    <div>
      <div className="p-hero">
        <div>
          <div className="p-kicker">Reunioes e Actas</div>
          <h2 className="p-h-title">Reunioes</h2>
          <div className="p-h-sub">Registe reunioes, notas e accoes pendentes num unico lugar.</div>
        </div>
        <div style={{ display: 'flex', gap: '18px', flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '.65rem', color: 'var(--text-sec)', textTransform: 'uppercase', marginBottom: '3px' }}>Reunioes</div>
            <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 900, color: 'var(--p-accent)' }}>{meetings.length}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '.65rem', color: 'var(--text-sec)', textTransform: 'uppercase', marginBottom: '3px' }}>Pendentes</div>
            <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 900, color: 'var(--p-accent5)' }}>{pendingActions}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '.65rem', color: 'var(--text-sec)', textTransform: 'uppercase', marginBottom: '3px' }}>Accoes</div>
            <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 900, color: 'var(--p-accent2)' }}>{totalActions}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
        <button className="p-btn p-btn-primary" onClick={() => setShowForm(f => !f)}>
          {showForm ? '✕ Cancelar' : '+ Nova Reuniao'}
        </button>
      </div>

      {showForm && (
        <div className="p-panel" style={{ marginBottom: '14px', padding: '18px' }}>
          <div style={{ display: 'grid', gap: '10px' }}>
            <input className="p-form-input" placeholder="Titulo da reuniao..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="date" className="p-form-input" style={{ flex: 1 }} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              <input className="p-form-input" style={{ flex: 2 }} placeholder="Participantes (ex: Ana, Pedro)..." value={form.participants} onChange={e => setForm(f => ({ ...f, participants: e.target.value }))} />
            </div>
            <textarea className="p-note-input" placeholder="Notas da reuniao..." rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ resize: 'none' }} />
            <button className="p-btn p-btn-primary" onClick={submit} style={{ justifyContent: 'center' }}>Registar Reuniao</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '13px' }}>
        {/* Meeting list */}
        <div className="p-panel" style={{ overflow: 'hidden' }}>
          <div className="p-panel-header">
            <span className="p-panel-title">Historico</span>
          </div>
          <div style={{ padding: '8px', display: 'grid', gap: '4px', maxHeight: '600px', overflowY: 'auto' }}>
            {meetings.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-sec)', fontSize: '.8rem' }}>Nenhuma reuniao</div>
            )}
            {[...meetings].reverse().map(m => {
              const d = new Date(m.date + 'T00:00:00')
              const pending = m.actions.filter(a => !a.done).length
              return (
                <button
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  style={{
                    padding: '10px 12px', borderRadius: '11px', border: `1px solid ${selected === m.id ? 'var(--p-accent)' : 'transparent'}`,
                    background: selected === m.id ? 'var(--accent-trans)' : 'transparent',
                    color: 'var(--text-pri)', cursor: 'pointer', textAlign: 'left', transition: 'var(--p-transition)',
                    display: 'flex', alignItems: 'center', gap: '10px',
                  }}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg-glass)', border: '1px solid var(--p-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '.85rem', color: 'var(--p-accent)', lineHeight: 1 }}>{d.getDate()}</div>
                    <div style={{ fontSize: '.55rem', color: 'var(--text-sec)', textTransform: 'uppercase' }}>{MONTHS[d.getMonth()]}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                    <div style={{ fontSize: '.68rem', color: 'var(--text-sec)', marginTop: '2px' }}>{m.participants || 'Sem participantes'}</div>
                  </div>
                  {pending > 0 && (
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--p-accent5)', color: '#fff', fontSize: '.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{pending}</div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Meeting detail */}
        <div>
          {selectedMeeting ? (
            <div style={{ display: 'grid', gap: '13px' }}>
              <div className="p-panel">
                <div className="p-panel-header" style={{ justifyContent: 'space-between' }}>
                  <span className="p-panel-title">{selectedMeeting.title}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '.72rem', color: 'var(--text-sec)' }}>
                      {new Date(selectedMeeting.date + 'T00:00:00').toLocaleDateString('pt-PT')}
                    </span>
                    <button className="p-note-del" onClick={() => { deleteMeeting(selectedMeeting.id); setSelected(null); showToast('Reuniao removida') }} aria-label="Remover reuniao">✕</button>
                  </div>
                </div>
                <div style={{ padding: '16px 18px' }}>
                  {selectedMeeting.participants && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-sec)', marginBottom: '6px' }}>Participantes</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {selectedMeeting.participants.split(',').map((p, i) => (
                          <span key={i} style={{ padding: '4px 12px', borderRadius: '999px', background: 'var(--accent-trans)', color: 'var(--p-accent)', border: '1px solid var(--p-accent)44', fontSize: '.75rem', fontWeight: 600 }}>{p.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedMeeting.notes && (
                    <div>
                      <div style={{ fontSize: '.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-sec)', marginBottom: '6px' }}>Notas</div>
                      <div style={{ fontSize: '.84rem', color: 'var(--text-pri)', lineHeight: 1.6, background: 'var(--bg-glass)', border: '1px solid var(--p-border)', borderRadius: '10px', padding: '12px 14px' }}>{selectedMeeting.notes}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-panel">
                <div className="p-panel-header">
                  <span className="p-panel-title">Accoes e Compromissos</span>
                  <span style={{ fontSize: '.72rem', color: 'var(--text-sec)' }}>{selectedMeeting.actions.filter(a => !a.done).length} pendentes</span>
                </div>
                <div style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'grid', gap: '7px', marginBottom: '12px' }}>
                    {selectedMeeting.actions.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-sec)', fontSize: '.8rem' }}>Nenhuma accao ainda</div>
                    )}
                    {selectedMeeting.actions.map(a => (
                      <div key={a.id} onClick={() => toggleMeetingAction(selectedMeeting.id, a.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--p-border)', background: 'var(--bg-glass)', cursor: 'pointer', transition: 'var(--p-transition)' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${a.done ? 'var(--p-accent3)' : 'var(--p-border)'}`, background: a.done ? 'var(--p-accent3)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6rem', color: '#000', flexShrink: 0, transition: 'var(--p-transition)' }}>{a.done ? '✓' : ''}</div>
                        <span style={{ fontSize: '.83rem', color: a.done ? 'var(--text-sec)' : 'var(--text-pri)', textDecoration: a.done ? 'line-through' : 'none', flex: 1 }}>{a.text}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input className="p-form-input" style={{ flex: 1, padding: '8px 12px', fontSize: '.82rem' }} value={actionInput} onChange={e => setActionInput(e.target.value)} placeholder="Nova accao/compromisso..." onKeyDown={e => !e.nativeEvent.isComposing && e.key === 'Enter' && submitAction()} />
                    <button className="p-btn p-btn-primary" onClick={submitAction} style={{ padding: '8px 14px' }}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-sec)', fontSize: '.9rem' }}>
              Seleccione uma reuniao para ver detalhes
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
