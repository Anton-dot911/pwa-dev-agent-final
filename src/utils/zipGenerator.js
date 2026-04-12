// zipGenerator.js — Парсинг файлів з відповіді Claude + ZIP збірка
// Phase 3: повна реалізація

// ─── Парсинг JSON-масиву файлів з markdown-відповіді ───────────
export function parseFilesFromResponse(text) {
  // Шукаємо ```json ... ``` блок з масивом файлів
  const jsonBlock = text.match(/```json\s*([\s\S]*?)```/g)
  if (!jsonBlock) return null

  for (const block of jsonBlock) {
    const inner = block.replace(/```json\s*/,'').replace(/```\s*$/,'').trim()
    try {
      const parsed = JSON.parse(inner)
      // Валідація: має бути масив об'єктів з path і content
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.path && parsed[0]?.content !== undefined) {
        return parsed
      }
    } catch { continue }
  }
  return null
}

// ─── Визначення мови файлу для підсвітки ────────────────────────
export function getFileLanguage(path) {
  const ext = path.split('.').pop()?.toLowerCase()
  const map = {
    js: 'javascript', jsx: 'jsx', ts: 'typescript', tsx: 'tsx',
    html: 'html', css: 'css', json: 'json', md: 'markdown',
    sh: 'bash', toml: 'toml', env: 'bash', svg: 'xml',
  }
  return map[ext] || 'text'
}

// ─── Побудова дерева файлів ─────────────────────────────────────
export function buildFileTree(files) {
  const tree = {}
  files.forEach(file => {
    const parts = file.path.split('/')
    let node = tree
    parts.forEach((part, i) => {
      if (i === parts.length - 1) {
        node[part] = { __file: true, ...file }
      } else {
        node[part] = node[part] || {}
        node = node[part]
      }
    })
  })
  return tree
}

// ─── ZIP збірка та скачування (через динамічний імпорт CDN) ─────
export async function downloadProjectZip(files, projectName = 'pwa-project') {
  // Динамічний імпорт JSZip з CDN (Vite build замінить на npm пакет)
  let JSZip
  try {
    const mod = await import('jszip')
    JSZip = mod.default
  } catch {
    // Fallback: blob download без ZIP (для preview середовища)
    downloadAsBlob(files, projectName)
    return
  }

  const zip = new JSZip()
  const folder = zip.folder(projectName)

  files.forEach(({ path, content }) => {
    folder.file(path, content)
  })

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  })

  // Тригер скачування
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${projectName}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Fallback: скачати як окремі файли або JSON manifest
function downloadAsBlob(files, projectName) {
  const manifest = JSON.stringify({ project: projectName, files }, null, 2)
  const blob = new Blob([manifest], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${projectName}-manifest.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ─── Статистика проєкту ──────────────────────────────────────────
export function getProjectStats(files) {
  const totalLines = files.reduce((acc, f) => acc + (f.content.match(/\n/g)?.length || 0) + 1, 0)
  const totalBytes = files.reduce((acc, f) => acc + new Blob([f.content]).size, 0)
  const byType = {}
  files.forEach(f => {
    const ext = f.path.split('.').pop() || 'other'
    byType[ext] = (byType[ext] || 0) + 1
  })
  return {
    fileCount: files.length,
    totalLines,
    totalKB: (totalBytes / 1024).toFixed(1),
    byType,
  }
}
