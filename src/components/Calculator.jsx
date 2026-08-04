import { useEffect, useMemo, useRef, useState } from 'react'
import useWakeLock from '../hooks/useWakeLock.js'
import useCalibration from '../hooks/useCalibration.js'
import playBeep from '../utils/sound.js'

function formatGrams(value) {
  return Number.isInteger(value) ? value : value.toFixed(1)
}

function parseTimeToSeconds(startTime) {
  const [minutes, seconds] = startTime.split(':').map(Number)
  return minutes * 60 + seconds
}

function formatElapsed(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const WARNING_WINDOW_SECONDS = 5

function Calculator({ recipe, onBack, grinders, profiles, saveProfile }) {
  const [people, setPeople] = useState(1)
  const [mlPerPerson, setMlPerPerson] = useState(250)

  const [bean, setBean] = useState('')
  const [clicksByGrinder, setClicksByGrinder] = useState(() =>
    Object.fromEntries(grinders.map((g) => [g.id, ''])),
  )
  const [justSaved, setJustSaved] = useState(false)

  const { calibration, setCalibrationField } = useCalibration(recipe.id, recipe.grind)

  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(null)
  const warnedStepRef = useRef(null)
  const transitionedStepRef = useRef(0)
  const stepRefs = useRef({})

  useWakeLock(isRunning)

  useEffect(() => {
    if (!isRunning) return
    const intervalId = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
    }, 250)
    return () => clearInterval(intervalId)
  }, [isRunning])

  const totalWater = useMemo(() => {
    const p = Number(people) || 0
    const ml = Number(mlPerPerson) || 0
    return p * ml
  }, [people, mlPerPerson])

  const totalCoffee = useMemo(() => {
    if (!recipe.base_ratio) return 0
    return Math.round((totalWater / recipe.base_ratio) * 10) / 10
  }, [totalWater, recipe.base_ratio])

  const beanSuggestions = useMemo(() => [...new Set(profiles.map((p) => p.bean))].sort(), [profiles])

  const matchingProfiles = useMemo(() => {
    const trimmed = bean.trim().toLowerCase()
    if (!trimmed) return []
    return profiles.filter((p) => p.bean.trim().toLowerCase() === trimmed)
  }, [profiles, bean])

  const stepsWithSeconds = useMemo(
    () => recipe.pours.map((pour) => ({ ...pour, seconds: parseTimeToSeconds(pour.start_time) })),
    [recipe.pours],
  )

  const currentStepIndex = useMemo(() => {
    let idx = 0
    stepsWithSeconds.forEach((step, i) => {
      if (elapsed >= step.seconds) idx = i
    })
    return idx
  }, [stepsWithSeconds, elapsed])

  const hasStarted = isRunning || elapsed > 0
  const currentStep = hasStarted ? stepsWithSeconds[currentStepIndex] : null
  const nextStep = stepsWithSeconds[currentStepIndex + 1]
  const secondsToNext = nextStep ? nextStep.seconds - elapsed : null
  const isWarning = isRunning && secondsToNext !== null && secondsToNext > 0 && secondsToNext <= WARNING_WINDOW_SECONDS

  const totalBrewSeconds = stepsWithSeconds.length
    ? stepsWithSeconds[stepsWithSeconds.length - 1].seconds
    : 0
  const progressPct = totalBrewSeconds > 0 ? Math.min(100, (elapsed / totalBrewSeconds) * 100) : 0

  // Keep the active pour step in view while the timer runs.
  useEffect(() => {
    if (!isRunning || !currentStep) return
    stepRefs.current[currentStep.step]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [isRunning, currentStepIndex])

  // Beep once when entering the warning window before the next pour.
  useEffect(() => {
    if (!isWarning || !nextStep) return
    if (warnedStepRef.current === nextStep.step) return
    warnedStepRef.current = nextStep.step
    playBeep(880, 0.15)
  }, [isWarning, nextStep])

  // Beep once when actually transitioning into a new pour step.
  useEffect(() => {
    if (!isRunning) return
    if (currentStepIndex !== transitionedStepRef.current) {
      if (currentStepIndex > 0) playBeep(660, 0.3)
      transitionedStepRef.current = currentStepIndex
    }
  }, [isRunning, currentStepIndex])

  function handleStart() {
    startRef.current = Date.now() - elapsed * 1000
    setIsRunning(true)
  }

  function handlePause() {
    setIsRunning(false)
  }

  function handleReset() {
    setIsRunning(false)
    setElapsed(0)
    warnedStepRef.current = null
    transitionedStepRef.current = 0
  }

  function handleLoadProfile() {
    setClicksByGrinder((prev) => {
      const next = { ...prev }
      matchingProfiles.forEach((p) => {
        next[p.grinderId] = String(p.clicks)
      })
      return next
    })
  }

  function handleSaveGrindProfile() {
    if (!bean.trim()) return
    grinders.forEach((g) => {
      const value = clicksByGrinder[g.id]
      if (value !== '') saveProfile(bean, g.id, value)
    })
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
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
        <h1 className="text-2xl font-bold text-coffee-900 dark:text-coffee-50">{recipe.method}</h1>
        <p className="text-sm text-coffee-500 dark:text-coffee-400">por {recipe.author}</p>
      </header>

      {/* Inputs */}
      <section className="bg-white rounded-xl border border-coffee-100 shadow-sm dark:bg-coffee-900 dark:border-coffee-800 p-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-xs font-medium text-coffee-600 dark:text-coffee-400 mb-1">Personas</span>
            <input
              type="number"
              min="1"
              inputMode="numeric"
              value={people}
              onChange={(e) => setPeople(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full rounded-lg border border-coffee-200 px-3 py-3 text-lg font-semibold text-coffee-900 focus:outline-none focus:ring-2 focus:ring-coffee-400 dark:border-coffee-700 dark:bg-coffee-800 dark:text-coffee-50"
            />
          </label>

          <label className="block">
            <span className="block text-xs font-medium text-coffee-600 dark:text-coffee-400 mb-1">ml por persona</span>
            <input
              type="number"
              min="1"
              inputMode="numeric"
              value={mlPerPerson}
              onChange={(e) => setMlPerPerson(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full rounded-lg border border-coffee-200 px-3 py-3 text-lg font-semibold text-coffee-900 focus:outline-none focus:ring-2 focus:ring-coffee-400 dark:border-coffee-700 dark:bg-coffee-800 dark:text-coffee-50"
            />
          </label>
        </div>
      </section>

      {/* Results */}
      <section className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-coffee-800 text-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-coffee-200">Agua total</p>
          <p className="text-2xl font-bold">{totalWater} ml</p>
        </div>
        <div className="bg-coffee-800 text-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-coffee-200">Café total</p>
          <p className="text-2xl font-bold">{formatGrams(totalCoffee)} g</p>
        </div>
      </section>

      {/* Recipe details */}
      <section className="bg-white rounded-xl border border-coffee-100 shadow-sm dark:bg-coffee-900 dark:border-coffee-800 p-4 mb-4">
        <h2 className="text-sm font-semibold text-coffee-700 dark:text-coffee-200 mb-2">Detalles</h2>
        <div className="flex flex-wrap gap-2 text-xs text-coffee-600 dark:text-coffee-300">
          <span className="rounded-md bg-coffee-50 px-2 py-1 dark:bg-coffee-800">Ratio 1:{recipe.base_ratio}</span>
          <span className="rounded-md bg-coffee-50 px-2 py-1 dark:bg-coffee-800">
            🌡️ {recipe.temperature_c != null ? `${recipe.temperature_c}°C` : 'No especificada'}
          </span>
          <span className="rounded-md bg-coffee-50 px-2 py-1 dark:bg-coffee-800">⚙️ Molienda {recipe.grind.description}</span>
          <span className="rounded-md bg-coffee-50 px-2 py-1 dark:bg-coffee-800">
            Timemore X-Lite: {recipe.grind.timemore_x_lite_clicks ?? 'No registrado'}
          </span>
          <span className="rounded-md bg-coffee-50 px-2 py-1 dark:bg-coffee-800">
            M3 Bomber R3 Pro: {recipe.grind.m3_bomber_r3_pro_clicks ?? 'No registrado'}
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-coffee-100 dark:border-coffee-800">
          <h3 className="text-xs font-semibold text-coffee-600 dark:text-coffee-400 mb-2">
            Registro de calibración
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-medium text-coffee-600 dark:text-coffee-400 mb-1">
                Timemore X-Lite
              </span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="Clics"
                value={calibration.timemore_x_lite_clicks}
                onChange={(e) => setCalibrationField('timemore_x_lite_clicks', e.target.value)}
                className="w-full rounded-lg border border-coffee-200 px-3 py-2 text-coffee-900 focus:outline-none focus:ring-2 focus:ring-coffee-400 dark:border-coffee-700 dark:bg-coffee-800 dark:text-coffee-50"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-coffee-600 dark:text-coffee-400 mb-1">
                M3 Bomber R3 Pro
              </span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="Clics"
                value={calibration.m3_bomber_r3_pro_clicks}
                onChange={(e) => setCalibrationField('m3_bomber_r3_pro_clicks', e.target.value)}
                className="w-full rounded-lg border border-coffee-200 px-3 py-2 text-coffee-900 focus:outline-none focus:ring-2 focus:ring-coffee-400 dark:border-coffee-700 dark:bg-coffee-800 dark:text-coffee-50"
              />
            </label>
          </div>
        </div>
      </section>

      {/* Coffee bean info */}
      {recipe.coffee_bean && (
        <section className="bg-coffee-50 rounded-xl border border-coffee-100 p-4 mb-4 dark:bg-coffee-900/60 dark:border-coffee-800">
          <h2 className="text-sm font-semibold text-coffee-700 dark:text-coffee-200 mb-3">
            Información del grano
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-coffee-500 dark:text-coffee-400">Tostador</p>
              <p className="text-sm font-medium text-coffee-900 dark:text-coffee-50">
                {recipe.coffee_bean.roaster}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-coffee-500 dark:text-coffee-400">Origen</p>
              <p className="text-sm font-medium text-coffee-900 dark:text-coffee-50">
                {recipe.coffee_bean.origin}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-coffee-500 dark:text-coffee-400">Proceso</p>
              <p className="text-sm font-medium text-coffee-900 dark:text-coffee-50">
                {recipe.coffee_bean.process}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-coffee-500 dark:text-coffee-400">Nivel de tueste</p>
              <p className="text-sm font-medium text-coffee-900 dark:text-coffee-50">
                {recipe.coffee_bean.roast_level}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Grind manager quick entry */}
      <section className="bg-white rounded-xl border border-coffee-100 shadow-sm dark:bg-coffee-900 dark:border-coffee-800 p-4 mb-6">
        <h2 className="text-sm font-semibold text-coffee-700 dark:text-coffee-200 mb-2">Molienda</h2>

        <label className="block mb-3">
          <span className="block text-xs font-medium text-coffee-600 dark:text-coffee-400 mb-1">Grano / Café</span>
          <input
            type="text"
            list="calc-bean-suggestions"
            placeholder="Ej. Finca El Paraíso"
            value={bean}
            onChange={(e) => setBean(e.target.value)}
            className="w-full rounded-lg border border-coffee-200 px-3 py-2 text-coffee-900 focus:outline-none focus:ring-2 focus:ring-coffee-400 dark:border-coffee-700 dark:bg-coffee-800 dark:text-coffee-50"
          />
          <datalist id="calc-bean-suggestions">
            {beanSuggestions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </label>

        {matchingProfiles.length > 0 && (
          <button
            type="button"
            onClick={handleLoadProfile}
            className="w-full mb-3 rounded-lg border border-coffee-300 bg-coffee-50 text-coffee-700 text-sm font-medium py-2 active:opacity-70 dark:border-coffee-700 dark:bg-coffee-800 dark:text-coffee-200"
          >
            📥 Cargar perfil guardado de "{bean.trim()}"
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">
          {grinders.map((g) => (
            <label key={g.id} className="block">
              <span className="block text-xs font-medium text-coffee-600 dark:text-coffee-400 mb-1">{g.name}</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="—"
                value={clicksByGrinder[g.id]}
                onChange={(e) =>
                  setClicksByGrinder((prev) => ({ ...prev, [g.id]: e.target.value }))
                }
                className="w-full rounded-lg border border-coffee-200 px-3 py-2 text-coffee-900 focus:outline-none focus:ring-2 focus:ring-coffee-400 dark:border-coffee-700 dark:bg-coffee-800 dark:text-coffee-50"
              />
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSaveGrindProfile}
          disabled={!bean.trim()}
          className="w-full mt-3 rounded-lg bg-coffee-800 text-white font-semibold py-3 active:opacity-80 disabled:opacity-40"
        >
          {justSaved ? '✓ Guardado' : 'Guardar perfil de molienda'}
        </button>
      </section>

      {/* Timer — sticky so it stays visible while scrolling through the pour guide below */}
      <div className="sticky top-0 z-20 -mx-4 px-4 pb-3 pt-2 bg-coffee-50/95 dark:bg-coffee-950/95 backdrop-blur supports-[backdrop-filter]:bg-coffee-50/90 dark:supports-[backdrop-filter]:bg-coffee-950/90">
        <section className="bg-white rounded-xl border border-coffee-100 shadow-md dark:bg-coffee-900 dark:border-coffee-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-coffee-700 dark:text-coffee-200">Cronómetro</h2>
            <div className="flex items-center gap-3">
              {totalBrewSeconds > 0 && (
                <span className="text-xs text-coffee-400 dark:text-coffee-500">
                  Total ~{formatElapsed(totalBrewSeconds)}
                </span>
              )}
              {isRunning && (
                <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  En vivo
                </span>
              )}
            </div>
          </div>

          <p
            className={`text-5xl font-bold tabular-nums text-center mb-1 transition-colors ${
              isWarning ? 'text-amber-500' : 'text-coffee-900 dark:text-coffee-50'
            }`}
          >
            {formatElapsed(elapsed)}
          </p>
          <p className="text-center text-sm text-coffee-500 dark:text-coffee-400 mb-2 h-5">
            {hasStarted
              ? `Fase actual: ${currentStep.name}${isWarning ? ` · siguiente en ${secondsToNext}s` : ''}`
              : 'Presiona Start para comenzar'}
          </p>

          <div className="h-1.5 w-full rounded-full bg-coffee-100 dark:bg-coffee-800 mb-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isWarning ? 'bg-amber-500' : 'bg-coffee-700 dark:bg-coffee-300'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex gap-2">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="flex-1 rounded-lg bg-coffee-800 text-white font-semibold py-3 active:opacity-80 hover:bg-coffee-700 transition-colors"
              >
                {elapsed > 0 ? 'Reanudar' : 'Start'}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex-1 rounded-lg bg-coffee-200 text-coffee-900 font-semibold py-3 active:opacity-80 dark:bg-coffee-700 dark:text-coffee-50"
              >
                Pausar
              </button>
            )}
            <button
              onClick={handleReset}
              className="rounded-lg border border-coffee-200 text-coffee-600 font-semibold py-3 px-4 active:opacity-70 dark:border-coffee-700 dark:text-coffee-400"
            >
              Reiniciar
            </button>
          </div>
        </section>
      </div>

      {/* Pour guide */}
      <section className="mt-4">
        <h2 className="text-sm font-semibold text-coffee-700 dark:text-coffee-200 mb-2 px-1">Guía de vertidos</h2>
        <ol className="space-y-3">
          {stepsWithSeconds.map((pour, i) => {
            const targetWeight = Math.round(totalWater * pour.target_weight_percentage)
            const isActive = hasStarted && i === currentStepIndex
            const isUpcoming = isWarning && nextStep && pour.step === nextStep.step
            const isBypass = pour.name.includes('Bypass')

            return (
              <li
                key={pour.step}
                ref={(el) => {
                  stepRefs.current[pour.step] = el
                }}
                className={`scroll-mt-52 rounded-xl border shadow-sm p-4 flex gap-3 transition-colors ${
                  isUpcoming
                    ? 'bg-amber-50 border-amber-300 animate-pulse dark:bg-amber-950 dark:border-amber-700'
                    : isActive
                      ? 'bg-coffee-800 border-coffee-800 shadow-lg ring-2 ring-coffee-300 dark:ring-coffee-600'
                      : isBypass
                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                        : 'bg-white border-coffee-100 dark:bg-coffee-900 dark:border-coffee-800'
                }`}
              >
                <div
                  className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? 'bg-coffee-700 text-white'
                      : isBypass
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                        : 'bg-coffee-100 text-coffee-800 dark:bg-coffee-800 dark:text-coffee-100'
                  }`}
                >
                  {pour.start_time}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-semibold ${
                        isActive ? 'text-white' : isBypass ? 'text-blue-800 dark:text-blue-200' : 'text-coffee-900 dark:text-coffee-50'
                      }`}
                    >
                      {pour.name}
                    </h3>
                    <span
                      className={`text-sm font-bold ${
                        isActive ? 'text-white' : isBypass ? 'text-blue-700 dark:text-blue-200' : 'text-coffee-700 dark:text-coffee-200'
                      }`}
                    >
                      {targetWeight} g
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${isActive ? 'text-coffee-100' : isBypass ? 'text-blue-600 dark:text-blue-300' : 'text-coffee-500 dark:text-coffee-400'}`}>
                    {pour.description}
                  </p>
                  {isBypass && (
                    <p className="text-xs mt-2 font-medium text-blue-500 dark:text-blue-400">
                      💡 Este paso se sirve directo en la taza/servidor, no sobre la báscula de extracción.
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}

export default Calculator
