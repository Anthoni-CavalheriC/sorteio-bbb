import { useState } from 'react'

function AddParticipantModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [profession, setProfession] = useState('')
  const [photo, setPhoto] = useState('')
  const [pronoun, setPronoun] = useState('m')

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !profession.trim()) return
    onAdd({
      name: name.trim(),
      profession: profession.trim(),
      pronoun,
      photo:
        photo ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a1a&color=c9a84c&bold=true&size=200`,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>NOVO BROTHER</h2>

        <form onSubmit={handleSubmit}>
          <div className="modal-photo-area">
            <div className="photo-preview-circle">
              {photo ? <img src={photo} alt="preview" /> : <span>📷</span>}
            </div>
            <label className="upload-label">
              {photo ? 'Trocar foto' : 'Adicionar foto'}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          <input
            type="text"
            placeholder="Profissão"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            required
          />

          <div className="pronoun-selector">
            <span className="pronoun-label">Pronome</span>
            <div className="pronoun-options">
              <button
                type="button"
                className={`pronoun-btn ${pronoun === 'm' ? 'selected' : ''}`}
                onClick={() => setPronoun('m')}
              >
                Masculino
              </button>
              <button
                type="button"
                className={`pronoun-btn ${pronoun === 'f' ? 'selected' : ''}`}
                onClick={() => setPronoun('f')}
              >
                Feminino
              </button>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-add"
              disabled={!name.trim() || !profession.trim()}
            >
              ADICIONAR
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddParticipantModal
