'use client'

import { useState } from 'react'
import { usePlanner } from '@/lib/planner-context'

const ICONS = ['◧','◨','◩','◪','◫','◬','◭','◮','◯','◰','◱','◲','◳','◴','◵','◶','◷','◸','◹','◺','◻','◼']

export default function ViewSections() {
  const { customSections, addCustomSection, deleteCustomSection, showToast } = usePlanner()
  const [modalOpen, setModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [icon, setIcon] = useState(ICONS[0])
  const [tag, setTag] = useState('Custom')

  const submit = () => {
    if (!title.trim()) return
    addCustomSection({ title: title.trim(), description: desc, icon, tag })
    setTitle(''); setDesc(''); setIcon(ICONS[0]); setTag('Custom')
    setModalOpen(false)
    showToast('Secao adicionada!')
  }

  return (
    <div>
      <div className="p-hero">
        <div>
          <div className="p-kicker">Secoes Personalizadas</div>
          <h2 className="p-h-title">Expanda o Planner</h2>
          <div className="p-h-sub">Crie suas proprias secoes, workflows e paineis personalizados.</div>
          <div className="p-hero-actions">
            <button className="p-btn p-btn-primary" onClick={() => setModalOpen(true)}>+ Nova Secao</button>
          </div>
        </div>
      </div>

      <div className="p-custom-list">
        {customSections.length === 0 && (
          <div className="p-custom-block" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', border: '2px dashed var(--p-border)', background: 'transparent' }}>
            <div style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '12px' }}>◧</div>
            <div style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--text-sec)', fontSize: '.95rem' }}>Nenhuma secao ainda</div>
            <div style={{ color: 'var(--text-mut)', fontSize: '.8rem', marginBottom: '16px' }}>
              Adicione secoes customizadas para expandir seu planner com novos modulos.
            </div>
            <button className="p-btn p-btn-primary" onClick={() => setModalOpen(true)}>Criar primeira secao</button>
          </div>
        )}

        {customSections.map((s, i) => (
          <div key={s.id} className="p-custom-block" style={{ animationDelay: `${i * 0.08}s`, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '13px', background: 'var(--grad1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: '#000',
              }}>{s.icon}</div>
              <button className="p-note-del" onClick={() => { deleteCustomSection(s.id); showToast('Secao removida') }} aria-label={`Remover ${s.title}`}>✕</button>
            </div>
            <h3>{s.title}</h3>
            <p>{s.description || 'Secao personalizada.'}</p>
            <span className="p-custom-tag">{s.tag}</span>
          </div>
        ))}

        {/* Template suggestions */}
        {[
          { icon: '◫', title: 'CRM Pessoal', desc: 'Gerencie contatos, followups e pipeline de networking.' },
          { icon: '◈', title: 'Diario de Aprendizado', desc: 'Registre o que voce aprendeu todos os dias.' },
          { icon: '◉', title: 'Rastreador de Saude', desc: 'Acompanhe peso, sono, agua e energia diaria.' },
          { icon: '◆', title: 'Board de Projetos', desc: 'Kanban pessoal para projetos em andamento.' },
        ].map((t, i) => (
          <button
            key={t.title}
            className="p-custom-block"
            onClick={() => { addCustomSection({ title: t.title, description: t.desc, icon: t.icon, tag: 'Template' }); showToast(`${t.title} adicionado!`) }}
            style={{ cursor: 'pointer', border: '1px dashed var(--p-border)', background: 'transparent', textAlign: 'left', animationDelay: `${(customSections.length + i) * 0.06}s` }}
            aria-label={`Adicionar template ${t.title}`}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '8px', opacity: 0.5 }}>{t.icon}</div>
            <h3 style={{ opacity: 0.7 }}>{t.title}</h3>
            <p style={{ fontSize: '.76rem' }}>{t.desc}</p>
            <span className="p-custom-tag" style={{ opacity: 0.6 }}>+ Usar template</span>
          </button>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="p-modal-overlay open" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="p-modal" role="dialog" aria-modal="true" aria-label="Nova secao">
            <div className="p-modal-title">
              <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--grad1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>◧</span>
              Nova Secao
            </div>
            <div className="p-form-group">
              <label className="p-form-label" htmlFor="sec-title">Nome da Secao</label>
              <input id="sec-title" className="p-form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: CRM Pessoal" autoFocus />
            </div>
            <div className="p-form-group">
              <label className="p-form-label" htmlFor="sec-desc">Descricao</label>
              <textarea id="sec-desc" className="p-form-textarea" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Para que serve esta secao?" />
            </div>
            <div className="p-form-group">
              <label className="p-form-label" htmlFor="sec-tag">Tag</label>
              <input id="sec-tag" className="p-form-input" value={tag} onChange={e => setTag(e.target.value)} placeholder="Ex: Negocios, Saude..." />
            </div>
            <div className="p-form-group">
              <label className="p-form-label">Icone</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {ICONS.map(ic => (
                  <button
                    key={ic}
                    onClick={() => setIcon(ic)}
                    style={{
                      width: '34px', height: '34px', borderRadius: '8px', border: '1px solid var(--p-border)',
                      background: icon === ic ? 'var(--grad1)' : 'var(--bg-secondary)',
                      color: icon === ic ? '#000' : 'var(--text-sec)',
                      cursor: 'pointer', fontSize: '1rem',
                    }}
                    aria-label={`Icone ${ic}`}
                    aria-pressed={icon === ic}
                  >{ic}</button>
                ))}
              </div>
            </div>
            <div className="p-modal-actions">
              <button className="p-btn" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button className="p-btn p-btn-primary" onClick={submit}>Criar Secao</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
