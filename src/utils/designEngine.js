// designEngine.js — Design Engine: теми, токени, компоненти
// Phase 4: повна бібліотека UI-систем

// ─── ТЕМИ ────────────────────────────────────────────────────────
export const THEMES = {
  neumorphic: {
    name: 'Neumorphic',
    emoji: '🫧',
    description: "М'який об'єм, тіні всередину і назовні",
    preview: ['#BECAE1', '#d6e4f7', '#a0b3cb'],
    tokens: (base = '#BECAE1') => {
      const r = parseInt(base.slice(1,3),16)
      const g = parseInt(base.slice(3,5),16)
      const b = parseInt(base.slice(5,7),16)
      const light = `rgb(${Math.min(r+26,255)},${Math.min(g+26,255)},${Math.min(b+26,255)})`
      const dark  = `rgb(${Math.max(r-30,0)},${Math.max(g-30,0)},${Math.max(b-30,0)})`
      return {
        '--bg':           base,
        '--shadow-light': light,
        '--shadow-dark':  dark,
        '--text':         '#3a4a5c',
        '--text-muted':   '#7a90a8',
        '--accent':       '#5b8fc9',
        '--success':      '#6bab8e',
        '--danger':       '#c97b7b',
        '--radius':       '14px',
        '--radius-sm':    '8px',
        '--neu-out':      `6px 6px 14px ${dark}, -6px -6px 14px ${light}`,
        '--neu-in':       `inset 4px 4px 10px ${dark}, inset -4px -4px 10px ${light}`,
        '--neu-btn':      `4px 4px 10px ${dark}, -4px -4px 10px ${light}`,
        '--font':         "'DM Sans', 'Segoe UI', sans-serif",
        '--font-mono':    "'JetBrains Mono', monospace",
        '--font-size-base': '15px',
        '--transition':   'all 0.2s ease',
      }
    }
  },
  glassmorphic: {
    name: 'Glassmorphic',
    emoji: '🪟',
    description: 'Скляний ефект, blur, прозорість',
    preview: ['#1a1a2e', '#16213e', '#0f3460'],
    tokens: () => ({
      '--bg':           '#0f0f1a',
      '--glass':        'rgba(255,255,255,0.08)',
      '--glass-border': 'rgba(255,255,255,0.15)',
      '--glass-blur':   'blur(16px)',
      '--text':         '#e8eaf6',
      '--text-muted':   '#9fa8da',
      '--accent':       '#7c4dff',
      '--accent-glow':  'rgba(124,77,255,0.4)',
      '--success':      '#69f0ae',
      '--danger':       '#ff5252',
      '--radius':       '16px',
      '--radius-sm':    '10px',
      '--font':         "'Space Grotesk', 'DM Sans', sans-serif",
      '--font-mono':    "'Fira Code', monospace",
      '--font-size-base': '15px',
      '--transition':   'all 0.25s ease',
      '--shadow':       '0 8px 32px rgba(0,0,0,0.4)',
    })
  },
  flat: {
    name: 'Flat Minimal',
    emoji: '◻️',
    description: 'Чистий мінімалізм, без тіней',
    preview: ['#ffffff', '#f5f5f5', '#1a1a1a'],
    tokens: () => ({
      '--bg':           '#fafafa',
      '--surface':      '#ffffff',
      '--border':       '#e5e7eb',
      '--text':         '#111827',
      '--text-muted':   '#6b7280',
      '--accent':       '#2563eb',
      '--accent-light': '#dbeafe',
      '--success':      '#16a34a',
      '--danger':       '#dc2626',
      '--radius':       '8px',
      '--radius-sm':    '4px',
      '--font':         "'Inter', 'Helvetica Neue', sans-serif",
      '--font-mono':    "'JetBrains Mono', monospace",
      '--font-size-base': '14px',
      '--transition':   'all 0.15s ease',
      '--shadow':       '0 1px 3px rgba(0,0,0,0.08)',
      '--shadow-md':    '0 4px 12px rgba(0,0,0,0.1)',
    })
  },
  brutalist: {
    name: 'Brutalist',
    emoji: '🔩',
    description: 'Грубий, сміливий, без компромісів',
    preview: ['#f5f0e8', '#000000', '#ff3b00'],
    tokens: () => ({
      '--bg':           '#f5f0e8',
      '--surface':      '#ffffff',
      '--border':       '#000000',
      '--border-width': '3px',
      '--text':         '#000000',
      '--text-muted':   '#333333',
      '--accent':       '#ff3b00',
      '--accent-2':     '#0000ff',
      '--success':      '#00aa00',
      '--danger':       '#ff0000',
      '--radius':       '0px',
      '--radius-sm':    '0px',
      '--font':         "'Space Mono', 'Courier New', monospace",
      '--font-mono':    "'Space Mono', monospace",
      '--font-size-base': '15px',
      '--transition':   'none',
      '--shadow':       '4px 4px 0px #000000',
      '--shadow-hover': '6px 6px 0px #000000',
    })
  },
  skeuomorphic: {
    name: 'Skeuomorphic',
    emoji: '🪵',
    description: 'Реалістичні текстури, глибина матеріалів',
    preview: ['#d4a574', '#8B6914', '#2c1a0e'],
    tokens: () => ({
      '--bg':           '#c8a882',
      '--surface':      'linear-gradient(145deg, #d4b896, #b8956a)',
      '--text':         '#2c1a0e',
      '--text-muted':   '#6b4a2a',
      '--accent':       '#8B6914',
      '--accent-light': '#d4a820',
      '--success':      '#4a7c42',
      '--danger':       '#8b2020',
      '--radius':       '10px',
      '--radius-sm':    '6px',
      '--font':         "'Georgia', 'Times New Roman', serif",
      '--font-mono':    "'Courier New', monospace",
      '--font-size-base': '15px',
      '--transition':   'all 0.2s ease',
      '--shadow':       '3px 3px 8px rgba(0,0,0,0.4), -1px -1px 4px rgba(255,255,255,0.2)',
      '--shadow-in':    'inset 2px 2px 6px rgba(0,0,0,0.3), inset -1px -1px 3px rgba(255,255,255,0.15)',
      '--texture':      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23c8a882'/%3E%3Crect x='0' y='0' width='2' height='2' fill='%23d4b896' opacity='0.3'/%3E%3C/svg%3E\")",
    })
  },
}

// ─── КОМПОНЕНТИ ──────────────────────────────────────────────────
export const COMPONENTS = {
  button: {
    name: 'Button',
    emoji: '🔘',
    variants: ['primary', 'secondary', 'danger', 'ghost'],
    generate: (theme) => generateButtonCSS(theme),
  },
  card: {
    name: 'Card',
    emoji: '🃏',
    variants: ['default', 'elevated', 'inset'],
    generate: (theme) => generateCardCSS(theme),
  },
  input: {
    name: 'Input',
    emoji: '✏️',
    variants: ['text', 'search', 'password'],
    generate: (theme) => generateInputCSS(theme),
  },
  modal: {
    name: 'Modal',
    emoji: '🪟',
    variants: ['dialog', 'drawer', 'alert'],
    generate: (theme) => generateModalCSS(theme),
  },
  tabs: {
    name: 'Tabs',
    emoji: '📑',
    variants: ['underline', 'pill', 'boxed'],
    generate: (theme) => generateTabsCSS(theme),
  },
  badge: {
    name: 'Badge',
    emoji: '🏷️',
    variants: ['default', 'dot', 'count'],
    generate: (theme) => generateBadgeCSS(theme),
  },
  avatar: {
    name: 'Avatar',
    emoji: '👤',
    variants: ['circle', 'square', 'group'],
    generate: (theme) => generateAvatarCSS(theme),
  },
  toggle: {
    name: 'Toggle',
    emoji: '🔄',
    variants: ['switch', 'checkbox', 'radio'],
    generate: (theme) => generateToggleCSS(theme),
  },
}

// ─── ГЕНЕРАТОРИ CSS ───────────────────────────────────────────────
function generateButtonCSS(theme) {
  if (theme === 'neumorphic') return `
.btn {
  background: var(--bg);
  border: none;
  border-radius: var(--radius-sm);
  padding: 10px 20px;
  font-size: var(--font-size-base);
  font-family: var(--font);
  font-weight: 600;
  color: var(--text);
  box-shadow: var(--neu-btn);
  cursor: pointer;
  transition: var(--transition);
}
.btn:hover { box-shadow: var(--neu-out); }
.btn:active { box-shadow: var(--neu-in); }
.btn-primary { color: var(--accent); }
.btn-danger  { color: var(--danger); }
.btn-success { color: var(--success); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: var(--neu-in); }`

  if (theme === 'glassmorphic') return `
.btn {
  background: var(--glass);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: 10px 20px;
  font-family: var(--font);
  font-weight: 600;
  color: var(--text);
  backdrop-filter: var(--glass-blur);
  cursor: pointer;
  transition: var(--transition);
}
.btn:hover { background: rgba(255,255,255,0.14); box-shadow: 0 0 20px var(--accent-glow); }
.btn-primary { color: var(--accent); border-color: var(--accent); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }`

  return `
.btn {
  background: var(--accent);
  border: none;
  border-radius: var(--radius-sm);
  padding: 10px 20px;
  font-family: var(--font);
  font-weight: 600;
  color: #fff;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: var(--transition);
}
.btn:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-secondary { background: var(--surface); color: var(--text); border: 1px solid var(--border); }
.btn-ghost { background: transparent; color: var(--accent); box-shadow: none; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }`
}

function generateCardCSS(theme) {
  if (theme === 'neumorphic') return `
.card {
  background: var(--bg);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--neu-out);
}
.card-inset { box-shadow: var(--neu-in); }
.card-header { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 12px; }
.card-body { color: var(--text-muted); line-height: 1.6; }`

  if (theme === 'glassmorphic') return `
.card {
  background: var(--glass);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  padding: 24px;
  backdrop-filter: var(--glass-blur);
  box-shadow: var(--shadow);
}
.card-header { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 12px; }
.card-body { color: var(--text-muted); line-height: 1.6; }`

  return `
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--shadow);
}
.card-elevated { box-shadow: var(--shadow-md); }
.card-header { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 12px; }
.card-body { color: var(--text-muted); line-height: 1.6; }`
}

function generateInputCSS(theme) {
  if (theme === 'neumorphic') return `
.input {
  width: 100%;
  background: var(--bg);
  border: none;
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  font-size: var(--font-size-base);
  font-family: var(--font);
  color: var(--text);
  box-shadow: var(--neu-in);
  outline: none;
  transition: var(--transition);
  box-sizing: border-box;
}
.input::placeholder { color: var(--text-muted); }
.input:focus { box-shadow: var(--neu-in), 0 0 0 2px var(--accent); }`

  return `
.input {
  width: 100%;
  background: var(--surface, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  font-size: var(--font-size-base);
  font-family: var(--font);
  color: var(--text);
  outline: none;
  transition: var(--transition);
  box-sizing: border-box;
}
.input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
.input::placeholder { color: var(--text-muted); }`
}

function generateModalCSS(theme) {
  return `
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}
.modal {
  background: ${theme === 'neumorphic' ? 'var(--bg)' : theme === 'glassmorphic' ? 'rgba(15,15,26,0.85)' : 'var(--surface, #fff)'};
  border-radius: var(--radius);
  padding: 28px 24px;
  width: min(480px, 100%);
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${theme === 'neumorphic' ? 'var(--neu-out)' : theme === 'brutalist' ? '8px 8px 0 #000' : '0 20px 60px rgba(0,0,0,0.3)'};
  ${theme === 'glassmorphic' ? 'border: 1px solid var(--glass-border); backdrop-filter: var(--glass-blur);' : ''}
  animation: slideUp 0.25s ease;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-title { font-size: 18px; font-weight: 700; }
.modal-close { background: none; border: none; cursor: pointer; font-size: 18px; color: var(--text-muted); }`
}

function generateTabsCSS(theme) {
  return `
.tabs { display: flex; gap: 4px; margin-bottom: 20px; }
.tab {
  padding: 8px 16px;
  font-size: 14px;
  font-family: var(--font);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  background: none;
  color: var(--text-muted, #6b7280);
  ${theme === 'neumorphic' ? 'border-radius: var(--radius-sm); background: var(--bg); box-shadow: var(--neu-btn);' : ''}
  ${theme === 'glassmorphic' ? 'border-radius: var(--radius-sm); background: var(--glass); border: 1px solid transparent;' : ''}
  ${theme === 'flat' ? 'border-bottom: 2px solid transparent;' : ''}
  ${theme === 'brutalist' ? 'border: 3px solid transparent;' : ''}
}
.tab.active {
  color: var(--accent);
  ${theme === 'neumorphic' ? 'box-shadow: var(--neu-in);' : ''}
  ${theme === 'glassmorphic' ? 'border-color: var(--accent); background: rgba(124,77,255,0.1);' : ''}
  ${theme === 'flat' ? 'border-bottom-color: var(--accent);' : ''}
  ${theme === 'brutalist' ? 'border-color: #000; background: var(--accent); color: #fff;' : ''}
}
.tab-content { padding: 16px 0; }`
}

function generateBadgeCSS(theme) {
  return `
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  ${theme === 'neumorphic' ? 'background: var(--bg); box-shadow: var(--neu-btn); color: var(--text);' : ''}
  ${theme === 'flat' ? 'background: var(--accent-light); color: var(--accent);' : ''}
  ${theme === 'glassmorphic' ? 'background: var(--glass); border: 1px solid var(--glass-border); color: var(--text);' : ''}
  ${theme === 'brutalist' ? 'background: var(--accent); color: #fff; border: 2px solid #000; border-radius: 0;' : ''}
}
.badge-success { color: var(--success); }
.badge-danger  { color: var(--danger); }`
}

function generateAvatarCSS(theme) {
  return `
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  ${theme === 'neumorphic' ? 'background: var(--bg); box-shadow: var(--neu-out);' : ''}
  ${theme === 'flat' ? 'background: var(--accent-light); color: var(--accent);' : ''}
  ${theme === 'glassmorphic' ? 'background: var(--glass); border: 1px solid var(--glass-border);' : ''}
  ${theme === 'brutalist' ? 'background: var(--accent); border: 3px solid #000; border-radius: 0;' : ''}
}
.avatar-sm { width: 30px; height: 30px; font-size: 12px; }
.avatar-lg { width: 56px; height: 56px; font-size: 22px; }
.avatar-group { display: flex; }
.avatar-group .avatar { margin-left: -10px; border: 2px solid var(--bg, #fff); }`
}

function generateToggleCSS(theme) {
  return `
.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle-slider {
  position: absolute;
  inset: 0;
  border-radius: 13px;
  cursor: pointer;
  transition: var(--transition);
  ${theme === 'neumorphic' ? 'background: var(--bg); box-shadow: var(--neu-in);' : 'background: #ccc;'}
}
.toggle-slider::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  left: 3px;
  top: 3px;
  border-radius: 50%;
  transition: var(--transition);
  ${theme === 'neumorphic' ? 'background: var(--bg); box-shadow: var(--neu-btn);' : 'background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.2);'}
}
.toggle input:checked + .toggle-slider { background: var(--accent); }
.toggle input:checked + .toggle-slider::before { transform: translateX(22px); }`
}

// ─── ГЕНЕРАЦІЯ ПОВНОЇ ТЕМИ ────────────────────────────────────────
export function generateFullTheme(themeKey, baseColor) {
  const theme = THEMES[themeKey]
  if (!theme) return null

  const tokens = theme.tokens(baseColor)
  const cssVars = Object.entries(tokens).map(([k, v]) => `  ${k}: ${v};`).join('\n')

  const allComponents = Object.keys(COMPONENTS)
    .map(k => `/* ── ${COMPONENTS[k].name} ── */\n${COMPONENTS[k].generate(themeKey)}`)
    .join('\n\n')

  return {
    name: theme.name,
    cssVars: `:root {\n${cssVars}\n}`,
    components: allComponents,
    full: `:root {\n${cssVars}\n}\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  background: var(--bg);\n  color: var(--text);\n  font-family: var(--font);\n  font-size: var(--font-size-base);\n  line-height: 1.6;\n}\n\n${allComponents}`,
  }
}

// ─── СИСТЕМНИЙ PROMPT ДЛЯ DESIGN ENGINE ──────────────────────────
export function getDesignSystemPrompt(memory) {
  const themeNames = Object.keys(THEMES).join(', ')
  const componentNames = Object.keys(COMPONENTS).join(', ')

  return `## Design Engine (Phase 4)
Available themes: ${themeNames}
Available components: ${componentNames}
User's preferred theme: ${memory.uiStyle}
User's base color: ${memory.baseColor}

When /theme is requested:
- Generate complete CSS with :root variables + all component styles
- Return as single theme.css file in JSON array format

When /ui is requested:
- Generate standalone React component (.jsx) + its CSS module (.module.css)
- Use user's preferred theme tokens (CSS variables)
- Include all states: default, hover, active, disabled, focus
- Always mobile-first responsive`
}
