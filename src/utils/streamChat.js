// streamChat.js — прямий виклик Claude API з браузера
// Для особистого інструменту це оптимальний підхід (без серверного проксі)

export async function streamChat({ messages, systemPrompt, onChunk, onDone, onError }) {
  try {
    // Ключ береться з Vite env (VITE_ANTHROPIC_API_KEY)
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error('VITE_ANTHROPIC_API_KEY не знайдено. Додай його у Netlify: Site settings → Environment variables')
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
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
      const err = await response.json().catch(() => ({ error: { message: `HTTP ${response.status}` } }))
      throw new Error(err.error?.message || `HTTP ${response.status}`)
    }

    // SSE streaming
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

  } catch (err) {
    onError(err.message)
  }
}
