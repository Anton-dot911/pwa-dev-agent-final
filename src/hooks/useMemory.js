import { useState, useCallback } from 'react'

const MEMORY_KEY = 'pwa_agent_memory_v1'

export const DEFAULT_MEMORY = {
  name: 'Antlab',
  experience: 'senior',
  language: 'uk',
  stack: ['React', 'Vite', 'Firebase', 'Netlify', 'Claude API'],
  packageManager: 'npm',
  cssApproach: 'CSS Modules',
  uiStyle: 'neumorphic',
  baseColor: '#BECAE1',
  shadowDepth: 'deep',
  fontScale: 'large',
  borderRadius: '12px',
  darkMode: false,
  projects: [
    { id: 'worklog-pwa', name: 'WorkLog PWA', stack: ['React', 'localStorage'], description: 'CNC work hours tracker — timer, schedule, reports, part cards', createdAt: '2025-03' },
    { id: 'cnc-tools-pwa', name: 'CNC Tools PWA', stack: ['React', 'Netlify'], description: '35 tools reference, SVG illustrations, cutting parameter calculator', createdAt: '2025-02' },
  ],
  rules: [
    'Always include PWA manifest and service worker',
    'Neumorphic shadows — both inset and outset',
    'ZIP output with full file structure',
    'Ukrainian comments in code',
    'Mobile-first responsive layout',
  ],
}

export function useMemory() {
  const [memory, setMemory] = useState(() => {
    try {
      const saved = localStorage.getItem(MEMORY_KEY)
      return saved ? { ...DEFAULT_MEMORY, ...JSON.parse(saved) } : DEFAULT_MEMORY
    } catch { return DEFAULT_MEMORY }
  })

  const save = useCallback((updated) => {
    setMemory(updated)
    localStorage.setItem(MEMORY_KEY, JSON.stringify(updated))
  }, [])

  const addProject = useCallback((project) => {
    setMemory((prev) => {
      if (prev.projects.find((p) => p.id === project.id)) return prev
      const updated = { ...prev, projects: [project, ...prev.projects] }
      localStorage.setItem(MEMORY_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeProject = useCallback((id) => {
    setMemory((prev) => {
      const updated = { ...prev, projects: prev.projects.filter((p) => p.id !== id) }
      localStorage.setItem(MEMORY_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(MEMORY_KEY)
    setMemory(DEFAULT_MEMORY)
  }, [])

  return { memory, save, addProject, removeProject, reset }
}
