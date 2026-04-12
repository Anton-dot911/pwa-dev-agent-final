// InstallPrompt.jsx — PWA Install Banner
// З'являється коли браузер дозволяє встановлення

import { useState, useEffect } from 'react'

const B = '#BECAE1', SD = '#a0b3cb', SL = '#d6e4f7', T = '#3a4a5c', AC = '#5b8fc9', GR = '#6bab8e'
const neu = (i = false) => i ? `inset 3px 3px 8px ${SD},inset -3px -3px 8px ${SL}` : `5px 5px 12px ${SD},-5px -5px 12px ${SL}`

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Перевірка: чи вже встановлено
    if (window.matchMedia('(display-mode: standalone)').matches) return

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Показуємо через 10 секунд (не одразу)
      setTimeout(() => setVisible(true), 10000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setVisible(false)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setDeferredPrompt(null)
    setVisible(false)
  }

  if (!visible || installed) return null

  return (
    <div style={{
      position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
      zIndex: 500, animation: 'slideUp 0.3s ease',
      width: 'min(360px, calc(100vw - 32px))',
    }}>
      <div style={{
        background: B, borderRadius: 18,
        boxShadow: `10px 10px 24px ${SD}, -10px -10px 24px ${SL}`,
        padding: '16px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: B, boxShadow: neu(), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🤖</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: '700', fontSize: 14, color: T, marginBottom: 2 }}>Встановити як додаток</div>
          <div style={{ fontSize: 12, color: '#7a90a8', lineHeight: 1.4 }}>Доступ без браузера, офлайн shell</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={() => setVisible(false)} style={{ background: B, border: 'none', borderRadius: 9, width: 32, height: 32, cursor: 'pointer', boxShadow: neu(), color: '#7a90a8', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          <button onClick={handleInstall} style={{ background: B, border: 'none', borderRadius: 9, padding: '0 14px', height: 32, cursor: 'pointer', boxShadow: neu(), color: GR, fontSize: 13, fontWeight: '700', whiteSpace: 'nowrap' }}>Встановити</button>
        </div>
      </div>
    </div>
  )
}
