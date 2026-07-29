function RecipeCard({ recipe, onSelect, onDelete }) {
  return (
    <div className="relative">
      <button
        onClick={() => onSelect(recipe)}
        className="w-full text-left bg-white rounded-lg border border-coffee-100 shadow-sm p-5 active:scale-[0.98] transition-transform hover:shadow-md dark:bg-coffee-900 dark:border-coffee-800"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-coffee-900 dark:text-coffee-50">
              {recipe.method}
              {recipe.isCustom && (
                <span className="ml-2 align-middle rounded-full bg-coffee-100 text-coffee-600 text-[10px] font-medium px-2 py-0.5 dark:bg-coffee-800 dark:text-coffee-300">
                  Tuya
                </span>
              )}
            </h2>
            <p className="text-sm text-coffee-500 dark:text-coffee-400">por {recipe.author}</p>
          </div>
          <span className="shrink-0 rounded-full bg-coffee-100 text-coffee-700 text-xs font-medium px-3 py-1 dark:bg-coffee-800 dark:text-coffee-200">
            1:{recipe.base_ratio}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-coffee-600 dark:text-coffee-300">
          <span className="rounded-md bg-coffee-50 px-2 py-1 dark:bg-coffee-800">☕ {recipe.base_coffee_g}g</span>
          <span className="rounded-md bg-coffee-50 px-2 py-1 dark:bg-coffee-800">💧 {recipe.base_water_g}ml</span>
          <span className="rounded-md bg-coffee-50 px-2 py-1 dark:bg-coffee-800">🌡️ {recipe.temperature_c}°C</span>
          <span className="rounded-md bg-coffee-50 px-2 py-1 dark:bg-coffee-800">⚙️ {recipe.grind.description}</span>
        </div>
      </button>

      {onDelete && (
        <button
          onClick={() => onDelete(recipe)}
          aria-label={`Eliminar receta ${recipe.method}`}
          className="absolute -top-2 -right-2 rounded-full w-7 h-7 flex items-center justify-center bg-white border border-coffee-200 shadow-sm text-coffee-400 hover:text-red-500 active:opacity-60 text-lg leading-none dark:bg-coffee-900 dark:border-coffee-700 dark:text-coffee-500"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default RecipeCard
