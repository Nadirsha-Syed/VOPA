export default function Modal({ isOpen, title, onClose, children, size = 'md' }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-card ${size}`} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  )
}
