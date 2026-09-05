export default function ProgressBar({ value, label }) {
  return (
    <div className="progress-block">
      {label ? <span>{label}</span> : null}
      <div className="progress-track" aria-label={label || 'progress'}>
        <div className="progress-fill" style={{ width: `${Math.max(0, Math.min(value, 100))}%` }} />
      </div>
    </div>
  )
}
