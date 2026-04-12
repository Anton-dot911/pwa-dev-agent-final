// FileExplorer.jsx — Панель перегляду згенерованих файлів
// Показує дерево файлів + вміст + кнопку ZIP

import { useState } from 'react'
import { buildFileTree, getFileLanguage, downloadProjectZip, getProjectStats } from '../utils/zipGenerator'

const B = '#BECAE1', SD = '#a0b3cb', SL = '#d6e4f7', T = '#3a4a5c', AC = '#5b8fc9', GR = '#6bab8e'
const neu = (i = false) => i ? `inset 4px 4px 10px ${SD},inset -4px -4px 10px ${SL}` : `6px 6px 14px ${SD},-6px -6px 14px ${SL}`

// Іконки для типів файлів
function fileIcon(path) {
  const ext = path.split('.').pop()?.toLowerCase()
  const icons = {
    jsx: '⚛️', tsx: '⚛️', js: '📜', ts: '📘',
    css: '🎨', html: '🌐', json: '📋', md: '📝',
    svg: '🖼️', env: '🔑', toml: '⚙️', sh: '💻',
    txt: '📄',
  }
  return icons[ext] || '📄'
}

function folderIcon(open) { return open ? '📂' : '📁' }

// Рекурсивне дерево файлів
function TreeNode({ name, node, depth = 0, onSelect, selectedPath }) {
  const isFile = node.__file === true
  const [open, setOpen] = useState(depth < 2)

  const indent = depth * 14

  if (isFile) {
    const isSelected = selectedPath === node.path
    return (
      <div
        onClick={() => onSelect(node)}
        style={{
          paddingLeft: 12 + indent,
          paddingRight: 10,
          paddingTop: 5,
          paddingBottom: 5,
          cursor: 'pointer',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          background: isSelected ? `linear-gradient(135deg, ${AC}22, ${AC}11)` : 'transparent',
          boxShadow: isSelected ? neu(true) : 'none',
          marginBottom: 2,
          transition: 'all 0.15s',
        }}
      >
        <span style={{ fontSize: 13 }}>{fileIcon(name)}</span>
        <span style={{ fontSize: 12, color: isSelected ? AC : T, fontWeight: isSelected ? '600' : '400', fontFamily: "'JetBrains Mono', monospace" }}>{name}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#9ab5cc' }}>
          {node.content ? `${node.content.split('\n').length}L` : ''}
        </span>
      </div>
    )
  }

  const children = Object.entries(node).filter(([k]) => k !== '__file')

  return (
    <div>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ paddingLeft: 12 + indent, paddingRight: 10, paddingTop: 5, paddingBottom: 5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, borderRadius: 8, marginBottom: 2 }}
      >
        <span style={{ fontSize: 13 }}>{folderIcon(open)}</span>
        <span style={{ fontSize: 12, color: '#7a90a8', fontWeight: '600', fontFamily: "'JetBrains Mono', monospace" }}>{name}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#9ab5cc' }}>{children.length}</span>
      </div>
      {open && children.map(([k, v]) => (
        <TreeNode key={k} name={k} node={v} depth={depth + 1} onSelect={onSelect} selectedPath={selectedPath} />
      ))}
    </div>
  )
}

// Підсвітка коду (спрощена, без залежностей)
function CodeViewer({ file }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(file.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: '#111d2e', borderBottom: '1px solid #2a3d52', borderRadius: '12px 12px 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>{fileIcon(file.path)}</span>
          <span style={{ fontSize: 12, color: '#a0bcd4', fontFamily: 'monospace' }}>{file.path}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: '#4a6a8a' }}>{getFileLanguage(file.path)}</span>
          <button onClick={copy} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? GR : '#5a7a9a', fontSize: 12, fontWeight: '600' }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', background: '#1a2840', borderRadius: '0 0 12px 12px' }}>
        <pre style={{ margin: 0, padding: '14px', fontSize: 12, lineHeight: 1.65, color: '#c0d8f0', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {file.content}
        </pre>
      </div>
    </div>
  )
}

// Головний компонент FileExplorer
export function FileExplorer({ files, projectName, onClose }) {
  const [selected, setSelected] = useState(files[0] || null)
  const [downloading, setDownloading] = useState(false)
  const tree = buildFileTree(files)
  const stats = getProjectStats(files)

  const handleDownload = async () => {
    setDownloading(true)
    await downloadProjectZip(files, projectName)
    setTimeout(() => setDownloading(false), 1500)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(130,150,175,0.55)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '16px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: B, borderRadius: 24, boxShadow: `14px 14px 32px ${SD}, -14px -14px 32px ${SL}`, width: 'min(900px, 98vw)', height: 'min(620px, 90vh)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${SD}`, background: B }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 22 }}>📦</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: 15, color: T }}>{projectName}</div>
              <div style={{ fontSize: 11, color: '#7a90a8', marginTop: 1 }}>
                {stats.fileCount} файлів · {stats.totalLines} рядків · {stats.totalKB} KB
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{ background: B, border: 'none', borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: '700', color: downloading ? '#7a90a8' : GR, boxShadow: downloading ? neu(true) : neu(), cursor: downloading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.2s' }}
            >
              {downloading ? '⏳ Пакуємо...' : '⬇ Скачати ZIP'}
            </button>
            <button onClick={onClose} style={{ background: B, border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', boxShadow: neu(), color: T, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        </div>

        {/* Body: tree + code */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* File Tree */}
          <div style={{ width: 220, overflowY: 'auto', padding: '12px 8px', borderRight: `1px solid ${SD}`, flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: '700', letterSpacing: '1px', color: AC, textTransform: 'uppercase', paddingLeft: 12, marginBottom: 8 }}>Структура</div>
            {Object.entries(tree).map(([k, v]) => (
              <TreeNode key={k} name={k} node={v} depth={0} onSelect={setSelected} selectedPath={selected?.path} />
            ))}
          </div>

          {/* Code Viewer */}
          <div style={{ flex: 1, padding: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {selected ? (
              <CodeViewer file={selected} />
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a90a8', fontSize: 14 }}>
                Оберіть файл для перегляду
              </div>
            )}
          </div>
        </div>

        {/* Footer stats */}
        <div style={{ padding: '8px 20px', borderTop: `1px solid ${SD}`, display: 'flex', gap: 16, alignItems: 'center' }}>
          {Object.entries(stats.byType).slice(0, 6).map(([ext, count]) => (
            <div key={ext} style={{ fontSize: 11, color: '#7a90a8' }}>
              <span style={{ fontFamily: 'monospace', color: AC }}>.{ext}</span> ×{count}
            </div>
          ))}
          <div style={{ marginLeft: 'auto', fontSize: 11, color: '#7a90a8' }}>Tab ↑↓ для навігації</div>
        </div>
      </div>
    </div>
  )
}
