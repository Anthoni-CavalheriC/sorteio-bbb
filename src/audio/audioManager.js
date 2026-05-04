// Singleton de gerenciamento de áudio
// Todos os arquivos devem estar em /public/audio/

let initialized = false
let bgMusic = null
let bgVol = 0.35
let sfxVol = 0.8

const sfx = {}   // efeitos one-shot (usam cloneNode para sobreposição)
const loops = {} // efeitos em loop contínuo

function safeAudio(src, { loop = false, volume = 0.8 } = {}) {
  const a = new Audio()
  a.src = src
  a.loop = loop
  a.volume = volume
  a.preload = 'auto'
  a.addEventListener('error', () => console.warn(`[Audio] Arquivo não encontrado: ${src}`))
  return a
}

export function init() {
  if (initialized) return
  initialized = true

  bgMusic = safeAudio('/audio/background.mp3', { loop: true, volume: bgVol })

  sfx['toggle-on']           = safeAudio('/audio/toggle-on.mp3',           { volume: 0.55 })
  sfx['toggle-off']          = safeAudio('/audio/toggle-off.mp3',          { volume: 0.55 })
  sfx['card-enter']          = safeAudio('/audio/card-enter.mp3',          { volume: 0.65 })
  sfx['thunder']             = safeAudio('/audio/thunder.mp3',             { volume: 0.85 })
  sfx['elimination-crowd-1'] = safeAudio('/audio/elimination-crowd-1.mp3', { volume: 0.70 })
  sfx['elimination-crowd-2'] = safeAudio('/audio/elimination-crowd-2.mp3', { volume: 0.70 })
  sfx['elimination-crowd-3'] = safeAudio('/audio/elimination-crowd-3.mp3', { volume: 0.70 })
  sfx['celebration-small']   = safeAudio('/audio/celebration-small.mp3',   { volume: 0.80 })
  sfx['confetti']            = safeAudio('/audio/confetti.mp3',            { volume: 0.70 })
  sfx['victory']             = safeAudio('/audio/victory.mp3',             { volume: 0.90 })

  loops['crowd-battle'] = safeAudio('/audio/crowd-battle.mp3', { loop: true, volume: 0.12 })
  loops['drums']        = safeAudio('/audio/drums.mp3',        { loop: true, volume: 0.85 })
  loops['applause']     = safeAudio('/audio/applause.mp3',     { loop: false, volume: 0.70 })
}

export function stopBg() {
  if (!bgMusic) return
  bgMusic.pause()
  bgMusic.currentTime = 0
}

export function startBg() {
  if (!bgMusic) return Promise.resolve()
  return bgMusic.play().catch((e) => {
    console.warn('[Audio] Erro ao tocar background:', e.message)
    throw e
  })
}

export function setBgVolume(vol) {
  bgVol = Math.max(0, Math.min(1, vol))
  if (bgMusic) bgMusic.volume = bgVol
}

export function getBgVolume() {
  return bgVol
}

export function setSfxVolume(vol) {
  sfxVol = Math.max(0, Math.min(1, vol))
  // Atualiza volume de todos os loops ativos
  Object.values(loops).forEach((a) => {
    a.volume = sfxVol
  })
}

export function getSfxVolume() {
  return sfxVol
}

export function play(key) {
  const source = sfx[key]
  if (!source) return
  try {
    const clone = source.cloneNode()
    clone.volume = source.volume * sfxVol
    clone.play().catch(() => {})
  } catch {}
}

export function startLoop(key) {
  const a = loops[key]
  if (!a) return
  a.volume = sfxVol
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

// Toca applause uma vez e reinicia a música de fundo ~2.5s antes de acabar
export function playApplauseOnce() {
  const a = loops['applause']
  if (!a) return () => {}

  a.currentTime = 0
  a.volume = sfxVol

  const onTimeUpdate = () => {
    if (a.duration && a.currentTime >= a.duration - 2.5) {
      a.removeEventListener('timeupdate', onTimeUpdate)
      startBg()
    }
  }

  const onEnded = () => {
    a.removeEventListener('timeupdate', onTimeUpdate)
    a.removeEventListener('ended', onEnded)
  }

  a.addEventListener('timeupdate', onTimeUpdate)
  a.addEventListener('ended', onEnded)
  a.play().catch(() => {})

  return () => {
    a.removeEventListener('timeupdate', onTimeUpdate)
    a.removeEventListener('ended', onEnded)
    a.pause()
    a.currentTime = 0
  }
}

export function stopAllLoops() {
  Object.values(loops).forEach((a) => {
    a.pause()
    a.currentTime = 0
  })
}
