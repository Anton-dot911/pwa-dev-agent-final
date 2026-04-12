import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { InstallPrompt } from './components/InstallPrompt.jsx'

// Реєстрація Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(reg => console.log('[PWA] SW registered:', reg.scope))
      .catch(err => console.warn('[PWA] SW failed:', err))
  })
}

// Обробка URL параметрів (shortcuts з manifest.json)
const urlParams = new URLSearchParams(window.location.search)
const initialCmd = urlParams.get('cmd') // ?cmd=new або ?cmd=design

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App initialCmd={initialCmd} />
    <InstallPrompt />
  </React.StrictMode>
)
