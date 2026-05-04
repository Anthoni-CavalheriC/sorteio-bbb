import { useState, useEffect } from 'react'
import AddParticipantModal from './AddParticipantModal'
import { play } from '../audio/audioManager'

const STORAGE_KEY = 'bbb-participants-v1'

function SelectionScreen({ onStart }) {
  const [participants, setParticipants] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participants))
  }, [participants])

  const toggleParticipant = (id) => {
    const participant = participants.find((p) => p.id === id)
    play(participant?.active ? 'toggle-off' : 'toggle-on')
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    )
  }

  const addParticipant = (participant) => {
    setParticipants((prev) => [
      ...prev,
      { ...participant, id: Date.now().toString(), active: true },
    ])
    setShowModal(false)
  }

  const removeParticipant = (id) => {
    if (!confirm('Remover este participante?')) return
    setParticipants((prev) => prev.filter((p) => p.id !== id))
  }

  const activeParticipants = participants.filter((p) => p.active)

  return (
    <div className="selection-screen">
      <header className="selection-header">
        <h1>PROVA DO LÍDER</h1>
        <p>Selecione os participantes desta semana</p>
      </header>

      <div className="participants-grid">
        {participants.map((p, i) => (
          <div
            key={p.id}
            className={`participant-card ${p.active ? 'active' : 'inactive'}`}
          >
            <div className="card-photo-wrap" onClick={() => toggleParticipant(p.id)}>
              <img
                src={p.photo}
                alt={p.name}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=1a1a1a&color=c9a84c&bold=true&size=200`
                }}
              />
              {!p.active && (
                <div className="inactive-overlay">
                  <span className="inactive-badge">FORA</span>
                </div>
              )}
            </div>

            <div className="card-info">
              <span className="card-name">{p.name}</span>
              <span className="card-profession">{p.profession}</span>
            </div>

            <div className="card-actions">
              <button
                className={`toggle-btn ${p.active ? 'active' : 'inactive'}`}
                onClick={() => toggleParticipant(p.id)}
              >
                {p.active ? 'NA PROVA' : 'FORA'}
              </button>
              <button className="remove-btn" onClick={() => removeParticipant(p.id)}>
                ×
              </button>
            </div>
          </div>
        ))}

        <button className="add-card" onClick={() => setShowModal(true)}>
          <span className="plus-icon">+</span>
          <span>Adicionar Brother</span>
        </button>
      </div>

      <div className="action-bar">
        <span className="active-count">
          <span>{activeParticipants.length}</span> na prova
        </span>
        <button
          className="start-btn"
          disabled={activeParticipants.length < 2}
          onClick={() => onStart(activeParticipants)}
        >
          INICIAR PROVA
        </button>
      </div>

      {showModal && (
        <AddParticipantModal onAdd={addParticipant} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}

export default SelectionScreen
