import { useMemo, useState } from 'react'

function grinderName(grinders, grinderId) {
  return grinders.find((g) => g.id === grinderId)?.name ?? grinderId
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('es', { day: '2-digit', month: 'short' })
}

function GrinderManager({ grinders, profiles, saveProfile, deleteProfile, onBack }) {
  const [bean, setBean] = useState('')
  const [grinderId, setGrinderId] = useState(grinders[0].id)
  const [clicks, setClicks] = useState('')
  const [note, setNote] = useState('')

  const beanSuggestions = useMemo(
    () => [...new Set(profiles.map((p) => p.bean))].sort(),
    [profiles],
  )

  const groupedByBean = useMemo(() => {
    const groups = new Map()
    for (const profile of profiles) {
      if (!groups.has(profile.bean)) groups.set(profile.bean, [])
      groups.get(profile.bean).push(profile)
    }
    return [...groups.entries()]
      .map(([beanName, entries]) => ({
        bean: beanName,
        entries: [...entries].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
        latestUpdate: entries.reduce((max, e) => (e.updatedAt > max ? e.updatedAt : max), entries[0].updatedAt),
      }))
      .sort((a, b) => b.latestUpdate.localeCompare(a.latestUpdate))
  }, [profiles])

  function handleSubmit(e) {
    e.preventDefault()
    if (!bean.trim() || clicks === '') return
    saveProfile(bean, grinderId, clicks, note)
    setClicks('')
    setNote('')
  }

  return (
    <div className="max-w-md mx-auto px-4 pb-10">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-coffee-600 py-4 text-sm font-medium active:opacity-60 dark:text-coffee-400"
      >
        ← Volver a recetas
      </button>

      <header className="mb-4">
        <h1 className="text-2xl font-bold text-coffee-900 dark:text-coffee-50">⚙️ Gestor de Molinos</h1>
        <p className="text-sm text-coffee-500 dark:text-coffee-400">Guarda tus clics de molienda por grano</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-coffee-100 shadow-sm dark:bg-coffee-900 dark:border-coffee-800 p-4 mb-4 space-y-3"
      >
        <label className="block">
          <span className="block text-xs font-medium text-coffee-600 dark:text-coffee-400 mb-1">Grano / Café</span>
          <input
            type="text"
            list="bean-suggestions"
            placeholder="Ej. Finca El Paraíso"
            value={bean}
            onChange={(e) => setBean(e.target.value)}
            className="w-full rounded-lg border border-coffee-200 px-3 py-2 text-coffee-900 focus:outline-none focus:ring-2 focus:ring-coffee-400 dark:border-coffee-700 dark:bg-coffee-800 dark:text-coffee-50"
          />
          <datalist id="bean-suggestions">
            {beanSuggestions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-xs font-medium text-coffee-600 dark:text-coffee-400 mb-1">Molino</span>
            <select
              value={grinderId}
              onChange={(e) => setGrinderId(e.target.value)}
              className="w-full rounded-lg border border-coffee-200 px-3 py-2 text-coffee-900 focus:outline-none focus:ring-2 focus:ring-coffee-400 dark:border-coffee-700 dark:bg-coffee-800 dark:text-coffee-50"
            >
              {grinders.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-medium text-coffee-600 dark:text-coffee-400 mb-1">Clics</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={clicks}
              onChange={(e) => setClicks(e.target.value)}
              className="w-full rounded-lg border border-coffee-200 px-3 py-2 text-coffee-900 focus:outline-none focus:ring-2 focus:ring-coffee-400 dark:border-coffee-700 dark:bg-coffee-800 dark:text-coffee-50"
            />
          </label>
        </div>

        <label className="block">
          <span className="block text-xs font-medium text-coffee-600 dark:text-coffee-400 mb-1">Nota (opcional)</span>
          <input
            type="text"
            placeholder="Ej. un poco más grueso que la última vez"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-lg border border-coffee-200 px-3 py-2 text-coffee-900 focus:outline-none focus:ring-2 focus:ring-coffee-400 dark:border-coffee-700 dark:bg-coffee-800 dark:text-coffee-50"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-lg bg-coffee-800 text-white font-semibold py-3 active:opacity-80"
        >
          Guardar perfil
        </button>
      </form>

      <section>
        <h2 className="text-sm font-semibold text-coffee-700 dark:text-coffee-200 mb-2 px-1">Perfiles guardados</h2>

        {groupedByBean.length === 0 ? (
          <p className="text-sm text-coffee-500 dark:text-coffee-400 px-1">Aún no has guardado ningún perfil de molienda.</p>
        ) : (
          <div className="space-y-3">
            {groupedByBean.map(({ bean: beanName, entries }) => (
              <div key={beanName} className="bg-white rounded-xl border border-coffee-100 shadow-sm dark:bg-coffee-900 dark:border-coffee-800 p-4">
                <h3 className="font-semibold text-coffee-900 dark:text-coffee-50 mb-2">{beanName}</h3>
                <ul className="space-y-2">
                  {entries.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-center justify-between gap-2 rounded-md bg-coffee-50 dark:bg-coffee-800 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-coffee-800 dark:text-coffee-100">
                          {grinderName(grinders, entry.grinderId)}
                        </p>
                        <p className="text-xs text-coffee-500 dark:text-coffee-400">
                          {entry.clicks} clics · {formatDate(entry.updatedAt)}
                          {entry.note && ` · ${entry.note}`}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteProfile(entry.id)}
                        aria-label={`Eliminar perfil de ${beanName} en ${grinderName(grinders, entry.grinderId)}`}
                        className="shrink-0 text-coffee-400 hover:text-red-500 active:opacity-60 text-lg leading-none px-2 dark:text-coffee-500"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default GrinderManager
