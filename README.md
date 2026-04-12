# 🤖 PWA Dev Agent — Production Ready

AI-powered PWA developer assistant. Chat з Claude API, Design Engine, ZIP generator.

---

## ⚡ Швидкий старт (локально)

```bash
git clone <your-repo>
cd pwa-dev-agent
npm install
cp .env.example .env
# Вставити VITE_ANTHROPIC_API_KEY у .env
npm run dev
```

Відкрити: http://localhost:5173

---

## 🚀 Деплой на Netlify

### Спосіб 1 — Через UI (рекомендовано)

1. Push проєкту на GitHub
2. netlify.com → **Add new site → Import from Git**
3. Обрати репозиторій
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Site settings → Environment variables:**
   ```
   ANTHROPIC_API_KEY = sk-ant-...
   ```
6. **Deploy site** → готово 🎉

### Спосіб 2 — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set ANTHROPIC_API_KEY sk-ant-...
netlify deploy --prod
```

---

## 🔐 Безпека

| Середовище | API Ключ | Механізм |
|---|---|---|
| **Production** | `ANTHROPIC_API_KEY` | Netlify Environment → Function |
| **Development** | `VITE_ANTHROPIC_API_KEY` | `.env` (локально, не в git) |

- У production API ключ **ніколи не потрапляє у браузер**
- Всі запити проходять через `/.netlify/functions/claude`
- `.env` файл у `.gitignore`

---

## 📁 Структура

```
pwa-dev-agent/
├── netlify/
│   └── functions/
│       └── claude.js          ← API проксі (ключ прихований)
├── public/
│   ├── manifest.json          ← PWA маніфест
│   ├── sw.js                  ← Service Worker
│   ├── offline.html           ← Офлайн сторінка
│   └── icons/                 ← PWA іконки (72-512px)
├── src/
│   ├── App.jsx                ← Головний чат
│   ├── hooks/
│   │   └── useMemory.js       ← Persistent пам'ять
│   ├── utils/
│   │   ├── streamChat.js      ← SSE стримінг
│   │   ├── buildSystemPrompt.js
│   │   ├── zipGenerator.js    ← ZIP збірка
│   │   └── designEngine.js    ← 5 тем × 8 компонентів
│   └── components/
│       ├── MessageBubble.jsx
│       ├── MemoryPanel.jsx    ← /memory
│       ├── FileExplorer.jsx   ← ZIP перегляд
│       ├── ThemePreview.jsx   ← /design
│       └── InstallPrompt.jsx  ← PWA install banner
├── netlify.toml
├── vite.config.js
└── .env.example
```

---

## 🎮 Команди

| Команда | Дія |
|---|---|
| `/new [опис]` | Повний проєкт → FileExplorer → ZIP |
| `/ui [компонент]` | React компонент + CSS Module |
| `/theme [назва]` | Повна CSS тема з токенами |
| `/pwa` | Додати PWA шар |
| `/refactor [код]` | Покращити код |
| `/design` | Відкрити Design Engine |
| `/memory` | Переглянути профіль розробника |
| `/clear` | Очистити чат |

---

## 🧩 Design Engine

5 тем: `neumorphic` · `glassmorphic` · `flat` · `brutalist` · `skeuomorphic`

8 компонентів: Button · Card · Input · Modal · Tabs · Badge · Avatar · Toggle

---

## 📋 Phases

- **Phase 1** ✅ Chat · Streaming · Markdown · Memory
- **Phase 2** ✅ /memory панель · buildSystemPrompt
- **Phase 3** ✅ FileExplorer · ZIP Generator
- **Phase 4** ✅ Design Engine · ThemePreview
- **Phase 5** ✅ PWA · Netlify Function · Security Headers · InstallPrompt
