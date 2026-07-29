import { useEffect, useState } from 'react'
import GRINDERS from './data/grinders.js'
import useGrindProfiles from './hooks/useGrindProfiles.js'
import useCustomRecipes from './hooks/useCustomRecipes.js'
import useTheme from './hooks/useTheme.js'
import Home from './components/Home.jsx'
import Calculator from './components/Calculator.jsx'
import GrinderManager from './components/GrinderManager.jsx'
import RecipeForm from './components/RecipeForm.jsx'

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showGrinderManager, setShowGrinderManager] = useState(false)
  const [showRecipeForm, setShowRecipeForm] = useState(false)
  const [baseRecipes, setBaseRecipes] = useState([])
  const [loadingRecipes, setLoadingRecipes] = useState(true)
  const { profiles, saveProfile, deleteProfile } = useGrindProfiles()
  const { customRecipes, addRecipe, deleteRecipe } = useCustomRecipes()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    let cancelled = false

    fetch('/api/recetas')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setBaseRecipes(data)
      })
      .catch(() => {
        if (!cancelled) setBaseRecipes([])
      })
      .finally(() => {
        if (!cancelled) setLoadingRecipes(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const recipes = [...baseRecipes, ...customRecipes]

  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-coffee-50 dark:bg-coffee-950">
        <Calculator
          recipe={selectedRecipe}
          onBack={() => setSelectedRecipe(null)}
          grinders={GRINDERS}
          profiles={profiles}
          saveProfile={saveProfile}
        />
      </div>
    )
  }

  if (showRecipeForm) {
    return (
      <div className="min-h-screen bg-coffee-50 dark:bg-coffee-950">
        <RecipeForm
          onCancel={() => setShowRecipeForm(false)}
          onSave={(recipe) => {
            addRecipe(recipe)
            setShowRecipeForm(false)
          }}
        />
      </div>
    )
  }

  if (showGrinderManager) {
    return (
      <div className="min-h-screen bg-coffee-50 dark:bg-coffee-950">
        <GrinderManager
          grinders={GRINDERS}
          profiles={profiles}
          saveProfile={saveProfile}
          deleteProfile={deleteProfile}
          onBack={() => setShowGrinderManager(false)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-coffee-50 dark:bg-coffee-950">
      <Home
        recipes={recipes}
        loadingRecipes={loadingRecipes}
        onSelectRecipe={setSelectedRecipe}
        onDeleteRecipe={deleteRecipe}
        onNewRecipe={() => setShowRecipeForm(true)}
        onOpenGrinderManager={() => setShowGrinderManager(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </div>
  )
}

export default App
