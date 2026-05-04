import { useState, useRef } from 'react'

function ProvasModal({ onStart, onClose }) {
  const [provas, setProvas] = useState([])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  const addProva = () => {
    const val = input.trim()
    if (!val) return
    setProvas((prev) => [...prev, val])
    setInput('')
    inputRef.current?.focus()
  }

  const removeProva = (index) => {
    setProvas((prev) => prev.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addProva()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal provas-modal" onClick={(e) => e.stopPropagation()}>
        <h2>PROVAS DA SEMANA</h2>
        <p className="provas-subtitle">Adicione as provas que serão disputadas</p>

        <div className="provas-input-row">
          <input
            ref={inputRef}
            type="text"
            placeholder="Nome da prova (ex: Resistência)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button
            type="button"
            className="btn-add-prova"
            onClick={addProva}
            disabled={!input.trim()}
          >
            +
          </button>
        </div>

        <ul className="provas-list">
          {provas.length === 0 && (
            <li className="provas-empty">Nenhuma prova adicionada ainda</li>
          )}
          {provas.map((p, i) => (
            <li key={i} className="prova-item">
              <span className="prova-number">{String(i + 1).padStart(2, '0')}</span>
              <span className="prova-name">{p}</span>
              <button className="prova-remove" onClick={() => removeProva(i)}>×</button>
            </li>
          ))}
        </ul>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Voltar
          </button>
          <button
            className="btn-add"
            disabled={provas.length === 0}
            onClick={() => onStart(provas)}
          >
            COMEÇAR
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProvasModal
