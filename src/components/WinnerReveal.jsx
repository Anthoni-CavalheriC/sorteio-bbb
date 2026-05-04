import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { play, playApplauseOnce, startBg } from '../audio/audioManager'

function WinnerReveal({ winner, onReset }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true)
      fireConfetti()
      play('victory')
      play('confetti')
      setTimeout(() => play('confetti'), 700)
    }, 400)

    const stopApplause = playApplauseOnce()

    return () => {
      clearTimeout(t)
      stopApplause()
      startBg() // garante que a música volta ao sair da tela
    }
  }, [])

  const fireConfetti = () => {
    const gold = '#ffd700'
    const darkGold = '#c9a84c'
    const white = '#ffffff'

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { x: 0.5, y: 0.6 },
      colors: [gold, darkGold, white],
      startVelocity: 45,
      gravity: 0.8,
      scalar: 1.1,
    })

    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { x: 0.2, y: 0.7 },
        colors: [gold, darkGold],
        startVelocity: 35,
        angle: 70,
      })
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { x: 0.8, y: 0.7 },
        colors: [gold, darkGold],
        startVelocity: 35,
        angle: 110,
      })
    }, 400)
  }

  return (
    <div className="winner-screen">
      <div className="winner-rays" />
      <div className="winner-glow" />

      <div className={`winner-content ${visible ? 'visible' : ''}`}>
        <span className="winner-eyebrow">Novo</span>
        <span className="winner-label">LÍDER DA SEMANA</span>

        <div className="winner-photo-ring">
          <img
            src={winner.photo}
            alt={winner.name}
            className="winner-photo"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(winner.name)}&background=1a1a1a&color=c9a84c&bold=true&size=300`
            }}
          />
        </div>

        <div className="winner-crown">👑</div>
        <h1 className="winner-name">{winner.name}</h1>
        <p className="winner-profession">{winner.profession}</p>

        <button className="reset-btn" onClick={onReset}>
          NOVO SORTEIO
        </button>
      </div>
    </div>
  )
}

export default WinnerReveal
