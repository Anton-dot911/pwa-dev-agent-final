// streamChat.js — Phase 5: запити через Netlify Function проксі
// У production API ключ прихований на сервері

// Визначаємо endpoint залежно від середовища
function getApiEndpoint() {
  // Production: Netlify Function
  if (window.location.hostname !== 'localhost') {
    return '/.netlify/functions/claude'
  }
  // Dev: пряме звернення до API (потрібен VITE_ANTHROPIC_API_KEY у .env)
  return null
}

export async function streamChat({ messages, systemPrompt, onChunk, onDone, onError }) {
  const endpoint = getApiEndpoint()

  try {
    let response

    if (endpoint) {
      // === Production: через Netlify Function (ключ прихований) ===
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 8192,
          stream: false,
          system: systemPrompt,
          messages,
        }),
      })

      // Читаємо відповідь як текст спочатку — захист від HTML помилок
      const rawText = await response.text()

      if (!response.ok) {
        // Пробуємо розпарсити JSON помилку, інакше показуємо статус
        try {
          const err = JSON.parse(rawText)
          throw new Error(err.error || `HTTP ${response.status}`)
        } catch {
          if (response.status === 404) {
            throw new Error('Netlify Function не знайдена. Перевір що netlify/functions/claude.js є у репо та задеплоєна.')
          }
          throw new Error(`HTTP ${response.status}: ${rawText.slice(0, 120)}`)
        }
      }

      let data
      try {
        data = JSON.parse(rawText)
      } catch {
        throw new Error('Некоректна відповідь від сервера')
      }

      const text = data.content?.[0]?.text || ''

      // Симулюємо стримінг для кращого UX
      const words = text.split(' ')
      let accumulated = ''
      for (let i = 0; i < words.length; i++) {
        accumulated += (i > 0 ? ' ' : '') + words[i]
        onChunk(null, accumulated)
        // Невелика затримка кожні 5 слів для природного ефекту
        if (i % 5 === 4) await new Promise(r => setTimeout(r, 8))
      }
      onDone(text)

    } else {
      // === Development: пряме звернення до Claude API ===
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
      if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY не знайдено у .env файлі')

      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 8192,
          stream: true,
          system: systemPrompt,
          messages,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error?.message || 'API Error')
      }

      // Реальний SSE стримінг у dev режимі
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        for (const line of decoder.decode(value, { stream: true }).split('\n')) {
          if (!line.startsWith('data: ')) continue
          const d = line.slice(6).trim()
          if (d === '[DONE]') continue
          try {
            const p = JSON.parse(d)
            if (p.type === 'content_block_delta' && p.delta?.type === 'text_delta') {
              fullText += p.delta.text
              onChunk(p.delta.text, fullText)
            }
          } catch {}
        }
      }
      onDone(fullText)
    }
  } catch (err) {
    onError(err.message)
  }
}
