// Singleton de gerenciamento de áudio
// Todos os arquivos devem estar em /public/audio/

let initialized = false
let bgMusic = null
let bgVol = 0.35

const sfx = {}   // efeitos one-shot (usam cloneNode para sobreposição)
const loops = {} // efeitos em loop contínuo

function safeAudio(src, { loop = false, volume = 0.8 } = {}) {
  const a = new Audio()
  a.src = src
  a.loop = loop
  a.volume = volume
  a.preload = 'auto'
  return a
}

export function init() {
  if (initialized) return
  initialized = true

  bgMusic = safeAudio('/audio/background.mp3', { loop: true, volume: bgVol })

  sfx['toggle']              = safeAudio('/audio/toggle.mp3',              { volume: 0.55 })
  sfx['card-enter']          = safeAudio('/audio/card-enter.mp3',          { volume: 0.65 })
  sfx['thunder']             = safeAudio('/audio/thunder.mp3',             { volume: 0.85 })
  sfx['elimination-crowd']   = safeAudio('/audio/elimination-crowd.mp3',   { volume: 0.70 })
  sfx['card-out']            = safeAudio('/audio/card-out.mp3',            { volume: 0.80 })
  sfx['celebration-small']   = safeAudio('/audio/celebration-small.mp3',   { volume: 0.80 })
  sfx['confetti']            = safeAudio('/audio/confetti.mp3',            { volume: 0.70 })

  loops['crowd-battle'] = safeAudio('/audio/crowd-battle.mp3', { loop: true, volume: 0.45 })
  loops['drums']        = safeAudio('/audio/drums.mp3',        { loop: true, volume: 0.55 })
  loops['applause']     = safeAudio('/audio/applause.mp3',     { loop: true, volume: 0.70 })
}

export function startBg() {
  if (!bgMusic) return
  bgMusic.play().catch(() => {})
}

export function setBgVolume(vol) {
  bgVol = Math.max(0, Math.min(1, vol))
  if (bgMusic) bgMusic.volume = bgVol
}

export function getBgVolume() {
  return bgVol
}

export function play(key) {
  const source = sfx[key]
  if (!source) return
  try {
    const clone = source.cloneNode()
    clone.volume = source.volume
    clone.play().catch(() => {})
  } catch {}
}

export function startLoop(key) {
  const a = loops[key]
  if (!a) return
  a.currentTime = 0
  a.play().catch(() => {})
}

export function stopLoop(key) {
  const a = loops[key]
  if (!a) return
  a.pause()
  a.currentTime = 0
}

export function fadeOutLoop(key, duration = 1200) {
  const a = loops[key]
  if (!a || a.paused) return
  const startVol = a.volume
  const steps = 24
  const stepMs = duration / steps
  let step = 0
  const id = setInterval(() => {
    step++
    a.volume = Math.max(0, startVol * (1 - step / steps))
    if (step >= steps) {
      clearInterval(id)
      a.pause()
      a.currentTime = 0
      a.volume = startVol
    }
  }, stepMs)
}

export function stopAllLoops() {
  Object.values(loops).forEach((a) => {
    a.pause()
    a.currentTime = 0
  })
}
