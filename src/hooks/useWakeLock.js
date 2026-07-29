import { useEffect, useRef } from 'react'

function useWakeLock(active) {
  const wakeLockRef = useRef(null)

  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return

    let cancelled = false

    async function requestLock() {
      try {
        const lock = await navigator.wakeLock.request('screen')
        if (cancelled) {
          lock.release()
          return
        }
        wakeLockRef.current = lock
      } catch {
        // Denied or unsupported in this context — fail silently.
      }
    }

    requestLock()

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') requestLock()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      wakeLockRef.current?.release().catch(() => {})
      wakeLockRef.current = null
    }
  }, [active])
}

export default useWakeLock
