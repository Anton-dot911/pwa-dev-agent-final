import { useState, useRef, useEffect, useCallback } from 'react'
import { useMemory } from './hooks/useMemory'
import { buildSystemPrompt } from './utils/buildSystemPrompt'
import { parseFilesFromResponse, downloadProjectZip, getProjectStats } from './utils/zipGenerator'
import { streamChat } from './utils/streamChat'
import { MemoryPanel } from './components/MemoryPanel'
import { MessageBubble } from './components/MessageBubble'
import { FileExplorer } from './components/FileExplorer'
import { ThemePreview } from './components/ThemePreview'
import { LivePreview } from './components/LivePreview'
import './styles/global.css'

const B = '#BECAE1', SD = '#a0b3cb', SL = '#d6e4f7', T = '#3a4a5c', AC = '#5b8fc9', GR = '#6bab8e'
const neu = (i = false) => i ? `inset 4px 4px 10px ${SD},inset -4px -4px 10px ${SL}` : `6px 6px 14px ${SD},-6px -6px 14px ${SL}`

const COMMANDS = ['/new', '/ui', '/theme', '/pwa', '/refactor', '/memory', '/design', '/clear']

const WELCOME = {
  id: 'welcome', role: 'assistant',
  content: `Привіт! Я твій PWA Dev Agent 🤖\n\nPhase 5 · Production Ready · PWA · Netlify\n\n## Команди:\n- /new [опис] — повний проєкт → ZIP + Live Demo\n- /ui [компонент] — React компонент + CSS\n- /theme [назва] — повна CSS тема з токенами\n- /pwa — додати PWA шар\n- /design — відкрити Design Engine\n- /memory — переглянути профіль\n- /clear — очистити чат\n\nЩо будуємо?`,
}

export default function App() {
  const { memory, save, addProject } = useMemory()
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingId, setStreamingId] = useState(null)

  // Панелі — окремий стан відкриття від даних
  const [memoryOpen, setMemoryOpen] = useState(false)
  const [designOpen, setDesignOpen] = useState(false)
  const [explorerOpen, setExplorerOpen] = useState(false)
  const [liveOpen, setLiveOpen] = useState(false)
  const [projectData, setProjectData] = useState(null) // { files, projectName }

  const [suggestions, setSugg] = useState([])
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  useEffect(() => {
    if (input.startsWith('/') && input.length > 0) {
      setSugg(COMMANDS.filter(c => c.startsWith(input.toLowerCase()) && c !== input.trim()))
    } else setSugg([])
  }, [input])

  const send = useCallback(async (overrideText) => {
    const text = (overrideText || input).trim()
    if (!text || isLoading) return
    if (!overrideText) setInput('')
    setSugg([])

    if (text === '/memory') { setMemoryOpen(true); return }
    if (text === '/design') { setDesignOpen(true); return }
    if (text === '/clear') { setMessages([WELCOME]); setProjectData(null); return }

    const userMsg = { id: Date.now() + 'u', role: 'user', content: text }
    const apiMsgs = [...messages, userMsg]
      .filter(m => m.id !== 'welcome')
      .map(m => ({ role: m.role, content: m.content }))

    setMessages(prev => [...prev, userMsg])

    const aid = Date.now() + 'a'
    setStreamingId(aid)
    setIsLoading(true)
    setMessages(prev => [...prev, { id: aid, role: 'assistant', content: '' }])

    const nameMatch = text.match(/\/new\s+(.+)/i)
    const projectName = nameMatch
      ? nameMatch[1].slice(0, 40).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      : text.match(/\/theme\s+(.+)/i)?.[1]?.toLowerCase()?.replace(/\s+/g, '-') || 'pwa-project'

    await streamChat({
      messages: apiMsgs,
      systemPrompt: buildSystemPrompt(memory),
      onChunk: (_, total) => {
        setMessages(prev => prev.map(m => m.id === aid ? { ...m, content: total } : m))
      },
      onDone: (total) => {
        setStreamingId(null)
        setIsLoading(false)
        const files = parseFilesFromResponse(total)
        if (files?.length > 0) {
          setProjectData({ files, projectName })
          if (nameMatch) {
            addProject({
              id: `proj-${Date.now()}`,
              name: nameMatch[1].slice(0, 40),
              stack: memory.stack,
              description: nameMatch[1],
              createdAt: new Date().toISOString().slice(0, 7),
            })
          }
        }
      },
      onError: (err) => {
        setStreamingId(null)
        setIsLoading(false)
        setMessages(prev => prev.map(m =>
          m.id === aid ? { ...m, content: `❌ ${err}` } : m
        ))
      },
    })
  }, [input, isLoading, messages, memory, addProject])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
    if (e.key === 'Tab' && suggestions.length > 0) { e.preventDefault(); setInput(suggestions[0] + ' ') }
  }

  const stats = projectData ? getProjectStats(projectData.files) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: B, fontFamily: "'DM Sans','Segoe UI',sans-serif", color: T }}>

      {/* ── Header ── */}
      <div style={{ padding: '12px 16px', background: B, boxShadow: `0 4px 14px ${SD}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: B, boxShadow: neu(), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21 }}>🤖</div>
          <div>
            <div style={{ fontWeight: '700', fontSize: 15, letterSpacing: '-0.3px' }}>PWA Dev Agent</div>
            <div style={{ fontSize: 11, color: '#7a90a8' }}>Phase 5 · Production · {memory.uiStyle}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {projectData && (
            <button onClick={() => setExplorerOpen(true)}
              style={{ background: B, border: 'none', borderRadius: 10, padding: '7px 12px', fontSize: 12, fontWeight: '700', color: AC, boxShadow: neu(), cursor: 'pointer' }}>
              🗂 {stats?.fileCount}f
            </button>
          )}
          <button onClick={() => setDesignOpen(true)}
            style={{ background: B, border: 'none', borderRadius: 10, padding: '7px 12px', fontSize: 12, color: '#a06bc7', boxShadow: neu(), cursor: 'pointer' }}>🎨</button>
          <button onClick={() => setMemoryOpen(true)}
            style={{ background: B, border: 'none', borderRadius: 10, padding: '7px 12px', fontSize: 12, color: AC, boxShadow: neu(), cursor: 'pointer' }}>🧠</button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
        {messages.map((msg, i) => (
          <MessageBubble key={msg.id || i} message={msg} isStreaming={msg.id === streamingId} />
        ))}

        {isLoading && !streamingId && (
          <div style={{ display: 'flex', gap: 5, padding: '12px 46px', alignItems: 'center' }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: AC, animation: `bounce 1.1s ${i*0.18}s infinite` }} />)}
          </div>
        )}

        {/* ── Project Card — завжди видима після генерації ── */}
        {projectData && (
          <div style={{ margin: '12px 0', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ background: B, boxShadow: neu(), borderRadius: 16, padding: '14px 18px', maxWidth: 420 }}>
              <div style={{ fontSize: 10, color: GR, fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>
                📦 Готово до скачування
              </div>
              <div style={{ fontWeight: '700', fontSize: 14, color: T, marginBottom: 2 }}>{projectData.projectName}</div>
              <div style={{ fontSize: 11, color: '#7a90a8', marginBottom: 14 }}>
                {stats?.fileCount} файлів · {stats?.totalLines} рядків · {stats?.totalKB} KB
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={() => setExplorerOpen(true)}
                  style={{ background: B, border: 'none', borderRadius: 9, padding: '8px 14px', fontSize: 12, fontWeight: '700', color: AC, boxShadow: neu(), cursor: 'pointer' }}>
                  🗂 Файли
                </button>
                <button onClick={() => setLiveOpen(true)}
                  style={{ background: B, border: 'none', borderRadius: 9, padding: '8px 14px', fontSize: 12, fontWeight: '700', color: '#a06bc7', boxShadow: neu(), cursor: 'pointer' }}>
                  ▶ Live Demo
                </button>
                <button onClick={() => downloadProjectZip(projectData.files, projectData.projectName)}
                  style={{ background: B, border: 'none', borderRadius: 9, padding: '8px 14px', fontSize: 12, fontWeight: '700', color: GR, boxShadow: neu(), cursor: 'pointer' }}>
                  ⬇ ZIP
                </button>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Suggestions ── */}
      {suggestions.length > 0 && (
        <div style={{ padding: '0 12px 7px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => { setInput(s + ' '); inputRef.current?.focus() }}
              style={{ background: B, border: 'none', borderRadius: 8, padding: '4px 10px', fontSize: 12, color: AC, boxShadow: neu(), cursor: 'pointer', fontWeight: '600' }}>
              {s}
            </button>
          ))}
          <span style={{ fontSize: 11, color: '#7a90a8', alignSelf: 'center' }}>Tab→</span>
        </div>
      )}

      {/* ── Input ── */}
      <div style={{ padding: '10px 12px 16px', background: B, boxShadow: `0 -4px 14px ${SD}` }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Запит або /команда... (Enter — відправити)"
            rows={1}
            style={{ flex: 1, background: B, border: 'none', borderRadius: 12, padding: '10px 14px', fontSize: 14, color: T, boxShadow: neu(true), outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.5, maxHeight: 100, overflowY: 'auto' }}
            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px' }}
          />
          <button onClick={() => send()} disabled={isLoading || !input.trim()}
            style={{ width: 42, height: 42, borderRadius: 12, border: 'none', background: B, boxShadow: input.trim() && !isLoading ? neu() : neu(true), cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: input.trim() && !isLoading ? AC : '#a0b3cb', transition: 'all 0.2s' }}>
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
      </div>

      {/* ── Overlays ── */}
      {memoryOpen && <MemoryPanel memory={memory} onSave={save} onClose={() => setMemoryOpen(false)} />}
      {designOpen && <ThemePreview memory={memory} onInsertToChat={msg => { send(msg) }} onClose={() => setDesignOpen(false)} />}

      {/* FileExplorer — закриття не знищує projectData */}
      {explorerOpen && projectData && (
        <FileExplorer
          files={projectData.files}
          projectName={projectData.projectName}
          onClose={() => setExplorerOpen(false)}
        />
      )}

      {/* LivePreview */}
      {liveOpen && projectData && (
        <LivePreview
          files={projectData.files}
          projectName={projectData.projectName}
          onClose={() => setLiveOpen(false)}
        />
      )}
    </div>
  )
}
