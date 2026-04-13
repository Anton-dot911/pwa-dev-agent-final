// zipGenerator.js — парсинг файлів з відповіді + ZIP збірка

// Парсить JSON масив файлів з markdown-відповіді Claude
export function parseFilesFromResponse(text) {
  // Шукаємо всі ```json блоки
  const regex = /```json\s*([\s\S]*?)```/g
  let match
  while ((match = regex.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim())
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.path && 'content' in parsed[0]) {
        return parsed
      }
    } catch {}
  }
  return null
}

// Визначає мову файлу
export function getFileLanguage(path) {
  const ext = path.split('.').pop()?.toLowerCase()
  return { js:'javascript', jsx:'jsx', ts:'typescript', tsx:'tsx', html:'html', css:'css', json:'json', md:'markdown', svg:'xml', toml:'toml' }[ext] || 'text'
}

// Будує дерево файлів
export function buildFileTree(files) {
  const tree = {}
  files.forEach(file => {
    const parts = file.path.split('/')
    let node = tree
    parts.forEach((part, i) => {
      if (i === parts.length - 1) node[part] = { __file: true, ...file }
      else { node[part] = node[part] || {}; node = node[part] }
    })
  })
  return tree
}

// Статистика проєкту
export function getProjectStats(files) {
  const totalLines = files.reduce((acc, f) => acc + (f.content.match(/\n/g)?.length || 0) + 1, 0)
  const totalBytes = files.reduce((acc, f) => acc + new Blob([f.content]).size, 0)
  const byType = {}
  files.forEach(f => { const ext = f.path.split('.').pop() || 'other'; byType[ext] = (byType[ext] || 0) + 1 })
  return { fileCount: files.length, totalLines, totalKB: (totalBytes / 1024).toFixed(1), byType }
}

// ZIP скачування
export async function downloadProjectZip(files, projectName = 'pwa-project') {
  try {
    // Динамічний імпорт JSZip
    const { default: JSZip } = await import('jszip')
    const zip = new JSZip()
    const folder = zip.folder(projectName)
    files.forEach(({ path, content }) => folder.file(path, content))
    const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement('a'), { href: url, download: `${projectName}.zip` })
    document.body.appendChild(a); a.click()
    document.body.removeChild(a); URL.revokeObjectURL(url)
    return true
  } catch (err) {
    console.error('ZIP error:', err)
    // Fallback: скачати як JSON manifest
    const json = JSON.stringify(files, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement('a'), { href: url, download: `${projectName}-files.json` })
    document.body.appendChild(a); a.click()
    document.body.removeChild(a); URL.revokeObjectURL(url)
    return false
  }
}
