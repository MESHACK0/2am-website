export default function ProgressBar({ value }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: 1.5, background: '#120f07', zIndex: 100,
    }}>
      <div style={{
        height: '100%',
        width: `${value * 100}%`,
        background: 'linear-gradient(90deg, #5a3a10, #c8a96e)',
        transition: 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 0 8px #c8a96e55',
      }} />
    </div>
  )
}
