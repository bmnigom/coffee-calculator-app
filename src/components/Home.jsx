import RecipeCard from './RecipeCard.jsx'

// Orden lógico de los grupos de métodos. `match` agrupa variantes de un mismo
// método (p.ej. "Aeropress" y "Aeropress (Invertida)") bajo un mismo título.
const METHOD_GROUPS = [
  { label: 'V60', match: (method) => method === 'V60' },
  { label: 'Aeropress', match: (method) => method.startsWith('Aeropress') },
  { label: 'Hario Switch', match: (method) => method.startsWith('Hario Switch') || method.startsWith('Switch') },
  { label: 'Kalita Wave', match: (method) => method.startsWith('Kalita') },
  { label: 'Hario Pegasus', match: (method) => method.startsWith('Hario Pegasus') || method.startsWith('Pegasus') },
]

function groupRecipesByMethod(recipes) {
  const groups = METHOD_GROUPS.map((g) => ({ ...g, recipes: [] }))
  const other = { label: 'Otros métodos', recipes: [] }

  recipes.forEach((recipe) => {
    const group = groups.find((g) => g.match(recipe.method))
    ;(group ?? other).recipes.push(recipe)
  })

  return [...groups, other].filter((g) => g.recipes.length > 0)
}

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
        <div className="space-y-6">
          {groupRecipesByMethod(recipes).map((group) => (
            <section key={group.label}>
              <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-coffee-400 dark:text-coffee-500">
                {group.label}
              </h2>
              <div className="space-y-3">
                {group.recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onSelect={onSelectRecipe}
                    onDelete={recipe.isCustom ? () => onDeleteRecipe(recipe.id) : undefined}
                  />
                ))}
              </div>
            </section>
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
