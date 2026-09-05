export default function StatCard({ label, value, change }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <div className="stat-row">
        <strong>{value}</strong>
      </div>
      <small>{change}</small>
    </div>
  )
}
