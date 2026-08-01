'use client'

import { useState } from 'react'

interface Resource {
  id: string
  title: string
  url: string
  description: string
  tag: string
  icon: string
}

const DEFAULT: Resource[] = [
  { id: 'r1', title: 'Notion',    url: 'https://notion.so',      description: 'Workspace colaborativo para docs e bases de dados.', tag: 'Produtividade', icon: '◫' },
  { id: 'r2', title: 'Figma',     url: 'https://figma.com',      description: 'Ferramenta de design colaborativo na nuvem.',           tag: 'Design',        icon: '◈' },
  { id: 'r3', title: 'GitHub',    url: 'https://github.com',     description: 'Repositorios, CI/CD e gerenciamento de codigo.',         tag: 'Dev',           icon: '◉' },
  { id: 'r4', title: 'Linear',    url: 'https://linear.app',     description: 'Gerenciamento de issues e sprints para times.',           tag: 'Gestao',        icon: '◆' },
  { id: 'r5', title: 'Calendly',  url: 'https://calendly.com',   description: 'Agendamento automatico de reunioes.',                    tag: 'Agenda',        icon: '◷' },
  { id: 'r6', title: 'Loom',      url: 'https://loom.com',       description: 'Gravacao e compartilhamento de videos asincronos.',      tag: 'Comunicacao',   icon: '◎' },
]

const TAGS = ['Todos','Produtividade','Design','Dev','Gestao','Agenda','Comunicacao','Outros']

export default function ViewResources() {
  const [resources, setResources] = useState<Resource[]>(DEFAULT)
  const [filter, setFilter] = useState('Todos')
  const [modalOpen, setModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [desc, setDesc] = useState('')
  const [tag, setTag] = useState('Outros')

  const filtered = filter === 'Todos' ? resources : resources.filter(r => r.tag === filter)

  const add = () => {
    if (!title.trim() || !url.trim()) return
    setResources(p => [...p, { id: Math.random().toString(36).slice(2), title: title.trim(), url, description: desc, tag, icon: '◧' }])
    setTitle(''); setUrl(''); setDesc(''); setTag('Outros')
    setModalOpen(false)
  }

  const del = (id: string) => setResources(p => p.filter(r => r.id !== id))

  return (
    <div>
      <div className="p-hero">
        <div>
          <div className="p-kicker">Central de Recursos</div>
          <h2 className="p-h-title">Seus Recursos</h2>
          <div className="p-h-sub">{resources.length} links e ferramentas organizados por categoria.</div>
          <div className="p-hero-actions">
            <button className="p-btn p-btn-primary" onClick={() => setModalOpen(true)}>+ Novo Recurso</button>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="p-pill-row" style={{ margin: '13px 0' }}>
        {TAGS.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              padding: '6px 14px', borderRadius: '999px', border: '1px solid var(--p-border)',
              background: filter === t ? 'var(--grad1)' : 'var(--bg-glass)',
              color: filter === t ? '#000' : 'var(--text-sec)',
              cursor: 'pointer', fontWeight: 700, fontSize: '.75rem', transition: 'var(--p-transition)',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-resources">
        {filtered.length === 0 ? (
          <div className="p-res-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px' }}>
            <div style={{ color: 'var(--text-sec)', fontSize: '.9rem' }}>Nenhum recurso nesta categoria.</div>
          </div>
        ) : (
          filtered.map((r, i) => (
            <div key={r.id} className="p-res-card" style={{ animationDelay: `${i * 0.06}s` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '11px', background: 'var(--grad1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '1.1rem',
                    flexShrink: 0,
                  }}>
                    {r.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '.9rem', color: 'var(--text-pri)' }}>{r.title}</div>
                    <span className="p-res-tag">{r.tag}</span>
                  </div>
                </div>
                <button className="p-note-del" onClick={() => del(r.id)} aria-label={`Remover ${r.title}`}>✕</button>
              </div>

              <p style={{ fontSize: '.78rem', color: 'var(--text-sec)', lineHeight: 1.5, marginBottom: '12px' }}>{r.description}</p>

              <div className="p-link-row" style={{ paddingTop: '8px' }}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-btn p-btn-primary"
                  style={{ fontSize: '.76rem', padding: '7px 12px', textDecoration: 'none' }}
                >
                  Abrir recurso →
                </a>
                <span style={{ fontSize: '.66rem', color: 'var(--text-mut)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                  {r.url.replace(/^https?:\/\//, '')}
                </span>
              </div>
            </div>
          ))
        )}

        {/* Add placeholder */}
        <button
          className="p-res-card"
          onClick={() => setModalOpen(true)}
          style={{ cursor: 'pointer', border: '2px dashed var(--p-border)', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', minHeight: '160px' }}
          aria-label="Adicionar novo recurso"
        >
          <div style={{ fontSize: '2rem', opacity: 0.4 }}>+</div>
          <div style={{ fontSize: '.82rem', color: 'var(--text-sec)' }}>Novo Recurso</div>
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="p-modal-overlay open" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="p-modal" role="dialog" aria-modal="true" aria-label="Novo recurso">
            <div className="p-modal-title">
              <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--grad1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>◑</span>
              Novo Recurso
            </div>
            <div className="p-form-group">
              <label className="p-form-label" htmlFor="res-title">Nome</label>
              <input id="res-title" className="p-form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Notion" autoFocus />
            </div>
            <div className="p-form-group">
              <label className="p-form-label" htmlFor="res-url">URL</label>
              <input id="res-url" className="p-form-input" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="p-form-group">
              <label className="p-form-label" htmlFor="res-desc">Descricao</label>
              <input id="res-desc" className="p-form-input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Para que serve?" />
            </div>
            <div className="p-form-group">
              <label className="p-form-label" htmlFor="res-tag">Categoria</label>
              <select id="res-tag" className="p-form-select" value={tag} onChange={e => setTag(e.target.value)}>
                {TAGS.filter(t => t !== 'Todos').map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="p-modal-actions">
              <button className="p-btn" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button className="p-btn p-btn-primary" onClick={add}>Adicionar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
