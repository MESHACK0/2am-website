import { useRef } from 'react'

const CSS = `
@keyframes twinkle {
  0%, 100% { opacity: 0.06; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.2); }
}
`

export default function Stars() {
  const stars = useRef(
    Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.4,
      delay: Math.random() * 6,
      dur: Math.random() * 4 + 4,
    }))
  ).current

  return (
    <>
      <style>{CSS}</style>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        overflow: 'hidden', zIndex: 0,
      }}>
        {stars.map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: '#e8d8b0',
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }} />
        ))}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, #080603 100%)',
        }} />
      </div>
    </>
  )
}
