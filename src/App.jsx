import { useState } from 'react'
import SelectionScreen from './components/SelectionScreen'
import ProvasModal from './components/ProvasModal'
import BattleAnimation from './components/BattleAnimation'
import WinnerReveal from './components/WinnerReveal'

function App() {
  const [screen, setScreen] = useState('selection')
  const [activeParticipants, setActiveParticipants] = useState([])
  const [provas, setProvas] = useState([])
  const [winner, setWinner] = useState(null)

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
    </div>
  )
}

export default App
