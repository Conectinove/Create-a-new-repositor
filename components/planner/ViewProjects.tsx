'use client'

import { useState } from 'react'
import { usePlanner, Project } from '@/lib/planner-context'

const STATUS_LABEL: Record<Project['status'], string> = {
  active: 'Activo',
  paused: 'Pausado',
  done: 'Concluido',
}

const STATUS_COLOR: Record<Project['status'], string> = {
  active: 'var(--p-accent3)',
  paused: 'var(--p-accent4)',
  done: 'var(--p-accent)',
}

export default function ViewProjects() {
  const { projects, addProject, updateProject, deleteProject, addProjectSubtask, toggleProjectSubtask, showToast } = usePlanner()

  const [form, setForm] = useState({ name: '', description: '', status: 'active' as Project['status'], deadline: '', color: '#7c3aed' })
  const [showForm, setShowForm] = useState(false)
  const [subtaskInputs, setSubtaskInputs] = useState<Record<string, string>>({})
  const [expanded, setExpanded] = useState<string | null>(null)

  const submit = () => {
    if (!form.name.trim()) return
    addProject({ name: form.name.trim(), description: form.description.trim(), status: form.status, progress: 0, deadline: form.deadline || undefined, color: form.color })
    setForm({ name: '', description: '', status: 'active', deadline: '', color: '#7c3aed' })
    setShowForm(false)
    showToast('Projecto criado!')
  }

  const submitSubtask = (projectId: string) => {
    const text = subtaskInputs[projectId]?.trim()
    if (!text) return
    addProjectSubtask(projectId, text)
    setSubtaskInputs(p => ({ ...p, [projectId]: '' }))
    showToast('Subtarefa adicionada!')
  }

  const active = projects.filter(p => p.status === 'active')
  const paused = projects.filter(p => p.status === 'paused')
  const done = projects.filter(p => p.status === 'done')

  const renderProject = (p: Project) => {
    const completedSubs = p.subtasks.filter(s => s.done).length
    const progressFromSubs = p.subtasks.length > 0 ? Math.round((completedSubs / p.subtasks.length) * 100) : p.progress
    const isExpanded = expanded === p.id

    return (
      <div key={p.id} className="p-panel" style={{ marginBottom: '10px' }}>
        <div
          style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
          onClick={() => setExpanded(isExpanded ? null : p.id)}
        >
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: p.color || 'var(--p-accent)', flexShrink: 0, boxShadow: `0 0 10px ${p.color || 'var(--p-accent)'}88` }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--text-pri)' }}>{p.name}</div>
            {p.description && <div style={{ fontSize: '.75rem', color: 'var(--text-sec)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <span style={{ fontSize: '.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', background: `color-mix(in srgb,${STATUS_COLOR[p.status]} 15%,transparent)`, color: STATUS_COLOR[p.status], border: `1px solid ${STATUS_COLOR[p.status]}44` }}>
              {STATUS_LABEL[p.status]}
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '.85rem', color: 'var(--p-accent)' }}>{progressFromSubs}%</span>
            <button onClick={e => { e.stopPropagation(); deleteProject(p.id); showToast('Projecto removido') }} className="p-note-del" aria-label="Remover projecto">✕</button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '3px', background: 'var(--bg-secondary)', marginInline: '18px' }}>
          <div style={{ height: '100%', width: `${progressFromSubs}%`, background: p.color || 'var(--p-accent)', borderRadius: '2px', transition: 'width 0.6s ease' }} />
        </div>

        {isExpanded && (
          <div style={{ padding: '14px 18px', borderTop: '1px solid var(--p-border)', marginTop: '3px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {(['active', 'paused', 'done'] as Project['status'][]).map(s => (
                <button key={s} onClick={() => { updateProject(p.id, { status: s }); showToast(`Estado: ${STATUS_LABEL[s]}`) }}
                  style={{ padding: '5px 14px', borderRadius: '999px', border: `1px solid ${p.status === s ? STATUS_COLOR[s] : 'var(--p-border)'}`, background: p.status === s ? `color-mix(in srgb,${STATUS_COLOR[s]} 18%,transparent)` : 'transparent', color: p.status === s ? STATUS_COLOR[s] : 'var(--text-sec)', fontSize: '.73rem', fontWeight: 700, cursor: 'pointer', transition: 'var(--p-transition)' }}>
                  {STATUS_LABEL[s]}
                </button>
              ))}
              {p.deadline && <span style={{ fontSize: '.73rem', color: 'var(--text-sec)', alignSelf: 'center', marginLeft: 'auto' }}>Prazo: {new Date(p.deadline + 'T00:00:00').toLocaleDateString('pt-PT')}</span>}
            </div>

            <div style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--text-sec)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Subtarefas ({completedSubs}/{p.subtasks.length})</div>
            <div style={{ display: 'grid', gap: '6px', marginBottom: '10px' }}>
              {p.subtasks.map(s => (
                <div key={s.id} onClick={() => toggleProjectSubtask(p.id, s.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '9px', border: '1px solid var(--p-border)', background: 'var(--bg-glass)', cursor: 'pointer', transition: 'var(--p-transition)' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${s.done ? 'var(--p-accent3)' : 'var(--p-border)'}`, background: s.done ? 'var(--p-accent3)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.65rem', color: '#000', flexShrink: 0, transition: 'var(--p-transition)' }}>{s.done ? '✓' : ''}</div>
                  <span style={{ fontSize: '.82rem', color: s.done ? 'var(--text-sec)' : 'var(--text-pri)', textDecoration: s.done ? 'line-through' : 'none' }}>{s.text}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input className="p-form-input" style={{ flex: 1, padding: '8px 12px', fontSize: '.82rem' }}
                value={subtaskInputs[p.id] || ''}
                onChange={e => setSubtaskInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                placeholder="Nova subtarefa..."
                onKeyDown={e => !e.nativeEvent.isComposing && e.key === 'Enter' && submitSubtask(p.id)} />
              <button className="p-btn p-btn-primary" onClick={() => submitSubtask(p.id)} style={{ padding: '8px 14px' }}>+</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="p-hero">
        <div>
          <div className="p-kicker">Gestao de Projectos</div>
          <h2 className="p-h-title">Projectos</h2>
          <div className="p-h-sub">Gerencie projectos com subtarefas, progresso e prazos.</div>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '.65rem', color: 'var(--text-sec)', textTransform: 'uppercase', marginBottom: '3px' }}>Activos</div>
            <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 900, color: 'var(--p-accent3)' }}>{active.length}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '.65rem', color: 'var(--text-sec)', textTransform: 'uppercase', marginBottom: '3px' }}>Total</div>
            <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 900, color: 'var(--p-accent)' }}>{projects.length}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
        <button className="p-btn p-btn-primary" onClick={() => setShowForm(f => !f)}>
          {showForm ? '✕ Cancelar' : '+ Novo Projecto'}
        </button>
      </div>

      {showForm && (
        <div className="p-panel" style={{ marginBottom: '14px', padding: '18px' }}>
          <div style={{ display: 'grid', gap: '10px' }}>
            <input className="p-form-input" placeholder="Nome do projecto..." value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <input className="p-form-input" placeholder="Descricao..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <select className="p-form-select" style={{ flex: 1 }} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Project['status'] }))}>
                <option value="active">Activo</option>
                <option value="paused">Pausado</option>
                <option value="done">Concluido</option>
              </select>
              <input type="date" className="p-form-input" style={{ flex: 1 }} value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
              <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ width: '44px', height: '44px', border: '1px solid var(--p-border)', borderRadius: '10px', background: 'transparent', cursor: 'pointer', padding: '2px' }} />
            </div>
            <button className="p-btn p-btn-primary" onClick={submit} style={{ justifyContent: 'center' }}>Criar Projecto</button>
          </div>
        </div>
      )}

      {active.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--p-accent3)', marginBottom: '10px' }}>Activos</div>
          {active.map(renderProject)}
        </div>
      )}

      {paused.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--p-accent4)', marginBottom: '10px' }}>Pausados</div>
          {paused.map(renderProject)}
        </div>
      )}

      {done.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--p-accent)', marginBottom: '10px' }}>Concluidos</div>
          {done.map(renderProject)}
        </div>
      )}

      {projects.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-sec)', fontSize: '.9rem' }}>
          Nenhum projecto ainda. Crie o primeiro!
        </div>
      )}
    </div>
  )
}
