'use client'

import { useState } from 'react'
import { usePlanner } from '@/lib/planner-context'

export default function ToastFab() {
  const { toastMsg, setView, setSettingsOpen, showToast } = usePlanner()
  const [fabOpen, setFabOpen] = useState(false)

  const FAB_ACTIONS = [
    { icon: '◫', label: 'Nova Tarefa',  action: () => { setView('planner'); setFabOpen(false); showToast('Abriu o Planejador') } },
    { icon: '◆', label: 'Nova Meta',    action: () => { setView('goals');   setFabOpen(false); showToast('Abriu Metas') } },
    { icon: '◷', label: 'Novo Evento',  action: () => { setView('calendar'); setFabOpen(false); showToast('Abriu Calendario') } },
    { icon: '⊛', label: 'Configuracoes', action: () => { setSettingsOpen(true); setFabOpen(false) } },
  ]

  return (
    <>
      {/* Toast */}
      <div
        className={`p-toast${toastMsg ? ' show' : ''}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {toastMsg}
      </div>

      {/* FAB Menu */}
      {fabOpen && (
        <div className="p-fab-menu open" role="menu">
          {FAB_ACTIONS.map((a, i) => (
            <div
              key={a.label}
              className="p-fab-option"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="p-fab-option-label">{a.label}</span>
              <button
                className="p-fab-option-btn"
                onClick={a.action}
                role="menuitem"
                aria-label={a.label}
              >
                {a.icon}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Overlay for fab menu */}
      {fabOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 149 }}
          onClick={() => setFabOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* FAB button */}
      <button
        className="p-fab"
        onClick={() => setFabOpen(o => !o)}
        aria-label={fabOpen ? 'Fechar menu rapido' : 'Abrir menu rapido'}
        aria-expanded={fabOpen}
        style={{ transform: fabOpen ? 'scale(1.1) rotate(45deg)' : undefined }}
      >
        +
      </button>
    </>
  )
}
