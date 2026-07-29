import { useState } from 'react'

const TIME_PATTERN = /^\d{1,2}:\d{2}$/

function emptyPour() {
  return { name: '', start_time: '', percentage: '', description: '' }
}

function RecipeForm({ onSave, onCancel }) {
  const [method, setMethod] = useState('')
  const [author, setAuthor] = useState('')
  const [coffeeG, setCoffeeG] = useState('')
  const [waterG, setWaterG] = useState('')
  const [temperature, setTemperature] = useState('')
  const [grindDescription, setGrindDescription] = useState('')
  const [pours, setPours] = useState([emptyPour()])
  const [error, setError] = useState('')

  const ratio =
    Number(coffeeG) > 0 && Number(waterG) > 0 ? (Number(waterG) / Number(coffeeG)).toFixed(1) : null

  function updatePour(index, field, value) {
    setPours((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)))
  }

  function addPour() {
    setPours((prev) => [...prev, emptyPour()])
  }

  function removePour(index) {
    setPours((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!method.trim() || !author.trim()) {
      setError('Completa el método y el autor de la receta.')
      return
    }
    if (!(Number(coffeeG) > 0) || !(Number(waterG) > 0) || !(Number(temperature) > 0)) {
      setError('Café, agua y temperatura deben ser números mayores a 0.')
      return
    }
    if (pours.length === 0) {
      setError('Agrega al menos un paso de vertido.')
      return
    }
    for (const pour of pours) {
      if (!pour.name.trim()) {
        setError('Cada paso necesita un nombre.')
        return
      }
      if (!TIME_PATTERN.test(pour.start_time.trim())) {
        setError(`El tiempo de inicio de "${pour.name}" debe tener el formato m:ss (ej. 0:45).`)
        return
      }
      const pct = Number(pour.percentage)
      if (!(pct > 0) || pct > 100) {
        setError(`El porcentaje acumulado de "${pour.name}" debe estar entre 1 y 100.`)
        return
      }
    }

    const recipe = {
      method: method.trim(),
      author: author.trim(),
      base_ratio: Number(ratio),
      base_coffee_g: Number(coffeeG),
      base_water_g: Number(waterG),
      temperature_c: Number(temperature),
      grind: {
        description: grindDescription.trim() || 'Media',
        timemore_x_lite_clicks: null,
        m3_bomber_r3_pro_clicks: null,
      },
      pours: pours.map((p, i) => ({
        step: i + 1,
        name: p.name.trim(),
        start_time: p.start_time.trim(),
        target_weight_percentage: Number(p.percentage) / 100,
        description: p.description.trim(),
      })),
    }

    onSave(recipe)
  }

  const inputClass =
    'w-full rounded-lg border border-coffee-200 px-3 py-2 text-coffee-900 focus:outline-none focus:ring-2 focus:ring-coffee-400 dark:border-coffee-700 dark:bg-coffee-800 dark:text-coffee-50'
  const labelClass = 'block text-xs font-medium text-coffee-600 dark:text-coffee-400 mb-1'

  return (
    <div className="max-w-md mx-auto px-4 pb-10">
      <button
        onClick={onCancel}
        className="flex items-center gap-1 text-coffee-600 py-4 text-sm font-medium active:opacity-60 dark:text-coffee-400"
      >
        ← Cancelar
      </button>

      <header className="mb-4">
        <h1 className="text-2xl font-bold text-coffee-900 dark:text-coffee-50">Nueva receta</h1>
        <p className="text-sm text-coffee-500 dark:text-coffee-400">
          Crea tu propia receta con sus pasos de vertido
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <section className="bg-white rounded-lg border border-coffee-100 shadow-sm dark:bg-coffee-900 dark:border-coffee-800 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={labelClass}>Método</span>
              <input
                type="text"
                placeholder="Ej. Prensa francesa"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Autor</span>
              <input
                type="text"
                placeholder="Tu nombre"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={labelClass}>Café base (g)</span>
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={coffeeG}
                onChange={(e) => setCoffeeG(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Agua base (ml)</span>
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={waterG}
                onChange={(e) => setWaterG(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={labelClass}>Temperatura (°C)</span>
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Molienda</span>
              <input
                type="text"
                placeholder="Ej. Media-gruesa"
                value={grindDescription}
                onChange={(e) => setGrindDescription(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          {ratio && (
            <p className="text-xs text-coffee-500 dark:text-coffee-400">Ratio calculado: 1:{ratio}</p>
          )}
        </section>

        <section className="bg-white rounded-lg border border-coffee-100 shadow-sm dark:bg-coffee-900 dark:border-coffee-800 p-4">
          <h2 className="text-sm font-semibold text-coffee-700 dark:text-coffee-200 mb-3">
            Pasos de vertido
          </h2>

          <div className="space-y-4">
            {pours.map((pour, i) => (
              <div
                key={i}
                className="rounded-lg border border-coffee-100 dark:border-coffee-800 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-coffee-500 dark:text-coffee-400">
                    Paso {i + 1}
                  </span>
                  {pours.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePour(i)}
                      aria-label={`Eliminar paso ${i + 1}`}
                      className="text-coffee-400 hover:text-red-500 active:opacity-60 text-lg leading-none px-1 dark:text-coffee-500"
                    >
                      ×
                    </button>
                  )}
                </div>

                <label className="block">
                  <span className={labelClass}>Nombre</span>
                  <input
                    type="text"
                    placeholder="Ej. Bloom"
                    value={pour.name}
                    onChange={(e) => updatePour(i, 'name', e.target.value)}
                    className={inputClass}
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className={labelClass}>Inicio (m:ss)</span>
                    <input
                      type="text"
                      placeholder="0:00"
                      value={pour.start_time}
                      onChange={(e) => updatePour(i, 'start_time', e.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>% acumulado de agua</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      inputMode="numeric"
                      placeholder="100"
                      value={pour.percentage}
                      onChange={(e) => updatePour(i, 'percentage', e.target.value)}
                      className={inputClass}
                    />
                  </label>
                </div>

                <label className="block">
                  <span className={labelClass}>Descripción</span>
                  <input
                    type="text"
                    placeholder="Ej. Verter en el centro con movimientos circulares."
                    value={pour.description}
                    onChange={(e) => updatePour(i, 'description', e.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addPour}
            className="w-full mt-3 rounded-lg border border-dashed border-coffee-300 text-coffee-600 text-sm font-medium py-2 active:opacity-70 dark:border-coffee-600 dark:text-coffee-300"
          >
            + Agregar paso
          </button>
        </section>

        {error && <p className="text-sm text-red-600 dark:text-red-400 px-1">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-coffee-800 text-white font-semibold py-3 active:opacity-80"
        >
          Guardar receta
        </button>
      </form>
    </div>
  )
}

export default RecipeForm
