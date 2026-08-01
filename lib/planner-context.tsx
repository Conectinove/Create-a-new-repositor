'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

export type Theme = 'default' | 'midnight' | 'rose' | 'emerald' | 'pearl' | 'ocean' | 'sunset' | 'nordic' | 'amber'
export type View = 'dashboard' | 'planner' | 'calendar' | 'analytics' | 'review' | 'focus' | 'goals' | 'budget' | 'resources' | 'sections' | 'projects' | 'meetings' | 'habits' | 'report' | 'pomodoro'

export interface Task {
  id: string
  text: string
  time?: string
  day: number // 0=Mon … 6=Sun
  weekOffset: number
  completed: boolean
  color?: string
  priority?: 'high' | 'medium' | 'low'
}

export interface Habit {
  id: string
  name: string
  streak: number
  done: boolean
  color?: string
}

export interface Goal {
  id: string
  title: string
  description: string
  progress: number
  deadline?: string
  color?: string
}

export interface Note {
  id: string
  text: string
  createdAt: string
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'work' | 'deadline' | 'content' | 'money' | 'personal' | 'health' | 'education' | 'travel' | 'social'
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'done'
  progress: number
  deadline?: string
  color?: string
  subtasks: { id: string; text: string; done: boolean }[]
}

export interface Meeting {
  id: string
  title: string
  date: string
  participants: string
  notes: string
  actions: { id: string; text: string; done: boolean }[]
}

export interface HabitRecord {
  id: string
  name: string
  streak: number
  done: boolean
  color?: string
  category: 'saude' | 'trabalho' | 'pessoal' | 'aprendizado'
  frequency: 'diario' | 'semanal'
  history: string[] // dates completed
}

export interface CustomSection {
  id: string
  title: string
  description: string
  icon: string
  tag: string
}

interface PlannerState {
  theme: Theme
  view: View
  weekOffset: number
  tasks: Task[]
  habits: Habit[]
  habitRecords: HabitRecord[]
  goals: Goal[]
  notes: Note[]
  calendarEvents: CalendarEvent[]
  customSections: CustomSection[]
  projects: Project[]
  meetings: Meeting[]
  sidebarOpen: boolean
  settingsOpen: boolean
  focusMinutes: number
  toastMsg: string | null
  // actions
  setTheme: (t: Theme) => void
  setView: (v: View) => void
  changeWeek: (d: number) => void
  addTask: (t: Omit<Task, 'id' | 'weekOffset' | 'completed'>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  editTask: (id: string, updates: Partial<Task>) => void
  clearCompleted: () => void
  toggleHabit: (id: string) => void
  addHabit: (name: string) => void
  deleteHabit: (id: string) => void
  toggleHabitRecord: (id: string) => void
  addHabitRecord: (h: Omit<HabitRecord, 'id' | 'streak' | 'done' | 'history'>) => void
  deleteHabitRecord: (id: string) => void
  addGoal: (g: Omit<Goal, 'id'>) => void
  deleteGoal: (id: string) => void
  addNote: (text: string) => void
  deleteNote: (id: string) => void
  addCalendarEvent: (e: Omit<CalendarEvent, 'id'>) => void
  deleteCalendarEvent: (id: string) => void
  addCustomSection: (s: Omit<CustomSection, 'id'>) => void
  deleteCustomSection: (id: string) => void
  addProject: (p: Omit<Project, 'id' | 'subtasks'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  addProjectSubtask: (projectId: string, text: string) => void
  toggleProjectSubtask: (projectId: string, subtaskId: string) => void
  addMeeting: (m: Omit<Meeting, 'id' | 'actions'>) => void
  deleteMeeting: (id: string) => void
  addMeetingAction: (meetingId: string, text: string) => void
  toggleMeetingAction: (meetingId: string, actionId: string) => void
  setSidebarOpen: (o: boolean) => void
  setSettingsOpen: (o: boolean) => void
  setFocusMinutes: (m: number) => void
  showToast: (msg: string) => void
}

const defaultHabits: Habit[] = [
  { id: 'h1', name: 'Hidratação diária', streak: 21, done: true, color: '#22c55e' },
  { id: 'h2', name: 'Treino físico', streak: 14, done: false, color: '#7c3aed' },
  { id: 'h3', name: 'Leitura — 20 min', streak: 7, done: true, color: '#ff6b8b' },
  { id: 'h4', name: 'Meditação', streak: 5, done: false, color: '#f59e0b' },
  { id: 'h5', name: 'Planejamento noturno', streak: 12, done: true, color: '#06b6d4' },
]

const defaultGoals: Goal[] = [
  { id: 'g1', title: 'Planejamento de Lançamento', description: 'Estruturar imagens, guias de uso, links e indexação SEO.', progress: 78, deadline: '2026-08-02', color: '#7c3aed' },
  { id: 'g2', title: 'Desenvolvimento Profissional', description: 'Finalizar módulos, revisar conceitos, organizar documentação.', progress: 55, deadline: '2026-08-15', color: '#ff6b8b' },
  { id: 'g3', title: 'Saúde & Rotina', description: 'Treinos, alimentação balanceada, sono reparador.', progress: 64, deadline: '2026-07-31', color: '#22c55e' },
]

const defaultCalendarEvents: CalendarEvent[] = [
  { id: 'e1', title: 'Reunião de apresentação', date: new Date().toISOString().slice(0, 10), type: 'work' },
  { id: 'e2', title: 'Prazo: V2 do app', date: new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10), type: 'deadline' },
  { id: 'e3', title: 'Post de conteúdo', date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10), type: 'content' },
  { id: 'e4', title: 'Consulta médica', date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10), type: 'health' },
  { id: 'e5', title: 'Workshop de design', date: new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10), type: 'education' },
  { id: 'e6', title: 'Jantar de equipa', date: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10), type: 'social' },
]

const defaultProjects: Project[] = [
  {
    id: 'p1', name: 'Refina App', description: 'Desenvolvimento da plataforma de produtividade.', status: 'active',
    progress: 68, deadline: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10), color: '#7c3aed',
    subtasks: [
      { id: 'ps1', text: 'Definir arquitectura de dados', done: true },
      { id: 'ps2', text: 'Criar UI das novas vistas', done: false },
      { id: 'ps3', text: 'Integrar autenticação', done: false },
    ]
  },
  {
    id: 'p2', name: 'Campanha de Marketing', description: 'Lançamento Q3 com conteúdo e ads.', status: 'active',
    progress: 42, deadline: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10), color: '#ff6b8b',
    subtasks: [
      { id: 'ps4', text: 'Criar criativos para redes sociais', done: true },
      { id: 'ps5', text: 'Configurar campanhas de anúncios', done: false },
    ]
  },
  {
    id: 'p3', name: 'Documentação Técnica', description: 'PDF e guias de utilizador completos.', status: 'paused',
    progress: 20, color: '#22c55e',
    subtasks: [
      { id: 'ps6', text: 'Rascunho inicial', done: true },
      { id: 'ps7', text: 'Revisão e formatação', done: false },
      { id: 'ps8', text: 'Exportar PDF final', done: false },
    ]
  },
]

const defaultMeetings: Meeting[] = [
  {
    id: 'm1', title: 'Kickoff do Projecto Refina', date: new Date().toISOString().slice(0, 10),
    participants: 'Ana, Pedro, Marta', notes: 'Definir MVP, prazos e responsabilidades da equipa para o lançamento.',
    actions: [
      { id: 'ma1', text: 'Pedro cria o repositório no GitHub', done: true },
      { id: 'ma2', text: 'Ana prepara wireframes iniciais', done: false },
    ]
  },
  {
    id: 'm2', title: 'Revisão de Marketing Q3', date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
    participants: 'Marta, João', notes: 'Avaliar resultados da campanha anterior e definir estratégia para Q3.',
    actions: [
      { id: 'ma3', text: 'João prepara relatório de métricas', done: false },
      { id: 'ma4', text: 'Marta valida orçamento com direcção', done: false },
    ]
  },
]

const defaultHabitRecords: HabitRecord[] = [
  { id: 'hr1', name: 'Hidratação — 2L/dia', streak: 21, done: true, color: '#22c55e', category: 'saude', frequency: 'diario', history: [] },
  { id: 'hr2', name: 'Treino físico', streak: 14, done: false, color: '#7c3aed', category: 'saude', frequency: 'diario', history: [] },
  { id: 'hr3', name: 'Leitura — 30 min', streak: 7, done: true, color: '#ff6b8b', category: 'aprendizado', frequency: 'diario', history: [] },
  { id: 'hr4', name: 'Meditação', streak: 5, done: false, color: '#f59e0b', category: 'pessoal', frequency: 'diario', history: [] },
  { id: 'hr5', name: 'Planejamento noturno', streak: 12, done: true, color: '#06b6d4', category: 'trabalho', frequency: 'diario', history: [] },
  { id: 'hr6', name: 'Sem redes sociais pela manhã', streak: 3, done: false, color: '#ef4444', category: 'pessoal', frequency: 'diario', history: [] },
  { id: 'hr7', name: 'Revisão semanal', streak: 4, done: false, color: '#8b5cf6', category: 'trabalho', frequency: 'semanal', history: [] },
]

const defaultTasks: Task[] = [
  { id: 't1', text: 'Finalizar design e layout premium', time: '09:00', day: 0, weekOffset: 0, completed: false, priority: 'high' },
  { id: 't2', text: 'Preparar demonstração oficial', time: '14:00', day: 1, weekOffset: 0, completed: true, priority: 'high' },
  { id: 't3', text: 'Revisar listagens e criativos SEO', time: '16:00', day: 2, weekOffset: 0, completed: false, priority: 'medium' },
  { id: 't4', text: 'Auditoria de palavras-chave', time: '10:00', day: 3, weekOffset: 0, completed: false, priority: 'medium' },
  { id: 't5', text: 'Redigir documentação PDF', time: '11:30', day: 4, weekOffset: 0, completed: true, priority: 'low' },
]

const CTX = createContext<PlannerState | null>(null)

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('default')
  const [view, setViewState] = useState<View>('dashboard')
  const [weekOffset, setWeekOffset] = useState(0)
  const [tasks, setTasks] = useState<Task[]>(defaultTasks)
  const [habits, setHabits] = useState<Habit[]>(defaultHabits)
  const [habitRecords, setHabitRecords] = useState<HabitRecord[]>(defaultHabitRecords)
  const [goals, setGoals] = useState<Goal[]>(defaultGoals)
  const [notes, setNotes] = useState<Note[]>([])
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(defaultCalendarEvents)
  const [customSections, setCustomSections] = useState<CustomSection[]>([])
  const [projects, setProjects] = useState<Project[]>(defaultProjects)
  const [meetings, setMeetings] = useState<Meeting[]>(defaultMeetings)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [focusMinutes, setFocusMinutes] = useState(25)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  const setView = useCallback((v: View) => setViewState(v), [])

  const changeWeek = useCallback((d: number) => setWeekOffset(p => p + d), [])

  const uid = () => Math.random().toString(36).slice(2)

  const addTask = useCallback((t: Omit<Task, 'id' | 'weekOffset' | 'completed'>) =>
    setTasks(p => [...p, { ...t, id: uid(), weekOffset, completed: false }]), [weekOffset])

  const toggleTask = useCallback((id: string) =>
    setTasks(p => p.map(t => t.id === id ? { ...t, completed: !t.completed } : t)), [])

  const deleteTask = useCallback((id: string) =>
    setTasks(p => p.filter(t => t.id !== id)), [])

  const editTask = useCallback((id: string, updates: Partial<Task>) =>
    setTasks(p => p.map(t => t.id === id ? { ...t, ...updates } : t)), [])

  const clearCompleted = useCallback(() =>
    setTasks(p => p.filter(t => !t.completed)), [])

  const toggleHabit = useCallback((id: string) =>
    setHabits(p => p.map(h => h.id === id ? { ...h, done: !h.done, streak: h.done ? h.streak : h.streak + 1 } : h)), [])

  const addHabit = useCallback((name: string) =>
    setHabits(p => [...p, { id: uid(), name, streak: 0, done: false }]), [])

  const deleteHabit = useCallback((id: string) =>
    setHabits(p => p.filter(h => h.id !== id)), [])

  const addGoal = useCallback((g: Omit<Goal, 'id'>) =>
    setGoals(p => [...p, { ...g, id: uid() }]), [])

  const deleteGoal = useCallback((id: string) =>
    setGoals(p => p.filter(g => g.id !== id)), [])

  const addNote = useCallback((text: string) =>
    setNotes(p => [...p, { id: uid(), text, createdAt: new Date().toISOString() }]), [])

  const deleteNote = useCallback((id: string) =>
    setNotes(p => p.filter(n => n.id !== id)), [])

  const addCalendarEvent = useCallback((e: Omit<CalendarEvent, 'id'>) =>
    setCalendarEvents(p => [...p, { ...e, id: uid() }]), [])

  const deleteCalendarEvent = useCallback((id: string) =>
    setCalendarEvents(p => p.filter(e => e.id !== id)), [])

  const addCustomSection = useCallback((s: Omit<CustomSection, 'id'>) =>
    setCustomSections(p => [...p, { ...s, id: uid() }]), [])

  const deleteCustomSection = useCallback((id: string) =>
    setCustomSections(p => p.filter(s => s.id !== id)), [])

  const toggleHabitRecord = useCallback((id: string) =>
    setHabitRecords(p => p.map(h => h.id === id ? { ...h, done: !h.done, streak: h.done ? Math.max(0, h.streak - 1) : h.streak + 1 } : h)), [])

  const addHabitRecord = useCallback((h: Omit<HabitRecord, 'id' | 'streak' | 'done' | 'history'>) =>
    setHabitRecords(p => [...p, { ...h, id: uid(), streak: 0, done: false, history: [] }]), [])

  const deleteHabitRecord = useCallback((id: string) =>
    setHabitRecords(p => p.filter(h => h.id !== id)), [])

  const addProject = useCallback((p: Omit<Project, 'id' | 'subtasks'>) =>
    setProjects(prev => [...prev, { ...p, id: uid(), subtasks: [] }]), [])

  const updateProject = useCallback((id: string, updates: Partial<Project>) =>
    setProjects(p => p.map(pr => pr.id === id ? { ...pr, ...updates } : pr)), [])

  const deleteProject = useCallback((id: string) =>
    setProjects(p => p.filter(pr => pr.id !== id)), [])

  const addProjectSubtask = useCallback((projectId: string, text: string) =>
    setProjects(p => p.map(pr => pr.id === projectId ? { ...pr, subtasks: [...pr.subtasks, { id: uid(), text, done: false }] } : pr)), [])

  const toggleProjectSubtask = useCallback((projectId: string, subtaskId: string) =>
    setProjects(p => p.map(pr => pr.id === projectId ? {
      ...pr,
      subtasks: pr.subtasks.map(s => s.id === subtaskId ? { ...s, done: !s.done } : s)
    } : pr)), [])

  const addMeeting = useCallback((m: Omit<Meeting, 'id' | 'actions'>) =>
    setMeetings(prev => [...prev, { ...m, id: uid(), actions: [] }]), [])

  const deleteMeeting = useCallback((id: string) =>
    setMeetings(p => p.filter(m => m.id !== id)), [])

  const addMeetingAction = useCallback((meetingId: string, text: string) =>
    setMeetings(p => p.map(m => m.id === meetingId ? { ...m, actions: [...m.actions, { id: uid(), text, done: false }] } : m)), [])

  const toggleMeetingAction = useCallback((meetingId: string, actionId: string) =>
    setMeetings(p => p.map(m => m.id === meetingId ? {
      ...m,
      actions: m.actions.map(a => a.id === actionId ? { ...a, done: !a.done } : a)
    } : m)), [])

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2800)
  }, [])

  return (
    <CTX.Provider value={{
      theme, view, weekOffset, tasks, habits, habitRecords, goals, notes, calendarEvents, customSections, projects, meetings,
      sidebarOpen, settingsOpen, focusMinutes, toastMsg,
      setTheme, setView, changeWeek, addTask, toggleTask, deleteTask, editTask, clearCompleted,
      toggleHabit, addHabit, deleteHabit, toggleHabitRecord, addHabitRecord, deleteHabitRecord,
      addGoal, deleteGoal, addNote, deleteNote,
      addCalendarEvent, deleteCalendarEvent, addCustomSection, deleteCustomSection,
      addProject, updateProject, deleteProject, addProjectSubtask, toggleProjectSubtask,
      addMeeting, deleteMeeting, addMeetingAction, toggleMeetingAction,
      setSidebarOpen, setSettingsOpen, setFocusMinutes, showToast,
    }}>
      {children}
    </CTX.Provider>
  )
}

export function usePlanner() {
  const ctx = useContext(CTX)
  if (!ctx) throw new Error('usePlanner must be used inside PlannerProvider')
  return ctx
}
