// MessageBubble.jsx — Рендер повідомлень з підсвіткою коду

const B = '#BECAE1', SD = '#a0b3cb', SL = '#d6e4f7', T = '#3a4a5c', AC = '#5b8fc9'
const neu = () => `6px 6px 14px ${SD},-6px -6px 14px ${SL}`

function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div style={{ position: 'relative', margin: '12px 0', borderRadius: '12px', overflow: 'hidden', background: '#1e2d3d' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 14px', background: '#16232f', borderBottom: '1px solid #2a3d52' }}>
        <span style={{ fontSize: '11px', color: '#6a8fab', fontFamily: 'monospace' }}>{lang || 'code'}</span>
        <button onClick={copy} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#6bab8e' : '#6a8fab', fontSize: '12px', fontWeight: '600' }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{ margin: 0, padding: '14px', overflowX: 'auto', fontSize: '13px', lineHeight: 1.6, color: '#a8d4c8', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{code}</pre>
    </div>
  )
}

import { useState } from 'react'

function renderContent(text) {
  const parts = []
  const codeRegex = /```(\w*)\n?([\s\S]*?)```/g
  let last = 0, match

  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: 'text', content: text.slice(last, match.index) })
    parts.push({ type: 'code', lang: match[1], content: match[2].trim() })
    last = codeRegex.lastIndex
  }
  if (last < text.length) parts.push({ type: 'text', content: text.slice(last) })
  return parts
}

function renderText(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('### ')) return <h3 key={i} style={{ margin: '10px 0 4px', fontSize: '14px', color: AC }}>{line.slice(4)}</h3>
    if (line.startsWith('## ')) return <h2 key={i} style={{ margin: '12px 0 6px', fontSize: '16px', color: T }}>{line.slice(3)}</h2>
    if (line.startsWith('- ') || line.startsWith('• ')) return <li key={i} style={{ marginLeft: '16px', marginBottom: '3px', fontSize: '14px' }}>{line.slice(2)}</li>
    if (line.startsWith('**') && line.endsWith('**')) return <strong key={i} style={{ display: 'block' }}>{line.slice(2, -2)}</strong>
    if (line === '') return <br key={i} />
    return <p key={i} style={{ margin: '3px 0', fontSize: '14px', lineHeight: 1.6 }}>{line}</p>
  })
}

export function MessageBubble({ message, isStreaming }) {
  const isUser = message.role === 'user'
  const parts = renderContent(message.content)

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '14px', gap: '10px', alignItems: 'flex-start' }}>
      {!isUser && (
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: B, boxShadow: neu(), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0, marginTop: '2px' }}>🤖</div>
      )}
      <div style={{
        maxWidth: '78%', background: B,
        boxShadow: isUser ? `inset 3px 3px 8px ${SD}, inset -3px -3px 8px ${SL}` : neu(),
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        padding: '12px 16px', color: T,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {parts.map((p, i) =>
          p.type === 'code'
            ? <CodeBlock key={i} code={p.content} lang={p.lang} />
            : <div key={i}>{renderText(p.content)}</div>
        )}
        {isStreaming && <span style={{ display: 'inline-block', width: '8px', height: '16px', background: AC, borderRadius: '2px', animation: 'blink 1s infinite', marginLeft: '4px', verticalAlign: 'middle' }} />}
      </div>
      {isUser && (
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: B, boxShadow: neu(), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0, marginTop: '2px' }}>👤</div>
      )}
    </div>
  )
}
