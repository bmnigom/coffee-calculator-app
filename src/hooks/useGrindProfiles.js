import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'cafe-app:grind-profiles'

function loadProfiles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function useGrindProfiles() {
  const [profiles, setProfiles] = useState(loadProfiles)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
    } catch {
      // Storage unavailable (e.g. private mode) — profiles stay session-only.
    }
  }, [profiles])

  const saveProfile = useCallback((bean, grinderId, clicks, note = '') => {
    const trimmedBean = bean.trim()
    if (!trimmedBean || clicks === '' || clicks === null) return

    setProfiles((prev) => {
      const existingIndex = prev.findIndex(
        (p) => p.bean.toLowerCase() === trimmedBean.toLowerCase() && p.grinderId === grinderId,
      )
      const entry = {
        id: existingIndex >= 0 ? prev[existingIndex].id : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        bean: trimmedBean,
        grinderId,
        clicks: Number(clicks),
        note: note.trim(),
        updatedAt: new Date().toISOString(),
      }
      if (existingIndex >= 0) {
        const next = [...prev]
        next[existingIndex] = entry
        return next
      }
      return [...prev, entry]
    })
  }, [])

  const deleteProfile = useCallback((id) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return { profiles, saveProfile, deleteProfile }
}

export default useGrindProfiles
