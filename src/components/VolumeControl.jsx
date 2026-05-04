import { useState } from 'react'
import { setBgVolume, getBgVolume, setSfxVolume, getSfxVolume } from '../audio/audioManager'

function VolumeControl() {
  const [open, setOpen] = useState(false)
  const [bgVol, setBgVol] = useState(getBgVolume())
  const [sfxVol, setSfxVol] = useState(getSfxVolume())

  const handleBg = (e) => {
    const vol = parseFloat(e.target.value)
    setBgVol(vol)
    setBgVolume(vol)
  }

  const handleSfx = (e) => {
    const vol = parseFloat(e.target.value)
    setSfxVol(vol)
    setSfxVolume(vol)
  }

  const bgIcon = bgVol === 0 ? '🔇' : bgVol < 0.4 ? '🔉' : '🔊'

  return (
    <div className="volume-control">
      {open && (
        <div className="volume-slider-wrap">
          <div className="volume-row">
            <span className="volume-row-label">🎵</span>
            <input
              type="range"
              min="0" max="1" step="0.05"
              value={bgVol}
              onChange={handleBg}
              className="volume-slider"
            />
            <span className="volume-pct">{Math.round(bgVol * 100)}%</span>
          </div>
          <div className="volume-divider" />
          <div className="volume-row">
            <span className="volume-row-label">💥</span>
            <input
              type="range"
              min="0" max="1" step="0.05"
              value={sfxVol}
              onChange={handleSfx}
              className="volume-slider"
            />
            <span className="volume-pct">{Math.round(sfxVol * 100)}%</span>
          </div>
        </div>
      )}
      <button
        className="volume-btn"
        onClick={() => setOpen((o) => !o)}
        title="Volume"
      >
        {bgIcon}
      </button>
    </div>
  )
}

export default VolumeControl
