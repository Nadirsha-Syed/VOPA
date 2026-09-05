export default function Topbar({ title, subtitle, actions, mobileMenuButton }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        {mobileMenuButton}
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      {actions ? <div className="topbar-actions">{actions}</div> : null}
    </header>
  )
}
