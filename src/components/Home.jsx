import RecipeCard from './RecipeCard.jsx'

function Home({
  recipes,
  loadingRecipes,
  onSelectRecipe,
  onDeleteRecipe,
  onNewRecipe,
  onOpenGrinderManager,
  theme,
  toggleTheme,
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-coffee-900 dark:text-coffee-50">☕ Recetas de Café</h1>
          <p className="text-sm text-coffee-500 dark:text-coffee-300">Elige un método para calcular tu receta</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="rounded-lg border border-coffee-200 bg-white px-3 py-2 text-sm shadow-sm active:opacity-70 dark:border-coffee-700 dark:bg-coffee-900"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={onOpenGrinderManager}
            className="rounded-lg border border-coffee-200 bg-white px-3 py-2 text-sm font-medium text-coffee-700 shadow-sm active:opacity-70 dark:border-coffee-700 dark:bg-coffee-900 dark:text-coffee-200"
          >
            ⚙️ Molinos
          </button>
        </div>
      </header>

      {loadingRecipes ? (
        <p className="text-center text-sm text-coffee-500 dark:text-coffee-400 py-8">
          Cargando recetas...
        </p>
      ) : (
        <div className="space-y-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={onSelectRecipe}
              onDelete={recipe.isCustom ? () => onDeleteRecipe(recipe.id) : undefined}
            />
          ))}
        </div>
      )}

      <button
        onClick={onNewRecipe}
        className="mt-4 w-full rounded-lg border border-dashed border-coffee-300 py-3 text-sm font-medium text-coffee-600 active:opacity-70 dark:border-coffee-600 dark:text-coffee-300"
      >
        + Nueva receta
      </button>
    </div>
  )
}

export default Home
