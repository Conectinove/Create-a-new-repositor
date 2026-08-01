'use client'

import { useState } from 'react'
import { usePlanner, Theme } from '@/lib/planner-context'

const THEMES: { key: Theme; label: string; color: string; bg: string }[] = [
  { key: 'default',  label: 'Cosmos',   color: 'linear-gradient(135deg,#7c3aed,#ff6b8b)', bg: '#080b16' },
  { key: 'midnight', label: 'Midnight', color: 'linear-gradient(135deg,#3b82f6,#06b6d4)', bg: '#020617' },
  { key: 'rose',     label: 'Rose',     color: 'linear-gradient(135deg,#ff6b8b,#ec4899)', bg: '#18060a' },
  { key: 'emerald',  label: 'Emerald',  color: 'linear-gradient(135deg,#10b981,#34d399)', bg: '#022c22' },
  { key: 'pearl',    label: 'Pearl',    color: 'linear-gradient(135deg,#94a3b8,#e2e8f0)', bg: '#f8fafc' },
  { key: 'ocean',    label: 'Ocean',    color: 'linear-gradient(135deg,#38bdf8,#818cf8)', bg: '#030b1a' },
  { key: 'sunset',   label: 'Sunset',   color: 'linear-gradient(135deg,#f97316,#eab308)', bg: '#140800' },
  { key: 'nordic',   label: 'Nordic',   color: 'linear-gradient(135deg,#64748b,#94a3b8)', bg: '#0d1117' },
  { key: 'amber',    label: 'Amber',    color: 'linear-gradient(135deg,#d97706,#f59e0b)', bg: '#120a00' },
]

export default function SettingsPanel() {
  const { settingsOpen, setSettingsOpen, theme, setTheme, setView, showToast } = usePlanner()
  const [sound, setSound] = useState(false)
  const [animations, setAnimations] = useState(true)
  const [compact, setCompact] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [pomodoroSound, setPomodoroSound] = useState(true)

  if (!settingsOpen) return null

  return (
    <div
      className="p-settings-overlay open"
      onClick={e => e.target === e.currentTarget && setSettingsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Configuracoes"
    >
      <div className="p-settings-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <div className="p-settings-title">Configuracoes</div>
          <button
            className="p-btn p-btn-icon"
            onClick={() => setSettingsOpen(false)}
            aria-label="Fechar configuracoes"
            style={{ border: '1px solid var(--p-border)' }}
          >✕</button>
        </div>

        {/* Themes */}
        <div className="p-settings-section-title">Tema Visual</div>
        <div className="p-theme-grid" style={{ marginBottom: '20px' }}>
          {THEMES.map(t => (
            <button
              key={t.key}
              className={`p-theme-btn${theme === t.key ? ' active' : ''}`}
              style={{ background: t.bg, height: '52px' }}
              onClick={() => { setTheme(t.key); showToast(`Tema: ${t.label}`) }}
              title={t.label}
              aria-label={`Tema ${t.label}`}
              aria-pressed={theme === t.key}
            >
              <div style={{ position: 'absolute', inset: '6px', borderRadius: '7px', background: t.color }} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Appearance */}
        <div className="p-settings-section-title">Aparencia</div>

        <div className="p-settings-row">
          <div>
            <div className="p-settings-row-label">Animacoes</div>
            <div style={{ fontSize: '.72rem', color: 'var(--text-sec)' }}>Ativar animacoes e transicoes</div>
          </div>
          <button
            className={`p-toggle${animations ? ' on' : ''}`}
            onClick={() => setAnimations(a => !a)}
            role="switch"
            aria-checked={animations}
            aria-label="Ativar animacoes"
          />
        </div>

        <div className="p-settings-row">
          <div>
            <div className="p-settings-row-label">Modo Compacto</div>
            <div style={{ fontSize: '.72rem', color: 'var(--text-sec)' }}>Reduzir espacamento da interface</div>
          </div>
          <button
            className={`p-toggle${compact ? ' on' : ''}`}
            onClick={() => setCompact(c => !c)}
            role="switch"
            aria-checked={compact}
            aria-label="Modo compacto"
          />
        </div>

        <div className="p-settings-row">
          <div>
            <div className="p-settings-row-label">Sons</div>
            <div style={{ fontSize: '.72rem', color: 'var(--text-sec)' }}>Sons ao concluir tarefas</div>
          </div>
          <button
            className={`p-toggle${sound ? ' on' : ''}`}
            onClick={() => setSound(s => !s)}
            role="switch"
            aria-checked={sound}
            aria-label="Ativar sons"
          />
        </div>

        <div className="p-settings-row">
          <div>
            <div className="p-settings-row-label">Notificacoes</div>
            <div style={{ fontSize: '.72rem', color: 'var(--text-sec)' }}>Alertas de prazos e eventos</div>
          </div>
          <button
            className={`p-toggle${notifications ? ' on' : ''}`}
            onClick={() => setNotifications(n => !n)}
            role="switch"
            aria-checked={notifications}
            aria-label="Ativar notificacoes"
          />
        </div>

        <div className="p-settings-row">
          <div>
            <div className="p-settings-row-label">Som do Pomodoro</div>
            <div style={{ fontSize: '.72rem', color: 'var(--text-sec)' }}>Som ao terminar sessao de foco</div>
          </div>
          <button
            className={`p-toggle${pomodoroSound ? ' on' : ''}`}
            onClick={() => setPomodoroSound(p => !p)}
            role="switch"
            aria-checked={pomodoroSound}
            aria-label="Som do Pomodoro"
          />
        </div>

        {/* Quick navigation */}
        <div className="p-settings-section-title" style={{ marginTop: '20px' }}>Acesso Rapido</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          {[
            { view: 'pomodoro' as const, label: 'Pomodoro' },
            { view: 'habits' as const, label: 'Habitos' },
            { view: 'projects' as const, label: 'Projectos' },
            { view: 'meetings' as const, label: 'Reunioes' },
            { view: 'report' as const, label: 'Relatorio' },
            { view: 'goals' as const, label: 'Metas' },
          ].map(item => (
            <button key={item.view} className="p-btn"
              style={{ justifyContent: 'center', fontSize: '.77rem', padding: '8px 12px' }}
              onClick={() => { setView(item.view); setSettingsOpen(false) }}>
              {item.label}
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="p-settings-section-title" style={{ marginTop: '4px' }}>Sobre</div>
        <div style={{ fontSize: '.79rem', color: 'var(--text-sec)', lineHeight: 1.6, padding: '10px 0' }}>
          <b style={{ color: 'var(--p-accent)' }}>Planner 360</b> — Sistema completo de produtividade.<br />
          Versao 2.0 — Construido com Next.js 16 + Tailwind CSS.<br />
          Dados salvos localmente na sessao atual.
        </div>

        <button
          className="p-btn p-btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
          onClick={() => setSettingsOpen(false)}
        >
          Fechar Configuracoes
        </button>
      </div>
    </div>
  )
}
