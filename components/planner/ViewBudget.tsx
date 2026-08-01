'use client'

import { useState } from 'react'

interface BudgetItem {
  id: string
  category: string
  label: string
  amount: number
  type: 'income' | 'expense'
}

const DEFAULT_ITEMS: BudgetItem[] = [
  { id: 'b1', category: 'Renda', label: 'Salario principal', amount: 8500, type: 'income' },
  { id: 'b2', category: 'Renda', label: 'Freelas & projetos', amount: 2300, type: 'income' },
  { id: 'b3', category: 'Moradia', label: 'Aluguel', amount: 1800, type: 'expense' },
  { id: 'b4', category: 'Alimentacao', label: 'Supermercado', amount: 650, type: 'expense' },
  { id: 'b5', category: 'Transporte', label: 'Gasolina + app', amount: 420, type: 'expense' },
  { id: 'b6', category: 'Saude', label: 'Plano + academia', amount: 380, type: 'expense' },
  { id: 'b7', category: 'Educacao', label: 'Cursos online', amount: 250, type: 'expense' },
  { id: 'b8', category: 'Lazer', label: 'Streaming + saidas', amount: 310, type: 'expense' },
]

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function ViewBudget() {
  const [items, setItems] = useState<BudgetItem[]>(DEFAULT_ITEMS)
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Outros')
  const [type, setType] = useState<'income' | 'expense'>('expense')

  const income  = items.filter(i => i.type === 'income').reduce((a, i) => a + i.amount, 0)
  const expense = items.filter(i => i.type === 'expense').reduce((a, i) => a + i.amount, 0)
  const balance = income - expense
  const savingsPct = income > 0 ? Math.round((balance / income) * 100) : 0

  const addItem = () => {
    const amt = parseFloat(amount)
    if (!label.trim() || isNaN(amt) || amt <= 0) return
    setItems(p => [...p, { id: Math.random().toString(36).slice(2), category, label: label.trim(), amount: amt, type }])
    setLabel(''); setAmount('')
  }

  const del = (id: string) => setItems(p => p.filter(i => i.id !== id))

  // By category
  const expenseItems = items.filter(i => i.type === 'expense')
  const categories = Array.from(new Set(expenseItems.map(i => i.category)))
  const catTotals = categories.map(c => ({
    cat: c,
    total: expenseItems.filter(i => i.category === c).reduce((a, i) => a + i.amount, 0),
  })).sort((a, b) => b.total - a.total)

  return (
    <div>
      <div className="p-hero">
        <div>
          <div className="p-kicker">Financas e Orcamento</div>
          <h2 className="p-h-title">Controle Financeiro</h2>
          <div className="p-h-sub">Gerencie receitas, despesas e acompanhe sua saude financeira.</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flexShrink: 0 }}>
          {[
            { label: 'Receitas', val: fmt(income), color: 'var(--p-accent3)' },
            { label: 'Despesas', val: fmt(expense), color: 'var(--p-accent5)' },
            { label: 'Saldo', val: fmt(balance), color: balance >= 0 ? 'var(--p-accent3)' : 'var(--p-accent5)' },
          ].map(s => (
            <div key={s.label} className="p-kpi" style={{ minWidth: '140px' }}>
              <b style={{ color: s.color, fontSize: '1.05rem' }}>{s.val}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '13px', marginTop: '13px' }}>
        {/* Left: items + add */}
        <div style={{ display: 'grid', gap: '13px' }}>
          {/* Income */}
          <div className="p-panel">
            <div className="p-panel-header">
              <span className="p-panel-title" style={{ color: 'var(--p-accent3)' }}>Receitas</span>
              <span style={{ fontFamily: 'monospace', fontSize: '.85rem', fontWeight: 900, color: 'var(--p-accent3)' }}>{fmt(income)}</span>
            </div>
            <div style={{ padding: '13px' }}>
              {items.filter(i => i.type === 'income').map(item => (
                <div key={item.id} className="p-money-row">
                  <div>
                    <div style={{ fontSize: '.8rem', fontWeight: 700 }}>{item.label}</div>
                    <div style={{ fontSize: '.68rem', color: 'var(--text-sec)' }}>{item.category}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <b style={{ color: 'var(--p-accent3)', fontFamily: 'monospace' }}>{fmt(item.amount)}</b>
                    <button className="p-note-del" onClick={() => del(item.id)} aria-label="Remover item">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expenses */}
          <div className="p-panel">
            <div className="p-panel-header">
              <span className="p-panel-title" style={{ color: 'var(--p-accent5)' }}>Despesas</span>
              <span style={{ fontFamily: 'monospace', fontSize: '.85rem', fontWeight: 900, color: 'var(--p-accent5)' }}>{fmt(expense)}</span>
            </div>
            <div style={{ padding: '13px' }}>
              {items.filter(i => i.type === 'expense').map(item => (
                <div key={item.id} className="p-money-row">
                  <div>
                    <div style={{ fontSize: '.8rem', fontWeight: 700 }}>{item.label}</div>
                    <div style={{ fontSize: '.68rem', color: 'var(--text-sec)' }}>{item.category}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <b style={{ color: 'var(--p-accent5)', fontFamily: 'monospace' }}>{fmt(item.amount)}</b>
                    <button className="p-note-del" onClick={() => del(item.id)} aria-label="Remover item">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: add + summary */}
        <div style={{ display: 'grid', gap: '13px', alignContent: 'start' }}>
          {/* Add form */}
          <div className="p-panel">
            <div className="p-panel-header"><span className="p-panel-title">Adicionar Item</span></div>
            <div style={{ padding: '13px', display: 'grid', gap: '9px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['income','expense'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    style={{
                      flex: 1, padding: '7px', borderRadius: '9px', border: '1px solid var(--p-border)',
                      background: type === t ? (t === 'income' ? 'var(--p-accent3)' : 'var(--p-accent5)') : 'var(--bg-secondary)',
                      color: type === t ? '#000' : 'var(--text-sec)', cursor: 'pointer', fontWeight: 700, fontSize: '.75rem',
                    }}
                  >
                    {t === 'income' ? 'Receita' : 'Despesa'}
                  </button>
                ))}
              </div>
              <input className="p-form-input" value={label} onChange={e => setLabel(e.target.value)} placeholder="Descricao..." />
              <input className="p-form-input" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Valor (R$)..." min="0" step="0.01" />
              <input className="p-form-input" value={category} onChange={e => setCategory(e.target.value)} placeholder="Categoria..." />
              <button className="p-btn p-btn-primary" onClick={addItem} style={{ justifyContent: 'center' }}>Adicionar</button>
            </div>
          </div>

          {/* Savings */}
          <div className="p-panel">
            <div className="p-panel-header"><span className="p-panel-title">Poupanca</span></div>
            <div style={{ padding: '13px', textAlign: 'center' }}>
              <div className="p-donut-wrap">
                <div className="p-donut" style={{
                  background: `conic-gradient(${balance >= 0 ? 'var(--p-accent3)' : 'var(--p-accent5)'} 0% ${Math.abs(savingsPct)}%,var(--bg-secondary) ${Math.abs(savingsPct)}% 100%)`,
                  boxShadow: `0 0 36px color-mix(in srgb, ${balance >= 0 ? 'var(--p-accent3)' : 'var(--p-accent5)'} 24%,transparent)`
                }}>
                  <div className="p-donut-inner">
                    <b style={{ color: balance >= 0 ? 'var(--p-accent3)' : 'var(--p-accent5)' }}>{savingsPct}%</b>
                    <span>Guardado</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '.78rem', color: 'var(--text-sec)', marginTop: '8px' }}>
                {balance >= 0 ? `Voce economiza ${fmt(balance)} por mes` : `Deficit de ${fmt(Math.abs(balance))} por mes`}
              </div>
            </div>
          </div>

          {/* By category */}
          <div className="p-panel">
            <div className="p-panel-header"><span className="p-panel-title">Por Categoria</span></div>
            <div style={{ padding: '13px', display: 'grid', gap: '8px' }}>
              {catTotals.map(c => (
                <div key={c.cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.74rem', marginBottom: '3px' }}>
                    <span style={{ color: 'var(--text-sec)', fontWeight: 600 }}>{c.cat}</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--p-accent5)', fontWeight: 900 }}>{fmt(c.total)}</span>
                  </div>
                  <div className="p-meter">
                    <i style={{ '--w': `${expense > 0 ? Math.round((c.total / expense) * 100) : 0}%`, background: 'var(--p-accent5)' } as React.CSSProperties} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
