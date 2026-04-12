import { useState } from 'react'

const B = '#BECAE1', SL = '#d6e4f7', SD = '#a0b3cb', T = '#3a4a5c', AC = '#5b8fc9', DG = '#c97b7b', GR = '#6bab8e'
const neu = (i=false) => i ? `inset 4px 4px 10px ${SD},inset -4px -4px 10px ${SL}` : `6px 6px 14px ${SD},-6px -6px 14px ${SL}`

export function MemoryPanel({ memory, onSave, onClose }) {
  const [local, setLocal] = useState({ ...memory })
  const [newStack, setNewStack] = useState('')
  const [newRule, setNewRule] = useState('')
  const [saved, setSaved] = useState(false)

  const set = (k, v) => setLocal(p => ({ ...p, [k]: v }))

  const handleSave = () => {
    onSave(local)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addStack = () => {
    const t = newStack.trim()
    if (!t || local.stack.includes(t)) return
    setLocal(p => ({ ...p, stack: [...p.stack, t] }))
    setNewStack('')
  }

  const addRule = () => {
    const t = newRule.trim()
    if (!t || local.rules.includes(t)) return
    setLocal(p => ({ ...p, rules: [...p.rules, t] }))
    setNewRule('')
  }

  const s = {
    overlay: { position:'fixed', inset:0, background:'rgba(140,160,185,0.5)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'16px' },
    panel: { background:B, borderRadius:'24px', boxShadow:`12px 12px 28px ${SD},-12px -12px 28px ${SL}`, width:'min(560px,100%)', maxHeight:'88vh', overflowY:'auto', padding:'28px 24px', color:T, fontFamily:"'DM Sans',sans-serif" },
    hdr: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' },
    title: { fontSize:'18px', fontWeight:'700', display:'flex', alignItems:'center', gap:'8px' },
    closeBtn: { background:B, border:'none', borderRadius:'50%', width:'34px', height:'34px', cursor:'pointer', boxShadow:neu(), color:T, fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center' },
    sec: { marginBottom:'20px' },
    lbl: { fontSize:'10px', fontWeight:'700', letterSpacing:'1.2px', textTransform:'uppercase', color:AC, marginBottom:'8px', display:'block' },
    input: { width:'100%', background:B, border:'none', borderRadius:'10px', padding:'9px 13px', fontSize:'13px', color:T, boxShadow:neu(true), outline:'none', boxSizing:'border-box' },
    sel: { width:'100%', background:B, border:'none', borderRadius:'10px', padding:'9px 13px', fontSize:'13px', color:T, boxShadow:neu(true), outline:'none', appearance:'none', cursor:'pointer', boxSizing:'border-box' },
    grid2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' },
    tagRow: { display:'flex', flexWrap:'wrap', gap:'7px' },
    tag: { background:B, boxShadow:neu(), borderRadius:'20px', padding:'5px 11px', fontSize:'12px', display:'flex', alignItems:'center', gap:'5px', color:T },
    tagX: { background:'none', border:'none', cursor:'pointer', color:DG, fontWeight:'700', fontSize:'14px', lineHeight:1, padding:0 },
    addRow: { display:'flex', gap:'8px', marginTop:'8px' },
    addIn: { flex:1, background:B, border:'none', borderRadius:'10px', padding:'7px 11px', fontSize:'12px', color:T, boxShadow:neu(true), outline:'none' },
    addBtn: { background:B, border:'none', borderRadius:'10px', padding:'7px 13px', fontSize:'12px', fontWeight:'700', color:AC, boxShadow:neu(), cursor:'pointer' },
    projCard: { background:B, boxShadow:neu(), borderRadius:'12px', padding:'10px 14px', marginBottom:'8px', display:'flex', justifyContent:'space-between', gap:'10px' },
    footer: { display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'20px', paddingTop:'16px', borderTop:`1px solid ${SD}` },
    btnRed: { background:B, border:'none', borderRadius:'12px', padding:'9px 16px', fontSize:'12px', fontWeight:'600', color:DG, boxShadow:neu(), cursor:'pointer' },
    btnGreen: { background:B, border:'none', borderRadius:'12px', padding:'10px 20px', fontSize:'13px', fontWeight:'700', color:GR, boxShadow:neu(), cursor:'pointer' },
  }

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.panel}>
        <div style={s.hdr}>
          <div style={s.title}><span>🧠</span><span>Профіль розробника</span></div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={s.sec}>
          <span style={s.lbl}>Основне</span>
          <div style={s.grid2}>
            <div><span style={s.lbl}>Ім'я</span><input style={s.input} value={local.name} onChange={e=>set('name',e.target.value)}/></div>
            <div><span style={s.lbl}>Рівень</span>
              <select style={s.sel} value={local.experience} onChange={e=>set('experience',e.target.value)}>
                {['junior','mid','senior'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div style={s.sec}>
          <span style={s.lbl}>Стек</span>
          <div style={s.tagRow}>
            {local.stack.map(st=>(
              <div key={st} style={s.tag}>{st}<button style={s.tagX} onClick={()=>setLocal(p=>({...p,stack:p.stack.filter(x=>x!==st)}))}>×</button></div>
            ))}
          </div>
          <div style={s.addRow}>
            <input style={s.addIn} placeholder="Додати технологію..." value={newStack} onChange={e=>setNewStack(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addStack()}/>
            <button style={s.addBtn} onClick={addStack}>+ Додати</button>
          </div>
        </div>

        <div style={s.sec}>
          <span style={s.lbl}>UI System</span>
          <div style={s.grid2}>
            <div><span style={s.lbl}>Стиль</span>
              <select style={s.sel} value={local.uiStyle} onChange={e=>set('uiStyle',e.target.value)}>
                {['neumorphic','glassmorphic','flat','skeuomorphic','brutalist'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div><span style={s.lbl}>Тіні</span>
              <select style={s.sel} value={local.shadowDepth} onChange={e=>set('shadowDepth',e.target.value)}>
                {['subtle','medium','deep'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div style={{...s.addRow, marginTop:'10px', alignItems:'center'}}>
            <input type="color" value={local.baseColor} onChange={e=>set('baseColor',e.target.value)} style={{width:'34px',height:'34px',borderRadius:'8px',border:'none',cursor:'pointer',boxShadow:neu()}}/>
            <input style={{...s.addIn, fontFamily:'monospace'}} value={local.baseColor} onChange={e=>set('baseColor',e.target.value)}/>
            <div style={{width:'44px',height:'34px',borderRadius:'8px',background:local.baseColor,boxShadow:`3px 3px 7px rgba(0,0,0,0.15),-3px -3px 7px rgba(255,255,255,0.55)`}}/>
          </div>
        </div>

        <div style={s.sec}>
          <span style={s.lbl}>Правила генерації</span>
          {local.rules.map(r=>(
            <div key={r} style={{...s.tag, borderRadius:'10px', marginBottom:'6px', justifyContent:'space-between'}}>
              <span style={{fontSize:'12px'}}>• {r}</span>
              <button style={s.tagX} onClick={()=>setLocal(p=>({...p,rules:p.rules.filter(x=>x!==r)}))}>×</button>
            </div>
          ))}
          <div style={s.addRow}>
            <input style={s.addIn} placeholder="Нове правило..." value={newRule} onChange={e=>setNewRule(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addRule()}/>
            <button style={s.addBtn} onClick={addRule}>+ Додати</button>
          </div>
        </div>

        <div style={s.sec}>
          <span style={s.lbl}>Попередні проєкти</span>
          {local.projects.map(p=>(
            <div key={p.id} style={s.projCard}>
              <div>
                <div style={{fontWeight:'700',fontSize:'13px',marginBottom:'2px'}}>{p.name}</div>
                <div style={{fontSize:'11px',color:'#7a90a8'}}>{p.stack.join(', ')} · {p.description}</div>
              </div>
              <button style={{...s.tagX,fontSize:'18px',marginTop:'2px'}} onClick={()=>setLocal(p2=>({...p2,projects:p2.projects.filter(x=>x.id!==p.id)}))}>×</button>
            </div>
          ))}
        </div>

        <div style={s.footer}>
          <button style={s.btnRed} onClick={()=>{if(window.confirm('Скинути?')){onSave({...DEFAULT_MEMORY});onClose()}}}>↺ Скинути</button>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            {saved && <span style={{fontSize:'12px',color:GR,fontWeight:'600'}}>✓ Збережено</span>}
            <button style={s.btnGreen} onClick={handleSave}>Зберегти ✓</button>
          </div>
        </div>
      </div>
    </div>
  )
}
