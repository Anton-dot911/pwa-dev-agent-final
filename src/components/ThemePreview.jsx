// ThemePreview.jsx — Панель попереднього перегляду тем та компонентів
import { useState } from 'react'
import { THEMES, COMPONENTS, generateFullTheme } from '../utils/designEngine'

const B = '#BECAE1', SD = '#a0b3cb', SL = '#d6e4f7', T = '#3a4a5c', AC = '#5b8fc9', GR = '#6bab8e', RD = '#c97b7b'
const neu = (i = false) => i ? `inset 4px 4px 10px ${SD},inset -4px -4px 10px ${SL}` : `6px 6px 14px ${SD},-6px -6px 14px ${SL}`

// Мінімальний live-preview кожної теми
function ThemeCard({ themeKey, theme, isActive, onSelect }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={() => onSelect(themeKey)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: B, borderRadius: 16, padding: '14px',
        boxShadow: isActive ? neu(true) : hov ? `8px 8px 20px ${SD}, -8px -8px 20px ${SL}` : neu(),
        cursor: 'pointer', transition: 'all 0.2s',
        border: isActive ? `2px solid ${AC}` : '2px solid transparent',
      }}
    >
      {/* Кольорові свотчі */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {theme.preview.map((c, i) => (
          <div key={i} style={{ flex: 1, height: 28, borderRadius: 6, background: c, boxShadow: '2px 2px 6px rgba(0,0,0,0.15)' }} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
        <span style={{ fontSize: 18 }}>{theme.emoji}</span>
        <span style={{ fontWeight: '700', fontSize: 14, color: isActive ? AC : T }}>{theme.name}</span>
        {isActive && <span style={{ marginLeft: 'auto', fontSize: 11, color: AC, fontWeight: '700' }}>✓ Обрана</span>}
      </div>
      <div style={{ fontSize: 12, color: '#7a90a8', lineHeight: 1.4 }}>{theme.description}</div>
    </div>
  )
}

// Live preview мікро-UI конкретної теми
function LivePreview({ themeKey, baseColor }) {
  const tokens = THEMES[themeKey]?.tokens(baseColor) || {}
  const isNeu = themeKey === 'neumorphic'
  const isGlass = themeKey === 'glassmorphic'
  const isBrut = themeKey === 'brutalist'

  const bg = tokens['--bg'] || '#BECAE1'
  const text = tokens['--text'] || '#333'
  const accent = tokens['--accent'] || '#5b8fc9'
  const muted = tokens['--text-muted'] || '#888'
  const radius = tokens['--radius'] || '12px'
  const radiusSm = tokens['--radius-sm'] || '8px'
  const font = tokens['--font'] || 'sans-serif'

  const shadow = isNeu ? tokens['--neu-out'] : isGlass ? tokens['--shadow'] : isBrut ? '4px 4px 0 #000' : tokens['--shadow'] || '0 2px 8px rgba(0,0,0,0.1)'
  const shadowIn = isNeu ? tokens['--neu-in'] : 'none'
  const surface = isGlass ? tokens['--glass'] : isNeu ? bg : tokens['--surface'] || '#fff'
  const border = isGlass ? `1px solid ${tokens['--glass-border'] || 'rgba(255,255,255,0.15)'}` : isBrut ? '3px solid #000' : 'none'
  const blur = isGlass ? tokens['--glass-blur'] : 'none'

  return (
    <div style={{ background: isGlass ? '#0f0f1a' : bg, borderRadius: 14, padding: '20px 18px', minHeight: 260, fontFamily: font }}>
      {/* Card */}
      <div style={{ background: surface, borderRadius: radius, padding: '14px 16px', marginBottom: 14, boxShadow: shadow, border, backdropFilter: blur }}>
        <div style={{ fontWeight: '700', fontSize: 14, color: isGlass ? '#e8eaf6' : text, marginBottom: 6 }}>Картка проєкту</div>
        <div style={{ fontSize: 12, color: isGlass ? '#9fa8da' : muted, lineHeight: 1.5 }}>React + Vite PWA · Netlify deploy</div>
        {/* Badge */}
        <div style={{ display: 'inline-block', marginTop: 8, padding: '3px 9px', borderRadius: isBrut ? 0 : 20, fontSize: 11, fontWeight: '700', background: isGlass ? 'rgba(124,77,255,0.2)' : isNeu ? bg : `${accent}22`, color: accent, boxShadow: isNeu ? tokens['--neu-btn'] : 'none', border: isBrut ? '2px solid #000' : 'none' }}>
          🚀 В роботі
        </div>
      </div>

      {/* Input */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ background: surface, border, borderRadius: radiusSm, padding: '9px 13px', fontSize: 13, color: isGlass ? 'rgba(255,255,255,0.4)' : muted, boxShadow: shadowIn || (isGlass ? 'none' : isBrut ? 'none' : shadow) }}>
          Введіть назву проєкту...
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, background: isGlass ? 'rgba(124,77,255,0.15)' : isNeu ? bg : accent, border: isGlass ? `1px solid ${accent}` : isBrut ? '3px solid #000' : 'none', borderRadius: radiusSm, padding: '8px 0', fontSize: 13, fontWeight: '700', color: isGlass || isNeu ? accent : '#fff', textAlign: 'center', boxShadow: isNeu ? tokens['--neu-btn'] : isBrut ? '3px 3px 0 #000' : 'none', cursor: 'pointer' }}>
          Створити
        </div>
        <div style={{ background: isGlass ? tokens['--glass'] : isNeu ? bg : 'transparent', border: isBrut ? '3px solid #000' : isGlass ? `1px solid ${tokens['--glass-border']}` : 'none', borderRadius: radiusSm, padding: '8px 14px', fontSize: 13, fontWeight: '600', color: isGlass ? '#e8eaf6' : muted, boxShadow: isNeu ? tokens['--neu-btn'] : 'none', cursor: 'pointer' }}>
          Скасувати
        </div>
      </div>
    </div>
  )
}

// Список компонентів
function ComponentList({ themeKey, onGenerate }) {
  const [hov, setHov] = useState(null)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {Object.entries(COMPONENTS).map(([key, comp]) => (
        <div
          key={key}
          onClick={() => onGenerate(key)}
          onMouseEnter={() => setHov(key)}
          onMouseLeave={() => setHov(null)}
          style={{ background: B, boxShadow: hov === key ? `8px 8px 18px ${SD},-8px -8px 18px ${SL}` : neu(), borderRadius: 12, padding: '10px 12px', cursor: 'pointer', transition: 'all 0.18s' }}
        >
          <div style={{ fontSize: 18, marginBottom: 4 }}>{comp.emoji}</div>
          <div style={{ fontWeight: '700', fontSize: 13, color: T }}>{comp.name}</div>
          <div style={{ fontSize: 11, color: '#7a90a8', marginTop: 2 }}>{comp.variants.join(' · ')}</div>
        </div>
      ))}
    </div>
  )
}

// ── Головний ThemePreview ──────────────────────────────────────────
export function ThemePreview({ memory, onInsertToChat, onClose }) {
  const [activeTheme, setActiveTheme] = useState(memory.uiStyle || 'neumorphic')
  const [activeTab, setActiveTab] = useState('themes') // themes | components | export
  const [exported, setExported] = useState(false)

  const handleExportTheme = () => {
    const theme = generateFullTheme(activeTheme, memory.baseColor)
    if (!theme) return
    const blob = new Blob([theme.full], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `theme-${activeTheme}.css`
    a.click()
    URL.revokeObjectURL(url)
    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }

  const handleGenerateComponent = (compKey) => {
    const comp = COMPONENTS[compKey]
    const msg = `/ui ${comp.name} компонент для ${activeTheme} теми — всі варіанти: ${comp.variants.join(', ')}`
    onInsertToChat(msg)
    onClose()
  }

  const handleAskTheme = () => {
    const msg = `/theme ${THEMES[activeTheme]?.name} — повна CSS тема з усіма компонентами для мого PWA`
    onInsertToChat(msg)
    onClose()
  }

  const tabs = [
    { key: 'themes',     label: '🎨 Теми' },
    { key: 'components', label: '🧩 Компоненти' },
    { key: 'export',     label: '⬇ Експорт' },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(130,150,175,0.55)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 16, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: B, borderRadius: 24, boxShadow: `14px 14px 32px ${SD},-14px -14px 32px ${SL}`, width: 'min(860px,98vw)', maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${SD}` }}>
          <div style={{ fontWeight: '700', fontSize: 17, display: 'flex', alignItems: 'center', gap: 9, color: T }}>
            <span>🎨</span> Design Engine
          </div>
          <div style={{ display: 'flex', gap: 9 }}>
            <button onClick={handleAskTheme} style={{ background: B, border: 'none', borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: '700', color: AC, boxShadow: neu(), cursor: 'pointer' }}>
              💬 Генерувати через Chat
            </button>
            <button onClick={onClose} style={{ background: B, border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', boxShadow: neu(), fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, padding: '12px 22px 0', borderBottom: `1px solid ${SD}` }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ background: B, border: 'none', borderRadius: '10px 10px 0 0', padding: '8px 16px', fontSize: 13, fontWeight: '600', color: activeTab === tab.key ? AC : '#7a90a8', boxShadow: activeTab === tab.key ? neu(true) : 'none', cursor: 'pointer', transition: 'all 0.15s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>

          {activeTab === 'themes' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Ліво: список тем */}
              <div>
                <div style={{ fontSize: 11, fontWeight: '700', letterSpacing: '1px', color: AC, textTransform: 'uppercase', marginBottom: 12 }}>Оберіть тему</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.entries(THEMES).map(([key, theme]) => (
                    <ThemeCard key={key} themeKey={key} theme={theme} isActive={activeTheme === key} onSelect={setActiveTheme} />
                  ))}
                </div>
              </div>
              {/* Право: live preview */}
              <div>
                <div style={{ fontSize: 11, fontWeight: '700', letterSpacing: '1px', color: AC, textTransform: 'uppercase', marginBottom: 12 }}>Live Preview</div>
                <LivePreview themeKey={activeTheme} baseColor={memory.baseColor} />
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: '700', letterSpacing: '1px', color: AC, textTransform: 'uppercase', marginBottom: 8 }}>CSS Токени</div>
                  <div style={{ background: '#1a2840', borderRadius: 10, padding: '12px 14px', maxHeight: 160, overflowY: 'auto' }}>
                    <pre style={{ margin: 0, fontSize: 11, color: '#a8d4c8', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                      {Object.entries(THEMES[activeTheme]?.tokens(memory.baseColor) || {}).slice(0, 10).map(([k, v]) => `${k}: ${v};`).join('\n')}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'components' && (
            <div>
              <div style={{ fontSize: 11, fontWeight: '700', letterSpacing: '1px', color: AC, textTransform: 'uppercase', marginBottom: 14 }}>
                Компоненти для теми: {THEMES[activeTheme]?.emoji} {THEMES[activeTheme]?.name}
              </div>
              <div style={{ fontSize: 13, color: '#7a90a8', marginBottom: 16 }}>
                Клікни на компонент — надішле запит до Claude для генерації повного React компонента
              </div>
              <ComponentList themeKey={activeTheme} onGenerate={handleGenerateComponent} />
            </div>
          )}

          {activeTab === 'export' && (
            <div style={{ maxWidth: 480 }}>
              <div style={{ fontSize: 11, fontWeight: '700', letterSpacing: '1px', color: AC, textTransform: 'uppercase', marginBottom: 14 }}>Експорт теми</div>
              {[
                { label: '⬇ theme.css', desc: 'Повний CSS файл з токенами і всіма компонентами', action: handleExportTheme, color: GR },
                { label: '💬 Через Chat', desc: 'Claude згенерує повну тему з твоїм контекстом і проєктом', action: handleAskTheme, color: AC },
              ].map(item => (
                <div key={item.label} style={{ background: B, boxShadow: neu(), borderRadius: 14, padding: '16px 18px', marginBottom: 12 }}>
                  <div style={{ fontWeight: '700', fontSize: 14, color: T, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: '#7a90a8', marginBottom: 12 }}>{item.desc}</div>
                  <button onClick={item.action} style={{ background: B, border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: '700', color: item.color, boxShadow: neu(), cursor: 'pointer' }}>
                    {item.label === '⬇ theme.css' && exported ? '✓ Скачано!' : item.label}
                  </button>
                </div>
              ))}
              <div style={{ background: '#1a2840', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, color: '#6a8fab', marginBottom: 8, fontFamily: 'monospace' }}>/* Приклад підключення */</div>
                <pre style={{ margin: 0, fontSize: 12, color: '#a8d4c8', fontFamily: 'monospace' }}>{`import './theme-${activeTheme}.css'\n\n// Всі компоненти тепер використовують\n// CSS змінні автоматично`}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
