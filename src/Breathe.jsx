const CSS = `
@keyframes orb-breathe {
  0%, 100% { transform: scale(1); box-shadow: 0 0 30px 8px #c8a96e14, 0 0 60px 16px #c8a96e08; }
  50% { transform: scale(1.3); box-shadow: 0 0 50px 16px #c8a96e22, 0 0 100px 32px #c8a96e0c; }
}
@keyframes label-breathe {
  0%, 100% { opacity: 0.3; letter-spacing: 0.22em; }
  50% { opacity: 0.7; letter-spacing: 0.28em; }
}
`

export default function Breathe({ size = 72 }) {
  return (
    <>
      <style>{CSS}</style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{
          width: size, height: size, borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, #e8d8b044, #c8a96e11)',
          border: '1px solid #c8a96e22',
          animation: 'orb-breathe 5s ease-in-out infinite',
        }} />
        <div style={{
          fontSize: 10, color: '#8a7a5a',
          fontFamily: "'DM Mono', monospace", fontWeight: 300,
          animation: 'label-breathe 5s ease-in-out infinite',
          textTransform: 'uppercase',
        }}>
          breathe
        </div>
      </div>
    </>
  )
}
