let sharedContext = null

function playBeep(frequency = 880, duration = 0.15) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return
    sharedContext ??= new AudioContextClass()
    if (sharedContext.state === 'suspended') sharedContext.resume()

    const oscillator = sharedContext.createOscillator()
    const gain = sharedContext.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.001, sharedContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.25, sharedContext.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, sharedContext.currentTime + duration)

    oscillator.connect(gain)
    gain.connect(sharedContext.destination)
    oscillator.start()
    oscillator.stop(sharedContext.currentTime + duration)
  } catch {
    // Web Audio unsupported or blocked — fail silently.
  }
}

export default playBeep
