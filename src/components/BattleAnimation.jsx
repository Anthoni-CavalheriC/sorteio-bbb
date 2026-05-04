import { useState, useEffect, useRef } from 'react'

const PHASE = {
  ENTERING: 'entering',
  SHAKING: 'shaking',
  ELIMINATING: 'eliminating',
}

const ENTER_DURATION = 2500
const SHAKE_DURATION = 8000
const SHAKE_INTERVAL = 1900

// p = participante completo { name, pronoun, ... }
// pronoun: 'm' | 'f' — usa ?. para compatibilidade com participantes antigos sem pronome
const isFem = (p) => p?.pronoun === 'f'
const o = (p) => isFem(p) ? 'a' : 'o'
const no = (p) => isFem(p) ? 'na' : 'no'
const do_ = (p) => isFem(p) ? 'da' : 'do'
const bravo = (p) => isFem(p) ? 'brava' : 'bravo'
const eliminado = (p) => isFem(p) ? 'eliminada' : 'eliminado'
const abduzido = (p) => isFem(p) ? 'abduzida' : 'abduzido'
const superado = (p) => isFem(p) ? 'superada' : 'superado'
const concentrado = (p) => isFem(p) ? 'concentrada' : 'concentrado'
const hulk = (p) => isFem(p) ? 'She-Hulk' : 'Hulk'
const bancoElim = (p) => isFem(p) ? 'banco das eliminadas' : 'banco dos eliminados'

const SHAKE_TEMPLATES = [
  (p, prova) => `🔥 ${p.name} está dominando na prova de ${prova}!`,
  (p, prova) => `💪 ${p.name} não para na prova de ${prova}!`,
  (p, prova) => `⚡ ${p.name} dá tudo na prova de ${prova}!`,
  (p, prova) => `😤 ${p.name} segura firme na prova de ${prova}!`,
  (p, prova) => `🎯 ${p.name} foca total na prova de ${prova}!`,
  (p, prova) => `🚀 ${p.name} acelera na prova de ${prova}!`,
  (p, prova) => `😤 ${p.name} não desiste de ${prova}!`,
  (p, prova) => `🔥 ${p.name} impressiona na prova de ${prova}!`,
  (p, prova) => `🤯 ${p.name} tá deixando todo mundo em choque na prova de ${prova}!`,
  (p, prova) => `💀 ${p.name} tá destruindo na prova de ${prova}!`,
  (p, prova) => `😤 ${p.name} bufando, mas segurando na prova de ${prova}!`,
  (p, prova) => `😰 ${p.name} suando frio, mas aguentando na prova de ${prova}!`,
  (p, prova) => `👀 Todo mundo de olho ${no(p)} ${p.name} na prova de ${prova}!`,
  (p, prova) => `💪 ${p.name} parece ${o(p)} ${hulk(p)} na prova de ${prova}!`,
  (p, prova) => `🎭 ${p.name} sofrendo, mas não desiste na prova de ${prova}!`,
  (p, prova) => `😱 ${p.name} parece uma máquina na prova de ${prova}!`,
  (p, prova) => `🎯 ${p.name} tá ${concentrado(p)} demais na prova de ${prova}!`,
  (p, prova) => `🦾 ${p.name} parece que foi feito pra ${prova}!`,
]

const ELIM_TEMPLATES = [
  (p, prova) => `💥 ${p.name} caiu na prova de ${prova}!`,
  (p, prova) => `😵 ${p.name} não aguentou a prova de ${prova}!`,
  (p, prova) => `❌ ${p.name} foi ${eliminado(p)} na prova de ${prova}!`,
  (p, prova) => `😭 ${p.name} desabou feio na prova de ${prova}!`,
  (p, prova) => `🤣 ${p.name} voou rapidinho na prova de ${prova}!`,
  (p, prova) => `💀 ${p.name} foi pro beleléu na prova de ${prova}!`,
  (p, prova) => `🚪 ${p.name} deu tchau e sumiu na prova de ${prova}!`,
  (p, prova) => `🛸 ${p.name} foi ${abduzido(p)} em plena prova de ${prova}!`,
  (p, prova) => `🎭 ${p.name} fez um drama e caiu na prova de ${prova}!`,
  (p, prova) => `👋 Tchau, ${p.name}! ${prova} não perdoa!`,
  (p, prova) => `🫡 ${p.name} tentou muito, mas a prova de ${prova} foi impiedosa!`,
  (p, prova) => `😤 ${p.name} ficou ${bravo(p)}, mas a prova de ${prova} venceu!`,
  (p, prova) => `🪑 ${p.name} foi direto pro ${bancoElim(p)} depois da prova de ${prova}!`,
  (p, prova) => `😓 ${p.name} deu tudo, mas foi ${superado(p)} na prova de ${prova}!`,
  (p, prova) => `🙈 ${p.name} preferiu nem lembrar ${do_(p)} que aconteceu na prova de ${prova}!`,
]

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function BattleAnimation({ participants, provas, onComplete }) {
  const [phase, setPhase] = useState(PHASE.ENTERING)
  const [eliminated, setEliminated] = useState(new Set())
  const [highlighted, setHighlighted] = useState(null)
  const [beingEliminated, setBeingEliminated] = useState(null)
  const [showTitle, setShowTitle] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const [survivorCount, setSurvivorCount] = useState(participants.length)
  const [commentary, setCommentary] = useState(null)
  const [commentaryKey, setCommentaryKey] = useState(0)

  const winner = useRef(
    participants[Math.floor(Math.random() * participants.length)]
  )
  const toEliminate = useRef(
    [...participants]
      .filter((p) => p.id !== winner.current.id)
      .sort(() => Math.random() - 0.5)
  )
  const timeouts = useRef([])

  const addTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay)
    timeouts.current.push(id)
    return id
  }

  const showCommentary = (text) => {
    setCommentary(text)
    setCommentaryKey((k) => k + 1)
  }

  useEffect(() => {
    addTimeout(() => setShowTitle(true), 600)

    addTimeout(() => {
      setPhase(PHASE.SHAKING)
      setShowFlash(true)
      setTimeout(() => setShowFlash(false), 600)

      let i = 0
      const maxMessages = Math.floor(SHAKE_DURATION / SHAKE_INTERVAL) - 1
      const cycleCommentary = () => {
        const p = randomItem(participants)
        const prova = randomItem(provas)
        const template = randomItem(SHAKE_TEMPLATES)
        showCommentary(template(p, prova))
        i++
        if (i < maxMessages) addTimeout(cycleCommentary, SHAKE_INTERVAL)
      }
      addTimeout(cycleCommentary, 400)
    }, ENTER_DURATION)

    addTimeout(() => {
      setPhase(PHASE.ELIMINATING)
      startEliminating()
    }, ENTER_DURATION + SHAKE_DURATION)

    return () => timeouts.current.forEach(clearTimeout)
  }, [])

  const startEliminating = () => {
    let index = 0

    const next = () => {
      if (index >= toEliminate.current.length) {
        const w = winner.current
        showCommentary(`👑 ${w.name} é ${w.pronoun === 'f' ? 'a nova' : 'o novo'} LÍDER!`)
        addTimeout(() => onComplete(w), 2000)
        return
      }

      const victim = toEliminate.current[index]
      const prova = randomItem(provas)
      const template = randomItem(ELIM_TEMPLATES)

      showCommentary(template(victim, prova))
      addTimeout(() => setHighlighted(victim.id), 400)

      addTimeout(() => {
        setHighlighted(null)
        setBeingEliminated(victim.id)

        addTimeout(() => {
          setEliminated((prev) => new Set([...prev, victim.id]))
          setBeingEliminated(null)
          setSurvivorCount(toEliminate.current.length - index)
          index++
          addTimeout(next, 900)
        }, 1200)
      }, 1800)
    }

    addTimeout(next, 800)
  }

  return (
    <div className={`battle-screen phase-${phase}`}>
      <div className="battle-bg" />
      <div className={`battle-flash ${showFlash ? 'flash-active' : ''}`} />

      <div className="battle-header">
        <div className={`battle-title ${showTitle ? 'visible' : ''}`}>
          ⚡ PROVA DO LÍDER ⚡
        </div>
        <div className={`battle-subtitle ${showTitle ? 'visible' : ''}`}>
          {phase === PHASE.ELIMINATING
            ? `${survivorCount} sobrevivente${survivorCount !== 1 ? 's' : ''}`
            : 'Que comecem os jogos'}
        </div>
      </div>

      {commentary && (
        <div key={commentaryKey} className="commentary-box">
          {commentary}
        </div>
      )}

      <div className="battle-grid">
        {participants.map((p, i) => {
          const isEliminated = eliminated.has(p.id)
          const isHighlighted = highlighted === p.id
          const isBeingEliminated = beingEliminated === p.id

          return (
            <div
              key={p.id}
              className={[
                'battle-card',
                isHighlighted ? 'highlighted' : '',
                isBeingEliminated ? 'being-eliminated' : '',
                isEliminated ? 'eliminated' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ '--delay': `${i * 0.1}s` }}
            >
              <div className="battle-card-photo">
                <img
                  src={p.photo}
                  alt={p.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=1a1a1a&color=c9a84c&bold=true&size=200`
                  }}
                />
              </div>
              <span className="battle-card-name">{p.name}</span>

              <div className={`ko-overlay ${isBeingEliminated ? 'show' : ''}`}>
                ELIMINADO
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BattleAnimation
