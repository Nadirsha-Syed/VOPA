export default function AudioPlayer({ transcript = 'Audio preview placeholder for reading practice.' }) {
  return (
    <div className="audio-player">
      <div className="audio-player-top">
        <span className="audio-wave" aria-hidden="true">◉◉◉</span>
        <strong>Audio Preview</strong>
      </div>
      <div className="audio-controls">
        <button type="button" className="audio-button">Play</button>
        <div className="audio-progress">
          <span style={{ width: '62%' }} />
        </div>
      </div>
      <p>{transcript}</p>
    </div>
  )
}
