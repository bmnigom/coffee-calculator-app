import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'cafe-app:custom-recipes'

function loadRecipes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents after NFD decomposition
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function useCustomRecipes() {
  const [customRecipes, setCustomRecipes] = useState(loadRecipes)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customRecipes))
    } catch {
      // Storage unavailable (e.g. private mode) — recipes stay session-only.
    }
  }, [customRecipes])

  const addRecipe = useCallback((recipe) => {
    const slug = slugify(recipe.method) || 'receta'
    const entry = {
      ...recipe,
      id: `${slug}-${Date.now()}`,
      isCustom: true,
    }
    setCustomRecipes((prev) => [...prev, entry])
    return entry
  }, [])

  const deleteRecipe = useCallback((id) => {
    setCustomRecipes((prev) => prev.filter((r) => r.id !== id))
  }, [])

  return { customRecipes, addRecipe, deleteRecipe }
}

export default useCustomRecipes
