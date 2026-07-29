import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'cafe-app:calibration'

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function useCalibration(recipeId, defaults) {
  const [all, setAll] = useState(loadAll)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    } catch {
      // Storage unavailable (e.g. private mode) — calibration stays session-only.
    }
  }, [all])

  const saved = all[recipeId] ?? {}
  const calibration = {
    timemore_x_lite_clicks: saved.timemore_x_lite_clicks ?? defaults.timemore_x_lite_clicks ?? '',
    m3_bomber_r3_pro_clicks: saved.m3_bomber_r3_pro_clicks ?? defaults.m3_bomber_r3_pro_clicks ?? '',
  }

  const setCalibrationField = useCallback(
    (field, value) => {
      setAll((prev) => ({
        ...prev,
        [recipeId]: { ...prev[recipeId], [field]: value },
      }))
    },
    [recipeId],
  )

  return { calibration, setCalibrationField }
}

export default useCalibration
