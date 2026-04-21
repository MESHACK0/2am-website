import { useState, useEffect, useRef } from 'react'
import Stars from './Stars.jsx'
import Breathe from './Breathe.jsx'
import ProgressBar from './ProgressBar.jsx'
import useFadeIn from './useFadeIn.js'
import { STEPS, NOW_RESPONSES, BODY_MAP } from './steps.js'

const SELAR_URL = 'https://selar.com/showlove/2am'
const JOURNAL_KEY = '2am-journal-entries'
const UNLOCKED_KEY = '2am-journal-unlocked'

/* ─── Global CSS ──────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @keyframes moon-pulse {
    0%, 100% { box-shadow: 0 0 40px 10px #c8a96e14, 0 0 80px 20px #c8a96e08; }
    50%       { box-shadow: 0 0 60px 18px #c8a96e20, 0 0 120px 36px #c8a96e0c; }
  }
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 20px 4px #c8a96e18; }
    50%       { box-shadow: 0 0 40px 10px #c8a96e30; }
  }
  .choice-btn {
    width: 100%; padding: 17px 22px; background: #0e0b06;
    border: 1px solid #221a0c; border-radius: 14px; cursor: pointer;
    color: #6a5a3a; font-family: 'EB Garamond', Georgia, serif; font-size: 16px;
    text-align: left; line-height: 1.4;
    transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.18s;
  }
  .choice-btn:hover { background: #181208; border-color: #c8a96e33; color: #b09060; transform: translateX(4px); }
  .choice-btn.selected { background: #1e1508; border-color: #c8a96e66; color: #e8d8b0; transform: translateX(8px); }
  .primary-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px 40px; background: transparent; border: 1px solid #c8a96e44;
    border-radius: 100px; color: #c8a96e; font-family: 'EB Garamond', Georgia, serif;
    font-size: 16px; letter-spacing: 0.04em; cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .primary-btn:hover:not(:disabled) { border-color: #c8a96eaa; color: #e8d8b0; background: #c8a96e0a; }
  .primary-btn:disabled { opacity: 0.25; cursor: not-allowed; }
  .selar-btn {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: 15px 32px; background: linear-gradient(135deg, #1e1508, #2a1e0a);
    border: 1px solid #c8a96e55; border-radius: 100px; color: #e8c87a;
    font-family: 'EB Garamond', Georgia, serif; font-size: 16px; letter-spacing: 0.03em;
    cursor: pointer; text-decoration: none; width: 100%;
    animation: glow-pulse 4s ease-in-out infinite;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
  }
  .selar-btn:hover { border-color: #c8a96eaa; background: linear-gradient(135deg, #2a1e0a, #3a2810); color: #f0e0a0; }
  .ghost-btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 10px 28px; background: transparent; border: 1px solid #1e1408;
    border-radius: 100px; color: #3a2810; font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }
  .ghost-btn:hover { border-color: #3a2810; color: #5a4020; }
  .unlock-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px 32px; background: transparent; border: 1px solid #4a6a4a55;
    border-radius: 100px; color: #7aaa7a; font-family: 'EB Garamond', Georgia, serif;
    font-size: 15px; cursor: pointer; width: 100%;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
  }
  .unlock-btn:hover { border-color: #7aaa7a88; background: #7aaa7a0a; color: #9acc9a; }
  .night-textarea {
    width: 100%; background: #0a0703; border: 1px solid #1e1408; border-radius: 14px;
    padding: 18px 20px; color: #c8b880; font-family: 'EB Garamond', Georgia, serif;
    font-size: 17px; line-height: 1.85; resize: none; outline: none;
    transition: border-color 0.2s; caret-color: #c8a96e;
  }
  .night-textarea:focus { border-color: #c8a96e33; }
  .card { background: #0c0906; border: 1px solid #1e1408; border-radius: 16px; padding: 20px 22px; margin-bottom: 14px; }
  .card-label { font-size: 9px; color: #3a2810; font-family: 'DM Mono', monospace; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; }
  .card-text { font-size: 15px; color: #8a7a52; font-family: 'EB Garamond', Georgia, serif; font-style: italic; line-height: 1.75; }
  .insight-card { background: #120f06; border: 1px solid #c8a96e22; border-radius: 16px; padding: 22px; margin-bottom: 14px; }
  .insight-text { font-size: 16px; color: #a89060; font-family: 'EB Garamond', Georgia, serif; line-height: 1.8; }
  .journal-entry { background: #0c0906; border: 1px solid #1e1408; border-radius: 14px; padding: 18px 20px; margin-bottom: 12px; cursor: pointer; transition: border-color 0.18s, background 0.18s; }
  .journal-entry:hover { border-color: #c8a96e22; background: #0f0b07; }
  .journal-entry.expanded { border-color: #c8a96e33; }
  .nav-tab { flex: 1; padding: 10px 0; background: transparent; border: none; border-bottom: 1px solid #1e1408; color: #3a2810; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: color 0.2s, border-color 0.2s; }
  .nav-tab.active { color: #c8a96e; border-bottom-color: #c8a96e; }
  .nav-tab:hover:not(.active) { color: #6a5830; }
`

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function loadJournal() {
  try { return JSON.parse(localStorage.getItem(JOURNAL_KEY) || '[]') } catch { return [] }
}
function saveJournal(entries) {
  try { localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries)) } catch {}
}
function checkUnlocked() {
  try { return localStorage.getItem(UNLOCKED_KEY) === 'true' } catch { return false }
}
function persistUnlocked() {
  try { localStorage.setItem(UNLOCKED_KEY, 'true') } catch {}
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}
function getCategoryLabel(cat) {
  return { event: 'Something happened', worry: 'Worried about something', loop: 'Thoughts looping', unknown: "Don't know why" }[cat] || cat
}

/* ─── Shell ───────────────────────────────────────────────────────────────── */
function Shell({ children, style = {} }) {
  return (
    <div style={{ minHeight: '100dvh', background: '#080603', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px 48px', position: 'relative', zIndex: 1, ...style }}>
      {children}
    </div>
  )
}

function Fade({ visible, children, maxWidth = 440 }) {
  return (
    <div style={{ opacity: 1, transform: 'translateY(0)', transition: 'opacity 0.65s ease, transform 0.65s ease', width: '100%', maxWidth }}>
      {children}
    </div>
  )
}

/* ─── Landing ─────────────────────────────────────────────────────────────── */
function Landing({ onStart, onJournal, hasJournal }) {
  const visible = useFadeIn('landing', 200)
  const [time, setTime] = useState(() => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })), 10000)
    return () => clearInterval(t)
  }, [])

  return (
    <Shell>
      <Fade visible={visible}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'radial-gradient(circle at 38% 35%, #f0e8c8, #c8a96e55)', marginBottom: 36, animation: 'moon-pulse 6s ease-in-out infinite' }} />
          <div style={{ fontSize: 12, color: '#4a3820', fontFamily: "'DM Mono', monospace", fontWeight: 300, letterSpacing: '0.3em', marginBottom: 28 }}>{time}</div>
          <h1 style={{ fontSize: 38, fontWeight: 400, color: '#e8d8b0', fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.25, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
            You're still awake.
          </h1>
          <p style={{ fontSize: 17, color: '#6a5830', fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.9, margin: '0 0 14px' }}>
            That's okay. Something's on your mind.
          </p>
          <p style={{ fontSize: 17, color: '#4a3820', fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.9, margin: '0 0 48px' }}>
            Let's sit with it for a few minutes.<br />Nothing is saved. Nothing is judged.<br />It disappears when you leave.
          </p>
          <button className="primary-btn" onClick={onStart}>I'm ready</button>
          {hasJournal && (
            <button onClick={onJournal} style={{ marginTop: 20, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#4a3820', fontFamily: "'DM Mono', monospace", letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'underline', textDecorationColor: '#2a1a08' }}>
              View my journal
            </button>
          )}
          <div style={{ marginTop: hasJournal ? 14 : 24, fontSize: 10, color: '#2a1e0a', fontFamily: "'DM Mono', monospace", letterSpacing: '0.14em' }}>
            4 minutes · completely private · no account
          </div>
        </div>
      </Fade>
    </Shell>
  )
}

/* ─── Breathe ─────────────────────────────────────────────────────────────── */
function BreatheScreen({ onNext }) {
  const visible = useFadeIn('breathe', 100)
  return (
    <Shell>
      <ProgressBar value={0.05} />
      <Fade visible={visible}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ fontSize: 18, color: '#8a7850', fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.9, marginBottom: 44 }}>
            Before we start —<br />just one breath.<br />
            <span style={{ color: '#5a4830', fontSize: 15 }}>In for 4. Hold. Out for 6.</span>
          </p>
          <Breathe size={80} />
          <button className="primary-btn" onClick={onNext} style={{ marginTop: 48 }}>Okay, I'm here</button>
        </div>
      </Fade>
    </Shell>
  )
}

/* ─── Choice ──────────────────────────────────────────────────────────────── */
function ChoiceScreen({ step, progress, onAnswer }) {
  const visible = useFadeIn(step.id, 100)
  const [selected, setSelected] = useState(null)
  function pick(val) { setSelected(val); setTimeout(() => onAnswer(val), 420) }
  return (
    <Shell style={{ justifyContent: 'flex-start', paddingTop: 80 }}>
      <ProgressBar value={progress} />
      <Fade visible={visible}>
        <h2 style={{ fontSize: 24, fontWeight: 400, color: '#e8d8b0', fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.4, marginBottom: 12 }}>{step.prompt}</h2>
        {step.sub && <p style={{ fontSize: 14, color: '#4a3820', fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.7, marginBottom: 28 }}>{step.sub}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {step.options.map(opt => (
            <button key={opt.value} className={`choice-btn${selected === opt.value ? ' selected' : ''}`} onClick={() => pick(opt.value)}>{opt.label}</button>
          ))}
        </div>
      </Fade>
    </Shell>
  )
}

/* ─── Write ───────────────────────────────────────────────────────────────── */
function WriteScreen({ step, progress, onAnswer }) {
  const visible = useFadeIn(step.id, 100)
  const [text, setText] = useState('')
  const ref = useRef()
  useEffect(() => { const t = setTimeout(() => ref.current?.focus(), 700); return () => clearTimeout(t) }, [])
  const canContinue = text.trim().length >= (step.minLength || 1)
  function submit() { if (!canContinue) return; onAnswer(text.trim()) }
  return (
    <Shell style={{ justifyContent: 'flex-start', paddingTop: 80 }}>
      <ProgressBar value={progress} />
      <Fade visible={visible}>
        <h2 style={{ fontSize: 24, fontWeight: 400, color: '#e8d8b0', fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.4, marginBottom: 12 }}>{step.prompt}</h2>
        {step.sub && <p style={{ fontSize: 14, color: '#4a3820', fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.7, marginBottom: 24 }}>{step.sub}</p>}
        <textarea ref={ref} className="night-textarea" value={text} onChange={e => setText(e.target.value)}
          placeholder={step.placeholder} rows={5}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit() }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
          <div style={{ fontSize: 10, color: '#2a1a08', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em' }}>
            {text.length > 0 ? `${text.length} chars` : '⌘ + enter to continue'}
          </div>
          <button className="primary-btn" onClick={submit} disabled={!canContinue}>Continue →</button>
        </div>
      </Fade>
    </Shell>
  )
}

/* ─── Reflection ──────────────────────────────────────────────────────────── */
function ReflectionScreen({ answers, onReset, onSaveToJournal, journalUnlocked }) {
  const visible = useFadeIn('reflection', 120)
  const [saved, setSaved] = useState(false)
  const [showUnlock, setShowUnlock] = useState(false)
  const nowText = NOW_RESPONSES[answers.isNow] || NOW_RESPONSES.unsure
  const bodyText = BODY_MAP[answers.bodyLocation] || 'your body'

  function handleSave() {
    if (journalUnlocked) { onSaveToJournal(answers); setSaved(true) }
    else { setShowUnlock(true) }
  }

  function handleUnlockAndSave() {
    persistUnlocked()
    onSaveToJournal(answers)
    setSaved(true)
    setShowUnlock(false)
  }

  return (
    <Shell style={{ justifyContent: 'flex-start', paddingTop: 72, paddingBottom: 80 }}>
      <ProgressBar value={1} />
      <Fade visible={visible}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, #e8d8b044, #c8a96e11)', marginBottom: 20 }} />
          <div style={{ fontSize: 10, color: '#3a2810', fontFamily: "'DM Mono', monospace", letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 10 }}>
            You made it through
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 400, color: '#c8b880', fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.5 }}>
            Here's what you said.
          </h2>
        </div>

        {/* Cards */}
        <div className="card"><div className="card-label">What's on your mind</div><div className="card-text">"{answers.rawThought}"</div></div>
        <div className="card"><div className="card-label">What you're really afraid of</div><div className="card-text">"{answers.trueFear}"</div></div>
        <div className="card"><div className="card-label">Where you feel it</div><div className="card-text" style={{ fontStyle: 'normal', color: '#6a5a3a' }}>You're carrying this in {bodyText}.</div></div>
        <div className="insight-card"><div className="insight-text">{nowText}</div></div>
        <div className="card" style={{ borderColor: '#c8a96e1a' }}><div className="card-label">One thing for tomorrow</div><div className="card-text">"{answers.oneThing}"</div></div>

        {/* Breathe */}
        <div style={{ textAlign: 'center', padding: '28px 0 8px' }}>
          <Breathe size={56} />
          <p style={{ marginTop: 28, fontSize: 17, color: '#6a5830', fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.9 }}>
            You got it out of your head.<br />
            <span style={{ color: '#4a3820' }}>That's all you needed to do tonight.</span>
          </p>
        </div>

        {/* ── DONATE ── */}
        <div style={{ margin: '32px 0 0', padding: '28px 0 24px', borderTop: '1px solid #1a1208', textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#3a2810', fontFamily: "'DM Mono', monospace", letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 14 }}>
            If this helped you tonight
          </div>
          <p style={{ fontSize: 15, color: '#5a4820', fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.8, marginBottom: 22 }}>
            This tool is free and always will be.<br />A small gift keeps it alive.
          </p>
          <a href={SELAR_URL} target="_blank" rel="noopener noreferrer" className="selar-btn">
            ☕ Buy me a coffee
          </a>
          <div style={{ marginTop: 10, fontSize: 10, color: '#2a1808', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em' }}>
            opens selar.com · completely optional
          </div>
        </div>

        {/* ── JOURNAL ── */}
        <div style={{ padding: '24px 0 8px', borderTop: '1px solid #1a1208' }}>

          {!saved && !showUnlock && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#3a2810', fontFamily: "'DM Mono', monospace", letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 14 }}>
                {journalUnlocked ? 'Save this session' : 'Want to remember this?'}
              </div>
              <p style={{ fontSize: 15, color: '#5a4820', fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.8, marginBottom: 20 }}>
                {journalUnlocked
                  ? 'Save to your private journal. Stored only on this device.'
                  : 'Unlock your private journal — track your nights, see patterns, remember your intentions over time.'}
              </p>
              <button className="unlock-btn" onClick={handleSave}>
                {journalUnlocked ? 'Save to journal →' : '✦ Unlock journal'}
              </button>
            </div>
          )}

          {/* Unlock gate */}
          {showUnlock && !saved && (
            <div style={{ background: '#0e0b06', border: '1px solid #2a1e0c', borderRadius: 16, padding: '26px 22px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 14 }}>✦</div>
              <h3 style={{ fontSize: 19, fontWeight: 400, color: '#e8d8b0', fontFamily: "'EB Garamond', Georgia, serif", margin: '0 0 12px' }}>
                Unlock your journal
              </h3>
              <p style={{ fontSize: 14, color: '#6a5830', fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.85, marginBottom: 22 }}>
                Support 2am with any amount — then come back and tap "I've supported" to unlock your journal permanently on this device.
              </p>
              <a href={SELAR_URL} target="_blank" rel="noopener noreferrer" className="selar-btn" style={{ marginBottom: 14 }}>
                ☕ Support on Selar
              </a>
              <button onClick={handleUnlockAndSave} style={{ display: 'block', width: '100%', marginTop: 12, background: 'none', border: '1px solid #2a4a2a', borderRadius: 100, padding: '13px 0', color: '#5a8a5a', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.12em', cursor: 'pointer', textTransform: 'uppercase', transition: 'border-color 0.2s, color 0.2s' }}>
                ✓ I've supported — unlock journal
              </button>
              <button onClick={() => setShowUnlock(false)} style={{ marginTop: 12, background: 'none', border: 'none', color: '#3a2810', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase' }}>
                maybe later
              </button>
            </div>
          )}

          {/* Saved confirm */}
          {saved && (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: 12, color: '#5a8a5a', fontFamily: "'DM Mono', monospace", letterSpacing: '0.14em' }}>✓ saved to your journal</div>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <button className="ghost-btn" onClick={onReset}>Clear everything & close</button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 9, color: '#1e1408', fontFamily: "'DM Mono', monospace", letterSpacing: '0.14em' }}>
          nothing is sent anywhere · your data stays on this device
        </div>

      </Fade>
    </Shell>
  )
}

/* ─── Journal View ────────────────────────────────────────────────────────── */
function JournalView({ entries, onBack, onClearAll }) {
  const visible = useFadeIn('journal', 100)
  const [expanded, setExpanded] = useState(null)
  const [tab, setTab] = useState('entries')
  const [confirmClear, setConfirmClear] = useState(false)

  const categoryCounts = entries.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + 1; return acc }, {})
  const bodyCount = entries.reduce((acc, e) => { acc[e.bodyLocation] = (acc[e.bodyLocation] || 0) + 1; return acc }, {})
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]
  const topBody = Object.entries(bodyCount).sort((a, b) => b[1] - a[1])[0]

  return (
    <Shell style={{ justifyContent: 'flex-start', paddingTop: 60, paddingBottom: 80 }}>
      <div style={{ width: '100%', maxWidth: 440, opacity: 1, transition: 'opacity 0.5s ease' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 400, color: '#e8d8b0', fontFamily: "'EB Garamond', Georgia, serif", margin: 0 }}>Your journal</h2>
            <div style={{ fontSize: 10, color: '#3a2810', fontFamily: "'DM Mono', monospace", letterSpacing: '0.14em', marginTop: 4 }}>
              {entries.length} session{entries.length !== 1 ? 's' : ''} saved
            </div>
          </div>
          <button onClick={onBack} style={{ background: 'none', border: '1px solid #1e1408', borderRadius: 100, padding: '8px 18px', color: '#4a3820', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.12em', cursor: 'pointer', textTransform: 'uppercase' }}>
            ← Back
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: 24 }}>
          <button className={`nav-tab${tab === 'entries' ? ' active' : ''}`} onClick={() => setTab('entries')}>Entries</button>
          <button className={`nav-tab${tab === 'patterns' ? ' active' : ''}`} onClick={() => setTab('patterns')}>Patterns</button>
        </div>

        {/* ENTRIES */}
        {tab === 'entries' && (
          entries.length === 0
            ? <div style={{ textAlign: 'center', padding: '60px 0', color: '#3a2810', fontFamily: "'EB Garamond', Georgia, serif", fontSize: 16 }}>No sessions saved yet.</div>
            : entries.slice().reverse().map(entry => (
              <div key={entry.id} className={`journal-entry${expanded === entry.id ? ' expanded' : ''}`} onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 13, color: '#c8a96e', fontFamily: "'EB Garamond', Georgia, serif", marginBottom: 4 }}>{formatDate(entry.id)}</div>
                    <div style={{ fontSize: 11, color: '#4a3820', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em' }}>
                      {formatTime(entry.id)} · {getCategoryLabel(entry.category)}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: '#2a1808', fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{expanded === entry.id ? '▲' : '▼'}</div>
                </div>
                {expanded === entry.id && (
                  <div style={{ marginTop: 18, borderTop: '1px solid #1e1408', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                      { label: "What was on your mind", val: entry.rawThought, color: '#8a7a52' },
                      { label: "The real fear", val: entry.trueFear, color: '#8a7a52' },
                      { label: "One thing for tomorrow", val: entry.oneThing, color: '#7aaa7a' },
                    ].map(({ label, val, color }) => (
                      <div key={label}>
                        <div style={{ fontSize: 9, color: '#3a2810', fontFamily: "'DM Mono', monospace", letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
                        <div style={{ fontSize: 14, color, fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic', lineHeight: 1.7 }}>"{val}"</div>
                      </div>
                    ))}
                    <div style={{ fontSize: 12, color: '#3a2810', fontFamily: "'EB Garamond', Georgia, serif" }}>
                      Felt in: {BODY_MAP[entry.bodyLocation] || entry.bodyLocation}
                    </div>
                  </div>
                )}
              </div>
            ))
        )}

        {/* PATTERNS */}
        {tab === 'patterns' && (
          entries.length < 2
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: '#3a2810', fontFamily: "'EB Garamond', Georgia, serif", fontSize: 15, lineHeight: 1.8 }}>Save at least 2 sessions<br />to start seeing patterns.</div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {topCategory && (
                  <div className="insight-card">
                    <div className="card-label">Most common trigger</div>
                    <div className="insight-text">{getCategoryLabel(topCategory[0])}</div>
                    <div style={{ fontSize: 11, color: '#4a3820', fontFamily: "'DM Mono', monospace", marginTop: 8 }}>{topCategory[1]} of {entries.length} sessions</div>
                  </div>
                )}

                {topBody && (
                  <div className="insight-card">
                    <div className="card-label">Where you most carry it</div>
                    <div className="insight-text">{BODY_MAP[topBody[0]] || topBody[0]}</div>
                    <div style={{ fontSize: 11, color: '#4a3820', fontFamily: "'DM Mono', monospace", marginTop: 8 }}>{topBody[1]} of {entries.length} sessions</div>
                  </div>
                )}

                <div className="card">
                  <div className="card-label">What keeps you up</div>
                  {Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                    <div key={cat} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 13, color: '#8a7a52', fontFamily: "'EB Garamond', Georgia, serif" }}>{getCategoryLabel(cat)}</span>
                        <span style={{ fontSize: 11, color: '#4a3820', fontFamily: "'DM Mono', monospace" }}>{count}×</span>
                      </div>
                      <div style={{ height: 3, background: '#1a1408', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${(count / entries.length) * 100}%`, background: 'linear-gradient(90deg, #5a3a10, #c8a96e)', borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <div className="card-label">Recent intentions</div>
                  {entries.slice(-5).reverse().map(e => (
                    <div key={e.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #1a1208' }}>
                      <div style={{ fontSize: 10, color: '#3a2810', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', marginBottom: 4 }}>{formatDate(e.id)}</div>
                      <div style={{ fontSize: 14, color: '#7aaa7a', fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic', lineHeight: 1.6 }}>"{e.oneThing}"</div>
                    </div>
                  ))}
                </div>

              </div>
        )}

        {/* Clear all */}
        {entries.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            {!confirmClear
              ? <button onClick={() => setConfirmClear(true)} style={{ background: 'none', border: 'none', color: '#2a1808', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.12em', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: '#1a1008', textTransform: 'uppercase' }}>delete all entries</button>
              : <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button onClick={() => { onClearAll(); setConfirmClear(false) }} style={{ background: 'none', border: '1px solid #4a1808', borderRadius: 100, padding: '8px 20px', color: '#8a3020', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase' }}>yes, delete all</button>
                  <button onClick={() => setConfirmClear(false)} style={{ background: 'none', border: '1px solid #1e1408', borderRadius: 100, padding: '8px 20px', color: '#3a2810', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase' }}>cancel</button>
                </div>
            }
          </div>
        )}

      </div>
    </Shell>
  )
}

/* ─── App ─────────────────────────────────────────────────────────────────── */
export default function App() {
  const [phase, setPhase] = useState('landing')
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [journal, setJournal] = useState(() => loadJournal())
  const [journalUnlocked, setJournalUnlocked] = useState(() => checkUnlocked())

  function startFlow() { setPhase('flow'); setStepIndex(0) }

  function handleAnswer(value) {
    const step = STEPS[stepIndex]
    const newAnswers = step.key ? { ...answers, [step.key]: value } : answers
    setAnswers(newAnswers)
    const next = stepIndex + 1
    if (next >= STEPS.length) setPhase('done')
    else setStepIndex(next)
  }

  function saveToJournal(ans) {
    const entry = { id: new Date().toISOString(), ...ans }
    const updated = [...journal, entry]
    setJournal(updated)
    saveJournal(updated)
    if (!journalUnlocked) { persistUnlocked(); setJournalUnlocked(true) }
  }

  function reset() { setAnswers({}); setPhase('landing'); setStepIndex(0) }

  const step = STEPS[stepIndex]
  const progress = phase === 'flow' ? (stepIndex + 1) / STEPS.length : phase === 'done' ? 1 : 0

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Stars />

      {phase === 'landing' && <Landing onStart={startFlow} onJournal={() => setPhase('journal')} hasJournal={journal.length > 0 && journalUnlocked} />}

      {phase === 'flow' && step && (
        <>
          {step.type === 'breathe' && <BreatheScreen onNext={() => handleAnswer(null)} />}
          {step.type === 'choice' && <ChoiceScreen step={step} progress={progress} onAnswer={handleAnswer} />}
          {step.type === 'write' && <WriteScreen step={step} progress={progress} onAnswer={handleAnswer} />}
        </>
      )}

      {phase === 'done' && (
        <ReflectionScreen answers={answers} onReset={reset} onSaveToJournal={saveToJournal} journalUnlocked={journalUnlocked} />
      )}

      {phase === 'journal' && (
        <JournalView entries={journal} onBack={() => setPhase('landing')} onClearAll={() => { setJournal([]); saveJournal([]) }} />
      )}
    </>
  )
}
