import { useState, useEffect } from 'react'

export default function useFadeIn(trigger, delay = 80) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [trigger])
  return visible
}
