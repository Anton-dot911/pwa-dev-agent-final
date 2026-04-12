import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { InstallPrompt } from './components/InstallPrompt.jsx'

// Service Worker реєструється автоматично через vite-plugin-pwa (registerType: 'autoUpdate')

const urlParams = new URLSearchParams(window.location.search)
const initialCmd = urlParams.get('cmd')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App initialCmd={initialCmd} />
    <InstallPrompt />
  </React.StrictMode>
)
