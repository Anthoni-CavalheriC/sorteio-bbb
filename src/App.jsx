import { useState, useEffect, useRef } from 'react'
import { init, startBg } from './audio/audioManager'
import SelectionScreen from './components/SelectionScreen'
import ProvasModal from './components/ProvasModal'
import BattleAnimation from './components/BattleAnimation'
import WinnerReveal from './components/WinnerReveal'
import VolumeControl from './components/VolumeControl'

function App() {
  const [screen, setScreen] = useState('selection')
  const [activeParticipants, setActiveParticipants] = useState([])
  const [provas, setProvas] = useState([])
  const [winner, setWinner] = useState(null)
  const bgStarted = useRef(false)

  useEffect(() => {
    init()

    // Tenta autoplay após 2s
    const autoTimer = setTimeout(() => {
      startBg().then(() => {
        bgStarted.current = true
      }).catch(() => {
        // Bloqueado pelo navegador — aguarda clique
      })
    }, 2000)

    // Fallback: inicia no primeiro clique caso autoplay tenha falhado
    const handleFirstClick = () => {
      if (!bgStarted.current) {
        bgStarted.current = true
        startBg()
      }
      document.removeEventListener('click', handleFirstClick)
    }
    document.addEventListener('click', handleFirstClick)

    return () => {
      clearTimeout(autoTimer)
      document.removeEventListener('click', handleFirstClick)
    }
  }, [])

  const handleRequestStart = (participants) => {
    setActiveParticipants(participants)
    setScreen('provas')
  }

  const handleStartBattle = (selectedProvas) => {
    setProvas(selectedProvas)
    setScreen('battle')
  }

  const handleComplete = (w) => {
    setWinner(w)
    setScreen('winner')
  }

  const handleReset = () => {
    setScreen('selection')
    setWinner(null)
    setProvas([])
  }

  return (
    <div className="app">
      {screen === 'selection' && <SelectionScreen onStart={handleRequestStart} />}

      {screen === 'provas' && (
        <>
          <SelectionScreen onStart={handleRequestStart} />
          <ProvasModal
            onStart={handleStartBattle}
            onClose={() => setScreen('selection')}
          />
        </>
      )}

      {screen === 'battle' && (
        <BattleAnimation
          participants={activeParticipants}
          provas={provas}
          onComplete={handleComplete}
        />
      )}

      {screen === 'winner' && <WinnerReveal winner={winner} onReset={handleReset} />}

      <VolumeControl />
    </div>
  )
}

export default App
